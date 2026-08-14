const { Client } = require('pg'); 
const client = new Client({ connectionString: 'postgresql://postgres:Buttar197042%23@db.vozgnbqjqiaabkrpniqb.supabase.co:5432/postgres' }); 
client.connect().then(() => 
  client.query("ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT; ALTER TABLE public.products ALTER COLUMN id TYPE TEXT USING 'TN' || UPPER(SUBSTRING(REPLACE(id::text, '-', ''), 1, 8));")
).then(() => { 
  console.log('Success'); 
  client.end(); 
}).catch(e => { 
  console.error(e); 
  client.end(); 
});
