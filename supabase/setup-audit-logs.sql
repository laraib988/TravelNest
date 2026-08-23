-- TravelNest Audit Logs Setup
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    actor_id TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_id TEXT,
    entity_type TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Secure it with RLS (Nobody can read/write except the Backend Server via Service Role Key)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Deny all access from the frontend (Anon key)
DROP POLICY IF EXISTS "Deny public access to audit logs" ON public.audit_logs;
CREATE POLICY "Deny public access to audit logs" 
ON public.audit_logs FOR ALL 
USING (false) WITH CHECK (false);
