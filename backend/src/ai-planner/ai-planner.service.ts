import { Injectable } from '@nestjs/common';
import { dbStore, Listing } from '../mock-db/db.store';
import { VectorSearchService } from '../listings/vector-search.service';

export interface AIItineraryResponse {
  trip_name: string;
  destination_name: string;
  total_estimated_budget: number;
  currency: string;
  days: Array<{
    day_number: number;
    theme: string;
    activities: Array<{
      time_slot: 'MORNING' | 'AFTERNOON' | 'EVENING';
      activity_name: string;
      matched_listing?: Listing;
      estimated_price: number;
      slot_id?: string;
    }>;
  }>;
}

@Injectable()
export class AIPlannerService {
  constructor(private readonly vectorSearchService: VectorSearchService) {}

  // SRS 9.1: AI Trip Planner (Conversational Itinerary Builder)
  public generateItinerary(promptText: string, targetDestination = 'bali', maxBudget = 250): AIItineraryResponse {
    const query = promptText.toLowerCase();
    const dest = dbStore.destinations.find((d) => d.slug === targetDestination || query.includes(d.slug)) || dbStore.destinations[0];

    const matchedListings = this.vectorSearchService.hybridSearch(promptText, dest.slug);

    const primaryMatch = matchedListings[0] || dbStore.listings[0];
    const secondaryMatch = matchedListings[1] || dbStore.listings[1];

    const slot1 = dbStore.availabilitySlots.find((s) => s.listing_id === primaryMatch.id);
    const slot2 = dbStore.availabilitySlots.find((s) => s.listing_id === secondaryMatch.id);

    return {
      trip_name: `AI-Curated ${dest.name} Discovery`,
      destination_name: dest.name,
      total_estimated_budget: Math.min(maxBudget, primaryMatch.base_price + secondaryMatch.base_price + 35.0),
      currency: 'USD',
      days: [
        {
          day_number: 1,
          theme: 'Arrival & Iconic Experiences',
          activities: [
            {
              time_slot: 'MORNING',
              activity_name: 'Traditional Cultural Heritage Walking Tour',
              estimated_price: 25.0,
            },
            {
              time_slot: 'EVENING',
              activity_name: primaryMatch.title,
              matched_listing: primaryMatch,
              estimated_price: primaryMatch.base_price,
              slot_id: slot1?.id,
            },
          ],
        },
        {
          day_number: 2,
          theme: 'Culinary & Local Exploration',
          activities: [
            {
              time_slot: 'AFTERNOON',
              activity_name: secondaryMatch.title,
              matched_listing: secondaryMatch,
              estimated_price: secondaryMatch.base_price,
              slot_id: slot2?.id,
            },
            {
              time_slot: 'EVENING',
              activity_name: 'Stargazing & Rooftop Lounge Experience',
              estimated_price: 20.0,
            },
          ],
        },
      ],
    };
  }

  // SRS 9.3: AI Review Intelligence Summarization
  public getReviewSummary(listingId: string) {
    const listing = dbStore.listings.find((l) => l.id === listingId || l.slug === listingId);
    if (!listing) return { pros: [], cons: [], sentiment_score: 0.90 };
    return listing.ai_review_summary || {
      pros: ['Seamless instant voucher validation', 'Friendly certified tour guides', 'Great value for money'],
      cons: ['Peak hours experience slight crowd'],
      sentiment_score: 0.95,
    };
  }

  // SRS 9.5: AI Dynamic Pricing Advisor for Suppliers
  public getDynamicPricingRecommendation(listingId: string) {
    const listing = dbStore.listings.find((l) => l.id === listingId || l.slug === listingId);
    if (!listing) return null;
    return listing.ai_dynamic_pricing || {
      recommended_price: Number((listing.base_price * 1.05).toFixed(2)),
      demand_surge_factor: 1.05,
      reasoning: 'Demand volume increased by +18% over the past 7 days.',
    };
  }

  // SRS 9.14: "Ask AI About This Place" Contextual Q&A
  public answerContextualQuestion(listingId: string, question: string) {
    const listing = dbStore.listings.find((l) => l.id === listingId || l.slug === listingId);
    const q = question.toLowerCase();

    if (q.includes('child') || q.includes('kid') || q.includes('family')) {
      return { answer: 'Yes! Family options and child passes (3-11 yrs) are available during checkout. Stroller access is supported at meeting points.' };
    }
    if (q.includes('cancel') || q.includes('refund')) {
      return { answer: `This experience features a ${listing?.cancellation_policy || 'FREE 24H'} cancellation policy. Cancel up to 24 hours in advance for a full refund.` };
    }
    if (q.includes('dress') || q.includes('wear') || q.includes('bring')) {
      return { answer: `Recommended items: ${listing?.know_before_you_go.join('; ') || 'Comfortable walking shoes and photo ID.'}` };
    }
    return { answer: `Based on verified traveler reviews and supplier guidelines: ${listing?.summary}` };
  }
}
