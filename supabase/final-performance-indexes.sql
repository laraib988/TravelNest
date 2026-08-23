

-- ==========================================
-- 🚀 5.2 ADVANCED PERFORMANCE INDEXES (OTA)
-- ==========================================
-- These composite indexes completely eliminate sequential scans 
-- for the most frequent Dashboard and Public API queries.

-- 1. Supplier Dashboard Queries (Solves 2,034+ calls lag)
-- Pattern: SELECT products WHERE supplier_id = X AND status <> Y ORDER BY updated_at
CREATE INDEX IF NOT EXISTS idx_products_supplier_status_updated 
ON public.products(supplier_id, status, updated_at DESC);

-- 2. Public / Admin Listing Queries (Solves 535+ calls lag)
-- Pattern: SELECT products WHERE status = ANY(...) ORDER BY updated_at
CREATE INDEX IF NOT EXISTS idx_products_status_updated 
ON public.products(status, updated_at DESC);

-- 3. Supplier Bookings Dashboard 
CREATE INDEX IF NOT EXISTS idx_bookings_supplier_created 
ON public.bookings(supplier_id, created_at DESC);

-- 4. Customer Order History
CREATE INDEX IF NOT EXISTS idx_bookings_customer_created 
ON public.bookings(customer_id, created_at DESC);

-- 5. Reviews by Listing (Fast tour detail page loading)
CREATE INDEX IF NOT EXISTS idx_reviews_listing_created 
ON public.reviews(listing_id, created_at DESC);

-- 6. Notifications for Users
CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
ON public.notifications(user_id, created_at DESC);
