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

    // Update status to EDIT_PERMISSION_GRANTED
    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({ status: 'EDIT_PERMISSION_GRANTED' })
      .eq('id', productId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error granting edit permission:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
