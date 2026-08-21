import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

// ============================================================================
// TravelNest · Daily Travel Blog Engine
// Generates publication-ready, SEO-optimized travel articles via Groq,
// then persists them to Supabase as DRAFTS (never auto-published).
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configurable model. The spec asked for llama-3.3-70b-versatile, but that
// model is not provisioned on this account — openai/gpt-oss-120b is the
// highest-quality available model. Override via GROQ_BLOG_MODEL env.
const MODEL = process.env.GROQ_BLOG_MODEL || 'openai/gpt-oss-120b';
const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

let groq: Groq | null = null;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

// --- Rotating destination focus (Japan + global) --------------------------
interface DestinationTopic {
  name: string;
  country: string;
  internalLinks: string[];
  externalLinks: string[];
  heroImage: string;
  heroAlt: string;
  sampleItinerary: { day: string; title: string; activities: string[] }[];
}

const DESTINATION_TOPICS: DestinationTopic[] = [
  {
    name: 'Tokyo',
    country: 'Japan',
    internalLinks: ['/destinations/tokyo', '/community', '/ai-planner', '/tours'],
    externalLinks: ['https://www.japan.travel', 'https://www.tokyometro.jp/en/', 'https://www.jreast.co.jp/e/'],
    heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
    heroAlt: 'Tokyo skyline at dusk with neon lights and the Tokyo Tower in the background',
    sampleItinerary: [
      { day: 'Day 1', title: 'Arrival & Neon Central Tokyo', activities: ['Check into Shibuya or Shinjuku hotel', 'Shibuya Crossing & Hachiko statue', 'Golden Gai izakaya dinner'] },
      { day: 'Day 2', title: 'Culture & Temples', activities: ['Senso-ji Temple at Asakusa', 'Meiji Shrine & Harajuku', 'TeamLab Planets in the evening'] },
      { day: 'Day 3', title: 'Markets & Panoramic Views', activities: ['Toyosu Market sushi breakfast', 'Tokyo Skytree or Metropolitan Building', 'Omoide Yokocho yakitori'] },
    ],
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    internalLinks: ['/destinations/tokyo', '/community', '/ai-planner', '/tours'],
    externalLinks: ['https://www.japan.travel', 'https://www.kyotostation.com/', 'https://www2.city.kyoto.lg.jp/koho/eng/'],
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
    heroAlt: 'The golden Kinkaku-ji temple in Kyoto surrounded by autumn maple trees',
    sampleItinerary: [
      { day: 'Day 1', title: 'Eastern Kyoto Temples', activities: ['Fushimi Inari Taisha early morning', 'Kiyomizu-dera & Higashiyama streets', 'Gion district geisha spotting'] },
      { day: 'Day 2', title: 'Arashiyama Bamboo & Riverside', activities: ['Arashiyama Bamboo Grove', 'Tenryu-ji temple gardens', 'Katsura River boat ride'] },
      { day: 'Day 3', title: 'North Kyoto Highlights', activities: ['Kinkaku-ji golden pavilion', 'Ryoan-ji rock garden', 'Nishiki Market food crawl'] },
    ],
  },
  {
    name: 'Mount Fuji',
    country: 'Japan',
    internalLinks: ['/destinations/mount-fuji-japan', '/community', '/ai-planner', '/tours'],
    externalLinks: ['https://www.japan.travel', 'https://www.fujisan3776.com/english/', 'https://www.jreast.co.jp/e/'],
    heroImage: 'https://images.unsplash.com/photo-1570459027562-4a916cc6113f?auto=format&fit=crop&w=1600&q=80',
    heroAlt: 'Mount Fuji reflected perfectly in Lake Kawaguchi on a clear winter morning',
    sampleItinerary: [
      { day: 'Day 1', title: 'Five Lakes Region', activities: ['Lake Kawaguchi viewpoints', 'Oshino Hakkai springs', 'Fuji Shibazakura (seasonal)'] },
      { day: 'Day 2', title: 'Hakone Loop', activities: ['Hakone Ropeway over Owakudani', 'Lake Ashi pirate cruise', 'Hakone Shrine torii gate'] },
      { day: 'Day 3', title: 'Summit Day (Climbing Season)', activities: ['Kawaguchiko 5th Station start', 'Sunrise at the summit', 'Descent & onsen recovery'] },
    ],
  },
  {
    name: 'Osaka',
    country: 'Japan',
    internalLinks: ['/destinations/tokyo', '/community', '/ai-planner', '/tours'],
    externalLinks: ['https://www.japan.travel', 'https://www.osakastation.com/', 'https://www.jr-odekake.net/'],
    heroImage: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1600&q=80',
    heroAlt: 'Dotonbori street at night glowing with neon signs in Osaka Japan',
    sampleItinerary: [
      { day: 'Day 1', title: 'Dotonbori Food Crawl', activities: ['Dotonbori canal & neon lights', 'Takoyaki and okonomiyaki', 'Kuromon Ichiba market'] },
      { day: 'Day 2', title: 'Castle & Shinsaibashi', activities: ['Osaka Castle grounds', 'Shinsaibashi shopping arcade', 'Umeda Sky Building sunset'] },
      { day: 'Day 3', title: 'Universal Studios or Nara Day Trip', activities: ['Universal Studios Japan', 'Nara deer park & Todai-ji', 'Evening in Shinsekai'] },
    ],
  },
  {
    name: 'Hokkaido',
    country: 'Japan',
    internalLinks: ['/destinations/tokyo', '/community', '/ai-planner', '/tours'],
    externalLinks: ['https://www.japan.travel', 'https://www.welcome-sapporo.jp/', 'https://www.snowjapan.com/'],
    heroImage: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1600&q=80',
    heroAlt: 'Snow-covered Sapporo in winter with the TV Tower visible over Odori Park',
    sampleItinerary: [
      { day: 'Day 1', title: 'Sapporo City Highlights', activities: ['Odori Park & TV Tower', 'Sapporo Clock Tower & beer museum', 'Susukino district ramen'] },
      { day: 'Day 2', title: 'Skiing & Snow Festival', activities: ['Niseko or Furano slopes', 'Sapporo Snow Festival (Feb)', 'Onsen evening soak'] },
      { day: 'Day 3', title: 'Otaru Day Trip', activities: ['Otaru Canal & glass workshops', 'Hokkaido seafood market', 'Music box hall'] },
    ],
  },
  {
    name: 'Hakone',
    country: 'Japan',
    internalLinks: ['/destinations/tokyo', '/destinations/mount-fuji-japan', '/community', '/tours'],
    externalLinks: ['https://www.japan.travel', 'https://www.hakonenavi.jp/', 'https://www.hakone.or.jp/'],
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
    heroAlt: 'Lake Ashi in Hakone with Mount Fuji and the red torii gate of Hakone Shrine',
    sampleItinerary: [
      { day: 'Day 1', title: 'Hakone Open-Air Museum', activities: ['Open-Air Museum sculptures', 'Hakone Yumoto onsen town', 'Ryokan kaiseki dinner'] },
      { day: 'Day 2', title: 'The Hakone Loop', activities: ['Hakone Ropeway & Owakudani', 'Lake Ashi cruise', 'Hakone Shrine'] },
      { day: 'Day 3', title: 'Fuji Views & Relaxation', activities: ['Moto-Hakone viewpoints', 'Private onsen soak', 'Return to Tokyo'] },
    ],
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    internalLinks: ['/destinations/bali', '/community', '/ai-planner', '/tours'],
    externalLinks: ['https://www.indonesia.travel', 'https://www.balitourismboard.org/', 'https://www.garuda-indonesia.com/'],
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
    heroAlt: 'Terraced rice fields and palm trees of Ubud in Bali at golden hour',
    sampleItinerary: [
      { day: 'Day 1', title: 'Seminyak & Canggu', activities: ['Beach clubs & sunset cocktails', 'Seminyak boutiques', 'Canggu surf check'] },
      { day: 'Day 2', title: 'Ubud Culture Day', activities: ['Tegalalang rice terraces', 'Ubud Monkey Forest', 'Sacred Monkey Forest & temple'] },
      { day: 'Day 3', title: 'Temples & Waterfalls', activities: ['Tirta Empul temple', 'Nungnung waterfall', 'Uluwatu cliff temple sunset'] },
    ],
  },
  {
    name: 'Paris',
    country: 'France',
    internalLinks: ['/destinations/paris', '/community', '/ai-planner', '/tours'],
    externalLinks: ['https://france.fr', 'https://www.ratp.fr/en', 'https://www.parisinfo.com/'],
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
    heroAlt: 'The Eiffel Tower seen from the Trocadero at blue hour in Paris',
    sampleItinerary: [
      { day: 'Day 1', title: 'The Classics', activities: ['Eiffel Tower summit', 'Champs-Élysées & Arc de Triomphe', 'Seine evening cruise'] },
      { day: 'Day 2', title: 'Museums & Marais', activities: ['Louvre highlights', 'Le Marais cafes & boutiques', 'Notre-Dame & Île de la Cité'] },
      { day: 'Day 3', title: 'Montmartre & Palaces', activities: ['Sacré-Cœur & artist square', 'Palace of Versailles half-day', 'Latin Quarter dinner'] },
    ],
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    internalLinks: ['/destinations/dubai', '/community', '/ai-planner', '/tours'],
    externalLinks: ['https://www.visitdubai.com', 'https://www.dubaiairports.co.ae/', 'https://www.rta.ae/'],
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
    heroAlt: 'Dubai skyline at sunset with the Burj Khalifa towering over the marina',
    sampleItinerary: [
      { day: 'Day 1', title: 'Downtown Dubai', activities: ['Burj Khalifa observation deck', 'Dubai Mall & fountain show', 'Souk Al Bahar dinner'] },
      { day: 'Day 2', title: 'Desert Adventure', activities: ['Morning dune bashing', 'Camel ride & desert camp', 'BBQ dinner under the stars'] },
      { day: 'Day 3', title: 'Marina & Old Dubai', activities: ['Dubai Marina walk & yacht', 'Al Fahidi historic district', 'Abra ride across Dubai Creek'] },
    ],
  },
];

