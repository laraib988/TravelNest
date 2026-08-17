import { Injectable } from '@nestjs/common';
import { SupabaseDataService, RealProduct } from './supabase-data.service';

export interface KBFilter {
  destination?: string;
  city?: string;
  category?: string;
  max_price?: number;
  price_tier?: 'budget' | 'mid' | 'premium';
  interests?: string[];
  limit?: number;
}

export interface SearchHit {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  destination: string;
  city: string;
  country: string;
  base_price: number;
  currency: string;
  duration_minutes: number;
  rating: number;
  review_count: number;
  badges: string[];
  image: string;
  options: Array<{ id: string; name: string; price: number; age_group: string }>;
  meeting_point: { address: string; latitude: number; longitude: number };
  itinerary_stops: Array<{ locationName: string; description: string; timeToSpend?: string; hasEntryFee?: boolean }>;
}

export interface ItineraryActivity {
  time_slot: 'MORNING' | 'AFTERNOON' | 'EVENING';
  activity_name: string;
  description: string;
  estimated_price: number;
  listing_id?: string;
  duration_minutes?: number;
  travel_time_min?: number;
  rating?: number;
  image?: string;
}

export interface ItineraryDay {
  day_number: number;
  date?: string;
  theme: string;
  weather_note?: string;
  activities: ItineraryActivity[];
  day_cost: number;
}

export interface ItineraryPlan {
  trip_name: string;
  destination: string;
  country: string;
  total_estimated_budget: number;
  stated_budget: number;
  currency: string;
  days: ItineraryDay[];
  budget_summary: {
    total_cost: number;
    within_budget: boolean;
    remaining: number;
    over_by: number;
    savings_suggestions: string[];
  };
  weather: WeatherDay[];
  recommendations: RestaurantOrHotel[];
}

export interface WeatherDay {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation: number;
  weather_code: number;
  label: string;
  advice: string;
}

export interface RestaurantOrHotel {
  type: 'restaurant' | 'hotel';
  name: string;
  city: string;
  price_tier: string;
  cuisine?: string;
  amenities?: string[];
  description: string;
  rating: number;
  price_range: string;
  image?: string;
}

export interface BookingIntent {
  tour_id: string;
  tour_title: string;
  date: string;
  travelers: number;
  option_name: string;
  unit_price: number;
  total: number;
  platform_fee: number;
  supplier_payout: number;
  currency: string;
  status: 'DRAFT_INTENT';
  message: string;
}

const WEATHER_CODE_LABELS: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Heavy freezing rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Light showers', 81: 'Showers', 82: 'Violent showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail',
};

// Geographic gazetteer (real city coordinates) used ONLY for the live weather API.
// Destination names are derived from the actual product catalog, never invented.
const CITY_GAZETTEER: Array<{ slug: string; name: string; country: string; latitude: number; longitude: number; aliases: string[] }> = [
  { slug: 'tokyo', name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, aliases: ['tokyo', 'fuji', 'mt fuji', 'mount fuji', 'kawaguchiko', 'shinjuku', 'japan'] },
  { slug: 'bali', name: 'Bali', country: 'Indonesia', latitude: -8.4095, longitude: 115.1889, aliases: ['bali', 'ubud', 'nusa dua', 'seminyak', 'indonesia'] },
  { slug: 'paris', name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, aliases: ['paris', 'louvre', 'france'] },
  { slug: 'lahore', name: 'Lahore', country: 'Pakistan', latitude: 31.5204, longitude: 74.3587, aliases: ['lahore', 'punjab'] },
  { slug: 'dubai', name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, aliases: ['dubai', 'uae', 'emirates'] },
  { slug: 'rome', name: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964, aliases: ['rome', 'colosseum', 'italy'] },
  { slug: 'karachi', name: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011, aliases: ['karachi'] },
  { slug: 'islamabad', name: 'Islamabad', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479, aliases: ['islamabad', 'rawalpindi'] },
  { slug: 'istanbul', name: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784, aliases: ['istanbul', 'turkey'] },
  { slug: 'bangkok', name: 'Bangkok', country: 'Thailand', latitude: 13.7563, longitude: 100.5018, aliases: ['bangkok', 'thailand'] },
  { slug: 'london', name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, aliases: ['london', 'uk', 'england'] },
  { slug: 'new-york', name: 'New York City', country: 'United States', latitude: 40.7128, longitude: -74.0060, aliases: ['new york', 'nyc', 'manhattan'] },
  { slug: 'hunza', name: 'Hunza Valley', country: 'Pakistan', latitude: 36.3167, longitude: 74.6500, aliases: ['hunza', 'karimabad', 'rakaposhi', 'attabad'] },
  { slug: 'skardu', name: 'Skardu', country: 'Pakistan', latitude: 35.2971, longitude: 75.6337, aliases: ['skardu', 'katchura', 'shangrila'] },
];

