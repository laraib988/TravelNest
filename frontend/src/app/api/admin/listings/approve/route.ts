import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ status: 'PUBLISHED', updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = data[0];

    // Notify Supplier
    await supabaseAdmin.from('notifications').insert({
      user_id: product.supplier_id,
      type: 'SUCCESS',
      title: 'Listing Approved!',
      message: `Congratulations! Your listing "${product.basic_info?.title || 'Draft'}" has been approved and is now live.`
    });

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error: any) {
    console.error('Approve error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
