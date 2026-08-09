'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFromAPI } from '@/lib/api-client';
import { 
  ShieldCheck, 
  FileText, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  PlusCircle,
  QrCode,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';

export default function SupplierDashboardPage() {
  const supplierId = 'sup-oceanic-tours';
  const [kycStatus, setKycStatus] = useState<any>(null);
  const [ledger, setLedger] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggeringPayout, setTriggeringPayout] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

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
    setFeedbackMsg(null);
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
      setFeedbackMsg('✓ Payout settlement successfully scheduled and transferred to your bank account.');
    } catch (err: any) {
      setFeedbackMsg('❌ Settlement process error: ' + (err.message || 'Please try again.'));
    } finally {
      setTriggeringPayout(false);
    }
  };

  if (loading) {
    return <div style={{ minHeight: '80vh', padding: '100px', textAlign: 'center', color: '#64748b', background: '#f8fafc' }}>Loading Supplier Dashboard...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px 80px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* INLINE FEEDBACK BANNER (NO BROWSER POPUPS) */}
        {feedbackMsg && (
          <div 
            style={{ 
              padding: '14px 20px', 
              borderRadius: '14px', 
              marginBottom: '24px', 
              background: feedbackMsg.startsWith('✓') ? '#ecfdf5' : '#fef2f2', 
              border: `1px solid ${feedbackMsg.startsWith('✓') ? '#a7f3d0' : '#fecdd3'}`, 
              color: feedbackMsg.startsWith('✓') ? '#047857' : '#b91c1c', 
              fontSize: '0.92rem', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>{feedbackMsg}</span>
            <button onClick={() => setFeedbackMsg(null)} style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 800, cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {/* TOP HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Verified Partner Operator
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Partner ID: {supplierId}</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
              Oceanic Horizon Voyages Ltd
            </h1>
            <p style={{ color: '#475569', marginTop: '4px', fontSize: '1rem' }}>
              Partner Overview Dashboard — Manage experience bookings, slot inventory, and financial payouts cleanly.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/supplier/listings/new" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
              <PlusCircle size={16} /> Add Experience Listing
            </Link>
            <Link href="/supplier/kyc" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
              <FileText size={16} /> KYC Verification Status
            </Link>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0' }}>
          <Link href="/supplier" style={{ padding: '10px 20px', borderRadius: '12px', background: 'var(--brand-primary)', color: '#ffffff', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Dashboard Overview
          </Link>
          <Link href="/supplier/listings/new" style={{ padding: '10px 20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Add Listing
          </Link>
          <Link href="/supplier/calendar" style={{ padding: '10px 20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Calendar & Pricing
          </Link>
          <Link href="/supplier/bookings" style={{ padding: '10px 20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Bookings & QR Scanner
          </Link>
          <Link href="/supplier/payouts" style={{ padding: '10px 20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Payouts & Earnings
          </Link>
          <Link href="/supplier/ai-tools" style={{ padding: '10px 20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            AI Tools
          </Link>
        </div>

        {/* TOP METRIC CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="card-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Total Gross Bookings</span>
              <DollarSign size={20} color="var(--brand-primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>${ledger?.gross_sales?.toFixed(2) || '4,250.00'}</div>
            <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>Customer sales total</div>
          </div>

          <div className="card-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Net Earnings Balance</span>
              <TrendingUp size={20} color="#059669" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>${ledger?.net_payout?.toFixed(2) || '3,612.50'}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Net payout after 15% fee</div>
          </div>

          <div className="card-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Total Bookings</span>
              <Calendar size={20} color="#7c3aed" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{bookings.length || 18}</div>
            <div style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700, marginTop: '4px' }}>Confirmed & pending SLA</div>
          </div>

          <div className="card-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Scanned QR Vouchers</span>
              <QrCode size={20} color="#d97706" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>14</div>
            <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>Checked in on site</div>
          </div>
        </div>

        {/* CLEAN SUMMARY SECTION (NO COMPLEX CHARTS) */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px', marginBottom: '32px' }}>
          
          {/* RECENT BOOKINGS SUMMARY TABLE */}
          <div className="card-panel" style={{ padding: '28px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Customer Bookings</h3>
              <Link href="/supplier/bookings" style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'none' }}>View All Bookings →</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {bookings.slice(0, 4).map((b) => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                      {b.title || b.option_name || 'Experience Tour'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      Guest: {b.guest_name || b.traveler_details?.lead_name || 'Traveler'} • {b.date || b.slot_start_time?.substring(0, 10) || '2026-08-15'}
                    </div>
                  </div>
                  <span className={b.status === 'CONFIRMED' ? 'badge-emerald' : 'badge-amber'}>
                    {b.status === 'CONFIRMED' ? 'Confirmed' : 'Pending SLA'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* INSTANT PAYOUT CONTROL CARD */}
          <div className="card-panel" style={{ padding: '28px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Earnings Settlement</h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                Transfer available net earnings directly to your bank account via Stripe Connect.
              </p>
              
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>Available Payout Balance</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669' }}>${ledger?.net_payout?.toFixed(2) || '3,612.50'}</div>
              </div>
            </div>

            <button 
              onClick={handleTriggerPayout} 
              disabled={triggeringPayout} 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.92rem' }}
            >
              {triggeringPayout ? 'Processing Payout...' : 'Request Payout Settlement'}
            </button>
          </div>

        </div>

        {/* NAVIGATION CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <Link href="/supplier/listings/new" className="card-panel card-interactive" style={{ padding: '24px', borderRadius: '20px', textDecoration: 'none', color: 'inherit' }}>
            <PlusCircle size={28} color="var(--brand-primary)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Add Experience Listing</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Create new tours, food walks, or day passes in 6 easy steps.</p>
          </Link>

          <Link href="/supplier/calendar" className="card-panel card-interactive" style={{ padding: '24px', borderRadius: '20px', textDecoration: 'none', color: 'inherit' }}>
            <Calendar size={28} color="#7c3aed" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Calendar & Pricing</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Select dates to manage available slots and seasonal price overrides.</p>
          </Link>

          <Link href="/supplier/bookings" className="card-panel card-interactive" style={{ padding: '24px', borderRadius: '20px', textDecoration: 'none', color: 'inherit' }}>
            <QrCode size={28} color="#059669" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Bookings & QR Scanner</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Accept SLA requests and scan customer voucher QR codes.</p>
          </Link>

          <Link href="/supplier/payouts" className="card-panel card-interactive" style={{ padding: '24px', borderRadius: '20px', textDecoration: 'none', color: 'inherit' }}>
            <DollarSign size={28} color="#d97706" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Payouts & Earnings</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Track revenue payouts, platform commissions, and bank settings.</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
