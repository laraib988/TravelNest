import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get current listing to retrieve previous_status
    const { data: listing, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('logistics')
      .eq('id', productId)
      .single();

    if (fetchError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const logistics = listing.logistics || {};
    const previousStatus = logistics.previous_status || 'PUBLISHED';

    // Update status back to previousStatus
    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({ status: previousStatus })
      .eq('id', productId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, newStatus: previousStatus }, { status: 200 });
  } catch (error: any) {
    console.error('Error rejecting edit permission:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
