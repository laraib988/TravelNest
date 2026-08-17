-- Run this in your Supabase SQL Editor

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    supplier_id TEXT NOT NULL,
    status TEXT DEFAULT 'DRAFT',
    current_step INTEGER DEFAULT 1,
    basic_info JSONB DEFAULT '{}'::jsonb,
    experience_details JSONB DEFAULT '{}'::jsonb,
    transport_pricing JSONB DEFAULT '[]'::jsonb,
    logistics JSONB DEFAULT '{}'::jsonb,
    itinerary JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Optional: Add index for faster queries by supplier
CREATE INDEX IF NOT EXISTS products_supplier_id_idx ON public.products(supplier_id);

-- 2. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT DEFAULT 'INFO',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Optional: Add index for notifications
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);

-- 3. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    booking_reference TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    supplier_id TEXT NOT NULL,
    listing_id TEXT NOT NULL,
    option_id TEXT NOT NULL,
    option_name TEXT,
    slot_id TEXT NOT NULL,
    slot_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    total_travelers INTEGER NOT NULL,
    gross_amount NUMERIC NOT NULL,
    platform_fee NUMERIC NOT NULL,
    supplier_payout NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'CONFIRMED',
    confirmation_type TEXT DEFAULT 'INSTANT',
    qr_voucher_code TEXT,
    traveler_details JSONB DEFAULT '{}'::jsonb,
    payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS bookings_supplier_id_idx ON public.bookings(supplier_id);
CREATE INDEX IF NOT EXISTS bookings_customer_id_idx ON public.bookings(customer_id);

-- 4. Create Destinations Table
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    country TEXT NOT NULL,
    country_code TEXT DEFAULT 'PK',
    hero_image TEXT,
    description TEXT,
    best_points JSONB DEFAULT '[]'::jsonb,
    trending_places JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    gallery JSONB DEFAULT '[]'::jsonb,
    itinerary JSONB DEFAULT '[]'::jsonb,
    popular_activities_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policy for destinations
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to destinations" ON public.destinations FOR ALL USING (true) WITH CHECK (true);
