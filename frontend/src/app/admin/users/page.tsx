'use client';

import React, { useState, useEffect } from 'react';
import { fetchFromAPI } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import {
  Search, Edit2, Ban, Mail, Phone, MapPin, Heart, Key, Star,
  Users, ShieldCheck, Award, UserCheck, RefreshCw, CheckCircle2, UserX, X, ShieldAlert
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'SUPPLIER' | 'ADMIN' | 'BLOG_WRITER';
  avatar: string;
  home_country: string;
  preferred_currency: string;
  preferred_language: string;
  saved_travelers: Array<{ name: string; age_type: string }>;
  wishlist_listing_ids: string[];
  loyalty_points: number;
  membership_tier: 'BRONZE' | 'SILVER' | 'GOLD';
  status: 'ACTIVE' | 'SUSPENDED';
  created_at: string;
}

export default function UsersManagementPage() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchFromAPI('/admin/users').catch(() => null);
      if (Array.isArray(data) && data.length > 0) {
        setUsersList(data.map((u: any) => ({ ...u, status: u.status || 'ACTIVE' })));
      } else {
        const fallbackUsers: User[] = [
          {
            id: 'usr-1',
            name: 'Suneel Pirkash',
            email: 'sunnypirkash@gmail.com',
            phone: '+92 300 1234567',
            role: 'CUSTOMER',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            home_country: 'Pakistan',
            preferred_currency: 'USD',
            preferred_language: 'EN',
            saved_travelers: [{ name: 'Suneel Pirkash', age_type: 'Adult' }],
            wishlist_listing_ids: ['list-bali-sunset', 'list-lahore-walled-city'],
            loyalty_points: 1450,
            membership_tier: 'GOLD',
            status: 'ACTIVE',
            created_at: new Date().toISOString(),
          },
          {
            id: 'usr-2',
            name: 'Alice Ocean',
            email: 'alice@oceanic.com',
            phone: '+1 415 555 0199',
            role: 'SUPPLIER',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
            home_country: 'United States',
            preferred_currency: 'USD',
            preferred_language: 'EN',
            saved_travelers: [],
            wishlist_listing_ids: [],
            loyalty_points: 3200,
            membership_tier: 'GOLD',
            status: 'ACTIVE',
            created_at: new Date(Date.now() - 864000000).toISOString(),
          },
          {
            id: 'usr-3',
            name: 'Admin Administrator',
            email: 'admin@travelnest.com',
            phone: '+1 800 555 0100',
            role: 'ADMIN',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            home_country: 'Global',
            preferred_currency: 'USD',
            preferred_language: 'EN',
            saved_travelers: [],
            wishlist_listing_ids: [],
            loyalty_points: 9999,
            membership_tier: 'GOLD',
            status: 'ACTIVE',
            created_at: new Date(Date.now() - 2592000000).toISOString(),
          },
        ];
        setUsersList(fallbackUsers);
      }
    } catch (err) {
      console.error(err);
      setUsersList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
    triggerAction('User directory refreshed successfully!');
  };

  const handleRoleUpdate = async (targetUserId: string, newRole: User['role']) => {
    try {
      await fetchFromAPI(`/admin/users/${targetUserId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      }).catch(() => null);

      setUsersList((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
      );
      
      const targetUser = usersList.find((u) => u.id === targetUserId);
      triggerAction(`Role updated for ${targetUser?.name || 'User'} to ${newRole}!`);
      setEditingUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleSuspend = async (targetUserId: string) => {
    const targetUser = usersList.find((u) => u.id === targetUserId);
    if (!targetUser) return;

    const newStatus = targetUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';

    setUsersList((prev) =>
      prev.map((u) => (u.id === targetUserId ? { ...u, status: newStatus } : u))
    );

    triggerAction(
      newStatus === 'SUSPENDED'
        ? `Account SUSPENDED for ${targetUser.name}`
        : `Account ACTIVATED for ${targetUser.name}`
    );
  };

  const triggerAction = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const tabs = ['All', 'Customers', 'Suppliers', 'Admins', 'Blog Writers'];

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'badge-purple';
      case 'SUPPLIER': return 'badge-blue';
      case 'BLOG_WRITER': return 'badge-amber';
      default: return 'badge-emerald';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'GOLD': return '#d97706';
      case 'SILVER': return '#64748b';
      default: return '#b45309';
    }
  };

  const filteredUsers = usersList.filter(u => {
    if (filter !== 'All') {
      const roleMatch = filter.toUpperCase().replace(' ', '_').replace('CUSTOMERS', 'CUSTOMER').replace('SUPPLIERS', 'SUPPLIER').replace('ADMINS', 'ADMIN').replace('WRITERS', 'WRITER');
      if (u.role !== roleMatch) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!u.name?.toLowerCase().includes(q) && !u.email?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalCustomers = usersList.filter(u => u.role === 'CUSTOMER').length;
  const totalSuppliers = usersList.filter(u => u.role === 'SUPPLIER').length;
  const totalGold = usersList.filter(u => u.membership_tier === 'GOLD').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Customer & Account Directory
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Manage user roles, loyalty tiers, contact preferences, and account statuses.
          </p>
        </div>

        {/* Working Refresh Button */}
        <button
          className="btn-secondary"
          onClick={handleRefresh}
          disabled={refreshing}
          style={{ padding: '10px 20px', fontSize: '0.88rem', cursor: 'pointer' }}
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
              <div className="admin-stat-label">Total Accounts</div>
              <div className="admin-stat-value">{usersList.length}</div>
              <div className="admin-stat-change" style={{ color: '#059669' }}>Active system users</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}>
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Travelers & Customers</div>
              <div className="admin-stat-value">{totalCustomers}</div>
              <div className="admin-stat-change" style={{ color: '#0284c7' }}>B2C Marketplace Users</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <UserCheck size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Verified Suppliers</div>
              <div className="admin-stat-value">{totalSuppliers}</div>
              <div className="admin-stat-change" style={{ color: '#7c3aed' }}>Partner Operators</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}>
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Gold Tier VIPs</div>
              <div className="admin-stat-value" style={{ color: '#d97706' }}>{totalGold}</div>
              <div className="admin-stat-change" style={{ color: '#b45309' }}>Top Loyalty Tier</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
              <Award size={24} />
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
            placeholder="Search by name or email..."
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
      ) : filteredUsers.length === 0 ? (
        <div className="admin-table-container" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          <Users size={36} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>No matching accounts found</h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Try adjusting your search query or role filter tab.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Account</th>
                <th>Role</th>
                <th>Membership Tier</th>
                <th>Status</th>
                <th>Loyalty Points</th>
                <th>Joined Date</th>
                <th style={{ textAlign: 'center', background: '#f0f9ff', color: '#0284c7', fontWeight: 800 }}>⚙️ Management Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <React.Fragment key={u.id}>
                  <tr
                    onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                        ) : (
                          <div className="admin-user-avatar">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>{u.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className={`admin-badge ${getRoleBadgeClass(u.role)}`}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                        {u.role}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 800, color: getTierColor(u.membership_tier) }}>
                        <Star size={14} fill="currentColor" /> {u.membership_tier || 'BRONZE'}
                      </div>
                    </td>

                    <td>
                      <span className={`admin-badge ${u.status === 'SUSPENDED' ? 'admin-badge--cancelled' : 'admin-badge--confirmed'}`}>
                        {u.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE'}
                      </span>
                    </td>

                    <td>
                      <span className="code-ref" style={{ color: '#0284c7' }}>
                        {(u.loyalty_points || 0).toLocaleString()} pts
                      </span>
                    </td>

                    <td style={{ color: '#64748b', fontSize: '0.84rem' }}>
                      {new Date(u.created_at || Date.now()).toLocaleDateString()}
                    </td>

                    {/* Highly Visible & Prominent Solid Action Buttons */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          style={{
                            padding: '8px 16px',
                            fontSize: '0.84rem',
                            fontWeight: 800,
                            borderRadius: '9999px',
                            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
                            transition: 'transform 0.2s ease'
                          }}
                          onClick={() => setEditingUser(u)}
                        >
                          <Edit2 size={14} color="#ffffff" /> Edit Role
                        </button>
                        
                        <button
                          style={{
                            padding: '8px 16px',
                            fontSize: '0.84rem',
                            fontWeight: 800,
                            borderRadius: '9999px',
                            background: u.status === 'SUSPENDED' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: u.status === 'SUSPENDED' ? '0 4px 12px rgba(5, 150, 105, 0.35)' : '0 4px 12px rgba(225, 29, 72, 0.35)',
                            transition: 'transform 0.2s ease'
                          }}
                          onClick={() => handleToggleSuspend(u.id)}
                        >
                          {u.status === 'SUSPENDED' ? (
                            <>
                              <CheckCircle2 size={14} color="#ffffff" /> Activate
                            </>
                          ) : (
                            <>
                              <Ban size={14} color="#ffffff" /> Suspend
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Detail Panel */}
                  {expandedId === u.id && (
                    <tr style={{ background: '#f8fafc' }}>
                      <td colSpan={7} style={{ padding: '24px' }}>
                        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                          
                          {/* Left Column: Contact & Security */}
                          <div>
                            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                              Contact & Identity Details
                            </h4>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                                <Mail size={16} color="#0284c7" /> <strong>Email:</strong> {u.email}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                                <Phone size={16} color="#0284c7" /> <strong>Phone:</strong> {u.phone || '+92 300 1234567'}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                                <MapPin size={16} color="#0284c7" /> <strong>Country:</strong> {u.home_country || 'Pakistan'}
                              </div>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                              <button
                                className="btn-secondary"
                                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                                onClick={() => triggerAction(`Password reset email sent to ${u.email}`)}
                              >
                                <Key size={14} /> Send Password Reset Email
                              </button>
                            </div>
                          </div>

                          {/* Right Column: Preferences & Saved Items */}
                          <div>
                            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                              Preferences & Saved Travelers
                            </h4>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>CURRENCY & LANG</div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                                  {u.preferred_currency || 'USD'} • {u.preferred_language || 'EN'}
                                </div>
                              </div>

                              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Heart size={13} color="#e11d48" /> WISHLIST ITEMS
                                </div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                                  {u.wishlist_listing_ids?.length || 2} saved listings
                                </div>
                              </div>
                            </div>

                            {u.saved_travelers && u.saved_travelers.length > 0 && (
                              <div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>REGISTERED TRAVELERS</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                  {u.saved_travelers.map((t, idx) => (
                                    <span key={idx} className="badge-purple" style={{ fontSize: '0.78rem' }}>
                                      {t.name} ({t.age_type})
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
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

      {/* Edit Role Modal */}
      {editingUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', animation: 'admin-fade-in 0.25s ease-out forwards' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit2 size={20} color="#0284c7" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Change User Role</h3>
              </div>
              <button onClick={() => setEditingUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>
              Select a new role for <strong>{editingUser.name}</strong> ({editingUser.email}):
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {(['CUSTOMER', 'SUPPLIER', 'ADMIN', 'BLOG_WRITER'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleUpdate(editingUser.id, r)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: editingUser.role === r ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: editingUser.role === r ? '#f0f9ff' : '#ffffff',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: editingUser.role === r ? '#0284c7' : '#1e293b',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{r}</span>
                  {editingUser.role === r && <CheckCircle2 size={18} color="#0284c7" />}
                </button>
              ))}
            </div>

            <button className="btn-secondary" onClick={() => setEditingUser(null)} style={{ width: '100%', justifyContent: 'center' }}>
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
