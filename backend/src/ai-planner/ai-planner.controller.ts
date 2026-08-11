import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AIPlannerService } from './ai-planner.service';

@Controller('api/v1/ai')
export class AIPlannerController {
  constructor(private readonly aiPlannerService: AIPlannerService) {}

  // 1. SRS 9.1: AI Trip Planner
  @Post('trip-planner')
  generateItinerary(@Body() body: { prompt: string; destination?: string; max_budget?: number }) {
    return this.aiPlannerService.generateItinerary(body.prompt, body.destination, body.max_budget);
  }

  // 2. SRS 9.2: AI Semantic Search
  @Post('search')
  semanticSearch(@Body() body: { query: string; destination?: string }) {
    return this.aiPlannerService.semanticSearch(body.query, body.destination);
  }

  // 3. SRS 9.3: AI Review Intelligence
  @Get('review-summary/:listingId')
  getReviewSummary(@Param('listingId') listingId: string) {
    return this.aiPlannerService.getReviewSummary(listingId);
  }

  // 4. SRS 9.4: AI Fake Review Detection
  @Post('review-check')
  checkReviewFraud(@Body() body: { review_text: string; rating: number }) {
    return this.aiPlannerService.checkReviewFraud(body.review_text, body.rating);
  }

  // 5. SRS 9.5: AI Dynamic Pricing Advisor
  @Get('dynamic-pricing/:listingId')
  getDynamicPricing(@Param('listingId') listingId: string) {
    return this.aiPlannerService.getDynamicPricingRecommendation(listingId);
  }

  // 6. SRS 9.6: AI Concierge Chatbot
  @Post('chat')
  conciergeChat(@Body() body: { message: string; locale?: string }) {
    return this.aiPlannerService.conciergeChat(body.message, body.locale);
  }

  // 7. SRS 9.7: AI Personalization Engine
  @Get('personalized-recommendations')
  getPersonalizedRecommendations(@Query('userId') userId?: string) {
    return this.aiPlannerService.getPersonalizedRecommendations(userId);
  }

  // 8. SRS 9.8: AI Photo Intelligence
  @Post('photo-analysis')
  analyzePhotoQuality(@Body() body: { photo_url: string }) {
    return this.aiPlannerService.analyzePhotoQuality(body.photo_url);
  }

  // 10. SRS 9.10: AI SEO Content Assistant
  @Post('seo-assistant')
  getSEOAssistantSuggestions(@Body() body: { title: string; body_content: string }) {
    return this.aiPlannerService.getSEOAssistantSuggestions(body.title, body.body_content);
  }

  // 11. SRS 9.11: Predictive Demand Forecasting
  @Get('forecast/:supplierId')
  getDemandForecast(@Param('supplierId') supplierId: string) {
    return this.aiPlannerService.getDemandForecast(supplierId);
  }

  // 12. SRS 9.12: AI Auto Translation
  @Post('translate')
  translateText(@Body() body: { text: string; target_language: string }) {
    return this.aiPlannerService.translateText(body.text, body.target_language);
  }

  // 13. SRS 9.13: Sentiment-Based Support Triage
  @Post('support-priority')
  triageSupportTicket(@Body() body: { subject: string; message: string }) {
    return this.aiPlannerService.triageSupportTicket(body.subject, body.message);
  }

  // 14. SRS 9.14: Contextual "Ask AI About This Place" Q&A
  @Post('contextual-qa')
  answerContextualQuestion(@Body() body: { listing_id: string; question: string }) {
    return this.aiPlannerService.answerContextualQuestion(body.listing_id, body.question);
  }
  // --- NEW: AI Booking Agent (SRS §9) ---
  @Post('agent/session')
  createAgentSession() {
    return this.aiPlannerService.createAgentSession();
  }

  @Post('agent/session/:id/message')
  processAgentMessage(@Param('id') id: string, @Body() body: { message: string }) {
    return this.aiPlannerService.processAgentMessage(id, body.message);
  }
}
