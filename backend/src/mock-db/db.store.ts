export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  country_code: string;
  hero_image: string;
  description: string;
  popular_activities_count: number;
  latitude: number;
  longitude: number;
  faq_schema: Array<{ question: string; answer: string }>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  required_documents: string[];
}

export interface ListingOption {
  id: string;
  name: string;
  price: number;
  currency: string;
  age_group: 'ADULT' | 'CHILD' | 'SENIOR' | 'INFANT' | 'GROUP';
  inclusions_addon?: string[];
}

export interface Listing {
  id: string;
  supplier_id: string;
  destination_id: string;
  category_id: string;
  category_name: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  base_price: number;
  currency: string;
  duration_minutes: number;
  meeting_point: {
    address: string;
    latitude: number;
    longitude: number;
  };
  confirmation_type: 'INSTANT' | 'REQUEST_BASED_24H_SLA';
  cancellation_policy: 'FREE_24H' | 'NON_REFUNDABLE' | 'STRICT_7D';
  cached_rating_avg: number;
  cached_review_count: number;
  merchandising_badges: string[];
  images: Array<{ url: string; alt: string }>;
  inclusions: string[];
  exclusions: string[];
  know_before_you_go: string[];
  options: ListingOption[];
  embedding: number[];
  ai_review_summary?: {
    pros: string[];
    cons: string[];
    sentiment_score: number;
  };
  ai_dynamic_pricing?: {
    recommended_price: number;
    demand_surge_factor: number;
    reasoning: string;
  };
}

export interface AvailabilitySlot {
  id: string;
  listing_id: string;
  start_time: string;
  end_time: string;
  total_capacity: number;
  booked_capacity: number;
  held_capacity: number;
  price_override?: number;
}

export interface BookingHold {
  hold_id: string;
  slot_id: string;
  option_id: string;
  quantity: number;
  expires_at: number;
}

export interface BookingRecord {
  id: string;
  booking_reference: string;
  customer_id: string;
  listing_id: string;
  option_id: string;
  option_name: string;
  slot_id: string;
  slot_start_time: string;
  total_travelers: number;
  gross_amount: number;
  platform_fee: number;
  supplier_payout: number;
  currency: string;
  status: 'PENDING_PAYMENT' | 'AWAITING_SUPPLIER_CONFIRMATION' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED';
  confirmation_type: 'INSTANT' | 'REQUEST_BASED_24H_SLA';
  qr_voucher_code: string;
  traveler_details: {
    lead_name: string;
    lead_email: string;
    lead_phone: string;
    special_requirements?: string;
    guest_names?: string[];
  };
  payment_intent_id?: string;
  created_at: string;
}

export interface KYCDocument {
  doc_id: string;
  doc_type: 'BUSINESS_LICENSE' | 'TAX_REGISTRATION' | 'TOURISM_PERMIT' | 'LIABILITY_INSURANCE' | 'GOVT_ID' | 'BANK_PROOF';
  file_name: string;
  file_url: string;
  status: 'PENDING' | 'PASSED' | 'FLAGGED' | 'EXPIRED';
  expiry_date?: string;
}

export interface KYCRecord {
  supplier_id: string;
  company_name: string;
  business_type: 'CORPORATE' | 'INDIVIDUAL_FREELANCER';
  business_reg: string;
  tax_id: string;
  kyc_state: 'DRAFT' | 'SUBMITTED_PENDING_REVIEW' | 'UNDER_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED_VERIFIED' | 'REJECTED' | 'SUSPENDED';
  documents: KYCDocument[];
  ocr_confidence: number;
  ai_fraud_score: number;
  audit_reasons: string[];
  updated_at: string;
}

export interface PayoutRecord {
  id: string;
  payout_reference: string;
  supplier_id: string;
  gross_amount: number;
  commission_deducted: number;
  net_amount: number;
  currency: string;
  status: 'SCHEDULED' | 'PROCESSING' | 'PAID' | 'FAILED';
  period_start: string;
  period_end: string;
  processed_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string;
  role: 'CUSTOMER' | 'SUPPLIER' | 'ADMIN' | 'BLOG_WRITER';
  avatar: string;
  home_country: string;
  preferred_currency: string;
  preferred_language: string;
  saved_travelers: Array<{ name: string; age_type: string; passport_number?: string }>;
  wishlist_listing_ids: string[];
  loyalty_points: number;
  membership_tier: 'BRONZE' | 'SILVER' | 'GOLD';
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  listing_id: string;
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  helpful_count: number;
  supplier_reply?: { text: string; replied_at: string };
  ai_fraud_score: number;
  status: 'PUBLISHED' | 'PENDING' | 'FLAGGED' | 'REMOVED';
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  min_spend: number;
  max_discount?: number;
  valid_from: string;
  valid_to: string;
  usage_limit: number;
  used_count: number;
  applicable_categories: string[];
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'REVIEW_REQUEST' | 'PRICE_DROP' | 'PROMO' | 'SYSTEM';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
}

class MockDatabaseStore {
  categories: Category[] = [
    { id: 'cat-things-to-do', name: 'Things to Do', slug: 'things-to-do', icon: '🌟', required_documents: ['BUSINESS_LICENSE', 'GOVT_ID'] },
    { id: 'cat-tickets', name: 'Attraction Tickets', slug: 'attraction-tickets', icon: '🎟️', required_documents: ['BUSINESS_LICENSE', 'TAX_REGISTRATION'] },
    { id: 'cat-tours', name: 'Tours & Day Trips', slug: 'tours-day-trips', icon: '🚌', required_documents: ['BUSINESS_LICENSE', 'TOURISM_PERMIT', 'LIABILITY_INSURANCE'] },
    { id: 'cat-transfers', name: 'Transfers & Transport', slug: 'transfers-transport', icon: '🚗', required_documents: ['BUSINESS_LICENSE', 'LIABILITY_INSURANCE'] },
    { id: 'cat-food', name: 'Food & Dining Experiences', slug: 'food-dining', icon: '🍜', required_documents: ['BUSINESS_LICENSE', 'GOVT_ID'] },
    { id: 'cat-adventure', name: 'Adventure & Outdoor', slug: 'adventure-outdoor', icon: '🌋', required_documents: ['BUSINESS_LICENSE', 'TOURISM_PERMIT', 'LIABILITY_INSURANCE'] },
    { id: 'cat-events', name: 'Events & Shows', slug: 'events-shows', icon: '🎭', required_documents: ['BUSINESS_LICENSE'] },
    { id: 'cat-packages', name: 'Multi-day Packages', slug: 'multi-day-packages', icon: '🧳', required_documents: ['BUSINESS_LICENSE', 'TOURISM_PERMIT', 'LIABILITY_INSURANCE'] },
    { id: 'cat-rentals', name: 'Local Rentals (WiFi/SIM)', slug: 'local-rentals', icon: '📶', required_documents: ['BUSINESS_LICENSE'] },
  ];

