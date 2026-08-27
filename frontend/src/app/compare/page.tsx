'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
                    <Image src={item.images?.[0]?.url} alt={item.title} style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}  width={48} height={36} />
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
          <div className="compare-table-wrapper card-panel">
            <style dangerouslySetInnerHTML={{
              __html: `
                .compare-table-wrapper {
                  overflow-x: auto;
                  -webkit-overflow-scrolling: touch;
                  border-radius: 24px;
                  border: 1px solid #cbd5e1;
                  box-shadow: var(--shadow-md);
                }
                table {
                  border-collapse: collapse;
                }
                @media (max-width: 768px) {
                  .compare-table-wrapper th,
                  .compare-table-wrapper td {
                    padding: 16px 14px !important;
                  }
                  .compare-table-wrapper th:first-child,
                  .compare-table-wrapper td:first-child {
                    font-size: 0.85rem !important;
                    padding: 16px 10px !important;
                    width: 140px !important;
                  }
                }
              `
            }} />
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px', tableLayout: 'fixed' }}>
              
              {/* Top Row / Product Header */}
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '24px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', width: '200px', verticalAlign: 'middle' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#475569' }}>Comparison Matrix</span>
                  </th>
                  {selectedListings.map((item) => (
                    <th key={item.id} style={{ padding: '24px', position: 'relative', borderRight: '1px solid #e2e8f0', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
                        <button
                          onClick={() => handleRemove(item.id)}
                          aria-label="Remove tour"
                          style={{ position: 'absolute', top: '12px', right: '12px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', zIndex: 10 }}
                        >
                          <X size={15} />
                        </button>
                        <div style={{ width: '100%', height: '140px', background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                          {item.images?.[0]?.url ? (
                            <Image src={item.images[0].url} alt={item.title || 'Tour'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} width={300} height={200} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>No Image</div>
                          )}
                        </div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.35, flex: 1, margin: 0 }}>{item.title}</h3>
                        <Link href={`/tours/${item.slug}`} className="btn-primary" style={{ padding: '10px 16px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center', marginTop: 'auto' }}>
                          View Experience
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Price */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Price</td>
                  {selectedListings.map((item) => (
                    <td key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', fontWeight: 800, fontSize: '1.15rem', color: 'var(--brand-primary)' }}>
                        {formatPrice(item.base_price)}
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginLeft: '4px' }}>/ {item.pricing_type?.replace(/^per\s+/i, '') || 'Person'}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Rating & Reviews</td>
                  {selectedListings.map((item) => (
                    <td key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Star size={16} color="#d97706" fill="#d97706" />
                        <strong style={{ color: '#0f172a' }}>{item.cached_rating_avg}</strong>
                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>({item.cached_review_count || 120} reviews)</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Duration */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Duration</td>
                  {selectedListings.map((item) => (
                    <td key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                        <Clock size={16} color="#64748b" /> {item.duration}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Category */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Category</td>
                  {selectedListings.map((item) => (
                    <td key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0' }}>
                      <span className="badge-emerald" style={{ fontSize: '0.78rem' }}>{item.category_name}</span>
                    </td>
                  ))}
                </tr>

                {/* Pickup Location */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Pickup Location</td>
                  {selectedListings.map((item) => (
                    <td key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#334155' }}>
                        <MapPin size={16} color="#0284c7" /> {item.pickup_location}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Booking Option */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Booking Type</td>
                  {selectedListings.map((item) => (
                    <td key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0' }}>
                      <span className="badge-amber" style={{ fontSize: '0.78rem' }}>{item.confirmation_type}</span>
                    </td>
                  ))}
                </tr>

                {/* Payment Mode */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Payment Option</td>
                  {selectedListings.map((item) => (
                    <td key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#334155' }}>
                        <CreditCard size={16} color="#64748b" /> {item.payment_option}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Highlights */}
                <tr>
                  <td style={{ padding: '20px 24px', fontWeight: 700, color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Highlights</td>
                  {selectedListings.map((item) => (
                    <td key={item.id} style={{ padding: '20px 24px', borderRight: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                        <span className="badge-rose" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{item.selling_point}</span>
                        {item.merchandising_badges?.map((badge: string, idx: number) => (
                          <span key={idx} className="badge-rose" style={{ fontSize: '0.75rem' }}>{badge}</span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
