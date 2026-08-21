-- ====================================================================================
-- COMMUNITY FORUM SCHEMA & RLS
-- ====================================================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.forum_discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_badge TEXT,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Null for AI generated
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id UUID NOT NULL REFERENCES public.forum_discussions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_badge TEXT,
    is_guide BOOLEAN DEFAULT false,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Null for AI generated
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Trigger to update reply_count
CREATE OR REPLACE FUNCTION update_discussion_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_discussions SET reply_count = reply_count + 1, updated_at = NOW() WHERE id = NEW.discussion_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_discussions SET reply_count = reply_count - 1 WHERE id = OLD.discussion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_reply_count ON forum_replies;
CREATE TRIGGER trg_update_reply_count
AFTER INSERT OR DELETE ON forum_replies
FOR EACH ROW EXECUTE FUNCTION update_discussion_reply_count();

-- 3. Enable RLS
ALTER TABLE public.forum_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Anyone can read discussions and replies
CREATE POLICY "Public can view discussions" ON public.forum_discussions FOR SELECT USING (true);
CREATE POLICY "Public can view replies" ON public.forum_replies FOR SELECT USING (true);

-- Authenticated users can insert
CREATE POLICY "Auth users can insert discussions" ON public.forum_discussions FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Auth users can insert replies" ON public.forum_replies FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);

-- Note: The Service Role Key (used by our API) bypasses RLS, so it can auto-insert AI posts.

-- 5. Enable Realtime
-- Supabase requires tables to be explicitly added to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE forum_discussions;
ALTER PUBLICATION supabase_realtime ADD TABLE forum_replies;
