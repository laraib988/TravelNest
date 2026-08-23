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

    const { data: draftData, error: draftErr } = await supabaseAdmin
      .from('products').select('id, supplier_id, status, logistics, basic_info, transport_pricing, created_at, updated_at')
      .eq('id', productId)
      .single();

    if (draftErr || !draftData) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const parentId = draftData.logistics?.parent_id;
    let finalProduct = draftData;

    if (parentId) {
      // It's an edit clone. Update the original parent product with draft's data and delete the clone.
      const { id, created_at, supplier_id, ...updateFields } = draftData;
      updateFields.status = 'PUBLISHED';
      updateFields.updated_at = new Date().toISOString();

      // Remove parent_id from logistics so it doesn't linger
      if (updateFields.logistics) {
        delete updateFields.logistics.parent_id;
      }

      const { data: updatedParent, error: updateErr } = await supabaseAdmin
        .from('products')
        .update(updateFields)
        .eq('id', parentId)
        .select()
        .single();
      
      if (updateErr) throw updateErr;
      finalProduct = updatedParent;

      // Delete the temporary clone
      await supabaseAdmin.from('products').delete().eq('id', productId);
    } else {
      // It's a brand new product. Just publish it directly.
      const { data: publishedDraft, error: pubErr } = await supabaseAdmin
        .from('products')
        .update({ status: 'PUBLISHED', updated_at: new Date().toISOString() })
        .eq('id', productId)
        .select()
        .single();
        
      if (pubErr) throw pubErr;
      finalProduct = publishedDraft;
    }

    // Notify Supplier
    await supabaseAdmin.from('notifications').insert({
      user_id: finalProduct.supplier_id,
      type: 'SUCCESS',
      title: 'Listing Approved!',
      message: `Congratulations! Your listing "${finalProduct.basic_info?.title || 'Draft'}" has been approved and is now live.`
    });

    return NextResponse.json({ success: true, data: finalProduct }, { status: 200 });
  } catch (error: any) {
    console.error('Approve error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
