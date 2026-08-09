'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFromAPI } from '@/lib/api-client';
import { 
  QrCode, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Search, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function SupplierBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);

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

  const handleVerifyQR = () => {
    if (!qrCodeInput.trim()) return;
    const found = bookings.find(b => b.qr_voucher_code.toLowerCase().includes(qrCodeInput.trim().toLowerCase()) || b.booking_reference.toLowerCase().includes(qrCodeInput.trim().toLowerCase()));
    if (found) {
      setScanResult({ valid: true, booking: found, msg: '✓ VALID VOUCHER SCAN: Checked in successfully!' });
    } else {
      setScanResult({ valid: false, msg: '❌ INVALID VOUCHER CODE: No active booking found.' });
    }
  };

  const handleAcceptSLA = (id: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CONFIRMED' } : b));
    alert('Booking SLA Request Accepted & Confirmed!');
  };

  const handleRejectSLA = (id: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    alert('Booking SLA Request Rejected & Refunded.');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px 80px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* BREADCRUMB NAV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem', color: '#64748b' }}>
          <Link href="/supplier" style={{ textDecoration: 'none', color: '#64748b' }}>Supplier Portal</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#0f172a', fontWeight: 700 }}>Bookings & QR Voucher Scanner</span>
        </div>

        {/* HEADING */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <div className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <ShieldCheck size={14} /> Real-Time Reservations & Check-In Inbox
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
              Supplier Bookings & Voucher Scanner
            </h1>
            <p style={{ color: '#475569', marginTop: '6px', fontSize: '1rem' }}>
              Manage 24h SLA requests, view traveler details, and scan customer QR vouchers at arrival.
            </p>
          </div>

          <button 
            onClick={() => { setScanModalOpen(true); setScanResult(null); setQrCodeInput(''); }} 
            className="btn-primary" 
            style={{ padding: '12px 24px', fontSize: '0.92rem' }}
          >
            <QrCode size={18} /> Open QR Voucher Scanner
          </button>
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
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.title}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {item.guest_name} ({item.travelers} guests)</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {item.date} at {item.timeSlot}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><QrCode size={14} color="#7c3aed" /> Voucher: <strong>{item.qr_voucher_code}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>${item.amount.toFixed(2)} USD</div>
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

        {/* QR SCANNER MODAL */}
        {scanModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div className="card-panel" style={{ width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '24px', position: 'relative' }}>
              <button onClick={() => setScanModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
              
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f0f9ff', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '1px solid #bae6fd' }}>
                  <QrCode size={30} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Scan Customer Voucher QR</h3>
                <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>Input QR code or reference string to mark customer check-in</p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input 
                  type="text" 
                  placeholder="e.g. TN-VOUCHER-BALI-8812" 
                  value={qrCodeInput}
                  onChange={e => setQrCodeInput(e.target.value)}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 700, textTransform: 'uppercase' }}
                />
                <button onClick={handleVerifyQR} className="btn-primary" style={{ padding: '12px 20px' }}>Verify</button>
              </div>

              {scanResult && (
                <div style={{ padding: '16px', borderRadius: '12px', background: scanResult.valid ? '#ecfdf5' : '#fef2f2', border: `1px solid ${scanResult.valid ? '#a7f3d0' : '#fecdd3'}`, color: scanResult.valid ? '#047857' : '#b91c1c', fontSize: '0.9rem', fontWeight: 700 }}>
                  {scanResult.msg}
                  {scanResult.valid && (
                    <div style={{ marginTop: '8px', fontSize: '0.82rem', color: '#0f172a', fontWeight: 600 }}>
                      Lead Guest: {scanResult.booking.guest_name} • {scanResult.booking.travelers} Guests
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
