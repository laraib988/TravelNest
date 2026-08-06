'use client';

import { CreditCard, CheckCircle } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px 80px' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>
          Refund Policy
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fast & Transparent Automatic Refund Processing</p>
      </div>

      <div className="card-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>1. Refund Processing Timeline</h3>
        <p style={{ marginBottom: '24px' }}>
          Once a cancellation is approved, refunds are credited automatically back to your original payment method (Credit Card, Apple Pay, Google Pay, PayPal, JazzCash, Easypaisa) within <strong>2 to 5 business days</strong> depending on your bank.
        </p>

        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>2. Request-Based Tour Rejections</h3>
        <p style={{ marginBottom: '24px' }}>
          For non-instant request-based bookings, if a supplier cannot confirm your slot within the 24-hour SLA window, your held funds are automatically released back to your account immediately with zero deduction.
        </p>

        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>3. Disputed Service Quality</h3>
        <p style={{ margin: 0 }}>
          If an experience fails to deliver what was promised (e.g. guide absent, itinerary missed), submit a support ticket within 48 hours of your activity date for Admin mediation and full refund review.
        </p>
      </div>

    </div>
  );
}
