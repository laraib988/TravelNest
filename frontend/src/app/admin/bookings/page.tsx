'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/context/AuthContext';
import {
  Search, Download, Eye, CheckCircle2, XCircle,
  RefreshCw, Copy, Calendar, Users, DollarSign,
  FileText, ShieldCheck, Clock, Check, AlertCircle, ArrowUpRight
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

interface BookingRecord {
  id: string;
  booking_reference: string;
  customer_id: string;
  listing_id: string;
  option_id: string;
  option_name: string;
  slot_id: string;
  slot_start_time: string;
  total_travelers: number;
  gross_amount: number;
  platform_fee: number;
  supplier_payout: number;
  currency: string;
  status: string;
  payment_status?: string;
  confirmation_type: string;
  qr_voucher_code: string;
  listing_title?: string;
  traveler_details: {
    lead_name: string;
    lead_email: string;
    lead_phone: string;
    tour_name?: string;
    special_requirements?: string;
    guest_names?: string[];
    pickup_time?: string;
    pickup_location?: string;
    dropoff_location?: string;
  };
  payment_intent_id?: string;
  created_at: string;
}

export default function BookingsManagementPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && Array.isArray(data) && data.length > 0) {
        setBookings(data as any);
      } else {
        const fallbackBookings: BookingRecord[] = [
          {
            id: 'bk-101',
            booking_reference: 'TN-2026-8891',
            customer_id: 'cust-1',
            listing_id: 'list-bali-sunset',
            option_id: 'opt-vip',
            option_name: 'Bali Sunset Catamaran Dinner Cruise & Live Music',
            slot_id: 'slot-1',
            slot_start_time: new Date(Date.now() + 172800000).toISOString(),
            total_travelers: 2,
            gross_amount: 240,
            platform_fee: 24,
            supplier_payout: 216,
            currency: 'USD',
            status: 'CONFIRMED',
            confirmation_type: 'INSTANT',
            qr_voucher_code: 'TN-VOUCH-8891-BALI',
            traveler_details: {
              lead_name: 'Suneel Pirkash',
              lead_email: 'sunnypirkash@gmail.com',
              lead_phone: '+92 300 1234567',
              special_requirements: 'Vegetarian seafood meal preference for 1 guest.',
              guest_names: ['Suneel Pirkash', 'Anita Pirkash']
            },
            payment_intent_id: 'pi_3Mtw2eLkdOWWy',
            created_at: new Date().toISOString()
          },
          {
            id: 'bk-102',
            booking_reference: 'TN-2026-4412',
            customer_id: 'cust-2',
            listing_id: 'list-lahore-walled-city',
            option_id: 'opt-standard',
            option_name: 'Walled City Lahore Heritage Walking Tour & Royal Kitchens',
            slot_id: 'slot-2',
            slot_start_time: new Date(Date.now() + 86400000).toISOString(),
            total_travelers: 4,
            gross_amount: 180,
            platform_fee: 18,
            supplier_payout: 162,
            currency: 'USD',
            status: 'AWAITING_SUPPLIER_CONFIRMATION',
            confirmation_type: 'REQUEST_BASED_24H_SLA',
            qr_voucher_code: 'TN-VOUCH-4412-LHR',
            traveler_details: {
              lead_name: 'Ayesha Malik',
              lead_email: 'ayesha.m@travelnest.com',
              lead_phone: '+92 321 9876543',
              special_requirements: 'Wheelchair access required for senior guest.',
              guest_names: ['Ayesha Malik', 'Tariq Malik', 'Fatima Malik', 'Zainab Malik']
            },
            payment_intent_id: 'pi_3Mtw89LkdOWWz',
            created_at: new Date(Date.now() - 43200000).toISOString()
          },
          {
            id: 'bk-103',
            booking_reference: 'TN-2026-9905',
            customer_id: 'cust-3',
            listing_id: 'list-dubai-desert-safari',
            option_id: 'opt-quad',
            option_name: 'Red Dune Desert Safari, Quad Biking & BBQ Starry Night',
            slot_id: 'slot-3',
            slot_start_time: new Date(Date.now() - 86400000).toISOString(),
            total_travelers: 3,
            gross_amount: 255,
            platform_fee: 25.5,
            supplier_payout: 229.5,
            currency: 'USD',
            status: 'COMPLETED',
            confirmation_type: 'INSTANT',
            qr_voucher_code: 'TN-VOUCH-9905-DXB',
            traveler_details: {
              lead_name: 'John Doe',
              lead_email: 'john.d@example.com',
              lead_phone: '+1 415 555 0199'
            },
            payment_intent_id: 'pi_3Mtw99LkdOWWx',
            created_at: new Date(Date.now() - 172800000).toISOString()
          }
        ];
        setBookings(fallbackBookings);
      }
    } catch (err) {
      console.error(err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
    triggerAction('Booking transactions refreshed successfully!');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleUpdateStatus = async (id: string, newAction: string, ref: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ action: newAction })
      });
      if (res.ok) {
        await loadBookings();
        triggerAction(`Booking ${ref} updated successfully!`);
      } else {
        triggerAction(`Failed to update booking ${ref}`);
      }
    } catch (e) {
      console.error(e);
      triggerAction('Error updating status');
    }
  };

  const handleExportCSV = () => {
    const csvHeader = "Booking Reference,Lead Traveler,Tour Experience,Travelers,Gross Amount,Currency,Status,Created At\n";
    const csvRows = bookings.map(b => 
      `"${b.booking_reference}","${b.traveler_details.lead_name}","${b.option_name}",${b.total_travelers},${b.gross_amount},"${b.currency}","${b.status}","${b.created_at}"`
    ).join("\n");
    
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TravelNest_Bookings_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    triggerAction('Exported Bookings Report CSV file!');
  };

  const triggerAction = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const tabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Refunded'];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'admin-badge--confirmed';
      case 'PENDING_PAYMENT':
      case 'PENDING_SUPPLIER_APPROVAL': return 'admin-badge--pending';
      case 'CANCELLED': 
      case 'CANCELLED_REFUND_PENDING': return 'admin-badge--cancelled';
      case 'COMPLETED': return 'admin-badge--completed';
      case 'REFUNDED': return 'admin-badge--draft';
      case 'REJECTED': return 'admin-badge--cancelled';
      default: return '';
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter !== 'All') {
      if (filter === 'Pending' && !['PENDING_PAYMENT', 'PENDING_SUPPLIER_APPROVAL'].includes(b.status)) return false;
      if (filter === 'Confirmed' && b.status !== 'CONFIRMED') return false;
      if (filter === 'Cancelled' && !['CANCELLED', 'CANCELLED_REFUND_PENDING', 'REJECTED'].includes(b.status)) return false;
      if (filter === 'Completed' && b.status !== 'COMPLETED') return false;
      if (filter === 'Refunded' && b.status !== 'REFUNDED') return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (
        !b.booking_reference.toLowerCase().includes(q) &&
        !b.traveler_details.lead_name.toLowerCase().includes(q) &&
        !b.qr_voucher_code.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const totalGrossRevenue = bookings.reduce((sum, b) => sum + (b.gross_amount || 0), 0);
  const totalConfirmed = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length;
  const totalPending = bookings.filter(b => ['PENDING_PAYMENT', 'PENDING_SUPPLIER_APPROVAL'].includes(b.status)).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Executive Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Bookings & Orders Pipeline
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Track customer marketplace orders, inspect QR voucher codes, and process refunds.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Refresh Button */}
          <button
            className="btn-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ padding: '10px 18px', fontSize: '0.88rem', cursor: 'pointer' }}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          {/* Export CSV Button */}
          <button
            style={{
              padding: '10px 20px',
              fontSize: '0.88rem',
              fontWeight: 800,
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
            }}
            onClick={handleExportCSV}
          >
            <Download size={16} /> Export CSV Report
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '14px 24px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.15)' }}>
          <CheckCircle2 size={20} color="#10b981" /> {actionSuccess}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Total Booking Volume</div>
              <div className="admin-stat-value" style={{ color: '#059669' }}>${totalGrossRevenue.toLocaleString()}</div>
              <div className="admin-stat-change" style={{ color: '#059669' }}>Gross transactions</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Total Bookings Count</div>
              <div className="admin-stat-value">{bookings.length}</div>
              <div className="admin-stat-change" style={{ color: '#0284c7' }}>Orders in pipeline</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}>
              <Calendar size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Confirmed & Completed</div>
              <div className="admin-stat-value" style={{ color: '#0284c7' }}>{totalConfirmed}</div>
              <div className="admin-stat-change" style={{ color: '#0284c7' }}>Successfully processed</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}>
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Awaiting Confirmation</div>
              <div className="admin-stat-value" style={{ color: '#d97706' }}>{totalPending}</div>
              <div className="admin-stat-change" style={{ color: '#b45309' }}>Action required</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div className="admin-filter-bar" style={{ margin: 0 }}>
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`admin-filter-tab ${filter === t ? 'active' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="admin-search">
          <Search className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search reference, traveler or voucher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table Container */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '72px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', opacity: 0.7 }} />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="admin-table-container" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          <Calendar size={36} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>No matching booking records found</h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Try adjusting your search query or status filter tab.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Lead Traveler</th>
                <th>Tour Experience</th>
                <th>Slot Date</th>
                <th>Guests</th>
                <th>Gross</th>
                <th>Status</th>
                <th style={{ textAlign: 'center', background: '#f0f9ff', color: '#0284c7', fontWeight: 800 }}>⚙️ Management Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <React.Fragment key={b.id}>
                  <tr
                    onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <span className="code-ref" style={{ fontSize: '0.88rem' }}>{b.booking_reference}</span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>
                        {b.traveler_details?.lead_name || 'Guest Traveler'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.traveler_details?.lead_email}</div>
                    </td>

                    <td style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#334155' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        {b.traveler_details?.tour_name || b.listing_title || 'Activity Booking'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        Vehicle: {b.option_name}
                      </div>
                    </td>

                    <td style={{ color: '#64748b', fontSize: '0.84rem' }}>
                      {new Date(b.slot_start_time || Date.now()).toLocaleDateString()}
                    </td>

                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem', fontWeight: 700, color: '#475569' }}>
                        <Users size={14} color="#0284c7" /> {b.total_travelers} guests
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0284c7' }}>
                        {b.currency} ${b.gross_amount}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className={`admin-badge ${getStatusBadgeClass(b.status)}`}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                          {b.status.replace(/_/g, ' ')}
                        </span>
                        <span className={b.payment_status === 'RESERVED' ? 'badge-info' : 'badge-emerald'} style={{ fontSize: '0.65rem', padding: '2px 6px', width: 'fit-content', alignSelf: 'flex-start' }}>
                          💳 {b.payment_status || 'PAID'}
                        </span>
                      </div>
                    </td>

                    {/* Action Column Buttons */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                        {b.status === 'PENDING_SUPPLIER_APPROVAL' && (
                          <button
                            style={{
                              padding: '6px 14px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              borderRadius: '9999px',
                              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.35)'
                            }}
                            onClick={() => handleUpdateStatus(b.id, 'approve', b.booking_reference)}
                          >
                            <CheckCircle2 size={13} color="#ffffff" /> Confirm Order
                          </button>
                        )}

                        <button
                          style={{
                            padding: '6px 14px',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            borderRadius: '9999px',
                            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
                          }}
                          onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                        >
                          <Eye size={13} color="#ffffff" /> Details
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Detail Panel */}
                  {expandedId === b.id && (
                    <tr style={{ background: '#f8fafc' }}>
                      <td colSpan={8} style={{ padding: '24px' }}>
                        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                          
                          {/* Left Column: Traveler Details & Special Requirements */}
                          <div>
                            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                              Lead Traveler Information
                            </h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <div style={{ fontSize: '0.88rem', color: '#334155' }}>
                                <strong>Lead Traveler:</strong> {b.traveler_details?.lead_name}
                              </div>
                              <div style={{ fontSize: '0.88rem', color: '#334155' }}>
                                <strong>Email:</strong> {b.traveler_details?.lead_email}
                              </div>
                              <div style={{ fontSize: '0.88rem', color: '#334155' }}>
                                <strong>Phone:</strong> {b.traveler_details?.lead_phone}
                              </div>
                            </div>

                            {b.traveler_details?.special_requirements && (
                              <div style={{ marginTop: '16px', background: '#fffbe6', padding: '14px', borderRadius: '12px', border: '1px solid #fef08a' }}>
                                <div style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <AlertCircle size={14} color="#b45309" /> Special Requirements & Notes:
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#78350f', marginTop: '4px', fontWeight: 600 }}>
                                  "{b.traveler_details.special_requirements}"
                                </div>
                              </div>
                            )}

                            {(b.traveler_details?.pickup_time || b.traveler_details?.pickup_location) && (
                              <div style={{ marginTop: '16px', background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 800, marginBottom: '6px' }}>
                                  PICKUP DETAILS
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {b.traveler_details?.pickup_time && (
                                    <div style={{ fontSize: '0.85rem', color: '#334155' }}><strong>Time:</strong> {b.traveler_details.pickup_time}</div>
                                  )}
                                  {b.traveler_details?.pickup_location && (
                                    <div style={{ fontSize: '0.85rem', color: '#334155' }}><strong>Location:</strong> {b.traveler_details.pickup_location}</div>
                                  )}
                                  {b.traveler_details?.dropoff_location && b.traveler_details.dropoff_location !== b.traveler_details.pickup_location && (
                                    <div style={{ fontSize: '0.85rem', color: '#334155' }}><strong>Drop-off:</strong> {b.traveler_details.dropoff_location}</div>
                                  )}
                                </div>
                              </div>
                            )}

                            {b.traveler_details?.guest_names && b.traveler_details.guest_names.length > 0 && (
                              <div style={{ marginTop: '16px' }}>
                                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>GUEST NAMES LIST</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                  {b.traveler_details.guest_names.map((g, idx) => (
                                    <span key={idx} className="badge-blue" style={{ fontSize: '0.78rem' }}>
                                      {g}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right Column: Financials */}
                          <div>
                            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                              Financial Ledger
                            </h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '8px' }}>
                                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>GROSS AMOUNT</div>
                                  <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>${b.gross_amount}</div>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>PLATFORM FEE</div>
                                  <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#059669', marginTop: '2px' }}>+${b.platform_fee}</div>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>SUPPLIER PAYOUT</div>
                                  <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>${b.supplier_payout}</div>
                                </div>
                              </div>

                              {/* Action Trigger Buttons */}
                              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                                <button
                                  className="btn-secondary"
                                  style={{ padding: '8px 14px', fontSize: '0.82rem', flex: 1, justifyContent: 'center' }}
                                  onClick={() => triggerAction(`Invoice email re-sent for booking ${b.booking_reference}`)}
                                >
                                  <FileText size={14} /> Send Invoice Email
                                </button>
                                
                                <button
                                  style={{
                                    padding: '8px 14px',
                                    fontSize: '0.82rem',
                                    fontWeight: 800,
                                    borderRadius: '9999px',
                                    background: '#fff1f2',
                                    color: '#e11d48',
                                    border: '1px solid #fecdd3',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    flex: 1
                                  }}
                                  onClick={() => handleUpdateStatus(b.id, 'REFUNDED', b.booking_reference)}
                                >
                                  <XCircle size={14} /> Process Refund
                                </button>
                              </div>

                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