const SLUGIFY = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function pickTopic(): DestinationTopic {
  return DESTINATION_TOPICS[Math.floor(Math.random() * DESTINATION_TOPICS.length)];
}

// --- Unsplash fallback gallery for in-article images -----------------------
const UNSPLASH_POOL = [
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526481280691-3bf62d4e6de1?auto=format&fit=crop&w=1200&q=80',
];

interface BlogArticle {
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  focus_keywords: string[];
  summary: string;
  content_markdown: string;
  hero_image: string;
  hero_image_alt: string;
  images: { url: string; alt: string }[];
  author_name: string;
  author_bio: string;
  author_avatar: string;
  author_role: string;
  author_url: string;
  schema_json: string;
  faq_schema_json: string;
  faqs: { question: string; answer: string }[];
  quick_takeaways: string[];
  itinerary: { day: string; title: string; activities: string[] }[];
  cost_breakdown: { item: string; cost: string }[];
  best_time_to_visit: { month: string; rating: string; note: string }[];
  status: 'draft';
}

// --- Author profiles (rotating editorial authors) --------------------------
const AUTHORS = [
  {
    name: 'Elena Rostova',
    bio: 'Elena is a Tokyo-based travel journalist with 8 years covering Japanese rail culture, ryokans, and off-the-beaten-path temples.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    role: 'Senior Japan Travel Editor',
    url: `${APP_URL}/blog`,
  },
  {
    name: 'Kenji Sato',
    bio: 'Kenji is a licensed tour guide and food writer who has personally eaten his way through every one of Japan’s 47 prefectures.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    role: 'Local Food & Culture Expert',
    url: `${APP_URL}/blog`,
  },
  {
    name: 'Aisha Malik',
    bio: 'Aisha specializes in family travel and Southeast Asian island hopping, balancing luxury stays with budget backpacking tips.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    role: 'Global Adventure Editor',
    url: `${APP_URL}/blog`,
  },
];

