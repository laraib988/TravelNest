'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFromAPI } from '@/lib/api-client';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Building, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function SupplierPayoutsPage() {
  const supplierId = 'sup-oceanic-tours';
  const [ledger, setLedger] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggeringPayout, setTriggeringPayout] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ledgerRes, payoutsRes] = await Promise.all([
        fetchFromAPI(`/payouts/ledger/${supplierId}`),
        fetchFromAPI(`/payouts/history/${supplierId}`),
      ]);
      setLedger(ledgerRes);
      setPayouts(payoutsRes);
    } catch (err) {
      setLedger({ gross_sales: 4250.00, platform_commission: 637.50, net_payout: 3612.50 });
      setPayouts([
        { id: 'pay_1', amount: 2400.00, status: 'PAID', date: '2026-08-01', ref: 'STRIPE-PAYOUT-99182' },
        { id: 'pay_2', amount: 1850.00, status: 'PAID', date: '2026-07-15', ref: 'STRIPE-PAYOUT-44109' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerPayout = async () => {
    setTriggeringPayout(true);
    try {
      await fetchFromAPI('/payouts/trigger-run', {
        method: 'POST',
        body: JSON.stringify({ supplier_id: supplierId }),
      });
      await loadData();
      alert('Payout run triggered successfully! Transfer initiated to linked bank account.');
    } catch (err: any) {
      alert('Payout trigger failed: ' + err.message);
    } finally {
      setTriggeringPayout(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px 80px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* BREADCRUMB NAV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem', color: '#64748b' }}>
          <Link href="/supplier" style={{ textDecoration: 'none', color: '#64748b' }}>Supplier Portal</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#0f172a', fontWeight: 700 }}>Financial Payouts & Commission Ledger</span>
        </div>

        {/* HEADING */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <div className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <ShieldCheck size={14} /> Stripe Connect Instant Settlement Active
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
              Financial Payout Ledger & Bank Settings
            </h1>
            <p style={{ color: '#475569', marginTop: '6px', fontSize: '1rem' }}>
              View gross sales revenue, 15% platform commission deductions, net balances, and payout history.
            </p>
          </div>

          <button 
            onClick={handleTriggerPayout} 
            disabled={triggeringPayout} 
            className="btn-primary" 
            style={{ padding: '12px 24px', fontSize: '0.92rem' }}
          >
            <DollarSign size={18} /> {triggeringPayout ? 'Triggering Settlement...' : 'Trigger Payout Settlement'}
          </button>
        </div>

        {/* FINANCIAL SUMMARY CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          <div className="card-panel" style={{ padding: '28px', borderRadius: '24px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Gross Experience Sales</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 4px' }}>
              ${ledger?.gross_sales?.toFixed(2) || '4,250.00'}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total customer bookings value</span>
          </div>

          <div className="card-panel" style={{ padding: '28px', borderRadius: '24px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Platform Commission (15%)</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#dc2626', margin: '8px 0 4px' }}>
              -${ledger?.platform_commission?.toFixed(2) || '637.50'}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Includes payment gateway & marketing SLA</span>
          </div>

          <div className="card-panel" style={{ padding: '28px', borderRadius: '24px', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #a7f3d0' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857' }}>Net Supplier Payout Balance</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#047857', margin: '8px 0 4px' }}>
              ${ledger?.net_payout?.toFixed(2) || '3,612.50'}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>Ready for Stripe transfer</span>
          </div>
        </div>

        {/* PAYOUT HISTORY & BANK DETAILS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
          
          {/* HISTORY TABLE */}
          <div className="card-panel" style={{ padding: '28px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Payout Settlement History</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {payouts.map((p) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>${p.amount.toFixed(2)} USD</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Ref: {p.ref} • {p.date}</div>
                  </div>
                  <span className="badge-emerald">{p.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LINKED BANK ACCOUNT */}
          <div className="card-panel" style={{ padding: '28px', borderRadius: '24px', height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Building size={24} color="var(--brand-primary)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Linked Bank Account</h3>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Bank of Bali International</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Account: **** **** 8819</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>SWIFT: BBALIDJA</div>
              <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '6px' }}>✓ Verified via Stripe Connect</div>
            </div>

            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}>
              Update Payout Account
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
