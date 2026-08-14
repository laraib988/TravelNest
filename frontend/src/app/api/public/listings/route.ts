import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json([], { status: 200 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabaseAdmin
      .from('products')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('updated_at', { ascending: false });

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching public listings from Supabase:', error);
      return NextResponse.json([], { status: 200 });
    }

    let filteredProducts = products;
    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredProducts = products.filter(p => {
        const titleMatch = p.basic_info?.title?.toLowerCase().includes(lowerSearch);
        const descMatch = p.basic_info?.shortDescription?.toLowerCase().includes(lowerSearch);
        return titleMatch || descMatch;
      });
    }

    const mappedListings = filteredProducts.map(p => {
      const title = p.basic_info?.title || 'Beautiful Tour Experience';
      const slugifiedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return {
        id: p.id,
        title,
        images: [
          { url: p.basic_info?.photos?.heroImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', alt: title }
        ],
        price: p.transport_pricing?.[0]?.amount || 150,
        base_price: p.transport_pricing?.[0]?.amount || 150,
        currency: 'USD',
        cached_rating_avg: 5.0,
        cached_review_count: 0,
        duration_minutes: 120,
        merchandising_badges: ['NEW'],
        slug: `${slugifiedTitle}-${p.id}`,
        destination_id: 'dest-global',
        category_name: 'Adventures'
      };
    });

    return NextResponse.json(mappedListings, { status: 200 });
  } catch (error: any) {
    console.error('Supabase fetch error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
