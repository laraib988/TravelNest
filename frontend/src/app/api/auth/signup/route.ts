import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Define a strict schema for incoming data to prevent XSS and malformed payloads
const signupSchema = z.object({
  email: z.string().email("Invalid email format").max(255, "Email is too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password is too long"),
  // Only allow letters, spaces, hyphens, and apostrophes to prevent script injection (XSS)
  name: z.string().min(2, "Name must be at least 2 characters").max(100).regex(/^[a-zA-Z\s\-\']+$/, "Name contains invalid characters. No HTML or scripts allowed."),
  role: z.enum(['CUSTOMER', 'SUPPLIER', 'ADMIN']).default('CUSTOMER'),
  kycData: z.record(z.string(), z.any()).optional(), // Ensure it's an object if provided
});

export async function POST(request: Request) {
  try {
    const rawData = await request.json();
    
    // Validate and sanitize input
    const validationResult = signupSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      // Return 400 Bad Request with specific validation errors
      return NextResponse.json({ 
        error: 'Strict Validation Failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }

    const { email, password, name, role, kycData } = validationResult.data;

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

    // --- STEP 6: ACTION AUDIT LOGGING ---
    try {
      const { logAuditAction } = await import('@/lib/audit');
      await logAuditAction({
        actorId: data.user?.id || 'SYSTEM',
        actorRole: role,
        action: 'USER_SIGNUP',
        entityId: data.user?.id,
        entityType: 'USER',
        details: { email, role, hasKyc: !!kycData },
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1'
      });
    } catch (auditErr) {}
    // ------------------------------------

    return NextResponse.json({ message: 'User created successfully', user: data.user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
