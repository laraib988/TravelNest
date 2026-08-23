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
      return NextResponse.json([], { status: 200, headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabaseAdmin
      .from('products')
      .select('id, supplier_id, status, updated_at, logistics, basic_info, transport_pricing')
      .range(0, 49)
      .in('status', ['PUBLISHED', 'APPROVED'])
      .order('updated_at', { ascending: false });

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching public listings from Supabase:', error);
      return NextResponse.json([], { status: 200, headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } });
    }

    // Handle temporary availability blocks: auto-reactivate expired blocks and
    // exclude products that are currently inside a blocked date range.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeProducts: any[] = [];
    const reactivatePromises: any[] = [];
    
    for (const p of products) {
      const block = p.logistics?.availability_block;
      if (block && block.from && block.to) {
        const blockTo = new Date(block.to);
        blockTo.setHours(23, 59, 59, 999);
        if (blockTo < today) {
          // Block expired -> auto-reactivate in parallel
          reactivatePromises.push(
            supabaseAdmin
              .from('products')
              .update({
                logistics: { ...p.logistics, availability_block: null },
                updated_at: new Date().toISOString(),
              })
              .eq('id', p.id)
              .then(({ error }) => {
                if (error) console.error('Auto-reactivate failed:', error);
              })
          );
          activeProducts.push(p);
          continue;
        }
        const blockFrom = new Date(block.from);
        blockFrom.setHours(0, 0, 0, 0);
        if (blockFrom <= today && blockTo >= today) {
          // Currently inside the blocked window -> hide from customers
          continue;
        }
      }
      activeProducts.push(p);
    }
    
    if (reactivatePromises.length > 0) {
      await Promise.all(reactivatePromises);
    }

    let filteredProducts = activeProducts;
    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredProducts = products.filter(p => {
        const titleMatch = p.basic_info?.title?.toLowerCase().includes(lowerSearch);
        const descMatch = p.basic_info?.shortDescription?.toLowerCase().includes(lowerSearch);
        return titleMatch || descMatch;
      });
    }

    // Fetch real-time reviews for these products
    const productIds = filteredProducts.map(p => p.id);
    const { data: reviewsData } = await supabaseAdmin
      .from('reviews')
      .select('listing_id, rating')
      .in('listing_id', productIds)
      .eq('status', 'APPROVED');

    const reviewsMap: Record<string, { total: number, count: number }> = {};
    if (reviewsData) {
      for (const r of reviewsData) {
        if (!reviewsMap[r.listing_id]) reviewsMap[r.listing_id] = { total: 0, count: 0 };
        reviewsMap[r.listing_id].total += r.rating || 5;
        reviewsMap[r.listing_id].count += 1;
      }
    }

    const mappedListings = filteredProducts.map(p => {
      const title = p.basic_info?.title || 'Untitled Product';
      const slugifiedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      let minPrice = 0;
      let minPricingType = 'Per Person';
      if (p.transport_pricing && p.transport_pricing.length > 0) {
        const sorted = p.transport_pricing.slice().sort((a: any, b: any) => (Number(a.amount)||999999) - (Number(b.amount)||999999));
        minPrice = Number(sorted[0].amount) || 0;
        minPricingType = sorted[0].pricingType || 'Per Person';
      } else if (p.pricing && p.pricing.length > 0) {
        const sorted = p.pricing.slice().sort((a: any, b: any) => (Number(a.price) || Number(a.amount)||999999) - (Number(b.price) || Number(b.amount)||999999));
        minPrice = Number(sorted[0].price) || Number(sorted[0].amount) || 0;
        minPricingType = sorted[0].pricingType || 'Per Person';
      } else if (p.base_price) {
        minPrice = p.base_price;
      }

      let durationStr = '2 hours';
      if (p.transport_pricing && p.transport_pricing.length > 0) {
        const sorted = p.transport_pricing.slice().sort((a: any, b: any) => (Number(a.amount)||999999) - (Number(b.amount)||999999));
        durationStr = sorted[0].duration || '2 hours';
      } else if (p.pricing && p.pricing.length > 0) {
        const sorted = p.pricing.slice().sort((a: any, b: any) => (Number(a.price) || Number(a.amount)||999999) - (Number(b.price) || Number(b.amount)||999999));
        durationStr = sorted[0].duration || '2 hours';
      }

      const productReviews = reviewsMap[p.id];
      const cachedReviewCount = productReviews?.count || 0;
      const cachedRatingAvg = cachedReviewCount > 0 ? Number((productReviews.total / productReviews.count).toFixed(1)) : 0;

      return {
        id: p.id,
        duration: durationStr,
        title,
        images: [
          { url: p.basic_info?.photos?.heroImage || 'https://placehold.co/600x400?text=No+Image', alt: title }
        ],
        price: minPrice,
        base_price: minPrice,
        pricing_type: minPricingType,
        currency: 'USD',
        cached_rating_avg: cachedRatingAvg,
        cached_review_count: cachedReviewCount,
        duration_minutes: p.basic_info?.durationMinutes || 120,
        merchandising_badges: p.merchandising_badges || ['NEW'],
        slug: p.slug || `${slugifiedTitle}-${p.id}`,
        destination_id: p.destination_id || 'dest-global',
        category_name: p.category_name || p.basic_info?.category || 'Adventures',
        selling_point: p.basic_info?.sellingPoints || p.basic_info?.category || 'Best Seller',
        pickup_location: p.logistics?.pickupLocation || p.basic_info?.city || 'Tokyo',
        confirmation_type: p.logistics?.bookingType || 'Instant Confirmation',
        payment_option: p.logistics?.paymentOption || 'Pay Now'
      };
    });

    return NextResponse.json(mappedListings, { status: 200, headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } });
  } catch (error: any) {
    console.error('Supabase fetch error:', error);
    return NextResponse.json([], { status: 200, headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } });
  }
}
