'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Heart,
  MapPin,
  LogOut,
  ChevronDown,
  Bell,
  User,
  Calendar,
  Settings,
  MessageSquare,
  Award,
  ShoppingCart,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import CurrencyLanguageDropdown from './CurrencyLanguageDropdown';
import AuthModal from './AuthModal';

export default function Header() {
  const { user, openAuthModal, logout } = useAuth();
  const { t } = useCurrency();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <header 
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 50, 
          background: 'rgba(255, 255, 255, 0.94)', 
          backdropFilter: 'blur(16px)', 
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
        }}
      >
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

          {/* CENTER: MAIN NAVIGATION LINKS */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link 
              href="/destinations" 
              className="btn-secondary" 
              style={{ padding: '9px 18px', fontSize: '0.88rem', fontWeight: 600, border: '1px solid #e2e8f0', background: '#f8fafc', whiteSpace: 'nowrap' }}
            >
              {t('destinations')}
            </Link>
            <Link 
              href="/ai-planner" 
              className="btn-primary" 
              style={{ padding: '9px 20px', fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              {t('ai_trip_studio')}
            </Link>
            <Link 
              href="/blog" 
              className="btn-secondary" 
              style={{ padding: '9px 18px', fontSize: '0.88rem', fontWeight: 600, border: '1px solid #e2e8f0', background: '#f8fafc', whiteSpace: 'nowrap' }}
            >
              {t('travel_journal')}
            </Link>
            <Link 
              href="/supplier" 
              className="btn-secondary" 
              style={{ padding: '9px 18px', fontSize: '0.88rem', fontWeight: 600, border: '1px solid #e2e8f0', background: '#f8fafc', whiteSpace: 'nowrap' }}
            >
              {t('supplier_portal')}
            </Link>
          </nav>

          {/* RIGHT: UTILITY ICONS & USER AUTH ACTION */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            
            {/* CURRENCY & LANGUAGE SELECTOR DROPDOWN */}
            <CurrencyLanguageDropdown />

            {/* DIVIDER */}
            <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />

            {/* CART */}
            <Link href="/cart" aria-label="Cart" style={{ textDecoration: 'none' }}>
              <div 
                style={{ 
                  position: 'relative', 
                  cursor: 'pointer', 
                  background: '#f8fafc', 
                  padding: '9px', 
                  borderRadius: '50%', 
                  border: '1px solid #e2e8f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <ShoppingCart size={18} color="#475569" />
                <span 
                  style={{ 
                    position: 'absolute', 
                    top: '-3px', 
                    right: '-3px', 
                    background: 'var(--brand-primary)', 
                    color: '#ffffff', 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    borderRadius: '50%', 
                    width: '16px', 
                    height: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                >
                  2
                </span>
              </div>
            </Link>

            {/* WISHLIST */}
            <Link href="/wishlist" aria-label="Wishlist" style={{ textDecoration: 'none' }}>
              <div 
                style={{ 
                  position: 'relative', 
                  cursor: 'pointer', 
                  background: '#f8fafc', 
                  padding: '9px', 
                  borderRadius: '50%', 
                  border: '1px solid #e2e8f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  transition: 'all 0.2s' 
                }}
              >
                <Heart size={18} color="#e11d48" fill="#e11d48" />
                <span 
                  style={{ 
                    position: 'absolute', 
                    top: '-3px', 
                    right: '-3px', 
                    background: 'var(--brand-primary)', 
                    color: '#ffffff', 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    borderRadius: '50%', 
                    width: '16px', 
                    height: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                >
                  1
                </span>
              </div>
            </Link>

            {/* NOTIFICATIONS BELL */}
            <Link href="/notifications" aria-label="Notifications" style={{ textDecoration: 'none' }}>
              <div 
                style={{ 
                  position: 'relative', 
                  cursor: 'pointer', 
                  background: '#f8fafc', 
                  padding: '9px', 
                  borderRadius: '50%', 
                  border: '1px solid #e2e8f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  transition: 'all 0.2s' 
                }}
              >
                <Bell size={18} color="#475569" />
                <span 
                  style={{ 
                    position: 'absolute', 
                    top: '-3px', 
                    right: '-3px', 
                    background: 'var(--brand-primary)', 
                    color: '#ffffff', 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    borderRadius: '50%', 
                    width: '16px', 
                    height: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                >
                  3
                </span>
              </div>
            </Link>

            {/* AUTHENTICATION ACTION: SINGLE CLEAN SIGN IN BUTTON OR USER PROFILE */}
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
                      zIndex: 100,
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
                      href="/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.88rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                    >
                      <Heart size={15} color="#e11d48" /> Wishlist
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
              <button
                onClick={() => openAuthModal('LOGIN')}
                className="btn-primary"
                style={{ 
                  padding: '9px 24px', 
                  fontSize: '0.88rem', 
                  fontWeight: 700, 
                  borderRadius: 'var(--radius-pill)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogIn size={15} /> Sign In
              </button>
            )}

          </div>

        </div>
      </header>

      <AuthModal />
    </>
  );
}
