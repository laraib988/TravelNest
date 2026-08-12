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
      // Update existing draft
      const { data, error } = await supabaseAdmin
        .from('products')
        .update({
          current_step: step,
          basic_info: { ...(basic_info || {}), photos: photos || {} },
          experience_details: experience_details || {},
          transport_pricing: transport_pricing || [],
          logistics: logistics || {},
          itinerary: itinerary || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .eq('supplier_id', userId)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data }, { status: 200 });

    } else {
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
    }
  } catch (error: any) {
    console.error('Autosave error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
