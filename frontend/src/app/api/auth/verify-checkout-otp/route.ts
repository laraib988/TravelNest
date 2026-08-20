import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const admin = () => createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SIGNUP_BONUS_POINTS = 50; // loyalty bonus for auto-created customers

function generateTempPassword(): string {
  // Strong random temp password, e.g. TN-XXXXXX
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let random = '';
  const arr = new Uint32Array(6);
  crypto.getRandomValues(arr);
  for (let i = 0; i < arr.length; i++) {
    random += chars[arr[i] % chars.length];
  }
  return `TN-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    const otp = String(body.otp || '').trim();
    const fullName = String(body.full_name || '').trim();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: 'Verification code must be 6 digits' }, { status: 400 });
    }

    const client = admin();

    let verification: any = null;

    // 1) Validate the OTP against the stored record.
    const { data: fetchVerif, error: fetchError } = await client
      .from('email_verifications')
      .select('*')
      .eq('email', email)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: 'Could not verify code' }, { status: 500 });
    }
    if (!fetchVerif) {
      return NextResponse.json({ error: 'No pending verification for this email' }, { status: 400 });
    }
    if (new Date(fetchVerif.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: 'This code has expired. Please request a new one.' }, { status: 400 });
    }
    if (fetchVerif.otp_code !== otp) {
      return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });
    }
    
    verification = fetchVerif;

    // Mark this verification as used.
    if (verification) {
      await client
        .from('email_verifications')
        .update({ verified: true })
        .eq('id', verification.id);
    }

    // 2) Check whether a Supabase auth user already exists.
    const { data: existing } = await client.auth.admin.listUsers();
    const existingUser = (existing?.users || []).find(
      (u) => (u.email || '').toLowerCase() === email
    );

    let userId: string;
    let accountCreated = false;
    let temporaryPassword = '';

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // 3) Auto-create the account with a random temporary password.
      temporaryPassword = generateTempPassword();
      const { data: created, error: createError } = await client.auth.admin.createUser({
        email,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: { name: fullName, role: 'CUSTOMER' },
      });

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 400 });
      }
      userId = created.user.id;
      accountCreated = true;

      // 4) Create profile with a signup loyalty bonus.
      const { error: profileError } = await client.from('profiles').insert({
        id: userId,
        email,
        name: fullName || 'Traveler',
        role: 'CUSTOMER',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        loyalty_points: SIGNUP_BONUS_POINTS,
        phone: '',
        country: '',
        saved_travelers: [],
      });

      if (profileError) {
        console.error('Failed to create profile for auto-created user:', profileError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified',
      user_id: userId,
      account_created: accountCreated,
      new_account: accountCreated,
      credentials: accountCreated
        ? { email, temporary_password: temporaryPassword, login_url: `${process.env.APP_URL || 'http://localhost:3000'}/login` }
        : undefined,
      loyalty_bonus: accountCreated ? SIGNUP_BONUS_POINTS : 0,
    });
  } catch (error: any) {
    console.error('verify-checkout-otp error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}