'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, ShoppingCart, CreditCard, CheckCircle2 } from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch('/api/supplier/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const markAsRead = async (id?: string) => {
    if (!user?.id) return;
    try {
      await fetch('/api/supplier/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, id: id || undefined })
      });
      if (id) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      } else {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ShoppingCart size={22} color="#0284c7" /></div>;
      case 'PAYMENT': return <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CreditCard size={22} color="#059669" /></div>;
      case 'PRODUCT': return <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CheckCircle2 size={22} color="#7c3aed" /></div>;
      default: return <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ShieldAlert size={22} color="#d97706" /></div>;
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} mins ago`;
    if (diff < 1440) return `${Math.floor(diff/60)} hours ago`;
    return `${Math.floor(diff/1440)} days ago`;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>Notifications</h1>
          <p style={{ color: '#64748b', margin: 0 }}>View all your alerts, messages, and updates.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={() => markAsRead()}
            style={{ 
              padding: '10px 20px', 
              background: '#ffffff', 
              border: '1px solid #cbd5e1', 
              borderRadius: '8px', 
              color: '#0f172a', 
              fontWeight: 600, 
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ display: 'inline-flex', padding: '20px', background: '#f8fafc', borderRadius: '50%', marginBottom: '16px' }}>
              <CheckCircle2 size={40} color="#94a3b8" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>You're all caught up!</h3>
            <p style={{ margin: 0 }}>You have no notifications at the moment.</p>
          </div>
        ) : (
          notifications.map((notif, idx) => (
            <div 
              key={notif.id}
              onClick={() => { if (!notif.is_read) markAsRead(notif.id); }}
              style={{ 
                padding: '24px 30px', 
                borderBottom: idx < notifications.length - 1 ? '1px solid #e2e8f0' : 'none',
                background: !notif.is_read ? '#f0f9ff' : '#ffffff',
                display: 'flex',
                gap: '20px',
                cursor: !notif.is_read ? 'pointer' : 'default',
                transition: 'background 0.2s',
                alignItems: 'flex-start'
              }}
              onMouseEnter={(e) => { if (!notif.is_read) e.currentTarget.style.background = '#e0f2fe'; }}
              onMouseLeave={(e) => { if (!notif.is_read) e.currentTarget.style.background = '#f0f9ff'; }}
            >
              {getIcon(notif.type)}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: !notif.is_read ? 800 : 700, color: '#0f172a' }}>
                    {notif.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                    {getTimeAgo(notif.created_at)}
                  </div>
                </div>
                <div style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.5 }}>
                  {notif.message}
                </div>
              </div>
              {!notif.is_read && (
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0284c7', marginTop: '6px' }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
