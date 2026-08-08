const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'backend', 'src');

const updateDbStore = () => {
    const dbPath = path.join(baseDir, 'mock-db', 'db.store.ts');
    let dbContent = fs.readFileSync(dbPath, 'utf8');

    const interfaces = `
export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string;
  role: 'CUSTOMER' | 'SUPPLIER' | 'ADMIN' | 'BLOG_WRITER';
  avatar: string;
  home_country: string;
  preferred_currency: string;
  preferred_language: string;
  saved_travelers: Array<{ name: string; age_type: string; passport_number?: string }>;
  wishlist_listing_ids: string[];
  loyalty_points: number;
  membership_tier: 'BRONZE' | 'SILVER' | 'GOLD';
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  listing_id: string;
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  helpful_count: number;
  supplier_reply?: { text: string; replied_at: string };
  ai_fraud_score: number;
  status: 'PUBLISHED' | 'PENDING' | 'FLAGGED' | 'REMOVED';
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  min_spend: number;
  max_discount?: number;
  valid_from: string;
  valid_to: string;
  usage_limit: number;
  used_count: number;
  applicable_categories: string[];
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'REVIEW_REQUEST' | 'PRICE_DROP' | 'PROMO' | 'SYSTEM';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
}
`;

    const mockData = `
  users: User[] = [
    {
      id: 'cust-1',
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: 'mockhash',
      phone: '+1 555-1234',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      home_country: 'US',
      preferred_currency: 'USD',
      preferred_language: 'en',
      saved_travelers: [{ name: 'John Doe', age_type: 'ADULT' }],
      wishlist_listing_ids: ['list-bali-sunset', 'list-paris-louvre'],
      loyalty_points: 1500,
      membership_tier: 'SILVER',
      created_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'sup-1',
      name: 'Supplier Alice',
      email: 'alice@oceanic.com',
      password_hash: 'mockhash',
      phone: '+1 555-5678',
      role: 'SUPPLIER',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      home_country: 'ID',
      preferred_currency: 'USD',
      preferred_language: 'en',
      saved_travelers: [],
      wishlist_listing_ids: [],
      loyalty_points: 0,
      membership_tier: 'BRONZE',
      created_at: '2025-05-15T00:00:00Z'
    },
    {
      id: 'admin-1',
      name: 'Admin Bob',
      email: 'admin@travelnest.com',
      password_hash: 'mockhash',
      phone: '+1 555-9999',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
      home_country: 'US',
      preferred_currency: 'USD',
      preferred_language: 'en',
      saved_travelers: [],
      wishlist_listing_ids: [],
      loyalty_points: 0,
      membership_tier: 'BRONZE',
      created_at: '2025-01-01T00:00:00Z'
    }
  ];

  reviews: Review[] = [
    {
      id: 'rev-1',
      booking_id: 'book-901',
      user_id: 'cust-1',
      user_name: 'John Doe',
      user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-bali-sunset',
      rating: 5,
      title: 'Amazing experience',
      comment: 'The sunset was beautiful and the seafood was delicious!',
      photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80'],
      helpful_count: 12,
      ai_fraud_score: 5,
      status: 'PUBLISHED',
      created_at: '2026-08-02T10:00:00Z'
    },
    {
      id: 'rev-2',
      booking_id: 'book-902',
      user_id: 'cust-2',
      user_name: 'Jane Smith',
      user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-paris-louvre',
      rating: 4,
      title: 'Great tour but crowded',
      comment: 'Loved the guide, but the Mona Lisa room was very crowded.',
      photos: [],
      helpful_count: 5,
      supplier_reply: { text: 'Thank you for your feedback! It can get busy during peak hours.', replied_at: '2026-08-03T10:00:00Z' },
      ai_fraud_score: 2,
      status: 'PUBLISHED',
      created_at: '2026-08-01T14:00:00Z'
    },
    {
      id: 'rev-3',
      booking_id: 'book-903',
      user_id: 'cust-3',
      user_name: 'Ahmed',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-lahore-walled-city',
      rating: 5,
      title: 'Rich history',
      comment: 'Walking through the old city felt magical.',
      photos: [],
      helpful_count: 8,
      ai_fraud_score: 1,
      status: 'PUBLISHED',
      created_at: '2026-07-28T09:00:00Z'
    },
    {
      id: 'rev-4',
      booking_id: 'book-904',
      user_id: 'cust-4',
      user_name: 'Maria G',
      user_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-dubai-desert-safari',
      rating: 5,
      title: 'Thrilling ride',
      comment: 'The dune bashing was intense but very fun!',
      photos: [],
      helpful_count: 3,
      ai_fraud_score: 4,
      status: 'PUBLISHED',
      created_at: '2026-07-29T11:00:00Z'
    },
    {
      id: 'rev-5',
      booking_id: 'book-905',
      user_id: 'cust-5',
      user_name: 'Luigi',
      user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-rome-colosseum',
      rating: 3,
      title: 'Very hot weather',
      comment: 'Good tour but too hot in summer, provide more water.',
      photos: [],
      helpful_count: 2,
      ai_fraud_score: 0,
      status: 'PUBLISHED',
      created_at: '2026-07-30T16:00:00Z'
    },
    {
      id: 'rev-6',
      booking_id: 'book-906',
      user_id: 'cust-6',
      user_name: 'Sarah',
      user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-bali-sunset',
      rating: 4,
      title: 'Nice music',
      comment: 'Enjoyed the acoustic sets.',
      photos: [],
      helpful_count: 4,
      ai_fraud_score: 1,
      status: 'PUBLISHED',
      created_at: '2026-08-01T20:00:00Z'
    },
    {
      id: 'rev-7',
      booking_id: 'book-907',
      user_id: 'cust-7',
      user_name: 'Tom',
      user_avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-paris-louvre',
      rating: 5,
      title: 'A must do in Paris',
      comment: 'Highly recommended for art lovers.',
      photos: [],
      helpful_count: 7,
      ai_fraud_score: 2,
      status: 'PUBLISHED',
      created_at: '2026-08-02T12:00:00Z'
    },
    {
      id: 'rev-8',
      booking_id: 'book-908',
      user_id: 'cust-8',
      user_name: 'Emily',
      user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      listing_id: 'list-dubai-desert-safari',
      rating: 5,
      title: 'Perfect evening',
      comment: 'BBQ was great and entertainment was superb.',
      photos: [],
      helpful_count: 10,
      ai_fraud_score: 3,
      status: 'PUBLISHED',
      created_at: '2026-08-03T22:00:00Z'
    }
  ];

  coupons: Coupon[] = [
    { id: 'coup-1', code: 'WELCOME20', type: 'PERCENTAGE', value: 20, min_spend: 50, max_discount: 40, valid_from: '2026-08-01T00:00:00Z', valid_to: '2026-08-31T23:59:59Z', usage_limit: 1000, used_count: 150, applicable_categories: [] },
    { id: 'coup-2', code: 'SUMMER15', type: 'PERCENTAGE', value: 15, min_spend: 100, max_discount: 50, valid_from: '2026-06-01T00:00:00Z', valid_to: '2026-08-31T23:59:59Z', usage_limit: 500, used_count: 320, applicable_categories: ['cat-tours', 'cat-tickets'] },
    { id: 'coup-3', code: 'FLASH50', type: 'FIXED', value: 50, min_spend: 200, valid_from: '2026-08-05T00:00:00Z', valid_to: '2026-08-10T23:59:59Z', usage_limit: 100, used_count: 45, applicable_categories: [] },
    { id: 'coup-4', code: 'TRAVEL10', type: 'PERCENTAGE', value: 10, min_spend: 0, max_discount: 25, valid_from: '2026-01-01T00:00:00Z', valid_to: '2026-12-31T23:59:59Z', usage_limit: 5000, used_count: 1200, applicable_categories: [] }
  ];

  notifications: Notification[] = [
    { id: 'notif-1', user_id: 'cust-1', type: 'BOOKING_CONFIRMED', title: 'Booking Confirmed', message: 'Your booking for Bali Sunset Catamaran is confirmed.', link: '/bookings/book-901', read: false, created_at: '2026-08-01T10:15:00Z' },
    { id: 'notif-2', user_id: 'cust-1', type: 'SYSTEM', title: 'Welcome to TravelNest!', message: 'Explore the best tours around the world.', read: true, created_at: '2026-01-01T00:00:00Z' },
    { id: 'notif-3', user_id: 'cust-1', type: 'PROMO', title: 'Summer Sale!', message: 'Use code SUMMER15 for 15% off.', read: false, created_at: '2026-08-01T00:00:00Z' },
    { id: 'notif-4', user_id: 'cust-1', type: 'PRICE_DROP', title: 'Price drop on your wishlist', message: 'Louvre Museum tour has a 10% discount.', link: '/listings/list-paris-louvre', read: false, created_at: '2026-08-03T10:00:00Z' },
    { id: 'notif-5', user_id: 'cust-1', type: 'REVIEW_REQUEST', title: 'How was your trip?', message: 'Leave a review for your recent Bali trip.', link: '/reviews/book-901', read: false, created_at: '2026-08-06T10:00:00Z' }
  ];
`;

    if (!dbContent.includes('export interface User')) {
        dbContent = dbContent.replace('class MockDatabaseStore {', interfaces + '\\nclass MockDatabaseStore {');
    }
    
    if (!dbContent.includes('users: User[] =')) {
        dbContent = dbContent.replace('bookings: BookingRecord[] = [', mockData + '\\n  bookings: BookingRecord[] = [');
    }

    fs.writeFileSync(dbPath, dbContent);
};

