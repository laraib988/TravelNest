import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const admin = () => createClient(supabaseUrl, supabaseServiceKey);

const POINTS_PER_TOUR = 100;

async function resolveUser(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;
  const authClient = createClient(supabaseUrl, supabaseServiceKey);
  const { data: userData } = await authClient.auth.getUser(token);
  return userData?.user || null;
}

// POST /api/profile/loyalty/credit - credit points for a completed tour.
// body: { amount?: number } defaults to 100 per completed tour.
export async function POST(request: Request) {
  try {
    const user = await resolveUser(request);
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const amount = Number(body.amount) > 0 ? Number(body.amount) : POINTS_PER_TOUR;

    const client = admin();
    const { data: profile, error: fetchError } = await client
      .from('profiles')
      .select('id, loyalty_points')
      .eq('id', user.id)
      .maybeSingle();
    if (fetchError) throw fetchError;

    const current = profile?.loyalty_points || 0;

    if (profile) {
      const { data, error } = await client
        .from('profiles')
        .update({ loyalty_points: current + amount, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select('loyalty_points')
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, loyalty_points: data.loyalty_points, credited: amount });
    }

    // No profile yet — create one for the user.
    const { data: created, error: insertError } = await client
      .from('profiles')
      .insert({
        id: user.id,
        name: user.user_metadata?.name || '',
        email: user.email || '',
        role: user.user_metadata?.role || 'CUSTOMER',
        loyalty_points: amount,
      })
      .select('loyalty_points')
      .single();
    if (insertError) throw insertError;
    return NextResponse.json({ success: true, loyalty_points: created.loyalty_points, credited: amount });
  } catch (error: any) {
    console.error('Error crediting loyalty points:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}