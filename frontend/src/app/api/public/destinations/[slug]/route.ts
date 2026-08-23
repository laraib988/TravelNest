import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    const { data: destination, error } = await getSupabase()
      .from('destinations')
      .select('*')
      .ilike('slug', slug)
      .maybeSingle();

    if (error || !destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    if (!destination.is_published) {
      return NextResponse.json({ error: 'Destination is still a draft and not published yet' }, { status: 403 });
    }

    // Extract hidden meta_data from faqs
    if (destination.faqs && Array.isArray(destination.faqs)) {
      const metaFaqIndex = destination.faqs.findIndex((f: any) => f.question === '__META_DATA__');
      if (metaFaqIndex !== -1) {
        try {
          destination.meta_data = JSON.parse(destination.faqs[metaFaqIndex].answer);
        } catch (e) {}
        destination.faqs = destination.faqs.filter((_: any, i: number) => i !== metaFaqIndex);
      }
    }

    // Also fetch related products/tours for this destination
    let relatedProducts: any[] = [];
    try {
      // Root cause fix for slow loading: only select small, necessary columns.
      // Avoids downloading massive base64 product image blobs from Supabase.
      const { data: products } = await getSupabase()
        .from('products')
        .select('*')
        .eq('status', 'PUBLISHED')
        .order('created_at', { ascending: false })
        .limit(20);

      // Filter products whose TITLE or destination matches this destination
      if (products) {
        // Match on any word from the destination name (case-insensitive)
        const nameWords = (destination.name || '')
          .toLowerCase()
          .split(/[\s\-()]+/)
          .filter((w: string) => w.length > 2);

        const destNameLower = destination.name.toLowerCase();
        const destSlugLower = destination.slug.toLowerCase();

        relatedProducts = products.filter((p: any) => {
          const title = (p.basic_info?.title || '').toLowerCase();
          const dest = (p.basic_info?.destination || p.basic_info?.city || '').toLowerCase();

          // Direct title match with destination name (e.g. "Mount Fuji" in product title)
          if (destNameLower && title.includes(destNameLower)) return true;
          if (destSlugLower && title.includes(destSlugLower)) return true;
          // Title matches any significant word of the destination name
          if (nameWords.some((w: string) => title.includes(w))) return true;
          // Destination/city field match
          if (dest.includes(destNameLower) || dest.includes(destSlugLower)) return true;

          return false;
        });
      }
    } catch (e) {
      // Products table might not exist or failed
    }

    return NextResponse.json({ destination, relatedProducts });
  } catch (error: any) {
    console.error('Error fetching destination:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
