'use client';

import { useState, useEffect } from 'react';
import { fetchFromAPI } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Users, Compass, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customer/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : (data.data || []));
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Upcoming') return b.status === 'CONFIRMED' || b.status === 'PENDING';
    if (activeTab === 'Completed') return b.status === 'COMPLETED';
    if (activeTab === 'Cancelled') return b.status === 'CANCELLED';
    return true;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'badge-emerald';
      case 'PENDING': return 'badge-amber';
      case 'CANCELLED': return 'badge-rose';
      case 'COMPLETED': return 'badge-emerald';
      default: return 'badge-amber';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* PAGE TITLE */}
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 800, color: '#0f172a' }}>My Bookings</h1>
        <p style={{ color: '#475569', marginBottom: '32px' }}>Manage your upcoming reservations, access QR vouchers, and track past activities.</p>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`chip-filter ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="animate-pulse-glow" style={{ color: 'var(--brand-primary)' }}><Compass size={40} /></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="card-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
            <Compass size={64} color="#94a3b8" style={{ margin: '0 auto 24px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#0f172a' }}>No bookings found</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Looks like you don't have any {activeTab.toLowerCase()} bookings yet.</p>
            <Link href="/" className="btn-primary" style={{ padding: '12px 32px' }}>
              Explore Activities
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="card-panel" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  <div style={{ padding: '24px', display: 'flex', gap: '24px', flex: 1, minWidth: '300px' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '16px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', overflow: 'hidden' }}>
                      {booking.listing_image ? (
                        <img src={booking.listing_image} alt="Tour" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Compass size={40} />
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span className={getStatusBadgeClass(booking.status)} style={{ display: 'inline-block', width: 'fit-content', marginBottom: '8px' }}>
                          ⚡ {booking.status === 'PENDING_SUPPLIER_APPROVAL' ? 'PENDING APPROVAL' : booking.status}
                        </span>
                        <span className={booking.payment_status === 'RESERVED' ? 'badge-info' : 'badge-emerald'} style={{ display: 'inline-block', width: 'fit-content', marginBottom: '8px', padding: '4px 12px' }}>
                          💳 {booking.payment_status || 'PAID'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', fontWeight: 700, color: '#0f172a' }}>{booking.traveler_details?.tour_name || booking.listing_title || 'Activity Booking'}</h3>
                      <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '12px', fontWeight: 600 }}>Vehicle / Option: {booking.option_name}</div>
                      <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {new Date(booking.slot_start_time || booking.created_at).toLocaleDateString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {booking.total_travelers} Guests</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', borderLeft: '1px solid #e2e8f0', minWidth: '200px' }}>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Total Paid</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '16px' }}>${booking.gross_amount} {booking.currency}</span>
                    <button
                      onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', fontWeight: 700 }}
                    >
                      {expandedId === booking.id ? 'Hide Details' : 'View Details'} {expandedId === booking.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {expandedId === booking.id && (
                  <div style={{ padding: '24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                    <div>
                      <h4 style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '6px' }}>Traveler Details</h4>
                      <p style={{ fontWeight: 700, color: '#0f172a' }}>Lead Guest: {booking.traveler_details?.lead_name || booking.lead_name}</p>
                      <p style={{ fontSize: '0.85rem', color: '#475569', margin: '4px 0' }}>Email: {booking.traveler_details?.lead_email}</p>
                      <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0' }}>Phone: {booking.traveler_details?.lead_phone}</p>
                      {booking.traveler_details?.special_requirements && (
                        <p style={{ fontSize: '0.85rem', color: '#d97706', margin: '4px 0', background: '#fef3c7', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                          Note: {booking.traveler_details.special_requirements}
                        </p>
                      )}
                      {(booking.traveler_details?.pickup_location || booking.traveler_details?.pickup_time) && (
                        <div style={{ marginTop: '12px' }}>
                          <h4 style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '6px' }}>Pickup Details</h4>
                          {booking.traveler_details?.pickup_time && <p style={{ fontSize: '0.85rem', color: '#475569', margin: '2px 0' }}>Time: {booking.traveler_details.pickup_time}</p>}
                          {booking.traveler_details?.pickup_location && <p style={{ fontSize: '0.85rem', color: '#475569', margin: '2px 0' }}>Location: {booking.traveler_details.pickup_location}</p>}
                          {booking.traveler_details?.dropoff_location && booking.traveler_details.dropoff_location !== booking.traveler_details.pickup_location && <p style={{ fontSize: '0.85rem', color: '#475569', margin: '2px 0' }}>Drop-off: {booking.traveler_details.dropoff_location}</p>}
                        </div>
                      )}
                      <h4 style={{ color: '#64748b', fontSize: '0.85rem', margin: '16px 0 6px 0' }}>Booking Reference</h4>
                      <p style={{ fontWeight: 700, color: '#0f172a' }}>{booking.booking_reference || booking.id}</p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {['CONFIRMED', 'PENDING_SUPPLIER_APPROVAL'].includes(booking.status) && (
                        <button 
                          onClick={async () => {
                            const isPaid = booking.payment_status === 'PAID';
                            const msg = isPaid 
                              ? 'Are you sure you want to cancel this booking? A refund will be processed within 14 days.'
                              : 'Are you sure you want to cancel this reservation?';
                            if (window.confirm(msg)) {
                              // OPTIMISTIC UPDATE: Update UI instantly before server response
                                const previousBookings = [...bookings];
                                setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'CANCELLED' } : b));
                                
                                try {
                                  const res = await fetch(`/api/bookings/${booking.id}/status`, {
                                    method: 'PATCH',
                                    body: JSON.stringify({ action: 'cancel' })
                                  });
                                  if (!res.ok) {
                                    // ROLLBACK on failure
                                    setBookings(previousBookings);
                                    alert('Failed to cancel booking. Please try again.');
                                  }
                                } catch (e) {
                                  console.error('Error cancelling', e);
                                  // ROLLBACK on error
                                  setBookings(previousBookings);
                                  alert('An error occurred. Please try again.');
                                }
                            }
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', padding: '10px 20px', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          <AlertTriangle size={16} /> Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
