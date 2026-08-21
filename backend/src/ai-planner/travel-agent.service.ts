import { Injectable } from '@nestjs/common';
import { SupabaseDataService } from './supabase-data.service';
import {
  TravelAgentTools,
  SearchHit,
  ItineraryActivity,
  ItineraryDay,
  ItineraryPlan,
  WeatherDay,
  RestaurantOrHotel,
  BookingIntent,
} from './travel-agent.tools';

export interface AgentStep {
  tool: string;
  status: 'running' | 'done';
  detail: string;
}

export interface AgentResponse {
  responseText: string;
  steps: AgentStep[];
  bundle?: any;
  itinerary?: ItineraryPlan | null;
  recommendations?: RestaurantOrHotel[];
  bookingIntent?: BookingIntent | null;
  meta?: {
    engine: 'openai-function-calling' | 'deterministic-engine';
    destination?: string;
    stated_budget?: number;
    days?: number;
    travelers?: number;
    data_source: 'supabase-live';
    products_searched?: number;
  };
}

export interface TripConstraints {
  destination?: string;
  budget?: number;
  days?: number;
  travelers?: number;
  interests: string[];
  dateFrom?: string;
  dateTo?: string;
}

@Injectable()
export class TravelAgentService {
  private tools: TravelAgentTools;
  private sessions = new Map<string, { history: Array<{ role: string; content: string }> }>();
  private readonly openaiKey = process.env.OPENAI_API_KEY;

  constructor(private readonly supabaseData: SupabaseDataService) {
    this.tools = new TravelAgentTools(this.supabaseData);
  }

  createSession(): { sessionId: string } {
    const sessionId = 'agent_' + Math.random().toString(36).substring(2, 12);
    this.sessions.set(sessionId, { history: [] });
    return { sessionId };
  }

  async processMessage(sessionId: string, message: string): Promise<AgentResponse> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');
    session.history.push({ role: 'user', content: message });

    const constraints = this.extractConstraints(message);
    const result = this.openaiKey
      ? await this.runWithOpenAI(message, constraints)
      : await this.runDeterministicEngine(message, constraints);

