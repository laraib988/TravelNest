import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ReviewsController } from './reviews/reviews.controller';
import { ReviewsService } from './reviews/reviews.service';
import { PromotionsController } from './promotions/promotions.controller';
import { PromotionsService } from './promotions/promotions.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
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
import { AffiliateController } from './affiliate/affiliate.controller';
import { AffiliateService } from './affiliate/affiliate.service';

@Module({
  imports: [],
  controllers: [
    AuthController,
    ReviewsController,
    PromotionsController,
    UsersController,
    ListingsController,
    AvailabilityController,
    BookingsController,
    KYCController,
    PayoutsController,
    AIPlannerController,
    AffiliateController,
  ],
  providers: [
    AuthService,
    ReviewsService,
    PromotionsService,
    UsersService,
    VectorSearchService,
    RedisLockService,
    BookingsService,
    KYCService,
    PayoutEngineService,
    AIPlannerService,
    AffiliateService,
  ],
})
export class AppModule {}
