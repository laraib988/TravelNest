import { Injectable, NotFoundException } from '@nestjs/common';
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
