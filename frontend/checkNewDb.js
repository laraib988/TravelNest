const { Client } = require('pg');
const newDb = new Client({ connectionString: 'postgresql://postgres:Buttar197042%23@db.urtuukuccwuulqwuablt.supabase.co:5432/postgres' });

async function run() {
  await newDb.connect();
  const res = await newDb.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
  console.log('New DB Public Tables:', res.rows.map(r => r.table_name));
  await newDb.end();
}
run().catch(console.error);
