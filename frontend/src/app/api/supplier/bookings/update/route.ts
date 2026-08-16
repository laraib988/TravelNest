import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, status, supplierId } = body;

    if (!bookingId || !status || !supplierId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Update the booking status
    const { data: booking, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 2. Create a notification for the supplier
    const notificationTitle = status === 'CONFIRMED' ? 'Booking Approved!' : 'Booking Rejected';
    const notificationMessage = status === 'CONFIRMED' 
      ? `You have successfully approved the booking for "${booking?.traveler_details?.tour_name || 'a tour'}" (Ref: ${booking?.booking_reference}).`
      : `You have rejected the booking for "${booking?.traveler_details?.tour_name || 'a tour'}" (Ref: ${booking?.booking_reference}).`;

    const { error: notifError } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: supplierId,
        type: status === 'CONFIRMED' ? 'SUCCESS' : 'INFO',
        title: notificationTitle,
        message: notificationMessage,
        is_read: false
      });

    if (notifError) {
      console.error('Error creating supplier notification:', notifError);
    }

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error('Error in booking update API:', error);
    return NextResponse.json({ error: error.message || 'Failed to update booking' }, { status: 500 });
  }
}
