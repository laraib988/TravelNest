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
    .select('*')
    .eq('is_published', true)
    .order('name');

  return <DestinationsClientPage initialDestinations={destinations || []} />;
}
