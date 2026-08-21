-- 5.2 Add Indexes on Frequently Queried Columns for OTA Performance

-- Note: Adjust table names if they differ in your actual schema (e.g., 'products' instead of 'tours')

-- 1. Index on tours status (only for published items)
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status) WHERE status IN ('PUBLISHED', 'APPROVED');

-- 2. Index on supplier_id to speed up supplier dashboards
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);

-- 3. Index on bookings by user, sorting by date descending for order history
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(customer_id, created_at DESC);

-- Extra: Index on reviews by listing for fast tour detail page loading
CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listing_id, created_at DESC);
