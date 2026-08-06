import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AffiliateService } from './affiliate.service';

@Controller('api/v1/affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Get('dashboard/:code')
  getDashboard(@Param('code') code: string) {
    return this.affiliateService.getPartnerDashboard(code);
  }

  @Post('apply')
  applyAffiliate(@Body() body: { partner_name: string; website_url: string; email: string }) {
    return this.affiliateService.registerAffiliate(body);
  }

  @Get('partner-catalog')
  getPartnerCatalog() {
    return this.affiliateService.getPartnerCatalog();
  }
}
