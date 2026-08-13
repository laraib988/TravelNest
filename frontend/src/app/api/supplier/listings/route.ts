import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('supplier_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    const mappedListings = products.map(p => ({
      id: p.id,
      title: p.basic_info?.title || 'Draft Listing',
      image: p.basic_info?.photos?.heroImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      price: `$${p.transport_pricing?.[0]?.amount || 0}`,
      status: p.status,
      lastUpdated: new Date(p.updated_at).toLocaleDateString(),
      admin_feedback: p.logistics?.admin_feedback || null
    }));

    return NextResponse.json(mappedListings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
