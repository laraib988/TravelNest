'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchFromAPI } from '@/lib/api-client';
import { Clock, ShieldCheck, CreditCard, CheckCircle2, Lock, ArrowLeft, Download, Smartphone, Tag } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const holdId = searchParams.get('hold_id') || '';
  const expiresAt = Number(searchParams.get('expires') || Date.now() + 900000);

  const [timeLeft, setTimeLeft] = useState<number>(900);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  useEffect(() => {
    if (confirmedBooking) {
      window.scrollTo(0, 0);
    }
  }, [confirmedBooking]);

  const tourTitle = searchParams.get('title') || 'Tour Experience';
  const tourOptionName = searchParams.get('option_name') || 'Standard Ticket';
  const tourDate = searchParams.get('date') || new Date().toISOString();
  const basePrice = parseFloat(searchParams.get('price') || '278.00');
  const quantity = Number(searchParams.get('quantity')) || 1;
  const pricingType = searchParams.get('pricing_type') || 'Per Person';
  
  const subtotal = pricingType.toLowerCase().includes('group') || pricingType.toLowerCase().includes('vehicle') 
    ? basePrice 
    : basePrice * quantity;

  const paymentOption = searchParams.get('payment_option') || 'Pay Now';
  const confirmationType = searchParams.get('confirmation_type') || 'Instant Confirmation';
  const [customerPaymentChoice, setCustomerPaymentChoice] = useState(paymentOption === 'Reserve Now Pay Later' ? 'pay_later' : 'pay_now');

  const [formData, setFormData] = useState({
    lead_name: '',
    lead_email: '',
    lead_phone: '',
    special_requirements: '',
    pickup_time: '',
    pickup_location: '',
    dropoff_location: '',
    same_as_pickup: false,
    card_number: '',
  });

  const timeFromStr = searchParams.get('time_from') || '06:00 AM';
  const timeToStr = searchParams.get('time_to') || '10:00 AM';
  const timeIntervalStr = searchParams.get('time_interval') || '30';

  const timeOptions = useMemo(() => {
    const parseTime = (str: string) => {
      const isAMPM = str.match(/am|pm/i);
      const parts = str.match(/(\d+):(\d+)/);
      if (!parts) return 0;
      let h = parseInt(parts[1], 10);
      const m = parseInt(parts[2], 10);
      if (isAMPM) {
         if (str.toLowerCase().includes('pm') && h < 12) h += 12;
         if (str.toLowerCase().includes('am') && h === 12) h = 0;
      }
      return h * 60 + m;
    };
    const formatTime = (minutes: number) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
    };
    const startMins = parseTime(timeFromStr);
    const endMins = parseTime(timeToStr);
    const intervalMins = parseInt(timeIntervalStr, 10) || 30;

    const options = [];
    // Ensure we don't infinitely loop or lock up if interval is 0 or negative
    if (intervalMins > 0) {
      for (let m = startMins; m <= endMins; m += intervalMins) {
        options.push(formatTime(m));
      }
    }
    return options.length > 0 ? options : ['06:00 AM'];
  }, [timeFromStr, timeToStr, timeIntervalStr]);

  // SRS 3.4 / 3.8: Coupon / Promo Code State
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [availablePickupLocations, setAvailablePickupLocations] = useState<any[]>([]);

  const listingId = searchParams.get('listing_id') || 'mock-listing';
  
  useEffect(() => {
    if (listingId !== 'mock-listing') {
      fetch(`/api/public/listings/${listingId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.logistics && Array.isArray(data.logistics.pickup_locations)) {
            setAvailablePickupLocations(data.logistics.pickup_locations);
          }
        })
        .catch(err => console.error('Error fetching listing logistics:', err));
    }
  }, [listingId]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponMsg('');
    try {
      const res = await fetchFromAPI('/promotions/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code: couponCode, cart_total: basePrice }),
      });
      if (res.valid) {
        setDiscountAmount(res.discount_amount);
        setAppliedCoupon(couponCode.toUpperCase());
        setCouponMsg(`✓ Coupon applied! Saved $${res.discount_amount.toFixed(2)}`);
      } else {
        setCouponMsg(`❌ ${res.message || 'Invalid coupon code'}`);
      }
    } catch {
      setCouponMsg('❌ Invalid or expired coupon code');
    } finally {
      setValidatingCoupon(false);
    }
  };

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
      if (customerPaymentChoice === 'pay_now') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const supplierId = searchParams.get('supplier_id') || 'mock-supplier';
      const optionId = searchParams.get('option_id') || 'mock-opt';

      const res = await fetch('/api/public/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          listing_title: tourTitle,
          supplier_id: supplierId,
          option_id: optionId,
          option_name: tourOptionName,
          slot_start_time: tourDate,
          total_travelers: quantity,
          gross_amount: subtotal,
          currency: 'USD',
          lead_name: formData.lead_name,
          lead_email: formData.lead_email,
          lead_phone: formData.lead_phone,
          special_requirements: formData.special_requirements,
          pickup_time: formData.pickup_time,
          pickup_location: formData.pickup_location,
          dropoff_location: formData.same_as_pickup ? formData.pickup_location : formData.dropoff_location,
          payment_token: `tok_stripe_sim_${Date.now()}`,
          payment_status: customerPaymentChoice === 'pay_later' ? 'RESERVED' : 'PAID',
          confirmation_type: confirmationType.toUpperCase().includes('MANUAL') ? 'MANUAL' : 'INSTANT',
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Checkout failed');

      setConfirmedBooking(result.booking);
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
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: confirmedBooking.status === 'PENDING_SUPPLIER_APPROVAL' ? '#fef3c7' : '#d1fae5', color: confirmedBooking.status === 'PENDING_SUPPLIER_APPROVAL' ? '#d97706' : '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={44} />
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: '#0f172a', textAlign: 'center' }}>
            {confirmedBooking.status === 'PENDING_SUPPLIER_APPROVAL' ? 'Booking Submitted!' : 'Booking Confirmed!'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', textAlign: 'center' }}>
            {confirmedBooking.status === 'PENDING_SUPPLIER_APPROVAL' 
              ? `Your booking request has been sent to the supplier. You will receive an email once it is approved.`
              : `Your electronic ticket has been dispatched to <strong>${confirmedBooking.traveler_details.lead_email}</strong>.`}
          </p>

          {/* QR VOUCHER CARD */}
          <div style={{ background: '#f8fafc', padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', marginBottom: '32px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px', gap: '16px' }}>
              <div>
                <span className={confirmedBooking.status === 'PENDING_SUPPLIER_APPROVAL' ? "badge-warning" : "badge-emerald"} style={{ marginBottom: '8px', display: 'inline-block' }}>
                  {confirmedBooking.status === 'PENDING_SUPPLIER_APPROVAL' ? '⏳ PENDING SUPPLIER APPROVAL' : '⚡ INSTANT BOOKING CONFIRMED'}
                </span>
                <h3 style={{ fontSize: '1.4rem', color: '#0f172a' }}>{confirmedBooking.option_name || 'VIP Package'}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Lead Guest: <strong>{confirmedBooking.traveler_details.lead_name}</strong> ({confirmedBooking.traveler_details.lead_phone})</span>
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
                <div>
                  <span className={confirmedBooking.status === 'PENDING_SUPPLIER_APPROVAL' ? "badge-warning" : "badge-emerald"}>
                    {confirmedBooking.status}
                  </span>
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Payment:</span>
                <div>
                  <span className={confirmedBooking.payment_status === 'RESERVED' ? "badge-info" : "badge-emerald"}>
                    {confirmedBooking.payment_status || 'PAID'}
                  </span>
                </div>
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
      <Link href={searchParams.get('listing_id') ? `/tours/${searchParams.get('listing_id')}` : "/"} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
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
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: 600 }}>Pickup Location</label>
              {availablePickupLocations.length > 0 ? (
                <select
                  value={formData.pickup_location}
                  onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value, dropoff_location: formData.same_as_pickup ? e.target.value : formData.dropoff_location })}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
                >
                  <option value="" disabled>Select a pickup location</option>
                  {availablePickupLocations.map((loc, idx) => (
                    <option key={idx} value={loc.name}>{loc.name} {loc.address ? `(${loc.address})` : ''}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="e.g., Hotel Name or Address"
                  value={formData.pickup_location}
                  onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value, dropoff_location: formData.same_as_pickup ? e.target.value : formData.dropoff_location })}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
                />
              )}
            </div>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Drop-off Location</label>
                <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#475569' }}>
                  <input type="checkbox" checked={formData.same_as_pickup} onChange={(e) => setFormData({...formData, same_as_pickup: e.target.checked, dropoff_location: e.target.checked ? formData.pickup_location : ''})} /> Same as pickup
                </label>
              </div>
              <input
                type="text"
                placeholder="e.g., Hotel Name or Address"
                disabled={formData.same_as_pickup}
                value={formData.dropoff_location}
                onChange={(e) => setFormData({ ...formData, dropoff_location: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: formData.same_as_pickup ? '#e2e8f0' : '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: 600 }}>Pickup Time</label>
              <select 
                required
                value={formData.pickup_time}
                onChange={(e) => setFormData({...formData, pickup_time: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
              >
                <option value="" disabled>Select a pickup time</option>
                {timeOptions.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: 600 }}>Additional Requirements</label>
              <textarea
                value={formData.special_requirements}
                onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
                placeholder="e.g., Any dietary restrictions, mobility needs, or special requests"
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none', height: '80px' }}
              />
            </div>
          </div>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
            <CreditCard size={20} color="var(--brand-primary)" /> Payment Details
          </h2>

          {paymentOption === 'Reserve Now Pay Later' && (
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <label style={{ flex: 1, padding: '16px', border: `2px solid ${customerPaymentChoice === 'pay_later' ? 'var(--brand-primary)' : '#cbd5e1'}`, borderRadius: 'var(--radius-md)', background: customerPaymentChoice === 'pay_later' ? '#f0f9ff' : '#ffffff', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <input type="radio" name="payment_choice" checked={customerPaymentChoice === 'pay_later'} onChange={() => setCustomerPaymentChoice('pay_later')} style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }} />
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>Reserve Now, Pay Later</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '28px' }}>Secure your spot today and pay closer to the date. No money charged now.</div>
              </label>

              <label style={{ flex: 1, padding: '16px', border: `2px solid ${customerPaymentChoice === 'pay_now' ? 'var(--brand-primary)' : '#cbd5e1'}`, borderRadius: 'var(--radius-md)', background: customerPaymentChoice === 'pay_now' ? '#f0f9ff' : '#ffffff', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <input type="radio" name="payment_choice" checked={customerPaymentChoice === 'pay_now'} onChange={() => setCustomerPaymentChoice('pay_now')} style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }} />
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>Pay Now</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '28px' }}>Pay the full amount today and complete your reservation instantly.</div>
              </label>
            </div>
          )}

          {customerPaymentChoice === 'pay_now' ? (
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
          ) : (
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Clock size={20} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', color: '#334155', marginBottom: '4px' }}>No payment required right now</strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Your card details are not needed yet. We will send you a secure payment link 3 days before the experience.</span>
              </div>
            </div>
          )}

          <button type="submit" disabled={submitting || timeLeft <= 0} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1.1rem' }}>
            {submitting ? 'Processing...' : (customerPaymentChoice === 'pay_later' ? 'Confirm Reservation (Pay Later)' : 'Pay & Confirm Reservation')}
          </button>
        </form>

        {/* ORDER SUMMARY */}
        <div className="card-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '24px', height: 'fit-content', border: '1px solid #cbd5e1', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#0f172a' }}>Order Summary</h3>
          
          <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 700, marginBottom: '6px' }}>{tourTitle}</h4>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}><strong>Option:</strong> {tourOptionName}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Date:</strong> {new Date(tourDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}><strong>Guests:</strong> {quantity} Traveler{quantity > 1 ? 's' : ''}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>${subtotal.toFixed(2)} USD</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 600 }}>
                <span>Promo Discount ({appliedCoupon})</span>
                <span>-${discountAmount.toFixed(2)} USD</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Taxes & Environmental Fee</span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>$0.00 USD</span>
            </div>
          </div>

          {/* SRS 3.4: PROMO CODE INPUT */}
          <form onSubmit={handleApplyCoupon} style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Promo / Coupon Code</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Try: WELCOME20, SUMMER15"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#0f172a', outline: 'none', textTransform: 'uppercase' }}
              />
              <button type="submit" disabled={validatingCoupon} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                <Tag size={14} /> Apply
              </button>
            </div>
            {couponMsg && (
              <div style={{ fontSize: '0.78rem', marginTop: '6px', color: couponMsg.startsWith('✓') ? '#059669' : '#dc2626', fontWeight: 600 }}>
                {couponMsg}
              </div>
            )}
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            <span>Total Payable</span>
            <span>${Math.max(0, basePrice - discountAmount).toFixed(2)} USD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
