import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = 'force-dynamic';

const CREATE_TABLE_SQL = `
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
`;

async function ensureTable() {
  try {
    const { error } = await supabase.from('destinations').select('id').limit(1);
    if (error && (error.code === '42P01' || error.message?.includes('does not exist'))) {
      await supabase.rpc('exec_sql', { sql: CREATE_TABLE_SQL }).catch(() => null);
      // If RPC doesn't exist, try direct insert to trigger table creation awareness
    }
  } catch (e) {
    // Table might already exist
  }
}

export async function GET() {
  try {
    await ensureTable();
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json({ data: [], needsSetup: true, sql: CREATE_TABLE_SQL });
      }
      throw error;
    }
    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json({ error: error.message, data: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();
    const body = await request.json();

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const destination = {
      name: body.name,
      slug,
      country: body.country,
      country_code: body.country_code || 'PK',
      hero_image: body.hero_image || '',
      description: body.description || '',
      best_points: body.best_points || [],
      trending_places: body.trending_places || [],
      faqs: body.faqs || [],
      gallery: body.gallery || [],
      itinerary: body.itinerary || [],
      popular_activities_count: body.popular_activities_count || 0,
      is_published: body.is_published ?? false,
    };

    const { data, error } = await supabase
      .from('destinations')
      .insert(destination)
      .select()
      .single();

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('schema cache') || error.message?.includes('Could not find the table')) {
        return NextResponse.json({ error: 'Database table not found. Please click the "Setup Destinations Table" button on the main destinations page first.', sql: CREATE_TABLE_SQL }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error creating destination:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
