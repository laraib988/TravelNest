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

  // 1. SRS 9.1: AI Trip Planner (Conversational Itinerary Builder)
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

  // 2. SRS 9.2: AI Semantic / Natural-Language Vector Search
  public semanticSearch(query: string, destination?: string) {
    return this.vectorSearchService.hybridSearch(query, destination);
  }

  // 3. SRS 9.3: AI Review Intelligence Summarization
  public getReviewSummary(listingId: string) {
    const listing = dbStore.listings.find((l) => l.id === listingId || l.slug === listingId);
    if (!listing) return { pros: [], cons: [], sentiment_score: 0.90 };
    return listing.ai_review_summary || {
      pros: ['Seamless instant voucher validation', 'Friendly certified tour guides', 'Great value for money'],
      cons: ['Peak hours experience slight crowd'],
      sentiment_score: 0.95,
    };
  }

  // 4. SRS 9.4: AI Fake Review & Fraud Detection
  public checkReviewFraud(reviewText: string, rating: number) {
    const lower = reviewText.toLowerCase();
    let fraudScore = 0.05;
    if (lower.includes('awesome awesome') || lower.includes('best best best')) fraudScore = 0.92;
    if (reviewText.length < 10 && rating === 5) fraudScore = 0.65;
    return {
      review_text: reviewText,
      ai_fraud_score: fraudScore,
      flagged_for_admin: fraudScore > 0.50,
      reason: fraudScore > 0.50 ? 'Repetitive spam phrasing or suspicious rating density' : 'Genuine review pattern',
    };
  }

  // 5. SRS 9.5: AI Dynamic Pricing Advisor for Suppliers
  public getDynamicPricingRecommendation(listingId: string) {
    const listing = dbStore.listings.find((l) => l.id === listingId || l.slug === listingId);
    if (!listing) return null;
    return listing.ai_dynamic_pricing || {
      recommended_price: Number((listing.base_price * 1.05).toFixed(2)),
      demand_surge_factor: 1.05,
      reasoning: 'Demand volume increased by +18% over the past 7 days.',
    };
  }

  // 6. SRS 9.6: 24/7 AI Concierge Chatbot
  public conciergeChat(message: string, userLocale = 'en') {
    const m = message.toLowerCase();
    if (m.includes('cancel') || m.includes('refund')) {
      return { response: 'Free cancellation is available up to 24 hours before your scheduled activity start time. Refunds are processed automatically within 2 business days.', confidence: 0.98 };
    }
    if (m.includes('weather') || m.includes('rain')) {
      return { response: 'Most outdoor cruises & tours operate rain or shine. In case of extreme severe weather, your supplier will reschedule or offer a 100% refund.', confidence: 0.95 };
    }
    if (m.includes('voucher') || m.includes('qr')) {
      return { response: 'Your electronic QR voucher is instantly available under My Bookings after payment completion and sent via email.', confidence: 0.99 };
    }
    return { response: 'Welcome to TravelNest AI Concierge! I can assist with booking status, cancellation policies, and local activity recommendations.', confidence: 0.90 };
  }

  // 7. SRS 9.7: AI Personalization Engine
  public getPersonalizedRecommendations(userId?: string) {
    return {
      personalized_rail_title: 'Recommended For You Based on Your Travel Preferences',
      listings: dbStore.listings.slice(0, 3),
    };
  }

  // 8. SRS 9.8: AI Photo & Media Intelligence
  public analyzePhotoQuality(photoUrl: string) {
    return {
      photo_url: photoUrl,
      blur_score: 0.02,
      watermark_detected: false,
      duplicate_stock_detected: false,
      quality_score: 96,
      status: 'APPROVED',
    };
  }

  // 10. SRS 9.10: AI SEO Content Assistant (Strapi Editor Integration)
  public getSEOAssistantSuggestions(articleTitle: string, articleBody: string) {
    return {
      suggested_meta_title: `${articleTitle} | TravelNest Official Destination Guide 2026`,
      suggested_meta_description: `Discover top attractions, local food hidden gems, and bookable tour slots in ${articleTitle}. Verified guide reviews included.`,
      focus_keywords: ['travel guide 2026', 'best food tours', 'things to do'],
      internal_link_suggestions: [
        { title: 'Luxury Bali Sunset Catamaran Cruise', slug: 'luxury-bali-sunset-catamaran-cruise' },
        { title: 'Shinjuku After-Dark Ramen Walk', slug: 'shinjuku-after-dark-food-tour' }
      ],
      readability_score: 94,
    };
  }

  // 11. SRS 9.11: Predictive Demand Forecasting
  public getDemandForecast(supplierId: string) {
    return {
      supplier_id: supplierId,
      forecast_window_days: 30,
      predicted_demand_level: 'HIGH_SURGE',
      predicted_occupancy_rate: 0.88,
      recommended_staff_count: 4,
      trend: [
        { date: '2026-08-10', demand_index: 82 },
        { date: '2026-08-15', demand_index: 94 },
        { date: '2026-08-20', demand_index: 88 },
      ],
    };
  }

  // 12. SRS 9.12: AI Auto Translation
  public translateText(text: string, targetLanguage: string) {
    return {
      original_text: text,
      target_language: targetLanguage,
      translated_text: `[Translated to ${targetLanguage.toUpperCase()}]: ${text}`,
      disclosure: 'Machine translated by TravelNest AI Engine',
    };
  }

  // 13. SRS 9.13: Sentiment-Based Support Triage
  public triageSupportTicket(ticketSubject: string, message: string) {
    const text = (ticketSubject + ' ' + message).toLowerCase();
    let priority = 'NORMAL';
    let sentimentScore = -0.2;

    if (text.includes('angry') || text.includes('fraud') || text.includes('today') || text.includes('urgent refund')) {
      priority = 'HIGH_URGENT';
      sentimentScore = -0.92;
    }

    return {
      priority,
      sentiment_score: sentimentScore,
      auto_assigned_queue: priority === 'HIGH_URGENT' ? 'Urgent Refund Escalation' : 'General Inquiries',
    };
  }

  // 14. SRS 9.14: "Ask AI About This Place" Contextual Q&A
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

  // --- NEW: AI Booking Agent (SRS §9) ---
  private agentSessions = new Map<string, any>();

  public createAgentSession() {
    const sessionId = 'agt_' + Math.random().toString(36).substring(2, 10);
    this.agentSessions.set(sessionId, { history: [], heldInventory: [], status: 'ACTIVE' });
    return { sessionId };
  }

  public async processAgentMessage(sessionId: string, message: string) {
    const session = this.agentSessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const steps = [];
    let responseText = '';
    let bundle = null;

    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('book') && lowerMsg.includes('yes')) {
       // Confirming a booking
       steps.push({ tool: 'create_booking', status: 'done', detail: 'Confirmed bookings for held items.' });
       responseText = 'Done! Your bookings are confirmed. Vouchers are in My Bookings.';
       session.status = 'COMPLETED';
    } else {
       // Planning a trip (Mocking Think -> Act -> Check loop)
       steps.push({ tool: 'think', status: 'done', detail: 'Analyzing request constraints (budget, dates, preferences).' });
       
       await new Promise(r => setTimeout(r, 600));
       steps.push({ tool: 'search_listings', status: 'done', detail: 'Searching for relevant food/history tours.' });
       
       await new Promise(r => setTimeout(r, 600));
       steps.push({ tool: 'check_availability', status: 'done', detail: 'Checking capacity across candidate dates.' });

       await new Promise(r => setTimeout(r, 600));
       steps.push({ tool: 'hold_inventory', status: 'done', detail: 'Holding slots for top 3 matching options.' });

       responseText = `I found 3 great options fitting your request. I've held these slots for 10 minutes. Should I confirm and book all three?`;
       
       let items = [];
       let totalPrice = 0;

       if (lowerMsg.includes('tokyo')) {
         items = [
           { id: '1', title: 'Shinjuku Ramen Walk', price: 85.0, date: 'Saturday Evening', img: 'https://images.unsplash.com/photo-1542051812871-757500850028?w=400' },
           { id: '2', title: 'Asakusa Temple Tour', price: 40.0, date: 'Sunday Morning', img: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400' },
           { id: '3', title: 'Akihabara Anime Experience', price: 60.0, date: 'Sunday Afternoon', img: 'https://images.unsplash.com/photo-1583061266014-a3fde062b144?w=400' }
         ];
         totalPrice = 185.0;
       } else if (lowerMsg.includes('bali')) {
         items = [
           { id: '1', title: 'Catamaran Sunset Cruise', price: 120.0, date: 'Saturday Evening', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
           { id: '2', title: 'Ubud Rice Terrace Walk', price: 35.0, date: 'Sunday Morning', img: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400' },
           { id: '3', title: 'Seafood Buffet Dinner', price: 50.0, date: 'Sunday Evening', img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400' }
         ];
         totalPrice = 205.0;
       } else {
         items = [
           { id: '1', title: 'Old Lahore Food Walk', price: 45.0, date: 'Saturday Evening', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
           { id: '2', title: 'Lahore Fort Guided Tour', price: 69.0, date: 'Sunday Morning', img: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=400' },
           { id: '3', title: 'Heritage Street Food Tasting', price: 50.0, date: 'Sunday Evening', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' }
         ];
         totalPrice = 164.0;
       }

       bundle = {
          items: items,
          totalPrice: totalPrice,
          currency: 'USD',
          expiresAt: Date.now() + 10 * 60 * 1000 // 10 mins
       };
       session.heldInventory = bundle.items;
    }

    session.history.push({ role: 'user', content: message });
    session.history.push({ role: 'agent', content: responseText, steps, bundle });

    return { responseText, steps, bundle };
  }
}
