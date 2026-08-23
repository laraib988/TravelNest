-- TravelNest N+1 Optimization: Add Foreign Keys for Nested Joins

-- 1. Ensure products.supplier_id is UUID so it can link to profiles
ALTER TABLE public.products ALTER COLUMN supplier_id TYPE UUID USING supplier_id::uuid;

-- 2. Link Products to Profiles (Supplier)
ALTER TABLE public.products
ADD CONSTRAINT products_supplier_id_fkey
FOREIGN KEY (supplier_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- 3. Link Reviews to Products
ALTER TABLE public.reviews
ADD CONSTRAINT reviews_listing_id_fkey
FOREIGN KEY (listing_id) REFERENCES public.products(id)
ON DELETE CASCADE;

-- Now Supabase nested queries like .select('*, reviews(*), profiles(*)') will work automatically!
