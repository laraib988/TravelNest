import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Using service role for backend logic
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listing_id');
    
    let query = getSupabase().from('reviews').select('id, listing_id, user_id, rating, comment, status, created_at').eq('status', 'APPROVED');
    
    if (listingId) {
      query = query.eq('listing_id', listingId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Supabase Reviews GET Error]:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Insert new review as PENDING
    const { data, error } = await getSupabase().from('reviews').insert([{
      listing_id: body.listing_id,
      user_id: body.user_id || null,
      user_name: body.user_name || 'Anonymous',
      user_avatar: body.user_avatar || null,
      rating: body.rating,
      title: body.title,
      comment: body.comment,
      tour_types: body.tour_types || [],
      photos: body.photos || [],
      status: 'PENDING' // Awaiting Admin Approval
    }]).select().single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Supabase Reviews POST Error]:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
