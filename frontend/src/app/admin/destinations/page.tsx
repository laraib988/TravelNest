'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Plus, Edit, Trash2, Eye, EyeOff, Globe, RefreshCw, AlertCircle } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  country_code: string;
  hero_image: string;
  description: string;
  is_published: boolean;
  created_at: string;
}

export default function AdminDestinationsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupSQL, setSetupSQL] = useState('');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/destinations', { cache: 'no-store' });
      const data = await res.json();
      if (data.needsSetup) {
        setNeedsSetup(true);
        setSetupSQL(data.sql || '');
      } else {
        setDestinations(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await fetch('/api/admin/destinations/' + id, { method: 'DELETE' });
      setDestinations(destinations.filter(d => d.id !== id));
    } catch (err) {
      alert('Error deleting destination');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await fetch('/api/admin/destinations/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !currentStatus }),
      });
      setDestinations(destinations.map(d =>
        d.id === id ? { ...d, is_published: !currentStatus } : d
      ));
    } catch (err) {
      alert('Error updating destination');
    }
  };

  const totalDestinations = destinations.length;
  const publishedCount = destinations.filter(d => d.is_published).length;
  const draftCount = totalDestinations - publishedCount;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <RefreshCw size={48} color="#0284c7" className="animate-pulse-glow" />
        <p style={{ color: '#475569', marginTop: '16px', fontWeight: 600 }}>Loading destinations...</p>
      </div>
    );
  }

  if (needsSetup) {
    return (
      <div style={{ maxWidth: '700px', margin: '60px auto', padding: '0 24px' }}>
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
          <AlertCircle size={48} color="#d97706" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Database Setup Required</h2>
          <p style={{ color: '#475569', marginBottom: '24px', lineHeight: 1.6 }}>
            The destinations table needs to be created in your Supabase database. Click the button below to set it up automatically.
          </p>
          <a
            href="/api/setup/destinations"
            target="_blank"
            className="btn-primary"
            style={{ padding: '14px 32px', fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Globe size={18} /> Setup Destinations Table
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1440px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Destinations Management
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Create and manage travel destinations for your marketplace.
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/destinations/create')}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '9999px', fontWeight: 700 }}
        >
          <Plus size={18} /> Add Destination
        </button>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Total Destinations</div>
              <div className="admin-stat-value">{totalDestinations}</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}>
              <MapPin size={24} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Published</div>
              <div className="admin-stat-value" style={{ color: '#059669' }}>{publishedCount}</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
              <Eye size={24} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-stat-label">Drafts</div>
              <div className="admin-stat-value" style={{ color: '#d97706' }}>{draftCount}</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}>
              <EyeOff size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      {destinations.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e1', padding: '80px 40px', textAlign: 'center' }}>
          <MapPin size={64} color="#94a3b8" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>No Destinations Yet</h3>
          <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            Start building your destinations catalog. Add cities, countries, and travel hotspots for your customers to explore.
          </p>
          <button
            onClick={() => router.push('/admin/destinations/create')}
            className="btn-primary"
            style={{ padding: '12px 32px', borderRadius: '9999px', fontWeight: 700 }}
          >
            <Plus size={16} /> Create First Destination
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {destinations.map((dest) => (
            <div key={dest.id} style={{
              background: '#ffffff',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)';
              const img = e.currentTarget.querySelector('.hero-img') as HTMLElement;
              if (img) img.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)';
              const img = e.currentTarget.querySelector('.hero-img') as HTMLElement;
              if (img) img.style.transform = 'scale(1)';
            }}
            >
              {/* Image Header */}
              <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                {dest.hero_image ? (
                  <img className="hero-img" src={dest.hero_image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                ) : (
                  <div className="hero-img" style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.5s ease' }}>
                    <MapPin size={40} color="rgba(255,255,255,0.2)" />
                  </div>
                )}
                {/* Gradient Overlay for text readability if needed later, but here just a subtle inner shadow */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 40%)' }}></div>
                
                {/* Badges */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                  <div style={{
                    background: dest.is_published ? 'rgba(22, 101, 52, 0.9)' : 'rgba(71, 85, 105, 0.9)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {dest.is_published ? <><div style={{width: 6, height: 6, borderRadius: '50%', background: '#4ade80'}}></div> Published</> : <><div style={{width: 6, height: 6, borderRadius: '50%', background: '#cbd5e1'}}></div> Draft</>}
                  </div>
                </div>

                <div style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'rgba(255,255,255,0.95)',
                  color: '#0f172a',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {dest.country}
                </div>
              </div>

              {/* Content Body */}
              <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px', fontFamily: "'Outfit', sans-serif" }}>{dest.name}</h3>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <button
                    onClick={() => router.push('/admin/destinations/create?id=' + dest.id)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0',
                      background: '#f8fafc', color: '#334155', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleTogglePublish(dest.id, dest.is_published)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '12px', border: 'none',
                      background: dest.is_published ? '#fff1f2' : '#f0fdf4',
                      color: dest.is_published ? '#be123c' : '#15803d',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '6px', fontSize: '0.85rem', fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                    onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
                  >
                    {dest.is_published ? <><EyeOff size={16} /> Unpublish</> : <><Eye size={16} /> Publish</>}
                  </button>
                  <button
                    onClick={() => handleDelete(dest.id)}
                    style={{
                      padding: '10px 14px', borderRadius: '12px', border: '1px solid #fee2e2',
                      background: '#ffffff', color: '#ef4444', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                    title="Delete Destination"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
