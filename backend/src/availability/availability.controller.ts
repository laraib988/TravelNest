import { Controller, Post, Body, Get, Param, BadRequestException } from '@nestjs/common';
import { RedisLockService } from './redis-lock.service';
import { dbStore } from '../mock-db/db.store';

@Controller('api/v1/availability')
export class AvailabilityController {
  constructor(private readonly redisLockService: RedisLockService) {}

  @Get('slots/:listingId')
  getSlotsForListing(@Param('listingId') listingId: string) {
    const listing = dbStore.listings.find((l) => l.id === listingId || l.slug === listingId);
    if (!listing) return [];
    return dbStore.availabilitySlots.filter((s) => s.listing_id === listing.id);
  }

  @Post('hold')
  createInventoryHold(@Body() body: { slot_id: string; option_id?: string; quantity: number }) {
    if (!body.slot_id || !body.quantity || body.quantity <= 0) {
      throw new BadRequestException('slot_id and valid positive quantity are required');
    }
    return this.redisLockService.acquireHold(body.slot_id, body.option_id || 'opt-101-adult', body.quantity, 900);
  }
}
