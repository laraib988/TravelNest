import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function PATCH(request: Request) {
  try {
    const { userId, status, location, phone, business_reg, tax_id, new_document_name } = await request.json();
    
    if (!userId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

    const updatePayload: any = { status, updated_at: new Date().toISOString() };
    if (location) updatePayload.location = location;
    if (phone) updatePayload.phone = phone;
    if (business_reg) updatePayload.business_reg = business_reg;
    if (tax_id) updatePayload.tax_id = tax_id;

    if (new_document_name) {
      const { data: currData } = await supabaseAdmin
        .from('supplier_kyc_records')
        .select('documents')
        .eq('user_id', userId)
        .single();
        
      const existingDocs = currData?.documents || [];
      const newDoc = {
        doc_id: `doc-${Date.now()}-fixed`,
        doc_type: 'Updated Document (Fix)',
        file_name: new_document_name,
        status: 'PENDING'
      };
      
      updatePayload.documents = [...existingDocs, newDoc];
    }

    const { data, error } = await supabaseAdmin
      .from('supplier_kyc_records')
      .update(updatePayload)
      .eq('user_id', userId)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
