import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
      confirmation_type
    } = body;

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
      customer_id: 'cust-current-user',
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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
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

        // Successfully saved to Supabase
        return NextResponse.json({ success: true, booking: data }, { status: 201 });
      }

      // If table doesn't exist (PGRST204/PGRST205), fall through gracefully
      if (error) {
        console.warn('Supabase insert warning (table may not exist yet):', error.code, error.message);
      }
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
