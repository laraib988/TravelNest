import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const admin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: profile } = await admin.from('profiles').select('*').eq('id', user.id).single();

    const history = [];

    if (profile) {
      history.push({
        id: \signup-\\,
        type: 'EARNED',
        amount: 50,
        description: 'Account Signup Bonus',
        created_at: profile.created_at
      });
    }

    // Also get bookings where customer_id = user.id OR email matches
    const [ { data: byId }, { data: byEmail } ] = await Promise.all([
      admin.from('bookings').select('id, created_at, traveler_details').eq('customer_id', user.id),
      admin.from('bookings').select('id, created_at, traveler_details').eq('traveler_details->>lead_email', user.email)
    ]);

    const bookingMap = new Map();
    [...(byId || []), ...(byEmail || [])].forEach((b: any) => bookingMap.set(b.id, b));
    let bookings = Array.from(bookingMap.values());

    if (bookings) {
      for (const b of bookings) {
        history.push({
          id: \ooking-\\,
          type: 'EARNED',
          amount: 100,
          description: \Reward for booking: \\,
          created_at: b.created_at
        });
      }
    }

    history.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ history });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
