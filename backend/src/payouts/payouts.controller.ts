import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { PayoutEngineService } from './payout-engine.service';

@Controller('api/v1/payouts')
export class PayoutsController {
  constructor(private readonly payoutEngineService: PayoutEngineService) {}

  @Get('ledger/:supplierId')
  getLedger(@Param('supplierId') supplierId: string) {
    return this.payoutEngineService.getLedgerSummary(supplierId);
  }

  @Get('history/:supplierId')
  getPayoutHistory(@Param('supplierId') supplierId: string) {
    return this.payoutEngineService.getPayouts(supplierId);
  }

  @Post('trigger-run')
  triggerPayoutRun(@Body() body: { supplier_id: string }) {
    return this.payoutEngineService.triggerScheduledPayoutRun(body.supplier_id || 'sup-oceanic-tours');
  }
}
