'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function getAdminDashboardStats() {
  const { data: users } = await supabaseAdmin.from('profiles').select('id, role', { count: 'exact' });
  const { data: bookings } = await supabaseAdmin.from('bookings').select('id, status, gross_amount, currency', { count: 'exact' });
  const { data: kyc } = await supabaseAdmin.from('supplier_kyc_records').select('id', { count: 'exact' }).eq('status', 'PENDING');

  let revenue = 0;
  if (bookings) {
    bookings.forEach(b => {
      if (b.status !== 'CANCELLED') revenue += Number(b.gross_amount || 0);
    });
  }

  return {
    revenue,
    activeBookings: bookings?.length || 0,
    registeredUsers: users?.length || 0,
    pendingVerifications: kyc?.length || 0,
    revenueChange: 5.2, // mock trending
    bookingsChange: 3.1, // mock trending
    usersChange: 12.4 // mock trending
  };
}

export async function getAdminUsers() {
  const { data } = await supabaseAdmin.from('profiles').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getAdminSuppliers() {
  // Fetch profiles with role SUPPLIER and join with kyc records
  const { data: profiles } = await supabaseAdmin.from('profiles').select('*').eq('role', 'SUPPLIER');
  const { data: kyc } = await supabaseAdmin.from('supplier_kyc_records').select('*');
  
  if (!profiles) return [];
  
  return profiles.map(p => {
    const record = kyc?.find(k => k.user_id === p.id);
    return {
      ...p,
      kyc: record || null
    };
  });
}

export async function getAdminListings() {
  const { data } = await supabaseAdmin.from('listings').select('*, profiles(name, email)').order('created_at', { ascending: false });
  return data || [];
}

export async function getAdminBookings() {
  const { data } = await supabaseAdmin.from('bookings').select('*, profiles(name, email), listings(title)').order('created_at', { ascending: false });
  return data || [];
}
