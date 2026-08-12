import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    const mappedListings = products.map(p => ({
      id: p.id,
      supplier_id: p.supplier_id,
      destination_id: 'dest-unknown',
      category_id: 'cat-unknown',
      category_name: p.basic_info?.category || 'Uncategorized',
      title: p.basic_info?.title || 'Draft Listing',
      slug: p.id,
      summary: p.basic_info?.shortDescription || '',
      base_price: p.transport_pricing?.[0]?.amount || 0,
      currency: 'USD',
      duration_minutes: 180,
      cached_rating_avg: 0,
      cached_review_count: 0,
      merchandising_badges: [],
      images: p.basic_info?.photos?.heroImage ? [{ url: p.basic_info.photos.heroImage, alt: 'Hero' }] : [],
      confirmation_type: 'INSTANT',
      status: p.status
    }));

    return NextResponse.json(mappedListings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
