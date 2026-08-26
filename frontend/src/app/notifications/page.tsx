'use client';

import { useState, useEffect } from 'react';
import { fetchFromAPI } from '@/lib/api-client';
import { Bell, Calendar, Star, Tag, TrendingDown, Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchFromAPI('/customer/bookings');
      if (Array.isArray(data) && data.length > 0) {
        // Map bookings to notifications
        const realNotifications = data.map((b: any) => ({
          id: `notif_${b.id}`,
          type: 'booking',
          title: b.status === 'PENDING_SUPPLIER_APPROVAL' ? 'Booking Requested' : 'Booking Confirmed!',
          message: `Your booking for ${b.traveler_details?.tour_name || 'your tour'} is ${b.status === 'PENDING_SUPPLIER_APPROVAL' ? 'pending approval' : 'confirmed'}.`,
          time: new Date(b.created_at).toLocaleDateString(),
          read: false,
          link: '/my-bookings'
        }));
        setNotifications(realNotifications);
      } else {
        setNotifications([{ id: 'notif_welcome', type: 'promo', title: 'Welcome to Vaitour!', message: 'Explore the best tours around the world.', time: 'Just now', read: false, link: '/' }]);
      }
    } catch (err) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'booking': return <Calendar size={20} color="#059669" />;
      case 'review': return <Star size={20} color="#d97706" />;
      case 'promo': return <Tag size={20} color="#7c3aed" />;
      case 'price': return <TrendingDown size={20} color="#0284c7" />;
      default: return <Bell size={20} color="#0f172a" />;
    }
  };

  const markAllRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Notification Center</h1>
            <p style={{ color: '#475569', marginTop: '4px' }}>Stay updated on price drops, trip reminders, and vouchers.</p>
          </div>
          <button 
            onClick={markAllRead} 
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Check size={14} /> Mark all read
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="card-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
            <Bell size={48} color="#94a3b8" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>No notifications</h3>
            <p style={{ color: '#64748b' }}>You're all caught up!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {notifications.map(n => (
              <Link 
                key={n.id} 
                href={n.link || '#'}
                className="card-panel card-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                  borderRadius: '20px',
                  background: n.read ? '#ffffff' : '#f0f9ff',
                  borderColor: n.read ? '#e2e8f0' : '#bae6fd',
                }}
              >
                <div style={{ padding: '12px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                  {getIcon(n.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{n.title}</strong>
                    {!n.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-primary)' }} />}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px', display: 'inline-block' }}>{n.time}</span>
                </div>
                <ChevronRight size={18} color="#94a3b8" />
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
