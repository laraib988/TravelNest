import { Injectable, NotFoundException } from '@nestjs/common';
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
