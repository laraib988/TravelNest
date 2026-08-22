export const revalidate = 3600; // ISR revalidate every 60 seconds
export const dynamicParams = true; // Enable ISR generation for new/unrendered slugs

export async function generateStaticParams() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

  const { data: destinations } = await supabase
    .from('destinations')
    .select('slug')
    .eq('is_published', true);

  return (destinations || []).map((d) => ({
    slug: d.slug
  }));
}

import { createClient } from '@supabase/supabase-js';
import DestinationDetailsClient from '@/components/DestinationDetailsClient';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

function mapProductToListing(p: any) {
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
    cached_rating_avg: p.cached_rating_avg !== undefined ? p.cached_rating_avg : 5.0,
    cached_review_count: p.cached_review_count !== undefined ? p.cached_review_count : 0,
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
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

  const { data: destination } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!destination) return {};
  return {
    title: destination.meta_title || `${destination.name} | Vaitour`,
    description: destination.meta_description || destination.description
  };
}

export default async function DestinationTemplatePage({ params }: { params: { slug: string } }) {
  console.log("🔥 CHECKING SSR: Running on Server (Details Page)!");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

  // Fetch destination
  const { data: destination } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!destination) {
    notFound();
  }

  // Extract hidden meta_data from faqs so safety/geo/etc. render on the client.
  if (destination.faqs && Array.isArray(destination.faqs)) {
    const metaFaqIndex = destination.faqs.findIndex((f: any) => f.question === '__META_DATA__');
    if (metaFaqIndex !== -1) {
      try {
        destination.meta_data = JSON.parse(destination.faqs[metaFaqIndex].answer);
      } catch (e) {
        destination.meta_data = undefined;
      }
      destination.faqs = destination.faqs.filter((_: any, i: number) => i !== metaFaqIndex);
    }
  }

  // Fetch listings (optimized columns to reduce payload under Next.js cache limit)
  const { data: rawProducts } = await supabase
    .from('products')
    .select('id, basic_info, transport_pricing, pricing, base_price, cached_rating_avg, cached_review_count, slug, destination_id, category_name, merchandising_badges, logistics')
    .in('status', ['PUBLISHED', 'APPROVED']);

  const listings = (rawProducts || []).map(mapProductToListing);

  // Matches listings logic
  let matched = [];
  if (listings && listings.length > 0) {
    const destName = destination.name;
    const nameWords = String(destName || '')
      .toLowerCase()
      .split(/[\s\-()]+/)
      .filter((w) => w.length > 2);
    const destNameLower = String(destName).toLowerCase();
    const destSlugLower = String(params.slug).toLowerCase();

    matched = listings.filter((l: any) => {
      const title = String(l.title || '').toLowerCase();
      if (destNameLower && title.includes(destNameLower)) return true;
      if (destSlugLower && title.includes(destSlugLower)) return true;
      if (nameWords.some((w: string) => title.includes(w))) return true;
      return false;
    });
  }
  const relatedProducts = matched.length > 0 ? matched.slice(0, 8) : (listings || []).slice(0, 8);
  const locale = headers().get('x-locale') || 'en';

  // Fetch 3 nearby destinations for SEO interlinking
  let { data: nearbyDestinations } = await supabase
    .from('destinations')
    .select('name, slug, hero_image, country')
    .neq('slug', params.slug)
    .limit(3);

  // Fallback to real popular destinations if DB has fewer than 3
  if (!nearbyDestinations || nearbyDestinations.length < 3) {
    const realFallbacks = [
      { name: 'Kyoto', slug: 'kyoto', country: 'Japan', hero_image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop' },
      { name: 'Dubai', slug: 'dubai', country: 'United Arab Emirates', hero_image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop' },
      { name: 'Paris', slug: 'paris', country: 'France', hero_image: 'https://images.unsplash.com/photo-1502602898657-3e907a5ea071?q=80&w=800&auto=format&fit=crop' },
      { name: 'New York', slug: 'new-york', country: 'United States', hero_image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop' },
      { name: 'Rome', slug: 'rome', country: 'Italy', hero_image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop' }
    ];
    
    // Filter out current slug and take enough to fill to 3
    const needed = 3 - (nearbyDestinations?.length || 0);
    const fillers = realFallbacks.filter(d => d.slug !== params.slug).slice(0, needed);
    
    nearbyDestinations = [...(nearbyDestinations || []), ...fillers];
  }

  return (
    <DestinationDetailsClient 
      destination={destination} 
      relatedProducts={relatedProducts} 
      nearbyDestinations={nearbyDestinations}
      locale={locale} 
    />
  );
}