  destinations: Destination[] = [
    {
      id: 'dest-bali',
      name: 'Bali, Indonesia',
      slug: 'bali',
      country: 'Indonesia',
      country_code: 'ID',
      hero_image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      description: 'Tropical paradise featuring ancient cliffside temples, volcanic peaks, emerald rice terraces, and luxury ocean catamarans.',
      popular_activities_count: 142,
      latitude: -8.4095,
      longitude: 115.1889,
      faq_schema: [
        { question: 'What is the best time to visit Bali for water activities?', answer: 'April to October offers dry sunny weather with smooth sea conditions for catamaran cruises and snorkeling.' },
        { question: 'Are airport transfers available from Ngurah Rai Airport?', answer: 'Yes, private air-conditioned airport transfers can be booked instantly with free 24h cancellation.' }
      ]
    },
    {
      id: 'dest-tokyo',
      name: 'Tokyo, Japan',
      slug: 'tokyo',
      country: 'Japan',
      country_code: 'JP',
      hero_image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      description: 'Futuristic metropolis blending ancient Shinto shrines, neon-lit Shinjuku food alleys, and high-speed bullet train passes.',
      popular_activities_count: 210,
      latitude: 35.6762,
      longitude: 139.6503,
      faq_schema: [
        { question: 'Are English-speaking guides available on Tokyo food tours?', answer: 'All featured food tours include accredited bilingual local culinary historians.' }
      ]
    },
    {
      id: 'dest-paris',
      name: 'Paris, France',
      slug: 'paris',
      country: 'France',
      country_code: 'FR',
      hero_image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      description: 'City of Light offering skip-the-line Louvre passes, Seine river wine cruises, and Montmartre pastry walks.',
      popular_activities_count: 185,
      latitude: 48.8566,
      longitude: 2.3522,
      faq_schema: [
        { question: 'Do Louvre Museum passes require timed reservation slots?', answer: 'Yes, all skip-the-line tickets come with dedicated reserved entry time slots.' }
      ]
    },
    {
      id: 'dest-lahore',
      name: 'Lahore, Pakistan',
      slug: 'lahore',
      country: 'Pakistan',
      country_code: 'PK',
      hero_image: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=1200&q=80',
      description: 'Cultural capital of Pakistan renowned for Mughal heritage, Walled City food street, and Badshahi Mosque night tours.',
      popular_activities_count: 65,
      latitude: 31.5204,
      longitude: 74.3587,
      faq_schema: [
        { question: 'Is a local guide recommended for Walled City food street?', answer: 'Guided heritage walks include verified local storytellers who navigate historic gates and famous culinary spots.' }
      ]
    },
    {
      id: 'dest-dubai',
      name: 'Dubai, United Arab Emirates',
      slug: 'dubai',
      country: 'United Arab Emirates',
      country_code: 'AE',
      hero_image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      description: 'Ultra-modern desert hub boasting Burj Khalifa fast-track tickets, 4x4 dune bashing safaris, and luxury yacht cruises.',
      popular_activities_count: 195,
      latitude: 25.2048,
      longitude: 55.2708,
      faq_schema: [
        { question: 'What is included in the Red Dune Desert Safari?', answer: 'Includes 4x4 dune bashing, camel riding, sandboarding, falconry photos, and a live BBQ buffet dinner with Tanoura dancing.' }
      ]
    },
    {
      id: 'dest-rome',
      name: 'Rome, Italy',
      slug: 'rome',
      country: 'Italy',
      country_code: 'IT',
      hero_image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
      description: 'Eternal City filled with ancient Colosseum arenas, Vatican Museums, and authentic Trastevere pasta-making classes.',
      popular_activities_count: 175,
      latitude: 41.9028,
      longitude: 12.4964,
      faq_schema: [
        { question: 'Does Colosseum skip-the-line include access to the Arena Floor?', answer: 'VIP ticket options include exclusive access to the reconstructed Gladiator Arena Floor and Roman Forum.' }
      ]
    },
    {
      id: 'dest-new-york',
      name: 'New York City, United States',
      slug: 'new-york',
      country: 'United States',
      country_code: 'US',
      hero_image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
      description: 'The city that never sleeps, featuring Broadway shows, Statue of Liberty ferries, and Summit One Vanderbilt observation decks.',
      popular_activities_count: 240,
      latitude: 40.7128,
      longitude: -74.0060,
      faq_schema: [
        { question: 'Is Statue of Liberty pedestal access included?', answer: 'Priority ferry passes include Pedestal Access and admission to the Ellis Island Immigration Museum.' }
      ]
    },
    {
      id: 'dest-london',
      name: 'London, United Kingdom',
      slug: 'london',
      country: 'United Kingdom',
      country_code: 'GB',
      hero_image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      description: 'Historic capital featuring London Eye fast-track passes, Tower of London crown jewels tours, and Thames sunset cruises.',
      popular_activities_count: 215,
      latitude: 51.5074,
      longitude: -0.1278,
      faq_schema: [
        { question: 'How long is the Thames River sightseeing cruise?', answer: 'The hop-on hop-off Thames cruise is valid for 24 hours with commentary from accredited London captains.' }
      ]
    },
    {
      id: 'dest-istanbul',
      name: 'Istanbul, Turkey',
      slug: 'istanbul',
      country: 'Turkey',
      country_code: 'TR',
      hero_image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
      description: 'Crossroads of Europe & Asia offering Bosphorus sunset cruises, Hagia Sophia guided walks, and Grand Bazaar food tours.',
      popular_activities_count: 130,
      latitude: 41.0082,
      longitude: 28.9784,
      faq_schema: [
        { question: 'Is dinner included in the Bosphorus Sunset Cruise?', answer: 'Yes, the luxury yacht cruise includes a 3-course Anatolian dinner and live Turkish dervish cultural dance.' }
      ]
    },
    {
      id: 'dest-bangkok',
      name: 'Bangkok, Thailand',
      slug: 'bangkok',
      country: 'Thailand',
      country_code: 'TH',
      hero_image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
      description: 'Vibrant capital known for Grand Palace golden spires, Damnoen Saduak floating markets, and Tuk-Tuk night foodie rides.',
      popular_activities_count: 160,
      latitude: 13.7563,
      longitude: 100.5018,
      faq_schema: [
        { question: 'What is the departure time for the Floating Market tour?', answer: 'Morning tours depart at 07:00 AM with hotel pickup in air-conditioned minivans.' }
      ]
    },
    {
      id: 'dest-karachi',
      name: 'Karachi, Pakistan',
      slug: 'karachi',
      country: 'Pakistan',
      country_code: 'PK',
      hero_image: 'https://images.unsplash.com/photo-1623091426425-412e68449c25?auto=format&fit=crop&w=1200&q=80',
      description: 'City of Lights featuring Clifton Beach, Do Darya dining, and historic Mohatta Palace.',
      popular_activities_count: 45,
      latitude: 24.8607,
      longitude: 67.0011,
      faq_schema: [
        { question: 'Is Do Darya dining safe?', answer: 'Yes, Do Darya is a famous secure seaside food street offering premium dining over the water.' }
      ]
    },
    {
      id: 'dest-islamabad',
      name: 'Islamabad, Pakistan',
      slug: 'islamabad',
      country: 'Pakistan',
      country_code: 'PK',
      hero_image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
      description: 'Beautiful capital city nestled in Margalla Hills featuring Faisal Mosque and Monal restaurant.',
      popular_activities_count: 38,
      latitude: 33.6844,
      longitude: 73.0479,
      faq_schema: [
        { question: 'What is the best viewpoint in Islamabad?', answer: 'Daman-e-Koh and Pir Sohawa in the Margalla Hills offer panoramic views of the city.' }
      ]
    },
    {
      id: 'dest-hunza',
      name: 'Hunza Valley, Pakistan',
      slug: 'hunza',
      country: 'Pakistan',
      country_code: 'PK',
      hero_image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
      description: 'Stunning mountain valley with Altit and Baltit forts, Attabad Lake, and views of Rakaposhi.',
      popular_activities_count: 52,
      latitude: 36.3167,
      longitude: 74.6500,
      faq_schema: [
        { question: 'Is Attabad Lake open for boating?', answer: 'Yes, motorboating and jetskiing are available throughout the summer months.' }
      ]
    },
    {
      id: 'dest-skardu',
      name: 'Skardu, Pakistan',
      slug: 'skardu',
      country: 'Pakistan',
      country_code: 'PK',
      hero_image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=1200&q=80',
      description: 'Gateway to Karakoram peaks featuring Shangrila Lake, Cold Desert of Katpana, and historic forts.',
      popular_activities_count: 29,
      latitude: 35.2971,
      longitude: 75.6337,
      faq_schema: [
        { question: 'When is Skardu accessible?', answer: 'Skardu is accessible by road via Karakoram Highway or daily direct flights from Islamabad.' }
      ]
    }
  ];

