import { Module } from '@nestjs/common';
import { ListingsController } from './listings/listings.controller';
import { VectorSearchService } from './listings/vector-search.service';
import { AvailabilityController } from './availability/availability.controller';
import { RedisLockService } from './availability/redis-lock.service';
import { BookingsController } from './bookings/bookings.controller';
import { BookingsService } from './bookings/bookings.service';
import { KYCController } from './kyc/kyc.controller';
import { KYCService } from './kyc/kyc.service';
import { PayoutsController } from './payouts/payouts.controller';
import { PayoutEngineService } from './payouts/payout-engine.service';
import { AIPlannerController } from './ai-planner/ai-planner.controller';
import { AIPlannerService } from './ai-planner/ai-planner.service';

@Module({
  imports: [],
  controllers: [
    ListingsController,
    AvailabilityController,
    BookingsController,
    KYCController,
    PayoutsController,
    AIPlannerController,
  ],
  providers: [
    VectorSearchService,
    RedisLockService,
    BookingsService,
    KYCService,
    PayoutEngineService,
    AIPlannerService,
  ],
})
export class AppModule {}
