import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendBookingEmails } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      listing_id, 
      listing_title,
      supplier_id, 
      option_id, 
      option_name, 
      slot_start_time, 
      total_travelers, 
      gross_amount, 
      currency,
      lead_name,
      lead_email,
      lead_phone,
      special_requirements,
      pickup_time,
      pickup_location,
      dropoff_location,
      payment_token,
      payment_status,
      confirmation_type,
      verified_user_id,
      new_account_credentials
    } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Resolve the authenticated user (if any) so the booking is linked to a real profile.
    // Priority: explicit verified_user_id (from checkout OTP flow) > Bearer token > none
    let customerId: string | null = verified_user_id ? String(verified_user_id) : null;
    if (supabaseUrl && supabaseServiceKey && !customerId) {
      const authHeader = request.headers.get('authorization') || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (token) {
        try {
          const authClient = createClient(supabaseUrl, supabaseServiceKey);
          const { data: userData } = await authClient.auth.getUser(token);
          if (userData?.user) customerId = userData.user.id;
        } catch (e) {
          // ignore — fall back to email-based lookup below
        }
      }
    }

    if (!lead_email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const platform_fee = Number(((gross_amount || 0) * 0.15).toFixed(2));
    const supplier_payout = Number(((gross_amount || 0) - platform_fee).toFixed(2));
    
    const booking_reference = `TN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const qr_voucher_code = `TN-QR-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const bookingData: any = {
      id: `book-${Date.now()}`,
      booking_reference,
      customer_id: customerId || 'cust-current-user',
      supplier_id: supplier_id || 'unknown-supplier',
      listing_id: listing_id || 'unknown-listing',
      option_id: option_id || 'opt-default',
      option_name: option_name || 'Standard Option',
      slot_id: 'slot-custom',
      slot_start_time: slot_start_time || new Date().toISOString(),
      total_travelers: Number(total_travelers) || 1,
      gross_amount: Number(gross_amount) || 0,
      platform_fee,
      supplier_payout,
      currency: currency || 'USD',
      status: confirmation_type === 'MANUAL' ? 'PENDING_SUPPLIER_APPROVAL' : 'CONFIRMED',
      confirmation_type: confirmation_type === 'MANUAL' ? 'MANUAL' : 'INSTANT',
      qr_voucher_code,
      traveler_details: {
        lead_name: lead_name || 'Guest',
        lead_email,
        lead_phone: lead_phone || '',
        special_requirements: special_requirements || '',
        pickup_time: pickup_time || '',
        pickup_location: pickup_location || '',
        dropoff_location: dropoff_location || '',
        tour_name: listing_title || ''
      },
      payment_status: payment_status || 'PAID',
      payment_intent_id: payment_token || `pi_sim_${Date.now()}`
    };

    // Try inserting into Supabase
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      const { data, error } = await supabaseAdmin
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (!error && data) {
        // Create notification for supplier
        const notificationData = {
          user_id: supplier_id,
          type: 'INFO',
          title: 'New Booking Received!',
          message: `You have received a new booking for "${listing_title || 'a tour'}". Reference: ${booking_reference}`,
          is_read: false
        };
        
        const { error: notifError } = await supabaseAdmin
          .from('notifications')
          .insert(notificationData);
          
        if (notifError) {
          console.error('Failed to create supplier notification:', notifError);
        }

        // Resolve supplier email to notify them of the new order.
        let supplierEmail: string | null = null;
        try {
          const { data: supplierProfile } = await supabaseAdmin
            .from('profiles')
            .select('email')
            .eq('id', supplier_id)
            .maybeSingle();
          if (supplierProfile?.email) {
            supplierEmail = supplierProfile.email;
          } else {
            const { data: supplierUser } = await supabaseAdmin
              .from('users')
              .select('email')
              .eq('id', supplier_id)
              .maybeSingle();
            if (supplierUser?.email) supplierEmail = supplierUser.email;
          }
        } catch (e) {
          console.error('Failed to resolve supplier email:', e);
        }

        // Send confirmation + new order emails (customer + supplier).
        const emailResult = await sendBookingEmails({
          booking_reference,
          qr_voucher_code,
          listing_title,
          option_name,
          slot_start_time,
          total_travelers: Number(total_travelers) || 1,
          gross_amount: Number(gross_amount) || 0,
          currency: currency || 'USD',
          payment_status: payment_status || 'PAID',
          status: data.status,
          confirmation_type: confirmation_type === 'MANUAL' ? 'MANUAL' : 'INSTANT',
          pickup_time: pickup_time || '',
          pickup_location: pickup_location || '',
          dropoff_location: dropoff_location || '',
          lead_name: lead_name || '',
          lead_email: lead_email || '',
          lead_phone: lead_phone || '',
          special_requirements: special_requirements || '',
          supplier_email: supplierEmail || '',
          appUrl: process.env.APP_URL || 'http://localhost:3000',
          newAccountCredentials: new_account_credentials || undefined,
        });
        if (emailResult.errors.length > 0) {
          console.warn('Booking email issues:', emailResult.errors.join('; '));
        }

        // Successfully saved to Supabase
        return NextResponse.json({ success: true, booking: data }, { status: 201 });
      }

      // If table doesn't exist (PGRST204/PGRST205), fall through gracefully
      if (error) {
        console.warn('Supabase insert warning (table may not exist yet):', error.code, error.message);
      }

    // Fallback: Return booking data without database persistence
    // This ensures the checkout flow ALWAYS completes for the user
    bookingData.created_at = new Date().toISOString();
    return NextResponse.json({ success: true, booking: bookingData, persisted: false }, { status: 201 });
  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process booking' }, { status: 500 });
  }
}
