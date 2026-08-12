import { Injectable, NotFoundException } from '@nestjs/common';
import { dbStore, User, Review } from '../mock-db/db.store';

@Injectable()
export class AdminService {
  public getDashboardStats() {
    const totalBookings = dbStore.bookings.length;
    const activeBookings = dbStore.bookings.filter(
      (b) => b.status !== 'CANCELLED' && b.status !== 'REFUNDED'
    ).length;

    const totalRevenue = dbStore.bookings
      .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
      .reduce((acc, b) => acc + b.gross_amount, 0);

    const totalUsers = dbStore.users.length;
    const pendingKYC = Array.from(dbStore.kycRecords.values()).filter(
      (k) => k.kyc_state === 'SUBMITTED_PENDING_REVIEW' || k.kyc_state === 'UNDER_REVIEW'
    ).length;

    const totalListings = dbStore.listings.length;
    const pendingReviews = dbStore.reviews.filter((r) => r.status === 'PENDING' || r.status === 'FLAGGED').length;

    return {
      totalRevenue,
      totalBookings,
      activeBookings,
      totalUsers,
      pendingKYC,
      totalListings,
      pendingReviews,
      recentBookings: dbStore.bookings.slice(-5).reverse(),
      recentReviews: dbStore.reviews.slice(-3).reverse(),
    };
  }

  public getAllUsers(role?: string, search?: string): User[] {
    let users = dbStore.users;

    if (role && role !== 'ALL') {
      users = users.filter((u) => u.role === role);
    }

    if (search) {
      const query = search.toLowerCase();
      users = users.filter(
        (u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
      );
    }

    return users;
  }

  public updateUserRole(userId: string, role: User['role']): User {
    const user = dbStore.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    return user;
  }

  public updateReviewStatus(reviewId: string, status: Review['status']): Review {
    const review = dbStore.reviews.find((r) => r.id === reviewId);
    if (!review) throw new NotFoundException('Review not found');
    review.status = status;
    return review;
  }
}
