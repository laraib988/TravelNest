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

    // Update status to PENDING_APPROVAL
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ status: 'PENDING_APPROVAL', updated_at: new Date().toISOString() })
      .eq('id', productId)
      .eq('supplier_id', userId)
      .select();

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = data[0];

    // Create notification for supplier
    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      type: 'INFO',
      title: 'Listing Under Review',
      message: `Your listing "${product.basic_info?.title || 'Draft'}" has been submitted and is pending admin approval.`
    });

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error: any) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
