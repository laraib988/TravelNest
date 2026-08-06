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
  ChevronDown
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
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* LOGO */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ background: 'var(--brand-gradient)', padding: '10px', borderRadius: '14px', display: 'flex', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}>
              <Compass size={24} color="#fff" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, lineHeight: 1 }} className="gradient-text">TravelNest</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Marketplace OTA</span>
            </div>
          </Link>

          {/* MAIN NAV LINKS WITH TRANSLATIONS */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/destinations/bali" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
              <MapPin size={16} color="var(--brand-primary)" /> {t('destinations')}
            </Link>
            <Link href="/ai-planner" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
              <Sparkles size={16} /> {t('ai_trip_studio')}
            </Link>
            <Link href="/blog" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
              <Compass size={16} color="#7c3aed" /> {t('travel_journal')}
            </Link>
            <Link href="/supplier" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
              <ShieldCheck size={16} color="#059669" /> {t('supplier_portal')}
            </Link>
          </nav>

          {/* RIGHT SIDE UTILITIES & AUTH */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* CURRENCY & LANGUAGE DROPDOWN MATCHING SCREENSHOT */}
            <CurrencyLanguageDropdown />

            {/* WISHLIST */}
            <Link href="/bookings" style={{ textDecoration: 'none' }}>
              <div style={{ position: 'relative', cursor: 'pointer', background: 'var(--bg-subtle)', padding: '9px', borderRadius: '50%', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={18} color="var(--text-secondary)" />
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--brand-accent)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
              </div>
            </Link>

            {/* AUTHENTICATION CONTROL */}
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
                    border: '1px solid var(--border-light)',
                    background: '#ffffff',
                    cursor: 'pointer',
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
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      border: '1px solid var(--border-light)',
                      width: '200px',
                      padding: '8px 0',
                      zIndex: 100,
                    }}
                  >
                    <Link
                      href="/bookings"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: '0.88rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                    >
                      📁 {t('my_bookings')}
                    </Link>
                    <Link
                      href="/supplier/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: '0.88rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                    >
                      🛡️ {t('supplier_portal')}
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
                        gap: '6px',
                      }}
                    >
                      <LogOut size={14} /> {t('sign_out')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('LOGIN')}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.88rem', fontWeight: 700, borderRadius: 'var(--radius-pill)' }}
              >
                {t('sign_in')} / {t('sign_up')}
              </button>
            )}

          </div>

        </div>
      </header>

      <AuthModal />
    </>
  );
}
