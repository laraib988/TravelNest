'use client';

import { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { Heart, Star, MapPin, Compass } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, formatPrice } = useCurrency();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      try {
        const res = await fetch('/api/public/listings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setListings(data);
        }
      } catch (err) {
        console.error('Error loading wishlist items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadListings();
  }, []);

  const wishlistItems = listings.filter((item) => wishlist.includes(item.id));

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 800, color: '#0f172a' }}>Saved Experiences</h1>
        <p style={{ color: '#475569', marginBottom: '40px' }}>Your curated wishlist of dream destinations and activities.</p>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <Compass size={40} className="animate-spin" style={{ color: 'var(--brand-primary)' }} />
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="card-panel" style={{ padding: '80px', textAlign: 'center', borderRadius: '24px' }}>
            <Compass size={64} color="#94a3b8" style={{ margin: '0 auto 24px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#0f172a' }}>Your wishlist is empty</h3>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>Save your favorite tours and activities to easily find them later.</p>
            <Link href="/" className="btn-primary" style={{ padding: '12px 32px' }}>
              Start Exploring
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {wishlistItems.map((item) => (
              <div key={item.id} className="card-panel card-interactive" style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <button 
                  onClick={() => toggleWishlist(item.id)} 
                  style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: 'var(--shadow-sm)' }}
                >
                  <Heart size={18} color="#e11d48" fill="#e11d48" />
                </button>
                <img src={item.images?.[0]?.url} alt={item.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                      <Star size={14} fill="#d97706" /> {item.cached_rating_avg || 5} <span style={{ color: '#64748b', fontWeight: 400 }}>({item.cached_review_count || 120} reviews)</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', lineHeight: 1.35, color: '#0f172a', fontWeight: 700 }}>{item.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--brand-primary)', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 600 }}>
                      <MapPin size={14} /> {item.pickup_location}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>From </span>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{formatPrice(item.base_price)}</span>
                    </div>
                    <Link href={`/tours/${item.slug}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none' }}>
                      Book Slots
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
