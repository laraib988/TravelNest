import { Controller, Get, Patch, Post, Delete, Body, Param } from '@nestjs/common';
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
