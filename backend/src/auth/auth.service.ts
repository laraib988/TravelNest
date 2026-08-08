import { Injectable } from '@nestjs/common';
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
