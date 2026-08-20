import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getDestinationNews } from '@/lib/newsService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    // Resolve the destination name so the news query can be built from it.
    let name = slug;
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabase
        .from('destinations')
        .select('name')
        .ilike('slug', slug)
        .maybeSingle();
      if (data?.name) name = data.name;
    } catch (e) {
      // fall back to slug-derived name
    }

    const articles = await getDestinationNews(slug, name);

    return NextResponse.json(
      { slug, name, articles, updatedAt: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching destination news:', error);
    return NextResponse.json(
      { slug: params.slug, articles: [], error: error.message },
      { status: 200 }
    );
  }
}