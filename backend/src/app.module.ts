import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import * as redisStore from 'cache-manager-redis-store';
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
import { TravelAgentService } from './ai-planner/travel-agent.service';
import { SupabaseDataService } from './ai-planner/supabase-data.service';
import { AffiliateController } from './affiliate/affiliate.controller';
import { AffiliateService } from './affiliate/affiliate.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      ttl: 300, // 5 minutes
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100, // 100 requests per minute per IP
    }]),
  ],
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
    AdminController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
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
    TravelAgentService,
    SupabaseDataService,
    AffiliateService,
    AdminService,
  ],
})
export class AppModule {}
