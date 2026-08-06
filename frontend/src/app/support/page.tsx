'use client';

import Link from 'next/link';
import { HelpCircle, Search, FileText, RefreshCw, ShieldCheck, MessageSquare } from 'lucide-react';

export default function SupportPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 80px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <HelpCircle size={14} /> TravelNest Help Center
        </div>
        <h1 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: 800, marginBottom: '12px' }}>
          How Can We Help You Today?
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
          Find instant answers about bookings, e-vouchers, cancellation policies, and 24/7 AI Concierge support.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '60px' }}>
        <Link href="/bookings" style={{ textDecoration: 'none' }}>
          <div className="card-panel card-interactive" style={{ padding: '28px' }}>
            <FileText size={32} color="var(--brand-primary)" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>Manage Bookings & QR Vouchers</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>View booking status, download PDF vouchers, or view check-in QR codes.</p>
          </div>
        </Link>

        <Link href="/cancellation-policy" style={{ textDecoration: 'none' }}>
          <div className="card-panel card-interactive" style={{ padding: '28px' }}>
            <RefreshCw size={32} color="#059669" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>Cancellations & Refunds</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>Learn about FREE 24-hour cancellations and automatic refund calculations.</p>
          </div>
        </Link>

        <Link href="/faq" style={{ textDecoration: 'none' }}>
          <div className="card-panel card-interactive" style={{ padding: '28px' }}>
            <HelpCircle size={32} color="#7c3aed" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>Frequently Asked Questions</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>Browse common questions about tour meeting points, weather, and payments.</p>
          </div>
        </Link>
      </div>

      <div className="card-panel" style={{ padding: '36px', background: 'linear-gradient(135deg, rgba(2,132,199,0.05) 0%, rgba(124,58,237,0.05) 100%)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        <MessageSquare size={36} color="var(--brand-primary)" style={{ marginBottom: '12px' }} />
        <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '10px' }}>Need Live AI Assistance?</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', maxWidth: '600px', margin: '0 auto 24px' }}>
          Our 24/7 AI Concierge Bot can instantly verify your booking status, guide details, and cancellation rules.
        </p>
        <Link href="/ai-planner" className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
          Open AI Concierge Chat
        </Link>
      </div>

    </div>
  );
}
