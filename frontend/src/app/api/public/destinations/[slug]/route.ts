import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    const { data: destination, error } = await supabase
      .from('destinations')
      .select('*')
      .ilike('slug', slug)
      .single();

    if (error || !destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    if (!destination.is_published) {
      return NextResponse.json({ error: 'Destination is still a draft and not published yet' }, { status: 403 });
    }

    // Also fetch related products/tours for this destination
    let relatedProducts: any[] = [];
    try {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'PUBLISHED')
        .order('created_at', { ascending: false })
        .limit(8);

      // Filter products whose basic_info destination matches this destination
      if (products) {
        relatedProducts = products.filter((p: any) => {
          const dest = p.basic_info?.destination || p.basic_info?.city || '';
          return dest.toLowerCase().includes(destination.name.toLowerCase()) ||
                 dest.toLowerCase().includes(destination.slug.toLowerCase());
        });
      }
    } catch (e) {
      // Products table might not exist
    }

    return NextResponse.json({ destination, relatedProducts });
  } catch (error: any) {
    console.error('Error fetching destination:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
