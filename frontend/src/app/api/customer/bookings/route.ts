import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const adminAuth = createClient(supabaseUrl, supabaseKey);
    
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    let userId = null;
    let userEmail = null;
    
    if (token) {
      const { data: userData } = await adminAuth.auth.getUser(token);
      if (userData?.user) {
        userId = userData.user.id;
        userEmail = userData.user.email;
      }
    }

    if (!userId && !userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch bookings matching the customer_id
    // To handle emails safely without PostgREST parser issues on '@', we use filter on the array or do it in two steps.
    // For safety, let's fetch by customer_id and then filter locally if needed, or use proper quoting.
    const { data: bookings, error } = await adminAuth
      .from('bookings')
      .select('*')
      .or(`customer_id.eq.${userId},traveler_details->>lead_email.eq."${userEmail}"`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (bookings && bookings.length > 0) {
      const listingIds = Array.from(new Set(bookings.map((b: any) => b.listing_id)));
      const { data: listings } = await adminAuth
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
