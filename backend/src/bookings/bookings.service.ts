import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RedisLockService } from '../availability/redis-lock.service';
import { dbStore, BookingRecord } from '../mock-db/db.store';

@Injectable()
export class BookingsService {
  constructor(private readonly redisLockService: RedisLockService) {}

  public async createBooking(payload: {
    hold_id: string;
    option_id?: string;
    lead_name: string;
    lead_email: string;
    lead_phone: string;
    special_requirements?: string;
    payment_token?: string;
  }): Promise<BookingRecord> {
    const hold = this.redisLockService.consumeHoldForBooking(payload.hold_id);

    const slot = dbStore.availabilitySlots.find((s) => s.id === hold.slot_id);
    if (!slot) throw new NotFoundException('Slot not found');

    const listing = dbStore.listings.find((l) => l.id === slot.listing_id);
    if (!listing) throw new NotFoundException('Listing not found');

    const selectedOpt = listing.options.find((o) => o.id === (payload.option_id || hold.option_id)) || listing.options[0];
    const pricePerPerson = selectedOpt ? selectedOpt.price : listing.base_price;

    const grossAmount = pricePerPerson * hold.quantity;
    const platformFee = Number((grossAmount * 0.15).toFixed(2));
    const supplierPayout = Number((grossAmount - platformFee).toFixed(2));

    const bookingRef = `TN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const booking: BookingRecord = {
      id: `book-${Date.now()}`,
      booking_reference: bookingRef,
      customer_id: 'cust-current-user',
      listing_id: listing.id,
      option_id: selectedOpt.id,
      option_name: selectedOpt.name,
      slot_id: slot.id,
      slot_start_time: slot.start_time,
      total_travelers: hold.quantity,
      gross_amount: grossAmount,
      platform_fee: platformFee,
      supplier_payout: supplierPayout,
      currency: listing.currency,
      status: 'CONFIRMED',
      confirmation_type: listing.confirmation_type,
      qr_voucher_code: `TN-QR-${listing.slug.substring(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
      traveler_details: {
        lead_name: payload.lead_name,
        lead_email: payload.lead_email,
        lead_phone: payload.lead_phone,
        special_requirements: payload.special_requirements,
      },
      payment_intent_id: payload.payment_token || `pi_sim_${Math.random().toString(36).substring(7)}`,
      created_at: new Date().toISOString(),
    };

    dbStore.bookings.push(booking);
    return booking;
  }

  public getBookingByReference(reference: string): BookingRecord {
    const b = dbStore.bookings.find((record) => record.booking_reference === reference || record.id === reference);
    if (!b) throw new NotFoundException('Booking reference not found');
    return b;
  }

  public getSupplierBookings(supplierId = 'sup-oceanic-tours'): BookingRecord[] {
    return dbStore.bookings;
  }
}
