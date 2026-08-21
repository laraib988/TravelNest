-- 5.2 Add Indexes on Frequently Queried Columns for OTA Performance

-- Note: Adjust table names if they differ in your actual schema (e.g., 'products' instead of 'tours')

-- 1. Index on tours status (only for published items)
CREATE INDEX IF NOT EXISTS idx_tours_status ON products(is_published) WHERE is_published = true;

-- 2. Index on destination to speed up destination page queries
CREATE INDEX IF NOT EXISTS idx_tours_destination ON products(destination_id);

-- 3. Index on bookings by user, sorting by date descending for order history
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id, created_at DESC);

-- 4. Index on availability slots by tour and date for the booking widget
CREATE INDEX IF NOT EXISTS idx_availability_tour_date ON availability_slots(listing_id, date_time);

-- 5. Composite index for search/filter pages (destination + category + status)
CREATE INDEX IF NOT EXISTS idx_tours_search ON products(destination_id, category_id, is_published);

-- Extra: Index on reviews by listing for fast tour detail page loading
CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listing_id, created_at DESC);