// --- Markdown helpers -------------------------------------------------------
function escapeJson(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildArticleSchema(article: BlogArticle) {
  const isoDate = new Date().toISOString();
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.meta_description,
    image: article.hero_image,
    datePublished: isoDate,
    dateModified: isoDate,
    author: {
      '@type': 'Person',
      name: article.author_name,
      description: article.author_bio,
      image: article.author_avatar,
      jobTitle: article.author_role,
      url: article.author_url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TravelNest',
      logo: { '@type': 'ImageObject', url: `${APP_URL}/logo.png` },
    },
    mainEntityOfPage: `${APP_URL}/blog/${article.slug}`,
    keywords: article.focus_keywords.join(', '),
    wordCount: article.content_markdown.split(/\s+/).length,
    articleSection: 'Travel Guides',
    inLanguage: 'en',
  };
}

function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

// Extract "## FAQs" content from the generated markdown so the FAQPage schema
// mirrors what actually appears in the article body. Supports both bullet
// ("- **Q?** Answer") and bold-paragraph ("**Q?**\nAnswer") formats.
function extractFaqsFromMarkdown(markdown: string): { question: string; answer: string }[] {
  const faqSection = markdown.split(/^##\s+FAQs?/im)[1];
  if (!faqSection) return [];

  const faqs: { question: string; answer: string }[] = [];
  // Bullet format: `- **Question?** Answer on same line`.
  const bulletRe = /^\s*[-*]\s+\*\*(.+?)\*\*\s*(.*)$/gm;
  let match: RegExpExecArray | null;
  while ((match = bulletRe.exec(faqSection))) {
    faqs.push({ question: match[1].trim(), answer: match[2].trim() });
  }
  // Bold-paragraph format: `**Question?**` immediately followed by an answer
  // paragraph on the next line(s).
  if (faqs.length === 0) {
    const blockRe = /\*\*(.+?)\*\*[\r\n]+([^\n]+)/g;
    while ((match = blockRe.exec(faqSection))) {
      const question = match[1].trim();
      const answer = match[2].trim();
      if (question && answer) {
        faqs.push({ question, answer });
      }
    }
  }
  return faqs;
}

// --- Prompt builder ---------------------------------------------------------
function buildPrompt(topic: DestinationTopic, author: { name: string; role: string }) {
  const internalLinks = topic.internalLinks
    .map((l) => `- ${APP_URL}${l}`)
    .join('\n');
  const externalLinks = topic.externalLinks
    .map((l) => `- ${l}`)
    .join('\n');

  return `You are a senior travel SEO editor writing for TravelNest, a global tour marketplace.
Write a complete, publication-ready travel article about **${topic.name}, ${topic.country}**.
Byline author: ${author.name} (${author.role}).

STRICT LENGTH: 1,800 to 2,200 words.

# SEO REQUIREMENTS
- Title: click-worthy, 55-60 characters max.
- Meta description: 150-155 characters max.
- Focus keywords: 5-8 keywords (e.g. "${topic.name} travel guide 2026", "things to do in ${topic.name}", "best time to visit ${topic.name}").
- Include a summary paragraph (2-3 sentences) for the card/listing.

# REQUIRED ARTICLE STRUCTURE (markdown)
1. ## Quick Takeaways — a short bulleted box of 4-5 key points.
2. ## Why Visit ${topic.name} — intro sections with H3 subsections.
3. ## Best Time to Visit ${topic.name} — include a markdown table with months/season columns.
4. ## Step-by-Step 3-Day Itinerary — H3 for each day with detailed bulleted activities.
5. ## Cost Breakdown — a markdown table (item | estimated cost in USD).
6. ## Local Etiquette & Transit Tips — practical, authentic advice with H3 subsections.
7. ## FAQs — exactly 4 questions with detailed 2-3 sentence answers.

# INTERNAL LINKS
Weave these TravelNest links naturally into the prose (use markdown links):
${internalLinks}

# EXTERNAL LINKS
Include 2-3 high-authority external references naturally:
${externalLinks}

# VISUALS
Return an "images" array with 3 Unsplash URLs (use the topic hero image as the first) plus a descriptive "alt" text for each.

# FORMAT
Return ONLY valid JSON — no markdown fences, no commentary. Use this exact shape:
{
  "title": "...",
  "meta_title": "...",
  "meta_description": "...",
  "focus_keywords": ["..."],
  "summary": "...",
  "content_markdown": "FULL MARKDOWN ARTICLE with all sections above",
  "hero_image": "${topic.heroImage}",
  "hero_image_alt": "${topic.heroAlt}",
  "images": [{ "url": "...", "alt": "..." }],
  "quick_takeaways": ["...", "..."],
  "itinerary": [{ "day": "Day 1", "title": "...", "activities": ["..."] }],
  "cost_breakdown": [{ "item": "...", "cost": "..." }],
  "best_time_to_visit": [{ "month": "...", "rating": "...", "note": "..." }],
  "faqs": [{ "question": "...", "answer": "..." }]
}`;
}

// --- Main entry: generate one article and persist as draft -----------------
export async function generateDailyBlog(): Promise<{ success: boolean; blog?: any; error?: string }> {
  if (!groq) {
    return { success: false, error: 'GROQ_API_KEY not configured' };
  }

  const topic = pickTopic();
  const author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a meticulous travel SEO editor. You always respond with valid, minified JSON only.',
        },
        { role: 'user', content: buildPrompt(topic, author) },
      ],
      model: MODEL,
      temperature: 0.8,
      max_tokens: 6000, // Total per-request ≈6.8k tokens — under the 8k free-tier TPM cap.
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content || '';
    const parsed = JSON.parse(raw);

    const contentMarkdown = String(parsed.content_markdown || '');
    if (contentMarkdown.split(/\s+/).length < 300) {
      return { success: false, error: 'Generated article too short — likely model truncation. Retry.' };
    }

    const title = String(parsed.title || `${topic.name} Travel Guide 2026`);
    const slug = SLUGIFY(title);

    // Ensure unique slug in DB.
    const { data: existing } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const faqs =
      extractFaqsFromMarkdown(contentMarkdown).length >= 4
        ? extractFaqsFromMarkdown(contentMarkdown).slice(0, 6)
        : Array.isArray(parsed.faqs) && parsed.faqs.length >= 4
          ? parsed.faqs.slice(0, 6)
          : [
              {
                question: `What is the best time to visit ${topic.name}?`,
                answer:
                  'The best months are the shoulder seasons, offering mild weather and fewer crowds.',
              },
            ];

    const article: BlogArticle = {
      title,
      slug: finalSlug,
      meta_title: String(parsed.meta_title || title).slice(0, 60),
      meta_description: String(parsed.meta_description || parsed.summary || '').slice(0, 160),
      focus_keywords: Array.isArray(parsed.focus_keywords) ? parsed.focus_keywords.slice(0, 8) : [`${topic.name} travel guide`],
      summary: String(parsed.summary || contentMarkdown.slice(0, 180)),
      content_markdown: contentMarkdown,
      hero_image: String(parsed.hero_image || topic.heroImage),
      hero_image_alt: String(parsed.hero_image_alt || topic.heroAlt),
      images: Array.isArray(parsed.images) && parsed.images.length > 0
        ? parsed.images.slice(0, 3).map((img: any) => ({ url: String(img.url), alt: String(img.alt || topic.heroAlt) }))
        : [{ url: topic.heroImage, alt: topic.heroAlt }],
      author_name: author.name,
      author_bio: author.bio,
      author_avatar: author.avatar,
      author_role: author.role,
      author_url: author.url,
      schema_json: '{}',
      faq_schema_json: JSON.stringify(buildFaqSchema(faqs)),
      faqs,
      quick_takeaways: Array.isArray(parsed.quick_takeaways) ? parsed.quick_takeaways : [],
      itinerary: Array.isArray(parsed.itinerary) ? parsed.itinerary : topic.sampleItinerary,
      cost_breakdown: Array.isArray(parsed.cost_breakdown) ? parsed.cost_breakdown : [],
      best_time_to_visit: Array.isArray(parsed.best_time_to_visit) ? parsed.best_time_to_visit : [],
      status: 'draft',
    };

    // Build article schema after slug is finalised.
    article.schema_json = JSON.stringify(buildArticleSchema(article));

    const { data: inserted, error } = await supabase
      .from('blogs')
      .insert(article)
      .select()
      .single();

    if (error) throw error;

    return { success: true, blog: inserted };
  } catch (error: any) {
    console.error('[blogGenerator] Failed to generate blog:', error);
    return { success: false, error: error?.message || 'Blog generation failed' };
  }
}