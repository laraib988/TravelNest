'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFromAPI } from '@/lib/api-client';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  PlusCircle,
  QrCode,
  Sparkles,
  BarChart2,
  ListFilter
} from 'lucide-react';

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
    return <div style={{ minHeight: '80vh', padding: '100px', textAlign: 'center', color: '#64748b', background: '#f8fafc' }}>Loading Supplier Portal Dashboard...</div>;
  }

  const chartMonths = [
    { month: 'Apr', revenue: 1200 },
    { month: 'May', revenue: 1850 },
    { month: 'Jun', revenue: 2400 },
    { month: 'Jul', revenue: 3100 },
    { month: 'Aug', revenue: 4200 },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px 80px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* TOP HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Verified Operator Partner
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>ID: {supplierId}</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
              Oceanic Horizon Voyages Ltd
            </h1>
            <p style={{ color: '#475569', marginTop: '4px', fontSize: '1rem' }}>
              Supplier Management Hub, Financial Analytics & Booking Verification Operations
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/supplier/listings/new" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
              <PlusCircle size={16} /> Create New Experience
            </Link>
            <Link href="/supplier/kyc" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
              <FileText size={16} /> KYC Verification
            </Link>
          </div>
        </div>

        {/* SUB-MODULES NAVIGATION TABS */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0' }}>
          <Link href="/supplier" style={{ padding: '10px 20px', borderRadius: '12px', background: 'var(--brand-primary)', color: '#ffffff', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Dashboard Overview
          </Link>
          <Link href="/supplier/listings/new" style={{ padding: '10px 20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Create Listing
          </Link>
          <Link href="/supplier/calendar" style={{ padding: '10px 20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Availability Calendar
          </Link>
          <Link href="/supplier/bookings" style={{ padding: '10px 20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Bookings & QR Scanner
          </Link>
          <Link href="/supplier/payouts" style={{ padding: '10px 20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Financial Payouts
          </Link>
          <Link href="/supplier/ai-tools" style={{ padding: '10px 20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            AI Growth Suite
          </Link>
        </div>

        {/* KYC STATUS BANNER */}
        <div className="card-panel" style={{ padding: '24px', borderRadius: '20px', marginBottom: '32px', borderLeft: `6px solid ${kycStatus?.status === 'APPROVED' ? '#059669' : '#d97706'}` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>KYC Identity Verification</span>
                <span className={kycStatus?.status === 'APPROVED' ? 'badge-emerald' : 'badge-amber'}>
                  STATUS: {kycStatus?.status || 'APPROVED'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {kycStatus?.status === 'APPROVED' ? 'Identity & Documents Verified — Active Partner Status' : 'Action Required: Submit License Documents'}
              </h3>
              <p style={{ color: '#475569', fontSize: '0.88rem', marginTop: '4px', margin: 0 }}>
                AI OCR Confidence: <strong>{Math.round((kycStatus?.ocr_confidence || 0.98) * 100)}%</strong> • AI Risk Score: <strong>{kycStatus?.ai_fraud_score || 2} / 100</strong>
              </p>
            </div>
            <Link href="/supplier/kyc" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              View Document Status <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* TOP STATS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="card-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Gross Sales (MTD)</span>
              <DollarSign size={20} color="var(--brand-primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>${ledger?.gross_sales?.toFixed(2) || '4,250.00'}</div>
            <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>↑ +18.4% vs last month</div>
          </div>

          <div className="card-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Net Supplier Balance</span>
              <TrendingUp size={20} color="#059669" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>${ledger?.net_payout?.toFixed(2) || '3,612.50'}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>After 15% Platform Commission</div>
          </div>

          <div className="card-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Active Bookings</span>
              <Calendar size={20} color="#7c3aed" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{bookings.length || 18}</div>
            <div style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700, marginTop: '4px' }}>4 Requests Awaiting 24h SLA</div>
          </div>

          <div className="card-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Scanned Vouchers</span>
              <QrCode size={20} color="#d97706" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>14</div>
            <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>100% Validated on site</div>
          </div>
        </div>

        {/* ANALYTICS & PAYOUT ACTIONS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px', marginBottom: '32px' }}>
          
          {/* REVENUE GROWTH CHART CARD */}
          <div className="card-panel" style={{ padding: '28px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Monthly Gross Revenue ($ USD)</h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Performance trends across top verified listings</span>
              </div>
              <BarChart2 size={20} color="#94a3b8" />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '180px', paddingTop: '20px', borderBottom: '1px solid #e2e8f0' }}>
              {chartMonths.map((item) => (
                <div key={item.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>${item.revenue}</div>
                  <div 
                    style={{ 
                      width: '100%', 
                      maxWidth: '48px',
                      height: `${(item.revenue / 4500) * 100}%`, 
                      background: item.month === 'Aug' ? 'var(--brand-gradient)' : '#cbd5e1', 
                      borderRadius: '8px 8px 0 0',
                      transition: 'height 0.3s'
                    }} 
                  />
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, marginTop: '8px' }}>{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK PAYOUT CONTROL */}
          <div className="card-panel" style={{ padding: '28px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Stripe Payout Settlement</h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                Automated weekly payout run. Trigger manual payout transfer for completed experience bookings.
              </p>
              
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>Available Payout Amount</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669' }}>${ledger?.net_payout?.toFixed(2) || '3,612.50'}</div>
              </div>
            </div>

            <button 
              onClick={handleTriggerPayout} 
              disabled={triggeringPayout} 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.92rem' }}
            >
              {triggeringPayout ? 'Processing Settlement...' : 'Trigger Immediate Payout Run'}
            </button>
          </div>

        </div>

        {/* QUICK LINK CARDS TO OTHER MODULES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <Link href="/supplier/listings/new" className="card-panel card-interactive" style={{ padding: '24px', borderRadius: '20px', textDecoration: 'none', color: 'inherit' }}>
            <PlusCircle size={28} color="var(--brand-primary)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Listing Wizard</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Publish new tours, food walks, and day passes with 6-step wizard.</p>
          </Link>

          <Link href="/supplier/calendar" className="card-panel card-interactive" style={{ padding: '24px', borderRadius: '20px', textDecoration: 'none', color: 'inherit' }}>
            <Calendar size={28} color="#7c3aed" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Availability Calendar</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Block dates, adjust capacity, and set seasonal price overrides.</p>
          </Link>

          <Link href="/supplier/bookings" className="card-panel card-interactive" style={{ padding: '24px', borderRadius: '20px', textDecoration: 'none', color: 'inherit' }}>
            <QrCode size={28} color="#059669" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Bookings & QR Scanner</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Manage SLA requests and scan customer QR voucher codes.</p>
          </Link>

          <Link href="/supplier/ai-tools" className="card-panel card-interactive" style={{ padding: '24px', borderRadius: '20px', textDecoration: 'none', color: 'inherit' }}>
            <Sparkles size={28} color="#d97706" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>AI Growth Suite</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>AI surge price predictor and automated review response engine.</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
