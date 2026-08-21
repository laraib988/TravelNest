import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Define a strict schema for incoming data to prevent XSS and malformed payloads
const signupSchema = z.object({
  email: z.string().email("Invalid email format").max(255, "Email is too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password is too long"),
  // Allow letters, spaces, hyphens, apostrophes, and numbers (for names like "John2")
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.enum(['CUSTOMER', 'SUPPLIER', 'ADMIN']).default('CUSTOMER'),
  kycData: z.record(z.string(), z.any()).optional(),
});

export async function POST(request: Request) {
  try {
    const rawData = await request.json();
    
    const validationResult = signupSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      const messages: string[] = [];
      const formatted = validationResult.error.format();
      for (const key in formatted) {
        if (key !== '_errors') {
          const fieldErrors = (formatted as any)[key]?._errors;
          if (fieldErrors && fieldErrors.length > 0) {
            messages.push(`${key}: ${fieldErrors[0]}`);
          }
        }
      }
      return NextResponse.json({ 
        error: messages.length > 0 ? messages.join(', ') : 'Validation failed. Please check your inputs.',
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

    // 1. Create the auth user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0284c7&color=fff&size=200`
      }
    });

    if (error) {
      if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already been registered')) {
        return NextResponse.json({ error: 'A user with this email address has already been registered.' }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const userId = data.user.id;

    // 2. Upsert the profiles row (needed for FK constraints in other tables)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        email,
        name,
        role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0284c7&color=fff&size=200`,
        created_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (profileError) {
      console.warn('Profile upsert warning (non-fatal):', profileError.message);
    }

    // 3. If SUPPLIER with KYC data, insert KYC record (server-side with service key, so RLS is bypassed)
    if (role === 'SUPPLIER' && kycData) {
      // Check if a KYC record already exists for this user to avoid duplicate inserts
      const { data: existingKyc } = await supabaseAdmin
        .from('supplier_kyc_records')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!existingKyc) {
        const { error: kycError } = await supabaseAdmin
          .from('supplier_kyc_records')
          .insert({
            user_id: userId,
            company_name: kycData.companyName,
            business_type: kycData.partnerType,
            location: kycData.location,
            phone: kycData.phone,
            currency: kycData.currency,
            business_reg: kycData.business_reg || 'N/A',
            tax_id: kycData.tax_id || 'N/A',
            documents: kycData.documents || [],
            status: 'PENDING'
          });
          
        if (kycError) {
          console.error('KYC insert failed:', kycError.message);
          // User was created — do not block. Log and continue.
        }
      }
    }

    // 4. Audit log
    try {
      const { logAuditAction } = await import('@/lib/audit');
      await logAuditAction({
        actorId: userId,
        actorRole: role,
        action: 'USER_SIGNUP',
        entityId: userId,
        entityType: 'USER',
        details: { email, role, hasKyc: !!kycData },
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1'
      });
    } catch (auditErr) {}

    return NextResponse.json({ message: 'User created successfully', user: data.user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
