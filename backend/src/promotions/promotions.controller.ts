import { Controller, Get, Post, Body } from '@nestjs/common';
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
