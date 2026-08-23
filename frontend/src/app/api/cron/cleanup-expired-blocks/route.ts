import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  // Verify Vercel Cron Secret for security
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase keys' }, { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Fetch products that have an availability block
    const { data: expiredProducts, error } = await supabaseAdmin
      .from('products')
      .select('id, logistics')
      .not('logistics->availability_block->>blockTo', 'is', null);

    if (error) throw error;

    const today = new Date();
    
    // Filter products whose blockTo date is in the past
    const toClean = expiredProducts?.filter((p) => {
      const blockTo = new Date(p.logistics.availability_block.blockTo);
      return blockTo < today;
    }) ?? [];

    // Perform individual updates for the expired products
    // Note: Instead of doing it in public GET request, this happens securely in a cron
    for (const p of toClean) {
      await supabaseAdmin
        .from('products')
        .update({ logistics: { ...p.logistics, availability_block: null } })
        .eq('id', p.id);
    }

    return NextResponse.json({ success: true, cleaned: toClean.length });
  } catch (err: any) {
    console.error('Error in cleanup cron:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
