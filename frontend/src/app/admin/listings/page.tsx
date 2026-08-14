'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchFromAPI } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutGrid, List, Search, Plus, ExternalLink, Star, Edit, PowerOff,
  CheckCircle2, Clock, MapPin, Tag, ShieldCheck, RefreshCw, X, Sparkles, Filter, Trash2,
  ArrowLeft, Image as ImageIcon, Check, Users, Activity, Info, Calendar, Car
} from 'lucide-react';

interface Listing {
  id: string;
  supplier_id: string;
  destination_id: string;
  category_id: string;
  category_name: string;
  title: string;
  slug: string;
  summary: string;
  base_price: number;
  currency: string;
  duration_minutes: number;
  cached_rating_avg: number;
  cached_review_count: number;
  merchandising_badges: string[];
  images: Array<{ url: string; alt: string }>;
  confirmation_type: string;
  status: 'LIVE' | 'PENDING_APPROVAL' | 'DRAFT' | 'DEACTIVATED' | 'NEEDS_FIX' | 'PENDING_DELETION' | 'REJECTED';
  raw_data?: any;
}

export default function ListingsManagementPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  
  // Modal state
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [previewListing, setPreviewListing] = useState<Listing | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTourForm, setNewTourForm] = useState({
    title: '',
    category_name: 'Luxury Catamarans',
    base_price: 120,
    duration_minutes: 180,
    supplier_id: 'sup-admin-direct',
    summary: '',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    confirmation_type: 'INSTANT'
  });

  useEffect(() => {
    if (filterParam === 'PENDING') {
      setStatusFilter('PENDING_APPROVAL');
    }
  }, [filterParam]);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/listings');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setListings(
          data.map((l: any, idx: number) => ({
            ...l,
            status: l.status || (idx % 3 === 0 ? 'PENDING_APPROVAL' : 'LIVE'),
            duration_minutes: l.duration_minutes || 180,
          }))
        );
      } else {
        setListings([]);
      }
    } catch (err) {
      console.error(err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadListings();
    setRefreshing(false);
    triggerAction('Product catalog refreshed successfully!');
  };

  const handleApproveProduct = async (id: string, title: string) => {
    try {
      const res = await fetch('/api/admin/listings/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to approve listing');
      }

      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: 'LIVE' } : l))
      );
      triggerAction(`Product Approved & Published: "${title}"!`);
    } catch (e: any) {
      console.error(e);
      triggerAction(`Error: ${e.message}`);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string, title: string) => {
    const nextStatus = currentStatus === 'LIVE' ? 'DEACTIVATED' : 'LIVE';
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: nextStatus as any } : l))
    );
    triggerAction(
      nextStatus === 'LIVE'
        ? `Product ACTIVATED: "${title}"`
        : `Product DEACTIVATED: "${title}"`
    );
  };

  const triggerAction = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Unique categories list for tab filters
  const categories = ['All', ...Array.from(new Set(listings.map((l) => l.category_name)))];
  const statuses = ['All', 'LIVE', 'PENDING_APPROVAL', 'DEACTIVATED'];

  const filteredListings = listings.filter((l) => {
    if (selectedCategory !== 'All' && l.category_name !== selectedCategory) return false;
    if (statusFilter !== 'All' && l.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!l.title?.toLowerCase().includes(q) && !l.category_name?.toLowerCase().includes(q) && !l.supplier_id?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalLive = listings.filter((l) => l.status === 'LIVE').length;
  const totalPending = listings.filter((l) => l.status === 'PENDING_APPROVAL').length;
  const avgRating = (listings.reduce((acc, l) => acc + (l.cached_rating_avg || 4.5), 0) / (listings.length || 1)).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Executive Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Products & Tour Catalog Management
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Inspect supplier-submitted tours, approve pending listings, and manage marketplace prices.
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

          {/* Add New Product Trigger */}
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
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} /> Add New Tour
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
              <div className="admin-stat-label">Total Catalog Products</div>
              <div className="admin-stat-value">{listings.length}</div>
              <div className="admin-stat-change" style={{ color: '#059669' }}>Total registered activities</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}>
              <Tag size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Live Active Products</div>
              <div className="admin-stat-value" style={{ color: '#059669' }}>{totalLive}</div>
              <div className="admin-stat-change" style={{ color: '#059669' }}>Bookable on Marketplace</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Pending Review Queue</div>
              <div className="admin-stat-value" style={{ color: '#d97706' }}>{totalPending}</div>
              <div className="admin-stat-change" style={{ color: '#b45309' }}>Requires Admin Approval</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Catalog Avg Rating</div>
              <div className="admin-stat-value" style={{ color: '#d97706' }}>★ {avgRating}</div>
              <div className="admin-stat-change" style={{ color: '#0284c7' }}>Across all customer reviews</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}>
              <Star size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs, Search Bar & Grid/Table Mode Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Category Filters */}
        <div className="admin-filter-bar" style={{ margin: 0 }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`admin-filter-tab ${selectedCategory === c ? 'active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Status Filter & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Status Dropdown Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '9999px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="LIVE">Live Only</option>
            <option value="PENDING_APPROVAL">Pending Review Queue</option>
            <option value="PENDING_DELETION">Deletion Requests</option>
            <option value="DEACTIVATED">Deactivated</option>
          </select>

          {/* Search Bar */}
          <div className="admin-search">
            <Search className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search tours or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Grid / Table View Switcher Buttons */}
          <div style={{ display: 'flex', background: '#ffffff', padding: '4px', borderRadius: '9999px', border: '1px solid #cbd5e1', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                border: 'none',
                background: viewMode === 'grid' ? '#0284c7' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 700
              }}
            >
              <LayoutGrid size={15} /> Grid
            </button>

            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                border: 'none',
                background: viewMode === 'table' ? '#0284c7' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 700
              }}
            >
              <List size={15} /> Table
            </button>
          </div>

        </div>

      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: '320px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', opacity: 0.7 }} />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="admin-table-container" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          <Tag size={36} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>No products match your filters</h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Try adjusting your search term, category tab, or status filter.</p>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* Grid View Layout */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredListings.map((l) => (
            <div
              key={l.id}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s ease'
              }}
            >
              {/* Image Banner */}
              <div 
                style={{ position: 'relative', height: '190px', background: '#0f172a', cursor: 'pointer' }}
                onClick={() => setPreviewListing(l)}
              >
                <img
                  src={l.images?.[0]?.url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'}
                  alt={l.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Top Badges */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                  <span style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                    {l.category_name}
                  </span>
                </div>

                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span className={`admin-badge ${l.status === 'PENDING_APPROVAL' ? 'admin-badge--pending' : l.status === 'LIVE' ? 'admin-badge--confirmed' : 'admin-badge--cancelled'}`}>
                    {l.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, height: '44px', overflow: 'hidden', position: 'relative' }}>
                    {l.title}
                    {l.raw_data?.logistics?.parent_id && <span style={{ marginLeft: '6px', fontSize: '0.65rem', background: '#e0e7ff', color: '#3730a3', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle', fontWeight: 700 }}>Edited</span>}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', fontFamily: 'monospace' }}>
                    ID: {l.id.startsWith('TN') ? l.id : 'TN' + l.id.replace(/-/g, '').substring(0, 8).toUpperCase()}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem', fontWeight: 800, color: '#d97706' }}>
                      <Star size={14} fill="currentColor" /> {l.cached_rating_avg?.toFixed(1) || '4.8'}
                      <span style={{ color: '#64748b', fontWeight: 500, fontSize: '0.78rem' }}>({l.cached_review_count || 12})</span>
                    </div>

                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0284c7' }}>
                      {l.currency} ${l.base_price}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {l.status === 'PENDING_APPROVAL' ? (
                    <>
                      <button
                        style={{ flex: 1, padding: '8px', fontSize: '0.82rem', fontWeight: 800, borderRadius: '9999px', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)' }}
                        onClick={() => handleApproveProduct(l.id, l.title)}
                      >
                        <CheckCircle2 size={13} /> Approve
                      </button>
                      <button
                        style={{ flex: 1, padding: '8px', fontSize: '0.82rem', fontWeight: 800, borderRadius: '9999px', background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)' }}
                        onClick={async () => {
                          const reason = prompt('Please describe what the supplier needs to fix:');
                          if (!reason) return;
                          try {
                            const res = await fetch('/api/admin/listings/request-fix', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: l.id, reason }) });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.error || 'Failed to request fix');
                            setListings((prev) => prev.map((item) => (item.id === l.id ? { ...item, status: 'NEEDS_FIX' } : item)));
                            triggerAction(`Requested Fixes for: "${l.title}"`);
                          } catch (e: any) { triggerAction(`Error: ${e.message}`); }
                        }}
                      >
                        <Edit size={13} /> Fix
                      </button>
                      <button
                        style={{ flex: 1, padding: '8px', fontSize: '0.82rem', fontWeight: 800, borderRadius: '9999px', background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)' }}
                        onClick={async () => {
                          const reason = prompt('Please enter the reason for rejection:');
                          if (!reason) return;
                          try {
                            const res = await fetch('/api/admin/listings/reject', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: l.id, reason }) });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.error || 'Failed to reject listing');
                            setListings((prev) => prev.map((item) => (item.id === l.id ? { ...item, status: 'REJECTED' } : item)));
                            triggerAction(`Product Rejected: "${l.title}"`);
                          } catch (e: any) { triggerAction(`Error: ${e.message}`); }
                        }}
                      >
                        <PowerOff size={13} /> Reject
                      </button>
                    </>
                  ) : l.status === 'PENDING_DELETION' ? (
                    <>
                      <button
                        style={{ flex: 1, padding: '8px', fontSize: '0.82rem', fontWeight: 800, borderRadius: '9999px', background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
                        onClick={() => setDeleteConfirmId(l.id)}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                      <button
                        style={{ flex: 1, padding: '8px', fontSize: '0.82rem', fontWeight: 800, borderRadius: '9999px', background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(100, 116, 139, 0.3)' }}
                        onClick={async () => {
                          try {
                            const res = await fetch('/api/admin/listings/reject-delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: l.id }) });
                            if (!res.ok) throw new Error('Failed to reject deletion');
                            setListings((prev) => prev.map((item) => (item.id === l.id ? { ...item, status: 'PUBLISHED' } : item)));
                            triggerAction(`Deletion Rejected for: "${l.title}"`);
                          } catch (e: any) { triggerAction(`Error: ${e.message}`); }
                        }}
                      >
                        <X size={13} /> Reject
                      </button>
                    </>
                  ) : (
                    <button
                      style={{ flex: 1, padding: '8px', fontSize: '0.82rem', fontWeight: 800, borderRadius: '9999px', background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}
                      onClick={() => setEditingListing(l)}
                    >
                      <Edit size={14} /> Edit Listing
                    </button>
                  )}

                  {l.status !== 'PENDING_APPROVAL' && l.status !== 'PENDING_DELETION' && (
                    <button
                      style={{
                        padding: '8px 12px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        borderRadius: '9999px',
                        background: l.status === 'LIVE' ? '#fff1f2' : '#ecfdf5',
                        color: l.status === 'LIVE' ? '#e11d48' : '#047857',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onClick={() => handleToggleStatus(l.id, l.status, l.title)}
                      title={l.status === 'LIVE' ? 'Deactivate Product' : 'Activate Product'}
                    >
                      <PowerOff size={14} />
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

      ) : (

        /* Table View Layout */
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Banner</th>
                <th>Tour Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Status</th>
                <th style={{ textAlign: 'center', background: '#f0f9ff', color: '#0284c7', fontWeight: 800 }}>⚙️ Management Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map((l) => (
                <tr key={l.id}>
                  <td>
                    <img
                      src={l.images?.[0]?.url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'}
                      alt={l.title}
                      style={{ width: '56px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                    />
                  </td>
                  <td>
                    <div 
                      onClick={() => setPreviewListing(l)}
                      style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.92rem', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
                    >
                      {l.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      ID: {l.id.startsWith('TN') ? l.id : 'TN' + l.id.replace(/-/g, '').substring(0, 8).toUpperCase()} • Supplier: {l.supplier_id}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>
                      {l.category_name}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0284c7' }}>
                      {l.currency} ${l.base_price}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem', fontWeight: 800, color: '#d97706' }}>
                      <Star size={14} fill="currentColor" /> {l.cached_rating_avg?.toFixed(1) || '4.8'}
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${l.status === 'PENDING_APPROVAL' ? 'admin-badge--pending' : l.status === 'LIVE' ? 'admin-badge--confirmed' : 'admin-badge--cancelled'}`}>
                      {l.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      {l.status === 'PENDING_APPROVAL' ? (
                        <>
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
                            onClick={() => handleApproveProduct(l.id, l.title)}
                          >
                            <CheckCircle2 size={13} color="#ffffff" /> Approve
                          </button>
                          <button
                            style={{
                              padding: '6px 14px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              borderRadius: '9999px',
                              background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)'
                            }}
                            onClick={async () => {
                              const reason = prompt('Please describe what the supplier needs to fix:');
                              if (!reason) return;
                              try {
                                const res = await fetch('/api/admin/listings/request-fix', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ productId: l.id, reason })
                                });
                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error || 'Failed to request fix');
                                setListings((prev) => prev.map((item) => (item.id === l.id ? { ...item, status: 'NEEDS_FIX' } : item)));
                                triggerAction(`Requested Fixes for: "${l.title}"`);
                              } catch (e: any) {
                                console.error(e);
                                triggerAction(`Error: ${e.message}`);
                              }
                            }}
                          >
                            <Edit size={13} color="#ffffff" /> Request Fix
                          </button>
                          <button
                            style={{
                              padding: '6px 14px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              borderRadius: '9999px',
                              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)'
                            }}
                            onClick={async () => {
                              const reason = prompt('Please enter the reason for rejection:');
                              if (!reason) return;
                              try {
                                const res = await fetch('/api/admin/listings/reject', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ productId: l.id, reason })
                                });
                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error || 'Failed to reject listing');
                                setListings((prev) => prev.map((item) => (item.id === l.id ? { ...item, status: 'REJECTED' } : item)));
                                triggerAction(`Product Rejected: "${l.title}"`);
                              } catch (e: any) {
                                console.error(e);
                                triggerAction(`Error: ${e.message}`);
                              }
                            }}
                          >
                            <PowerOff size={13} color="#ffffff" /> Reject
                          </button>
                        </>
                      ) : l.status === 'PENDING_DELETION' ? (
                        <>
                          <button
                            style={{
                              padding: '6px 14px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              borderRadius: '9999px',
                              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.35)'
                            }}
                            onClick={() => setDeleteConfirmId(l.id)}
                          >
                            <Trash2 size={13} color="#ffffff" /> Confirm Delete
                          </button>
                          <button
                            style={{
                              padding: '6px 14px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              borderRadius: '9999px',
                              background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 4px 12px rgba(100, 116, 139, 0.35)'
                            }}
                            onClick={async () => {
                              try {
                                const res = await fetch('/api/admin/listings/reject-delete', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ productId: l.id })
                                });
                                if (!res.ok) throw new Error('Failed to reject deletion');
                                setListings((prev) => prev.map((item) => (item.id === l.id ? { ...item, status: 'PUBLISHED' } : item)));
                                triggerAction(`Deletion Rejected for: "${l.title}"`);
                              } catch (e: any) {
                                console.error(e);
                                triggerAction(`Error: ${e.message}`);
                              }
                            }}
                          >
                            <X size={13} color="#ffffff" /> Reject Delete
                          </button>
                        </>
                      ) : (
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
                          onClick={() => setEditingListing(l)}
                        >
                          <Edit size={13} color="#ffffff" /> Edit
                        </button>
                      )}

                      <button
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          borderRadius: '9999px',
                          background: l.status === 'LIVE' ? '#fff1f2' : '#ecfdf5',
                          color: l.status === 'LIVE' ? '#e11d48' : '#047857',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onClick={() => handleToggleStatus(l.id, l.status, l.title)}
                      >
                        <PowerOff size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Listing Modal */}
      {editingListing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '520px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit size={20} color="#0284c7" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Edit Tour Details</h3>
              </div>
              <button onClick={() => setEditingListing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Product Title</label>
                <input
                  type="text"
                  value={editingListing.title}
                  onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Base Price (USD)</label>
                  <input
                    type="number"
                    value={editingListing.base_price}
                    onChange={(e) => setEditingListing({ ...editingListing, base_price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Status</label>
                  <select
                    value={editingListing.status}
                    onChange={(e) => setEditingListing({ ...editingListing, status: e.target.value as any })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  >
                    <option value="LIVE">LIVE</option>
                    <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
                    <option value="DEACTIVATED">DEACTIVATED</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" onClick={() => setEditingListing(null)} style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setListings((prev) => prev.map((l) => (l.id === editingListing.id ? editingListing : l)));
                  triggerAction(`Listing "${editingListing.title}" updated successfully!`);
                  setEditingListing(null);
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Listing Immersive Overlay */}
      {previewListing && previewListing.raw_data && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 20px', animation: 'admin-fade-in 0.3s ease-out forwards' }}>
          
          <div style={{ background: '#f8fafc', width: '100%', maxWidth: '1080px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Sticky Header */}
            <div style={{ height: '70px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <button onClick={() => setPreviewListing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', padding: '8px 12px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                  <ArrowLeft size={20} /> Back
                </button>
                <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
                <div style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>{previewListing.category_name || 'Category'}</div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setPreviewListing(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#64748b', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.background = '#ffffff'}>Close Preview</button>
                {previewListing.status === 'PENDING_APPROVAL' && (
                  <button onClick={() => { handleApproveProduct(previewListing.id, previewListing.title); setPreviewListing(null); }} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#ffffff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#059669'} onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}>
                    <CheckCircle2 size={18} /> Approve & Publish
                  </button>
                )}
              </div>
            </div>

            {/* Cover Image & Title */}
            <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
              {previewListing.raw_data?.basic_info?.photos?.heroImage && (
                <div style={{ width: '100%', height: '350px', backgroundImage: `url(${previewListing.raw_data.basic_info.photos.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              )}
              <div style={{ padding: '40px 48px' }}>
                <h1 style={{ color: '#0f172a', fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.2, margin: '0 0 16px 0' }}>{previewListing.title}</h1>
                <div style={{ display: 'flex', gap: '24px', color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={18} color="#3b82f6" /> {previewListing.raw_data?.logistics?.pickupLocation || 'Multiple Locations'}</span>
                  {previewListing.duration_minutes > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={18} color="#f59e0b" /> {Math.floor(previewListing.duration_minutes / 60)}h {previewListing.duration_minutes % 60}m</span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={18} color="#8b5cf6" /> Supplier ID: {previewListing.supplier_id}</span>
                </div>
              </div>
            </div>

            {/* Main Layout */}
            <div style={{ padding: '40px 48px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '48px', alignItems: 'flex-start' }}>
              
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                
                {/* Tour Description */}
                {(previewListing.raw_data?.basic_info?.summary || previewListing.raw_data?.basic_info?.shortDescription) && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Info size={22} color="#3b82f6" /> Tour Description
                    </h3>
                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                      {previewListing.raw_data.basic_info.summary || previewListing.raw_data.basic_info.shortDescription}
                    </p>
                  </div>
                )}

                {/* Tour Highlights */}
                {previewListing.raw_data?.basic_info?.highlights?.filter((h: string) => h.trim().length > 0).length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={22} color="#8b5cf6" /> Tour Highlights
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                      {previewListing.raw_data.basic_info.highlights.filter((h: string) => h.trim().length > 0).map((h: string, i: number) => (
                        <div key={i} style={{ padding: '16px 20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                          <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0 }} />
                          <span style={{ color: '#334155', fontWeight: 600, fontSize: '0.95rem' }}>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photo Gallery */}
                {previewListing.raw_data?.basic_info?.photos?.gallery?.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ImageIcon size={22} color="#ec4899" /> Photo Gallery
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                      {previewListing.raw_data.basic_info.photos.gallery.map((url: string, idx: number) => (
                        <div key={idx} style={{ height: '140px', borderRadius: '12px', background: `url(${url}) center/cover`, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Trip Details Grid */}
                {(previewListing.raw_data?.experience_details?.guideType || previewListing.raw_data?.experience_details?.activityType || previewListing.raw_data?.experience_details?.language) && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={22} color="#f59e0b" /> Trip Details
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      {previewListing.raw_data.experience_details.guideType && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                          <Users size={24} color="#64748b" />
                          <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Guide Type</div>
                            <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600, marginTop: '4px' }}>{previewListing.raw_data.experience_details.guideType}</div>
                          </div>
                        </div>
                      )}
                      {previewListing.raw_data.experience_details.activityType && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                          <Activity size={24} color="#64748b" />
                          <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activity Type</div>
                            <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600, marginTop: '4px' }}>{previewListing.raw_data.experience_details.activityType}</div>
                          </div>
                        </div>
                      )}
                      {previewListing.raw_data.experience_details.language && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', gridColumn: 'span 2' }}>
                          <Info size={24} color="#64748b" />
                          <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Languages</div>
                            <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600, marginTop: '4px' }}>{previewListing.raw_data.experience_details.language}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Included / Excluded */}
                {(previewListing.raw_data?.experience_details?.included || previewListing.raw_data?.experience_details?.excluded) && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {previewListing.raw_data.experience_details.included && (
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Check size={20} color="#10b981" /> Included
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '24px', color: '#334155', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                          <li>{previewListing.raw_data.experience_details.included.replace(/\n/g, '\n')}</li>
                        </ul>
                      </div>
                    )}
                    {previewListing.raw_data.experience_details.excluded && (
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <X size={20} color="#ef4444" /> Excluded
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '24px', color: '#334155', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                          <li>{previewListing.raw_data.experience_details.excluded.replace(/\n/g, '\n')}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Vehicle & Pricing */}
                {previewListing.raw_data?.transport_pricing?.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Car size={22} color="#14b8a6" /> Vehicle & Pricing
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {previewListing.raw_data.transport_pricing.map((opt: any) => (
                        <div key={opt.id} style={{ padding: '24px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                          <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Vehicle Details</div>
                            <div style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 800, marginTop: '4px' }}>{opt.title}</div>
                            <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '2px' }}>{opt.transportType}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Duration / Max Pax</div>
                            <div style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 800, marginTop: '4px' }}>{opt.duration}</div>
                            <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '2px' }}>Up to {opt.travellers} travellers</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Pricing</div>
                            <div style={{ fontSize: '1.5rem', color: '#059669', fontWeight: 900, marginTop: '4px' }}>${opt.amount}</div>
                            <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '2px', fontWeight: 600 }}>{opt.pricingType}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pick-up & Drop-off Location */}
                {(previewListing.raw_data?.logistics?.pickupLocation || previewListing.raw_data?.logistics?.dropOffLocation || previewListing.raw_data?.logistics?.timeFrameFrom) && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={22} color="#ef4444" /> Pick-up & Drop-off Location
                    </h3>
                    <div style={{ padding: '24px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                      <div>
                        {previewListing.raw_data.logistics.pickupLocation && (
                          <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Pick-up</div>
                            <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} color="#94a3b8" /> {previewListing.raw_data.logistics.pickupLocation}</div>
                          </div>
                        )}
                        {(previewListing.raw_data.logistics.dropOffLocation || previewListing.raw_data.logistics.dropOffSameAsPickup) && (
                          <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Drop-off</div>
                            <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} color="#94a3b8" /> {previewListing.raw_data.logistics.dropOffSameAsPickup ? 'Same as Pickup' : previewListing.raw_data.logistics.dropOffLocation}</div>
                          </div>
                        )}
                      </div>
                      <div>
                        {previewListing.raw_data.logistics.availability?.length > 0 && (
                          <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Available Days</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {previewListing.raw_data.logistics.availability.map((d: string) => (
                                <span key={d} style={{ background: '#1e293b', color: '#ffffff', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>{d}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {previewListing.raw_data.logistics.timeFrameFrom && (
                          <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Time Slots</div>
                            <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600 }}>{previewListing.raw_data.logistics.timeFrameFrom} - {previewListing.raw_data.logistics.timeFrameTo || 'N/A'}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column (Sidebar) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '94px' }}>
                
                {/* Status Box */}
                <div style={{ background: previewListing.status === 'LIVE' ? '#ecfdf5' : previewListing.status === 'PENDING_APPROVAL' ? '#fffbeb' : '#ffffff', border: `1px solid ${previewListing.status === 'LIVE' ? '#a7f3d0' : previewListing.status === 'PENDING_APPROVAL' ? '#fde68a' : '#e2e8f0'}`, borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: previewListing.status === 'LIVE' ? '#059669' : previewListing.status === 'PENDING_APPROVAL' ? '#d97706' : '#64748b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {previewListing.status === 'LIVE' ? <CheckCircle2 size={20} /> : <Clock size={20} />} 
                    {previewListing.status === 'LIVE' ? 'Product is Live' : previewListing.status === 'PENDING_APPROVAL' ? 'Pending Approval' : 'Deactivated'}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                    {previewListing.status === 'PENDING_APPROVAL' 
                      ? 'This product is waiting for admin review. Click "Approve & Publish" in the top bar to make it live on the marketplace.'
                      : 'This product has been processed. You can toggle its status from the main dashboard.'}
                  </div>
                </div>

                {/* Itinerary */}
                {previewListing.raw_data?.itinerary?.length > 0 && (
                  <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={20} color="#3b82f6" /> Itinerary
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                      {previewListing.raw_data.itinerary.map((item: any, idx: number) => (
                        <div key={item.id} style={{ display: 'flex', gap: '16px', paddingBottom: '24px', position: 'relative' }}>
                          {idx !== previewListing.raw_data.itinerary.length - 1 && (
                            <div style={{ position: 'absolute', left: '15px', top: '32px', bottom: 0, width: '2px', background: '#e2e8f0' }} />
                          )}
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', border: '2px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, zIndex: 2 }}>
                            {idx + 1}
                          </div>
                          <div style={{ paddingTop: '4px' }}>
                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{item.locationName}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0', fontWeight: 600 }}>
                              {item.attractionType} • {item.timeToSpend} {item.hasEntryFee ? <span style={{ color: '#ef4444' }}>• Entry: ${item.entryFeeAmount}</span> : '• Free Entry'}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, marginTop: '8px' }}>{item.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Tour Form Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0', animation: 'admin-fade-in 0.25s ease-out forwards' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284c7, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <Plus size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Add New Tour Product</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Enter tour details to publish directly to catalog</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const newTourTitle = newTourForm.title.trim() || 'New Admin Tour Experience';
              const newTour: Listing = {
                id: `list-${Date.now()}`,
                supplier_id: newTourForm.supplier_id || 'sup-admin-direct',
                destination_id: 'dest-global',
                category_id: `cat-${Date.now()}`,
                category_name: newTourForm.category_name,
                title: newTourTitle,
                slug: newTourTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                summary: newTourForm.summary || 'Newly published tour activity ready for online customer bookings.',
                base_price: Number(newTourForm.base_price) || 99,
                currency: 'USD',
                duration_minutes: Number(newTourForm.duration_minutes) || 180,
                cached_rating_avg: 5.0,
                cached_review_count: 1,
                merchandising_badges: ['NEW', 'FEATURED'],
                images: [{ url: newTourForm.imageUrl || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', alt: newTourTitle }],
                confirmation_type: newTourForm.confirmation_type,
                status: 'LIVE'
              };

              setListings([newTour, ...listings]);
              triggerAction(`Tour Product Published: "${newTourTitle}"!`);
              setIsAddModalOpen(false);
              setNewTourForm({
                title: '',
                category_name: 'Luxury Catamarans',
                base_price: 120,
                duration_minutes: 180,
                supplier_id: 'sup-admin-direct',
                summary: '',
                imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
                confirmation_type: 'INSTANT'
              });
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Title */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>Tour Experience Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red Dune Desert Safari, Quad Biking & BBQ Dinner"
                  value={newTourForm.title}
                  onChange={(e) => setNewTourForm({ ...newTourForm, title: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: '#f8fafc' }}
                />
              </div>

              {/* Category & Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>Category *</label>
                  <select
                    value={newTourForm.category_name}
                    onChange={(e) => setNewTourForm({ ...newTourForm, category_name: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: '#ffffff', cursor: 'pointer' }}
                  >
                    <option value="Luxury Catamarans">Luxury Catamarans</option>
                    <option value="Culture & Heritage">Culture & Heritage</option>
                    <option value="Desert Safaris">Desert Safaris</option>
                    <option value="Art & Museums">Art & Museums</option>
                    <option value="Food & Nightlife">Food & Nightlife</option>
                    <option value="Outdoor Adventures">Outdoor Adventures</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>Base Price ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="120"
                    value={newTourForm.base_price}
                    onChange={(e) => setNewTourForm({ ...newTourForm, base_price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: '#f8fafc' }}
                  />
                </div>
              </div>

              {/* Duration & Confirmation Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>Duration (Minutes) *</label>
                  <input
                    type="number"
                    required
                    min="30"
                    step="30"
                    placeholder="180"
                    value={newTourForm.duration_minutes}
                    onChange={(e) => setNewTourForm({ ...newTourForm, duration_minutes: Number(e.target.value) })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: '#f8fafc' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>Booking Confirmation</label>
                  <select
                    value={newTourForm.confirmation_type}
                    onChange={(e) => setNewTourForm({ ...newTourForm, confirmation_type: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: '#ffffff', cursor: 'pointer' }}
                  >
                    <option value="INSTANT">INSTANT Booking</option>
                    <option value="MANUAL_SUPPLIER_APPROVAL">Manual Approval</option>
                  </select>
                </div>
              </div>

              {/* Banner Image URL */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>Image Cover URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newTourForm.imageUrl}
                  onChange={(e) => setNewTourForm({ ...newTourForm, imageUrl: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#f8fafc' }}
                />
              </div>

              {/* Summary Description */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>Tour Summary & Highlights</label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what travelers will experience on this tour..."
                  value={newTourForm.summary}
                  onChange={(e) => setNewTourForm({ ...newTourForm, summary: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: '#f8fafc', resize: 'vertical' }}
                />
              </div>

              {/* Modal Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
                >
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
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Sparkles size={16} /> Publish Tour Product
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Trash2 size={32} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>Permanently Delete?</h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Are you sure you want to approve this deletion? This action cannot be undone and the product will be permanently removed from the database.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    const res = await fetch('/api/admin/listings/delete', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ productId: deleteConfirmId })
                    });
                    if (!res.ok) throw new Error('Failed to delete listing');
                    setListings((prev) => prev.filter((item) => item.id !== deleteConfirmId));
                    setDeleteConfirmId(null);
                    triggerAction(`Product Deleted successfully`);
                  } catch (e: any) {
                    console.error(e);
                    setDeleteConfirmId(null);
                    triggerAction(`Error: ${e.message}`);
                  }
                }}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)' }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
