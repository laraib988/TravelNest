import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password, name, role, kycData } = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error: Missing Supabase keys.' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If role is SUPPLIER and we have kycData, insert it into supplier_kyc_records
    if (role === 'SUPPLIER' && kycData) {
      const { error: kycError } = await supabaseAdmin
        .from('supplier_kyc_records')
        .insert({
          user_id: data.user.id,
          company_name: kycData.companyName,
          business_type: kycData.partnerType,
          location: kycData.location,
          phone: kycData.phone,
          currency: kycData.currency,
          business_reg: kycData.business_reg,
          tax_id: kycData.tax_id,
          documents: kycData.documents,
          status: 'PENDING'
        });
        
      if (kycError) {
        console.error('Failed to insert KYC:', kycError);
        // We do not fail the overall request since the user was created successfully
      }
    }

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
