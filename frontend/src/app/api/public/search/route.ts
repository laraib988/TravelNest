import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  
  const terms = q.split(' ').filter(t => t.length > 1);
  const destOrQuery = terms.map(t => `name.ilike.%${t}%,country.ilike.%${t}%`).join(',');
  const prodOrQuery = terms.map(t => `basic_info->>title.ilike.%${t}%,basic_info->>shortDescription.ilike.%${t}%`).join(',');

  // Search destinations
  const { data: dests } = await supabase
    .from('destinations')
    .select('name, slug, country')
    .or(destOrQuery || `name.ilike.%${q}%`)
    .limit(3);

  // Search products
  const { data: prods } = await supabase
    .from('products')
    .select('id, basic_info, status')
    .in('status', ['PUBLISHED', 'APPROVED', 'published', 'approved'])
    .or(prodOrQuery || `basic_info->>title.ilike.%${q}%,basic_info->>shortDescription.ilike.%${q}%`)
    .limit(5);

  const results = [
    ...(dests || []).map(d => ({ type: 'destination', title: d.name, subtitle: d.country, url: `/destinations/${d.slug}` })),
    ...(prods || []).map(p => {
      const title = p.basic_info?.title || 'Untitled Product';
      const slugifiedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const slug = `${slugifiedTitle}-${p.id}`;
      return { type: 'product', title: title, subtitle: 'Tour & Experience', url: `/tours/${slug}` };
    })
  ];

  return NextResponse.json(
    { results },
    { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
  );
}
