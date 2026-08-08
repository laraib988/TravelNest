import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getReviews(@Query('listing_id') listingId: string) {
    return this.reviewsService.findByListing(listingId);
  }

  @Post()
  submitReview(@Body() body: any) {
    return this.reviewsService.createReview(body);
  }

  @Post(':id/reply')
  replyToReview(@Param('id') id: string, @Body() body: any) {
    const { text } = body;
    return this.reviewsService.reply(id, text);
  }

  @Post(':id/flag')
  flagReview(@Param('id') id: string) {
    return this.reviewsService.flag(id);
  }

  @Post(':id/helpful')
  markHelpful(@Param('id') id: string) {
    return this.reviewsService.markHelpful(id);
  }
}
