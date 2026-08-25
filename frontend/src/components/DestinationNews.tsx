'use client';
import Image from 'next/image';

import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, CalendarDays, Building2 } from 'lucide-react';

interface NewsArticle {
  url: string;
  title: string;
  description: string;
  image?: string;
  source?: { name?: string; url?: string };
  publishedAt?: string;
}

interface DestinationNewsProps {
  slug: string;
  name: string;
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function DestinationNews({ slug, name }: DestinationNewsProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/public/destinations/${slug}/news`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (active) setArticles(data.articles || []);
      })
      .catch(() => {
        if (active) setArticles([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <section style={{ padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Newspaper size={22} color="#0ea5e9" />
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Latest News & Updates
            </h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '28px' }}>
            Loading the latest stories about {name}...
          </p>
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section style={{ padding: '64px 0', borderTop: '1px solid #f1f5f9' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Newspaper size={22} color="#0ea5e9" />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Latest News & Updates
          </h2>
        </div>
        <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '28px' }}>
          What's happening in {name} right now.
        </p>

        <div className="mobile-slider-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {articles.map((article, idx) => (
            <a
              key={article.url || idx}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div className="card-panel" style={{
                borderRadius: '16px', overflow: 'hidden', position: 'relative',
                display: 'flex', flexDirection: 'column', height: '100%', minHeight: '360px',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <div style={{ height: '180px', position: 'relative', background: '#f1f5f9', flexShrink: 0 }}>
                  {article.image ? (
                    <Image width={800} height={600} 
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.currentTarget.style.display = 'none'); }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
                      <Newspaper size={40} color="#ffffff" opacity={0.7} />
                    </div>
                  )}
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', fontSize: '0.78rem', color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Building2 size={12} /> {article.source?.name || 'Travel News'}
                    </span>
                    {article.publishedAt && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', marginLeft: 'auto' }}>
                        <CalendarDays size={12} /> {formatDate(article.publishedAt)}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4 }}>
                    {article.title}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, margin: 0, flex: 1 }}>
                    {article.description || 'Read the full story to learn more.'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', color: '#0284c7', fontSize: '0.85rem', fontWeight: 700 }}>
                    Read More <ExternalLink size={14} />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}