    session.history.push({ role: 'assistant', content: result.responseText });
    return result;
  }

  // ------------------------------------------------------------------
  // Constraint extraction (guardrails: every claim must trace to a tool call)
  // ------------------------------------------------------------------
  private extractConstraints(message: string): TripConstraints {
    const m = message.toLowerCase();
    const budgetMatch = m.match(/under\s*\$?([\d,]+)/) || m.match(/\$([\d,]+)/) || m.match(/budget[^\d]*([\d,]+)/);
    const dayMatch = m.match(/(\d+)[-\s]?day/) || m.match(/(\d+)\s*days/);
    const paxMatch = m.match(/(\d+)\s*(people|pax|travelers|tourists|adults|persons)/);
    const dest = this.tools.resolveDestination(message);

    const interests: string[] = [];
    const interestMap: Array<[string, string[]]> = [
      ['cruise', ['cruise', 'boat', 'sunset', 'catamaran', 'ocean']],
      ['food', ['food', 'eat', 'culinary', 'restaurant', 'dining', 'taste']],
      ['museum', ['museum', 'art', 'history', 'culture', 'heritage']],
      ['adventure', ['adventure', 'safari', 'desert', 'dune', 'hiking', 'outdoor', 'trek']],
      ['family', ['family', 'kids', 'children', 'child']],
      ['luxury', ['luxury', 'vip', 'premium', 'romantic']],
      ['beach', ['beach', 'sea', 'island']],
      ['shopping', ['shopping', 'market', 'souvenir']],
    ];
    interestMap.forEach(([label, kws]) => {
      if (kws.some((k) => m.includes(k))) interests.push(label);
    });

    const now = new Date();
    const start = new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 10);
    const days = dayMatch ? parseInt(dayMatch[1], 10) : 2;
    const end = new Date(now.getTime() + (7 + (days - 1)) * 86400000).toISOString().slice(0, 10);

    return {
      destination: dest?.slug,
      budget: budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, ''), 10) : 300,
      days: Math.min(Math.max(days, 1), 7),
      travelers: paxMatch ? parseInt(paxMatch[1], 10) : 2,
      interests,
      dateFrom: start,
      dateTo: end,
    };
  }

  // ------------------------------------------------------------------
  // Deterministic engine: Think -> Act -> Check loop over REAL Supabase data
  // ------------------------------------------------------------------
  private async runDeterministicEngine(message: string, c: TripConstraints): Promise<AgentResponse> {
    const steps: AgentStep[] = [];
    const push = (tool: string, detail: string) => steps.push({ tool, status: 'done', detail });

    const dest = this.tools.resolveDestination(c.destination || message);
    const destSlug = dest?.slug || '';
    const destName = dest ? `${dest.name}, ${dest.country}` : (c.destination || message).split(' ').slice(0, 3).join(' ');

    push('think', `Analyzing request: ${dest ? dest.name : 'destination'}, ${c.days} day(s), budget $${c.budget}, ${c.travelers} traveler(s).`);

    if (!this.supabaseData.enabled) {
      return {
        responseText: `⚠️ **Live data source unavailable.** The backend is not connected to Supabase (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing). I can only plan with real inventory, so please configure Supabase and try again.`,
        steps,
        itinerary: null,
        recommendations: [],
        bookingIntent: null,
        meta: { engine: 'deterministic-engine', data_source: 'supabase-live' },
      };
    }

    let productsSearched = 0;
    let hits: SearchHit[] = [];
    try {
      hits = await this.tools.searchKnowledgeBase(message, { destination: destSlug, limit: 10 });
      productsSearched = hits.length;
    } catch (err: any) {
      return {
        responseText: `⚠️ I couldn't reach the live catalog right now (${err.message}). No data was invented — please retry in a moment.`,
        steps,
        itinerary: null,
        recommendations: [],
        bookingIntent: null,
        meta: { engine: 'deterministic-engine', data_source: 'supabase-live' },
      };
    }

    if (!hits.length) {
      return {
        responseText: `I searched the **live catalog** and found **no bookable experiences** yet for ${dest ? dest.name : 'this request'}.\n\nNothing was invented — as soon as a supplier publishes inventory for this destination, I can build your ${c.days}-day plan. Want me to look at the destinations that do have live inventory?`,
        steps,
        itinerary: null,
        recommendations: await this.safeRecommendations(destSlug),
        bookingIntent: null,
        meta: { engine: 'deterministic-engine', destination: destSlug, stated_budget: c.budget, days: c.days, travelers: c.travelers, data_source: 'supabase-live', products_searched: 0 },
      };
    }

    const chosen: SearchHit[] = hits.slice(0, Math.max(c.days, 1));
    push('search_knowledge_base', `Retrieved ${chosen.length} live, bookable experiences from Supabase catalog.`);

    // Fetch weather and recommendations in parallel (independent operations)
    const [weather, recommendations] = await Promise.all([
      this.tools.getWeatherForecast(destSlug, c.dateFrom, c.dateTo),
      this.safeRecommendations(destSlug)
    ]);

    if (weather.length) {
      push('get_weather_forecast', `Live forecast: ${weather.map((w) => `${w.date} ${w.temp_max}°C ${w.label}`).join(', ')}.`);
    } else {
      push('get_weather_forecast', 'Live weather service responded but returned no daily data for these dates.');
    }

    // Route optimization over real stop coordinates
    const stops = chosen.flatMap((h) => h.itinerary_stops.map((s) => ({ name: s.locationName, latitude: h.meeting_point.latitude, longitude: h.meeting_point.longitude })));
    const route = this.tools.optimizeRoute(stops);
    if (route.length) push('get_directions', `Optimized route order computed for ${route.length} stops by travel time.`);

    // Day-by-day plan built from REAL product itinerary stops (no invented activities).
    // Only schedule a real experience once — extra days become honest free-time days.
    const slotNames = ['MORNING', 'AFTERNOON', 'EVENING'] as const;
    const days: ItineraryDay[] = [];
    for (let d = 0; d < c.days; d++) {
      const weatherNote = weather[d] ? `${weather[d].label}, ${weather[d].temp_max}°C — ${weather[d].advice}` : undefined;
      const activities: ItineraryActivity[] = [];
      const hit = chosen[d];

      if (hit) {
        activities.push({
          time_slot: slotNames[0],
          activity_name: hit.title,
          description: hit.summary,
          estimated_price: hit.base_price,
          listing_id: hit.id,
          duration_minutes: hit.duration_minutes,
          travel_time_min: 0,
          rating: hit.rating,
          image: hit.image,
        });

        // Real stops inside the bookable experience (from the supplier's own itinerary)
        hit.itinerary_stops.forEach((s, idx) => {
          activities.push({
            time_slot: slotNames[(idx + 1) % 3],
            activity_name: s.locationName,
            description: `${s.description}${s.timeToSpend ? ` (${s.timeToSpend})` : ''}`,
            estimated_price: 0,
            listing_id: hit.id,
            duration_minutes: 60,
            travel_time_min: route.find((r) => r.name === s.locationName)?.travel_time_min || 0,
          });
        });
      } else {
        // No live inventory left for this day — be honest, never invent activities
        activities.push({
          time_slot: slotNames[0],
          activity_name: 'Free time — no additional live inventory',
          description: 'No further bookable experiences exist in the live catalog for this destination yet. This day is left flexible so nothing invented is shown.',
          estimated_price: 0,
        });
      }

      if (activities.length < 2) {
        activities.push({
          time_slot: slotNames[1],
          activity_name: 'Free time & flexible exploration',
          description: 'Unstructured time to explore at your own pace — no additional inventory booked.',
          estimated_price: 0,
        });
      }

      days.push({
        day_number: d + 1,
        theme: hit ? (d === 0 ? 'Signature Experience' : `Day ${d + 1} — live experience`) : `Day ${d + 1} — free & flexible`,
        weather_note: weatherNote,
        activities,
        day_cost: Math.round(activities.reduce((a, x) => a + x.estimated_price, 0) * 100) / 100,
      });
    }

    // Budget check against REAL prices
    const flatActivities = days.flatMap((day) => day.activities);
    const budget = this.tools.checkBudget(flatActivities, c.budget);
    push('check_budget', budget.within_budget
      ? `Estimated trip cost $${budget.total_cost} fits within your $${c.budget} budget ($${budget.remaining} to spare).`
      : `Estimated trip cost $${budget.total_cost} exceeds budget by $${budget.over_by}. Suggestions: ${budget.savings_suggestions.join(' ')}`);

    // Recommendations from the REAL catalog (fetched in parallel earlier)
    if (recommendations.length) {
      push('search_restaurants', `Found ${recommendations.length} more live experiences from the catalog.`);
    }

    const plan: ItineraryPlan = {
      trip_name: `Live ${destName.split(',')[0]} ${c.days}-Day Plan`,
      destination: destName.split(',')[0],
      country: destName.split(',')[1]?.trim() || '',
      total_estimated_budget: budget.total_cost,
      stated_budget: c.budget,
      currency: chosen[0]?.currency || 'USD',
      days,
      budget_summary: budget,
      weather,
      recommendations,
    };

    const bookingIntent = this.tools.createBookingIntent(chosen[0], c.dateFrom, c.travelers);

    const line = (h: SearchHit, i: number) =>
      `${i + 1}. **${h.title}** — from $${h.base_price} · ${h.duration_minutes} min`;
    const recLine = recommendations.slice(0, 3).map((r) => `${r.name} (${r.price_range})`).join(' | ');

    const responseText =
      `I've planned your **${c.days}-day ${destName} trip** using **live catalog inventory** (no invented data). 🧳\n\n` +
      `**Bookable experiences (from Supabase):**\n${chosen.slice(0, 4).map(line).join('\n')}\n\n` +
      `**Weather forecast (Open-Meteo live):** ${weather.length ? weather.slice(0, c.days).map((w) => `${w.date}: ${w.label}, ${w.temp_max}°C`).join(' · ') : 'unavailable'}\n\n` +
      `**Budget check:** Estimated total $${budget.total_cost} — ${budget.within_budget ? `within budget ✅ ($${budget.remaining} spare)` : `over by $${budget.over_by} ⚠️ ${budget.savings_suggestions[0] || ''}`}\n\n` +
      `**More live experiences you can book:** ${recLine}\n\n` +
      `I'm holding a **draft booking intent** for **${bookingIntent.tour_title}** (${bookingIntent.option_name} × ${bookingIntent.travelers} = $${bookingIntent.total}) — **reply "yes, book it" to confirm** (no payment taken yet).`;

    return {
      responseText,
      steps,
      bundle: { items: chosen.map((h) => ({ id: h.id, title: h.title, price: h.base_price, img: h.image, rating: h.rating })), totalPrice: budget.total_cost, currency: plan.currency, expiresAt: Date.now() + 10 * 60 * 1000 },
      itinerary: plan,
      recommendations,
      bookingIntent,
      meta: { engine: 'deterministic-engine', destination: destSlug, stated_budget: c.budget, days: c.days, travelers: c.travelers, data_source: 'supabase-live', products_searched: productsSearched },
    };
  }

  private async safeRecommendations(destSlug: string): Promise<RestaurantOrHotel[]> {
    try {
      return await this.tools.getRecommendations(destSlug);
    } catch {
      return [];
    }
  }

  // ------------------------------------------------------------------
  // OpenAI function-calling path (used when OPENAI_API_KEY is configured)
  // ------------------------------------------------------------------
  private async runWithOpenAI(message: string, c: TripConstraints): Promise<AgentResponse> {
    const steps: AgentStep[] = [];
    const tools = this.buildOpenAITools();

    const messages: Array<Record<string, any>> = [
      {
        role: 'system',
        content:
          "You are Karvaan, TravelNest's AI travel agent. Plan itineraries, give recommendations, optimize routes, and handle booking intent. CRITICAL GUARDRAILS: (1) NEVER invent prices, ratings, or availability — every such claim MUST come from a tool result that reads the live Supabase catalog. (2) Never finalize a booking without explicit user confirmation; only create a DRAFT booking intent. (3) Use the optimize_route tool before presenting multi-stop days. (4) Reply concisely in plain text with emoji.",
      },
      { role: 'user', content: message },
    ];

    try {
      for (let turn = 0; turn < 6; turn++) {
        const body: any = {
          model: 'gpt-4o-mini',
          messages,
          tools,
          tool_choice: 'auto',
        };
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.openaiKey}` },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(30000),
        });
        if (!res.ok) throw new Error(`OpenAI API ${res.status}: ${await res.text()}`);
        const data = await res.json();
        const choice = data.choices?.[0];
        const msg = choice?.message;
        if (!msg) throw new Error('Empty OpenAI response');

        messages.push({ role: 'assistant', content: msg.content || '', ...(msg.tool_calls ? { tool_calls: msg.tool_calls } : {}) });

        if (msg.tool_calls?.length) {
          for (const tc of msg.tool_calls) {
            const result = await this.executeOpenAITool(tc.function.name, tc.function.arguments);
            steps.push({ tool: tc.function.name, status: 'done', detail: result.summary });
            messages.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify(result.data) });
          }
          continue;
        }

        const fallback = await this.runDeterministicEngine(message, c);
        return {
          responseText: msg.content || fallback.responseText,
          steps,
          bundle: fallback.bundle,
          itinerary: fallback.itinerary,
          recommendations: fallback.recommendations,
          bookingIntent: fallback.bookingIntent,
          meta: { engine: 'openai-function-calling', destination: c.destination, stated_budget: c.budget, days: c.days, travelers: c.travelers, data_source: 'supabase-live' },
        };
      }
      throw new Error('Agent loop exceeded max turns');
    } catch (err) {
      return this.runDeterministicEngine(message, c);
    }
  }

  private buildOpenAITools() {
    return [
      {
        type: 'function',
        function: {
          name: 'search_knowledge_base',
          description: 'Search TravelNest\'s live Supabase catalog of bookable tours and experiences with structured metadata filters.',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Natural language query about the trip.' },
              destination: { type: 'string', description: 'Destination slug (tokyo, bali, paris, lahore, dubai, rome, karachi, islamabad, istanbul, bangkok, london, new-york).' },
              category: { type: 'string' },
              max_price: { type: 'number' },
              interests: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'get_weather_forecast',
          description: 'Get a live weather forecast for a destination on given dates (Open-Meteo).',
          parameters: {
            type: 'object',
            properties: { location: { type: 'string' }, from_date: { type: 'string' }, to_date: { type: 'string' } },
            required: ['location'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'optimize_route',
          description: 'Optimize the order of stops to minimize travel time between them.',
          parameters: {
            type: 'object',
            properties: { stops: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, latitude: { type: 'number' }, longitude: { type: 'number' } } } } },
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'check_budget',
          description: 'Check whether the drafted itinerary fits the traveler\'s stated budget and suggest savings.',
          parameters: {
            type: 'object',
            properties: {
              activities: { type: 'array', items: { type: 'object', properties: { activity_name: { type: 'string' }, estimated_price: { type: 'number' } } } },
              stated_budget: { type: 'number' },
            },
            required: ['activities', 'stated_budget'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'search_restaurants',
          description: 'Get recommendations for a destination from the live catalog of bookable experiences.',
          parameters: {
            type: 'object',
            properties: { destination: { type: 'string' }, price_tier: { type: 'string', enum: ['budget', 'mid', 'premium'] } },
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'create_booking',
          description: 'Create a DRAFT booking intent for a selected live experience. NEVER finalizes — requires explicit user confirmation.',
          parameters: {
            type: 'object',
            properties: { tour_id: { type: 'string' }, date: { type: 'string' }, travelers: { type: 'number' } },
            required: ['tour_id', 'date', 'travelers'],
          },
        },
      },
    ];
  }

  private async executeOpenAITool(name: string, rawArgs: string): Promise<{ summary: string; data: any }> {
    const args = JSON.parse(rawArgs || '{}');
    switch (name) {
      case 'search_knowledge_base': {
        const hits = await this.tools.searchKnowledgeBase(args.query || '', args);
        return { summary: `Found ${hits.length} live results.`, data: hits };
      }
      case 'get_weather_forecast':
        return { summary: `Weather fetched for ${args.location}.`, data: await this.tools.getWeatherForecast(args.location, args.from_date || '', args.to_date || '') };
      case 'optimize_route':
        return { summary: 'Route optimized.', data: this.tools.optimizeRoute(args.stops || []) };
      case 'check_budget':
        return { summary: 'Budget checked.', data: this.tools.checkBudget(args.activities || [], args.stated_budget || 0) };
      case 'search_restaurants':
        return { summary: `Found live recommendations for ${args.destination}.`, data: await this.safeRecommendations(args.destination) };
      case 'create_booking': {
        const products = await this.supabaseData.getProducts();
        const product = products.find((p) => p.id === args.tour_id);
        if (!product) return { summary: 'Tour not found in live catalog.', data: null };
        const hit = (await this.tools.searchKnowledgeBase('', { limit: 20 })).find((h) => h.id === args.tour_id);
        if (!hit) return { summary: 'Tour not found in live catalog.', data: null };
        return { summary: 'Draft booking intent created from live inventory.', data: this.tools.createBookingIntent(hit, args.date, args.travelers || 1) };
      }
      default:
        return { summary: 'Unknown tool.', data: null };
    }
  }
}