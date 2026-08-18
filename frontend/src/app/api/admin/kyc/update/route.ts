import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function PATCH(request: Request) {
  try {
    const { supplierId, status, newReason } = await request.json();
    
    if (!supplierId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

    let updatePayload: any = { status, updated_at: new Date().toISOString() };

    if (newReason) {
      const { data: currData } = await supabaseAdmin
        .from('supplier_kyc_records')
        .select('audit_reasons')
        .eq('user_id', supplierId)
        .single();
        
      const existingReasons = currData?.audit_reasons || [];
      updatePayload.audit_reasons = [...existingReasons, newReason];
    }

    const { data, error } = await supabaseAdmin
      .from('supplier_kyc_records')
      .update(updatePayload)
      .eq('user_id', supplierId)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // CREATE REAL-TIME NOTIFICATION
    let notifType = 'KYC_ALERT';
    let notifTitle = 'Account Status Updated';
    let notifMsg = 'Your account status has been updated.';

    if (status === 'APPROVED') {
      notifTitle = 'Account Approved & Verified!';
      notifMsg = 'Your supplier account has been fully approved. You can now publish your listings to the marketplace.';
    } else if (status === 'CHANGES_REQUESTED') {
      notifTitle = 'Action Required: Fix Requested';
      notifMsg = `Admin requested a fix: "${newReason || 'Please check your submitted documents and re-upload.'}"`;
    } else if (status === 'REJECTED') {
      notifTitle = 'Account Application Rejected';
      notifMsg = 'Unfortunately, your supplier account application has been rejected.';
    } else if (status === 'SUSPENDED') {
      notifTitle = 'Account Banned';
      notifMsg = `Your account has been banned. Reason: "${newReason || 'Violation of our Terms of Service or fraudulent activity detected.'}" Please contact support to appeal.`;
    }

    // Insert notification using service role
    await supabaseAdmin.from('notifications').insert({
      user_id: supplierId,
      type: notifType,
      title: notifTitle,
      message: notifMsg,
      is_read: false
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
