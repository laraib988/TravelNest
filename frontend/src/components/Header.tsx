'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  MapPin,
  LogOut,
  ChevronDown,
  ChevronRight,
  Bell,
  User,
  Calendar,
  Settings,
  MessageSquare,
  Award,
  LogIn,
  Globe,
  Star,
  FileText,
ArrowRightLeft,
  UserPlus,
  LayoutDashboard,
  Menu,
  X,
  Search
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import CurrencyLanguageDropdown from './CurrencyLanguageDropdown';
import { fetchFromAPI } from '@/lib/api-client';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useCurrency();

  // On admin and supplier pages, hide the public customer header
  const cleanPath = pathname?.replace(/^\/[a-z]{2}(?=\/|$)/, '').replace(/\/$/, '') || '';
  const isSupplierLanding = cleanPath === '/supplier';
  if (cleanPath.startsWith('/admin-portal') || (cleanPath.startsWith('/supplier') && !isSupplierLanding)) {
    return null;
  }
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isSignUpHovered, setIsSignUpHovered] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const subHeaderRef = useRef<HTMLDivElement>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await fetchFromAPI('/users/me/notifications');
        const list = Array.isArray(data) ? data : (data?.data || []);
        setUnreadNotifications(list.filter((n: any) => !n.is_read && !n.read).length);
      } catch (e) {
        setUnreadNotifications(0);
      }
    }
    loadNotifications();
  }, [pathname]);


  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (subHeaderRef.current && !subHeaderRef.current.contains(event.target as Node)) {
        setIsDestinationsOpen(false);
        setIsExploreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'where' | 'explore'>('where');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [featuredCities, setFeaturedCities] = useState<any[]>([]);
  const [activeHoverCountry, setActiveHoverCountry] = useState<string | null>(null);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  const [mobileSelectedCountry, setMobileSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('name, country, slug, hero_image')
        .eq('is_published', true)
        .limit(20);
        
      if (!error && data) {
        setFeaturedCities(data);
        if (data.length > 0) {
          setActiveHoverCountry(data[0].country);
        }
      }
    };
    fetchDestinations();
  }, []);

  return (
    <>
      <header 
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 100, 
          background: 'rgba(255, 255, 255, 0.98)', 
          backdropFilter: 'blur(16px)', 
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div className="desktop-only" style={{ flexDirection: "column", width: "100%" }}>
        {/* TOP ANNOUNCEMENT BAR */}
        <div style={{ background: 'var(--brand-gradient)', color: '#ffffff', padding: '6px 24px', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Sparkles size={14} /> ⚡ Flash Sale: Get 15% off Bali & Tokyo Experiences with code <strong>VAITOUR2026</strong>
        </div>

        {/* HEADER 1: PRIMARY TOP HEADER BAR */}
        <div 
          style={{ 
            maxWidth: '1280px', 
            margin: '0 auto', 
            padding: '12px 24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '20px'
          }}
        >
          
          {/* LEFT: BRAND LOGO */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <Image 
              src="/logo.png" 
              alt="Vaitour Logo" 
              style={{ width: '38px', height: '38px', objectFit: 'contain' }} 
             width={38} height={38} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }} className="gradient-text">
                Vaitour
              </span>
              {/* <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                Marketplace OTA
              </span> */}
            </div>
          </Link>

          {/* CENTER: SEARCH BAR (NOT ON HOMEPAGE) */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '32px' }}>
            {cleanPath !== '' && (
              <form 
                action="/tours" 
                method="get" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  background: '#f1f5f9', 
                  borderRadius: '100px', 
                  padding: '6px 16px', 
                  width: '100%', 
                  maxWidth: '380px',
                  border: '1px solid #e2e8f0',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <input 
                  type="text" 
                  name="search" 
                  placeholder="Search destinations or activities" 
                  style={{ 
                    flex: 1, 
                    background: 'transparent', 
                    border: 'none', 
                    outline: 'none', 
                    fontSize: '0.95rem', 
                    color: '#0f172a' 
                  }} 
                />
                <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: NAVIGATION LINKS, CURRENCY & 2 SEPARATE AUTH BUTTONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            
            {/* PRIMARY NAVIGATION LINKS */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* {false && (
                <Link href="/ai-planner" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {t('ai_trip_studio')}
                </Link>
              )} */}
              <Link 
                href="/blog" 
                className="btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #e2e8f0', background: '#f8fafc', whiteSpace: 'nowrap' }}
              >
                {t('travel_journal')}
              </Link>
              <Link 
                href="/supplier" 
                className="btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #e2e8f0', background: '#f8fafc', whiteSpace: 'nowrap' }}
              >
                {t('supplier_portal')}
              </Link>
            </nav>

            {/* CURRENCY & LANGUAGE SELECTOR DROPDOWN */}
            <CurrencyLanguageDropdown direction="up" />

            {/* AUTHENTICATION ACTIONS: USER PROFILE OR 2 SEPARATE BUTTONS (SIGN IN & SIGN UP) */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 12px 4px 4px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Image src={user.avatar} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}  width={32} height={32} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{user.name}</span>
                  <ChevronDown size={14} color="#64748b" />
                </button>

                {isUserMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '46px',
                      right: 0,
                      background: '#ffffff',
                      borderRadius: '16px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                      border: '1px solid #e2e8f0',
                      width: '210px',
                      padding: '8px 0',
                      zIndex: 200,
                    }}
                  >
                    <Link
                      href="/my-bookings"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.88rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                    >
                      <Calendar size={15} color="#0284c7" /> {t('my_bookings')}
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.88rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                    >
                      <User size={15} color="#7c3aed" /> Account Profile
                    </Link>
                    <Link
                      href="/notifications"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.88rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                    >
                      <Bell size={15} color="#f59e0b" /> Notifications
                    </Link>
                    <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />
                    <Link
                      href="/supplier"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.88rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                    >
                      <ShieldCheck size={15} color="#059669" /> {t('supplier_portal')}
                    </Link>
                    {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin-portal"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.88rem', color: '#7c3aed', textDecoration: 'none', fontWeight: 700, background: '#f5f3ff' }}
                    >
                      <LayoutDashboard size={15} color="#7c3aed" /> Admin Portal
                    </Link>
                    )}
                    <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        fontSize: '0.88rem',
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <LogOut size={15} /> {t('sign_out')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} style={{ padding: '6px 16px', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', textDecoration: 'none', border: '1px solid #cbd5e1', borderRadius: '20px', background: '#fff' }}>Sign In</Link>
                <Link href={`/signup?redirect=${encodeURIComponent(pathname)}`} style={{ padding: '6px 16px', fontSize: '0.85rem', fontWeight: 700, color: '#fff', textDecoration: 'none', border: '1px solid var(--brand-primary)', borderRadius: '20px', background: 'var(--brand-primary)' }}>Sign Up</Link>
              </div>
            )}

          </div>
        </div>
        </div>

        {/* MOBILE HEADER */}
        <div className="mobile-only" style={{ width: "100%", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {isMobileSearchOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px' }}>
               <button onClick={() => setIsMobileSearchOpen(false)} style={{ background: 'none', border: 'none', padding: '4px' }}><X size={24} color="#0f172a" /></button>
               <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/tours?search=${encodeURIComponent(mobileSearchQuery)}`; }} style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '20px', padding: '6px 12px' }}>
                  <input autoFocus type="text" value={mobileSearchQuery} onChange={e => setMobileSearchQuery(e.target.value)} placeholder="Search destinations, tours..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#0f172a' }} />
                  <button type="submit" style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center' }}><Search size={18} color="#64748b" /></button>
               </form>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button onClick={() => setIsMobileMenuOpen(true)} style={{ background: "none", border: "none", padding: "4px", display: "flex" }}>
                    <Menu size={28} color="#0f172a" />
                  </button>
                  <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                    <Image src="/logo.png" alt="Vaitour Logo" style={{ width: "28px", height: "28px", objectFit: "contain" }} width={28} height={28} />
                    <span style={{ fontSize: "1.25rem", fontWeight: 800, lineHeight: 1 }} className="gradient-text">Vaitour</span>
                  </Link>
                </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button onClick={() => setIsMobileSearchOpen(true)} style={{ background: "none", border: "none", color: "#0f172a", padding: "4px", cursor: "pointer" }}><Search size={24} /></button>
                <Link href={user ? "/profile" : `/login?redirect=${encodeURIComponent(pathname)}`} style={{ color: "#0f172a", display: 'flex', alignItems: 'center' }}>
                  <User size={24} />
                </Link>
              </div>
            </>
          )}
        </div>
      </header>

      {/* HEADER 2: SECONDARY NAVIGATION STRIP (NON-STICKY, SCROLLS WITH PAGE) */}
      {(!cleanPath.startsWith('/supplier') || isSupplierLanding) && (
        <div 
          ref={subHeaderRef}
          className="desktop-only"
        style={{ 
          background: '#ffffff', 
          borderBottom: '1px solid #e2e8f0', 
          padding: '10px 0',
          position: 'relative',
          zIndex: 40
        }}
      >
          <div 
            style={{ 
              maxWidth: '1280px', 
              margin: '0 auto', 
              padding: '0 24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            {/* SUB-HEADER LEFT DROPDOWNS: DESTINATIONS & EXPLORE VAITOUR */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
              
              {/* 1. DESTINATIONS DROPDOWN BUTTON */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDestinationsOpen(!isDestinationsOpen);
                    setIsExploreOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 16px',
                    borderRadius: '10px',
                    border: isDestinationsOpen ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                    background: isDestinationsOpen ? '#f0f9ff' : '#ffffff',
                    color: isDestinationsOpen ? '#0284c7' : '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  <MapPin size={15} color="#0284c7" />
                  <span>Destinations</span>
                  <ChevronDown size={14} color="#64748b" style={{ transform: isDestinationsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {isDestinationsOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '44px',
                      left: 0,
                      background: '#ffffff',
                      borderRadius: '18px',
                      boxShadow: '0 14px 40px rgba(15,23,42,0.18)',
                      border: '1px solid #e2e8f0',
                      width: '740px',
                      padding: '0',
                      zIndex: 300,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', minHeight: '320px' }}>
                      {/* LEFT COLUMN: COUNTRIES */}
                      <div style={{ width: '220px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '16px 12px' }}>
                        <div style={{ padding: '4px 12px 12px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Countries
                        </div>
                        {Array.from(new Set(featuredCities.map(c => c.country))).map(country => (
                          <div
                            key={country}
                            onMouseEnter={() => setActiveHoverCountry(country)}
                            style={{
                              padding: '10px 12px',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              fontWeight: activeHoverCountry === country ? 700 : 600,
                              color: activeHoverCountry === country ? '#0284c7' : '#475569',
                              background: activeHoverCountry === country ? '#e0f2fe' : 'transparent',
                              transition: 'all 0.2s',
                              marginBottom: '4px',
                              fontSize: '0.9rem'
                            }}
                          >
                            {country}
                          </div>
                        ))}
                      </div>

                      {/* RIGHT COLUMN: CITIES */}
                      <div style={{ flex: 1, padding: '16px 16px', background: '#ffffff' }}>
                        <div style={{ padding: '4px 8px 12px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Featured Destinations
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                          {featuredCities.filter(c => c.country === activeHoverCountry).map((city) => (
                            <Link
                              key={city.slug}
                              href={`/destinations/${city.slug}`}
                              onClick={() => setIsDestinationsOpen(false)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                transition: 'background 0.2s',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#e2e8f0' }}>
                                {city.hero_image && (
                                  <Image src={city.hero_image} alt={city.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}  width={100} height={100} />
                                )}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{city.name}</span>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{city.country}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', padding: '12px 16px', background: '#ffffff' }}>

                    </div>
                  </div>
                )}
              </div>

              {/* 2. EXPLORE VAITOUR DROPDOWN BUTTON */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExploreOpen(!isExploreOpen);
                    setIsDestinationsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 16px',
                    borderRadius: '10px',
                    border: isExploreOpen ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                    background: isExploreOpen ? '#f5f3ff' : '#ffffff',
                    color: isExploreOpen ? '#7c3aed' : '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  <Compass size={15} color="#7c3aed" />
                  <span>Explore Vaitour</span>
                  <ChevronDown size={14} color="#64748b" style={{ transform: isExploreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {isExploreOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '44px',
                      left: 0,
                      background: '#ffffff',
                      borderRadius: '18px',
                      boxShadow: '0 14px 40px rgba(15,23,42,0.18)',
                      border: '1px solid #e2e8f0',
                      width: '250px',
                      padding: '10px 0',
                      zIndex: 300
                    }}
                  >
                    <Link
                      href="/community"
                      onClick={() => setIsExploreOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.85rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                    >
                      <MessageSquare size={15} color="#0284c7" /> Community Forum
                    </Link>
                    <Link
                      href="/loyalty"
                      onClick={() => setIsExploreOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.85rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                    >
                      <Award size={15} color="#059669" /> Loyalty & Rewards
                    </Link>
                    <Link
                      href="/ai-planner"
                      onClick={() => setIsExploreOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.85rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                    >
                      <Sparkles size={15} color="#7c3aed" /> AI Itinerary Studio
                    </Link>
                    <Link
                      href="/blog"
                      onClick={() => setIsExploreOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.85rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                    >
                      <FileText size={15} color="#dc2626" /> Travel Journal & Guides
                    </Link>
                  </div>
                )}
              </div>

            </div>

            {/* SECOND HEADER RIGHT ACTIONS: ONLY ICONS WITH UNIFORM PROFESSIONAL COLOR (#475569) & BLUE FLOATING TOOLTIPS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              
              {/* MY BOOKINGS ICON */}
              <Link 
                href="/my-bookings" 
                aria-label="My Bookings" 
                style={{ textDecoration: 'none', position: 'relative' }}
                onMouseEnter={() => setActiveTooltip('BOOKINGS')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <div 
                  style={{ 
                    cursor: 'pointer', 
                    background: '#f8fafc', 
                    padding: '9px', 
                    borderRadius: '50%', 
                    border: '1px solid #cbd5e1', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Calendar size={17} color="#475569" />
                </div>

                {activeTooltip === 'BOOKINGS' && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '46px', 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      background: '#0284c7', 
                      color: '#ffffff', 
                      fontSize: '0.72rem', 
                      fontWeight: 700, 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      whiteSpace: 'nowrap', 
                      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)', 
                      pointerEvents: 'none', 
                      zIndex: 250 
                    }}
                  >
                    My Bookings
                  </div>
                )}
              </Link>

              {/* COMPARE ICON */}
              <Link 
                href="/compare" 
                aria-label="Compare" 
                style={{ textDecoration: 'none', position: 'relative' }}
                onMouseEnter={() => setActiveTooltip('COMPARE')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <div 
                  style={{ 
                    cursor: 'pointer', 
                    background: '#f8fafc', 
                    padding: '9px', 
                    borderRadius: '50%', 
                    border: '1px solid #cbd5e1', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s'
                  }}
                >
                  <ArrowRightLeft size={17} color="#475569" />
                </div>

                {activeTooltip === 'COMPARE' && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '46px', 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      background: '#0284c7', 
                      color: '#ffffff', 
                      fontSize: '0.72rem', 
                      fontWeight: 700, 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      whiteSpace: 'nowrap', 
                      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)', 
                      pointerEvents: 'none', 
                      zIndex: 250 
                    }}
                  >
                    Compare
                  </div>
                )}
              </Link>

              {/* BELL / NOTIFICATIONS ICON */}
              <Link 
                href="/notifications" 
                aria-label="Notifications" 
                style={{ textDecoration: 'none', position: 'relative' }}
                onMouseEnter={() => setActiveTooltip('NOTIFICATIONS')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <div 
                  style={{ 
                    position: 'relative', 
                    cursor: 'pointer', 
                    background: '#f8fafc', 
                    padding: '9px', 
                    borderRadius: '50%', 
                    border: '1px solid #cbd5e1', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s' 
                  }}
                >
                  <Bell size={17} color="#475569" />
                  {unreadNotifications > 0 && (
                    <span 
                      style={{ 
                        position: 'absolute', 
                        top: '-3px', 
                        right: '-3px', 
                        background: '#e11d48', 
                        color: '#ffffff', 
                        fontSize: '0.62rem', 
                        fontWeight: 800, 
                        borderRadius: '50%', 
                        width: '16px', 
                        height: '16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}
                    >
                      {unreadNotifications}
                    </span>
                  )}
                </div>

                {activeTooltip === 'NOTIFICATIONS' && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '46px', 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      background: '#0284c7', 
                      color: '#ffffff', 
                      fontSize: '0.72rem', 
                      fontWeight: 700, 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      whiteSpace: 'nowrap', 
                      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)', 
                      pointerEvents: 'none', 
                      zIndex: 250 
                    }}
                  >
                    Notifications
                  </div>
                )}
              </Link>

            </div>
          </div>
        </div>
      )}



              {/* MOBILE DRAWER / BOTTOM SHEET */}
        {isMobileMenuOpen && typeof document !== 'undefined' && createPortal(
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} className="mobile-only">
            {/* Backdrop */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', transition: 'opacity 0.3s' }} onClick={() => setIsMobileMenuOpen(false)} />
            
            {/* Sheet Content */}
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: '85vh', 
              background: '#fff', 
              borderTopLeftRadius: '24px', 
              borderTopRightRadius: '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
            }}>
              
              {/* Drag Handle & Header */}
              <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '16px' }} />
                <div style={{ width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Image src="/logo.png" alt="Vaitour Logo" width={24} height={24} style={{ width: '24px', height: '24px', objectFit: 'contain' }} /><span style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1 }} className="gradient-text">Vaitour</span></div>
                  <button onClick={() => setIsMobileMenuOpen(false)} style={{ position: 'absolute', right: 0, background: 'none', border: 'none', padding: '4px' }}>
                    <X size={24} color="#64748b" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', width: '100%' }}>
                <button 
                  onClick={() => setMobileTab('where')}
                  style={{ 
                    flex: 1, 
                    padding: '12px 0', 
                    background: 'none', 
                    border: 'none', 
                    borderBottom: mobileTab === 'where' ? '2px solid #f97316' : '2px solid transparent',
                    color: mobileTab === 'where' ? '#f97316' : '#64748b',
                    fontWeight: mobileTab === 'where' ? 700 : 500,
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}>
                  Where to go
                </button>
                <button 
                  onClick={() => setMobileTab('explore')}
                  style={{ 
                    flex: 1, 
                    padding: '12px 0', 
                    background: 'none', 
                    border: 'none', 
                    borderBottom: mobileTab === 'explore' ? '2px solid #f97316' : '2px solid transparent',
                    color: mobileTab === 'explore' ? '#f97316' : '#64748b',
                    fontWeight: mobileTab === 'explore' ? 700 : 500,
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}>
                  Explore Vaitour
                </button>
              </div>

              {/* Tab Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '40px' }}>
                {mobileTab === 'where' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Country Tags — rounded pill style, dynamic */}
                    {(() => {
                      const countries = Array.from(new Set(featuredCities.map(c => c.country)));
                      const activeCountry = mobileSelectedCountry || countries[0];
                      return (
                        <>
                          {/* Country Pills */}
                          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                            {countries.map((country) => {
                              const isActive = activeCountry === country;
                              return (
                                <button
                                  key={String(country)}
                                  onClick={() => setMobileSelectedCountry(String(country))}
                                  style={{
                                    flexShrink: 0,
                                    padding: '8px 18px',
                                    borderRadius: '50px',
                                    border: isActive ? '2px solid #f97316' : '2px solid #e2e8f0',
                                    background: isActive ? '#fff7ed' : '#f8fafc',
                                    color: isActive ? '#f97316' : '#475569',
                                    fontSize: '0.9rem',
                                    fontWeight: isActive ? 700 : 500,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {String(country)}
                                </button>
                              );
                            })}
                          </div>

                          {/* Destinations for selected country */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {featuredCities.filter(c => c.country === activeCountry).map(city => (
                              <Link
                                key={city.id}
                                href={`/destinations/${city.slug}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#1e293b', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}
                              >
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#e2e8f0' }}>
                                  {(city.hero_image || city.image_url) ? (
                                    <Image src={city.hero_image || city.image_url} alt={city.name} width={38} height={38} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #f97316, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>
                                      {city.name?.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <span style={{ fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.3 }}>{city.name}</span>
                              </Link>
                            ))}
                          </div>
                        </>
                      );
                    })()}

                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px', color: '#0f172a' }}>Things to do</h4>
                    
                    <Link href="/tours" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Compass size={20} color="#f97316" />
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>Tours & experiences</span>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </Link>
                    
                    <Link href="/community" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MessageSquare size={20} color="#0284c7" />
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>Community Forum</span>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </Link>
                    
                    <Link href="/loyalty" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Award size={20} color="#059669" />
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>Loyalty & Rewards</span>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </Link>
                    
                    <Link href="/ai-planner" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sparkles size={20} color="#7c3aed" />
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>AI Itinerary Studio</span>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </Link>
                    
                    <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={20} color="#dc2626" />
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>Travel Journal & Guides</span>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </Link>
                    
                    <Link href="/supplier" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: '#0f172a', marginTop: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ShieldCheck size={20} color="#10b981" />
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>Supplier Portal</span>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </Link>

                    {/* Footer Settings */}
                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                       <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Preferences</span>
                       <CurrencyLanguageDropdown />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ), document.body)}
      </>
    );
}
