'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchFromAPI } from '@/lib/api-client';
import { Clock, ShieldCheck, CreditCard, CheckCircle2, Lock, ArrowLeft, QrCode, Download, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const holdId = searchParams.get('hold_id') || '';
  const expiresAt = Number(searchParams.get('expires') || Date.now() + 900000);

  const [timeLeft, setTimeLeft] = useState<number>(900);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const [formData, setFormData] = useState({
    lead_name: 'Ayesha Khan',
    lead_email: 'ayesha.khan@example.com',
    lead_phone: '+92 300 1234567',
    special_requirements: 'Seafood allergy; require vegetarian dinner option.',
    card_number: '4242 •••• •••• 4242',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetchFromAPI('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          hold_id: holdId,
          lead_name: formData.lead_name,
          lead_email: formData.lead_email,
          lead_phone: formData.lead_phone,
          special_requirements: formData.special_requirements,
          payment_token: `tok_stripe_sim_${Date.now()}`,
        }),
      });
      setConfirmedBooking(res);
    } catch (err: any) {
      alert(err.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px', background: '#ffffff' }}>
        <div className="card-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '40px', border: '1px solid #cbd5e1', background: '#ffffff' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={44} />
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: '#0f172a', textAlign: 'center' }}>Booking Confirmed!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', textAlign: 'center' }}>
            Your electronic QR ticket voucher has been dispatched to <strong>{confirmedBooking.traveler_details.lead_email}</strong>.
          </p>

          {/* QR VOUCHER CARD */}
          <div style={{ background: '#f8fafc', padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', marginBottom: '32px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px', gap: '16px' }}>
              <div>
                <span className="badge-emerald" style={{ marginBottom: '8px', display: 'inline-block' }}>⚡ {confirmedBooking.confirmation_type === 'INSTANT' ? 'INSTANT VOUCHER CONFIRMED' : 'AWAITING 24H SLA'}</span>
                <h3 style={{ fontSize: '1.4rem', color: '#0f172a' }}>{confirmedBooking.option_name || 'VIP Package'}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Lead Guest: <strong>{confirmedBooking.traveler_details.lead_name}</strong> ({confirmedBooking.traveler_details.lead_phone})</span>
              </div>

              {/* QR CODE BOX */}
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <QrCode size={64} color="#0f172a" style={{ margin: '0 auto' }} />
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-primary)', marginTop: '4px' }}>
                  {confirmedBooking.qr_voucher_code || 'TN-QR-BALI-99812'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Booking Reference:</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{confirmedBooking.booking_reference}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Total Amount Paid:</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>${confirmedBooking.gross_amount} {confirmedBooking.currency}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Guests:</span>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{confirmedBooking.total_travelers} Travelers</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <div><span className="badge-emerald">{confirmedBooking.status}</span></div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => window.print()} className="btn-secondary" style={{ padding: '12px 24px' }}>
              <Download size={18} /> Download Printable PDF Pass
            </button>
            <button onClick={() => alert('Voucher token added to Wallet pass.')} className="btn-secondary" style={{ padding: '12px 24px' }}>
              <Smartphone size={18} /> Add to Apple / Google Wallet
            </button>
            <Link href="/" className="btn-primary" style={{ padding: '12px 28px' }}>
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px', background: '#ffffff' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Experiences
      </Link>

      {/* TIMER BANNER */}
      <div className="card-panel" style={{ borderRadius: 'var(--radius-md)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', borderLeft: '4px solid var(--brand-amber)', background: '#fffbeb', border: '1px solid #fef3c7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={24} color="var(--brand-amber)" />
          <div>
            <div style={{ fontWeight: 600, color: '#92400e' }}>Redis Inventory Lock Active</div>
            <div style={{ fontSize: '0.85rem', color: '#b45309' }}>Hold Token ID: <code>{holdId || 'hold_884a1'}</code></div>
          </div>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: timeLeft < 180 ? '#e11d48' : '#b45309' }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '32px' }}>
        {/* FORM */}
        <form onSubmit={handleSubmitCheckout} className="card-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '30px', border: '1px solid #cbd5e1', background: '#ffffff' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
            <ShieldCheck size={20} color="#059669" /> Lead Traveler Details
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: 600 }}>Full Name</label>
              <input
                type="text"
                required
                value={formData.lead_name}
                onChange={(e) => setFormData({ ...formData, lead_name: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: 600 }}>Email Address (for voucher)</label>
              <input
                type="email"
                required
                value={formData.lead_email}
                onChange={(e) => setFormData({ ...formData, lead_email: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: 600 }}>Mobile Phone</label>
              <input
                type="text"
                required
                value={formData.lead_phone}
                onChange={(e) => setFormData({ ...formData, lead_phone: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: 600 }}>Dietary or Mobility Notes</label>
              <textarea
                value={formData.special_requirements}
                onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none', height: '80px' }}
              />
            </div>
          </div>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
            <CreditCard size={20} color="var(--brand-primary)" /> Tokenized Payment Method
          </h2>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#f0f9ff', border: '1px solid #bae6fd', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0369a1' }}>Stripe / Adyen PCI-DSS Element</span>
              <Lock size={14} color="#059669" />
            </div>
            <input
              type="text"
              readOnly
              value={formData.card_number}
              style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', color: '#0284c7', fontWeight: 700, outline: 'none' }}
            />
          </div>

          <button type="submit" disabled={submitting || timeLeft <= 0} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1.1rem' }}>
            {submitting ? 'Processing Payment Intent...' : 'Pay & Confirm Reservation'}
          </button>
        </form>

        {/* ORDER SUMMARY */}
        <div className="card-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '24px', height: 'fit-content', border: '1px solid #cbd5e1', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#0f172a' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>$278.00 USD</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Taxes & Environmental Fee</span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>$0.00 USD</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            <span>Total Payable</span>
            <span>$278.00 USD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
