import fs from 'fs';
import path from 'path';
import https from 'https';

/**
 * Server-side destination news service.
 *
 * Cache-aside pattern:
 *  1. Read from /data/news/[slug].json.
 *  2. If cached data exists and is < CACHE_DURATION old, return it (0 external calls).
 *  3. Otherwise fetch from GNews, merge with existing archived articles, dedupe by url,
 *     sort newest-first, and persist back to the JSON file.
 *  4. On GNews failure, fall back to cached / placeholder data without breaking render.
 */

export interface NewsArticle {
  url: string;
  title: string;
  description: string;
  image?: string;
  source?: { name?: string; url?: string };
  publishedAt?: string;
}

interface NewsCache {
  slug: string;
  name: string;
  lastUpdated: string;
  articles: NewsArticle[];
}

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const DEFAULT_ARTICLES_LIMIT = 6;

function dataDir(): string {
  return path.join(process.cwd(), 'data', 'news');
}

function cachePath(slug: string): string {
  const safe = (slug || 'destination').replace(/[^a-z0-9-_]/gi, '-');
  return path.join(dataDir(), `${safe}.json`);
}

function isFresh(cache: NewsCache | null): boolean {
  if (!cache || !cache.lastUpdated || !Array.isArray(cache.articles)) return false;
  const age = Date.now() - new Date(cache.lastUpdated).getTime();
  return age >= 0 && age < CACHE_DURATION_MS;
}

function readCache(slug: string): NewsCache | null {
  try {
    const file = cachePath(slug);
    if (!fs.existsSync(file)) return null;
    const raw = fs.readFileSync(file, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed && Array.isArray(parsed.articles) ? parsed : null;
  } catch (e) {
    console.error('[newsService] Failed to read cache:', e);
    return null;
  }
}

function writeCache(slug: string, name: string, articles: NewsArticle[]): void {
  try {
    const dir = dataDir();
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const payload: NewsCache = {
      slug,
      name,
      lastUpdated: new Date().toISOString(),
      articles,
    };
    fs.writeFileSync(cachePath(slug), JSON.stringify(payload, null, 2), 'utf-8');
  } catch (e) {
    console.error('[newsService] Failed to write cache:', e);
  }
}

function mergeAndDedupe(existing: NewsArticle[], fresh: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  const combined: NewsArticle[] = [];

  for (const article of [...fresh, ...existing]) {
    if (!article || typeof article.url !== 'string') continue;
    const key = article.url.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    combined.push(article);
  }

  combined.sort((a, b) => {
    const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return tb - ta;
  });

  return combined;
}

function fetchGNews(query: string, apiKey: string, limit = DEFAULT_ARTICLES_LIMIT): Promise<NewsArticle[]> {
  return new Promise((resolve) => {
    const url = new URL('https://gnews.io/api/v4/search');
    url.searchParams.set('q', query);
    url.searchParams.set('lang', 'en');
    url.searchParams.set('max', String(limit));
    url.searchParams.set('apikey', apiKey);

    const req = https.get(url.toString(), { timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          const articles: NewsArticle[] = (json.articles || []).map((a: any) => ({
            url: a.url || '',
            title: a.title || '',
            description: a.description || a.content || '',
            image: a.image || undefined,
            source: {
              name: a.source?.name || 'Travel News',
              url: a.source?.url || undefined,
            },
            publishedAt: a.publishedAt || undefined,
          }));
          resolve(articles.filter((a) => a.url && a.title));
        } catch (e) {
          console.error('[newsService] Failed to parse GNews response:', e);
          resolve([]);
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve([]);
    });
    req.on('error', (e) => {
      console.error('[newsService] GNews request failed:', e.message);
      resolve([]);
    });
  });
}

/**
 * Returns fresh news for a destination, using the cache-aside strategy.
 * Never throws — always returns an array (possibly from cache, or placeholder).
 */
export async function getDestinationNews(slug: string, name: string): Promise<NewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  const cached = readCache(slug);

  // Serve fresh cache immediately (0 external API calls).
  if (isFresh(cached)) {
    return cached!.articles;
  }

  const existing = cached?.articles || [];

  // No API key configured -> just return cache/placeholder without calling out.
  if (!apiKey) {
    if (existing.length > 0) return existing;
    return placeholderArticles(name);
  }

  // Build a clean query from the destination name.
  // Strip parenthetical parts (e.g. "Mount Fuji (Fujisan)" -> "Mount Fuji")
  // and quote the core name for a phrase match.
  const coreName = String(name || '')
    .replace(/\(.*?\)/g, '')
    .replace(/[|{}[\]<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const namePart = coreName || String(name || 'destination');

  // Try progressively simpler queries so we get real articles when possible.
  // Simple name first: quoted phrase queries on GNews' free plan often return 0
  // articles (12h real-time delay + historical removal), while the bare name
  // reliably returns recent travel stories.
  const queries = [
    namePart,
    `"${namePart}" travel OR tourism`,
    `"${namePart}" tourism`,
    `"${namePart}" travel`,
  ];

  let fresh: NewsArticle[] = [];
  for (const q of queries) {
    fresh = await fetchGNews(q, apiKey);
    if (fresh.length > 0) break;
  }

  if (fresh.length > 0) {
    const merged = mergeAndDedupe(existing, fresh);
    writeCache(slug, name, merged);
    return merged;
  }

  // GNews failed or rate-limited -> fall back to cache or placeholders.
  if (existing.length > 0) return existing;
  return placeholderArticles(name);
}

function placeholderArticles(name: string): NewsArticle[] {
  const ts = new Date().toISOString();
  const placeholders = [
    {
      title: `Top Things to Do in ${name}`,
      description: `Discover the most memorable experiences, sightseeing spots, and hidden gems across ${name}.`,
      source: { name: 'Vaitour Guide' },
      publishedAt: ts,
      url: 'https://vaitour.local/guide/things-to-do',
    },
    {
      title: `Best Time to Visit ${name} This Season`,
      description: `Plan your perfect trip to ${name} with our seasonal guide covering weather, crowds, and local highlights.`,
      source: { name: 'Vaitour Guide' },
      publishedAt: ts,
      url: 'https://vaitour.local/guide/best-time',
    },
  ];
  return placeholders;
}