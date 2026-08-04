'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFromAPI } from '@/lib/api-client';
import { ShieldCheck, AlertTriangle, FileText, DollarSign, Calendar, CheckCircle2, ArrowRight, TrendingUp, BarChart2 } from 'lucide-react';

export default function SupplierDashboardPage() {
  const supplierId = 'sup-oceanic-tours';
  const [kycStatus, setKycStatus] = useState<any>(null);
  const [ledger, setLedger] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggeringPayout, setTriggeringPayout] = useState(false);

  useEffect(() => {
    async function loadSupplierData() {
      try {
        const [kycRes, ledgerRes, payoutsRes, bookingsRes] = await Promise.all([
          fetchFromAPI(`/kyc/${supplierId}`),
          fetchFromAPI(`/payouts/ledger/${supplierId}`),
          fetchFromAPI(`/payouts/history/${supplierId}`),
          fetchFromAPI(`/bookings/supplier/list`),
        ]);
        setKycStatus(kycRes);
        setLedger(ledgerRes);
        setPayouts(payoutsRes);
        setBookings(bookingsRes);
      } catch (err) {
        console.error('Error loading supplier portal data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSupplierData();
  }, [supplierId]);

  const handleTriggerPayout = async () => {
    setTriggeringPayout(true);
    try {
      await fetchFromAPI('/payouts/trigger-run', {
        method: 'POST',
        body: JSON.stringify({ supplier_id: supplierId }),
      });
      const [ledgerRes, payoutsRes] = await Promise.all([
        fetchFromAPI(`/payouts/ledger/${supplierId}`),
        fetchFromAPI(`/payouts/history/${supplierId}`),
      ]);
      setLedger(ledgerRes);
      setPayouts(payoutsRes);
      alert('Payout successfully scheduled & paid out via Stripe Connect!');
    } catch (err: any) {
      alert(err.message || 'Payout trigger error');
    } finally {
      setTriggeringPayout(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Supplier Portal Dashboard...</div>;
  }

  const chartMonths = [
    { month: 'Apr', revenue: 1200 },
    { month: 'May', revenue: 1850 },
    { month: 'Jun', revenue: 2400 },
    { month: 'Jul', revenue: 3100 },
    { month: 'Aug', revenue: 4200 },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 24px', background: '#ffffff' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '6px', color: '#0f172a' }}>Supplier Portal & Financial Analytics</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Oceanic Horizon Voyages Ltd • Partner Account ID: {supplierId}</p>
        </div>
        <Link href="/supplier/kyc" className="btn-secondary">
          <FileText size={18} /> Manage KYC Documents
        </Link>
      </div>

      {/* KYC STATUS STATE MACHINE BANNER */}
      <div className="card-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '40px', borderLeft: `6px solid ${kycStatus?.status === 'APPROVED' ? '#059669' : '#d97706'}`, background: '#ffffff', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>KYC Verification State Machine</span>
              <span className={kycStatus?.status === 'APPROVED' ? 'badge-emerald' : 'badge-amber'}>
                STATUS: {kycStatus?.status}
              </span>
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a' }}>
              {kycStatus?.status === 'APPROVED' ? 'Verification Complete — Listings Active Globally' : 'Action Required: Submit Identity Verification Document'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              AI OCR Confidence Score: <strong>{Math.round((kycStatus?.ocr_confidence || 0) * 100)}%</strong> • AI Fraud Score: <strong>{kycStatus?.ai_fraud_score || 0} / 100</strong>
            </p>
          </div>
          <Link href="/supplier/kyc" className="btn-primary">
            Upload & AI Prescreen <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="card-panel" style={{ padding: '24px', background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Gross Booking Volume</span>
            <span className="badge-emerald">+24.5%</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>${ledger?.gross_booking_value} USD</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Total guest payments received</div>
        </div>

        <div className="card-panel" style={{ padding: '24px', background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Platform Commission (15%)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Contract rate</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--brand-accent)' }}>-${ledger?.total_platform_commission} USD</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Automated platform fee</div>
        </div>

        <div className="card-panel" style={{ padding: '24px', background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Net Earned Balance</span>
            <span className="badge-emerald">Ready</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#059669' }}>${ledger?.net_earned_balance} USD</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Available for payout</div>
        </div>

        <div className="card-panel" style={{ padding: '24px', background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>Pending Payout</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-amber)' }}>${ledger?.pending_payout_balance} USD</div>
          </div>
          <button
            onClick={handleTriggerPayout}
            disabled={triggeringPayout || ledger?.pending_payout_balance <= 0}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px', marginTop: '12px', fontSize: '0.9rem' }}
          >
            {triggeringPayout ? 'Running Reconciliation...' : 'Trigger Payout Run'}
          </button>
        </div>
      </div>

      {/* REVENUE VISUALIZATION CHART & TABLES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '32px' }}>
        
        {/* REVENUE CHART + BOOKINGS TABLE */}
        <div>
          {/* VISUAL BAR CHART */}
          <div className="card-panel" style={{ padding: '24px', marginBottom: '32px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={20} color="var(--brand-primary)" /> Revenue Growth Trend (2026)
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>+42.8% Total Lift</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', padding: '10px 20px 0', borderBottom: '1px solid var(--border-light)' }}>
              {chartMonths.map((c, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)' }}>${c.revenue}</span>
                  <div
                    style={{
                      width: '36px',
                      height: `${(c.revenue / 4500) * 120}px`,
                      background: i === chartMonths.length - 1 ? 'var(--brand-gradient)' : '#cbd5e1',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.5s ease',
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BOOKINGS TABLE */}
          <div className="card-panel" style={{ padding: '24px', background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#0f172a' }}>Recent Reservations Feed</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 8px' }}>Ref</th>
                    <th style={{ padding: '12px 8px' }}>Lead Guest</th>
                    <th style={{ padding: '12px 8px' }}>Guests</th>
                    <th style={{ padding: '12px 8px' }}>Gross</th>
                    <th style={{ padding: '12px 8px' }}>Net Payout</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#0f172a' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--brand-primary)' }}>{b.booking_reference}</td>
                      <td style={{ padding: '12px 8px' }}>{b.traveler_details?.lead_name}</td>
                      <td style={{ padding: '12px 8px' }}>{b.total_travelers}</td>
                      <td style={{ padding: '12px 8px' }}>${b.gross_amount}</td>
                      <td style={{ padding: '12px 8px', color: '#059669', fontWeight: 700 }}>${b.supplier_payout}</td>
                      <td style={{ padding: '12px 8px' }}><span className="badge-emerald">{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PAYOUT HISTORY */}
        <div className="card-panel" style={{ padding: '24px', background: '#ffffff', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#0f172a' }}>Payout Settlement Ledger</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {payouts.map((p) => (
              <div key={p.id} style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{p.payout_reference}</span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>${p.amount} {p.currency}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>{new Date(p.period_end).toLocaleDateString()}</span>
                  <span className="badge-emerald">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
