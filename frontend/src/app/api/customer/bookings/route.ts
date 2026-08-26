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
    // To handle emails safely without PostgREST parser issues on '@', we query separately and merge.
    const [ { data: byId, error: err1 }, { data: byEmail, error: err2 } ] = await Promise.all([
      adminAuth.from('bookings').select('*').eq('customer_id', userId).order('created_at', { ascending: false }),
      adminAuth.from('bookings').select('*').eq('traveler_details->>lead_email', userEmail).order('created_at', { ascending: false })
    ]);

    if (err1 || err2) {
      console.error('Error fetching bookings:', err1 || err2);
      return NextResponse.json({ error: (err1 || err2)?.message }, { status: 500 });
    }

    // Merge and deduplicate by booking id
    const bookingMap = new Map();
    [...(byId || []), ...(byEmail || [])].forEach((b: any) => bookingMap.set(b.id, b));
    let bookings = Array.from(bookingMap.values());
    
    // Sort combined results by created_at descending
    bookings.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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
