import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  try {
    const { data: bookings, error } = await getSupabase()
      .from('bookings')
      .select('*')
      // Assuming 'cust-current-user' since there's no real auth yet
      .eq('customer_id', 'cust-current-user')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (bookings && bookings.length > 0) {
      const listingIds = Array.from(new Set(bookings.map((b: any) => b.listing_id)));
      const { data: listings } = await getSupabase()
        .from('products')
        .select('id, basic_info')
        .in('id', listingIds);
        
      if (listings) {
        const listingMap = listings.reduce((acc: any, l: any) => {
          let imageUrl = null;
          if (Array.isArray(l.basic_info?.photos)) {
            imageUrl = l.basic_info?.photos?.[0]?.url;
          } else if (l.basic_info?.photos?.gallery && Array.isArray(l.basic_info.photos.gallery)) {
            imageUrl = l.basic_info.photos.gallery[0];
          }
          acc[l.id] = imageUrl || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5';
          return acc;
        }, {});
        
        const enrichedBookings = bookings.map((b: any) => ({
          ...b,
          listing_image: listingMap[b.listing_id] || null
        }));
        return NextResponse.json(enrichedBookings);
      }
    }

    return NextResponse.json(bookings || []);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
