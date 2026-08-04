'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchFromAPI } from '@/lib/api-client';
import { MapPin, Star, Clock, FileText, ArrowRight } from 'lucide-react';

export default function DestinationHubPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [hubData, setHubData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHub() {
      try {
        const res = await fetchFromAPI(`/listings/destinations/${slug}`);
        setHubData(res);
      } catch (err) {
        console.error('Error loading destination hub:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHub();
  }, [slug]);

  if (loading) {
    return <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Destination Hub...</div>;
  }

  if (!hubData || !hubData.destination) {
    return <div style={{ padding: '100px', textAlign: 'center', color: 'var(--brand-accent)' }}>Destination Hub not found.</div>;
  }

  const { destination, top_listings, recent_blogs } = hubData;

  return (
    <div style={{ paddingBottom: '60px', background: '#ffffff' }}>
      {/* DESTINATION HERO */}
      <section style={{ position: 'relative', height: '380px', overflow: 'hidden' }}>
        <img src={destination.hero_image} alt={destination.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85), transparent)' }} />
        <div style={{ position: 'absolute', bottom: '40px', left: '0', right: '0', maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div className="badge-emerald" style={{ display: 'inline-flex', marginBottom: '12px' }}>
            Auto-Aggregated SEO Landing Hub • ISR 1800s
          </div>
          <h1 style={{ fontSize: '3.2rem', marginBottom: '8px', color: '#fff' }}>{destination.name}</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '700px' }}>{destination.description}</p>
        </div>
      </section>

      {/* TWO SECTIONS: TOP LISTINGS + BLOG POSTS */}
      <div style={{ maxWidth: '1280px', margin: '60px auto 0', padding: '0 24px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '24px', color: '#0f172a' }}>Top Experiences in {destination.name}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px', marginBottom: '60px' }}>
          {top_listings?.map((item: any) => (
            <div key={item.id} className="glass-panel" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid #cbd5e1' }}>
              <div style={{ height: '200px', position: 'relative' }}>
                <img src={item.images[0]?.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.92)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#0f172a', fontWeight: 600 }}>
                  <Star size={14} color="#d97706" fill="#d97706" /> {item.cached_rating_avg}
                </div>
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', color: '#0f172a' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>{item.summary}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-primary)' }}>${item.base_price} USD</div>
                  <Link href={`/tours/${item.slug}`} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    View Slot Locks
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RELATED BLOG POSTS */}
        <h2 style={{ fontSize: '2rem', marginBottom: '24px', color: '#0f172a' }}>Travel Guides & Curated Articles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {recent_blogs?.map((blog: any, i: number) => (
            <div key={i} className="glass-panel" style={{ borderRadius: 'var(--radius-md)', padding: '24px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600 }}>
                <FileText size={16} /> Strapi CMS Post
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#0f172a' }}>{blog.title}</h3>
              <Link href={`/blog/${blog.slug}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Read Article & Embedded Widgets <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
