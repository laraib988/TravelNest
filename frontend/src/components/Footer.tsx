'use client';

import Link from 'next/link';
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';
import CurrencyLanguageDropdown from './CurrencyLanguageDropdown';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useCurrency();

  // On admin and supplier pages, hide the public footer
  const cleanPath = pathname?.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '';
  const isSupplierLanding = cleanPath === '/supplier';
  if (cleanPath.startsWith('/admin-portal') || (cleanPath.startsWith('/supplier') && !isSupplierLanding)) {
    return null;
  }

  return (
    <>
      <footer
        style={{
          background: '#0f172a', // Cohesive premium dark navy blue background matching the website's slate/blue theme
          color: '#ffffff',
          paddingTop: '60px',
          paddingBottom: '40px',
          fontFamily: 'inherit',
          borderTop: '1px solid #1e293b',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* MAIN FOOTER GRID */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '40px',
              paddingBottom: '50px',
            }}
          >
            {/* COLUMN 1: QUICK LINKS */}
            <div style={{ flex: '1 1 200px' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '22px' }}>
                {t('quick_links')}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
                <li><Link href="/community" style={{ color: '#d1d5db', textDecoration: 'none' }}>Community Forum</Link></li>
                <li><Link href="/loyalty" style={{ color: '#d1d5db', textDecoration: 'none' }}>Loyalty & Rewards</Link></li>
                <li><Link href="/blog" style={{ color: '#d1d5db', textDecoration: 'none' }}>Travel Journal</Link></li>
                <li><Link href="/ai-planner" style={{ color: '#d1d5db', textDecoration: 'none' }}>AI Trip Studio</Link></li>
                <li><Link href="/supplier" style={{ color: '#d1d5db', textDecoration: 'none' }}>Supplier Portal</Link></li>
                <li><Link href="/about" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('about_us')}</Link></li>
                <li><Link href="/support" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('help_support')}</Link></li>
              </ul>
            </div>

            {/* COLUMN 2: SUPPORT */}
            <div style={{ flex: '1 1 200px' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '22px' }}>
                {t('support')}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
                <li><Link href="/privacy" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('privacy_policy')}</Link></li>
                <li><Link href="/terms" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('terms_service')}</Link></li>
                <li><Link href="/cancellation-policy" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('cancellation_policy')}</Link></li>
                <li><Link href="/refund-policy" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('refund_policy')}</Link></li>
                <li><Link href="/faq" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('faq')}</Link></li>
                <li><Link href="/sitemap" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('sitemap')}</Link></li>
              </ul>
            </div>

            {/* COLUMN 3: PREFERENCES (MOBILE ONLY) */}
            <div className="mobile-only" style={{ flex: '1 1 200px' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '22px' }}>
                Preferences
              </h4>
              <CurrencyLanguageDropdown direction="up" />
            </div>

            {/* COLUMN 4: PAYMENT CHANNELS */}
            <div style={{ flex: '1 1 380px', maxWidth: '380px' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '22px' }}>
                Payment Channels
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {/* Row 1 */}
                <div style={{ background: '#1e293b', color: '#f8fafc', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px', border: '1px solid #334155', whiteSpace: 'nowrap' }}>
                  VISA
                </div>
                <div style={{ background: '#1e293b', color: '#f8fafc', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px', border: '1px solid #334155', gap: '3px', whiteSpace: 'nowrap' }}>
                  <span style={{ color: '#f59e0b' }}>●</span><span style={{ color: '#ef4444' }}>●</span> mc
                </div>
                <div style={{ background: '#1e293b', color: '#f8fafc', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px', border: '1px solid #334155', whiteSpace: 'nowrap' }}>
                  AMEX
                </div>
                <div style={{ background: '#1e293b', color: '#f8fafc', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px', border: '1px solid #334155', whiteSpace: 'nowrap' }}>
                  JCB
                </div>
                <div style={{ background: '#1e293b', color: '#f8fafc', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px', border: '1px solid #334155', whiteSpace: 'nowrap' }}>
                  UPI
                </div>
                
                {/* Row 2 */}
                <div style={{ background: '#1e293b', color: '#f8fafc', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px', border: '1px solid #334155', whiteSpace: 'nowrap' }}>
                  DISCOVER
                </div>
                <div style={{ background: '#1e293b', color: '#f8fafc', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.62rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px', border: '1px solid #334155', textAlign: 'center', lineHeight: 1.1 }}>
                  Diners
                </div>
                <div style={{ background: '#1e293b', color: '#f8fafc', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px', border: '1px solid #334155', whiteSpace: 'nowrap' }}>
                   Pay
                </div>
                <div style={{ background: '#1e293b', color: '#f8fafc', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px', border: '1px solid #334155', whiteSpace: 'nowrap' }}>
                  G Pay
                </div>
                <div style={{ background: '#1e293b', color: '#f8fafc', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px', border: '1px solid #334155', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                  PayPal
                </div>
              </div>
            </div>

          </div>

          
          {/* BOTTOM COPYRIGHT BAR */}
          <div
            style={{
              borderTop: '1px solid #1e293b',
              paddingTop: '28px',
              textAlign: 'center',
              fontSize: '0.95rem',
              color: '#ffffff',
              fontWeight: 600,
            }}
          >
            © 2026 Vaitour Tours Powered by <strong style={{ color: '#ffffff' }}>Ebadah Group Co. Ltd</strong> Japan
          </div>

        </div>
      </footer>
    </>
  );
}
