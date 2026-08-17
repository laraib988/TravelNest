import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const getSupabaseAdmin = () => createClient(supabaseUrl, supabaseServiceKey);

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { supplierId, productId, action, status, availabilityDates } = body;

    if (!supplierId || !productId) {
      return NextResponse.json(
        { error: 'supplierId and productId are required' },
        { status: 400 }
      );
    }

    // Fetch existing product to preserve logistics data and verify ownership
    const supabaseAdmin = getSupabaseAdmin();
    const { data: existingProduct, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('logistics, status')
      .eq('id', productId)
      .eq('supplier_id', supplierId)
      .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { error: fetchError?.message || 'Product not found' },
        { status: 500 }
      );
    }

    const existingLogistics = existingProduct.logistics || {};

    // Determine what to update
    let newStatus = existingProduct.status;
    let newLogistics = { ...existingLogistics };

    if (action === 'ACTIVATE') {
      // Activate permanently: visible to customers, clear any temporary block
      newStatus = 'PUBLISHED';
      delete newLogistics.availability_block;
    } else if (action === 'DEACTIVATE') {
      // Deactivate permanently: hidden from customers, clear any temporary block
      newStatus = 'DRAFT';
      delete newLogistics.availability_block;
    } else if (availabilityDates && availabilityDates.from && availabilityDates.to) {
      // Set a temporary unavailability window. Product stays PUBLISHED but is
      // hidden from customers during the range, then auto-reactivates after `to`.
      newStatus = 'PUBLISHED';
      newLogistics.availability_block = {
        from: availabilityDates.from,
        to: availabilityDates.to,
      };
    } else if (status) {
      // Simple status update fallback
      newStatus = status === 'PUBLISHED' || status === 'APPROVED' ? 'PUBLISHED' : 'DRAFT';
    }

    const { error: updateError } = await getSupabaseAdmin()
      .from('products')
      .update({
        status: newStatus,
        logistics: newLogistics,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)
      .eq('supplier_id', supplierId);

    if (updateError) {
      console.error('Error updating product availability:', updateError);
      return NextResponse.json(
        { error: updateError.message || 'Failed to update product availability' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      availability_block: newLogistics.availability_block || null,
    });
  } catch (error) {
    console.error('Error in availability API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}