'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFromAPI } from '@/lib/api-client';
import { MapPin, Search, ChevronRight, Compass, Sparkles, ShieldCheck } from 'lucide-react';

export default function DestinationsIndexPage() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');

  useEffect(() => {
    async function loadDestinations() {
      try {
        const res = await fetchFromAPI('/listings/destinations');
        setDestinations(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Error loading destinations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDestinations();
  }, []);

  const countries = ['ALL', ...Array.from(new Set(destinations.map((d) => d.country)))];

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'ALL' || dest.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px 80px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* BREADCRUMB NAV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem', color: '#64748b' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#64748b' }}>Home</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#0f172a', fontWeight: 700 }}>All Destinations</span>
        </div>

        {/* HERO BANNER */}
        <div style={{ marginBottom: '36px' }}>
          <div className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Compass size={14} /> Global Travel Directory
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.15 }}>
            Explore Top Global Destinations
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '8px', maxWidth: '680px' }}>
            Discover top-rated tours, sunset cruises, culinary walks, and day excursions across world-famous cities and tropical paradises.
          </p>
        </div>

        {/* SEARCH & COUNTRY FILTER BAR */}
        <div className="card-panel" style={{ padding: '20px 24px', borderRadius: '20px', marginBottom: '36px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search destination by city or country (e.g. Lahore, Bali, Tokyo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.92rem', color: '#0f172a', fontWeight: 600 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {countries.map((country) => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-pill)',
                  border: selectedCountry === country ? 'none' : '1px solid #cbd5e1',
                  background: selectedCountry === country ? 'var(--brand-gradient)' : '#ffffff',
                  color: selectedCountry === country ? '#ffffff' : '#0f172a',
                  fontWeight: selectedCountry === country ? 700 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {country === 'ALL' ? '🌍 All Countries' : country}
              </button>
            ))}
          </div>

        </div>

        {/* DESTINATIONS GRID */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading destinations directory...</div>
        ) : filteredDestinations.length === 0 ? (
          <div className="card-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>No destination matches your search</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Try searching for cities like Bali, Tokyo, Paris, or Lahore.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {filteredDestinations.map((dest) => (
              <Link key={dest.id} href={`/destinations/${dest.slug}`} style={{ textDecoration: 'none' }}>
                <div 
                  className="card-panel card-interactive" 
                  style={{ 
                    borderRadius: '24px', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column',
                    height: '320px',
                    position: 'relative'
                  }}
                >
                  <div style={{ height: '200px', position: 'relative' }}>
                    <img src={dest.hero_image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.05) 70%)' }} />
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                      {dest.country}
                    </div>
                  </div>

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ffffff' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>{dest.name}</h3>
                      <p style={{ color: '#475569', fontSize: '0.85rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                        {dest.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9', marginTop: '12px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} /> {dest.popular_activities_count}+ Experiences
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                        Explore →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
