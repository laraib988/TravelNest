import { Injectable, NotFoundException } from '@nestjs/common';
import { dbStore } from '../mock-db/db.store';

export interface AffiliatePartner {
  id: string;
  partner_name: string;
  referral_code: string;
  commission_rate: number; // e.g., 5%
  total_clicks: number;
  total_conversions: number;
  total_earnings: number;
  currency: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED';
}

@Injectable()
export class AffiliateService {
  private partners: AffiliatePartner[] = [
    {
      id: 'aff-101',
      partner_name: 'Wanderlust Travel Blog (Global)',
      referral_code: 'WANDERLUST2026',
      commission_rate: 0.05,
      total_clicks: 1420,
      total_conversions: 84,
      total_earnings: 374.50,
      currency: 'USD',
      status: 'ACTIVE',
    },
    {
      id: 'aff-102',
      partner_name: 'Asia Backpackers Guide',
      referral_code: 'ASIABACKPACK',
      commission_rate: 0.06,
      total_clicks: 980,
      total_conversions: 42,
      total_earnings: 189.00,
      currency: 'USD',
      status: 'ACTIVE',
    },
  ];

  public getPartnerDashboard(referralCode: string): AffiliatePartner {
    const partner = this.partners.find((p) => p.referral_code.toLowerCase() === referralCode.toLowerCase() || p.id === referralCode);
    if (!partner) throw new NotFoundException('Affiliate partner code not found');
    return partner;
  }

  public registerAffiliate(payload: { partner_name: string; website_url: string; email: string }): AffiliatePartner {
    const refCode = payload.partner_name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 10) + '2026';
    const partner: AffiliatePartner = {
      id: `aff-${Date.now()}`,
      partner_name: payload.partner_name,
      referral_code: refCode,
      commission_rate: 0.05,
      total_clicks: 0,
      total_conversions: 0,
      total_earnings: 0.00,
      currency: 'USD',
      status: 'ACTIVE',
    };
    this.partners.push(partner);
    return partner;
  }

  // Reseller Partner API (Read-only listings + booking creation)
  public getPartnerCatalog() {
    return dbStore.listings.map((l) => ({
      id: l.id,
      title: l.title,
      slug: l.slug,
      base_price: l.base_price,
      currency: l.currency,
      rating: l.cached_rating_avg,
      review_count: l.cached_review_count,
      partner_booking_endpoint: `/api/v1/affiliate/partner-booking`,
    }));
  }
}
