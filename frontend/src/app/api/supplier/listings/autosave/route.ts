import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId, step, basic_info, photos, experience_details, transport_pricing, logistics, itinerary } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

    if (productId) {
      // Fetch current status
      const { data: currentProduct, error: fetchErr } = await supabaseAdmin
        .from('products')
        .select('status, logistics')
        .eq('id', productId)
        .eq('supplier_id', userId)
        .single();
        
      if (fetchErr) throw fetchErr;

      if (currentProduct.status === 'PUBLISHED' || currentProduct.status === 'APPROVED') {
        // Create a new clone draft for the edits, pointing to the original
        const updatedLogistics = logistics || {};
        updatedLogistics.parent_id = productId; // Store reference to original
        
        const { data, error } = await supabaseAdmin
          .from('products')
          .insert({
            supplier_id: userId,
            status: 'DRAFT',
            current_step: step || 1,
            basic_info: { ...(basic_info || {}), photos: photos || {} },
            experience_details: experience_details || {},
            transport_pricing: transport_pricing || [],
            logistics: updatedLogistics,
            itinerary: itinerary || []
          })
          .select()
          .single();

        if (error) throw error;
        return NextResponse.json({ success: true, data, cloned: true }, { status: 201 });
      }

      // Otherwise, update existing draft/pending
      const updatedLogistics = logistics || {};
      if (currentProduct.logistics?.parent_id) {
        updatedLogistics.parent_id = currentProduct.logistics.parent_id;
      }

      const { data, error } = await supabaseAdmin
        .from('products')
        .update({
          current_step: step,
          basic_info: { ...(basic_info || {}), photos: photos || {} },
          experience_details: experience_details || {},
          transport_pricing: transport_pricing || [],
          logistics: updatedLogistics,
          itinerary: itinerary || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .eq('supplier_id', userId)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    // Create new draft
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert({
          supplier_id: userId,
          status: 'DRAFT',
          current_step: step || 1,
          basic_info: { ...(basic_info || {}), photos: photos || {} },
          experience_details: experience_details || {},
          transport_pricing: transport_pricing || [],
          logistics: logistics || {},
          itinerary: itinerary || []
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Autosave error details:', error);
    return NextResponse.json({ 
      error: error.message || 'Database error occurred',
      details: error.details || error.hint || 'No additional details' 
    }, { status: 500 });
  }
}
