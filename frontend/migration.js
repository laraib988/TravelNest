const { Client } = require('pg');

const oldDb = new Client({ connectionString: 'postgresql://postgres:Buttar197042%23@aws-0-eu-central-1.pooler.supabase.com:6543/postgres' });

async function run() {
  await oldDb.connect();
  const res = await oldDb.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
  console.log('Public Tables:', res.rows.map(r => r.table_name));
  await oldDb.end();
}

run().catch(console.error);
