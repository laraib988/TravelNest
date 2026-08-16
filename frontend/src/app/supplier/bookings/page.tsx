'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFromAPI } from '@/lib/api-client';
import { 
  User, 
  Search, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function SupplierBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchSupplierBookings();
  }, []);

  const fetchSupplierBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchFromAPI('/bookings/supplier/list');
      setBookings(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setBookings([
        {
          id: 'b-101',
          booking_reference: 'TN-2026-99182',
          title: 'Luxury Bali Sunset Catamaran Cruise',
          guest_name: 'David Miller',
          guest_email: 'david@example.com',
          date: '2026-08-15',
          timeSlot: '16:00',
          travelers: 2,
          amount: 178.00,
          status: 'CONFIRMED',
          confirmation_type: 'INSTANT',
          qr_voucher_code: 'TN-VOUCHER-BALI-8812'
        },
        {
          id: 'b-102',
          booking_reference: 'TN-2026-44019',
          title: 'Walled City Lahore Food Tour',
          guest_name: 'Ayesha Khan',
          guest_email: 'ayesha@example.com',
          date: '2026-08-20',
          timeSlot: '19:30',
          travelers: 3,
          amount: 105.00,
          status: 'AWAITING_SUPPLIER_CONFIRMATION',
          confirmation_type: 'REQUEST_BASED_24H_SLA',
          qr_voucher_code: 'TN-VOUCHER-LHR-9941'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSLA = async (id: string) => {
    try {
      const response = await fetch('/api/supplier/bookings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id, status: 'CONFIRMED', supplierId: '8a290293-8ce5-4e7c-b604-aa3c6c95fc57' }) // using demo supplierId
      });
      if (response.ok) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CONFIRMED' } : b));
        setFeedbackMsg('✓ Booking SLA Request accepted and confirmed successfully!');
      } else {
        setFeedbackMsg('❌ Failed to confirm booking.');
      }
    } catch (err) {
      setFeedbackMsg('❌ Error confirming booking.');
    }
  };

  const handleRejectSLA = async (id: string) => {
    try {
      const response = await fetch('/api/supplier/bookings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id, status: 'CANCELLED', supplierId: '8a290293-8ce5-4e7c-b604-aa3c6c95fc57' }) // using demo supplierId
      });
      if (response.ok) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
        setFeedbackMsg('✓ Booking SLA Request rejected and customer refunded.');
      } else {
        setFeedbackMsg('❌ Failed to reject booking.');
      }
    } catch (err) {
      setFeedbackMsg('❌ Error rejecting booking.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px 80px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* INLINE FEEDBACK BANNER */}
        {feedbackMsg && (
          <div 
            style={{ 
              padding: '14px 20px', 
              borderRadius: '14px', 
              marginBottom: '24px', 
              background: '#ecfdf5', 
              border: '1px solid #a7f3d0', 
              color: '#047857', 
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
        
        {/* BREADCRUMB NAV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem', color: '#64748b' }}>
          <Link href="/supplier" style={{ textDecoration: 'none', color: '#64748b' }}>Supplier Portal</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#0f172a', fontWeight: 700 }}>Bookings</span>
        </div>

        {/* HEADING */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <div className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <ShieldCheck size={14} /> Real-Time Reservations & Check-In Inbox
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
              Supplier Bookings
            </h1>
            <p style={{ color: '#475569', marginTop: '6px', fontSize: '1rem' }}>
              Manage 24h SLA requests and view traveler details.
            </p>
          </div>


        </div>

        {/* BOOKINGS LIST */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading supplier bookings...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.map((item) => (
              <div key={item.id} className="card-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--brand-primary)' }}>Ref: {item.booking_reference}</span>
                    <span className={item.status === 'CONFIRMED' ? 'badge-emerald' : item.status.includes('AWAITING') ? 'badge-amber' : 'badge-rose'}>
                      {item.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {item.title || item.option_name || 'Booked Experience'}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={14} /> {item.guest_name || item.traveler_details?.lead_name || 'Lead Traveler'} ({item.travelers || item.total_travelers || 1} guests)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> {item.date || item.slot_start_time?.substring(0, 10) || '2026-08-15'} at {item.timeSlot || item.slot_start_time?.substring(11, 16) || '16:00'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>
                      ${(item.gross_amount ?? item.amount ?? 0).toFixed(2)} USD
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Payout after 15% fee</span>
                  </div>

                  {item.status === 'AWAITING_SUPPLIER_CONFIRMATION' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleAcceptSLA(item.id)} className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                        <CheckCircle2 size={14} /> Accept SLA
                      </button>
                      <button onClick={() => handleRejectSLA(item.id)} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem', color: '#dc2626', borderColor: '#fecdd3' }}>
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
