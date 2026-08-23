import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

    const { data, error } = await supabaseAdmin.from('products').select('id, supplier_id, status, logistics');
    if (error) throw error;

    const live = data.find(p => (p.status === 'LIVE' || p.status === 'PUBLISHED') && p.basic_info?.title?.includes('Mount Fuji'));
    const clones = data.filter(p => (p.status === 'DRAFT' || p.status === 'PENDING_APPROVAL') && p.basic_info?.title?.includes('Mount Fuji'));

    const updates = [];
    if (live && clones.length > 0) {
      for (const clone of clones) {
         const logistics = clone.logistics || {};
         logistics.parent_id = live.id;
         await supabaseAdmin.from('products').update({ logistics }).eq('id', clone.id);
         updates.push(`Fixed clone ${clone.id}`);
      }
    }

    return NextResponse.json({ success: true, liveId: live?.id, updates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
