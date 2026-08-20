-- ============================================================
-- TravelNest · Daily Travel Blog Engine · Schema Migration
-- Creates the `blogs` table with full SEO + author + schema support.
-- Run this once against your Supabase project (SQL Editor or psql).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,

    -- SEO metadata
    meta_title TEXT DEFAULT '',
    meta_description TEXT DEFAULT '',
    focus_keywords TEXT[] DEFAULT '{}'::text[],
    canonical_url TEXT DEFAULT '',

    -- Content (markdown body rendered on the reader page)
    content_markdown TEXT DEFAULT '',
    summary TEXT DEFAULT '',

    -- Hero / gallery imagery (dynamic Unsplash URLs with alt text)
    hero_image TEXT DEFAULT '',
    hero_image_alt TEXT DEFAULT '',
    images JSONB DEFAULT '[]'::jsonb,

    -- Author details (structured so schema markup can be generated)
    author_name TEXT DEFAULT 'TravelNest Editorial Team',
    author_bio TEXT DEFAULT '',
    author_avatar TEXT DEFAULT '',
    author_role TEXT DEFAULT 'Travel Editor',
    author_url TEXT DEFAULT '',

    -- Structured data stored as raw JSON-LD strings (Article + FAQPage)
    schema_json TEXT DEFAULT '',
    faq_schema_json TEXT DEFAULT '',

    -- Editorial workflow
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    -- Optional structured content extracted from the generator
    quick_takeaways JSONB DEFAULT '[]'::jsonb,
    itinerary JSONB DEFAULT '[]'::jsonb,
    cost_breakdown JSONB DEFAULT '[]'::jsonb,
    best_time_to_visit JSONB DEFAULT '[]'::jsonb
);

-- Publish + unpublish convenience triggers to keep published_at in sync.
CREATE OR REPLACE FUNCTION public.blogs_touch_published_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND OLD.status = 'draft' THEN
        NEW.published_at := COALESCE(NEW.published_at, now());
    END IF;
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blogs_touch_published_at ON public.blogs;
CREATE TRIGGER blogs_touch_published_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION public.blogs_touch_published_at();

-- Default updated_at on INSERT.
CREATE OR REPLACE FUNCTION public.blogs_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blogs_set_updated_at ON public.blogs;
CREATE TRIGGER blogs_set_updated_at
    BEFORE INSERT ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION public.blogs_set_updated_at();

-- Enable RLS and allow full access via the anon/service keys (the app
-- authenticates blog management through the Admin portal + service role).
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published blogs" ON public.blogs;
CREATE POLICY "Public read published blogs"
    ON public.blogs FOR SELECT
    USING (status = 'published');

DROP POLICY IF EXISTS "Admin full access to blogs" ON public.blogs;
CREATE POLICY "Admin full access to blogs"
    ON public.blogs FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Useful index for the daily blog listing + slug lookups.
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);