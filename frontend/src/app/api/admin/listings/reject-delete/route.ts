import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

    // Revert status to PUBLISHED
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ status: 'PUBLISHED', updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select();

    if (error) throw error;

    if (data && data.length > 0) {
      const product = data[0];
      await supabaseAdmin.from('notifications').insert({
        user_id: product.supplier_id,
        type: 'REJECTED',
        title: 'Deletion Rejected',
        message: `Admin rejected your request to delete "${product.basic_info?.title || 'Listing'}". The product remains Live.`
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Reject Delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
