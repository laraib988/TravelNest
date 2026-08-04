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
  name: string; // e.g., "Adult Ticket (12+ yrs)", "Child Ticket (3-11 yrs)", "VIP Pass + Hotel Transfer"
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
  merchandising_badges: string[]; // ['Likely to Sell Out', 'Bestseller', 'Travelers Choice 2026', 'Instant Voucher']
  images: Array<{ url: string; alt: string }>;
  inclusions: string[];
  exclusions: string[];
  know_before_you_go: string[];
  options: ListingOption[];
  embedding: number[]; // 1536-dim vector representation
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
  expires_at: number; // Unix timestamp ms
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
  platform_fee: number; // 15% commission
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
      hero_image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
      description: 'Cultural capital of Pakistan renowned for Mughal heritage, Walled City food street, and Badshahi Mosque night tours.',
      popular_activities_count: 65,
      latitude: 31.5204,
      longitude: 74.3587,
      faq_schema: [
        { question: 'Is a local guide recommended for Walled City food street?', answer: 'Guided heritage walks include verified local storytellers who navigate historic gates and famous culinary spots.' }
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
    {
      id: 'list-tokyo-food',
      supplier_id: 'sup-tokyo-culinary',
      destination_id: 'dest-tokyo',
      category_id: 'cat-food',
      category_name: 'Food & Culinary',
      title: 'Shinjuku After-Dark Ramen, Yakitori & Izakaya Hidden Gems Tour',
      slug: 'shinjuku-after-dark-food-tour',
      summary: 'Explore Omoide Yokocho and Golden Gai with a local culinary historian. Taste award-winning ramen and A5 Wagyu skewers.',
      description: 'Step into the neon-lit backalleys of Tokyo night life. Navigate the historic lantern-lit alleyways of Shinjuku with an expert local guide. Enjoy 4 authentic food stops featuring charcoal-grilled yakitori, artisanal sake pairings, and regional tonkotsu ramen.',
      base_price: 115.00,
      currency: 'USD',
      duration_minutes: 180,
      meeting_point: {
        address: 'Shinjuku Station East Exit (Studio Alta Front), Tokyo, Japan',
        latitude: 35.6917,
        longitude: 139.7005
      },
      confirmation_type: 'INSTANT',
      cancellation_policy: 'FREE_24H',
      cached_rating_avg: 4.96,
      cached_review_count: 842,
      merchandising_badges: ['Bestseller', 'Travelers Choice 2026'],
      images: [
        { url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80', alt: 'Shinjuku Neon Alleyways' },
        { url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80', alt: 'Ramen Bowl' }
      ],
      inclusions: [
        'Guided 3-Hour walking culinary tour',
        'Food tastings at 4 authentic izakayas & ramen shops',
        '3 complimentary sake & beer pairings',
        'Small group size (Max 8 travelers)'
      ],
      exclusions: ['Hotel transfer', 'Additional drinks'],
      know_before_you_go: [
        'Tour involves approximately 2km of walking.',
        'Must be 20+ years of age for alcoholic pairings.'
      ],
      options: [
        { id: 'opt-201-adult', name: 'Standard Food & Sake Pass', price: 115.00, currency: 'USD', age_group: 'ADULT' },
        { id: 'opt-201-nonalc', name: 'Non-Alcoholic Tasting Option', price: 95.00, currency: 'USD', age_group: 'ADULT' }
      ],
      embedding: [0.10, 0.95, 0.20, 0.88, 0.91, 0.15, 0.80, 0.40],
      ai_review_summary: {
        pros: ['Expert English-speaking guide', 'Authentic non-touristy izakayas', 'Delicious A5 Wagyu skewers'],
        cons: ['Narrow alleys involve standing'],
        sentiment_score: 0.98
      }
    },
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
        { url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80', alt: 'Badshahi Mosque Illuminated' }
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
    }
  ];

  availabilitySlots: AvailabilitySlot[] = [
    { id: 'slot-101', listing_id: 'list-bali-sunset', start_time: '2026-08-05T16:30:00Z', end_time: '2026-08-05T20:30:00Z', total_capacity: 20, booked_capacity: 14, held_capacity: 2 },
    { id: 'slot-102', listing_id: 'list-bali-sunset', start_time: '2026-08-06T16:30:00Z', end_time: '2026-08-06T20:30:00Z', total_capacity: 20, booked_capacity: 18, held_capacity: 1 },
    { id: 'slot-201', listing_id: 'list-tokyo-food', start_time: '2026-08-05T18:00:00Z', end_time: '2026-08-05T21:00:00Z', total_capacity: 8, booked_capacity: 5, held_capacity: 0 },
    { id: 'slot-301', listing_id: 'list-paris-louvre', start_time: '2026-08-05T09:30:00Z', end_time: '2026-08-05T12:00:00Z', total_capacity: 15, booked_capacity: 10, held_capacity: 0 },
    { id: 'slot-401', listing_id: 'list-lahore-walled-city', start_time: '2026-08-05T17:00:00Z', end_time: '2026-08-05T22:00:00Z', total_capacity: 12, booked_capacity: 4, held_capacity: 0 }
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
