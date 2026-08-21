'use client';

import React, { useState, useEffect } from 'react';
import { fetchFromAPI } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import {
  Search, Star, ThumbsUp, AlertTriangle, CheckCircle2, XCircle,
  MessageSquare, ChevronDown, ChevronUp, Image as ImageIcon, ShieldAlert,
  RefreshCw, Filter, Sparkles, UserCheck, ShieldCheck
} from 'lucide-react';

interface Review {
  id: string;
  booking_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  listing_id: string;
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  helpful_count: number;
  supplier_reply?: { text: string; replied_at: string };
  ai_fraud_score: number;
  status: 'PUBLISHED' | 'PENDING' | 'FLAGGED' | 'REMOVED';
  tour_types?: string[];
  created_at: string;
}

export default function AdminReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<string>>(new Set());
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [listingsMap, setListingsMap] = useState<Record<string, string>>({});

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/reviews');
      let data = await res.json().catch(() => null);

      if (!data || !Array.isArray(data)) {
        data = [];
      }
      
      // Map Supabase properties and status to match UI requirements
      const mappedData = data.map((r: any) => ({
        ...r,
        ai_fraud_score: r.ai_fraud_score || 0,
        helpful_count: r.helpful_count || 0,
        status: r.status === 'APPROVED' ? 'PUBLISHED' : r.status === 'REJECTED' ? 'REMOVED' : r.status
      }));
      
      setReviews(mappedData);

      // Fetch listings to map IDs to titles
      try {
        const listingsRes = await fetch('/api/public/listings');
        if (listingsRes.ok) {
          const listings = await listingsRes.json();
          const map: Record<string, string> = {};
          if (Array.isArray(listings)) {
            listings.forEach(l => { map[l.id] = l.title; });
          }
          setListingsMap(map);
        }
      } catch (e) {}

    } catch (err) {
      console.error(err);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
    triggerAction('Reviews moderation queue refreshed!');
  };

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedReviewIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedReviewIds(newSet);
  };

  const handleStatusChange = async (id: string, action: 'Approve' | 'Remove') => {
    try {
      let targetStatus = 'PENDING';
      let uiStatus = 'PENDING';
      if (action === 'Approve') { targetStatus = 'APPROVED'; uiStatus = 'PUBLISHED'; }
      if (action === 'Remove') { targetStatus = 'REJECTED'; uiStatus = 'REMOVED'; }

      const res = await fetch(`/api/admin/reviews/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus })
      });
      
      if (!res.ok) throw new Error('Failed to update status');

      // Update local state with UI status
      setReviews(prev => prev.map(r => 
        r.id === id ? { ...r, status: uiStatus as any } : r
      ));
      
      triggerAction(action === 'Approve' ? 'Review Published!' : 'Review Removed!');
    } catch (error) {
      console.error('Action failed:', error);
      alert('Failed to update review status');
    }
  };

  const triggerAction = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const tabs = ['All', 'Published', 'Pending', 'Flagged', 'Removed'];

  const filteredReviews = reviews.filter((r) => {
    if (activeTab !== 'All' && r.status !== activeTab.toUpperCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.user_name.toLowerCase().includes(q) ||
        r.listing_id.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const flaggedCount = reviews.filter((r) => r.status === 'FLAGGED').length;
  const pendingCount = reviews.filter((r) => r.status === 'PENDING').length;
  const publishedCount = reviews.filter((r) => r.status === 'PUBLISHED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Executive Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Review Moderation & Feedback Queue
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Inspect customer ratings, moderate AI fraud risk flags, and publish verified tour reviews.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={handleRefresh}
          disabled={refreshing}
          style={{ padding: '10px 18px', fontSize: '0.88rem', cursor: 'pointer' }}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Directory'}
        </button>
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
              <div className="admin-stat-label">Total Moderated Reviews</div>
              <div className="admin-stat-value">{reviews.length}</div>
              <div className="admin-stat-change" style={{ color: '#059669' }}>Submitted feedback</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}>
              <MessageSquare size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Published Reviews</div>
              <div className="admin-stat-value" style={{ color: '#059669' }}>{publishedCount}</div>
              <div className="admin-stat-change" style={{ color: '#059669' }}>Live on Marketplace</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Pending Approval</div>
              <div className="admin-stat-value" style={{ color: '#0284c7' }}>{pendingCount}</div>
              <div className="admin-stat-change" style={{ color: '#0284c7' }}>Awaiting Admin Audit</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}>
              <UserCheck size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Flagged Fraud Risk</div>
              <div className="admin-stat-value" style={{ color: '#e11d48' }}>{flaggedCount}</div>
              <div className="admin-stat-change" style={{ color: '#be123c' }}>High AI Risk Score</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #e11d48, #f43f5e)' }}>
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div className="admin-filter-bar" style={{ margin: 0 }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`admin-filter-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="admin-search">
          <Search className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search review text, author or listing..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Reviews Queue Cards */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '140px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', opacity: 0.7 }} />
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="admin-table-container" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          <MessageSquare size={36} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>No reviews found</h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Try adjusting your search query or filter tab.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredReviews.map((review) => {
            const isExpanded = expandedReviewIds.has(review.id);
            const statusClass =
              review.status === 'PUBLISHED'
                ? 'admin-badge--confirmed'
                : review.status === 'FLAGGED'
                ? 'admin-badge--cancelled'
                : review.status === 'PENDING'
                ? 'admin-badge--pending'
                : 'admin-badge--draft';

            let fraudBadgeColor = '#059669';
            let fraudBg = '#ecfdf5';
            if (review.ai_fraud_score > 0.3) {
              fraudBadgeColor = '#d97706';
              fraudBg = '#fffbe6';
            }
            if (review.ai_fraud_score > 0.7) {
              fraudBadgeColor = '#e11d48';
              fraudBg = '#fff1f2';
            }

            return (
              <div
                key={review.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Review Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={review.user_avatar}
                      alt={review.user_name}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{review.user_name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Submitted on {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`admin-badge ${statusClass}`}>
                      {review.status}
                    </span>

                    <button
                      onClick={() => toggleExpand(review.id)}
                      style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Rating & Review Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '2px', color: '#d97706' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} color={i < review.rating ? '#d97706' : '#cbd5e1'} />
                    ))}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{review.title}</h3>
                </div>

                {/* Listing ID Tag */}
                <div style={{ marginBottom: '12px' }}>
                  <span className="code-ref" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                    Target Tour: {listingsMap[review.listing_id] || review.listing_id}
                  </span>
                </div>

                {/* Tour Types if any */}
                {review.tour_types && review.tour_types.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {review.tour_types.map((type) => (
                      <span key={type} style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                        ðŸ·ï¸ {type}
                      </span>
                    ))}
                  </div>
                )}

                {/* Review Content */}
                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, marginBottom: '16px' }}>
                  {review.comment}
                </p>

                {/* Photos if any */}
                {review.photos && review.photos.length > 0 && (
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    {review.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt="Customer Photo"
                        style={{ width: '100px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                      />
                    ))}
                  </div>
                )}

                {/* Supplier Reply Box */}
                {isExpanded && review.supplier_reply && (
                  <div style={{ background: '#f0f9ff', borderLeft: '4px solid #0284c7', padding: '16px', borderRadius: '0 12px 12px 0', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Supplier Response
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#0369a1', fontStyle: 'italic' }}>
                      "{review.supplier_reply.text}"
                    </p>
                  </div>
                )}

                {/* Footer Controls & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>
                      <ThumbsUp size={15} color="#0284c7" /> {review.helpful_count} Helpful Votes
                    </div>

                    <div style={{ background: fraudBg, border: `1px solid ${fraudBadgeColor}40`, padding: '4px 12px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: fraudBadgeColor }}>
                        AI Risk Score: {(review.ai_fraud_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Highly Visible Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {review.status !== 'PUBLISHED' && (
                      <button
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          borderRadius: '9999px',
                          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.35)'
                        }}
                        onClick={() => handleStatusChange(review.id, 'Approve')}
                      >
                        <CheckCircle2 size={14} color="#ffffff" /> Approve & Publish
                      </button>
                    )}

                    {review.status !== 'REMOVED' && (
                      <button
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          borderRadius: '9999px',
                          background: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)'
                        }}
                        onClick={() => handleStatusChange(review.id, 'Remove')}
                      >
                        <XCircle size={14} color="#ffffff" /> Reject / Remove
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