const PRICE_TIERS = { budget: 50, mid: 150, premium: 100000 };

@Injectable()
export class TravelAgentTools {
  constructor(private readonly supabaseData: SupabaseDataService) {}

  // ---- Real RAG over the live Supabase catalog ----
  async searchKnowledgeBase(query: string, filters: KBFilter = {}): Promise<SearchHit[]> {
    const products = await this.supabaseData.getProducts();
    const limit = filters.limit || 5;
    const hits: SearchHit[] = [];

    for (const p of products) {
      if (hits.length >= limit) break;

      const hit = this.toSearchHit(p);
      if (!hit) continue;

      // destination / city text match against the live product text
      if (filters.destination || filters.city) {
        const target = (filters.destination || filters.city || '').toLowerCase();
        const city = this.detectCity(hit.title + ' ' + hit.summary + ' ' + hit.meeting_point.address);
        if (!city || !this.cityMatches(city.name, target) && !this.aliasesMatch(target, city.aliases)) {
          continue;
        }
      }
      if (filters.category && !hit.category.toLowerCase().includes(filters.category.toLowerCase())) continue;
      if (filters.max_price && hit.base_price > filters.max_price) continue;
      if (filters.price_tier && hit.base_price > PRICE_TIERS[filters.price_tier]) continue;

      const interests = filters.interests || [];
      if (interests.length) {
        const text = `${hit.title} ${hit.summary} ${hit.category}`.toLowerCase();
        if (!interests.some((i) => text.includes(i.toLowerCase()))) continue;
      }
      hits.push(hit);
    }
    return hits;
  }

  async getAllDestinations(): Promise<Array<{ slug: string; name: string; country: string; latitude: number; longitude: number }>> {
    const products = await this.supabaseData.getProducts();
    const slugs = new Set<string>();
    const result: Array<{ slug: string; name: string; country: string; latitude: number; longitude: number }> = [];
    for (const p of products) {
      const city = this.detectCity(this.productText(p));
      if (city && !slugs.has(city.slug)) {
        slugs.add(city.slug);
        result.push({ slug: city.slug, name: city.name, country: city.country, latitude: city.latitude, longitude: city.longitude });
      }
    }
    return result;
  }

  // ---- Live weather via Open-Meteo (real API, no key) ----
  async getWeatherForecast(location: string, fromDate: string, toDate: string): Promise<WeatherDay[]> {
    const dest = this.resolveDestination(location);
    if (!dest) return [];
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${dest.latitude}&longitude=${dest.longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&start_date=${fromDate}&end_date=${toDate}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return [];
      const data = await res.json();
      const daily = data.daily || {};
      const days: WeatherDay[] = (daily.time || []).map((date: string, i: number) => {
        const code = daily.weathercode?.[i] ?? 0;
        const label = WEATHER_CODE_LABELS[code] || 'Unknown';
        const advice =
          code >= 61 && code <= 82 || code >= 95
            ? 'Rain expected — consider indoor alternatives or pack rain gear.'
            : (daily.temperature_2m_max?.[i] ?? 25) >= 34
              ? 'Very hot — plan outdoor activities for morning/evening.'
              : 'Good weather for outdoor activities.';
        return {
          date, temp_max: daily.temperature_2m_max?.[i] ?? 0, temp_min: daily.temperature_2m_min?.[i] ?? 0,
          precipitation: daily.precipitation_sum?.[i] ?? 0, weather_code: code, label, advice,
        };
      });
      return days;
    } catch {
      return [];
    }
  }

