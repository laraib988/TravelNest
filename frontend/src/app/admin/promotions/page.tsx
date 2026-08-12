'use client';

import React, { useState, useEffect } from 'react';
import { fetchFromAPI } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import {
  Search, Plus, Copy, Edit2, Trash2, Power, X, Tag, RefreshCw, Check, CheckCircle2, DollarSign, Percent, Calendar
} from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  min_spend: number;
  max_discount?: number;
  valid_from: string;
  valid_to: string;
  usage_limit: number;
  used_count: number;
  applicable_categories: string[];
  status: 'ACTIVE' | 'EXPIRED' | 'DEACTIVATED';
}

export default function AdminPromotionsPage() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState({
    code: 'SUMMER2026',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    value: 20,
    min_spend: 100,
    max_discount: 50,
    valid_from: new Date().toISOString().slice(0, 16),
    valid_to: new Date(Date.now() + 2592000000).toISOString().slice(0, 16),
    usage_limit: 500,
    categories: ['Tours & Experiences', 'Desert Safaris']
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setIsLoading(true);
      let data = await fetchFromAPI('/promotions/coupons').catch(() => null);

      if (!data || !Array.isArray(data) || data.length === 0) {
        data = [
          {
            id: 'c-1',
            code: 'SUMMER2026',
            type: 'PERCENTAGE',
            value: 20,
            min_spend: 100,
            max_discount: 50,
            valid_from: '2026-06-01T00:00:00Z',
            valid_to: '2026-09-30T23:59:59Z',
            usage_limit: 1000,
            used_count: 850,
            applicable_categories: ['Tours & Experiences', 'Water Sports'],
            status: 'ACTIVE'
          },
          {
            id: 'c-2',
            code: 'WELCOME50',
            type: 'FIXED',
            value: 50,
            min_spend: 250,
            valid_from: '2026-01-01T00:00:00Z',
            valid_to: '2026-12-31T23:59:59Z',
            usage_limit: 500,
            used_count: 120,
            applicable_categories: ['All Categories'],
            status: 'ACTIVE'
          },
          {
            id: 'c-3',
            code: 'FLASH50',
            type: 'PERCENTAGE',
            value: 50,
            min_spend: 300,
            max_discount: 150,
            valid_from: '2026-05-01T00:00:00Z',
            valid_to: '2026-07-01T00:00:00Z',
            usage_limit: 200,
            used_count: 200,
            applicable_categories: ['Desert Safaris', 'Luxury Catamarans'],
            status: 'EXPIRED'
          }
        ];
      }
      setCoupons(data);
    } catch (err) {
      console.error(err);
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCoupons();
    setRefreshing(false);
    triggerAction('Promotions & Coupon Directory refreshed!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2500);
    triggerAction(`Coupon code "${text}" copied to clipboard!`);
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    triggerAction(`Coupon "${code}" deleted successfully!`);
  };

  const handleToggleCouponStatus = (id: string, currentStatus: string, code: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: nextStatus as any } : c))
    );
    triggerAction(`Coupon "${code}" status set to ${nextStatus}!`);
  };

  const handleAutoGenerateCode = () => {
    const prefix = ['SUMMER', 'TRAVEL', 'NEST', 'FLASH', 'VIP', 'OFFER'][Math.floor(Math.random() * 6)];
    const randNum = Math.floor(100 + Math.random() * 900);
    const newCode = `${prefix}${randNum}`;
    setCouponForm((prev) => ({ ...prev, code: newCode }));
  };

  const triggerAction = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.applicable_categories.some((cat) => cat.toLowerCase().includes(search.toLowerCase()))
  );

  const activeCouponsCount = coupons.filter((c) => c.status === 'ACTIVE').length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.used_count || 0), 0);
  const estimatedDiscountGiven = coupons.reduce((sum, c) => sum + ((c.used_count || 0) * (c.type === 'FIXED' ? c.value : 25)), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Executive Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Promotions & Coupon Management
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Generate discount promo codes, manage minimum spend rules, and track redemption analytics.
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

          {/* Create Coupon Trigger */}
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
            onClick={() => {
              setEditingCoupon(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} /> Create New Coupon
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
              <div className="admin-stat-label">Active Promo Codes</div>
              <div className="admin-stat-value" style={{ color: '#059669' }}>{activeCouponsCount}</div>
              <div className="admin-stat-change" style={{ color: '#059669' }}>Currently redeemable</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Tag size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Total Redemptions</div>
              <div className="admin-stat-value">{totalRedemptions.toLocaleString()}</div>
              <div className="admin-stat-change" style={{ color: '#0284c7' }}>Applied in checkout</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}>
              <Check size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Total Discounts Savings</div>
              <div className="admin-stat-value" style={{ color: '#7c3aed' }}>${estimatedDiscountGiven.toLocaleString()}</div>
              <div className="admin-stat-change" style={{ color: '#7c3aed' }}>Customer savings given</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}>
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div className="admin-search" style={{ width: '100%', maxWidth: '420px' }}>
          <Search className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search promo code or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table Container */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '72px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', opacity: 0.7 }} />
          ))}
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="admin-table-container" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          <Tag size={36} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>No coupons found</h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Create a new promo code to offer checkout discounts.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Promo Code</th>
                <th>Discount Value</th>
                <th>Min Spend</th>
                <th>Validity Period</th>
                <th>Redemptions</th>
                <th>Categories</th>
                <th>Status</th>
                <th style={{ textAlign: 'center', background: '#f0f9ff', color: '#0284c7', fontWeight: 800 }}>⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((c) => {
                const usagePercent = Math.min(100, (c.used_count / (c.usage_limit || 1)) * 100);

                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="code-ref" style={{ fontSize: '0.9rem', color: '#0284c7' }}>
                          {c.code}
                        </span>
                        <button
                          onClick={() => copyToClipboard(c.code)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                          title="Copy Code"
                        >
                          {copiedCode === c.code ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>

                    <td>
                      <span className={`admin-badge ${c.type === 'PERCENTAGE' ? 'badge-purple' : 'badge-blue'}`}>
                        {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `$${c.value} OFF`}
                      </span>
                    </td>

                    <td style={{ color: '#334155', fontWeight: 700, fontSize: '0.88rem' }}>
                      ${c.min_spend}
                    </td>

                    <td style={{ color: '#64748b', fontSize: '0.84rem' }}>
                      {new Date(c.valid_from).toLocaleDateString()} → {new Date(c.valid_to).toLocaleDateString()}
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '120px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
                          <span>{c.used_count} used</span>
                          <span>{c.usage_limit} limit</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ width: `${usagePercent}%`, height: '100%', background: 'linear-gradient(90deg, #0284c7, #2563eb)' }} />
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '200px' }}>
                        {c.applicable_categories.map((cat, idx) => (
                          <span key={idx} style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <span className={`admin-badge ${c.status === 'ACTIVE' ? 'admin-badge--confirmed' : c.status === 'EXPIRED' ? 'admin-badge--cancelled' : 'admin-badge--draft'}`}>
                        {c.status}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
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
                            gap: '4px'
                          }}
                          onClick={() => {
                            setEditingCoupon(c);
                            setCouponForm({
                              code: c.code,
                              type: c.type,
                              value: c.value,
                              min_spend: c.min_spend,
                              max_discount: c.max_discount || 50,
                              valid_from: new Date(c.valid_from).toISOString().slice(0, 16),
                              valid_to: new Date(c.valid_to).toISOString().slice(0, 16),
                              usage_limit: c.usage_limit,
                              categories: c.applicable_categories
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={13} color="#ffffff" /> Edit
                        </button>

                        <button
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            borderRadius: '9999px',
                            background: c.status === 'ACTIVE' ? '#fff1f2' : '#ecfdf5',
                            color: c.status === 'ACTIVE' ? '#e11d48' : '#047857',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onClick={() => handleToggleCouponStatus(c.id, c.status, c.code)}
                        >
                          <Power size={13} />
                        </button>

                        <button
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            borderRadius: '9999px',
                            background: '#fff1f2',
                            color: '#e11d48',
                            border: '1px solid #fecdd3',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleDeleteCoupon(c.id, c.code)}
                          title="Delete Coupon"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0', animation: 'admin-fade-in 0.25s ease-out forwards' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Tag size={22} color="#0284c7" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {editingCoupon ? 'Edit Coupon Settings' : 'Create New Promo Coupon'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingCoupon) {
                setCoupons((prev) =>
                  prev.map((c) =>
                    c.id === editingCoupon.id
                      ? {
                          ...c,
                          code: couponForm.code.toUpperCase(),
                          type: couponForm.type,
                          value: Number(couponForm.value),
                          min_spend: Number(couponForm.min_spend),
                          usage_limit: Number(couponForm.usage_limit),
                          valid_from: new Date(couponForm.valid_from).toISOString(),
                          valid_to: new Date(couponForm.valid_to).toISOString(),
                          applicable_categories: couponForm.categories
                        }
                      : c
                  )
                );
                triggerAction(`Coupon "${couponForm.code}" updated successfully!`);
              } else {
                const newC: Coupon = {
                  id: `c-${Date.now()}`,
                  code: couponForm.code.toUpperCase(),
                  type: couponForm.type,
                  value: Number(couponForm.value),
                  min_spend: Number(couponForm.min_spend),
                  max_discount: Number(couponForm.max_discount) || 50,
                  valid_from: new Date(couponForm.valid_from).toISOString(),
                  valid_to: new Date(couponForm.valid_to).toISOString(),
                  usage_limit: Number(couponForm.usage_limit),
                  used_count: 0,
                  applicable_categories: couponForm.categories,
                  status: 'ACTIVE'
                };
                setCoupons([newC, ...coupons]);
                triggerAction(`New Coupon "${couponForm.code.toUpperCase()}" Created!`);
              }
              setIsModalOpen(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Code & Auto-Generate */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>Coupon Promo Code *</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUMMER2026"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                    style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.92rem', outline: 'none', fontFamily: 'monospace', fontWeight: 700 }}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleAutoGenerateCode}
                    style={{ padding: '12px 16px', fontSize: '0.85rem' }}
                  >
                    Auto Generate
                  </button>
                </div>
              </div>

              {/* Type & Value */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>Discount Type *</label>
                  <select
                    value={couponForm.type}
                    onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value as any })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: '#ffffff', cursor: 'pointer' }}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>Discount Value ({couponForm.type === 'PERCENTAGE' ? '%' : '$'}) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={couponForm.value}
                    onChange={(e) => setCouponForm({ ...couponForm, value: Number(e.target.value) })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Min Spend & Usage Limit */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>Minimum Spend ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={couponForm.min_spend}
                    onChange={(e) => setCouponForm({ ...couponForm, min_spend: Number(e.target.value) })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>Max Usage Limit *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={couponForm.usage_limit}
                    onChange={(e) => setCouponForm({ ...couponForm, usage_limit: Number(e.target.value) })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Validity Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>Valid From *</label>
                  <input
                    type="datetime-local"
                    required
                    value={couponForm.valid_from}
                    onChange={(e) => setCouponForm({ ...couponForm, valid_from: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>Valid Until *</label>
                  <input
                    type="datetime-local"
                    required
                    value={couponForm.valid_to}
                    onChange={(e) => setCouponForm({ ...couponForm, valid_to: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1.5,
                    padding: '12px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
                  }}
                >
                  Save Coupon
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
