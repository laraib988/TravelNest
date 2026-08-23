import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get('supplierId');

    if (!supplierId) {
      return NextResponse.json({ error: 'Missing supplierId' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch bookings for this supplier, order by created_at descending
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select('id, customer_id, supplier_id, product_id, status, total_price, booking_date, created_at, tour_date, payment_status')
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });


    if (error) {
      // If the table doesn't exist yet, return empty array instead of crashing
      if (error.code === '42P01' || error.code === 'PGRST205' || error.code === 'PGRST204' || error.message?.includes('schema cache')) {
         return NextResponse.json([], { status: 200 });
      }
      throw error;
    }

    // Also fetch product details (title, image) for these bookings
    // For simplicity in this demo, we'll fetch them separately and merge
    if (bookings && bookings.length > 0) {
      const listingIds = Array.from(new Set(bookings.map((b: any) => b.listing_id)));
      
      const { data: listings } = await supabaseAdmin
        .from('products')
        .select('id, title, basic_info')
        .in('id', listingIds);
        
      if (listings) {
        const listingMap = listings.reduce((acc: any, l: any) => {
          let imageUrl = null;
          if (Array.isArray(l.basic_info?.photos)) {
            imageUrl = l.basic_info?.photos?.[0]?.url;
          } else if (l.basic_info?.photos?.gallery && Array.isArray(l.basic_info.photos.gallery)) {
            imageUrl = l.basic_info.photos.gallery[0];
          }
          acc[l.id] = {
            title: l.title,
            image: imageUrl || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5'
          };
          return acc;
        }, {});
        
        // Merge listing details into bookings
        const enrichedBookings = bookings.map((b: any) => ({
          ...b,
          listing_title: listingMap[b.listing_id]?.title || 'Unknown Tour',
          listing_image: listingMap[b.listing_id]?.image
        }));
        
        return NextResponse.json(enrichedBookings, { status: 200 });
      }
    }

    return NextResponse.json(bookings || [], { status: 200 });
  } catch (error: any) {
    console.error('Error fetching supplier bookings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
