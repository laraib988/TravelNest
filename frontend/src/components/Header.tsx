'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  MapPin,
  LogOut,
  ChevronDown,
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
  LayoutDashboard
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
  const cleanPath = pathname?.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '';
  if (cleanPath.startsWith('/admin') || cleanPath.startsWith('/supplier')) {
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

  const [featuredCities, setFeaturedCities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('name, country, slug')
        .eq('is_published', true)
        .limit(8);
        
      if (!error && data) {
        setFeaturedCities(data);
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
        {/* TOP ANNOUNCEMENT BAR */}
        <div style={{ background: 'var(--brand-gradient)', color: '#ffffff', padding: '6px 24px', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Sparkles size={14} /> ⚡ Flash Sale: Get 15% off Bali & Tokyo Experiences with code <strong>TRAVELNEST2026</strong>
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
            <div 
              style={{ 
                background: 'var(--brand-gradient)', 
                padding: '9px', 
                borderRadius: '14px', 
                display: 'flex', 
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' 
              }}
            >
              <Compass size={22} color="#ffffff" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }} className="gradient-text">
                TravelNest
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                Marketplace OTA
              </span>
            </div>
          </Link>

          {/* CENTER IS EMPTY */}
          <div style={{ flex: 1 }} />

          {/* RIGHT: NAVIGATION LINKS, CURRENCY & 2 SEPARATE AUTH BUTTONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            
            {/* PRIMARY NAVIGATION LINKS */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link 
                href="/ai-planner" 
                className="btn-primary" 
                style={{ padding: '8px 18px', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                {t('ai_trip_studio')}
              </Link>
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
            <CurrencyLanguageDropdown />

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
                  <img src={user.avatar} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
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
                      href="/admin"
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
      </header>

      {/* HEADER 2: SECONDARY NAVIGATION STRIP (NON-STICKY, SCROLLS WITH PAGE) */}
      {!pathname.startsWith('/supplier') && (
        <div 
          ref={subHeaderRef}
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
            {/* SUB-HEADER LEFT DROPDOWNS: DESTINATIONS & EXPLORE TRAVELNEST */}
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
                      width: '280px',
                      padding: '14px 0',
                      zIndex: 300
                    }}
                  >
                    <div style={{ padding: '4px 16px 8px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Featured Global Cities
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', padding: '0 10px' }}>
                      {featuredCities.map((city) => (
                        <Link
                          key={city.slug}
                          href={`/destinations/${city.slug}`}
                          onClick={() => setIsDestinationsOpen(false)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '8px 10px',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            transition: 'background 0.2s',
                            background: '#f8fafc'
                          }}
                        >
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{city.name}</span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{city.country}</span>
                        </Link>
                      ))}
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '10px 0' }} />

                    <Link
                      href="/destinations"
                      onClick={() => setIsDestinationsOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#0284c7',
                        textDecoration: 'none'
                      }}
                    >
                      <span>View All Destinations</span>
                      <span>→</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 2. EXPLORE TRAVELNEST DROPDOWN BUTTON */}
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
                  <span>Explore TravelNest</span>
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
      {/* Removed AuthModal */}
    </>
  );
}
