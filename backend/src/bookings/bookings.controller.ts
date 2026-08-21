import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('api/v1/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async checkout(
    @Body()
    body: CreateBookingDto,
  ) {
    return this.bookingsService.createBooking(body);
  }

  @Get()
  getAllBookings() {
    return this.bookingsService.getSupplierBookings();
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