const createModuleFiles = () => {
    const modules = {
        auth: {
            controller: `import { Controller, Post, Get, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    const { name, email, password } = body;
    if (!name || !email || !password) throw new BadRequestException('Missing fields');
    return this.authService.register(name, email, password);
  }

  @Post('login')
  login(@Body() body: any) {
    const { email, password } = body;
    const result = this.authService.login(email, password);
    if (!result) throw new UnauthorizedException('Invalid credentials');
    return result;
  }

  @Post('refresh')
  refresh() {
    return { access_token: this.authService.generateToken('cust-1') };
  }

  @Get('me')
  getMe() {
    return this.authService.getMe();
  }
}
`,
            service: `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { dbStore } from '../mock-db/db.store';

@Injectable()
export class AuthService {
  register(name: string, email: string, password: string) {
    const newUser = {
      id: 'user-' + Date.now(),
      name,
      email,
      password_hash: 'hashed_' + password,
      phone: '',
      role: 'CUSTOMER' as const,
      avatar: '',
      home_country: '',
      preferred_currency: 'USD',
      preferred_language: 'en',
      saved_travelers: [],
      wishlist_listing_ids: [],
      loyalty_points: 0,
      membership_tier: 'BRONZE' as const,
      created_at: new Date().toISOString()
    };
    dbStore.users.push(newUser);
    return { access_token: this.generateToken(newUser.id), user: newUser };
  }

  login(email: string, password: string) {
    const user = dbStore.users.find(u => u.email === email);
    if (user && password) {
      return {
        access_token: this.generateToken(user.id),
        refresh_token: 'refresh_mock_token',
        user
      };
    }
    return null;
  }

  generateToken(userId: string) {
    return 'mock_jwt_token_' + userId;
  }

  getMe() {
    return dbStore.users[0]; // always return first customer
  }
}
`
        },
        reviews: {
            controller: `import { Controller, Get, Post, Body, Query, Param, NotFoundException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getReviews(@Query('listing_id') listingId: string) {
    return this.reviewsService.findByListing(listingId);
  }

  @Post()
  submitReview(@Body() body: any) {
    return this.reviewsService.createReview(body);
  }

  @Post(':id/reply')
  replyToReview(@Param('id') id: string, @Body() body: any) {
    const { text } = body;
    return this.reviewsService.reply(id, text);
  }

  @Post(':id/flag')
  flagReview(@Param('id') id: string) {
    return this.reviewsService.flag(id);
  }

  @Post(':id/helpful')
  markHelpful(@Param('id') id: string) {
    return this.reviewsService.markHelpful(id);
  }
}
`,
            service: `import { Injectable, NotFoundException } from '@nestjs/common';
import { dbStore, Review } from '../mock-db/db.store';

@Injectable()
export class ReviewsService {
  findByListing(listingId?: string) {
    if (listingId) return dbStore.reviews.filter(r => r.listing_id === listingId);
    return dbStore.reviews;
  }

  createReview(data: any) {
    const newReview: Review = {
      id: 'rev-' + Date.now(),
      booking_id: data.booking_id || 'unknown',
      user_id: 'cust-1',
      user_name: 'John Doe',
      user_avatar: '',
      listing_id: data.listing_id,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      photos: data.photos || [],
      helpful_count: 0,
      ai_fraud_score: 0,
      status: 'PUBLISHED',
      created_at: new Date().toISOString()
    };
    dbStore.reviews.push(newReview);
    return newReview;
  }

  reply(id: string, text: string) {
    const review = dbStore.reviews.find(r => r.id === id);
    if (!review) throw new NotFoundException('Review not found');
    review.supplier_reply = { text, replied_at: new Date().toISOString() };
    return review;
  }

  flag(id: string) {
    const review = dbStore.reviews.find(r => r.id === id);
    if (!review) throw new NotFoundException('Review not found');
    review.status = 'FLAGGED';
    return review;
  }

  markHelpful(id: string) {
    const review = dbStore.reviews.find(r => r.id === id);
    if (!review) throw new NotFoundException('Review not found');
    review.helpful_count += 1;
    return review;
  }
}
`
        },
        promotions: {
            controller: `import { Controller, Get, Post, Body } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

@Controller('api/v1/promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get('coupons')
  listCoupons() {
    return this.promotionsService.getAllActive();
  }

  @Post('coupons/validate')
  validateCoupon(@Body() body: any) {
    const { code, cart_total } = body;
    return this.promotionsService.validate(code, cart_total);
  }
}
`,
            service: `import { Injectable } from '@nestjs/common';
import { dbStore } from '../mock-db/db.store';

@Injectable()
export class PromotionsService {
  getAllActive() {
    return dbStore.coupons;
  }

  validate(code: string, cartTotal: number) {
    const coupon = dbStore.coupons.find(c => c.code === code);
    if (!coupon) return { valid: false, message: 'Invalid coupon' };
    
    if (cartTotal < coupon.min_spend) {
        return { valid: false, message: 'Minimum spend not met' };
    }
    
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
        discount = (cartTotal * coupon.value) / 100;
        if (coupon.max_discount && discount > coupon.max_discount) {
            discount = coupon.max_discount;
        }
    } else {
        discount = coupon.value;
    }
    
    return { valid: true, discount_amount: discount, message: 'Coupon applied' };
  }
}
`
        },
        users: {
            controller: `import { Controller, Get, Patch, Post, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile() {
    return this.usersService.getProfile();
  }

  @Patch('me')
  updateProfile(@Body() body: any) {
    return this.usersService.updateProfile(body);
  }

  @Get('me/wishlist')
  getWishlist() {
    return this.usersService.getWishlist();
  }

  @Post('me/wishlist/:listingId')
  addToWishlist(@Param('listingId') listingId: string) {
    return this.usersService.addToWishlist(listingId);
  }

  @Delete('me/wishlist/:listingId')
  removeFromWishlist(@Param('listingId') listingId: string) {
    return this.usersService.removeFromWishlist(listingId);
  }

  @Get('me/bookings')
  getBookings() {
    return this.usersService.getBookings();
  }

  @Get('me/notifications')
  getNotifications() {
    return this.usersService.getNotifications();
  }

  @Patch('me/notifications/:id/read')
  markNotificationRead(@Param('id') id: string) {
    return this.usersService.markNotificationRead(id);
  }
}
`,
            service: `import { Injectable, NotFoundException } from '@nestjs/common';
import { dbStore } from '../mock-db/db.store';

@Injectable()
export class UsersService {
  private get currentUser() {
    return dbStore.users[0]; // mock current user cust-1
  }

  getProfile() {
    return this.currentUser;
  }

  updateProfile(data: any) {
    const user = this.currentUser;
    if (data.name) user.name = data.name;
    if (data.phone) user.phone = data.phone;
    if (data.preferred_currency) user.preferred_currency = data.preferred_currency;
    return user;
  }

  getWishlist() {
    return this.currentUser.wishlist_listing_ids.map(id => dbStore.listings.find(l => l.id === id)).filter(Boolean);
  }

  addToWishlist(listingId: string) {
    if (!this.currentUser.wishlist_listing_ids.includes(listingId)) {
      this.currentUser.wishlist_listing_ids.push(listingId);
    }
    return this.currentUser.wishlist_listing_ids;
  }

  removeFromWishlist(listingId: string) {
    this.currentUser.wishlist_listing_ids = this.currentUser.wishlist_listing_ids.filter(id => id !== listingId);
    return this.currentUser.wishlist_listing_ids;
  }

  getBookings() {
    return dbStore.bookings.filter(b => b.customer_id === this.currentUser.id);
  }

  getNotifications() {
    return dbStore.notifications.filter(n => n.user_id === this.currentUser.id);
  }

  markNotificationRead(id: string) {
    const notif = dbStore.notifications.find(n => n.id === id);
    if (!notif) throw new NotFoundException('Notification not found');
    notif.read = true;
    return notif;
  }
}
`
        }
    };

    for (const [modName, files] of Object.entries(modules)) {
        const modPath = path.join(baseDir, modName);
        if (!fs.existsSync(modPath)) fs.mkdirSync(modPath, { recursive: true });
        fs.writeFileSync(path.join(modPath, \`\${modName}.controller.ts\`), files.controller);
        fs.writeFileSync(path.join(modPath, \`\${modName}.service.ts\`), files.service);
    }
};

const updateAppModule = () => {
    const appModPath = path.join(baseDir, 'app.module.ts');
    let appContent = fs.readFileSync(appModPath, 'utf8');

    const imports = [
        "import { AuthController } from './auth/auth.controller';",
        "import { AuthService } from './auth/auth.service';",
        "import { ReviewsController } from './reviews/reviews.controller';",
        "import { ReviewsService } from './reviews/reviews.service';",
        "import { PromotionsController } from './promotions/promotions.controller';",
        "import { PromotionsService } from './promotions/promotions.service';",
        "import { UsersController } from './users/users.controller';",
        "import { UsersService } from './users/users.service';"
    ].join('\\n');

    if (!appContent.includes('AuthController')) {
        appContent = appContent.replace("import { Module } from '@nestjs/common';", "import { Module } from '@nestjs/common';\\n" + imports);
        
        // Add controllers
        appContent = appContent.replace('controllers: [', 'controllers: [\\n    AuthController,\\n    ReviewsController,\\n    PromotionsController,\\n    UsersController,');
        
        // Add services
        appContent = appContent.replace('providers: [', 'providers: [\\n    AuthService,\\n    ReviewsService,\\n    PromotionsService,\\n    UsersService,');

        fs.writeFileSync(appModPath, appContent);
    }
};

updateDbStore();
createModuleFiles();
updateAppModule();

console.log("Done");
