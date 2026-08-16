import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Missing Supabase keys' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();
    const { supplierId, accountId } = body;

    if (!supplierId || !accountId) {
      return NextResponse.json({ error: 'Supplier ID and Account ID are required.' }, { status: 400 });
    }

    // Unset primary on all accounts for this supplier
    await supabase
      .from('supplier_bank_accounts')
      .update({ is_primary: false })
      .eq('supplier_id', supplierId);

    // Set primary on the selected account
    const { error } = await supabase
      .from('supplier_bank_accounts')
      .update({ is_primary: true })
      .eq('id', accountId)
      .eq('supplier_id', supplierId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
