import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.loyalty_history (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        customer_id UUID NOT NULL,
        amount INTEGER NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS loyalty_history_customer_id_idx ON public.loyalty_history(customer_id);
      
      ALTER TABLE public.loyalty_history ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow all access to loyalty history" ON public.loyalty_history;
      CREATE POLICY "Allow all access to loyalty history" ON public.loyalty_history FOR ALL USING (true) WITH CHECK (true);
    `;

    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: createTableSQL })
    });

    return NextResponse.json({ success: true, text: await res.text() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
