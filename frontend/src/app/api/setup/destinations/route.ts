import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function GET() {
  try {
    if (!SUPABASE_URL || !SERVICE_KEY) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured in environment variables.' },
        { status: 500 }
      );
    }

    // Use Supabase REST API to execute SQL via the postgres endpoint
    // We'll create the table by calling a series of individual inserts/creates
    // Since we cannot run raw SQL via the JS client without an RPC function,
    // we use the Supabase Management REST API directly
    const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

    const createTableSQL = `
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT DEFAULT 'PK',
  hero_image TEXT,
  description TEXT,
  best_points JSONB DEFAULT '[]'::jsonb,
  trending_places JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  gallery JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '[]'::jsonb,
  popular_activities_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'destinations' AND policyname = 'Allow all access to destinations'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow all access to destinations" ON public.destinations FOR ALL USING (true) WITH CHECK (true)';
  END IF;
END $$;
    `.trim();

    // Try creating via Management API
    const mgmtResponse = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
        body: JSON.stringify({ query: createTableSQL }),
      }
    );

    if (mgmtResponse.ok) {
      return NextResponse.redirect(new URL('/admin-portal/destinations', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
    }

    // Fallback: redirect to Supabase SQL Editor with pre-filled query
    const encodedSQL = encodeURIComponent(createTableSQL);
    const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new?content=${encodedSQL}`;
    return NextResponse.redirect(sqlEditorUrl);
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
