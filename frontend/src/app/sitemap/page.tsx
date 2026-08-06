'use client';

import Link from 'next/link';
import { Compass, MapPin, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export default function SitemapPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px 80px' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>
          TravelNest HTML Sitemap
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Complete directory of all marketplace pages, destinations, and supplier portals.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
        
        <div className="card-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '16px', fontWeight: 700 }}>Marketplace Core</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: '#0284c7' }}>
            <li><Link href="/">Home Storefront</Link></li>
            <li><Link href="/ai-planner">AI Trip Planner Studio</Link></li>
            <li><Link href="/checkout">Checkout & Cart</Link></li>
            <li><Link href="/bookings">My Bookings & QR Vouchers</Link></li>
          </ul>
        </div>

        <div className="card-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '16px', fontWeight: 700 }}>Top Destinations</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: '#0284c7' }}>
            <li><Link href="/destinations/bali">Bali, Indonesia</Link></li>
            <li><Link href="/destinations/tokyo">Tokyo, Japan</Link></li>
            <li><Link href="/destinations/paris">Paris, France</Link></li>
          </ul>
        </div>

        <div className="card-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '16px', fontWeight: 700 }}>Supplier & Admin</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: '#0284c7' }}>
            <li><Link href="/supplier/apply">Become a Supplier</Link></li>
            <li><Link href="/supplier">Supplier Portal</Link></li>
            <li><Link href="/supplier/kyc">Supplier KYC Verification</Link></li>
            <li><Link href="/admin/suppliers">Admin Verification Queue</Link></li>
          </ul>
        </div>

        <div className="card-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '16px', fontWeight: 700 }}>Support & Policies</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: '#0284c7' }}>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/support">Help & Support</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/cancellation-policy">Cancellation Policy</Link></li>
            <li><Link href="/refund-policy">Refund Policy</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>

      </div>

    </div>
  );
}
