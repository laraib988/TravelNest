import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { AIPlannerService } from './ai-planner.service';

@Controller('api/v1/ai')
export class AIPlannerController {
  constructor(private readonly aiPlannerService: AIPlannerService) {}

  @Post('trip-planner')
  generateItinerary(@Body() body: { prompt: string; destination?: string; max_budget?: number }) {
    return this.aiPlannerService.generateItinerary(body.prompt || 'Luxury sunset cruise', body.destination || 'bali', body.max_budget || 250);
  }

  @Get('review-summary/:listingId')
  getReviewSummary(@Param('listingId') listingId: string) {
    return this.aiPlannerService.getReviewSummary(listingId);
  }

  @Get('dynamic-pricing/:listingId')
  getDynamicPricing(@Param('listingId') listingId: string) {
    return this.aiPlannerService.getDynamicPricingRecommendation(listingId);
  }

  @Post('contextual-qa')
  contextualQA(@Body() body: { listing_id: string; question: string }) {
    return this.aiPlannerService.answerContextualQuestion(body.listing_id, body.question);
  }
}
