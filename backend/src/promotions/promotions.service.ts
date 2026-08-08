import { Injectable } from '@nestjs/common';
import { dbStore } from '../mock-db/db.store';

@Injectable()
export class PromotionsService {
  getAllActive() {
    return dbStore.coupons;
  }

  validate(code: string, cartTotal: number) {
    const coupon = dbStore.coupons.find(c => c.code === code);
    if (!coupon) return { valid: false, message: 'Invalid coupon' };
    
    if (cartTotal < coupon.min_spend) {
        return { valid: false, message: 'Minimum spend not met' };
    }
    
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
        discount = (cartTotal * coupon.value) / 100;
        if (coupon.max_discount && discount > coupon.max_discount) {
            discount = coupon.max_discount;
        }
    } else {
        discount = coupon.value;
    }
    
    return { valid: true, discount_amount: discount, message: 'Coupon applied' };
  }
}
