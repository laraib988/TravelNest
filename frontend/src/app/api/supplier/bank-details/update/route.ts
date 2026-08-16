import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Missing Supabase keys' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();
    const { supplierId, bankDetails, isPrimary } = body;

    if (!supplierId || !bankDetails) {
      return NextResponse.json({ error: 'Supplier ID and bank details are required.' }, { status: 400 });
    }

    // If this is set to primary, we need to unset primary on all other accounts first
    if (isPrimary) {
      await supabase
        .from('supplier_bank_accounts')
        .update({ is_primary: false })
        .eq('supplier_id', supplierId);
    }

    // Insert into supplier_bank_accounts table
    const { error } = await supabase
      .from('supplier_bank_accounts')
      .insert({
        supplier_id: supplierId,
        bank_account_holder: bankDetails.account_holder,
        bank_name: bankDetails.bank_name,
        bank_account_number: bankDetails.account_number,
        bank_routing_number: bankDetails.routing_number,
        bank_country: bankDetails.country,
        bank_currency: bankDetails.currency,
        is_primary: isPrimary
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
