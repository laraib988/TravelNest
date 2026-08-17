'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import './admin.css';
import {
  LayoutDashboard,
  CalendarCheck,
  Building2,
  Users,
  Star,
  Tag,
  Wallet,
  Search,
  Bell,
  Menu,
  LogOut,
  ShieldAlert,
  UserX,
  Package,
  Clock,
  FileText,
  Settings,
  MapPin
} from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/users': 'Customer Portal',
  '/admin/suppliers': 'Suppliers Management',
  '/admin/suppliers?filter=REJECTED': 'Rejected Suppliers',
  '/admin/listings': 'Products Catalog',
  '/admin/listings?filter=PENDING': 'Pending Product Reviews',
  '/admin/bookings': 'Bookings & Orders',
  '/admin/destinations': 'Destinations Management',
  '/admin/reviews': 'Reviews & Feedback',
  '/admin/cms': 'Content Management System (CMS)',
  '/admin/promotions': 'Promotions & Coupons',
  '/admin/payouts': 'Payouts Ledger',
  '/admin/settings': 'System Settings',
};

const NAV_SECTIONS = [
  {
    label: 'MAIN',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/users', icon: Users, label: 'Customer Portal' },
    ],
  },
  {
    label: 'SUPPLIER MANAGEMENT',
    items: [
      { href: '/admin/suppliers', icon: Building2, label: 'Suppliers' },
      { href: '/admin/suppliers?filter=REJECTED', icon: UserX, label: 'Reject Supplier Profile' },
    ],
  },
  {
    label: 'PRODUCTS & ORDERS',
    items: [
      { href: '/admin/listings', icon: Package, label: 'Products' },
      { href: '/admin/listings?filter=PENDING', icon: Clock, label: 'Pending Product Reviews' },
      { href: '/admin/bookings', icon: CalendarCheck, label: 'Bookings & Orders' },
    ],
  },
  {
    label: 'MARKETING & CONTENT',
    items: [
      { href: '/admin/destinations', icon: MapPin, label: 'Destinations' },
      { href: '/admin/reviews', icon: Star, label: 'Review and Feedback' },
      { href: '/admin/cms', icon: FileText, label: 'CMS' },
      { href: '/admin/promotions', icon: Tag, label: 'Promotions' },
      { href: '/admin/payouts', icon: Wallet, label: 'Payouts' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { user, login, logout, signup } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (!isMounted) return null;

  // Allow access to login and signup pages without layout restrictions
  if (pathname === '/admin/login' || pathname === '/admin/signup') {
    return <>{children}</>;
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="admin-layout" style={{ justifyContent: 'center', alignItems: 'center', background: '#f8fafc', minHeight: '100vh', padding: '24px' }}>
        <div className="admin-empty-state" style={{ maxWidth: '440px', background: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 12px 32px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <ShieldAlert size={48} style={{ color: '#e11d48', margin: '0 auto 16px' }} />
          <h1 className="admin-empty-title" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Access Denied</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.5 }}>
            You are currently logged in as <strong>{user ? `${user.name} (${user.role})` : 'Guest'}</strong>. An Administrator account is required to access the Admin Panel.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link 
              href="/admin/login" 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', padding: '12px', fontSize: '0.9rem' }}
            >
              Login to Admin Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentTitle = PAGE_TITLES[pathname] || 'Admin Portal';
  const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD';

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      <div 
        className={`admin-sidebar-overlay ${mobileMenuOpen ? 'mobile-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link href="/admin" className="admin-sidebar-logo" style={{ textDecoration: 'none' }}>
            <span className="admin-sidebar-logo-text">TravelNest</span>
            <span className="admin-sidebar-logo-badge">Admin</span>
          </Link>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="admin-nav-section">
              <span className="admin-nav-section-label">{section.label}</span>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Pinned Bottom Sidebar Footer: Settings & Logout */}
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-footer-links">
            <Link 
              href="/admin/settings" 
              className={`admin-nav-item ${pathname === '/admin/settings' ? 'active' : ''}`}
              style={{ padding: '8px 12px' }}
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </div>

          <button className="admin-logout-btn" onClick={logout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Page Content */}
        <div className="admin-main-content">
          {children}
        </div>
      </main>
    </div>
  );
}
