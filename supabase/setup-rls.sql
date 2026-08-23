-- TravelNest Row Level Security (RLS) Setup
-- Run this in your Supabase SQL Editor

-- ==========================================
-- 1. SECURE THE BOOKINGS TABLE
-- ==========================================
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers can insert own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Suppliers can view their bookings" ON public.bookings;

-- Customer Rule: Can only see their own bookings
CREATE POLICY "Customers can view own bookings" 
ON public.bookings FOR SELECT 
USING ((select auth.uid())::text = customer_id);

-- Customer Rule: Can only insert a booking for themselves
CREATE POLICY "Customers can insert own bookings" 
ON public.bookings FOR INSERT 
WITH CHECK ((select auth.uid())::text = customer_id);

-- Supplier Rule: Can only see bookings made for their own products
CREATE POLICY "Suppliers can view their bookings" 
ON public.bookings FOR SELECT 
USING ((select auth.uid())::text = supplier_id);


-- ==========================================
-- 2. SECURE THE PRODUCTS (TOURS) TABLE
-- ==========================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published products" ON public.products;
DROP POLICY IF EXISTS "Suppliers can manage own products" ON public.products;

-- Public Rule: Anyone can view PUBLISHED products
CREATE POLICY "Public can view published products" 
ON public.products FOR SELECT 
USING (status = 'PUBLISHED');

-- Supplier Rule: Suppliers can view, insert, update, delete ONLY their own products
CREATE POLICY "Suppliers can manage own products" 
ON public.products FOR ALL 
USING ((select auth.uid())::text = supplier_id) 
WITH CHECK ((select auth.uid())::text = supplier_id);


-- ==========================================
-- 3. SECURE THE DESTINATIONS TABLE
-- ==========================================
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- Remove the old insecure policy
DROP POLICY IF EXISTS "Allow all access to destinations" ON public.destinations;
DROP POLICY IF EXISTS "Anyone can view destinations" ON public.destinations;

-- Public Rule: Anyone can read destinations (Admins use Service Role Key to bypass and write)
CREATE POLICY "Anyone can view destinations" 
ON public.destinations FOR SELECT 
USING (true);

-- Done! Your database is now highly secure.
