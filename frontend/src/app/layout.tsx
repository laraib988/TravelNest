import './globals.css';
import Link from 'next/link';
import { Compass, Sparkles, User, ShieldCheck, Heart, MapPin, Globe, CreditCard } from 'lucide-react';

export const metadata = {
  title: 'TravelNest - Global Tours, Activities & Experiences Marketplace',
  description: 'Book top-rated tours, sunset cruises, food walks, and experiences worldwide with real-time availability and AI trip planning.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#ffffff' }}>
          {/* TOP ANNOUNCEMENT BAR */}
          <div style={{ background: 'var(--brand-gradient)', color: '#ffffff', padding: '6px 24px', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Sparkles size={14} /> ⚡ Flash Sale: Get 15% off Bali & Tokyo Experiences with code <strong>TRAVELNEST2026</strong>
          </div>

          {/* MAIN NAVBAR */}
          <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              
              {/* LOGO */}
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'var(--brand-gradient)', padding: '10px', borderRadius: '14px', display: 'flex', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}>
                  <Compass size={24} color="#fff" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: 800, lineHeight: 1 }} className="gradient-text">TravelNest</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Marketplace OTA</span>
                </div>
              </Link>

              {/* NAV BUTTONS WITH HIGHLY INTERACTIVE HOVER STATES */}
              <nav style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Link href="/destinations/bali" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                  <MapPin size={16} color="var(--brand-primary)" /> Destinations
                </Link>
                <Link href="/ai-planner" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                  <Sparkles size={16} /> AI Trip Studio
                </Link>
                <Link href="/supplier" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                  <ShieldCheck size={16} color="#059669" /> Supplier Portal
                </Link>
              </nav>

              {/* RIGHT UTILITIES */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-subtle)', padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-light)', cursor: 'pointer' }}>
                  <Globe size={14} /> USD $
                </div>
                <div style={{ position: 'relative', cursor: 'pointer', background: 'var(--bg-subtle)', padding: '9px', borderRadius: '50%', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={18} color="var(--text-secondary)" />
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--brand-accent)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                </div>
              </div>

            </div>
          </header>

          {/* MAIN CONTENT */}
          <main style={{ flex: 1 }}>{children}</main>

          {/* TRUST & FOOTER */}
          <footer style={{ marginTop: '80px', background: '#f8fafc', borderTop: '1px solid var(--border-light)', padding: '60px 24px 30px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              
              {/* TRUST BADGES STRIP */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', paddingBottom: '40px', borderBottom: '1px solid var(--border-light)', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '12px', color: 'var(--brand-primary)' }}>
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>Verified Suppliers</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AI OCR & KYC pre-screened partners</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '12px', color: '#059669' }}>
                    <Compass size={24} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>Real-Time Slot Locks</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Redis Redlock anti-overbooking guarantee</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ background: '#fffbe6', padding: '12px', borderRadius: '12px', color: '#d97706' }}>
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>Best Price Guarantee</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Zero hidden booking fees</p>
                  </div>
                </div>
              </div>

              {/* FOOTER LINKS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '40px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Compass size={20} color="var(--brand-primary)" />
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>TravelNest Marketplace</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    The world's leading AI-powered marketplace for tours, activities, boat cruises, and culinary experiences.
                  </p>
                </div>

                <div>
                  <h4 style={{ marginBottom: '16px', color: '#0f172a' }}>Destinations</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <li><Link href="/destinations/bali">Bali Catamaran & Sunset Cruises</Link></li>
                    <li><Link href="/destinations/tokyo">Tokyo Shinjuku Izakaya Food Walks</Link></li>
                    <li><Link href="/destinations/paris">Paris Skip-the-Line Louvre Passes</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 style={{ marginBottom: '16px', color: '#0f172a' }}>Supplier & Architecture</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <li><Link href="/supplier">Supplier Portal & KYC Engine</Link></li>
                    <li><Link href="/supplier/kyc">AI Pre-Screening Document Scanner</Link></li>
                    <li><Link href="/blog/bali-top-10-guide">SEO Content ↔ Live Marketplace Widgets</Link></li>
                  </ul>
                </div>
              </div>

              <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-light)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                © 2026 TravelNest Inc. All rights reserved. Built with Next.js 14 App Router, NestJS API Gateway & PostgreSQL 16.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
