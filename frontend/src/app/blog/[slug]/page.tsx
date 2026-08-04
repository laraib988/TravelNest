'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchFromAPI } from '@/lib/api-client';
import { FileText, Sparkles, RefreshCw, Star, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [listing, setListing] = useState<any>(null);
  const [revalidating, setRevalidating] = useState(false);
  const [revalidatedMsg, setRevalidatedMsg] = useState('');

  useEffect(() => {
    async function loadEmbeddedWidgetData() {
      try {
        const res = await fetchFromAPI('/listings/luxury-bali-sunset-catamaran-cruise');
        setListing(res);
      } catch (err) {
        console.error('Error fetching widget listing:', err);
      }
    }
    loadEmbeddedWidgetData();
  }, []);

  const handleTriggerISR = async () => {
    setRevalidating(true);
    setRevalidatedMsg('');
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-revalidate-secret': 'travelnest_secret_token_123',
        },
        body: JSON.stringify({ paths: [`/blog/${slug}`, '/tours/luxury-bali-sunset-catamaran-cruise'] }),
      });
      const data = await res.json();
      setRevalidatedMsg(`Path revalidated successfully at ${new Date(data.now).toLocaleTimeString()} via Next.js revalidatePath()!`);
    } catch (err: any) {
      setRevalidatedMsg('ISR Revalidation Error: ' + err.message);
    } finally {
      setRevalidating(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 24px', background: '#ffffff' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Return to Storefront
      </Link>

      <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '40px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
        <div className="badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <FileText size={14} /> Feature #6: SEO Blog ↔ Live Marketplace Integration
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', lineHeight: 1.2, color: '#0f172a' }}>
          Ultimate 2026 Guide to Sunset Catamaran Cruises & Culinary Nights in Bali
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0', marginBottom: '32px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <span>By TravelNest Editorial Team • Published August 2026</span>
          <button onClick={handleTriggerISR} disabled={revalidating} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            {revalidating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />} Trigger On-Demand ISR
          </button>
        </div>

        {revalidatedMsg && (
          <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: '#d1fae5', color: '#047857', fontSize: '0.85rem', marginBottom: '24px' }}>
            {revalidatedMsg}
          </div>
        )}

        <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#334155', marginBottom: '40px' }}>
          <p style={{ marginBottom: '20px' }}>
            Bali remains one of the world's premier tropical destinations. When visiting the southern coast around Benoa Harbour and Nusa Dua, taking a luxury dual-hull catamaran sunset cruise is an absolute must-do experience.
          </p>
          <p style={{ marginBottom: '24px' }}>
            Below is our top editorially verified marketplace experience. The widget below hydrates live prices, availability slots, and review scores directly from the NestJS PostgreSQL database:
          </p>

          {/* EMBEDDED LIVE MARKETPLACE WIDGET */}
          {listing ? (
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', padding: '24px', background: '#f0f9ff', border: '1px solid #7dd3fc', marginBottom: '32px' }}>
              <div className="badge-emerald" style={{ display: 'inline-flex', marginBottom: '12px' }}>
                Live Marketplace Data Card
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'center' }}>
                <img src={listing.images[0]?.url} alt={listing.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: '#0f172a' }}>{listing.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} color="#d97706" fill="#d97706" /> {listing.cached_rating_avg} ({listing.cached_review_count})</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={14} color="#059669" /> Verified</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                      ${listing.base_price} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ person</span>
                    </div>
                    <Link href={`/tours/${listing.slug}`} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      Reserve Ticket <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading embedded marketplace widget...</div>
          )}

          <p>
            Whether you choose to dance to live acoustic music or savor grilled local seafood under the stars, this experience provides an unbeatable highlight to any Bali itinerary.
          </p>
        </div>
      </div>
    </div>
  );
}
