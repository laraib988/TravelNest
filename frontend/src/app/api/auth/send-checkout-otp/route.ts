import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOtpEmail } from '@/lib/mailer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const admin = () => createClient(supabaseUrl, supabaseServiceKey);

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

function generateOtp(): string {
  // 6-digit numeric code, no leading-zero ambiguity issues
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS).toISOString();

    const client = admin();

    // Invalidate any previously issued codes for this email (single active code).
    await client
      .from('email_verifications')
      .update({ verified: true })
      .eq('email', email)
      .eq('verified', false);

    // Insert the new code.
    const { data, error } = await client
      .from('email_verifications')
      .insert({ email, otp_code: otp, expires_at: expiresAt, verified: false })
      .select()
      .single();

    if (error) {
      console.error('Failed to store OTP:', error.message);
      return NextResponse.json({ error: 'Could not store verification code' }, { status: 500 });
    }

    // Send the OTP email.
    const mailResult = await sendOtpEmail(email, otp);
    if (!mailResult.success) {
      console.warn('OTP email failed:', mailResult.error);
      return NextResponse.json(
        { error: `Email delivery failed: ${mailResult.error}. (Note: Free Resend accounts can only send to the verified owner email).` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      expires_at: data.expires_at,
    });
  } catch (error: any) {
    console.error('send-checkout-otp error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}