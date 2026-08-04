import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { dbStore, BookingHold } from '../mock-db/db.store';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RedisLockService {
  public acquireHold(slotId: string, optionId = 'opt-101-adult', quantity: number, ttlSeconds = 900): { hold_id: string; expires_at: number } {
    const slot = dbStore.availabilitySlots.find((s) => s.id === slotId);
    if (!slot) throw new NotFoundException('Availability slot not found');

    const currentAvailable = slot.total_capacity - (slot.booked_capacity + slot.held_capacity);
    if (quantity > currentAvailable) {
      throw new ConflictException(`Only ${currentAvailable} slots remaining for this date/time`);
    }

    slot.held_capacity += quantity;

    const holdId = `hold_${uuidv4().substring(0, 8)}`;
    const expiresAt = Date.now() + ttlSeconds * 1000;

    const hold: BookingHold = {
      hold_id: holdId,
      slot_id: slotId,
      option_id: optionId,
      quantity,
      expires_at: expiresAt,
    };

    dbStore.activeHolds.set(holdId, hold);

    setTimeout(() => {
      this.releaseHoldIfExpired(holdId);
    }, ttlSeconds * 1000);

    return { hold_id: holdId, expires_at: expiresAt };
  }

  public releaseHoldIfExpired(holdId: string) {
    const hold = dbStore.activeHolds.get(holdId);
    if (!hold) return;

    if (Date.now() >= hold.expires_at) {
      const slot = dbStore.availabilitySlots.find((s) => s.id === hold.slot_id);
      if (slot) {
        slot.held_capacity = Math.max(0, slot.held_capacity - hold.quantity);
      }
      dbStore.activeHolds.delete(holdId);
    }
  }

  public consumeHoldForBooking(holdId: string): BookingHold {
    const hold = dbStore.activeHolds.get(holdId);
    if (!hold) throw new ConflictException('Hold token invalid or expired. Please re-select your ticket.');

    if (Date.now() > hold.expires_at) {
      this.releaseHoldIfExpired(holdId);
      throw new ConflictException('Hold token expired. Inventory released.');
    }

    const slot = dbStore.availabilitySlots.find((s) => s.id === hold.slot_id);
    if (slot) {
      slot.held_capacity = Math.max(0, slot.held_capacity - hold.quantity);
      slot.booked_capacity += hold.quantity;
    }

    dbStore.activeHolds.delete(holdId);
    return hold;
  }
}
