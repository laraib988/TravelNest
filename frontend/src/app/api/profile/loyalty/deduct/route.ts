import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const admin = () => createClient(supabaseUrl, supabaseServiceKey);

async function resolveUser(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;
  const authClient = createClient(supabaseUrl, supabaseServiceKey);
  const { data: userData } = await authClient.auth.getUser(token);
  return userData?.user || null;
}

// POST /api/profile/loyalty/deduct - deduct redeemed points after checkout.
// body: { amount?: number }
export async function POST(request: Request) {
  try {
    const user = await resolveUser(request);
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const amount = Number(body.amount) > 0 ? Number(body.amount) : 0;
    if (amount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });

    const client = admin();
    const { data: profile, error: fetchError } = await client
      .from('profiles')
      .select('loyalty_points')
      .eq('id', user.id)
      .maybeSingle();
    if (fetchError) throw fetchError;

    const current = profile?.loyalty_points || 0;
    const remaining = Math.max(0, current - amount);

    const { data, error } = await client
      .from('profiles')
      .update({ loyalty_points: remaining, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select('loyalty_points')
      .single();
    if (error) throw error;

    return NextResponse.json({ success: true, loyalty_points: data.loyalty_points, deducted: amount });
  } catch (error: any) {
    console.error('Error deducting loyalty points:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}