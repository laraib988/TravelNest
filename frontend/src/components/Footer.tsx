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

export default function Footer() {
  const pathname = usePathname();
  const { t } = useCurrency();

  // On admin and supplier pages, hide the public footer
  const cleanPath = pathname?.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '';
  if (cleanPath.startsWith('/admin') || cleanPath.startsWith('/supplier')) {
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
          
          {/* MAIN 4-COLUMN FOOTER GRID */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '40px',
              paddingBottom: '50px',
            }}
          >
            {/* COLUMN 1: BRAND LOGO, DESCRIPTION & SOCIAL LINKS */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '2px solid #38bdf8', // Cohesive sky blue accent color
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                  }}
                >
                  <MapPin size={20} />
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  TravelNest Tours
                </h3>
              </div>

              <p style={{ color: '#d1d5db', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px', maxWidth: '300px' }}>
                Discover amazing destinations and create unforgettable memories with our curated travel experiences.
              </p>

              {/* SOCIAL MEDIA ICONS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', transition: 'opacity 0.2s' }} aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', transition: 'opacity 0.2s' }} aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', transition: 'opacity 0.2s' }} aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', transition: 'opacity 0.2s' }} aria-label="YouTube">
                  <Youtube size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', transition: 'opacity 0.2s' }} aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center' }} aria-label="TikTok">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* COLUMN 2: QUICK LINKS */}
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '22px' }}>
                {t('quick_links')}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
                <li><Link href="/" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('cat_all')}</Link></li>
                <li><Link href="/community" style={{ color: '#d1d5db', textDecoration: 'none' }}>Community Forum</Link></li>
                <li><Link href="/loyalty" style={{ color: '#d1d5db', textDecoration: 'none' }}>Loyalty & Rewards</Link></li>
                <li><Link href="/about" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('about_us')}</Link></li>
                {/* <li><Link href="/contact" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('contact')}</Link></li> */}
                <li><Link href="/support" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('help_support')}</Link></li>
              </ul>
            </div>

            {/* COLUMN 3: SUPPORT */}
            <div>
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

            {/* COLUMN 4: CONTACT INFO */}
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '22px' }}>
                {t('contact_info')}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '0.93rem', color: '#d1d5db' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={18} color="#38bdf8" style={{ flexShrink: 0 }} />
                  <a href="mailto:support@travelnest.com" style={{ color: '#d1d5db', textDecoration: 'none' }}>
                    support@travelnest.com
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={18} color="#38bdf8" style={{ flexShrink: 0 }} />
                  <span>+81 80-8357-2662</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', lineHeight: 1.5 }}>
                  <MapPin size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>2nd Floor, Sotoike Shukugo Building, Utsunomiya City, Tochigi.</span>
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
            © 2026 TravelNest Tours Powered by <strong style={{ color: '#ffffff' }}>Ebadah Group Co. Ltd</strong> Japan
          </div>

        </div>
      </footer>
    </>
  );
}
