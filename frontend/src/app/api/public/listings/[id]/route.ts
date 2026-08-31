import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    let { id } = params;

    const match = id.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
    if (match) {
      id = match[1];
    }

    const { data: p, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !p) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    let inclusions: string[] = [];
    if (p.experience_details?.included) {
      inclusions = p.experience_details.included.split('\n').filter((x: string) => x.trim() !== '');
    }

    let know_before_you_go: string[] = [];
    if (p.experience_details?.excluded) {
      know_before_you_go = p.experience_details.excluded.split('\n').filter((x: string) => x.trim() !== '');
    }
    know_before_you_go.push('Please bring valid ID or Passport.');

    let allImages = [];
    if (p.basic_info?.photos?.heroImage) {
      allImages.push({ url: p.basic_info.photos.heroImage, alt: 'Cover' });
    }
    if (p.basic_info?.photos?.gallery && Array.isArray(p.basic_info.photos.gallery)) {
      p.basic_info.photos.gallery.forEach((url: string) => {
        allImages.push({ url, alt: 'Gallery' });
      });
    }
    if (allImages.length === 0) {
      allImages.push({ url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', alt: 'Fallback' });
    }

    const mappedListing = {
      id: p.id,
      supplier_id: p.supplier_id || p.user_id || 'unknown-supplier',
      title: p.basic_info?.title || p.title || 'Tour Experience',
      description: p.basic_info?.summary || p.basic_info?.shortDescription || 'No description provided.',
      images: allImages,
      base_price: p.transport_pricing?.[0]?.amount || 150,
      currency: 'USD',
      cached_rating_avg: 5.0,
      cached_review_count: 0,
      duration_text: p.transport_pricing?.[0]?.duration || '2 Hours',
      duration_minutes: 120,
      merchandising_badges: ['NEW'],
      slug: p.slug || `${(p.basic_info?.title || "Tour").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${p.id}`,
      category_name: p.basic_info?.sellingPoints || p.basic_info?.category || 'Experiences',
      confirmation_type: p.logistics?.bookingType || 'Instant Confirmation',
      payment_option: p.logistics?.paymentOption || 'Pay Now',
      time_from: p.logistics?.timeFrameFrom || '08:00',
      time_to: p.logistics?.timeFrameTo || '18:00',
      time_interval: p.logistics?.timeInterval || '30',
      meeting_point: { address: p.logistics?.pickupLocation || 'Multiple pickup locations' },
      dropoff_point: { address: p.logistics?.dropOffSameAsPickup ? (p.logistics?.pickupLocation || 'Same as Pickup') : (p.logistics?.dropOffLocation || 'Multiple dropoff locations') },
      inclusions,
      know_before_you_go,
      options: p.transport_pricing?.map((opt: any) => ({
        id: opt.id || opt.title,
        title: opt.title,
        description: opt.transportType,
        price_modifier: opt.amount,
        pricing_type: opt.pricingType || 'Price per traveler',
        available_units: opt.availableUnits || '10',
        max_capacity: opt.travellers || '10',
      })) || [{
        id: 'opt-1', title: 'Standard Admission', description: 'Entry ticket', price_modifier: 150, pricing_type: 'Price per traveler', available_units: '10'
      }],
      available_slots: [
        { id: 'slot-1', start_time: new Date(Date.now() + 86400000).toISOString(), capacity_left: 10, option_id: null },
        { id: 'slot-2', start_time: new Date(Date.now() + 172800000).toISOString(), capacity_left: 5, option_id: null },
      ],
      raw_data: p,
      ai_review_summary: null,
      highlights: p.basic_info?.highlights || [],
      itinerary: p.itinerary || [],
      faqs: p.experience_details?.faqs || []
    };

    return NextResponse.json(mappedListing, { status: 200 });
  } catch (error: any) {
    console.error('Supabase fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
