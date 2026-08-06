'use client';

import { Clock, RefreshCw, ShieldCheck } from 'lucide-react';

export default function CancellationPolicyPage() {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px 80px' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <div className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <Clock size={14} /> FREE Cancellation Guarantee
        </div>
        <h1 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>
          Cancellation Policy
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Flexible Travel Booking Guarantee</p>
      </div>

      <div className="card-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>1. Standard 24-Hour Free Cancellation</h3>
        <p style={{ marginBottom: '24px' }}>
          Most experiences on TravelNest feature a FREE 24-hour cancellation policy. You can cancel your booking up to 24 hours before the scheduled activity start time for a 100% full refund with no penalty fees.
        </p>

        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>2. How to Request Cancellation</h3>
        <p style={{ marginBottom: '24px' }}>
          Go to <strong>My Bookings</strong> in your account menu, locate your upcoming tour, and click <strong>Cancel Booking</strong>. Our system will instantly process your cancellation and calculate your refund according to the listing policy.
        </p>

        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>3. Weather & Severe Conditions</h3>
        <p style={{ margin: 0 }}>
          In the event of extreme weather (typhoons, severe sea conditions for cruises), the local supplier will offer a rescheduled slot or an immediate 100% full refund regardless of the standard cut-off time.
        </p>
      </div>

    </div>
  );
}
