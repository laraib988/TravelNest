import { NextResponse } from 'next/server';

export async function GET() {
  const projectRef = 'vozgnbqjqiaabkrpniqb';
  
  const sql = encodeURIComponent(`CREATE TABLE IF NOT EXISTS public.bookings (
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
  payment_status TEXT DEFAULT 'PAID',
  payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- In case the table already exists, safely add the new column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='payment_status') THEN
        ALTER TABLE public.bookings ADD COLUMN payment_status TEXT DEFAULT 'PAID';
    END IF;
END $$;
`);

  // Redirect user to Supabase SQL editor with the query pre-filled
  const supabaseUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new?content=${sql}`;
  
  return NextResponse.redirect(supabaseUrl);
}
