import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    // Step 1: Check if table already exists
    const { error: checkError } = await supabase
      .from('destinations')
      .select('id')
      .limit(1);

    if (!checkError) {
      return NextResponse.json({ success: true, message: 'Table already exists.' });
    }

    // Step 2: Table does not exist — create it via rpc if available
    // Try using pg_catalog to run migration
    const { error: rpcError } = await supabase.rpc('exec_sql', {
      sql: `
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
        CREATE POLICY IF NOT EXISTS "Allow all access to destinations"
          ON public.destinations FOR ALL USING (true) WITH CHECK (true);
      `,
    });

    if (rpcError) {
      // RPC not available — return the SQL for manual execution
      return NextResponse.json({
        success: false,
        needsManualSetup: true,
        message: 'Automatic table creation failed. Please run the SQL below in your Supabase SQL Editor.',
        sql: `-- Run this in Supabase Dashboard > SQL Editor
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

CREATE POLICY "Allow all access to destinations"
  ON public.destinations FOR ALL USING (true) WITH CHECK (true);`,
      });
    }

    return NextResponse.json({ success: true, message: 'Destinations table created successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
