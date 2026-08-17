import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const sql = `
    ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS best_time_to_visit JSONB DEFAULT '{}'::jsonb;
  `;
  const { data, error } = await supabase.rpc('exec_sql', { sql });
  console.log('Result:', error || 'Success');
}

run();
