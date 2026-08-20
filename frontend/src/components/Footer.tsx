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
            {/* COLUMN 2: QUICK LINKS */}
            <div>
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

          
          {/* PAYMENT CHANNELS */}
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '30px', paddingBottom: '30px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Payment channels
            </h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Visa */}
              <div style={{ background: '#1e293b', color: '#f8fafc', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.82rem', display: 'flex', alignItems: 'center', height: '34px', border: '1px solid #334155', letterSpacing: '1px' }}>
                <span style={{ color: '#38bdf8', marginRight: '4px' }}>💳</span> VISA
              </div>
              {/* Mastercard */}
              <div style={{ background: '#1e293b', color: '#f8fafc', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.82rem', display: 'flex', alignItems: 'center', height: '34px', border: '1px solid #334155', gap: '6px' }}>
                <span style={{ color: '#f59e0b' }}>●</span><span style={{ color: '#ef4444' }}>●</span> mastercard
              </div>
              {/* Amex */}
              <div style={{ background: '#1e293b', color: '#f8fafc', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.82rem', display: 'flex', alignItems: 'center', height: '34px', border: '1px solid #334155' }}>
                AMEX
              </div>
              {/* JCB */}
              <div style={{ background: '#1e293b', color: '#f8fafc', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.82rem', display: 'flex', alignItems: 'center', height: '34px', border: '1px solid #334155' }}>
                JCB
              </div>
              {/* UnionPay */}
              <div style={{ background: '#1e293b', color: '#f8fafc', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.82rem', display: 'flex', alignItems: 'center', height: '34px', border: '1px solid #334155' }}>
                UnionPay
              </div>
              {/* Discover */}
              <div style={{ background: '#1e293b', color: '#f8fafc', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.82rem', display: 'flex', alignItems: 'center', height: '34px', border: '1px solid #334155' }}>
                DISCOVER
              </div>
              {/* Diners Club */}
              <div style={{ background: '#1e293b', color: '#f8fafc', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.82rem', display: 'flex', alignItems: 'center', height: '34px', border: '1px solid #334155' }}>
                Diners Club
              </div>
              {/* Apple Pay */}
              <div style={{ background: '#1e293b', color: '#f8fafc', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', height: '34px', border: '1px solid #334155' }}>
                 Pay
              </div>
              {/* Google Pay */}
              <div style={{ background: '#1e293b', color: '#f8fafc', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.82rem', display: 'flex', alignItems: 'center', height: '34px', border: '1px solid #334155', gap: '4px' }}>
                <span style={{ color: '#38bdf8' }}>G</span> Pay
              </div>
              {/* PayPal */}
              <div style={{ background: '#1e293b', color: '#f8fafc', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.82rem', display: 'flex', alignItems: 'center', height: '34px', border: '1px solid #334155', fontStyle: 'italic' }}>
                PayPal
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
