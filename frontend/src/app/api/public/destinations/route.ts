import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from('destinations')
      .select('id, name, slug, country, hero_image, popular_activities_count')\n      .range(0, 49)
      .eq('is_published', true)
      .order('name', { ascending: true });

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json([]);
      }
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error fetching public destinations:', error);
    return NextResponse.json([], { status: 200, headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } });
  }
}
