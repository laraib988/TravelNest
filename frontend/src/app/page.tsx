'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Search,
  Sparkles,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  ArrowRight,
  Heart,
  SlidersHorizontal,
  Check,
  Shield,
  Zap,
  DollarSign,
  Headphones,
  Compass,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Tag,
  Users,
  Award,
  Lock,
  Mail
} from 'lucide-react';
import { fetchFromAPI } from '@/lib/api-client';
import { useCurrency } from '@/context/CurrencyContext';
import SortFilterDropdown, { SortOption } from '@/components/SortFilterDropdown';

export default function HomePage() {
  const { formatPrice, currency, t, wishlist, toggleWishlist } = useCurrency();

  const toursSliderRef = useRef<HTMLDivElement>(null);
  const reviewsSliderRef = useRef<HTMLDivElement>(null);

  const scrollTours = (direction: 'left' | 'right') => {
    if (toursSliderRef.current) {
      const scrollAmount = toursSliderRef.current.clientWidth;
      toursSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollReviews = (direction: 'left' | 'right') => {
    if (reviewsSliderRef.current) {
      const scrollAmount = reviewsSliderRef.current.clientWidth;
      reviewsSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // STATE VARIABLES
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [listings, setListings] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // ADVANCED FILTER & SORT STATES
  const [sortBy, setSortBy] = useState<SortOption>('MOST_CLICKED');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(200);
  const [onlyInstantConfirm, setOnlyInstantConfirm] = useState(false);
  const [onlyFreeCancel, setOnlyFreeCancel] = useState(false);

  // AI TRIP PLANNER FORM STATE
  const [aiDest, setAiDest] = useState('bali');
  const [publishedDestinations, setPublishedDestinations] = useState<any[]>([]);
  const [aiDays, setAiDays] = useState('3');
  const [aiBudget, setAiBudget] = useState('budget');
  const [aiInterests, setAiInterests] = useState<string[]>(['nature']);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // FAQ ACCORDION STATE
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({ 0: true });

  // NEWSLETTER STATE
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [destsRes, supabaseListingsRes] = await Promise.all([
          fetch('/api/public/destinations', { cache: 'no-store' }).then(res => res.json()).catch(() => []),
          fetch('/api/public/listings', { cache: 'no-store' }).then(res => res.json()).catch(() => [])
        ]);
        
        setListings(supabaseListingsRes || []);
        
        setDestinations(destsRes || []);
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
      const res = await fetch('/api/public/listings').then(res => res.json()).catch(() => []);
      setListings(res || []);
      setLoading(false);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/public/listings?search=${encodeURIComponent(searchQuery)}`).then(res => res.json()).catch(() => []);
      setListings(res || []);
      setActiveSearchTerm(searchQuery);
      
      const elem = document.getElementById('experiences-section');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handlePillClick = async (city: string) => {
    setSearchQuery(city);
    setSearching(true);
    try {
      const res = await fetch(`/api/public/listings?search=${encodeURIComponent(city)}`).then(res => res.json()).catch(() => []);
      setListings(res || []);
      setActiveSearchTerm(city);
      const elem = document.getElementById('experiences-section');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Pill search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleResetSearch = async () => {
    setSearchQuery('');
    setActiveSearchTerm('');
    setSelectedCategory('ALL');
    setSortBy('MOST_CLICKED');
    setMaxPriceFilter(200);
    setOnlyInstantConfirm(false);
    setOnlyFreeCancel(false);
    setLoading(true);
    try {
      const res = await fetch('/api/public/listings').then(res => res.json()).catch(() => []);
      setListings(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const handleAiPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    setTimeout(() => {
      setAiResult(`
🗺️ **AI Generated Itinerary for ${aiDest.toUpperCase()} (${aiDays} Days)**
💰 **Budget Class:** ${aiBudget.toUpperCase()}
🎯 **Focus Areas:** ${aiInterests.join(', ')}

✨ **Day 1: Arrival & Exploring Hidden Gems**
   - Check-in to verified boutique stay.
   - 🍜 Evening Guided Street Food tour (included in your custom passes).
✨ **Day 2: Adventure & Nature Walk**
   - 🌋 Sunrise panoramic mountain trekking.
   - ⛵ Afternoon luxury boat cruise.
✨ **Day 3: Art, Culture & Farewell**
   - 🏛️ Skip-the-line museum entry with art historian.
   - Private transport transfer to the airport.
      `);
      setAiLoading(false);
    }, 1500);
  };

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleInterest = (interest: string) => {
    setAiInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const quickFilterChips = [
    { id: 'ALL', label: t('cat_all') },
    { id: 'Cruises', label: t('cat_cruises') },
    { id: 'Food', label: t('cat_food') },
    { id: 'Cultural', label: t('cat_cultural') },
    { id: 'Tours', label: t('cat_tours') },
    { id: 'Adventure', label: t('cat_adventure') },
  ];

  // APPLY FILTERS & SORT
  const getFilteredListings = () => {
    let result = [...listings];

    if (selectedCategory !== 'ALL') {
      result = result.filter((item) => {
        const cat = item.category_name || '';
        return cat.toLowerCase().indexOf(selectedCategory.toLowerCase()) !== -1;
      });
    }

    if (maxPriceFilter < 200) {
      result = result.filter((item) => item.base_price <= maxPriceFilter);
    }

    if (onlyInstantConfirm) {
      result = result.filter((item) => item.confirmation_type === 'INSTANT');
    }

    if (onlyFreeCancel) {
      result = result.filter((item) => item.cancellation_policy === 'FREE_24H');
    }

    if (sortBy === 'PRICE_LOW') {
      result.sort((a, b) => a.base_price - b.base_price);
    } else if (sortBy === 'PRICE_HIGH') {
      result.sort((a, b) => b.base_price - a.base_price);
    } else if (sortBy === 'MOST_CLICKED') {
      result.sort((a, b) => b.cached_review_count - a.cached_review_count);
    } else if (sortBy === 'DATE_NEW') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === 'DATE_OLD') {
      result.sort((a, b) => a.id.localeCompare(b.id));
    }

    return result;
  };

  const filteredListings = getFilteredListings();

  return (
    <div style={{ paddingBottom: '60px', background: '#ffffff' }}>
      
      {/* 1. HERO SECTION WITH SEARCH */}
      <section
        style={{
          position: 'relative',
          minHeight: '520px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          textAlign: 'left',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="/images/travelers_hero.jpg"
            alt="Professional Travelers"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.55) 60%, rgba(15, 23, 42, 0.25) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '80px 32px 60px' }}>
          <div style={{ maxWidth: '780px' }}>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', lineHeight: 1.1, marginBottom: '16px', color: '#ffffff', fontWeight: 800, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              {t('hero_title_1')}<br />
              <span style={{ color: '#38bdf8' }}>{t('hero_title_2')}</span>
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: '#ffffff', fontSize: '0.98rem', fontWeight: 600, marginBottom: '28px', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
              <span>{t('instant_confirmation')}</span>
              <span style={{ color: '#6ee7b7' }}>{t('verified_guides')}</span>
              <span>{t('free_cancellation')}</span>
            </div>

            <form onSubmit={handleSearch} style={{ borderRadius: 'var(--radius-pill)', padding: '6px 6px 6px 20px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '680px', background: '#ffffff', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)' }}>
              <Search size={20} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#0f172a', fontSize: '1rem', outline: 'none' }}
              />
              <button type="submit" disabled={searching} className="btn-primary" style={{ padding: '12px 28px', borderRadius: 'var(--radius-pill)', flexShrink: 0 }}>
                {searching ? 'Searching...' : t('explore_now')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES HORIZONTAL BAR */}
      <section style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '16px 0', marginBottom: '40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginRight: '8px', flexShrink: 0 }}>
            Categories:
          </span>
          {quickFilterChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedCategory(chip.id)}
              className={`chip-filter ${selectedCategory === chip.id ? 'active' : ''}`}
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                padding: '10px 22px',
                borderRadius: 'var(--radius-pill)',
                whiteSpace: 'nowrap',
                border: selectedCategory === chip.id ? 'none' : '1px solid #cbd5e1',
                background: selectedCategory === chip.id ? 'var(--brand-gradient)' : '#ffffff',
                color: selectedCategory === chip.id ? '#ffffff' : '#0f172a',
                cursor: 'pointer',
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. TRENDING DESTINATIONS SECTION */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 60px', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>🌍 {t('top_destinations')}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t('top_destinations_sub')}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {(() => {
            const filteredDests = activeSearchTerm.trim()
              ? destinations.filter((d) => d.name.toLowerCase().includes(activeSearchTerm.toLowerCase()) || d.country.toLowerCase().includes(activeSearchTerm.toLowerCase()))
              : destinations.slice(0, 8); // Show up to 8 trending destinations dynamically
            
            if (filteredDests.length === 0) {
              return <p style={{ color: '#64748b', padding: '20px 0' }}>No trending destinations available at the moment.</p>;
            }

            return filteredDests.map((dest) => (
              <Link key={dest.id} href={`/destinations/${dest.slug}`}>
                <div className="card-panel card-interactive" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '220px', position: 'relative' }}>
                  <img src={dest.hero_image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.05) 70%)' }} />
                  <div style={{ position: 'absolute', bottom: '18px', left: '18px' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '4px', fontWeight: 800 }}>{dest.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} /> {dest.popular_activities_count}+ {t('verified_slots')}
                    </span>
                  </div>
                </div>
              </Link>
            ));
          })()}
        </div>
      </section>

      {/* 4. AI TRIP PLANNER DYNAMIC HERO FEATURE */}
      <section style={{ background: '#f0f9ff', padding: '60px 0', borderTop: '1px solid #e0f2fe', borderBottom: '1px solid #e0f2fe', marginBottom: '60px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          
          {/* PLANNER FORM */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e0f2fe', color: '#0369a1', padding: '6px 14px', borderRadius: 'var(--radius-pill)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '14px' }}>
              <Sparkles size={14} /> AI ENGINE 2.0
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
              {t('planner_title')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '28px' }}>
              {t('planner_sub')}
            </p>

            <form onSubmit={handleAiPlanSubmit} style={{ background: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>{t('planner_dest')}</label>
                <select value={aiDest} onChange={(e) => setAiDest(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid #cbd5e1', outline: 'none' }}>
                  {publishedDestinations.length > 0 ? (
                    publishedDestinations.map(d => (
                      <option key={d.slug} value={d.slug}>{d.name}, {d.country}</option>
                    ))
                  ) : (
                    <option value="loading">Loading...</option>
                  )}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>{t('planner_days')}</label>
                  <select value={aiDays} onChange={(e) => setAiDays(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid #cbd5e1', outline: 'none' }}>
                    <option value="1">1 Day</option>
                    <option value="3">3 Days</option>
                    <option value="5">5 Days</option>
                    <option value="7">7 Days</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>{t('planner_budget')}</label>
                  <select value={aiBudget} onChange={(e) => setAiBudget(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid #cbd5e1', outline: 'none' }}>
                    <option value="budget">Value Budget</option>
                    <option value="premium">Mid Premium</option>
                    <option value="luxury">Luxury VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Interests</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Nature 🌲', 'Food & Culinary 🍜', 'Museums & Art 🏛️', 'Adventure Sports 🌋', 'Sightseeing 🚌'].map((interest) => {
                    const isSelected = aiInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          borderRadius: 'var(--radius-pill)',
                          border: isSelected ? 'none' : '1px solid #cbd5e1',
                          background: isSelected ? 'var(--brand-primary)' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" disabled={aiLoading} className="btn-primary" style={{ padding: '12px', fontSize: '0.95rem', borderRadius: 'var(--radius-pill)', justifyContent: 'center' }}>
                {aiLoading ? 'AI Planning in Progress...' : 'Generate AI Plan'}
              </button>
            </form>
          </div>

          {/* PLANNER OUTPUT BOARD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '28px', border: '1px solid #e0f2fe', boxShadow: 'var(--shadow-lg)', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {aiResult ? (
                <div style={{ whiteSpace: 'pre-line', color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {aiResult}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Sparkles size={48} color="var(--brand-primary)" style={{ margin: '0 auto 16px', display: 'block' }} />
                  <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Your Interactive AI Plan Awaits</p>
                  <p style={{ fontSize: '0.82rem', marginTop: '6px' }}>Submit the form to generate a dynamic bookable itinerary board</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 5. POPULAR THIS WEEK */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 60px', padding: '0 24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>🔥 Popular This Week</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Most booked verified experiences globally</p>
        </div>

        <div 
          style={{ 
            display: 'flex', 
            gap: '24px', 
            overflowX: 'auto', 
            scrollBehavior: 'smooth',
            paddingBottom: '16px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {listings.slice(0, 8).map((item) => (
            <Link href={`/tours/${item.slug}`} key={item.id} style={{ textDecoration: 'none', display: 'flex', flex: '0 0 calc(25% - 18px)', minWidth: '300px', alignSelf: 'stretch' }}>
              <div className="card-panel" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', flex: 1, transition: 'transform 0.2s, box-shadow 0.2s' }}>
                <div style={{ height: '200px', position: 'relative' }}>
                  <img src={item.images[0]?.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(item.id);
                    }} 
                    style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      right: '12px', 
                      background: 'rgba(255,255,255,0.9)', 
                      backdropFilter: 'blur(4px)', 
                      border: 'none', 
                      borderRadius: '50%', 
                      width: '32px', 
                      height: '32px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer', 
                      zIndex: 10, 
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <Heart size={15} color={wishlist.includes(item.id) ? '#e11d48' : '#64748b'} fill={wishlist.includes(item.id) ? '#e11d48' : 'none'} />
                  </button>
                  {item.selling_point && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--brand-accent)', color: '#ffffff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                      {item.selling_point}
                    </div>
                  )}
                </div>
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Pickup Location & Duration Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                        <MapPin size={12} color="#64748b" /> {item.pickup_location || 'Hotel Pickup'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                        <Clock size={12} color="#64748b" /> {item.duration || '2 hours'}
                      </span>
                    </div>

                    {/* Rating Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      <Star size={14} color="#d97706" fill="#d97706" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>{item.cached_rating_avg}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Booked 450+ times)</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4 }}>{item.title}</h3>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{item.confirmation_type || 'Instant Confirmation'}</span>
                      <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{item.payment_option || 'Pay Now'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '14px', marginTop: '14px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>From <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{formatPrice(item.base_price)}</strong> <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>/ {item.pricing_type?.replace(/^per\s+/i, '') || 'Person'}</span></span>
                    <div className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      Book Slots
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE TRAVELNEST (NO YELLOW COLORS & COHESIVE ICONS) */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 60px', padding: '0 24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textAlign: 'center' }}>
          {t('why_choose_title')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textAlign: 'center', marginBottom: '32px' }}>
          We guarantee safety, speed, and premium support for travelers worldwide
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          <div className="card-panel" style={{ padding: '28px 24px', borderRadius: 'var(--radius-md)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Shield size={40} color="var(--brand-primary)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px' }}>100% KYC Verified Suppliers</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Every operator undergoes mandatory government trade license, tourism permit, and marine liability insurance checks.
            </p>
          </div>

          <div className="card-panel" style={{ padding: '28px 24px', borderRadius: 'var(--radius-md)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Award size={40} color="var(--brand-primary)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px' }}>Earn Loyalty Rewards</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Earn exclusive loyalty points with every experience you book. Redeem points for discount vouchers and premium travel benefits.
            </p>
          </div>

          <div className="card-panel" style={{ padding: '28px 24px', borderRadius: 'var(--radius-md)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <DollarSign size={40} color="var(--brand-primary)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px' }}>Best Price Guarantee</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Found the same experience cheaper? We'll match the price or refund the difference instantly, 0 hidden fees.
            </p>
          </div>

          <div className="card-panel" style={{ padding: '28px 24px', borderRadius: 'var(--radius-md)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Headphones size={40} color="var(--brand-primary)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px' }}>24/7 AI Concierge</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Access our smart AI trip planner and multilingual customer support for instant modifications on the go.
            </p>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section style={{ background: '#f8fafc', padding: '60px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', marginBottom: '60px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textAlign: 'center' }}>
            🧭 {t('how_works_title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textAlign: 'center', marginBottom: '40px' }}>
            Book premium local experiences in 4 simple steps
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800 }}>1</div>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px' }}>Choose Experience</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Explore 5,000+ verified sightseeing tours, food walks, and cruises.</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800 }}>2</div>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px' }}>Customize with AI</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Let our AI engine build your customized destination itinerary instantly.</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800 }}>3</div>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px' }}>Secure QR Booking</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Lock slots securely. Receive printable QR e-vouchers instantly.</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800 }}>4</div>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px' }}>Present & Enjoy</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Show voucher QR to verified local operators at arrival and explore.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TOP RATED MARKETPLACE EXPERIENCES SLIDER SECTION */}
      <section id="experiences-section" style={{ maxWidth: '1280px', margin: '0 auto 60px', padding: '0 24px' }}>
        
        {/* HEADER BAR WITH TITLE, SLIDER CONTROLS & SORT DROPDOWN */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Top Rated Marketplace Experiences
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0' }}>
              Handpicked top-rated tours, excursions and activities
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => scrollTours('left')}
                aria-label="Previous Experiences"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollTours('right')}
                aria-label="Next Experiences"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <SortFilterDropdown currentSort={sortBy} onSortChange={setSortBy} />
          </div>
        </div>

        {/* RESULTS SLIDER (1 ROW - 4 PRODUCTS VISIBLE) */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading experiences from NestJS API...</div>
        ) : filteredListings.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>No experience matches your active filters</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Try resetting price filters or selecting 'All Experiences'.</p>
            <button onClick={handleResetSearch} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>{t('reset_filters')}</button>
          </div>
        ) : (
          <div 
            ref={toursSliderRef}
            style={{ 
              display: 'flex', 
              gap: '24px', 
              overflowX: 'auto', 
              scrollBehavior: 'smooth',
              paddingBottom: '16px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {filteredListings.filter(item => item.id !== 'list-bali-sunset').map((item) => (
              <Link href={`/tours/${item.slug}`} key={item.id} style={{ textDecoration: 'none', display: 'flex', flex: '0 0 calc(25% - 18px)', minWidth: '300px', alignSelf: 'stretch' }}>
              <div className="card-panel" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', flex: 1, transition: 'transform 0.2s, box-shadow 0.2s' }}>
                <div style={{ height: '200px', position: 'relative' }}>
                  <img src={item.images[0]?.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(item.id);
                    }} 
                    style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      right: '12px', 
                      background: 'rgba(255,255,255,0.9)', 
                      backdropFilter: 'blur(4px)', 
                      border: 'none', 
                      borderRadius: '50%', 
                      width: '32px', 
                      height: '32px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer', 
                      zIndex: 10, 
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <Heart size={15} color={wishlist.includes(item.id) ? '#e11d48' : '#64748b'} fill={wishlist.includes(item.id) ? '#e11d48' : 'none'} />
                  </button>
                  {item.selling_point && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--brand-accent)', color: '#ffffff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                      {item.selling_point}
                    </div>
                  )}
                </div>
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Pickup Location & Duration Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                        <MapPin size={12} color="#64748b" /> {item.pickup_location || 'Hotel Pickup'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                        <Clock size={12} color="#64748b" /> {item.duration || '2 hours'}
                      </span>
                    </div>

                    {/* Rating Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      <Star size={14} color="#d97706" fill="#d97706" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>{item.cached_rating_avg}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Booked 450+ times)</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4 }}>{item.title}</h3>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{item.confirmation_type || 'Instant Confirmation'}</span>
                      <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{item.payment_option || 'Pay Now'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '14px', marginTop: '14px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>From <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{formatPrice(item.base_price)}</strong> <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>/ {item.pricing_type?.replace(/^per\s+/i, '') || 'Person'}</span></span>
                    <div className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      Book Slots
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            ))}
          </div>
        )}
      </section>



      {/* 12. DYNAMIC FAQ ACCORDION */}
      <section style={{ maxWidth: '800px', margin: '0 auto 60px', padding: '0 24px' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textAlign: 'center' }}>
          {t('faq_title')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textAlign: 'center', marginBottom: '32px' }}>
          Everything you need to know about TravelNest bookings & verification
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { q: 'How do I access my booking QR voucher?', a: 'Once payment is confirmed securely, an email confirmation is sent. You can also view your active check-in QR codes under the "My Bookings" tab in your header menu.' },
            { q: 'Can I cancel my experience for a full refund?', a: 'Yes! Most of our activities offer free cancellation up to 24 hours before the scheduled experience start time. Check individual cards for validation.' },
            { q: 'How are local tour operators verified?', a: 'We perform strict KYC document checks including trade license review, corporate tax registration check, and public liability insurance checks before supplier approval.' },
            { q: 'How does the AI Trip Planner build my itinerary?', a: 'Our AI engine aggregates actual real-time availability slots, budget options, and interest parameters to generate a custom bookable trip board instantly.' }
          ].map((faq, index) => {
            const isOpen = faqOpen[index];
            return (
              <div key={index} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: '#ffffff', overflow: 'hidden' }}>
                <button
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 24px 20px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 13. NEWSLETTER */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 60px', padding: '0 24px' }}>
        <div style={{ background: 'var(--brand-gradient)', padding: '50px 30px', borderRadius: 'var(--radius-lg)', color: '#ffffff', textAlign: 'center', boxShadow: '0 12px 36px rgba(2, 132, 199, 0.25)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>{t('newsletter_title')}</h2>
          <p style={{ fontSize: '1rem', color: '#e0f2fe', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px' }}>
            Subscribe to our weekly dispatch and receive 15% discount code for your first verified experience booking!
          </p>

          {subSuccess ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '10px 24px', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
              <Check size={18} /> Subscription confirmed! Check your inbox for code.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (emailSub.trim()) setSubSuccess(true);
              }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '500px', margin: '0 auto' }}
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                style={{ flex: 1, minWidth: '240px', padding: '14px 20px', borderRadius: 'var(--radius-pill)', border: 'none', outline: 'none', color: '#0f172a', fontSize: '0.95rem' }}
              />
              <button type="submit" className="btn-secondary" style={{ padding: '14px 30px', borderRadius: 'var(--radius-pill)', color: '#0f172a', fontWeight: 700, border: 'none', background: '#ffffff', cursor: 'pointer' }}>
                {t('newsletter_button')}
              </button>
            </form>
          )}
        </div>
      </section>


      {/* 15. WHERE TO GO NEXT SECTION */}
      <section style={{ maxWidth: '1280px', margin: '60px auto 40px', padding: '0 24px', borderTop: '1px solid #e2e8f0', paddingTop: '40px' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>
          {t('where_next_title')}
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 16px' }}>
          {[
            'Calgary', 'Montréal', 'Toronto', 'Vancouver', 'Lyon', 'Marseille', 'Nice',
            'Paris', 'Kyoto', 'Osaka', 'Tokyo', 'Al-Ula', 'Jeddah', 'Mecca', 'Riyadh',
            'Birmingham', 'Liverpool', 'London', 'Manchester'
          ].map((city, index) => (
            <button
              key={city}
              onClick={() => handlePillClick(city)}
              style={{
                display: 'inline-flex',
                alignItems: 'stretch',
                borderRadius: '8px',
                border: 'none',
                padding: 0,
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <span
                style={{
                  background: 'var(--brand-primary)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 12px',
                }}
              >
                {index + 1}
              </span>
              <span
                style={{
                  background: '#1e293b',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                }}
              >
                {city}
              </span>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
