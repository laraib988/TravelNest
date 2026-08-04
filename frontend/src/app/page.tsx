'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Sparkles, MapPin, Star, Clock, ShieldCheck, ArrowRight, Heart, Zap, CheckCircle2, RefreshCw } from 'lucide-react';
import { fetchFromAPI } from '@/lib/api-client';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [listings, setListings] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({ 'list-bali-sunset': true });
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [listingsRes, destsRes] = await Promise.all([
          fetchFromAPI('/listings'),
          fetchFromAPI('/listings/destinations'),
        ]);
        setListings(listingsRes);
        setDestinations(destsRes);
      } catch (err) {
        console.error('Error fetching storefront data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setActiveSearchTerm('');
      setLoading(true);
      const res = await fetchFromAPI('/listings');
      setListings(res);
      setLoading(false);
      return;
    }

    setSearching(true);
    try {
      const res = await fetchFromAPI(`/listings?search=${encodeURIComponent(searchQuery)}`);
      setListings(res);
      setActiveSearchTerm(searchQuery);
      
      // Smooth scroll to listings section
      const elem = document.getElementById('experiences-section');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleResetSearch = async () => {
    setSearchQuery('');
    setActiveSearchTerm('');
    setSelectedCategory('ALL');
    setLoading(true);
    try {
      const res = await fetchFromAPI('/listings');
      setListings(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const quickFilterChips = [
    { id: 'ALL', icon: '🌟', label: 'All Experiences' },
    { id: 'Cruises', icon: '⛵', label: 'Water Sports & Cruises' },
    { id: 'Food', icon: '🍜', label: 'Food & Dining' },
    { id: 'Cultural', icon: '🏛️', label: 'Culture & History' },
    { id: 'Tours', icon: '🚌', label: 'Tours & Day Trips' },
  ];

  const filteredListings = listings.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category_name?.toLowerCase().includes(selectedCategory.toLowerCase()) || item.category_id === selectedCategory;
  });

  return (
    <div style={{ paddingBottom: '60px', background: '#ffffff' }}>
      
      {/* SLEEK, COMPACT & STYLISH HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '40px 20px 32px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
          borderBottom: '1px solid #f1f5f9',
          marginBottom: '36px',
        }}
      >
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          
          {/* COMPACT BADGE */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: 'var(--radius-pill)',
              background: '#e0f2fe',
              color: '#0369a1',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '14px',
              border: '1px solid #bae6fd',
            }}
          >
            <Sparkles size={14} color="#0284c7" /> OTA 2.0 • Real-Time Inventory & AI Search
          </div>

          {/* REFINED COMPACT HEADING */}
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              lineHeight: 1.2,
              marginBottom: '10px',
              color: '#0f172a',
              fontWeight: 800,
            }}
          >
            Discover & Book Unforgettable <br />
            <span className="gradient-text">Tours, Activities & Experiences</span>
          </h1>

          {/* TRUST CHECKMARKS ROW */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              color: '#475569',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '20px',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>⚡ Instant Confirmation</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669' }}>✅ Verified Local Guides</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🆓 Free Cancellation</span>
          </div>

          {/* SLEEK & COMPACT SEARCH BAR */}
          <form
            onSubmit={handleSearch}
            style={{
              borderRadius: 'var(--radius-pill)',
              padding: '5px 5px 5px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              maxWidth: '700px',
              margin: '0 auto 20px',
              background: '#ffffff',
              boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.08)',
              border: '1px solid #cbd5e1',
            }}
          >
            <Search size={18} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Where to next? (e.g. 'Bali', 'Tokyo ramen', 'Sunset cruise', 'Lahore')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#0f172a',
                fontSize: '0.95rem',
                outline: 'none',
                fontFamily: 'inherit',
                padding: '6px 0',
              }}
            />
            <button
              type="submit"
              disabled={searching}
              className="btn-primary"
              style={{
                padding: '10px 24px',
                fontSize: '0.92rem',
                borderRadius: 'var(--radius-pill)',
                flexShrink: 0,
              }}
            >
              {searching ? 'Searching...' : 'Explore Now'}
            </button>
          </form>

          {/* QUICK FILTER CHIPS */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            {quickFilterChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedCategory(chip.id)}
                className={`chip-filter ${selectedCategory === chip.id ? 'active' : ''}`}
                style={{
                  fontSize: '0.82rem',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: selectedCategory === chip.id ? 'none' : '1px solid #e2e8f0',
                  background: selectedCategory === chip.id ? 'var(--brand-gradient)' : '#ffffff',
                  color: selectedCategory === chip.id ? '#ffffff' : '#334155',
                }}
              >
                <span>{chip.icon}</span> {chip.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* FEATURED DESTINATIONS GRID */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '4px', color: '#0f172a' }}>Top Travel Destinations</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Auto-aggregated destination hubs with live slots and local guides</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {destinations.map((dest) => (
            <Link key={dest.id} href={`/destinations/${dest.slug}`}>
              <div className="card-panel card-interactive" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '200px', position: 'relative' }}>
                <img src={dest.hero_image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.05) 70%)' }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                  <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '2px' }}>{dest.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} /> {dest.popular_activities_count}+ Verified Experience Slots
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI PLANNER BANNER */}
      <section style={{ maxWidth: '1280px', margin: '50px auto', padding: '0 24px' }}>
        <div className="card-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '36px 32px', background: 'linear-gradient(135deg, rgba(2,132,199,0.05) 0%, rgba(124,58,237,0.05) 100%)', border: '1px solid #bae6fd', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <div style={{ maxWidth: '600px' }}>
            <div className="badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Zap size={13} /> AI-Powered Travel Matching
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: '#0f172a' }}>AI Trip Planner Studio</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Type your ideal vacation in natural language. Our AI instantly matches available marketplace slots, structures a day-by-day itinerary, and enables one-click cart checkout.
            </p>
          </div>
          <Link href="/ai-planner" className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
            <Sparkles size={18} /> Open AI Planner Studio <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FEATURED EXPERIENCE LISTINGS GRID */}
      <section id="experiences-section" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '4px', color: '#0f172a' }}>Top-Rated Marketplace Experiences</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Guaranteed real-time availability with 15-minute slot lock protection</p>
          </div>

          {activeSearchTerm && (
            <button
              onClick={handleResetSearch}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} /> Clear Search ("{activeSearchTerm}")
            </button>
          )}
        </div>

        {activeSearchTerm && (
          <div style={{ padding: '12px 18px', background: '#f0f9ff', border: '1px solid #7dd3fc', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.9rem', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>🔍 Showing <strong>{filteredListings.length}</strong> Vector AI matched experience(s) for <strong>"{activeSearchTerm}"</strong></span>
            <button onClick={handleResetSearch} style={{ background: 'none', border: 'none', color: '#0284c7', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>Show All</button>
          </div>
        )}

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading experiences from NestJS API...</div>
        ) : filteredListings.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>No direct match found for "{activeSearchTerm}"</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Try searching for 'Bali', 'Tokyo', 'Louvre', 'Lahore', or select a category above.</p>
            <button onClick={handleResetSearch} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>Reset Search Filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {filteredListings.map((item) => (
              <div key={item.id} className="card-panel card-interactive" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                
                {/* IMAGE & BADGES */}
                <div style={{ height: '210px', position: 'relative' }}>
                  <img src={item.images[0]?.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  
                  {/* WISHLIST BUTTON */}
                  <button
                    onClick={(e) => toggleWishlist(item.id, e)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <Heart size={16} color={wishlist[item.id] ? '#f43f5e' : '#64748b'} fill={wishlist[item.id] ? '#f43f5e' : 'none'} />
                  </button>

                  {/* RATING BADGE */}
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', padding: '3px 8px', borderRadius: 'var(--radius-pill)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, boxShadow: 'var(--shadow-sm)' }}>
                    <Star size={13} color="#d97706" fill="#d97706" /> {item.cached_rating_avg} ({item.cached_review_count})
                  </div>

                  <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--brand-primary)', color: '#fff', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: 700 }}>
                    {item.category_name || item.category}
                  </div>
                </div>

                {/* CONTENT */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', lineHeight: 1.35, color: '#0f172a' }}>{item.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.summary}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> {item.duration_minutes / 60} Hours</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={13} color="#059669" /> KYC Verified</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>From</span>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                        ${item.base_price} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/ person</span>
                      </div>
                    </div>
                    <Link href={`/tours/${item.slug}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      View Slots
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* VERIFIED CUSTOMER TESTIMONIALS */}
      <section style={{ maxWidth: '1280px', margin: '60px auto 0', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="badge-emerald" style={{ display: 'inline-flex', marginBottom: '8px' }}>
            Verified Traveler Reviews
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a' }}>Loved by 50,000+ Travelers Worldwide</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div className="card-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={15} color="#d97706" fill="#d97706" />)}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '14px', lineHeight: 1.5 }}>
              "The Bali sunset catamaran cruise was the highlight of our vacation! Locking the seats in real-time with zero hassle gave us complete peace of mind."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--brand-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                SC
              </div>
              <div>
                <h5 style={{ fontSize: '0.9rem', color: '#0f172a' }}>Sarah Connor</h5>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Booking • Bali Tour</span>
              </div>
            </div>
          </div>

          <div className="card-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={15} color="#d97706" fill="#d97706" />)}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '14px', lineHeight: 1.5 }}>
              "The AI Trip Planner created our 2-day Shinjuku foodie itinerary in 10 seconds. We tasted authentic Wagyu & sake at hidden izakayas."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                MK
              </div>
              <div>
                <h5 style={{ fontSize: '0.9rem', color: '#0f172a' }}>Michael Tanaka</h5>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Booking • Tokyo Tour</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
