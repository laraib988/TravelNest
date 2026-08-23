import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

// Read the auth token from the Authorization header, resolve the user, then
// operate on their profile via the service-role client (bypasses RLS).
async function resolveUser(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;

  const authClient = createClient(supabaseUrl, supabaseServiceKey);
  const { data: userData } = await authClient.auth.getUser(token);
  return userData?.user || null;
}

export async function GET(request: Request) {
  try {
    const user = await resolveUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await admin
      .from('profiles')
      .select('id, full_name, email, role, avatar_url, created_at, updated_at, phone, bio')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      profile: data || {
        id: user.id,
        name: user.user_metadata?.name || '',
        email: user.email || '',
        avatar: user.user_metadata?.avatar || '',
        role: user.user_metadata?.role || 'CUSTOMER',
        phone: '',
        country: '',
        loyalty_points: 0,
        saved_travelers: [],
      },
    });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await resolveUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const update: any = {};
    if (body.name !== undefined) update.name = body.name;
    if (body.phone !== undefined) update.phone = body.phone;
    if (body.country !== undefined) update.country = body.country;
    if (body.avatar !== undefined) update.avatar = body.avatar;
    if (body.saved_travelers !== undefined) update.saved_travelers = body.saved_travelers;
    // loyalty_points is only ever incremented via the credit endpoint, never via PATCH.

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: existing, error: fetchError } = await admin
      .from('profiles')
      .select('id, full_name, email, role, avatar_url, created_at, updated_at, phone, bio')
      .eq('id', user.id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      const { data, error } = await admin
        .from('profiles')
        .update({ ...update, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .maybeSingle();
      if (error) throw error;
      return NextResponse.json({ profile: data });
    } else {
      const { data, error } = await admin
        .from('profiles')
        .insert({
          id: user.id,
          name: update.name ?? user.user_metadata?.name ?? '',
          email: user.email || '',
          role: user.user_metadata?.role || 'CUSTOMER',
          avatar: user.user_metadata?.avatar || '',
          ...update,
        })
        .select()
        .maybeSingle();
      if (error) throw error;
      return NextResponse.json({ profile: data });
    }
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}