require('dotenv').config({ path: 'frontend/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: authUsers, error: err1 } = await supabase.auth.admin.listUsers();
  console.log("Auth Users count:", authUsers?.users?.length);
  
  const { data: publicUsers, error: err2 } = await supabase.from('users').select('*');
  console.log("Public Users count:", publicUsers?.length);
  
  if (authUsers?.users?.length > publicUsers?.length) {
    console.log("Mismatch! Some auth.users are not in public.users!");
    const publicIds = new Set(publicUsers.map(u => u.id));
    const missing = authUsers.users.filter(u => !publicIds.has(u.id));
    console.log("Missing users in public.users:", missing.map(u => ({ id: u.id, email: u.email, meta: u.user_metadata })));
  } else {
    console.log("All auth.users exist in public.users");
  }
}
check();