  listings: Listing[] = [
    {
      id: 'list-bali-sunset',
      supplier_id: 'sup-oceanic-tours',
      destination_id: 'dest-bali',
      category_id: 'cat-cruises',
      category_name: 'Water Sports & Cruises',
      title: 'Luxury Bali Sunset Catamaran Cruise with Seafood Dinner & Live DJ',
      slug: 'luxury-bali-sunset-catamaran-cruise',
      summary: 'Sail into the Nusa Dua sunset aboard a 65ft luxury dual-hull catamaran with free-flow tropical drinks and grilled seafood buffet.',
      description: 'Experience an unforgettable evening off the coast of Bali. Board our state-of-the-art dual-hull catamaran at Benoa Harbour. Sip hand-crafted tropical cocktails while dancing to live acoustic sets, followed by a gourmet grilled seafood dinner under the stars.',
      base_price: 89.00,
      currency: 'USD',
      duration_minutes: 240,
      meeting_point: {
        address: 'Benoa Harbour Gate 3, Denpasar, Bali, Indonesia',
        latitude: -8.7456,
        longitude: 115.2155
      },
      confirmation_type: 'INSTANT',
      cancellation_policy: 'FREE_24H',
      cached_rating_avg: 4.92,
      cached_review_count: 1284,
      merchandising_badges: ['Likely to Sell Out', 'Bestseller', 'Travelers Choice 2026', 'Instant Voucher'],
      images: [
        { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80', alt: 'Luxury Catamaran Cruise at Sunset' },
        { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', alt: 'Ocean View Sunset' }
      ],
      inclusions: [
        '4-Hour Sunset Cruise aboard luxury catamaran',
        'Welcome champagne cocktail',
        'Gourmet international seafood dinner buffet',
        'Live acoustic music & resident DJ',
        'Hotel pickup & drop-off (Seminyak, Kuta, Sanur)'
      ],
      exclusions: ['Personal alcoholic beverages outside free-flow hours', 'Gratuities'],
      know_before_you_go: [
        'Please arrive 30 minutes before boarding time.',
        'Vegetarian and vegan meal options available upon request during checkout.',
        'Bring a light jacket for ocean breeze.'
      ],
      options: [
        { id: 'opt-101-adult', name: 'Adult Pass (12+ yrs)', price: 89.00, currency: 'USD', age_group: 'ADULT' },
        { id: 'opt-101-child', name: 'Child Pass (3-11 yrs)', price: 49.00, currency: 'USD', age_group: 'CHILD' },
        { id: 'opt-101-vip', name: 'VIP Suite + Hotel Transfer Add-on', price: 139.00, currency: 'USD', age_group: 'ADULT', inclusions_addon: ['Private air-conditioned SUV transfer', 'Reserved deck loungers'] }
      ],
      embedding: [0.85, 0.12, 0.94, 0.44, 0.05, 0.78, 0.32, 0.91],
      ai_review_summary: {
        pros: ['Incredible sunset views from dual-hull deck', 'Generous fresh seafood buffet', 'Friendly attentive crew'],
        cons: ['Weekend slots book out fast; advance reservation essential'],
        sentiment_score: 0.96
      },
      ai_dynamic_pricing: {
        recommended_price: 94.50,
        demand_surge_factor: 1.06,
        reasoning: 'High demand detected for August weekend slots; 88% capacity reached.'
      }
    },
    // {
    //   id: 'list-tokyo-food',
    //   supplier_id: 'sup-tokyo-culinary',
    //   destination_id: 'dest-tokyo',
    //   category_id: 'cat-food',
    //   category_name: 'Food & Culinary',
    //   title: 'Shinjuku After-Dark Ramen, Yakitori & Izakaya Hidden Gems Tour',
    //   slug: 'shinjuku-after-dark-food-tour',
    //   summary: 'Explore Omoide Yokocho and Golden Gai with a local culinary historian. Taste award-winning ramen and A5 Wagyu skewers.',
    //   description: 'Step into the neon-lit backalleys of Tokyo night life. Navigate the historic lantern-lit alleyways of Shinjuku with an expert local guide. Enjoy 4 authentic food stops featuring charcoal-grilled yakitori, artisanal sake pairings, and regional tonkotsu ramen.',
    //   base_price: 115.00,
    //   currency: 'USD',
    //   duration_minutes: 180,
    //   meeting_point: {
    //     address: 'Shinjuku Station East Exit (Studio Alta Front), Tokyo, Japan',
    //     latitude: 35.6917,
    //     longitude: 139.7005
    //   },
    //   confirmation_type: 'INSTANT',
    //   cancellation_policy: 'FREE_24H',
    //   cached_rating_avg: 4.96,
    //   cached_review_count: 842,
    //   merchandising_badges: ['Bestseller', 'Travelers Choice 2026'],
    //   images: [
    //     { url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80', alt: 'Shinjuku Neon Alleyways' },
    //     { url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80', alt: 'Ramen Bowl' }
    //   ],
    //   inclusions: [
    //     'Guided 3-Hour walking culinary tour',
    //     'Food tastings at 4 authentic izakayas & ramen shops',
    //     '3 complimentary sake & beer pairings',
    //     'Small group size (Max 8 travelers)'
    //   ],
    //   exclusions: ['Hotel transfer', 'Additional drinks'],
    //   know_before_you_go: [
    //     'Tour involves approximately 2km of walking.',
    //     'Must be 20+ years of age for alcoholic pairings.'
    //   ],
    //   options: [
    //     { id: 'opt-201-adult', name: 'Standard Food & Sake Pass', price: 115.00, currency: 'USD', age_group: 'ADULT' },
    //     { id: 'opt-201-nonalc', name: 'Non-Alcoholic Tasting Option', price: 95.00, currency: 'USD', age_group: 'ADULT' }
    //   ],
    //   embedding: [0.10, 0.95, 0.20, 0.88, 0.91, 0.15, 0.80, 0.40],
    //   ai_review_summary: {
    //     pros: ['Expert English-speaking guide', 'Authentic non-touristy izakayas', 'Delicious A5 Wagyu skewers'],
    //     cons: ['Narrow alleys involve standing'],
    //     sentiment_score: 0.98
    //   }
    // },
    {
      id: 'list-paris-louvre',
      supplier_id: 'sup-paris-culture',
      destination_id: 'dest-paris',
      category_id: 'cat-tickets',
      category_name: 'Attraction Tickets',
      title: 'Skip-the-Line Louvre Museum Masterpieces Guided Tour with Art Historian',
      slug: 'louvre-museum-masterpieces-guided-tour',
      summary: 'Priority reserved entry to the Louvre with expert commentary on the Mona Lisa, Venus de Milo, and Winged Victory.',
      description: 'Bypass the general admission queues and step straight into the world’s greatest art museum. Your licensed art historian guide will lead you through a curated 2.5 hour journey highlighting the crowning achievements of Western art.',
      base_price: 75.00,
      currency: 'USD',
      duration_minutes: 150,
      meeting_point: {
        address: 'Arc de Triomphe du Carrousel, 75001 Paris, France',
        latitude: 48.8617,
        longitude: 2.3331
      },
      confirmation_type: 'INSTANT',
      cancellation_policy: 'FREE_24H',
      cached_rating_avg: 4.88,
      cached_review_count: 2150,
      merchandising_badges: ['Likely to Sell Out', 'Instant Voucher'],
      images: [
        { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80', alt: 'Louvre Pyramid at Twilight' }
      ],
      inclusions: [
        'Skip-the-line timed entrance ticket to Louvre Museum',
        '2.5-hour guided tour with accredited art historian',
        'Headset for clear guide audio'
      ],
      exclusions: ['Access to temporary exhibitions', 'Food & drinks'],
      know_before_you_go: [
        'Passport or photo ID required at entry.',
        'Large backpacks and suitcases are not permitted inside.'
      ],
      options: [
        { id: 'opt-301-adult', name: 'Adult Ticket (18+ yrs)', price: 75.00, currency: 'USD', age_group: 'ADULT' },
        { id: 'opt-301-youth', name: 'Youth Ticket (under 18)', price: 45.00, currency: 'USD', age_group: 'CHILD' }
      ],
      embedding: [0.30, 0.40, 0.15, 0.10, 0.95, 0.90, 0.20, 0.50],
      ai_review_summary: {
        pros: ['Saved 2 hours of waiting line', 'Guide knew direct routes to Mona Lisa'],
        cons: ['Crowded around peak afternoon hours'],
        sentiment_score: 0.94
      }
    },
    {
      id: 'list-lahore-walled-city',
      supplier_id: 'sup-heritage-lahore',
      destination_id: 'dest-lahore',
      category_id: 'cat-tours',
      category_name: 'Tours & Day Trips',
      title: 'Walled City of Lahore Heritage Walk, Badshahi Mosque & Food Street Night Tour',
      slug: 'lahore-walled-city-heritage-food-walk',
      summary: 'Explore Mughal heritage monuments, Delhi Gate, Royal Baths, and enjoy authentic Siri Paye & Karahi on Fort Road Food Street.',
      description: 'Discover the heart of historical Punjab. Led by a certified heritage storyteller, walk through Delhi Gate, Shahi Hammam, Wazir Khan Mosque, and Badshahi Mosque. Conclude with a traditional rooftop dinner overlooking illuminated Mughal monuments.',
      base_price: 35.00,
      currency: 'USD',
      duration_minutes: 300,
      meeting_point: {
        address: 'Delhi Gate Entrance, Walled City, Lahore, Pakistan',
        latitude: 31.5822,
        longitude: 74.3283
      },
      confirmation_type: 'REQUEST_BASED_24H_SLA',
      cancellation_policy: 'FREE_24H',
      cached_rating_avg: 4.95,
      cached_review_count: 310,
      merchandising_badges: ['Travelers Choice 2026', 'New'],
      images: [
        { url: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=1000&q=80', alt: 'Badshahi Mosque Illuminated' }
      ],
      inclusions: [
        '5-Hour Guided Heritage & Food Tour',
        'Monuments entry tickets (Shahi Hammam, Badshahi Mosque)',
        'Traditional dinner on Fort Road Food Street',
        'Private Rickshaw transport inside Walled City'
      ],
      exclusions: ['Personal souvenirs'],
      know_before_you_go: [
        'Modest dress required for mosque entrance.',
        'Comfortable walking shoes recommended.'
      ],
      options: [
        { id: 'opt-401-standard', name: 'Standard Guided Walk + Dinner', price: 35.00, currency: 'USD', age_group: 'ADULT' },
        { id: 'opt-401-private', name: 'Private Family VIP Tour', price: 65.00, currency: 'USD', age_group: 'ADULT' }
      ],
      embedding: [0.45, 0.88, 0.35, 0.75, 0.80, 0.60, 0.50, 0.70],
      ai_review_summary: {
        pros: ['Incredible rooftop views of Badshahi Mosque', 'Fascinating Mughal history storytelling'],
        cons: ['Requires moderate walking through busy markets'],
        sentiment_score: 0.97
      }
    },
    {
      id: 'list-dubai-desert-safari',
      supplier_id: 'sup-dubai-safari',
      destination_id: 'dest-dubai',
      category_id: 'cat-adventure',
      category_name: 'Adventure & Outdoor',
      title: 'VIP Red Dune Desert Safari with 4x4 Dune Bashing, Camel Riding & BBQ Dinner',
      slug: 'dubai-vip-red-dune-desert-safari',
      summary: 'Experience thrilling Lahbab red dune bashing in a Land Cruiser, sunset sandboarding, falconry photos, and live Arabesque dance shows.',
      description: 'Venture into the pristine Lahbab Red Dunes of Dubai. Experience adrenaline-pumping 4x4 dune bashing, capture sunset desert landscapes, ride camels, try sandboarding, and relax at an authentic Bedouin camp with a gourmet international live BBQ dinner.',
      base_price: 65.00,
      currency: 'USD',
      duration_minutes: 360,
      meeting_point: {
        address: 'Hotel Pickup available from Dubai, Sharjah, and Ajman',
        latitude: 25.2048,
        longitude: 55.2708
      },
      confirmation_type: 'INSTANT',
      cancellation_policy: 'FREE_24H',
      cached_rating_avg: 4.94,
      cached_review_count: 1890,
      merchandising_badges: ['Bestseller', 'Instant Voucher', 'Travelers Choice 2026'],
      images: [
        { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80', alt: 'Dubai Red Dune Safari' }
      ],
      inclusions: [
        '4x4 Hotel Pickup & Drop-off in Toyota Land Cruiser',
        '30-Min High Dune Bashing at Lahbab Desert',
        'Sunset Sandboarding & Camel Riding',
        'Gourmet BBQ Dinner with Vegetarian & Meat Options',
        'Tanoura & Fire Show Live Entertainment'
      ],
      exclusions: ['Quad bike & Buggy rental (Optional add-on)'],
      know_before_you_go: [
        'Wear loose comfortable cotton clothes & sunglasses.',
        'Not recommended for pregnant women or travelers with severe back injuries.'
      ],
      options: [
        { id: 'opt-501-adult', name: 'Standard Red Dune Safari Pass', price: 65.00, currency: 'USD', age_group: 'ADULT' },
        { id: 'opt-501-vip', name: 'VIP Table Service + Quad Bike Add-on', price: 110.00, currency: 'USD', age_group: 'ADULT' }
      ],
      embedding: [0.90, 0.30, 0.70, 0.40, 0.10, 0.85, 0.60, 0.90],
      ai_review_summary: {
        pros: ['Thrilling professional Land Cruiser dune driver', 'Great sunset photography spots', 'Delicious fresh BBQ skewers'],
        cons: ['Bashing can be bumpy for young kids'],
        sentiment_score: 0.97
      }
    },
    {
      id: 'list-rome-colosseum',
      supplier_id: 'sup-rome-heritage',
      destination_id: 'dest-rome',
      category_id: 'cat-tickets',
      category_name: 'Attraction Tickets',
      title: 'Colosseum Gladiator Arena Floor & Roman Forum VIP Skip-the-Line Tour',
      slug: 'colosseum-gladiator-arena-floor-tour',
      summary: 'Walk through the Gladiator Gate onto the Arena Floor, then explore the Palatine Hill and ancient Roman Forum with an archaeologist.',
      description: 'Enter the Colosseum through the exclusive Gladiator Entrance. Stand on the reconstructed Arena Floor where ancient combats took place. Your expert archaeologist guide will then bring the ruins of the Roman Forum and Palatine Hill to life.',
      base_price: 85.00,
      currency: 'USD',
      duration_minutes: 180,
      meeting_point: {
        address: 'Piazza del Colosseo, 00184 Roma RM, Italy',
        latitude: 41.8902,
        longitude: 12.4922
      },
      confirmation_type: 'INSTANT',
      cancellation_policy: 'FREE_24H',
      cached_rating_avg: 4.91,
      cached_review_count: 1650,
      merchandising_badges: ['Likely to Sell Out', 'Bestseller'],
      images: [
        { url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80', alt: 'Colosseum Arena Rome' }
      ],
      inclusions: [
        'Skip-the-line express access to Colosseum & Arena Floor',
        'Full admission to Roman Forum & Palatine Hill',
        'Expert licensed archaeologist guide',
        'Headset for clear listening'
      ],
      exclusions: ['Underground Hypogeum access'],
      know_before_you_go: [
        'Full name & passport details required for security check.',
        'No large bags, knives, or glass bottles allowed.'
      ],
      options: [
        { id: 'opt-601-adult', name: 'Adult Arena Pass (18+ yrs)', price: 85.00, currency: 'USD', age_group: 'ADULT' },
        { id: 'opt-601-youth', name: 'Youth Pass (under 18)', price: 55.00, currency: 'USD', age_group: 'CHILD' }
      ],
      embedding: [0.40, 0.50, 0.20, 0.30, 0.90, 0.85, 0.40, 0.60],
      ai_review_summary: {
        pros: ['Direct entrance via Gladiator Gate saved 2 hours', 'Engaging archaeologist guide'],
        cons: ['Summer heat can be intense'],
        sentiment_score: 0.96
      }
    },
    {
      id: 'list-karachi-tour',
      supplier_id: 'sup-karachi-heritage',
      destination_id: 'dest-karachi',
      category_id: 'cat-tours',
      category_name: 'Tours & Day Trips',
      title: 'Karachi City of Lights Private Day Tour & Do Darya Seaside Dinner',
      slug: 'karachi-city-of-lights-private-tour',
      summary: 'Explore Mohatta Palace, Mazar-e-Quaid, Chaukhandi Tombs, and enjoy dinner at the famous Do Darya seaside.',
      description: 'Discover the bustling metropolis of Karachi. Visit the founder monument Mazar-e-Quaid, explore structural architectural marvels like Mohatta Palace, and finish your evening dining on the water at Do Darya.',
      base_price: 40.00,
      currency: 'USD',
      duration_minutes: 360,
      meeting_point: {
        address: 'Hotel pickup in Karachi, Pakistan',
        latitude: 24.8607,
        longitude: 67.0011
      },
      confirmation_type: 'INSTANT',
      cancellation_policy: 'FREE_24H',
      cached_rating_avg: 4.88,
      cached_review_count: 142,
      merchandising_badges: ['New', 'Bestseller'],
      images: [
        { url: 'https://images.unsplash.com/photo-1623091426425-412e68449c25?auto=format&fit=crop&w=1000&q=80', alt: 'Mazar e Quaid Karachi' }
      ],
      inclusions: [
        'Private air-conditioned vehicle transport',
        'Professional English-speaking guide',
        'All monuments entry fees',
        'Dinner at Do Darya Restaurant'
      ],
      exclusions: ['Gratuities'],
      know_before_you_go: ['Bring comfortable walking shoes', 'Camera photography fees may apply at some historic sites.'],
      options: [
        { id: 'opt-khi-std', name: 'Standard Pass', price: 40.00, currency: 'USD', age_group: 'ADULT' }
      ],
      embedding: [0.45, 0.85, 0.30, 0.70, 0.75, 0.65, 0.45, 0.65]
    },
    {
      id: 'list-islamabad-tour',
      supplier_id: 'sup-islamabad-tours',
      destination_id: 'dest-islamabad',
      category_id: 'cat-tours',
      category_name: 'Tours & Day Trips',
      title: 'Islamabad Margalla Hills Hike & Faisal Mosque Guided Sightseeing Tour',
      slug: 'islamabad-margalla-hills-faisal-mosque-tour',
      summary: 'Guided walk through Trail 3, historic Faisal Mosque visit, and rooftop lunch overlooking the capital city.',
      description: 'Explore the greenest capital of Pakistan. Take a guided light hike on Trail 3 of Margalla Hills, visit the magnificent Faisal Mosque, and dine with panoramic views of Rawal Lake at the Monal restaurant.',
      base_price: 38.00,
      currency: 'USD',
      duration_minutes: 300,
      meeting_point: {
        address: 'Faisal Mosque Parking lot, Islamabad, Pakistan',
        latitude: 33.7297,
        longitude: 73.0372
      },
      confirmation_type: 'INSTANT',
      cancellation_policy: 'FREE_24H',
      cached_rating_avg: 4.93,
      cached_review_count: 184,
      merchandising_badges: ['Bestseller'],
      images: [
        { url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80', alt: 'Faisal Mosque Islamabad' }
      ],
      inclusions: [
        'Local guide services',
        'Private transport from assembly point',
        'Traditional lunch in Margalla Hills'
      ],
      exclusions: ['Hiking gear'],
      know_before_you_go: ['Modest clothing required for mosque entry', 'Keep a water bottle handy.'],
      options: [
        { id: 'opt-isb-std', name: 'Standard Pass', price: 38.00, currency: 'USD', age_group: 'ADULT' }
      ],
      embedding: [0.42, 0.82, 0.32, 0.72, 0.78, 0.62, 0.48, 0.68]
    }
  ];

  availabilitySlots: AvailabilitySlot[] = [
    { id: 'slot-101', listing_id: 'list-bali-sunset', start_time: '2026-08-05T16:30:00Z', end_time: '2026-08-05T20:30:00Z', total_capacity: 20, booked_capacity: 14, held_capacity: 2 },
    { id: 'slot-102', listing_id: 'list-bali-sunset', start_time: '2026-08-06T16:30:00Z', end_time: '2026-08-06T20:30:00Z', total_capacity: 20, booked_capacity: 18, held_capacity: 1 },
    { id: 'slot-201', listing_id: 'list-tokyo-food', start_time: '2026-08-05T18:00:00Z', end_time: '2026-08-05T21:00:00Z', total_capacity: 8, booked_capacity: 5, held_capacity: 0 },
    { id: 'slot-301', listing_id: 'list-paris-louvre', start_time: '2026-08-05T09:30:00Z', end_time: '2026-08-05T12:00:00Z', total_capacity: 15, booked_capacity: 10, held_capacity: 0 },
    { id: 'slot-401', listing_id: 'list-lahore-walled-city', start_time: '2026-08-05T17:00:00Z', end_time: '2026-08-05T22:00:00Z', total_capacity: 12, booked_capacity: 4, held_capacity: 0 },
    { id: 'slot-501', listing_id: 'list-dubai-desert-safari', start_time: '2026-08-05T15:00:00Z', end_time: '2026-08-05T21:00:00Z', total_capacity: 30, booked_capacity: 22, held_capacity: 1 },
    { id: 'slot-601', listing_id: 'list-rome-colosseum', start_time: '2026-08-05T10:00:00Z', end_time: '2026-08-05T13:00:00Z', total_capacity: 25, booked_capacity: 19, held_capacity: 0 },
    { id: 'slot-khi', listing_id: 'list-karachi-tour', start_time: '2026-08-05T11:00:00Z', end_time: '2026-08-05T17:00:00Z', total_capacity: 10, booked_capacity: 2, held_capacity: 0 },
    { id: 'slot-isb', listing_id: 'list-islamabad-tour', start_time: '2026-08-05T10:00:00Z', end_time: '2026-08-05T15:00:00Z', total_capacity: 12, booked_capacity: 3, held_capacity: 0 }
  ];

  activeHolds: Map<string, BookingHold> = new Map();

  bookings: BookingRecord[] = [
    {
      id: 'book-901',
      booking_reference: 'TN-2026-8841',
      customer_id: 'cust-1',
      listing_id: 'list-bali-sunset',
      option_id: 'opt-101-adult',
      option_name: 'Adult Pass (12+ yrs)',
      slot_id: 'slot-101',
      slot_start_time: '2026-08-05T16:30:00Z',
      total_travelers: 2,
      gross_amount: 178.00,
      platform_fee: 26.70,
      supplier_payout: 151.30,
      currency: 'USD',
      status: 'CONFIRMED',
      confirmation_type: 'INSTANT',
      qr_voucher_code: 'TN-QR-BALI-99812',
      traveler_details: {
        lead_name: 'Sarah Connor',
        lead_email: 'sarah@example.com',
        lead_phone: '+1 555-0199'
      },
      payment_intent_id: 'pi_3MxtSt2eZvKYlo2C1g9uXZ89',
      created_at: '2026-08-01T10:15:00Z'
    }
  ];

  users: User[] = [
    {
      id: 'cust-1',
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: 'mockhash',
      phone: '+1 555-1234',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      home_country: 'US',
      preferred_currency: 'USD',
      preferred_language: 'en',
      saved_travelers: [{ name: 'John Doe', age_type: 'ADULT' }],
      wishlist_listing_ids: ['list-bali-sunset', 'list-paris-louvre'],
      loyalty_points: 1500,
      membership_tier: 'SILVER',
      created_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'sup-1',
      name: 'Supplier Alice',
      email: 'alice@oceanic.com',
      password_hash: 'mockhash',
      phone: '+1 555-5678',
      role: 'SUPPLIER',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      home_country: 'ID',
      preferred_currency: 'USD',
      preferred_language: 'en',
      saved_travelers: [],
      wishlist_listing_ids: [],
      loyalty_points: 0,
      membership_tier: 'BRONZE',
      created_at: '2025-05-15T00:00:00Z'
    },
    {
      id: 'admin-1',
      name: 'Admin Bob',
      email: 'admin@travelnest.com',
      password_hash: 'mockhash',
      phone: '+1 555-9999',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
      home_country: 'US',
      preferred_currency: 'USD',
      preferred_language: 'en',
      saved_travelers: [],
      wishlist_listing_ids: [],
      loyalty_points: 0,
      membership_tier: 'BRONZE',
      created_at: '2025-01-01T00:00:00Z'
    }
  ];

  reviews: Review[] = [
    {
      id: 'rev-1',
      booking_id: 'book-901',
      user_id: 'cust-1',
      user_name: 'John Doe',
      user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-bali-sunset',
      rating: 5,
      title: 'Amazing experience',
      comment: 'The sunset was beautiful and the seafood was delicious!',
      photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80'],
      helpful_count: 12,
      ai_fraud_score: 5,
      status: 'PUBLISHED',
      created_at: '2026-08-02T10:00:00Z'
    },
    {
      id: 'rev-2',
      booking_id: 'book-902',
      user_id: 'cust-2',
      user_name: 'Jane Smith',
      user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-paris-louvre',
      rating: 4,
      title: 'Great tour but crowded',
      comment: 'Loved the guide, but the Mona Lisa room was very crowded.',
      photos: [],
      helpful_count: 5,
      supplier_reply: { text: 'Thank you for your feedback! It can get busy during peak hours.', replied_at: '2026-08-03T10:00:00Z' },
      ai_fraud_score: 2,
      status: 'PUBLISHED',
      created_at: '2026-08-01T14:00:00Z'
    },
    {
      id: 'rev-3',
      booking_id: 'book-903',
      user_id: 'cust-3',
      user_name: 'Ahmed',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-lahore-walled-city',
      rating: 5,
      title: 'Rich history',
      comment: 'Walking through the old city felt magical.',
      photos: [],
      helpful_count: 8,
      ai_fraud_score: 1,
      status: 'PUBLISHED',
      created_at: '2026-07-28T09:00:00Z'
    },
    {
      id: 'rev-4',
      booking_id: 'book-904',
      user_id: 'cust-4',
      user_name: 'Maria G',
      user_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-dubai-desert-safari',
      rating: 5,
      title: 'Thrilling ride',
      comment: 'The dune bashing was intense but very fun!',
      photos: [],
      helpful_count: 3,
      ai_fraud_score: 4,
      status: 'PUBLISHED',
      created_at: '2026-07-29T11:00:00Z'
    },
    {
      id: 'rev-5',
      booking_id: 'book-905',
      user_id: 'cust-5',
      user_name: 'Luigi',
      user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-rome-colosseum',
      rating: 3,
      title: 'Very hot weather',
      comment: 'Good tour but too hot in summer, provide more water.',
      photos: [],
      helpful_count: 2,
      ai_fraud_score: 0,
      status: 'PUBLISHED',
      created_at: '2026-07-30T16:00:00Z'
    },
    {
      id: 'rev-6',
      booking_id: 'book-906',
      user_id: 'cust-6',
      user_name: 'Sarah',
      user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-bali-sunset',
      rating: 4,
      title: 'Nice music',
      comment: 'Enjoyed the acoustic sets.',
      photos: [],
      helpful_count: 4,
      ai_fraud_score: 1,
      status: 'PUBLISHED',
      created_at: '2026-08-01T20:00:00Z'
    },
    {
      id: 'rev-7',
      booking_id: 'book-907',
      user_id: 'cust-7',
      user_name: 'Tom',
      user_avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-paris-louvre',
      rating: 5,
      title: 'A must do in Paris',
      comment: 'Highly recommended for art lovers.',
      photos: [],
      helpful_count: 7,
      ai_fraud_score: 2,
      status: 'PUBLISHED',
      created_at: '2026-08-02T12:00:00Z'
    },
    {
      id: 'rev-8',
      booking_id: 'book-908',
      user_id: 'cust-8',
      user_name: 'Emily',
      user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-dubai-desert-safari',
      rating: 5,
      title: 'Perfect evening',
      comment: 'BBQ was great and entertainment was superb.',
      photos: [],
      helpful_count: 10,
      ai_fraud_score: 3,
      status: 'PUBLISHED',
      created_at: '2026-08-03T22:00:00Z'
    }
  ];

  coupons: Coupon[] = [
    { id: 'coup-1', code: 'WELCOME20', type: 'PERCENTAGE', value: 20, min_spend: 50, max_discount: 40, valid_from: '2026-08-01T00:00:00Z', valid_to: '2026-08-31T23:59:59Z', usage_limit: 1000, used_count: 150, applicable_categories: [] },
    { id: 'coup-2', code: 'SUMMER15', type: 'PERCENTAGE', value: 15, min_spend: 100, max_discount: 50, valid_from: '2026-06-01T00:00:00Z', valid_to: '2026-08-31T23:59:59Z', usage_limit: 500, used_count: 320, applicable_categories: ['cat-tours', 'cat-tickets'] },
    { id: 'coup-3', code: 'FLASH50', type: 'FIXED', value: 50, min_spend: 200, valid_from: '2026-08-05T00:00:00Z', valid_to: '2026-08-10T23:59:59Z', usage_limit: 100, used_count: 45, applicable_categories: [] },
    { id: 'coup-4', code: 'TRAVEL10', type: 'PERCENTAGE', value: 10, min_spend: 0, max_discount: 25, valid_from: '2026-01-01T00:00:00Z', valid_to: '2026-12-31T23:59:59Z', usage_limit: 5000, used_count: 1200, applicable_categories: [] }
  ];

  notifications: Notification[] = [
    { id: 'notif-1', user_id: 'cust-1', type: 'BOOKING_CONFIRMED', title: 'Booking Confirmed', message: 'Your booking for Bali Sunset Catamaran is confirmed.', link: '/bookings/book-901', read: false, created_at: '2026-08-01T10:15:00Z' },
    { id: 'notif-2', user_id: 'cust-1', type: 'SYSTEM', title: 'Welcome to TravelNest!', message: 'Explore the best tours around the world.', read: true, created_at: '2026-01-01T00:00:00Z' },
    { id: 'notif-3', user_id: 'cust-1', type: 'PROMO', title: 'Summer Sale!', message: 'Use code SUMMER15 for 15% off.', read: false, created_at: '2026-08-01T00:00:00Z' },
    { id: 'notif-4', user_id: 'cust-1', type: 'PRICE_DROP', title: 'Price drop on your wishlist', message: 'Louvre Museum tour has a 10% discount.', link: '/listings/list-paris-louvre', read: false, created_at: '2026-08-03T10:00:00Z' },
    { id: 'notif-5', user_id: 'cust-1', type: 'REVIEW_REQUEST', title: 'How was your trip?', message: 'Leave a review for your recent Bali trip.', link: '/reviews/book-901', read: false, created_at: '2026-08-06T10:00:00Z' }
  ];

  kycRecords: Map<string, KYCRecord> = new Map([
    [
      'sup-oceanic-tours',
      {
        supplier_id: 'sup-oceanic-tours',
        company_name: 'Oceanic Horizon Voyages Ltd',
        business_type: 'CORPORATE',
        business_reg: 'ID-REG-2022-99182',
        tax_id: 'TAX-881920-ID',
        kyc_state: 'APPROVED_VERIFIED',
        documents: [
          { doc_id: 'doc-101', doc_type: 'BUSINESS_LICENSE', file_name: 'trade_license_bali.pdf', file_url: 'https://cloudinary.com/docs/trade_license.pdf', status: 'PASSED' },
          { doc_id: 'doc-102', doc_type: 'TAX_REGISTRATION', file_name: 'vat_cert.pdf', file_url: 'https://cloudinary.com/docs/vat_cert.pdf', status: 'PASSED' },
          { doc_id: 'doc-103', doc_type: 'LIABILITY_INSURANCE', file_name: 'marine_insurance_2026.pdf', file_url: 'https://cloudinary.com/docs/insurance.pdf', status: 'PASSED', expiry_date: '2027-01-01' }
        ],
        ocr_confidence: 0.98,
        ai_fraud_score: 12,
        audit_reasons: ['Tax ID verified with Indonesia Tax Registry', 'Marine liability insurance valid until Jan 2027'],
        updated_at: '2026-07-15T12:00:00Z'
      }
    ]
  ]);

  payouts: PayoutRecord[] = [
    {
      id: 'po-101',
      payout_reference: 'PO-202607-SUP01',
      supplier_id: 'sup-oceanic-tours',
      gross_amount: 1671.18,
      commission_deducted: 250.68,
      net_amount: 1420.50,
      currency: 'USD',
      status: 'PAID',
      period_start: '2026-07-01T00:00:00Z',
      period_end: '2026-07-31T23:59:59Z',
      processed_at: '2026-08-01T08:00:00Z'
    }
  ];
}

export const dbStore = new MockDatabaseStore();
