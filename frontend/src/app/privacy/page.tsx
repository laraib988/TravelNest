'use client';

import { ShieldCheck, Lock, Eye } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px 80px' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <div className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <ShieldCheck size={14} /> GDPR & PCI-DSS Compliant
        </div>
        <h1 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>
          TravelNest Privacy Policy
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Last updated: August 2026</p>
      </div>

      <div className="card-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>1. Information We Collect</h3>
        <p style={{ marginBottom: '24px' }}>
          We collect personal details necessary to fulfill tour bookings and maintain platform security: full name, email address, phone number, payment details (tokenized via PCI-DSS compliant gateways like Stripe), and optional passport details for verified ID attractions.
        </p>

        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>2. How We Use Your Data</h3>
        <p style={{ marginBottom: '24px' }}>
          Your data is strictly utilized to process bookings, generate e-vouchers, send transactional SMS/email reminders, and power personalized AI trip recommendations. We never sell your personal information to third parties.
        </p>

        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>3. Supplier & KYC Document Privacy</h3>
        <p style={{ marginBottom: '24px' }}>
          All uploaded supplier verification documents (trade licenses, tax certificates, government IDs) are stored securely in private Cloudinary media buckets using signed URLs. Documents are accessible strictly by authorized Admin compliance officers.
        </p>

        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>4. Your Rights (GDPR & Data Erasure)</h3>
        <p style={{ margin: 0 }}>
          You have the right to request a full copy of your stored data or demand permanent erasure of your account under GDPR regulations by emailing privacy@travelnest.com.
        </p>
      </div>

    </div>
  );
}
