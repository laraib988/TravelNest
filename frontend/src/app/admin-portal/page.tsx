'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchFromAPI } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import {
  DollarSign, Calendar, Users, ShieldCheck, TrendingUp, TrendingDown,
  ArrowUpRight, BarChart3, Star, Activity, Zap, Tag,
  MessageSquare, Wallet, Eye, Clock, Globe, Sparkles, CheckCircle2
} from 'lucide-react';

interface Stats {
  revenue: number;
  activeBookings: number;
  registeredUsers: number;
  pendingVerifications: number;
  revenueChange: number;
  bookingsChange: number;
  usersChange: number;
}

interface Booking {
  id: string;
  booking_reference: string;
  customer_name?: string;
  traveler_details?: { lead_name: string };
  listing_name?: string;
  option_name?: string;
  slot_start_time?: string;
  created_at: string;
  gross_amount: number;
  currency: string;
  status: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'7D' | '30D' | '90D'>('7D');

  useEffect(() => {
    async function loadDashboardData(showLoading = true) {
      try {
        if (showLoading) setLoading(true);
        const statsData = await getAdminDashboardStats();
        setStats(statsData);
        
        const bData = await getAdminBookings();
        setRecentBookings(bData.slice(0, 6));
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        if (showLoading) setLoading(false);
      }
    }

    loadDashboardData(true);
    const interval = setInterval(() => {
      loadDashboardData(false);
    }, 5000); // Fetch real-time data every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'CONFIRMED' || s === 'COMPLETED') return 'admin-badge--confirmed';
    if (s.includes('PENDING') || s.includes('AWAITING')) return 'admin-badge--pending';
    if (s === 'CANCELLED' || s === 'REFUNDED') return 'admin-badge--cancelled';
    return 'admin-badge--pending';
  };

  const chartData = [
    { day: 'Mon', value: 45, label: '$4,500' },
    { day: 'Tue', value: 65, label: '$6,500' },
    { day: 'Wed', value: 55, label: '$5,500' },
    { day: 'Thu', value: 80, label: '$8,000' },
    { day: 'Fri', value: 95, label: '$9,500' },
    { day: 'Sat', value: 100, label: '$10,000', isPeak: true },
    { day: 'Sun', value: 85, label: '$8,500' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: '140px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', opacity: 0.7 }} />
          ))}
        </div>
        <div style={{ height: '320px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', opacity: 0.7 }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Executive Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Executive Overview
            </h1>
            <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span>
              Live Sync
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>
            Welcome back, <strong>{user?.name || 'Administrator'}</strong>. Here is your marketplace operational snapshot.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '9999px', fontSize: '0.84rem', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <Clock size={15} color="#0284c7" /> Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="admin-stats-grid">
        {/* Total Revenue */}
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Total Platform Sales</div>
              <div className="admin-stat-value">{formatCurrency(stats?.revenue || 0)}</div>
              <div className="admin-stat-change" style={{ color: '#059669' }}>
                <span style={{ background: '#ecfdf5', padding: '2px 8px', borderRadius: '6px', border: '1px solid #a7f3d0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} /> +{stats?.revenueChange}%
                </span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>vs last month</span>
              </div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}>
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        {/* Active Bookings */}
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Active Bookings</div>
              <div className="admin-stat-value">{(stats?.activeBookings ?? 0).toLocaleString()}</div>
              <div className="admin-stat-change" style={{ color: '#059669' }}>
                <span style={{ background: '#ecfdf5', padding: '2px 8px', borderRadius: '6px', border: '1px solid #a7f3d0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} /> +{stats?.bookingsChange ?? 0}%
                </span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>confirmed slots</span>
              </div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
              <Calendar size={24} />
            </div>
          </div>
        </div>

        {/* Registered Users */}
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Registered Travelers</div>
              <div className="admin-stat-value">{(stats?.registeredUsers ?? 0).toLocaleString()}</div>
              <div className="admin-stat-change" style={{ color: '#059669' }}>
                <span style={{ background: '#ecfdf5', padding: '2px 8px', borderRadius: '6px', border: '1px solid #a7f3d0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} /> +{stats?.usersChange ?? 0}%
                </span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>new accounts</span>
              </div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)' }}>
              <Users size={24} />
            </div>
          </div>
        </div>

        {/* Pending KYC Verifications */}
        <div className="admin-stat-card" style={{ borderLeft: '4px solid #d97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Pending Verification</div>
              <div className="admin-stat-value" style={{ color: '#d97706' }}>{stats?.pendingVerifications ?? 0}</div>
              <div className="admin-stat-change" style={{ color: '#b45309' }}>
                <span style={{ background: '#fffbe6', padding: '2px 8px', borderRadius: '6px', border: '1px solid #fde68a', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Activity size={14} /> Action Required
                </span>
              </div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}>
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Analytics Chart Container */}
      <div className="admin-chart-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={20} color="#0284c7" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Revenue Trajectory & Sales Volumes</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>Gross revenue distribution across active booking channels</p>
          </div>
          
          <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '9999px', border: '1px solid #e2e8f0' }}>
            {(['7D', '30D', '90D'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                style={{
                  padding: '6px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedPeriod === period ? '#ffffff' : 'transparent',
                  color: selectedPeriod === period ? '#0284c7' : '#64748b',
                  boxShadow: selectedPeriod === period ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: '280px', display: 'flex', alignItems: 'flex-end', gap: '3%', position: 'relative', paddingTop: '20px' }}>
          {/* Y-axis labels */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', paddingRight: '16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, borderRight: '1px dashed #e2e8f0' }}>
            <span>$10,000</span>
            <span>$7,500</span>
            <span>$5,000</span>
            <span>$2,500</span>
            <span>$0</span>
          </div>

          {chartData.map((item, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div 
                className="chart-bar"
                style={{ 
                  width: '65%', 
                  height: `${item.value}%`, 
                  background: item.isPeak ? 'linear-gradient(to top, #0284c7, #7c3aed)' : 'linear-gradient(to top, #0284c7, #38bdf8)',
                  borderRadius: '8px 8px 0 0',
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  boxShadow: item.isPeak ? '0 4px 16px rgba(124, 58, 237, 0.3)' : 'none'
                }}
              >
                {item.isPeak && (
                  <span style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', background: '#7c3aed', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                    PEAK
                  </span>
                )}
              </div>
              <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>
                {item.day}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Width Sequential Flow: Recent Bookings & Quick Operations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Recent Bookings Table (Full Width) */}
        <div className="admin-table-container">
          <div style={{ padding: '24px 28px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Recent Booking Pipeline</h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>Latest customer transactions and voucher codes</p>
            </div>
            <Link href="/admin-portal/bookings" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: '9999px', textDecoration: 'none' }}>
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking Ref</th>
                  <th>Lead Traveler</th>
                  <th>Experience</th>
                  <th>Date</th>
                  <th>Gross</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <span className="code-ref">{booking.booking_reference}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        {booking.traveler_details?.lead_name || booking.customer_name || 'Guest User'}
                      </div>
                    </td>
                    <td style={{ color: '#475569', fontWeight: 500, maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {booking.option_name || booking.listing_name || 'Unknown Tour'}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.84rem' }}>
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: 800, color: '#0f172a' }}>
                      {formatCurrency(booking.gross_amount, booking.currency)}
                    </td>
                    <td>
                      <span className={`admin-badge ${getStatusBadgeClass(booking.status)}`}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                        {booking.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <Link href="/admin-portal/bookings" className="admin-filter-tab" style={{ padding: '4px 10px', fontSize: '0.78rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={13} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operations Grid (Full Width) */}
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Quick Operations & Shortcuts</h3>
          <div className="admin-quick-actions">
            <Link href="/admin-portal/suppliers" className="admin-quick-action-card">
              <div style={{ background: '#ecfdf5', color: '#059669', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <ShieldCheck size={22} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Verify Suppliers</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>Review pending KYC documents</p>
            </Link>
            
            <Link href="/admin-portal/promotions" className="admin-quick-action-card">
              <div style={{ background: '#f3e8ff', color: '#7c3aed', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Tag size={22} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Promotions</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>Create discount coupons</p>
            </Link>
            
            <Link href="/admin-portal/reviews" className="admin-quick-action-card">
              <div style={{ background: '#fffbe6', color: '#b45309', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <MessageSquare size={22} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Moderation</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>Inspect flagged reviews</p>
            </Link>
            
            <Link href="/admin-portal/payouts" className="admin-quick-action-card">
              <div style={{ background: '#eff6ff', color: '#1d4ed8', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Wallet size={22} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Payouts</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>Process supplier earnings</p>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
