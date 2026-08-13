'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchFromAPI } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutGrid, List, Search, Plus, ExternalLink, Star, Edit, PowerOff,
  CheckCircle2, Clock, MapPin, Tag, ShieldCheck, RefreshCw, X, Sparkles, Filter, Trash2
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
  status: 'LIVE' | 'PENDING_APPROVAL' | 'DRAFT' | 'DEACTIVATED';
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
        const fallbackListings: Listing[] = [
          {
            id: 'list-bali-sunset',
            supplier_id: 'sup-bali-cruises',
            destination_id: 'dest-bali',
            category_id: 'cat-water',
            category_name: 'Luxury Catamarans',
            title: 'Bali Sunset Catamaran Dinner Cruise & Live Music',
            slug: 'bali-sunset-catamaran',
            summary: 'Experience magical Uluwatu sunset views with gourmet seafood buffet on ocean luxury catamaran.',
            base_price: 120,
            currency: 'USD',
            duration_minutes: 240,
            cached_rating_avg: 4.9,
            cached_review_count: 128,
            merchandising_badges: ['BESTSELLER', 'INSTANT_CONFIRMATION'],
            images: [
              { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', alt: 'Bali Catamaran' }
            ],
            confirmation_type: 'INSTANT',
            status: 'LIVE',
          },
          {
            id: 'list-lahore-walled-city',
            supplier_id: 'sup-lahore-heritage',
            destination_id: 'dest-lahore',
            category_id: 'cat-heritage',
            category_name: 'Culture & Heritage',
            title: 'Walled City Lahore Heritage Walking Tour & Royal Kitchens',
            slug: 'lahore-walled-city-heritage',
            summary: 'Guided heritage stroll through Delhi Gate, Shahi Hammam, Badshahi Mosque and Haveli dinner.',
            base_price: 45,
            currency: 'USD',
            duration_minutes: 180,
            cached_rating_avg: 4.8,
            cached_review_count: 94,
            merchandising_badges: ['FEATURED', 'LOCAL_GUIDE'],
            images: [
              { url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80', alt: 'Lahore Badshahi Mosque' }
            ],
            confirmation_type: 'MANUAL_SUPPLIER_APPROVAL',
            status: 'PENDING_APPROVAL',
          },
          {
            id: 'list-dubai-desert-safari',
            supplier_id: 'sup-arabian-adventures',
            destination_id: 'dest-dubai',
            category_id: 'cat-desert',
            category_name: 'Desert Safaris',
            title: 'Red Dune Desert Safari, Quad Biking & BBQ Starry Night',
            slug: 'dubai-red-dune-safari',
            summary: 'Thrilling 4x4 dune bashing, camel riding, falconry, live Tanoura dance show & BBQ feast.',
            base_price: 85,
            currency: 'USD',
            duration_minutes: 360,
            cached_rating_avg: 4.95,
            cached_review_count: 310,
            merchandising_badges: ['TOP_RATED'],
            images: [
              { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', alt: 'Dubai Desert' }
            ],
            confirmation_type: 'INSTANT',
            status: 'LIVE',
          },
          {
            id: 'list-paris-louvre',
            supplier_id: 'sup-paris-museums',
            destination_id: 'dest-paris',
            category_id: 'cat-art',
            category_name: 'Art & Museums',
            title: 'Skip-The-Line Louvre Museum Guided Tour & Mona Lisa',
            slug: 'louvre-guided-tour',
            summary: 'Priority access through secret entrances with expert art historian guide.',
            base_price: 75,
            currency: 'USD',
            duration_minutes: 150,
            cached_rating_avg: 4.7,
            cached_review_count: 215,
            merchandising_badges: ['SKIP_THE_LINE'],
            images: [
              { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80', alt: 'Louvre Paris' }
            ],
            confirmation_type: 'INSTANT',
            status: 'PENDING_APPROVAL',
          },
        ];
        setListings(fallbackListings);
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
              <div style={{ position: 'relative', height: '190px', background: '#0f172a' }}>
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
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, height: '44px', overflow: 'hidden' }}>
                    {l.title}
                  </h3>

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
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {l.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Supplier: {l.supplier_id}</div>
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
