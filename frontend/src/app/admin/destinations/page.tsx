'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Plus, Edit, Trash2, Eye, EyeOff, Globe, RefreshCw } from 'lucide-react';

interface Destination {
  _id?: string;
  id?: string;
  name: string;
  country: string;
  hero_image?: string;
  is_published: boolean;
}

export default function AdminDestinationsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/destinations');
      if (!res.ok) throw new Error('Failed to fetch destinations');
      const json = await res.json();
      setDestinations(json.data || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    
    try {
      const res = await fetch(`/api/admin/destinations/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setDestinations(destinations.filter(d => (d.id || d._id) !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/destinations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !currentStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      setDestinations(destinations.map(d => {
        const destId = d.id || d._id;
        if (destId === id) {
          return { ...d, is_published: !currentStatus };
        }
        return d;
      }));
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin-icon {
            animation: spin 1s linear infinite;
          }
        `}</style>
        <RefreshCw className="spin-icon" size={32} color="#3b82f6" />
        <p style={{ color: '#64748b', fontFamily: 'system-ui, sans-serif' }}>Loading destinations...</p>
      </div>
    );
  }

  const total = destinations.length;
  const published = destinations.filter(d => d.is_published).length;
  const drafts = total - published;

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      {error && (
        <div style={{ padding: '16px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '8px', marginBottom: '24px', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      )}
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>Destinations Management</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Manage your travel destinations and their status.</p>
        </div>
        <button
          onClick={() => router.push('/admin/destinations/create')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontWeight: '500', fontSize: '14px', transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          <Plus size={18} />
          Add Destination
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {[
          { label: 'Total Destinations', value: total, icon: Globe, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Published', value: published, icon: Eye, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Drafts', value: drafts, icon: EyeOff, color: '#f59e0b', bg: '#fffbeb' },
        ].map((stat, idx) => (
          <div key={idx} style={{
            backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ backgroundColor: stat.bg, padding: '16px', borderRadius: '12px', display: 'flex' }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>{stat.label}</p>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      {destinations.length === 0 ? (
        <div style={{ 
          backgroundColor: 'white', padding: '64px', borderRadius: '16px', border: '1px solid #e2e8f0',
          textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <MapPin size={48} color="#cbd5e1" style={{ margin: '0 auto 16px auto', display: 'block' }} />
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>No destinations found</h3>
          <p style={{ margin: '0 0 24px 0', color: '#64748b' }}>Get started by creating your first destination.</p>
          <button
            onClick={() => router.push('/admin/destinations/create')}
            style={{
              padding: '10px 20px', backgroundColor: '#f1f5f9', color: '#334155',
              border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500'
            }}
          >
            Add Destination
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {destinations.map(dest => {
            const destId = dest.id || dest._id || '';
            return (
              <div key={destId} style={{
                backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s, transform 0.2s',
                cursor: 'default'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                e.currentTarget.style.transform = 'none';
              }}
              >
                <div style={{ height: '180px', width: '100%', position: 'relative', backgroundColor: '#f1f5f9' }}>
                  {dest.hero_image ? (
                    <img src={dest.hero_image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' }} />
                  )}
                  <span style={{
                    position: 'absolute', top: '12px', right: '12px',
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                    backgroundColor: dest.is_published ? '#10b981' : '#f59e0b', color: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {dest.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '16px', flexGrow: 1 }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>{dest.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px' }}>
                      <MapPin size={14} />
                      {dest.country}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <button
                      onClick={() => handleTogglePublish(destId, dest.is_published)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '8px', backgroundColor: 'transparent', color: dest.is_published ? '#f59e0b' : '#10b981',
                        border: `1px solid ${dest.is_published ? '#fde68a' : '#a7f3d0'}`, borderRadius: '6px', cursor: 'pointer',
                        fontSize: '13px', fontWeight: '500', transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = dest.is_published ? '#fffbeb' : '#ecfdf5'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {dest.is_published ? <><EyeOff size={16} /> Unpublish</> : <><Eye size={16} /> Publish</>}
                    </button>
                    <button
                      onClick={() => router.push(`/admin/destinations/create?id=${destId}`)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '8px', backgroundColor: '#f1f5f9', color: '#334155',
                        border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(destId)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '8px', backgroundColor: '#fee2e2', color: '#ef4444',
                        border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
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
