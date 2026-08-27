import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey);
    const { data } = await admin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    return NextResponse.json({ exists: !!data });
  } catch (error: any) {
    console.error('Check user error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
