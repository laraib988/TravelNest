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
  MapPin,
  Newspaper
} from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/admin-portal': 'Dashboard',
  '/admin-portal/users': 'Customer Portal',
  '/admin-portal/suppliers': 'Suppliers Management',
  '/admin-portal/suppliers?filter=REJECTED': 'Rejected Suppliers',
  '/admin-portal/listings': 'Products Catalog',
  '/admin-portal/listings?filter=PENDING': 'Pending Product Reviews',
  '/admin-portal/bookings': 'Bookings & Orders',
  '/admin-portal/destinations': 'Destinations Management',
  '/admin-portal/reviews': 'Reviews & Feedback',
  '/admin-portal/cms': 'Content Management System (CMS)',
  '/admin-portal/blogs': 'Blog Management',
  '/admin-portal/promotions': 'Promotions & Coupons',
  '/admin-portal/payouts': 'Payouts Ledger',
  '/admin-portal/security': 'Security & Audit Center',
  '/admin-portal/settings': 'System Settings',
};

const NAV_SECTIONS = [
  {
    label: 'MAIN',
    items: [
      { href: '/admin-portal', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin-portal/users', icon: Users, label: 'Customer Portal' },
    ],
  },
  {
    label: 'SUPPLIER MANAGEMENT',
    items: [
      { href: '/admin-portal/suppliers', icon: Building2, label: 'Suppliers' },
      { href: '/admin-portal/suppliers?filter=REJECTED', icon: UserX, label: 'Reject Supplier Profile' },
    ],
  },
  {
    label: 'PRODUCTS & ORDERS',
    items: [
      { href: '/admin-portal/listings', icon: Package, label: 'Products' },
      { href: '/admin-portal/listings?filter=PENDING', icon: Clock, label: 'Pending Product Reviews' },
      { href: '/admin-portal/bookings', icon: CalendarCheck, label: 'Bookings & Orders' },
    ],
  },
  {
    label: 'MARKETING & CONTENT',
    items: [
      { href: '/admin-portal/destinations', icon: MapPin, label: 'Destinations' },
      { href: '/admin-portal/reviews', icon: Star, label: 'Review and Feedback' },
      { href: '/admin-portal/cms', icon: FileText, label: 'CMS' },
      { href: '/admin-portal/blogs', icon: Newspaper, label: 'Blogs' },
      { href: '/admin-portal/promotions', icon: Tag, label: 'Promotions' },
      { href: '/admin-portal/payouts', icon: Wallet, label: 'Payouts' },
    ],
  },
  {
    label: 'CONTENT PAGES',
    items: [
      { href: '/admin-portal/content/tours-experiences', icon: MapPin, label: 'Tours & Experiences' },
      { href: '/admin-portal/content/attraction-tickets', icon: Tag, label: 'Attraction Tickets' },
      { href: '/admin-portal/content/transport', icon: CalendarCheck, label: 'Transport' },
      { href: '/admin-portal/content/car-rentals', icon: Package, label: 'Car Rentals' },
    ],
  },
  {
    label: 'SYSTEM & SECURITY',
    items: [
      { href: '/admin-portal/security', icon: ShieldAlert, label: 'Security & Audit' },
      { href: '/admin-portal/settings', icon: Settings, label: 'Platform Settings' },
    ],
  }
];



export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { user, login, logout, signup } = useAuth();

  const [mfaPending, setMfaPending] = useState(true);
  const router = require('next/navigation').useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Strict MFA Bypass Protection
  useEffect(() => {
    const checkSecurity = async () => {
      if (!user || user.role !== 'ADMIN') {
        setMfaPending(false);
        return;
      }
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (!error && data?.nextLevel === 'aal2' && data?.currentLevel === 'aal1') {
          // MFA is enrolled but not verified yet. Kick them back to login.
          router.replace('/admin-portal/login');
        } else {
          setMfaPending(false);
        }
      } catch (e) {
        setMfaPending(false);
      }
    };
    
    if (isMounted && pathname !== '/admin-portal/login' && pathname !== '/admin-portal/signup') {
      checkSecurity();
    } else {
      setMfaPending(false);
    }
  }, [user, isMounted, pathname, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (!isMounted || mfaPending) return null;

  // Allow access to login and signup pages without layout restrictions
  if (pathname === '/admin-portal/login' || pathname === '/admin-portal/signup') {
    return <>{children}</>;
  }

  if (!user || user.role !== 'ADMIN') {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin-portal/login';
    }
    return null;
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
          <Link href="/admin-portal" className="admin-sidebar-logo" style={{ textDecoration: 'none' }}>
            <span className="admin-sidebar-logo-text">Vaitour</span>
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
              href="/admin-portal/settings" 
              className={`admin-nav-item ${pathname === '/admin-portal/settings' ? 'active' : ''}`}
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
