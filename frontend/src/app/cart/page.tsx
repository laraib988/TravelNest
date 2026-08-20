'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { 
  Trash2, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Ticket,
  ChevronRight,
  ShieldCheck,
  Lock,
  Compass
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, removeFromCart, updateCartQuantity, formatPrice } = useCurrency();
  const router = useRouter();
  
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoMsg, setPromoMsg] = useState('');

  const cartItems = cart;
  const removeItem = removeFromCart;
  const updateQuantity = updateCartQuantity;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME20') {
      setDiscountAmount(20);
      setAppliedCode('WELCOME20');
      setPromoMsg('✓ Promo code WELCOME20 applied ($20.00 discount)');
    } else if (code === 'SUMMER15') {
      const disc = (subtotal * 0.15);
      setDiscountAmount(disc);
      setAppliedCode('SUMMER15');
      setPromoMsg(`✓ Promo code SUMMER15 applied ($${disc.toFixed(2)} discount)`);
    } else {
      setPromoMsg('❌ Invalid promo code. Try WELCOME20 or SUMMER15');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discountAmount);

  const handleProceedCheckout = () => {
    router.push('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '80px 24px', fontFamily: 'var(--font-body)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div className="card-panel" style={{ padding: '60px 40px', borderRadius: '24px' }}>
            <div style={{ width: '80px', height: '80px', background: '#f0f9ff', color: 'var(--brand-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid #bae6fd' }}>
              <ShoppingBag size={40} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Your Cart is Empty</h1>
            <p style={{ color: '#64748b', fontSize: '0.98rem', marginBottom: '28px', lineHeight: 1.5 }}>
              Looks like you haven't added any experiences or tours to your cart yet.
            </p>
            <Link href="/" className="btn-primary" style={{ padding: '12px 32px' }}>
              Explore Top Experiences <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px 80px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* BREADCRUMB NAV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem', color: '#64748b' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#64748b' }}>Home</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#0f172a', fontWeight: 700 }}>Shopping Cart</span>
        </div>

        {/* PAGE HEADING */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>Multi-Experience Cart</h1>
            <p style={{ color: '#475569', marginTop: '6px', fontSize: '1rem' }}>Review your selected tours, choose variants, and apply promo discounts.</p>
          </div>
          <span className="badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> 100% Instant SLA Confirmation
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
          
          {/* CART ITEMS FEED */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="card-panel" 
                style={{ 
                  padding: '24px', 
                  borderRadius: '24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '20px',
                  position: 'relative'
                }}
              >
                {/* REMOVE BUTTON */}
                <button 
                  onClick={() => removeItem(item.id)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    color: '#be123c',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="Remove experience"
                >
                  <Trash2 size={15} />
                </button>

                {/* THUMBNAIL */}
                <div style={{ width: '180px', height: '120px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* ITEM DETAILS */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: '240px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px', paddingRight: '36px', lineHeight: 1.35 }}>
                      {item.title}
                    </h3>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color="var(--brand-primary)" /> {item.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="#d97706" /> {item.timeSlot}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Ticket size={14} color="#7c3aed" /> {item.variant}
                      </span>
                    </div>
                  </div>

                  {/* QUANTITY & ITEM TOTAL */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '2px 8px' }}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', color: '#0f172a', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', padding: '2px 6px' }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', width: '24px', textAlign: 'center', color: '#0f172a' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', color: '#0f172a', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', padding: '2px 6px' }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                      ${(item.price * item.quantity).toFixed(2)} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>USD</span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY SIDEBAR */}
          <div>
            <div className="card-panel" style={{ padding: '28px', borderRadius: '24px', position: 'sticky', top: '100px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Order Summary</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} guests)</span>
                  <span style={{ color: '#0f172a', fontWeight: 700 }}>${subtotal.toFixed(2)} USD</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
                    <span>Promo Discount ({appliedCode})</span>
                    <span>-${discountAmount.toFixed(2)} USD</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Taxes & SLA Fees</span>
                  <span style={{ color: '#0f172a', fontWeight: 700 }}>$0.00 USD</span>
                </div>
              </div>

              {/* PROMO INPUT FORM */}
              <form onSubmit={handleApplyPromo} style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Promo / Coupon Code</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Tag size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      placeholder="Try: WELCOME20, SUMMER15" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 10px 10px 36px',
                        borderRadius: '10px',
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a',
                        fontSize: '0.85rem',
                        outline: 'none',
                        textTransform: 'uppercase',
                        fontWeight: 600
                      }}
                    />
                  </div>
                  <button type="submit" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    Apply
                  </button>
                </div>
                {promoMsg && (
                  <div style={{ fontSize: '0.78rem', marginTop: '6px', color: promoMsg.startsWith('✓') ? '#059669' : '#dc2626', fontWeight: 700 }}>
                    {promoMsg}
                  </div>
                )}
              </form>

              {/* TOTAL PAYABLE */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '24px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '1.1rem', color: '#0f172a' }}>Total Payable</span>
                <span>${total.toFixed(2)} USD</span>
              </div>

              <button 
                onClick={handleProceedCheckout}
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1.05rem', fontWeight: 700 }}
              >
                Proceed to Multi-Listing Checkout <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748b', marginTop: '14px' }}>
                <Lock size={12} color="#059669" /> 256-Bit Encrypted Secure Checkout
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
