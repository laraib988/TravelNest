'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Users, Calendar, Settings, LogOut, CheckCircle2, MoreVertical, Edit, EyeOff, Trash2, Plus, ArrowUpRight, DollarSign, Search, Clock, Wallet, Banknote, SlidersHorizontal, CheckCircle, Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AccountSettingsClient from './AccountSettingsClient';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);


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


const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SupplierDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
const section = (params?.section as string) || 'dashboard';

  // Auth guard: supplier pages must not be accessible without login.
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/supplier/login');
    }
  }, [authLoading, user, router]);


  
  const activeTab = section === 'listings' ? 'LISTINGS' : section === 'bookings' ? 'BOOKINGS' : section === 'finance' ? 'FINANCE' : section === 'account-settings' ? 'ACCOUNT' : section === 'availability' ? 'AVAILABILITY' : 'DASHBOARD';
  const { data: rawListings, isLoading: loading, mutate: refreshListings } = useSWR(
    user?.id ? `/api/supplier/listings?userId=${user.id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  const listings = rawListings || [];

  const setListings = (updater: any) => {
    refreshListings(updater, false);
  };
  
  const setLoading = (val: boolean) => {
    // SWR handles loading, so we can ignore manual setLoading for listings.
    // If it's used for other tabs, we just mock it here.
  };
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [financeTab, setFinanceTab] = useState<'PAYOUTS' | 'INVOICES' | 'CONFIRMATION' | 'SETTINGS'>(section === 'account-settings' ? 'SETTINGS' : 'PAYOUTS');
  const [availabilityTab, setAvailabilityTab] = useState<'PRODUCTS' | 'SETTINGS'>('PRODUCTS');
  const [search, setSearch] = useState('');
  const [dateRanges, setDateRanges] = useState<Record<string, { from: string; to: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [financeSearch, setFinanceSearch] = useState('');
  
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [showBankForm, setShowBankForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<{title: string, message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (user && user.id) {
      const fetchAccounts = async () => {
        try {
          const res = await fetch(`/api/supplier/bank-details?supplierId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setBankAccounts(data || []);
          }
        } catch (e) {
          console.error('Error fetching bank accounts:', e);
        }
      };
      fetchAccounts();
    }
  }, [user]);

