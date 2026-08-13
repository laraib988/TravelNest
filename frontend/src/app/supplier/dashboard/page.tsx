'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Users, Calendar, Settings, LogOut, CheckCircle2, MoreVertical, Edit, EyeOff, Trash2, Plus, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Dummy Data for Listings
const DUMMY_LISTINGS = [
  {
    id: 'L-101',
    title: 'Bali 5-Day Yoga & Wellness Retreat',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80',
    price: '$850',
    status: 'PUBLISHED',
    lastUpdated: '10 mins ago',
  },
  {
    id: 'L-102',
    title: 'Tokyo Neon City Night Tour',
    image: 'https://images.unsplash.com/photo-1542051812871-7585024765d1?auto=format&fit=crop&w=400&q=80',
    price: '$120',
    status: 'PENDING_APPROVAL',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'L-103',
    title: 'Swiss Alps Hiking Adventure',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80',
    price: '$450',
    status: 'DRAFT',
    lastUpdated: '1 day ago',
  },
  {
    id: 'L-104',
    title: 'Paris Romantic Dinner Cruise',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
    price: '$200',
    status: 'REJECTED',
    lastUpdated: '3 days ago',
  }
];

export default function SupplierDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'LISTINGS'>('DASHBOARD');
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetch(`/api/supplier/listings?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setListings(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/supplier/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>Approved & Live</span>;
      case 'APPROVED':
        return <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>Request Approved</span>;
      case 'PENDING_APPROVAL':
        return <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>Pending Approval</span>;
      case 'DRAFT':
        return <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>Draft</span>;
      case 'NEEDS_FIX':
        return <span style={{ background: '#fffbeb', color: '#d97706', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>Needs Fixes</span>;
      case 'PENDING_DELETION':
        return <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>Pending Deletion</span>;
      case 'REJECTED':
        return <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>Rejected</span>;
      default:
        return <span style={{ background: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', background: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>TravelNest Supplier</h2>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={14} color="#059669" /> Verified Partner
          </div>
        </div>
        
        <div style={{ flex: 1, padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div 
              onClick={() => setActiveTab('DASHBOARD')}
              style={{ padding: '12px 16px', background: activeTab === 'DASHBOARD' ? '#f0f9ff' : 'transparent', color: activeTab === 'DASHBOARD' ? '#0284c7' : '#64748b', borderRadius: '10px', fontWeight: activeTab === 'DASHBOARD' ? 700 : 600, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <LayoutDashboard size={18} /> Dashboard
            </div>
            <div 
              onClick={() => setActiveTab('LISTINGS')}
              style={{ padding: '12px 16px', background: activeTab === 'LISTINGS' ? '#f0f9ff' : 'transparent', color: activeTab === 'LISTINGS' ? '#0284c7' : '#64748b', borderRadius: '10px', fontWeight: activeTab === 'LISTINGS' ? 700 : 600, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <Calendar size={18} /> My Listings
            </div>
            <div style={{ padding: '12px 16px', color: '#64748b', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <Users size={18} /> Bookings
            </div>
            <div style={{ padding: '12px 16px', color: '#64748b', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <Settings size={18} /> Account Settings
            </div>
          </div>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', color: '#e11d48', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {activeTab === 'DASHBOARD' && (
          <>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Welcome back, {user?.name || 'Partner'}!
            </h1>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>Here is what's happening with your tours today.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Active Listings</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>{listings.filter(l => l.status === 'LIVE' || l.status === 'PUBLISHED' || l.status === 'APPROVED').length}</div>
              </div>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Total Bookings</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>0</div>
              </div>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Revenue (This Month)</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>$0.00</div>
              </div>
            </div>

            <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Create Your Next Listing</h3>
              <button className="btn-primary" onClick={() => router.push('/supplier/listings/create')} style={{ padding: '12px 24px', borderRadius: '8px', fontWeight: 700 }}>
                + Create New Listing
              </button>
            </div>
          </>
        )}

        {activeTab === 'LISTINGS' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>My Listings</h1>
                <p style={{ color: '#64748b', margin: 0 }}>Manage your tours, experiences, and packages.</p>
              </div>
              <button onClick={() => router.push('/supplier/listings/create')} className="btn-primary" style={{ padding: '12px 24px', borderRadius: '100px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', background: 'var(--brand-gradient)', color: '#fff' }}>
                <Plus size={18} /> Create Listing
              </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              {listings.map((item, index) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '20px 24px', borderBottom: index < listings.length - 1 ? '1px solid #e2e8f0' : 'none', transition: 'background 0.2s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  {/* Image */}
                  <img src={item.image} alt={item.title} style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                  
                  {/* Details */}
                  <div style={{ flex: 1, marginLeft: '20px' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{item.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: '#64748b' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{item.price} per person</span>
                      <span>•</span>
                      <span>ID: {item.id}</span>
                      <span>•</span>
                      <span>Updated {item.lastUpdated}</span>
                    </div>
                    {/* Admin Feedback Block */}
                    {(item.status === 'NEEDS_FIX' || item.status === 'REJECTED') && item.admin_feedback && (
                      <div style={{ marginTop: '12px', padding: '12px', borderRadius: '8px', background: item.status === 'NEEDS_FIX' ? '#fffbeb' : '#fef2f2', border: `1px solid ${item.status === 'NEEDS_FIX' ? '#fde68a' : '#fecaca'}` }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: item.status === 'NEEDS_FIX' ? '#92400e' : '#991b1b', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ fontWeight: 800 }}>{item.status === 'NEEDS_FIX' ? 'Required Fixes:' : 'Reason for Rejection:'}</span> 
                          {item.admin_feedback}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div style={{ width: '150px', display: 'flex', alignItems: 'center' }}>
                    {getStatusBadge(item.status)}
                  </div>

                  {/* Actions Dropdown Simulation */}
                  <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                    <button onClick={() => router.push(`/supplier/listings/create?id=${item.id}`)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit Listing">
                      <Edit size={16} />
                    </button>
                    {item.status === 'PUBLISHED' && (
                      <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#b45309', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Unpublish">
                        <EyeOff size={16} />
                      </button>
                    )}
                    {item.status === 'DRAFT' && (
                      <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#059669', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Submit for Approval">
                        <ArrowUpRight size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => setDeleteConfirmId(item.id)}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#e11d48', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                      title="Delete Listing"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              {loading ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                  Loading your listings...
                </div>
              ) : listings.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                  No listings found. Create your first tour to get started!
                </div>
              ) : null}
            </div>
          </>
        )}

      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Trash2 size={32} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>Request Deletion?</h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete this listing? This request will be sent to the admin for final approval.
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
                    const res = await fetch('/api/supplier/listings/request-delete', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId: user?.id, productId: deleteConfirmId })
                    });
                    if (res.ok) {
                      setListings(prev => prev.map(l => l.id === deleteConfirmId ? { ...l, status: 'PENDING_DELETION' } : l));
                      setDeleteConfirmId(null);
                    } else {
                      const data = await res.json();
                      alert('Error: ' + data.error);
                    }
                  } catch (err) {
                    alert('Network error requesting deletion');
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
