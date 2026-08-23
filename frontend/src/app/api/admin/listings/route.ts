import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

    const { data: products, error } = await supabaseAdmin
      .from('products').select('id, supplier_id, status, updated_at, logistics, basic_info, transport_pricing')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    const mappedListings = products.map(p => {
      let minPriceAmount = 0;
      let calculatedDurationMinutes = 180;

      if (p.transport_pricing && p.transport_pricing.length > 0) {
        const minOption = p.transport_pricing.reduce((min: any, current: any) => {
          return parseFloat(current.amount || '0') < parseFloat(min.amount || '0') ? current : min;
        });
        minPriceAmount = parseFloat(minOption.amount || '0');

        if (minOption.duration) {
          const lowerDuration = minOption.duration.toLowerCase();
          const match = lowerDuration.match(/(\d+)\s*(hour|day)/);
          if (match) {
             const num = parseInt(match[1]);
             if (match[2] === 'hour') {
               calculatedDurationMinutes = num * 60;
             } else if (match[2] === 'day') {
               calculatedDurationMinutes = num * 24 * 60;
             }
          }
        }
      }

      const validHeroImage = p.basic_info?.photos?.heroImage?.startsWith('blob:') 
          ? null 
          : p.basic_info?.photos?.heroImage;

      return {
        id: p.id,
        supplier_id: p.supplier_id,
        destination_id: 'dest-unknown',
        category_id: 'cat-unknown',
        category_name: p.basic_info?.category || 'Uncategorized',
        title: p.basic_info?.title || 'Draft Listing',
        slug: p.id,
        summary: p.basic_info?.shortDescription || '',
        base_price: minPriceAmount,
        currency: 'USD',
        duration_minutes: calculatedDurationMinutes,
        cached_rating_avg: 0,
        cached_review_count: 0,
        merchandising_badges: [],
        images: validHeroImage ? [{ url: validHeroImage, alt: 'Hero' }] : [],
        confirmation_type: 'INSTANT',
        status: p.status,
        raw_data: p
      };
    });

    return NextResponse.json(mappedListings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
