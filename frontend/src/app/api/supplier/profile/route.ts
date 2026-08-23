import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

    const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).single();
    const { data: kyc } = await supabaseAdmin.from('supplier_kyc_records').select('*').eq('user_id', userId).maybeSingle();

    return NextResponse.json({ profile, kyc }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, formData, profileData, kycData } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

    if (profileData) {
      await supabaseAdmin.from('profiles').update({
        name: formData.name,
        avatar: formData.avatar
      }).eq('id', userId);
    }
    
    if (kycData?.id) {
      await supabaseAdmin.from('supplier_kyc_records').update({
        company_name: formData.company_name,
        phone: formData.phone,
        location: formData.location,
        currency: formData.currency,
        tax_id: formData.tax_id,
        business_reg: formData.business_reg
      }).eq('id', kycData.id);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
