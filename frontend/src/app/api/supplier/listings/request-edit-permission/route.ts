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

    // Get current listing
    const { data: listing, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('status, logistics')
      .eq('id', productId)
      .single();

    if (fetchError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const previousStatus = listing.status;
    const logistics = listing.logistics || {};

    // Update status to PENDING_EDIT_PERMISSION and save previous_status
    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({ 
        status: 'PENDING_EDIT_PERMISSION',
        logistics: { ...logistics, previous_status: previousStatus }
      })
      .eq('id', productId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error requesting edit permission:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