  // ---- Route optimization (real algorithm over real stop coordinates) ----
  optimizeRoute(stops: Array<{ name: string; latitude: number; longitude: number }>, origin?: { latitude: number; longitude: number }): Array<{ name: string; order: number; travel_time_min: number }> {
    if (!stops.length) return [];
    const remaining = [...stops];
    const route: Array<{ name: string; order: number; travel_time_min: number }> = [];
    let current = origin || remaining[0];
    let order = 0;
    while (remaining.length) {
      let bestIdx = 0;
      let bestTime = Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const t = this.estimateTravelTime(current.latitude, current.longitude, remaining[i].latitude, remaining[i].longitude);
        if (t < bestTime) { bestTime = t; bestIdx = i; }
      }
      const stop = remaining.splice(bestIdx, 1)[0];
      route.push({ name: stop.name, order: ++order, travel_time_min: Math.round(bestTime) });
      current = stop;
    }
    return route;
  }

  private estimateTravelTime(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const distKm = 2 * R * Math.asin(Math.sqrt(a));
    return Math.max(10, (distKm / 40) * 60);
  }

  // ---- Budget checking against REAL prices ----
  checkBudget(activities: ItineraryActivity[], statedBudget: number): { total_cost: number; within_budget: boolean; remaining: number; over_by: number; savings_suggestions: string[] } {
    const total = activities.reduce((acc, a) => acc + (a.estimated_price || 0), 0);
    const within = total <= statedBudget;
    const savings: string[] = [];
    if (!within) {
      savings.push('Swap the highest-priced activity for a budget alternative.');
      savings.push('Choose the standard vehicle option instead of premium upgrades.');
      savings.push('Reduce the number of paid activities on day two.');
    } else if (total < statedBudget * 0.5) {
      savings.push('You have room to add a premium upgrade or evening show.');
    }
    return {
      total_cost: Math.round(total * 100) / 100,
      within_budget: within,
      remaining: Math.max(0, Math.round((statedBudget - total) * 100) / 100),
      over_by: Math.max(0, Math.round((total - statedBudget) * 100) / 100),
      savings_suggestions: savings,
    };
  }

  // ---- Recommendations come from the REAL catalog (never curated fake venues) ----
  async getRecommendations(destinationSlug: string, filters: { price_tier?: string } = {}): Promise<RestaurantOrHotel[]> {
    const products = await this.supabaseData.getProducts();
    const all = products.map((p) => this.toSearchHit(p)).filter((h): h is SearchHit => !!h);
    const dest = this.resolveDestination(destinationSlug);
    const inDest = all.filter((h) => {
      const city = this.detectCity(h.title + ' ' + h.summary + ' ' + h.meeting_point.address);
      return city && dest && city.slug === dest.slug;
    });
    const pool = inDest.length ? inDest : all;
    return pool.slice(0, 4).map((h) => ({
      type: h.category.toLowerCase().includes('food') ? 'restaurant' : 'hotel',
      name: h.title,
      city: h.city,
      price_tier: h.base_price <= 50 ? 'budget' : h.base_price <= 150 ? 'mid' : 'premium',
      amenities: h.itinerary_stops.slice(0, 2).map((s) => s.locationName),
      description: h.summary,
      rating: h.rating,
      price_range: `From $${h.base_price} ${h.options[0]?.name ? '· ' + h.options[0].name : ''}`,
      image: h.image,
    }));
  }

  // ---- Phase 5: Booking INTENT (never finalizes; requires explicit confirmation) ----
  createBookingIntent(hit: SearchHit, date: string, travelers: number): BookingIntent {
    const option = hit.options[0] || { id: 'opt-standard', name: 'Standard Pass', price: hit.base_price, age_group: 'ADULT' };
    const total = option.price * travelers;
    const platformFee = Math.round(total * 0.15 * 100) / 100;
    return {
      tour_id: hit.id,
      tour_title: hit.title,
      date,
      travelers,
      option_name: option.name,
      unit_price: option.price,
      total: Math.round(total * 100) / 100,
      platform_fee: platformFee,
      supplier_payout: Math.round((total - platformFee) * 100) / 100,
      currency: hit.currency || 'USD',
      status: 'DRAFT_INTENT',
      message: 'This is a booking intent built from live inventory. No payment has been taken. Please confirm to proceed.',
    };
  }

  resolveDestination(location: string) {
    const q = (location || '').toLowerCase();
    return CITY_GAZETTEER.find((c) => c.slug === q || c.name.toLowerCase() === q || this.aliasesMatch(q, c.aliases)) || null;
  }

  // ---- Helpers ----
  private productText(p: RealProduct): string {
    const bi = p.basic_info || {};
    return `${bi.title || ''} ${bi.shortDescription || ''} ${bi.category || ''} ${p.logistics?.pickupLocation || ''}`;
  }

  private detectCity(text: string) {
    const t = (text || '').toLowerCase();
    return CITY_GAZETTEER.find((c) => this.aliasesMatch(t, c.aliases)) || null;
  }

  private aliasesMatch(haystack: string, aliases: string[]): boolean {
    return aliases.some((a) => haystack.includes(a));
  }

  private cityMatches(name: string, target: string): boolean {
    return name.toLowerCase().includes(target) || target.includes(name.toLowerCase());
  }

  private toSearchHit(p: RealProduct): SearchHit | null {
    const bi = p.basic_info || {};
    const title = bi.title || '';
    if (!title) return null;

    const options = (p.transport_pricing || []).map((t) => ({
      id: t.id || t.title || 'opt-standard',
      name: t.title || 'Standard Pass',
      price: Number(t.amount) || 0,
      age_group: 'ADULT' as const,
    }));
    const minPrice = options.length ? Math.min(...options.map((o) => o.price)) : 0;

    const city = this.detectCity(this.productText(p));
    const durationRaw = (p.transport_pricing?.[0]?.duration || bi.durationMinutes || '').toString().toLowerCase();
    const durationMinutes = this.parseDuration(durationRaw);

    const summary = (bi.shortDescription || bi.summary || '').split('summary:')[0].trim();

    const itinerary_stops = (p.itinerary || []).map((s) => ({
      locationName: s.locationName || 'Stop',
      description: s.description || '',
      timeToSpend: s.timeToSpend,
      hasEntryFee: !!s.hasEntryFee,
    }));

    return {
      id: p.id,
      title,
      slug: p.id,
      summary,
      category: bi.category || 'Experiences',
      destination: city ? city.name : 'Global',
      city: city ? city.name : 'Global',
      country: city ? city.country : '',
      base_price: minPrice,
      currency: 'USD',
      duration_minutes: durationMinutes,
      rating: 5.0,
      review_count: 0,
      badges: ['LIVE INVENTORY'],
      image: bi.photos?.heroImage && !bi.photos.heroImage.startsWith('blob:') ? bi.photos.heroImage : '',
      options,
      meeting_point: {
        address: p.logistics?.pickupLocation || (city ? city.name : 'Multiple pickup locations'),
        latitude: city ? city.latitude : 0,
        longitude: city ? city.longitude : 0,
      },
      itinerary_stops,
    };
  }

  private parseDuration(raw: string): number {
    const m = raw.match(/(\d+)\s*hours?/);
    if (m) return parseInt(m[1], 10) * 60;
    const min = raw.match(/(\d+)\s*min/);
    if (min) return parseInt(min[1], 10);
    return 120;
  }
}