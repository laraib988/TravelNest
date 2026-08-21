-- RLS Performance Optimization
-- This script replaces common RLS policies to use (select auth.uid()) instead of auth.uid()
-- This allows the Postgres Query Planner to cache the user ID instead of calling the function per row.

-- 1. Optimize Bookings Table
DROP POLICY IF EXISTS "select_own" ON bookings;
CREATE POLICY "select_own" ON bookings 
  FOR SELECT 
  USING ((select auth.uid()) = customer_id); -- assuming customer_id is used for users

-- 2. Optimize Forum Discussions
DROP POLICY IF EXISTS "Auth users can insert discussions" ON public.forum_discussions;
CREATE POLICY "Auth users can insert discussions" ON public.forum_discussions 
  FOR INSERT TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

-- 3. Optimize Forum Replies
DROP POLICY IF EXISTS "Auth users can insert replies" ON public.forum_replies;
CREATE POLICY "Auth users can insert replies" ON public.forum_replies 
  FOR INSERT TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

-- Note: Apply this same pattern to any other tables (e.g. reviews, products) 
-- that use auth.uid() in their RLS policies inside your Supabase Dashboard.
