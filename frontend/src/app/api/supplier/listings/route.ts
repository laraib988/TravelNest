import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('supplier_id', userId)
      .neq('status', 'PENDING_DELETION')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Auto-reactivate products whose temporary availability block has expired
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reactivatePromises: Promise<any>[] = [];

    for (const p of products) {
      const block = p.logistics?.availability_block;
      if (block && block.to) {
        const blockTo = new Date(block.to);
        blockTo.setHours(23, 59, 59, 999);
        if (blockTo < today) {
          const updatedLogistics = { ...p.logistics, availability_block: null };
          reactivatePromises.push(
            supabaseAdmin
              .from('products')
              .update({ logistics: updatedLogistics, updated_at: new Date().toISOString() })
              .eq('id', p.id)
              .then(({ error }) => {
                if (error) console.error('Auto-reactivate failed:', error);
              })
          );
          p.logistics = updatedLogistics;
        }
      }
    }

    if (reactivatePromises.length > 0) {
      await Promise.all(reactivatePromises);
    }

    const clones = products.filter(p => p.logistics?.parent_id);
    const parents = products.filter(p => !p.logistics?.parent_id);

    const mappedListings = parents.map(p => {
      let minPriceAmount = 0;
      let pricingType = 'per person';

      if (p.transport_pricing && p.transport_pricing.length > 0) {
        const minOption = p.transport_pricing.reduce((min: any, current: any) => {
          return parseFloat(current.amount || '0') < parseFloat(min.amount || '0') ? current : min;
        });
        minPriceAmount = parseFloat(minOption.amount || '0');
        pricingType = (minOption.pricingType || 'per person').toLowerCase();
      }

      const displayPrice = p.transport_pricing && p.transport_pricing.length > 0 
        ? `$${minPriceAmount} ${pricingType}`
        : '$0 per person';

      const validHeroImage = p.basic_info?.photos?.heroImage?.startsWith('blob:') 
          ? null 
          : p.basic_info?.photos?.heroImage;

      // Handle conceptual merging of edits
      const pendingClone = clones.find(c => c.logistics.parent_id === p.id && (c.status === 'PENDING_APPROVAL' || c.status === 'DRAFT'));
      let displayStatus = p.status;
      let editUrlId = p.id;

      if (pendingClone) {
        displayStatus = 'EDIT_PENDING';
        editUrlId = pendingClone.id; // When they click edit, take them to the draft clone
      }

      return {
        id: p.id,
        editUrlId,
        title: p.basic_info?.title || 'Draft Listing',
        image: validHeroImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
        price: displayPrice,
        status: displayStatus,
        lastUpdated: new Date(p.updated_at).toLocaleDateString(),
        admin_feedback: p.logistics?.admin_feedback || null,
        availability_block: p.logistics?.availability_block || null
      };
    });

    return NextResponse.json(mappedListings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
