import { getDynamicAlternates } from '@/lib/seo';
export async function generateMetadata() {
  return { alternates: { canonical: '/destinations' },
    title: 'Destinations | Vaitour',
    description: 'Explore the world.',
    keywords: ['best museums in tokyo', 'sapporo', 'harajuku', 'kamakura', 'asakusa', 'dotonbori', 'kobe japan', 'nara japan', 'nikko', 'things to do in tokyo', 'japan food', 'kabukicho', 'kyoto station', 'ueno park', 'ghibli museum tickets', 'hakone japan', 'kansai region', 'kanto', 'japan destinations'],
    alternates: await getDynamicAlternates('/destinations')
  };
}
export const revalidate = 3600;

import { createClient } from '@supabase/supabase-js';
import DestinationsClientPage from '@/components/DestinationsClientPage';




export default async function DestinationsIndexPage() {
  console.log("🔥 CHECKING SSR: Running on Server (Index Page)!");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

  const { data: destinations } = await supabase
    .from('destinations')
    .select('id, name, slug, country, hero_image, popular_activities_count, is_published, created_at, description')
    .eq('is_published', true)
    .order('name');

  return <DestinationsClientPage initialDestinations={destinations || []} />;
}
