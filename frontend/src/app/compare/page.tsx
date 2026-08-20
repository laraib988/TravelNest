'use client';

import { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { Search, X, Star, Clock, MapPin, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ComparePage() {
  const { formatPrice } = useCurrency();
  const [allListings, setAllListings] = useState<any[]>([]);
  const [selectedListings, setSelectedListings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      try {
        const res = await fetch('/api/public/listings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setAllListings(data);
          // Set initial two items if available for presentation
          if (data.length >= 2) {
            setSelectedListings([data[0], data[1]]);
          }
        }
      } catch (err) {
        console.error('Error loading listings for comparison:', err);
      } finally {
        setLoading(false);
      }
    }
    loadListings();
  }, []);

  const filteredDropdown = allListings.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedListings.some((s) => s.id === item.id)
  );

  const handleSelect = (item: any) => {
    if (selectedListings.length >= 3) {
      alert('You can compare a maximum of 3 products at a time.');
      return;
    }
    setSelectedListings([...selectedListings, item]);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleRemove = (id: string) => {
    setSelectedListings(selectedListings.filter((item) => item.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px 80px', fontFamily: 'var(--font-body)', color: '#0f172a' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Title */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Compare Experiences</h1>
          <p style={{ color: '#475569', fontSize: '1.05rem' }}>Select up to 3 tours or activities to compare side-by-side.</p>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: '600px', margin: '0 auto 48px', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search and add a tour to compare..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 50px',
                borderRadius: '16px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                background: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: 600,
                boxShadow: 'var(--shadow-sm)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {showDropdown && searchQuery && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', marginTop: '8px', zIndex: 100, boxShadow: 'var(--shadow-lg)', maxHeight: '280px', overflowY: 'auto' }}>
              {filteredDropdown.length === 0 ? (
                <div style={{ padding: '16px', color: '#64748b', fontSize: '0.9rem', textAlign: 'center' }}>No tours found matching "{searchQuery}"</div>
              ) : (
                filteredDropdown.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'none', border: 'none', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <img src={item.images?.[0]?.url} alt={item.title} style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.pickup_location} • {formatPrice(item.base_price)}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading comparison matrix...</div>
        ) : selectedListings.length === 0 ? (
          <div className="card-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '8px' }}>No items selected for comparison</h3>
            <p style={{ color: '#64748b' }}>Search above to select and compare tours.</p>
          </div>
        ) : (
          <div className="card-panel" style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `260px repeat(${selectedListings.length}, 1fr)`, borderBottom: '1px solid #e2e8f0' }}>
              
              {/* Top Row / Product Header */}
              <div style={{ padding: '24px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#475569' }}>Comparison Matrix</span>
              </div>
              {selectedListings.map((item) => (
                <div key={item.id} style={{ padding: '24px', position: 'relative', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: '220px' }}>
                  <button
                    onClick={() => handleRemove(item.id)}
                    aria-label="Remove tour"
                    style={{ position: 'absolute', top: '12px', right: '12px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
                  >
                    <X size={15} />
                  </button>
                  <img src={item.images?.[0]?.url} alt={item.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', marginBottom: '14px' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.35, marginBottom: '12px', flex: 1 }}>{item.title}</h3>
                  <Link href={`/tours/${item.slug}`} className="btn-primary" style={{ padding: '10px 16px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}>
                    View Experience
                  </Link>
                </div>
              ))}
            </div>

            {/* Matrix Rows */}
            {/* Price */}
            <div style={{ display: 'grid', gridTemplateColumns: `260px repeat(${selectedListings.length}, 1fr)`, borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Price</div>
              {selectedListings.map((item) => (
                <div key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', fontWeight: 800, fontSize: '1.15rem', color: 'var(--brand-primary)' }}>
                  {formatPrice(item.base_price)}
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginLeft: '4px' }}>/ {item.pricing_type?.replace(/^per\s+/i, '') || 'Person'}</span>
                </div>
              ))}
            </div>

            {/* Rating */}
            <div style={{ display: 'grid', gridTemplateColumns: `260px repeat(${selectedListings.length}, 1fr)`, borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Rating & Reviews</div>
              {selectedListings.map((item) => (
                <div key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={16} color="#d97706" fill="#d97706" />
                  <strong style={{ color: '#0f172a' }}>{item.cached_rating_avg}</strong>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>({item.cached_review_count || 120} reviews)</span>
                </div>
              ))}
            </div>

            {/* Duration */}
            <div style={{ display: 'grid', gridTemplateColumns: `260px repeat(${selectedListings.length}, 1fr)`, borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Duration</div>
              {selectedListings.map((item) => (
                <div key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                  <Clock size={16} color="#64748b" /> {item.duration}
                </div>
              ))}
            </div>

            {/* Category */}
            <div style={{ display: 'grid', gridTemplateColumns: `260px repeat(${selectedListings.length}, 1fr)`, borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Category</div>
              {selectedListings.map((item) => (
                <div key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
                  <span className="badge-emerald" style={{ fontSize: '0.78rem' }}>{item.category_name}</span>
                </div>
              ))}
            </div>

            {/* Pickup Location */}
            <div style={{ display: 'grid', gridTemplateColumns: `260px repeat(${selectedListings.length}, 1fr)`, borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Pickup Location</div>
              {selectedListings.map((item) => (
                <div key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#334155' }}>
                  <MapPin size={16} color="#0284c7" /> {item.pickup_location}
                </div>
              ))}
            </div>

            {/* Booking Option / Payment Option */}
            <div style={{ display: 'grid', gridTemplateColumns: `260px repeat(${selectedListings.length}, 1fr)`, borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Booking Type</div>
              {selectedListings.map((item) => (
                <div key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
                  <span className="badge-amber" style={{ fontSize: '0.78rem' }}>{item.confirmation_type}</span>
                </div>
              ))}
            </div>

            {/* Payment Mode */}
            <div style={{ display: 'grid', gridTemplateColumns: `260px repeat(${selectedListings.length}, 1fr)`, borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Payment Option</div>
              {selectedListings.map((item) => (
                <div key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#334155' }}>
                  <CreditCard size={16} color="#64748b" /> {item.payment_option}
                </div>
              ))}
            </div>

            {/* Selling Point / Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: `260px repeat(${selectedListings.length}, 1fr)` }}>
              <div style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Highlights</div>
              {selectedListings.map((item) => (
                <div key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                  <span className="badge-rose" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{item.selling_point}</span>
                  {item.merchandising_badges?.map((badge: string, idx: number) => (
                    <span key={idx} className="badge-rose" style={{ fontSize: '0.75rem' }}>{badge}</span>
                  ))}
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
