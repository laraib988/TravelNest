const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

let dbUrl = process.env.DATABASE_URL.replace(/"/g, '').replace('Buttar197042#', 'Buttar197042%23');
const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

pool.query("SELECT * FROM pg_policies WHERE tablename = 'dynamic_pages'").then(res => {
  console.log("Policies:", res.rows);
  return pool.query("SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'dynamic_pages'");
}).then(res => {
  console.log("RLS Enabled:", res.rows);
  pool.end();
}).catch(err => {
  console.error(err);
  pool.end();
});
