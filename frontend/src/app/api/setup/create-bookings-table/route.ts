import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
    }

    // Use the Supabase REST API to run SQL via the rpc endpoint
    // First, try creating the table using fetch to the Supabase SQL endpoint
    const sqlQuery = `
      CREATE TABLE IF NOT EXISTS public.bookings (
        id TEXT PRIMARY KEY,
        booking_reference TEXT NOT NULL,
        customer_id TEXT NOT NULL,
        supplier_id TEXT NOT NULL,
        listing_id TEXT NOT NULL,
        option_id TEXT NOT NULL,
        option_name TEXT,
        slot_id TEXT NOT NULL,
        slot_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
        total_travelers INTEGER NOT NULL,
        gross_amount NUMERIC NOT NULL,
        platform_fee NUMERIC NOT NULL,
        supplier_payout NUMERIC NOT NULL,
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'CONFIRMED',
        confirmation_type TEXT DEFAULT 'INSTANT',
        qr_voucher_code TEXT,
        traveler_details JSONB DEFAULT '{}'::jsonb,
        payment_intent_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
      CREATE INDEX IF NOT EXISTS bookings_supplier_id_idx ON public.bookings(supplier_id);
      CREATE INDEX IF NOT EXISTS bookings_customer_id_idx ON public.bookings(customer_id);
    `;

    // Use the Supabase Management API (pg endpoint) via service role
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ query: sqlQuery }),
    });

    // If RPC doesn't work, try direct SQL via the pg-meta endpoint
    if (!res.ok) {
      // Alternative: Use the /pg endpoint which is available on Supabase
      const pgRes = await fetch(`${supabaseUrl}/pg/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ query: sqlQuery }),
      });

      if (!pgRes.ok) {
        // Last resort: return the SQL for manual execution
        return NextResponse.json({ 
          error: 'Auto-creation failed. Table must be created manually.',
          sql: sqlQuery,
          instructions: 'Please run this SQL in your Supabase Dashboard > SQL Editor'
        }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Bookings table created successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
