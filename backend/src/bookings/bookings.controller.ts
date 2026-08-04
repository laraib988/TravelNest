import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('api/v1/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async checkout(
    @Body()
    body: {
      hold_id: string;
      lead_name: string;
      lead_email: string;
      lead_phone: string;
      special_requirements?: string;
      payment_token?: string;
    },
  ) {
    return this.bookingsService.createBooking(body);
  }

  @Get(':ref')
  getBooking(@Param('ref') ref: string) {
    return this.bookingsService.getBookingByReference(ref);
  }

  @Get('supplier/list')
  getSupplierBookings(@Query('supplier_id') supplierId?: string) {
    return this.bookingsService.getSupplierBookings(supplierId);
  }
}
