import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

    // Update listing status to PENDING_DELETION
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ status: 'PENDING_DELETION', updated_at: new Date().toISOString() })
      .eq('id', productId)
      .eq('supplier_id', userId)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error('Request Delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
