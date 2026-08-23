import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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
    highlights JSONB DEFAULT '[]'::jsonb,
    meta_title TEXT DEFAULT '',
    meta_description TEXT DEFAULT '',
    trending_places JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    gallery JSONB DEFAULT '[]'::jsonb,
    itinerary JSONB DEFAULT '[]'::jsonb,
    best_time_to_visit JSONB DEFAULT '{}'::jsonb,
    meta_data JSONB DEFAULT '{}'::jsonb,
    popular_activities_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
`;

const stripBase64 = (obj: any): any => {
  if (typeof obj === 'string' && obj.startsWith('data:image/')) return '';
  if (Array.isArray(obj)) return obj.map(stripBase64);
  if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) newObj[key] = stripBase64(obj[key]);
    return newObj;
  }
  return obj;
};

export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from('destinations')
      .select('id, name, slug, country, hero_image, popular_activities_count, is_published, created_at, description')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json({ data: [], needsSetup: true, sql: CREATE_TABLE_SQL });
      }
      throw error;
    }

    const processedData = (data || []).map((dest: any) => {
      let meta_data = dest.meta_data || null;
      if (dest.faqs && Array.isArray(dest.faqs)) {
        const metaFaqIndex = dest.faqs.findIndex((f: any) => f.question === '__META_DATA__');
        if (metaFaqIndex !== -1) {
          try {
            meta_data = JSON.parse(dest.faqs[metaFaqIndex].answer);
          } catch(e) {}
          // Remove it from faqs so it doesn't show in UI
          dest.faqs = dest.faqs.filter((_: any, i: number) => i !== metaFaqIndex);
        }
      }
      return { ...dest, meta_data };
    });

    return NextResponse.json({ data: processedData });
  } catch (error: any) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json({ error: error.message, data: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const destination: any = {
      name: body.name,
      slug,
      country: body.country,
      country_code: body.country_code || 'PK',
      hero_image: body.hero_image || '',
      description: body.description || '',
      meta_title: body.meta_title || '',
      meta_description: body.meta_description || '',
      best_points: body.best_points || [],
      highlights: (body.highlights || []).filter((h: any) => typeof h === 'string' && h.trim() !== ''),
      trending_places: body.trending_places || [],
      faqs: body.faqs || [],
      gallery: body.gallery || [],
      itinerary: body.itinerary || [],
      popular_activities_count: body.popular_activities_count || 0,
      is_published: body.is_published ?? false,
    };

    // Only include JSONB fields if provided
    if (body.best_time_to_visit) destination.best_time_to_visit = body.best_time_to_visit;
    // If meta_data exists, inject it as a hidden FAQ
    if (body.meta_data) {
      destination.faqs.push({
        question: '__META_DATA__',
        answer: JSON.stringify(body.meta_data)
      });
    }

    const sanitized = stripBase64(destination);

    // Smart Retry: if a column is missing (schema cache / column not created),
    // strip that field and retry so creation still succeeds.
    const MISSING_COLUMN_MAP: Record<string, string[]> = {
      highlights: ['highlights'],
      meta_title: ['meta_title'],
      meta_description: ['meta_description'],
      best_time_to_visit: ['best_time_to_visit'],
    };

    let data: any;
    let error: any;
    let insertPayload: any = sanitized;

    const attemptInsert = async (payload: any) => {
      const res = await getSupabase()
        .from('destinations')
        .insert(payload)
        .select()
        .maybeSingle();
      return res;
    };

    // Attempt progressively stripping missing columns if they fail database schema check
    let attempts = 0;
    while (attempts < 6) {
      const attemptRes = await attemptInsert(insertPayload);
      data = attemptRes.data;
      error = attemptRes.error;

      if (!error) {
        break;
      }

      if (error.message?.includes('schema cache') || error.message?.includes('Could not find the')) {
        const missing = Object.keys(MISSING_COLUMN_MAP).find((key) =>
          error.message?.includes(`'${key}'`) || error.message?.includes(key)
        );
        if (missing) {
          console.warn(`${missing} column not found, retrying without it...`);
          const { [missing]: _drop, ...remaining } = insertPayload;
          insertPayload = remaining;
          attempts++;
          continue;
        }
      }
      break;
    }

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('Could not find the table')) {
        return NextResponse.json({ error: 'Database table not found. Please run the setup SQL first.', sql: CREATE_TABLE_SQL }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error creating destination:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
