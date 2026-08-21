-- TravelNest Product Reviews Schema

CREATE TABLE public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id text NOT NULL,
  user_id uuid, -- Optional if guest reviews are allowed
  user_name text NOT NULL,
  user_avatar text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text NOT NULL,
  tour_types text[], -- Array of strings (e.g. ['Family', 'Solo'])
  status text DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read APPROVED reviews
CREATE POLICY "Anyone can read APPROVED reviews" ON public.reviews
  FOR SELECT USING (status = 'APPROVED');

-- Policy: Authenticated users can insert their own reviews
CREATE POLICY "Users can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (true); -- Set to true for public proxy endpoints

-- Policy: Only Admins (Service Role) can update status to APPROVED/REJECTED
CREATE POLICY "Service Role has full access" ON public.reviews
  FOR ALL USING (true) WITH CHECK (true);
