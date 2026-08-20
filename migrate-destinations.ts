import { Client } from 'pg';

const connectionString = "postgresql://postgres.vozgnbqjqiaabkrpniqb:Buttar197042%23@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres";

async function run() {
    const client = new Client({ connectionString, connectionTimeoutMillis: 20000 });
    try {
        await client.connect();
        console.log("Connected to Supabase PostgreSQL.");

        const query = `
        ALTER TABLE public.destinations
            ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb,
            ADD COLUMN IF NOT EXISTS meta_title TEXT DEFAULT '',
            ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT '';
        `;

        await client.query(query);
        console.log("Columns added successfully!");
    } catch (err) {
        console.error("Error adding columns:", err);
    } finally {
        await client.end();
    }
}

run();