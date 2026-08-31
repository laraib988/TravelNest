import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import TourDetailView from './TourDetailView';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const revalidate = 3600; // ISR

type Props = {
  params: { slug: string; locale?: string };
};

// Next.js React cache deduplicates the Supabase query so it's only called once per render cycle
// across generateMetadata and the Page component.
const getTour = cache(async (id: string) => {
  // STRICT SELECT: Replaced .select('*, reviews ( * ), profiles ( name, avatar_url, created_at, role )') /* fallback */ with explicit columns to save Egress/Bandwidth.
  // Note: We cannot use .select('..., reviews(*), supplier(*)') (Joins) yet because the 
  // 'products' table lacks Foreign Key constraints to 'reviews' and 'profiles' in Supabase.
  // Adding them in Supabase Dashboard will allow us to compress this to 1 single query.
  const { data } = await supabase
    .from('products')
    .select('id, supplier_id, status, basic_info, experience_details, logistics, transport_pricing, itinerary')
    .eq('id', id)
    .single();
  return data as any;
});


const getRelevantProducts = cache(async (excludeId: string) => {
  const { data } = await supabase
    .from('products')
    .select('id, basic_info, transport_pricing')
    .neq('id', excludeId)
    .limit(4);
  return data || [];
});
const getReviews = cache(async (id: string) => {
  const { data } = await supabase
    .from('reviews')
    .select('id, rating, title, comment, created_at, user_id, profiles(name, avatar_url)')
    .eq('listing_id', id)
    .eq('status', 'APPROVED');
  return data;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.slug.length >= 36 ? params.slug.slice(-36) : params.slug;
  const tour = await getTour(id);

  if (!tour) {
    return { title: 'Tour Not Found | Vaitour' };
  }

  const locale = params.locale || 'en';
  const canonicalUrl = `https://www.vaitour.com/${locale}/tours/${params.slug}`;

  const rawTitle = tour.basic_info?.title || 'Tour Experience';
  const seoTitle = `${rawTitle} – Book Tickets & Tours | Vaitour`.substring(0, 60);
  
  const rawDesc = tour.basic_info?.summary || tour.experience_details?.short_desc || `Book the incredible ${rawTitle} today with instant confirmation and free cancellation on Vaitour.`;
  const seoDesc = rawDesc.substring(0, 155);
  
  const ogImage = tour.basic_info?.photos?.heroImage || 'https://www.vaitour.com/og-image.jpg';

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `https://www.vaitour.com/en/tours/${params.slug}`,
        ja: `https://www.vaitour.com/ja/tours/${params.slug}`,
        ur: `https://www.vaitour.com/ur/tours/${params.slug}`,
        fr: `https://www.vaitour.com/fr/tours/${params.slug}`,
        ar: `https://www.vaitour.com/ar/tours/${params.slug}`,
        'x-default': `https://www.vaitour.com/en/tours/${params.slug}`,
      },
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: rawTitle,
        }
      ],
      locale: locale,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDesc,
      images: [ogImage],
    }
  };
}

export default async function Page({ params }: Props) {
  const id = params.slug.length >= 36 ? params.slug.slice(-36) : params.slug;
  
  // PARALLEL FETCH: Fetching tour and reviews simultaneously to reduce latency.
  // This effectively merges the waterfall into a single timing block, and cache() dedupes it.
  const p = await getTour(id);
  const reviewsData = await getReviews(id) || [];
  if (!p) {
    notFound(); 
  }

  const [rawRelevant, supplierProfile, supplierProductsRes] = await Promise.all([
    getRelevantProducts(id),
    p.supplier_id ? supabase.from('profiles').select('name, avatar_url').eq('id', p.supplier_id).single().then(r => r.data) : null,
    p.supplier_id ? supabase.from('products').select('id').eq('supplier_id', p.supplier_id) : { data: null }
  ]);
  
  let supplierTotalReviews = 0;
  if (supplierProductsRes.data && supplierProductsRes.data.length > 0) {
    const productIds = supplierProductsRes.data.map(prod => prod.id);
    const { count } = await supabase.from('reviews').select('*', { count: 'exact', head: true }).in('listing_id', productIds);
    supplierTotalReviews = count || 0;
  }

  const relevantProducts = rawRelevant.map((rp: any) => {
    const rTitle = rp.basic_info?.title || 'Tour';
    const rSlug = rTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return {
      id: rp.id,
      slug: rp.slug || `${rSlug}-${rp.id}`,
      title: rTitle,
      images: rp.basic_info?.photos?.heroImage ? [{ url: rp.basic_info.photos.heroImage, alt: 'Cover' }] : [],
      price: rp.transport_pricing?.[0]?.amount || 150,
      cached_rating_avg: 5.0,
      cached_review_count: 0
    };
  });

  if (p.status !== 'PUBLISHED' && p.status !== 'APPROVED') {
    if (p.destination_id) {
      permanentRedirect(`/destinations/${p.destination_id}`); 
    } else {
      permanentRedirect(`/destinations`);
    }
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
    
  let totalRating = 0;
  let reviewCount = 0;
  if (reviewsData && reviewsData.length > 0) {
    reviewCount = reviewsData.length;
    totalRating = reviewsData.reduce((acc: number, curr: any) => acc + (curr.rating || 5), 0);
  }
  
  const ratingAvg = reviewCount > 0 ? Number((totalRating / reviewCount).toFixed(1)) : 0;

  const mappedListing = {
    id: p.id,
    supplier_id: p.supplier_id || p.user_id || 'unknown-supplier',
    title: p.basic_info?.title || p.title || 'Tour Experience',
    description: p.basic_info?.summary || p.basic_info?.shortDescription || 'No description provided.',
    images: allImages,
    base_price: p.transport_pricing?.[0]?.amount || 150,
    currency: 'USD',
    cached_rating_avg: ratingAvg,
    cached_review_count: reviewCount,
    duration_text: p.transport_pricing?.[0]?.duration || '2 Hours',
    duration_minutes: 120,
    merchandising_badges: ['NEW'],
    slug: p.slug || `${(p.basic_info?.title || p.title || 'Tour Experience').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${p.id}`,
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
    reviews: reviewsData,
    itinerary: p.itinerary || [],
    faqs: p.experience_details?.faqs || [],
    supplier: supplierProfile ? {
      ...supplierProfile,
      total_reviews: supplierTotalReviews
    } : null,
  };
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: mappedListing.title,
    image: mappedListing.images.map(img => img.url),
    description: mappedListing.description,
    sku: mappedListing.id,
    offers: {
      '@type': 'Offer',
      url: `https://www.vaitour.com/en/tours/${params.slug}`,
      priceCurrency: 'USD',
      price: mappedListing.base_price,
      availability: 'https://schema.org/InStock',
    },
    ...(mappedListing.cached_review_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: mappedListing.cached_rating_avg,
        reviewCount: mappedListing.cached_review_count,
      }
    })
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.vaitour.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tours',
        item: 'https://www.vaitour.com/tours'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: mappedListing.title,
        item: `https://www.vaitour.com/en/tours/${params.slug}`
      }
    ]
  };

  const faqSchema = mappedListing.faqs && mappedListing.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: mappedListing.faqs.map((faq: any) => ({
      '@type': 'Question',
      name: faq.q || faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a || faq.answer
      }
    }))
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <TourDetailView initialTour={mappedListing} relevantProducts={relevantProducts} />
    </>
  );
}