const triggerToast = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ title, message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const toggleStatus = async (productId: string, status: string) => {
    try {
      const res = await fetch(`/api/supplier/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierId: user?.id, productId, status })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update status');
      }
      const data = await res.json();
      // Update state immediately for real-time feedback
      setListings(prev => prev.map(l => l.id === productId ? { ...l, status: data.status, availability_block: data.availability_block } : l));
      triggerToast('Success', status === 'PUBLISHED' || status === 'APPROVED'
        ? 'Product is now Active and visible to customers.'
        : 'Product is now Inactive and hidden from customers.');
    } catch (err: any) {
      console.error('toggleStatus error:', err);
      triggerToast('Error', err.message || 'Failed to update product status', 'error');
    }
  };

  const saveAvailability = async (productId: string, fromDate: string, toDate: string) => {
    if (!fromDate || !toDate) {
      triggerToast('Error', 'Please select both From and To dates.', 'error');
      return;
    }
    if (new Date(toDate) < new Date(fromDate)) {
      triggerToast('Error', '"To" date cannot be before "From" date.', 'error');
      return;
    }
    try {
      setSavingId(productId);
      const res = await fetch(`/api/supplier/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: user?.id,
          productId,
          availabilityDates: { from: fromDate, to: toDate }
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save availability');
      }
      const data = await res.json();
      // Update state immediately for real-time feedback
      setListings(prev => prev.map(l => l.id === productId ? { ...l, status: data.status, availability_block: data.availability_block } : l));
      triggerToast('Success', `Product will be blocked from ${fromDate} to ${toDate}, then auto-activate.`);
    } catch (err: any) {
      console.error('saveAvailability error:', err);
      triggerToast('Error', err.message || 'Failed to save availability', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const clearAvailability = async (productId: string) => {
    try {
      const res = await fetch(`/api/supplier/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierId: user?.id, productId, action: 'ACTIVATE' })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to clear availability');
      }
      const data = await res.json();
      setListings(prev => prev.map(l => l.id === productId ? { ...l, status: data.status, availability_block: null } : l));
      setDateRanges(prev => ({ ...prev, [productId]: { from: '', to: '' } }));
      triggerToast('Success', 'Product is now fully available to customers.');
    } catch (err: any) {
      triggerToast('Error', err.message || 'Failed to clear availability', 'error');
    }
  };

  

  
  const [supplierBookings, setSupplierBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  

  useEffect(() => {
    if (user) {
      setLoadingBookings(true);
      fetch(`/api/supplier/bookings?supplierId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setSupplierBookings(data);
          setLoadingBookings(false);
        })
        .catch(() => setLoadingBookings(false));

      // Real-time Supabase subscription for new bookings
      const channel = supabase
        .channel(`supplier_bookings_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bookings',
            filter: `supplier_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('New real-time booking received:', payload.new);
            setSupplierBookings((prev) => [payload.new, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, activeTab]);



  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ fontSize: '1rem', color: '#64748b' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled above
  }

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
      case 'EDIT_PENDING':
        return <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>Edit Pending</span>;
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
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Vaitour Supplier</h2>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={14} color="#059669" /> Verified Partner
          </div>
        </div>
        
        <div style={{ flex: 1, padding: '20px' }}>
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/supplier/dashboard" style={{ padding: '12px 16px', background: activeTab === 'DASHBOARD' ? '#f0f9ff' : 'transparent', color: activeTab === 'DASHBOARD' ? '#0284c7' : '#64748b', borderRadius: '10px', fontWeight: activeTab === 'DASHBOARD' ? 700 : 600, display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link href="/supplier/listings" style={{ padding: '12px 16px', background: activeTab === 'LISTINGS' ? '#f0f9ff' : 'transparent', color: activeTab === 'LISTINGS' ? '#0284c7' : '#64748b', borderRadius: '10px', fontWeight: activeTab === 'LISTINGS' ? 700 : 600, display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <Calendar size={18} /> My Listings
            </Link>
            <Link href="/supplier/bookings" style={{ padding: '12px 16px', background: activeTab === 'BOOKINGS' ? '#f0f9ff' : 'transparent', color: activeTab === 'BOOKINGS' ? '#0284c7' : '#64748b', borderRadius: '10px', fontWeight: activeTab === 'BOOKINGS' ? 700 : 600, display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <Users size={18} /> Bookings
            </Link>
            <Link href="/supplier/finance" style={{ padding: '12px 16px', background: activeTab === 'FINANCE' ? '#f0f9ff' : 'transparent', color: activeTab === 'FINANCE' ? '#0284c7' : '#64748b', borderRadius: '10px', fontWeight: activeTab === 'FINANCE' ? 700 : 600, display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <DollarSign size={18} /> Finance & Payouts
            </Link>
            <Link href="/supplier/availability" style={{ padding: '12px 16px', background: activeTab === 'AVAILABILITY' ? '#f0f9ff' : 'transparent', color: activeTab === 'AVAILABILITY' ? '#0284c7' : '#64748b', borderRadius: '10px', fontWeight: activeTab === 'AVAILABILITY' ? 700 : 600, display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <Calendar size={18} /> Availability
            </Link>
            <Link href="/supplier/account-settings" style={{ padding: '12px 16px', color: '#64748b', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <Settings size={18} /> Account Settings
            </Link>
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
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
                  {supplierBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length}
                </div>
              </div>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Revenue (This Month)</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
                  ${supplierBookings.filter(b => {
                    const d = new Date(b.created_at || b.slot_start_time);
                    return (b.status === 'CONFIRMED' || b.status === 'COMPLETED') && d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
                  }).reduce((acc, b) => acc + Number(b.supplier_payout || 0), 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
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


        {/* =========================================================================
            FINANCE & PAYOUTS TAB
           ========================================================================= */}
        {activeTab === 'ACCOUNT' && <AccountSettingsClient />}
        {activeTab === 'FINANCE' && (
          <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>Finance & Payouts</h1>

            {/* SUMMARY CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Total Earning</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                  ${supplierBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').reduce((acc, b) => acc + Number(b.supplier_payout || 0), 0).toLocaleString()}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '4px', borderRadius: '50%' }}><Clock size={14} /></div> Pending Payout
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                  ${supplierBookings.filter(b => b.status === 'CONFIRMED' && new Date(b.slot_start_time) > new Date()).reduce((acc, b) => acc + Number(b.supplier_payout || 0), 0).toLocaleString()}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ background: '#fae8ff', color: '#c026d3', padding: '4px', borderRadius: '50%' }}><Banknote size={14} /></div> Loss from cancellation
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                  ${supplierBookings.filter(b => b.status === 'CANCELLED').reduce((acc, b) => acc + Number(b.supplier_payout || 0), 0).toLocaleString()}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ background: '#fef9c3', color: '#ca8a04', padding: '4px', borderRadius: '50%' }}><CheckCircle size={14} /></div> Paid This Month
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                  ${supplierBookings.filter(b => (b.status === 'CONFIRMED' || b.status === 'COMPLETED') && new Date(b.created_at).getMonth() === new Date().getMonth()).reduce((acc, b) => acc + Number(b.supplier_payout || 0), 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* CHART (CSS Based) */}
            <div style={{ padding: '40px 0', borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1', marginBottom: '40px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '240px', paddingLeft: '40px' }}>
                {(() => {
                  const chartData = [...Array(4)].map((_, i) => {
                    const d = new Date();
                    d.setMonth(d.getMonth() - (3 - i));
                    const monthName = d.toLocaleString('default', { month: 'short' });
                    const m = d.getMonth();
                    const y = d.getFullYear();
                    
                    const monthBookings = supplierBookings.filter(b => {
                      const bd = new Date(b.created_at || b.slot_start_time);
                      return bd.getMonth() === m && bd.getFullYear() === y;
                    });
                    
                    const val1 = monthBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').reduce((acc, b) => acc + Number(b.supplier_payout || 0), 0);
                    const val2 = monthBookings.filter(b => b.status === 'PENDING').reduce((acc, b) => acc + Number(b.supplier_payout || 0), 0);
                    
                    return { label: monthName, val1, val2 };
                  });
                  const maxVal = Math.max(100, Math.ceil(Math.max(...chartData.map(d => Math.max(d.val1, d.val2))) / 100) * 100);
                  
                  return (
                    <>
                      {/* Y-Axis labels */}
                      <div style={{ position: 'absolute', left: 0, top: '40px', bottom: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', width: '40px', textAlign: 'right' }}>
                        <span>{maxVal}</span>
                        <span>{Math.round(maxVal * 0.75)}</span>
                        <span>{Math.round(maxVal * 0.5)}</span>
                        <span>{Math.round(maxVal * 0.25)}</span>
                        <span>0</span>
                      </div>
                      {/* Grid lines */}
                      <div style={{ position: 'absolute', left: '50px', right: 0, top: '40px', bottom: '40px', zIndex: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        {[...Array(5)].map((_, i) => <div key={i} style={{ borderBottom: '1px dashed #e2e8f0', width: '100%', height: '0' }} />)}
                      </div>
                      
                      {/* Bars */}
                      {chartData.map((m, i) => (
                        <div key={i} style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginLeft: i === 0 ? '50px' : '0' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '240px' }}>
                            <div style={{ width: '60px', background: '#818cf8', height: `${(m.val1/maxVal)*100}%`, borderTopLeftRadius: '4px', borderTopRightRadius: '4px', minHeight: m.val1 > 0 ? '4px' : '0' }}></div>
                            <div style={{ width: '60px', background: '#86efac', height: `${(m.val2/maxVal)*100}%`, borderTopLeftRadius: '4px', borderTopRightRadius: '4px', minHeight: m.val2 > 0 ? '4px' : '0' }}></div>
                          </div>
                          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{m.label}</span>
                        </div>
                      ))}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* TABS */}
            <div style={{ display: 'flex', gap: '12px', background: '#f1f5f9', padding: '6px', borderRadius: '100px', width: 'fit-content', marginBottom: '24px' }}>
              {['PAYOUTS', 'INVOICES', 'CONFIRMATION', 'SETTINGS'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFinanceTab(tab as any)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '100px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: financeTab === tab ? '#ffffff' : 'transparent',
                    color: financeTab === tab ? '#0f172a' : '#64748b',
                    boxShadow: financeTab === tab ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  {tab === 'PAYOUTS' ? 'Bookings for Payout' : 
                   tab === 'INVOICES' ? 'Invoices' : 
                   tab === 'CONFIRMATION' ? 'Payment Confirmation' : 'Payment Setting'}
                </button>
              ))}
            </div>

            {financeTab === 'PAYOUTS' && (
              <>
                {/* SEARCH BAR */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 16px', width: '320px' }}>
                    <Search size={18} color="#94a3b8" />
                    <input 
                      type="text" 
                      placeholder="Search bookings.." 
                      value={financeSearch}
                      onChange={e => setFinanceSearch(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', marginLeft: '12px', fontSize: '0.9rem' }}
                    />
                  </div>
                  <button style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <SlidersHorizontal size={20} />
                  </button>
                </div>

                {/* TABLE */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '0.8rem', fontWeight: 800 }}>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', width: '40px' }}><input type="checkbox" /></th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Booking Reference</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Lead Traveler</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Product Code</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Activity Date</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Retail Price</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Net Price</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplierBookings
                        .filter(b => b.booking_reference?.toLowerCase().includes(financeSearch.toLowerCase()) || b.traveler_details?.lead_name?.toLowerCase().includes(financeSearch.toLowerCase()))
                        .map((b, i) => {
                        const isUpcoming = new Date(b.slot_start_time) > new Date();
                        const isPaid = !isUpcoming && b.status === 'CONFIRMED';
                        
                        return (
                        <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '16px' }}><input type="checkbox" /></td>
                          <td style={{ padding: '16px', fontWeight: 600, color: '#0f172a' }}>{b.booking_reference}</td>
                          <td style={{ padding: '16px', color: '#475569' }}>{b.traveler_details?.lead_name || 'N/A'}</td>
                          <td style={{ padding: '16px', color: '#475569' }}>{b.listing_id.substring(0,8).toUpperCase()}</td>
                          <td style={{ padding: '16px', color: '#475569' }}>{new Date(b.slot_start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td style={{ padding: '16px', fontWeight: 600, color: '#0f172a' }}>${b.gross_amount}</td>
                          <td style={{ padding: '16px', fontWeight: 600, color: '#0f172a' }}>${b.supplier_payout}</td>
                          <td style={{ padding: '16px' }}>
                            {isPaid ? (
                              <span style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Paid</span>
                            ) : b.status === 'CANCELLED' ? (
                              <span style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Cancelled</span>
                            ) : (
                              <span style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 800 }}>Ready for Payout</span>
                            )}
                          </td>
                        </tr>
                      )})}
                      {supplierBookings.length === 0 && (
                        <tr>
                          <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No bookings found for payout.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            

            {financeTab === 'CONFIRMATION' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Payment Confirmations</h2>
                  <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', background: '#1e3a8a', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <Download size={16} /> Download PDF
                  </button>
                </div>
                
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#0f172a', fontSize: '0.85rem', fontWeight: 800 }}>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Payment ID</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Amount</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Method</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(supplierBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').reduce((acc, b) => {
                         const date = new Date(b.created_at || b.slot_start_time);
                         const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                         if (!acc[key]) {
                            acc[key] = {
                               dateStr: `${date.toLocaleString('default', { month: 'short' })} 14, ${date.getFullYear()}`,
                               paymentId: `PAY-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(3, '0')}`,
                               amount: 0,
                               method: Math.random() > 0.5 ? 'Bank Transfer' : 'PayPal',
                               status: date.getMonth() === new Date().getMonth() ? 'Processing' : 'Completed',
                               bookings: []
                            };
                         }
                         acc[key].amount += Number(b.supplier_payout || 0);
                         acc[key].bookings.push(b);
                         return acc;
                      }, {})).map((p: any, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '16px', color: '#0f172a' }}>{p.dateStr}</td>
                          <td style={{ padding: '16px', color: '#475569' }}>{p.paymentId}</td>
                          <td style={{ padding: '16px', fontWeight: 800, color: '#0f172a' }}>${p.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                          <td style={{ padding: '16px', color: '#475569' }}>{p.method}</td>
                          <td style={{ padding: '16px' }}>
                            {p.status === 'Completed' ? (
                              <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>Completed</span>
                            ) : (
                              <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>Processing</span>
                            )}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button onClick={() => setSelectedPayout(p)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                <Eye size={14} /> View
                              </button>
                              <button onClick={() => {
                                const win = window.open('', '_blank');
                                if (!win) return;
                                win.document.write(`
                                  <html>
                                    <head>
                                      <title>Payout ${p.paymentId}</title>
                                      <style>
                                        body { font-family: sans-serif; padding: 40px; color: #333; }
                                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                        th, td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
                                      </style>
                                    </head>
                                    <body onload="window.print(); window.close();">
                                      <h1>Vaitour Supplier Payout</h1>
                                      <p><strong>Payment ID:</strong> ${p.paymentId}</p>
                                      <p><strong>Date:</strong> ${p.dateStr}</p>
                                      <p><strong>Total Amount:</strong> $${p.amount.toFixed(2)}</p>
                                      <p><strong>Method:</strong> ${p.method}</p>
                                      <p><strong>Status:</strong> ${p.status}</p>
                                      <h3>Bookings Included</h3>
                                      <table>
                                        <tr><th>Booking Ref</th><th>Date</th><th>Amount</th></tr>
                                        ${p.bookings.map((b: any) => `<tr><td>${b.booking_reference}</td><td>${new Date(b.created_at || b.slot_start_time).toLocaleDateString()}</td><td>$${Number(b.supplier_payout || 0).toFixed(2)}</td></tr>`).join('')}
                                      </table>
                                    </body>
                                  </html>
                                `);
                                win.document.close();
                              }} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                <Download size={14} /> PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {supplierBookings.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No payment confirmations yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  
                  <div style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', borderTop: '1px solid #e2e8f0', background: '#fff' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><ChevronLeft size={18} color="#64748b" /></button>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ background: '#1e3a8a', color: '#fff', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.85rem', fontWeight: 700 }}>1</span>
                      <span style={{ color: '#475569', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.85rem', border: '1px solid #e2e8f0' }}>2</span>
                      <span style={{ color: '#475569', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.85rem', border: '1px solid #e2e8f0' }}>3</span>
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><ChevronRight size={18} color="#64748b" /></button>
                  </div>
                </div>
              </>
            )}


            {financeTab === 'INVOICES' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Invoices</h2>
                  <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', background: '#1e3a8a', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <Download size={16} /> Download PDF
                  </button>
                </div>
                
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#0f172a', fontSize: '0.85rem', fontWeight: 800 }}>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Invoice #</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Amount</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Due Date</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(supplierBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').reduce((acc, b) => {
                         const date = new Date(b.created_at || b.slot_start_time);
                         const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                         if (!acc[key]) {
                            const dueDate = new Date(date);
                            dueDate.setDate(dueDate.getDate() + 15); // Net 15 terms
                            
                            acc[key] = {
                               dateStr: `${date.toLocaleString('default', { month: 'short' })} 14, ${date.getFullYear()}`,
                               dueDateStr: `${dueDate.toLocaleString('default', { month: 'short' })} 29, ${dueDate.getFullYear()}`,
                               invoiceId: `INV-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(3, '0')}`,
                               amount: 0,
                               status: date.getMonth() === new Date().getMonth() ? 'Processing' : 'Paid',
                               bookings: []
                            };
                         }
                         acc[key].amount += Number(b.supplier_payout || 0);
                         acc[key].bookings.push(b);
                         return acc;
                      }, {})).map((p: any, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '16px', color: '#0f172a' }}>{p.dateStr}</td>
                          <td style={{ padding: '16px', color: '#475569' }}>{p.invoiceId}</td>
                          <td style={{ padding: '16px', fontWeight: 800, color: '#0f172a' }}>${p.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                          <td style={{ padding: '16px', color: '#475569' }}>{p.dueDateStr}</td>
                          <td style={{ padding: '16px' }}>
                            {p.status === 'Paid' ? (
                              <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 14px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>Paid</span>
                            ) : (
                              <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 14px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>Pending</span>
                            )}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button onClick={() => setSelectedPayout(p)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                <Eye size={14} /> View
                              </button>
                              <button onClick={() => {
                                const win = window.open('', '_blank');
                                if (!win) return;
                                win.document.write(`
                                  <html>
                                    <head>
                                      <title>Invoice ${p.invoiceId}</title>
                                      <style>
                                        body { font-family: sans-serif; padding: 40px; color: #333; }
                                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                        th, td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
                                      </style>
                                    </head>
                                    <body onload="window.print(); window.close();">
                                      <h1>Vaitour Supplier Invoice</h1>
                                      <p><strong>Invoice #:</strong> ${p.invoiceId}</p>
                                      <p><strong>Date:</strong> ${p.dateStr}</p>
                                      <p><strong>Due Date:</strong> ${p.dueDateStr}</p>
                                      <p><strong>Total Amount:</strong> $${p.amount.toFixed(2)}</p>
                                      <p><strong>Status:</strong> ${p.status}</p>
                                      <h3>Bookings Included</h3>
                                      <table>
                                        <tr><th>Booking Ref</th><th>Date</th><th>Amount</th></tr>
                                        ${p.bookings.map((b: any) => `<tr><td>${b.booking_reference}</td><td>${new Date(b.created_at || b.slot_start_time).toLocaleDateString()}</td><td>$${Number(b.supplier_payout || 0).toFixed(2)}</td></tr>`).join('')}
                                      </table>
                                    </body>
                                  </html>
                                `);
                                win.document.close();
                              }} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                <Download size={14} /> PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {supplierBookings.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No invoices yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  
                  <div style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', borderTop: '1px solid #e2e8f0', background: '#fff' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><ChevronLeft size={18} color="#64748b" /></button>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ background: '#1e3a8a', color: '#fff', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.85rem', fontWeight: 700 }}>1</span>
                      <span style={{ color: '#475569', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.85rem', border: '1px solid #e2e8f0' }}>2</span>
                      <span style={{ color: '#475569', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.85rem', border: '1px solid #e2e8f0' }}>3</span>
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><ChevronRight size={18} color="#64748b" /></button>
                  </div>
                </div>
              </>
            )}


            {}
          </div>
)}
        
        {activeTab === 'AVAILABILITY' && (
          <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Product Availability</h1>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Activate or deactivate your products and set temporary blocked dates. No admin approval needed.</p>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              {loading ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                  Loading your products...
                </div>
              ) : listings.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                  No listings found. Create your first tour to get started!
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <input
                        type="text"
                        placeholder="Search products by name or ID.."
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                      />
                    </div>
                    <button
                      onClick={() => router.push('/supplier/listings/create')}
                      style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--brand-gradient)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Plus size={18} /> Create New Listing
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {listings
                      .filter(item => !search || (item.title && item.title.toLowerCase().includes(search.toLowerCase())) || (item.id && item.id.toLowerCase().includes(search.toLowerCase())))
                      .map((item) => {
                        const block = item.availability_block || null;
                        const blockFrom = block?.from || '';
                        const blockTo = block?.to || '';
                        const isBlockedNow = (() => {
                          if (!blockFrom || !blockTo) return false;
                          const today = new Date(); today.setHours(0,0,0,0);
                          const f = new Date(blockFrom); f.setHours(0,0,0,0);
                          const t = new Date(blockTo); t.setHours(23,59,59,999);
                          return f <= today && t >= today;
                        })();
                        const isActive = item.status === 'PUBLISHED' || item.status === 'APPROVED';

                        return (
                          <div
                            key={item.id}
                            style={{
                              background: '#fff',
                              borderRadius: '16px',
                              border: isBlockedNow ? '2px solid #f43f5e' : isActive ? '1px solid #e2e8f0' : '1px solid #cbd5e1',
                              padding: '24px',
                              transition: 'all 0.2s',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{ width: '100%', height: '160px', borderRadius: '12px', objectFit: 'cover', marginBottom: '16px' }}
                            />

                            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px', lineHeight: 1.35 }}>{item.title}</div>
                            <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '12px' }}>ID: {item.id.startsWith('TN') ? item.id : 'TN' + item.id.replace(/-/g, '').substring(0, 8).toUpperCase()}</div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                              <span style={{
                                padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                                background: isBlockedNow ? '#fef2f2' : isActive ? '#dcfce7' : '#f1f5f9',
                                color: isBlockedNow ? '#b91c1c' : isActive ? '#166534' : '#475569'
                              }}>
                                {isBlockedNow ? 'BLOCKED (dates active)' : isActive ? 'LIVE' : 'OFFLINE'}
                              </span>
                              {block && (
                                <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, background: '#fef3c7', color: '#92400e' }}>
                                  Blocked {blockFrom} → {blockTo}
                                </span>
                              )}
                            </div>

                            {/* Status Toggle */}
                            <div style={{ marginBottom: '16px' }}>
                              <label style={{ color: '#334155', fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Status</label>
                              <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                  onClick={() => toggleStatus(item.id, 'PUBLISHED')}
                                  style={{
                                    flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700,
                                    border: isActive ? '2px solid #10b981' : '1px solid #cbd5e1',
                                    background: isActive ? '#dcfce7' : '#fff',
                                    color: isActive ? '#166534' : '#475569'
                                  }}
                                >
                                  Active
                                </button>
                                <button
                                  onClick={() => toggleStatus(item.id, 'DRAFT')}
                                  style={{
                                    flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700,
                                    border: !isActive ? '2px solid #ef4444' : '1px solid #cbd5e1',
                                    background: !isActive ? '#fee2e2' : '#fff',
                                    color: !isActive ? '#b91c1c' : '#475569'
                                  }}
                                >
                                  Inactive
                                </button>
                              </div>
                            </div>

                            {/* Date Range picker */}
                            <div style={{ marginBottom: '16px', flex: 1 }}>
                              <label style={{ color: '#334155', fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Temporary Block Dates</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                <input
                                  type="date"
                                  style={{ flex: 1, minWidth: 0, padding: '10px 4px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', width: '100%' }}
                                  min={new Date().toISOString().split('T')[0]}
                                  onChange={(e) => setDateRanges(prev => ({ ...prev, [item.id]: { from: e.target.value, to: dateRanges[item.id]?.to || blockTo } }))}
                                  value={(dateRanges[item.id]?.from ?? blockFrom) || ''}
                                />
                                <span style={{ color: '#64748b', fontSize: '1rem' }}>→</span>
                                <input
                                  type="date"
                                  style={{ flex: 1, minWidth: 0, padding: '10px 4px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', width: '100%' }}
                                  min={(dateRanges[item.id]?.from || blockFrom) || new Date().toISOString().split('T')[0]}
                                  onChange={(e) => setDateRanges(prev => ({ ...prev, [item.id]: { from: (dateRanges[item.id]?.from ?? blockFrom) || '', to: e.target.value } }))}
                                  value={(dateRanges[item.id]?.to ?? blockTo) || ''}
                                />
                              </div>
                              <small style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', marginTop: '6px' }}>
                                Product will be hidden from customers during these dates and auto-activate after the end date.
                              </small>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #eef2f7', paddingTop: '16px' }}>
                              <button
                                onClick={() => saveAvailability(item.id, (dateRanges[item.id]?.from ?? blockFrom) || '', (dateRanges[item.id]?.to ?? blockTo) || '')}
                                disabled={savingId === item.id}
                                style={{
                                  flex: 1, padding: '10px 16px', borderRadius: '10px', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.85rem',
                                  background: 'var(--brand-gradient)', color: '#fff', opacity: savingId === item.id ? 0.6 : 1
                                }}
                              >
                                {savingId === item.id ? 'Saving...' : 'Save Dates'}
                              </button>
                              {(block || dateRanges[item.id]?.from) && (
                                <button
                                  onClick={() => clearAvailability(item.id)}
                                  style={{ padding: '10px 16px', borderRadius: '10px', fontWeight: 700, border: '1px solid #cbd5e1', cursor: 'pointer', fontSize: '0.85rem', background: '#fff', color: '#475569' }}
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </div>
          </div>
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
                      <span style={{ fontWeight: 600, color: '#334155' }}>{item.price}</span>
                      <span>•</span>
                      <span>ID: {item.id.startsWith('TN') ? item.id : 'TN' + item.id.replace(/-/g, '').substring(0, 8).toUpperCase()}</span>
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
                    <button onClick={() => router.push(`/supplier/listings/create?id=${item.editUrlId || item.id}`)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit Listing">
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

        {activeTab === 'BOOKINGS' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Customer Bookings</h1>
                <p style={{ color: '#64748b', margin: 0 }}>Manage your tour reservations and customers.</p>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              {loadingBookings ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                  Loading bookings...
                </div>
              ) : supplierBookings.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                  No bookings found yet. Keep sharing your tours!
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Customer & Option</th>
                      <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Date & Time</th>
                      <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Payment / Guests</th>
                      <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierBookings.map((b, idx) => (
                      <tr key={b.id} style={{ borderBottom: idx < supplierBookings.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{b.traveler_details?.lead_name || 'Guest'}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{b.traveler_details?.lead_email}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{b.traveler_details?.lead_phone}</div>
                          {b.traveler_details?.special_requirements && (
                            <div style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '4px', background: '#fef3c7', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                              Note: {b.traveler_details.special_requirements}
                            </div>
                          )}
                          {(b.traveler_details?.pickup_time || b.traveler_details?.pickup_location) && (
                            <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '6px' }}>
                              <div style={{ fontWeight: 600 }}>Pickup Details:</div>
                              {b.traveler_details?.pickup_time && <div>Time: {b.traveler_details.pickup_time}</div>}
                              {b.traveler_details?.pickup_location && <div>Location: {b.traveler_details.pickup_location}</div>}
                              {b.traveler_details?.dropoff_location && b.traveler_details.dropoff_location !== b.traveler_details.pickup_location && <div>Drop-off: {b.traveler_details.dropoff_location}</div>}
                            </div>
                          )}
                          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px', fontWeight: 600 }}>Tour: {b.traveler_details?.tour_name || b.listing_title || 'N/A'}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>Vehicle: {b.option_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', marginTop: '2px' }}>Ref: {b.booking_reference}</div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
                            {new Date(b.slot_start_time).toLocaleDateString()}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {new Date(b.slot_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>${b.gross_amount} {b.currency}</div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.total_travelers} Traveler(s)</span>
                            <span className={b.payment_status === 'RESERVED' ? 'badge-info' : 'badge-emerald'} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>{b.payment_status || 'PAID'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          {b.status === 'CONFIRMED' ? (
                            <span className="badge-emerald">Confirmed</span>
                          ) : b.status === 'PENDING_SUPPLIER_APPROVAL' ? (
                            <span className="badge-warning">Pending Approval</span>
                          ) : b.status === 'CANCELLED' ? (
                            <span className="badge-error">Cancelled</span>
                          ) : b.status === 'CANCELLED_REFUND_PENDING' ? (
                            <span className="badge-error">Cancelled (Refund Pending)</span>
                          ) : b.status === 'REJECTED' ? (
                            <span className="badge-error">Rejected</span>
                          ) : (
                            <span className="badge-secondary">{b.status}</span>
                          )}
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          {b.status === 'PENDING_SUPPLIER_APPROVAL' && (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={async () => {
                                  if (!confirm('Approve this booking?')) return;
                                  const res = await fetch('/api/supplier/bookings/update', { 
                                    method: 'POST', 
                                    headers: { 'Content-Type': 'application/json' }, 
                                    body: JSON.stringify({ bookingId: b.id, status: 'CONFIRMED', supplierId: user?.id }) 
                                  });
                                  if (res.ok) {
                                    setSupplierBookings(prev => prev.map(book => book.id === b.id ? { ...book, status: 'CONFIRMED' } : book));
                                  } else {
                                    alert('Failed to approve booking.');
                                  }
                                }}
                                className="btn-primary" 
                                style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px' }}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={async () => {
                                  if (!confirm('Reject this booking?')) return;
                                  const res = await fetch('/api/supplier/bookings/update', { 
                                    method: 'POST', 
                                    headers: { 'Content-Type': 'application/json' }, 
                                    body: JSON.stringify({ bookingId: b.id, status: 'REJECTED', supplierId: user?.id }) 
                                  });
                                  if (res.ok) {
                                    setSupplierBookings(prev => prev.map(book => book.id === b.id ? { ...book, status: 'REJECTED' } : book));
                                  } else {
                                    alert('Failed to reject booking.');
                                  }
                                }}
                                style={{ padding: '6px 12px', borderRadius: '6px', background: '#fee2e2', color: '#991b1b', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>Delete Listing?</h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete this listing? This action cannot be undone and it will be removed for customers immediately.
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
                    const res = await fetch('/api/supplier/listings/delete', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId: user?.id, productId: deleteConfirmId })
                    });
                    if (res.ok) {
                      setListings(prev => prev.filter(l => l.id !== deleteConfirmId));
                      setDeleteConfirmId(null);
                    } else {
                      const data = await res.json();
                      alert('Error: ' + data.error);
                    }
                  } catch (err) {
                    alert('Network error deleting listing');
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

      {/* Payout Details Modal */}
      {selectedPayout && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Payout Details A-Z</h2>
              <button onClick={() => setSelectedPayout(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <EyeOff size={24} color="#64748b" />
              </button>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Payment ID:</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{selectedPayout.paymentId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Date:</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{selectedPayout.dateStr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Status:</span>
                <span style={{ fontWeight: 800, color: selectedPayout.status === 'Completed' ? '#166534' : '#92400e' }}>{selectedPayout.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Total Payout:</span>
                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem' }}>${selectedPayout.amount.toFixed(2)} USD</span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Included Bookings</h3>
            {selectedPayout.bookings.map((b: any, idx: number) => (
              <div key={idx} style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>Ref: {b.booking_reference}</span>
                  <span style={{ fontWeight: 800, color: '#059669' }}>${Number(b.supplier_payout || 0).toFixed(2)}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Booked on {new Date(b.created_at || b.slot_start_time).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
