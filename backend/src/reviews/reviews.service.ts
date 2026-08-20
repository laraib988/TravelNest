import { Injectable, NotFoundException } from '@nestjs/common';
import { dbStore, Review } from '../mock-db/db.store';

@Injectable()
export class ReviewsService {
  findByListing(listingId?: string) {
    if (listingId) {
      // For specific products, only return approved/published reviews
      return dbStore.reviews.filter(r => r.listing_id === listingId && r.status === 'PUBLISHED');
    }
    // For admin list, return all reviews
    return dbStore.reviews;
  }

  createReview(data: any) {
    const newReview: Review = {
      id: 'rev-' + Date.now(),
      booking_id: data.booking_id || 'unknown',
      user_id: data.user_id || 'cust-1',
      user_name: data.user_name || 'Anonymous Traveler',
      user_avatar: data.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      listing_id: data.listing_id,
      rating: Number(data.rating || 5),
      title: data.title || '',
      comment: data.comment || '',
      photos: data.photos || [],
      tour_types: data.tour_types || [],
      helpful_count: 0,
      ai_fraud_score: 0.05,
      status: 'PENDING', // Default is PENDING so admin has to approve!
      created_at: new Date().toISOString()
    };
    dbStore.reviews.push(newReview);
    return newReview;
  }

  updateStatus(id: string, status: string) {
    const review = dbStore.reviews.find(r => r.id === id);
    if (!review) throw new NotFoundException('Review not found');
    review.status = status as any;
    return review;
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
