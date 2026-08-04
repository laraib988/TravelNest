import { Injectable } from '@nestjs/common';
import { dbStore, PayoutRecord } from '../mock-db/db.store';

@Injectable()
export class PayoutEngineService {
  public getPayouts(supplierId: string): PayoutRecord[] {
    return dbStore.payouts.filter((p) => p.supplier_id === supplierId);
  }

  public getLedgerSummary(supplierId: string) {
    const completedBookings = dbStore.bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED');
    const grossVolume = completedBookings.reduce((sum, b) => sum + b.gross_amount, 0);
    const platformFees = completedBookings.reduce((sum, b) => sum + b.platform_fee, 0);
    const netPayoutBalance = completedBookings.reduce((sum, b) => sum + b.supplier_payout, 0);
    const totalPaidOut = dbStore.payouts
      .filter((p) => p.supplier_id === supplierId && p.status === 'PAID')
      .reduce((sum, p) => sum + p.net_amount, 0);

    return {
      supplier_id: supplierId,
      gross_booking_value: Number(grossVolume.toFixed(2)),
      total_platform_commission: Number(platformFees.toFixed(2)),
      net_earned_balance: Number(netPayoutBalance.toFixed(2)),
      total_paid_out: Number(totalPaidOut.toFixed(2)),
      pending_payout_balance: Number(Math.max(0, netPayoutBalance - totalPaidOut).toFixed(2)),
      currency: 'USD',
    };
  }

  public triggerScheduledPayoutRun(supplierId: string): PayoutRecord {
    const summary = this.getLedgerSummary(supplierId);
    if (summary.pending_payout_balance <= 0) {
      throw new Error('No pending balance available for payout');
    }

    const payout: PayoutRecord = {
      id: `po-${Date.now()}`,
      payout_reference: `PO-202608-${Math.floor(100 + Math.random() * 900)}`,
      supplier_id: supplierId,
      gross_amount: summary.pending_payout_balance / 0.85,
      commission_deducted: (summary.pending_payout_balance / 0.85) * 0.15,
      net_amount: summary.pending_payout_balance,
      currency: 'USD',
      status: 'PAID',
      period_start: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      period_end: new Date().toISOString(),
      processed_at: new Date().toISOString(),
    };

    dbStore.payouts.push(payout);
    return payout;
  }
}
