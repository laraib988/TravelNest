import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { KYCService } from './kyc.service';

@Controller('api/v1/kyc')
export class KYCController {
  constructor(private readonly kycService: KYCService) {}

  @Get(':supplierId')
  getStatus(@Param('supplierId') supplierId: string) {
    return this.kycService.getStatus(supplierId);
  }

  @Post('submit')
  submitDocument(
    @Body()
    body: {
      supplier_id: string;
      company_name: string;
      business_reg: string;
      tax_id: string;
      document_name: string;
    },
  ) {
    return this.kycService.submitDocument(body);
  }

  @Post('override')
  adminOverride(
    @Body()
    body: {
      supplier_id: string;
      action: 'APPROVE' | 'REJECT';
      reason: string;
    },
  ) {
    return this.kycService.adminOverride(body.supplier_id, body.action, body.reason);
  }
}
