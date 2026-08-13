import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, reason } = body;

    if (!productId || !reason) {
      return NextResponse.json({ error: 'Missing parameters (productId, reason)' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

    // Fetch current logistics first to preserve it
    const { data: currentProduct, error: fetchErr } = await supabaseAdmin
      .from('products')
      .select('logistics')
      .eq('id', productId)
      .single();

    if (fetchErr) throw fetchErr;

    const updatedLogistics = currentProduct.logistics || {};
    updatedLogistics.admin_feedback = reason;

    // Update listing status to REJECTED and store feedback
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ 
        status: 'REJECTED', 
        logistics: updatedLogistics,
        updated_at: new Date().toISOString() 
      })
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
      type: 'REJECTED',
      title: 'Listing Update Required',
      message: `Your listing "${product.basic_info?.title || 'Draft'}" was rejected. Reason: ${reason}`
    });

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error: any) {
    console.error('Reject error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
