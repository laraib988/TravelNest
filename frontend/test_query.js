const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('products')
    .select('id, basic_info->>category, basic_info->>title')
    .eq('status', 'PUBLISHED')
    .eq('basic_info->>category', 'Attraction Tickets');
    
  if (error) console.error(error);
  console.log(data);
}

run();
