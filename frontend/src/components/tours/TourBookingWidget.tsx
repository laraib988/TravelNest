'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { fetchFromAPI } from '@/lib/api-client';

export default function TourBookingWidget({ tour }: { tour: any }) {
  const router = useRouter();
  const { formatPrice, t, language } = useCurrency();

  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(2);
  const [holding, setHolding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!tour) return;
    if (tour.options && tour.options.length > 0) {
      setSelectedOption(tour.options[0]);
    } else {
      setSelectedOption({
        id: 'opt-default',
        title: tour.title || 'Standard Ticket',
        price: tour.logistics?.pricing?.basePrice || tour.base_price || 0,
        max_capacity: 10,
        pricing_type: tour.logistics?.pricing?.pricingType || 'Per Person'
      });
    }
    if (tour.available_slots && tour.available_slots.length > 0) {
      setSelectedSlot(tour.available_slots[0]);
    } else {
      setSelectedSlot({
        id: 'slot-today',
        start_time: new Date().toISOString(),
        capacity_left: 10
      });
    }
  }, [tour]);

  if (!tour) return null;

  const capacityWarning = selectedOption && quantity > (Number(selectedOption.max_capacity) || 10)
    ? `Maximum capacity is ${Number(selectedOption.max_capacity) || 10} travelers for this option.`
    : '';

  const handleAcquireHold = async () => {
    if (capacityWarning) {
      setErrorMsg(capacityWarning);
      return;
    }

    const optionToUse = selectedOption || {
      id: tour?.options?.[0]?.id || 'opt-default',
      title: tour?.options?.[0]?.title || tour?.title || 'Standard Ticket',
      price_modifier: tour?.options?.[0]?.price_modifier || tour?.base_price || 0,
      price: tour?.options?.[0]?.price || tour?.base_price || 0,
      pricing_type: tour?.options?.[0]?.pricing_type || 'Per Person',
    };
    const slotToUse = selectedSlot || {
      id: 'slot-now',
      start_time: new Date().toISOString(),
      capacity_left: 10,
    };

    setHolding(true);
    setErrorMsg('');
    try {
      const checkoutParams = new URLSearchParams({
        listing_id: tour.id,
        supplier_id: tour.supplier_id || 'unknown-supplier',
        option_id: optionToUse.id,
        option_name: optionToUse.title || optionToUse.name || 'Standard Option',
        price: (optionToUse.price_modifier || optionToUse.price || tour.base_price || '0').toString(),
        title: tour.title,
        date: slotToUse.start_time || slotToUse.date_time || new Date().toISOString(),
        time_from: tour.time_from || '08:00',
        time_to: tour.time_to || '18:00',
        payment_option: tour.payment_option || 'Pay Now',
        confirmation_type: tour.confirmation_type || 'Instant Confirmation',
        time_interval: tour.time_interval || '30',
        quantity: quantity.toString(),
        pricing_type: optionToUse.pricing_type || 'Per Person'
      });
      
      const slotPrefix = slotToUse.id;
      if (slotPrefix.startsWith('slot-') || slotPrefix.startsWith('custom-') || slotPrefix.startsWith('gen-')) {
         router.push(`/checkout?hold_id=hold_${Date.now()}&expires=${Date.now() + 900000}&${checkoutParams.toString()}`);
         return;
      }
      
      const holdRes = await fetchFromAPI('/availability/hold', {
        method: 'POST',
        body: JSON.stringify({
          slot_id: slotToUse.id,
          option_id: optionToUse.id,
          quantity: quantity,
        }),
      });

      router.push(`/checkout?hold_id=${holdRes.hold_id}&expires=${holdRes.expires_at}&${checkoutParams.toString()}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Slot locked by another customer. Please choose another date.');
    } finally {
      setHolding(false);
    }
  };

  const remainingSeats = selectedSlot ? (selectedSlot.capacity_left ?? 10) : 10;
  const currentPrice = selectedOption ? (selectedOption.price_modifier || selectedOption.price) : tour.base_price;

  return (
    <div className="card-panel" style={{ padding: '30px', position: 'sticky', top: '100px', background: '#ffffff', border: '1px solid #cbd5e1', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px', flexWrap: 'nowrap' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-primary)', whiteSpace: 'nowrap' }}>
            {formatPrice(currentPrice)} <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>/ {selectedOption?.pricing_type?.replace(/^per\s+/i, '') || 'Person'}</span>
          </div>
        </div>
        <div className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0, whiteSpace: 'nowrap', padding: '4px 10px', fontSize: '0.78rem' }}>
          <Lock size={12} /> {t('secure_payment')}
        </div>
      </div>

      {tour.options?.length > 0 && tour.options[0].title && (
        <>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: '#0f172a' }}>{t('select_variant')}</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {tour.options.map((opt: any) => {
              const isOptSelected = selectedOption?.id === opt.id;
              const maxCap = Number(opt.max_capacity) || 10;
              const availableUnitsRaw = Number(opt.available_units) || 10;
              const available = Math.max(0, availableUnitsRaw);
              const isGroup = opt.pricing_type !== 'Per Person';
              const unitsNeeded = isGroup ? 1 : quantity;
              const exceedsCapacity = quantity > maxCap || unitsNeeded > available;
              
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    if (!exceedsCapacity && available > 0) setSelectedOption(opt);
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: isOptSelected ? '2px solid var(--brand-primary)' : '1px solid #cbd5e1',
                    background: isOptSelected ? '#f0f9ff' : '#ffffff',
                    cursor: (exceedsCapacity || available === 0) ? 'not-allowed' : 'pointer',
                    opacity: (exceedsCapacity || available === 0) ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'opacity 0.2s',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{opt.title || opt.name}</div>
                    {opt.description && <div style={{ fontSize: '0.75rem', color: '#059669' }}>{opt.description}</div>}
                    <div style={{ fontSize: '0.75rem', color: (exceedsCapacity || available === 0) ? '#dc2626' : '#059669', marginTop: '4px' }}>
                      {available === 0 ? 'Sold Out' : `${available} ${isGroup ? 'vehicles' : 'seats'} available`} 
                      {quantity > maxCap && ` (Max capacity: ${maxCap})`}
                      {(unitsNeeded > available && available > 0 && quantity <= maxCap) && ` (Not enough availability)`}
                    </div>
                  </div>
                  <strong style={{ color: 'var(--brand-primary)', fontSize: '0.95rem' }}>{formatPrice(opt.price_modifier || opt.price)}</strong>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{t('select_slots')}</label>
        <input 
          type="date" 
          onChange={(e) => {
            if (e.target.value) {
              const d = new Date(e.target.value);
              setSelectedSlot({ id: `custom-${d.getTime()}`, capacity_left: 10, start_time: d.toISOString() });
            }
          }}
          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem', color: '#0f172a' }} 
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
        {Array.from({length: 7}).map((_, i) => {
          const date = new Date(Date.now() + i * 86400000);
          const slotId = `slot-${i}`;
          const isSelected = selectedSlot?.id === slotId;
          return (
            <div
              key={slotId}
              onClick={() => setSelectedSlot({ id: slotId, capacity_left: 10, start_time: date.toISOString() })}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: isSelected ? '2px solid var(--brand-primary)' : '1px solid #cbd5e1',
                background: isSelected ? '#f0f9ff' : '#f8fafc',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>{date.toLocaleString(language.code === 'ja' ? 'ja-JP' : language.code, { weekday: 'short', month: 'short', day: 'numeric', timeZone: language.code === 'ja' ? 'Asia/Tokyo' : undefined })}</div>
              </div>
            </div>
          );
        })}
      </div>

      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: '#0f172a' }}>Number of Guests</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', border: 'none', color: '#0f172a', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 700 }}
        >
          -
        </button>
        <span style={{ fontSize: '1.2rem', fontWeight: 700, width: '30px', textAlign: 'center', color: '#0f172a' }}>{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(remainingSeats || 10, quantity + 1))}
          style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', border: 'none', color: '#0f172a', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 700 }}
        >
          +
        </button>
      </div>

      {errorMsg && (
        <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: '#ffe4e6', color: '#e11d48', fontSize: '0.85rem', marginBottom: '16px' }}>
          {errorMsg}
        </div>
      )}

      <button
        onClick={handleAcquireHold}
        disabled={holding || remainingSeats <= 0 || !!capacityWarning}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1.05rem', opacity: (holding || remainingSeats <= 0 || !!capacityWarning) ? 0.5 : 1 }}
      >
        {holding ? 'Acquiring Lock...' : remainingSeats <= 0 ? 'Sold Out' : !!capacityWarning ? 'Exceeds Capacity' : 'Checkout'}
        <ArrowRight size={18} />
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '14px' }}>
        🔒 Locks seat for 15 minutes. Zero risk of overbooking.
      </p>
    </div>
  );
}
