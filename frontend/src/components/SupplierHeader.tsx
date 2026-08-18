'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Bell, User, ChevronDown, LogOut, Settings, Calendar, ShoppingCart, ShieldAlert, Package, CreditCard, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import CurrencyLanguageDropdown from './CurrencyLanguageDropdown';

export default function SupplierHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

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
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Optional: Poll every 30 seconds for new notifications
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id?: string) => {
    if (!user?.id) return;
    try {
      await fetch('/api/supplier/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, id: id || undefined })
      });
      // Update local state immediately for snappy UI
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
      case 'ORDER': return <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ShoppingCart size={18} color="#0284c7" /></div>;
      case 'PAYMENT': return <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CreditCard size={18} color="#059669" /></div>;
      case 'PRODUCT': return <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Package size={18} color="#7c3aed" /></div>;
      case 'SUCCESS': return <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CheckCircle2 size={18} color="#059669" /></div>;
      case 'INFO': return <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bell size={18} color="#2563eb" /></div>;
      case 'REJECTED': return <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ShieldAlert size={18} color="#e11d48" /></div>;
      default: return <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ShieldAlert size={18} color="#d97706" /></div>;
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
    <header 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: 'rgba(255, 255, 255, 0.98)', 
        backdropFilter: 'blur(16px)', 
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}
    >
      <div 
        ref={headerRef}
        style={{ 
          maxWidth: '1440px', 
          margin: '0 auto', 
          padding: '12px 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        {/* BRAND LOGO - Routes to Supplier Dashboard, NOT Customer Site */}
        <Link href="/supplier/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div 
            style={{ 
              background: 'linear-gradient(135deg, #0f172a, #334155)', 
              padding: '9px', 
              borderRadius: '14px', 
              display: 'flex', 
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)' 
            }}
          >
            <Compass size={22} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em', color: '#0f172a' }}>
              TravelNest
            </span>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', color: '#059669', textTransform: 'uppercase', marginTop: '2px' }}>
              Supplier Portal
            </span>
          </div>
        </Link>

        {/* RIGHT ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          
          {/* CURRENCY & LANGUAGE DROPDOWN */}
          <CurrencyLanguageDropdown />

          {/* NOTIFICATION BELL */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsUserMenuOpen(false); fetchNotifications(); }}
              style={{ 
                position: 'relative', 
                cursor: 'pointer', 
                background: isNotifOpen ? '#f1f5f9' : '#f8fafc', 
                padding: '10px', 
                borderRadius: '50%', 
                border: isNotifOpen ? '1px solid #94a3b8' : '1px solid #cbd5e1', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                transition: 'all 0.2s'
              }}
            >
              <Bell size={18} color="#475569" />
              {unreadCount > 0 && (
                <span 
                  style={{ 
                    position: 'absolute', 
                    top: '-3px', 
                    right: '-3px', 
                    background: '#e11d48', 
                    color: '#ffffff', 
                    fontSize: '0.62rem', 
                    fontWeight: 800, 
                    borderRadius: '50%', 
                    width: '16px', 
                    height: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN */}
            {isNotifOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '52px',
                  right: 0,
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  width: '380px',
                  zIndex: 200,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={() => markAsRead()} style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '30px 20px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                      You're all caught up!
                    </div>
                  ) : (
                    notifications.map((notif, idx) => (
                      <div 
                        key={notif.id} 
                        onClick={() => { if (!notif.is_read) markAsRead(notif.id); }}
                        style={{ 
                          padding: '16px 20px', 
                          borderBottom: idx < notifications.length - 1 ? '1px solid #f1f5f9' : 'none',
                          background: !notif.is_read ? '#f0f9ff' : '#ffffff',
                          display: 'flex',
                          gap: '16px',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = !notif.is_read ? '#e0f2fe' : '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = !notif.is_read ? '#f0f9ff' : '#ffffff'}
                      >
                        {getIcon(notif.type)}
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: !notif.is_read ? 800 : 700, color: '#0f172a', marginBottom: '4px' }}>
                            {notif.title}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.4, marginBottom: '6px' }}>
                            {notif.message}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                            {getTimeAgo(notif.created_at)}
                          </div>
                        </div>
                        {!notif.is_read && (
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7', alignSelf: 'center', marginLeft: 'auto' }} />
                        )}
                      </div>
                    ))
                  )}
                </div>
                
                <div style={{ padding: '12px', borderTop: '1px solid #e2e8f0', textAlign: 'center', background: '#f8fafc' }}>
                  <Link href="/supplier/notifications" onClick={() => setIsNotifOpen(false)} style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none' }}>
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* USER PROFILE */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsNotifOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px 4px 4px',
                  borderRadius: '100px',
                  border: isUserMenuOpen ? '1px solid #94a3b8' : '1px solid #cbd5e1',
                  background: isUserMenuOpen ? '#f1f5f9' : '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s'
                }}
              >
                <img src={user.avatar || 'https://i.pravatar.cc/150?u=supplier'} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{user.name}</span>
                <ChevronDown size={14} color="#64748b" style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {isUserMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '52px',
                    right: 0,
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    width: '220px',
                    padding: '8px 0',
                    zIndex: 200,
                  }}
                >
                  <Link
                    href="/supplier/dashboard"
                    onClick={() => setIsUserMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.88rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                  >
                    <Calendar size={15} color="#0284c7" /> Dashboard
                  </Link>
                  <Link
                    href="/supplier/account-settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.88rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                  >
                    <Settings size={15} color="#7c3aed" /> Account Settings
                  </Link>
                  <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                      router.push('/supplier/login');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 16px',
                      fontSize: '0.88rem',
                      color: '#ef4444',
                      background: 'none',
                      border: 'none',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
