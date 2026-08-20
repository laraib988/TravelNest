import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const getSupabaseAdmin = () => createClient(supabaseUrl, supabaseServiceKey);

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action } = body; // 'approve', 'reject', 'cancel'

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    let newStatus = booking.status;

    if (action === 'approve') {
      if (booking.status !== 'PENDING_SUPPLIER_APPROVAL') {
        return NextResponse.json({ error: 'Booking is not pending approval' }, { status: 400 });
      }
      newStatus = 'CONFIRMED';
    } else if (action === 'reject') {
      if (booking.status !== 'PENDING_SUPPLIER_APPROVAL') {
        return NextResponse.json({ error: 'Booking is not pending approval' }, { status: 400 });
      }
      newStatus = 'REJECTED';
    } else if (action === 'cancel') {
      if (booking.payment_status === 'PAID') {
        newStatus = 'CANCELLED_REFUND_PENDING';
      } else {
        newStatus = 'CANCELLED';
      }
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Loyalty reward: credit 100 points to the customer when a booking is confirmed.
    if (newStatus === 'CONFIRMED' && booking.customer_id) {
      try {
        await supabaseAdmin.rpc('credit_loyalty_points', {
          p_user_id: booking.customer_id,
          p_amount: 100,
        });
      } catch (loyaltyErr) {
        // Fall back to a direct increment if the RPC does not exist.
        try {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('loyalty_points')
            .eq('id', booking.customer_id)
            .maybeSingle();
          const current = profile?.loyalty_points || 0;
          await supabaseAdmin
            .from('profiles')
            .update({ loyalty_points: current + 100, updated_at: new Date().toISOString() })
            .eq('id', booking.customer_id);
        } catch (e) {
          console.error('Failed to credit loyalty points:', e);
        }
      }
    }

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error: any) {
    console.error('Error updating booking status:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
