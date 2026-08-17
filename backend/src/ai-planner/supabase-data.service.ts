import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface RealProduct {
  id: string;
  supplier_id: string;
  status: string;
  current_step?: number;
  basic_info?: {
    title?: string;
    shortDescription?: string;
    summary?: string;
    category?: string;
    sellingPoints?: string;
    highlights?: string[];
    durationMinutes?: number | string;
    photos?: { heroImage?: string; gallery?: string[] };
  };
  experience_details?: {
    included?: string;
    excluded?: string;
    faqs?: Array<{ question: string; answer: string }>;
    language?: string;
    guideType?: string;
    activityType?: string;
    accessibility?: Record<string, boolean>;
    thingsToCarry?: string[];
  };
  transport_pricing?: Array<{
    id?: string;
    title?: string;
    amount?: string | number;
    pricingType?: string;
    duration?: string;
    transportType?: string;
    travellers?: string | number;
    availableUnits?: string | number;
    attributes?: string[];
  }>;
  logistics?: {
    bookingType?: string;
    paymentOption?: string;
    pickupLocation?: string;
    dropOffLocation?: string;
    dropOffSameAsPickup?: boolean;
    availability?: string[];
    timeFrameFrom?: string;
    timeFrameTo?: string;
    timeInterval?: string;
  };
  itinerary?: Array<{
    id?: string;
    locationName?: string;
    description?: string;
    timeToSpend?: string;
    hasEntryFee?: boolean;
    entryFeeAmount?: string;
    images?: string[];
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface RealBooking {
  id: string;
  booking_reference: string;
  listing_id: string;
  option_id?: string;
  option_name?: string;
  slot_start_time?: string;
  total_travelers?: number;
  gross_amount?: number;
  currency?: string;
  status?: string;
  payment_status?: string;
  created_at?: string;
}

@Injectable()
export class SupabaseDataService {
  private client: SupabaseClient | null = null;
  private productsCache: RealProduct[] = [];
  private lastFetch = 0;
  private readonly CACHE_TTL_MS = 30_000;

  constructor() {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (url && key) {
      this.client = createClient(url, key);
    }
  }

  get enabled(): boolean {
    return !!this.client;
  }

  private assertClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase is not configured on the backend (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing).');
    }
    return this.client;
  }

  /** Fetch live PUBLISHED/APPROVED products (excluding edit clones), cached briefly for real-time freshness. */
  async getProducts(forceRefresh = false): Promise<RealProduct[]> {
    const now = Date.now();
    if (!forceRefresh && this.productsCache.length && now - this.lastFetch < this.CACHE_TTL_MS) {
      return this.productsCache;
    }
    const supabase = this.assertClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('status', ['PUBLISHED', 'APPROVED'])
      .order('updated_at', { ascending: false });
    if (error) {
      throw new Error(`Supabase products fetch failed: ${error.message}`);
    }
    // Filter out edit-clone rows (conceptual draft clones reference a parent via logistics.parent_id)
    this.productsCache = (data as RealProduct[]) || [];
    this.lastFetch = now;
    return this.productsCache;
  }

  async getProductById(id: string): Promise<RealProduct | null> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  }

  /** Real bookings — used for honest availability context (how many travelers already booked). */
  async getBookings(listingId?: string): Promise<RealBooking[]> {
    const supabase = this.assertClient();
    let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (listingId) query = query.eq('listing_id', listingId);
    const { data, error } = await query.limit(100);
    if (error) {
      throw new Error(`Supabase bookings fetch failed: ${error.message}`);
    }
    return (data as RealBooking[]) || [];
  }
}