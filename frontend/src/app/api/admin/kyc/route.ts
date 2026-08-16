import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Missing Supabase keys.' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: kycData, error: kycError } = await supabaseAdmin
      .from('supplier_kyc_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (kycError) {
      return NextResponse.json({ error: kycError.message }, { status: 400 });
    }

    const { data: bankData, error: bankError } = await supabaseAdmin
      .from('supplier_bank_accounts')
      .select('*');

    if (bankError) {
      // Just log it, don't fail the whole request
      console.error('Failed to fetch bank accounts:', bankError);
    }

    const records = (kycData || []).map((record) => {
      const bankAccounts = (bankData || []).filter(b => b.supplier_id === record.user_id);
      return {
        ...record,
        bankAccounts
      };
    });

    return NextResponse.json(records, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
