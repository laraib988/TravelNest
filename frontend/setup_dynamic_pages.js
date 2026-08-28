const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

let dbUrl = process.env.DATABASE_URL.replace(/"/g, '').replace('Buttar197042#', 'Buttar197042%23');
const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS dynamic_pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        hero_section JSONB DEFAULT '{}'::jsonb,
        destinations_section JSONB DEFAULT '{}'::jsonb,
        tours_section JSONB DEFAULT '{}'::jsonb,
        extra_sections JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      INSERT INTO dynamic_pages (slug, title) VALUES
      ('tours-experiences', 'Tours & Experiences'),
      ('attraction-tickets', 'Attraction Tickets'),
      ('transport', 'Transport'),
      ('car-rentals', 'Car Rentals')
      ON CONFLICT (slug) DO NOTHING;
    `);
    console.log("Table 'dynamic_pages' created successfully and default rows inserted.");
  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
