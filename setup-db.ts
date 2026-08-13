import { Client } from 'pg';

const connectionString = "postgresql://postgres:Buttar197042%23@db.vozgnbqjqiaabkrpniqb.supabase.co:5432/postgres";

async function run() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log("Connected to Supabase PostgreSQL.");

        const query = `
        -- 1. Create Products Table
        CREATE TABLE IF NOT EXISTS public.products (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            supplier_id TEXT NOT NULL,
            status TEXT DEFAULT 'DRAFT',
            current_step INTEGER DEFAULT 1,
            basic_info JSONB DEFAULT '{}'::jsonb,
            experience_details JSONB DEFAULT '{}'::jsonb,
            transport_pricing JSONB DEFAULT '[]'::jsonb,
            logistics JSONB DEFAULT '{}'::jsonb,
            itinerary JSONB DEFAULT '[]'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
        );

        CREATE INDEX IF NOT EXISTS products_supplier_id_idx ON public.products(supplier_id);

        -- 2. Create Notifications Table
        CREATE TABLE IF NOT EXISTS public.notifications (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id TEXT NOT NULL,
            type TEXT DEFAULT 'INFO',
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
        );

        CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
        `;

        await client.query(query);
        console.log("Tables created successfully!");
    } catch (err) {
        console.error("Error creating tables:", err);
    } finally {
        await client.end();
    }
}

run();
