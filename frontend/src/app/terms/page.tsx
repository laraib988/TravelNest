'use client';

import { FileText, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px 80px' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>
          Terms of Service
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Effective Date: August 2026</p>
      </div>

      <div className="card-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>1. Marketplace OTA Platform Agreement</h3>
        <p style={{ marginBottom: '24px' }}>
          TravelNest operates as an online travel agency marketplace connecting travelers with third-party verified local tour operators and experience suppliers. By placing a booking, you agree to follow supplier meeting point rules and safety guidelines.
        </p>

        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>2. E-Vouchers & Check-In</h3>
        <p style={{ marginBottom: '24px' }}>
          Upon payment confirmation, an electronic QR voucher is issued under My Bookings. Travelers must present either a printed PDF or digital QR code to the supplier's check-in desk on-site.
        </p>

        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>3. Supplier Verification Guarantee</h3>
        <p style={{ margin: 0 }}>
          All suppliers listing experiences on TravelNest undergo mandatory KYC document verification, trade license validation, and public liability insurance checks before listings are approved.
        </p>
      </div>

    </div>
  );
}
