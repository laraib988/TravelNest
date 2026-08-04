import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { VectorSearchService } from './vector-search.service';
import { dbStore } from '../mock-db/db.store';

@Controller('api/v1/listings')
export class ListingsController {
  constructor(private readonly vectorSearchService: VectorSearchService) {}

  @Get()
  getAllListings(
    @Query('destination') destination?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    if (search) {
      return this.vectorSearchService.hybridSearch(search, destination, category);
    }

    let results = dbStore.listings;
    if (destination) {
      const dest = dbStore.destinations.find((d) => d.slug === destination);
      if (dest) results = results.filter((l) => l.destination_id === dest.id);
    }
    if (category) {
      results = results.filter((l) => l.category_name.toLowerCase().includes(category.toLowerCase()) || l.category_id === category);
    }
    return results;
  }

  @Get('categories')
  getCategories() {
    return dbStore.categories;
  }

  @Get('destinations')
  getDestinations() {
    return dbStore.destinations;
  }

  @Get('destinations/:slug')
  getDestinationBySlug(@Param('slug') slug: string) {
    const dest = dbStore.destinations.find((d) => d.slug === slug);
    if (!dest) throw new NotFoundException('Destination not found');
    const topListings = dbStore.listings.filter((l) => l.destination_id === dest.id);
    return {
      destination: dest,
      top_listings: topListings,
      recent_blogs: [
        { title: `Top 10 Things to Do in ${dest.name} in 2026`, slug: `${slug}-top-10-guide`, published_at: '2026-07-28' },
        { title: `Ultimate Budget & Culinary Guide for ${dest.name}`, slug: `${slug}-food-guide`, published_at: '2026-07-20' }
      ]
    };
  }

  @Get(':slug')
  getListingBySlug(@Param('slug') slug: string) {
    const listing = dbStore.listings.find((l) => l.slug === slug || l.id === slug);
    if (!listing) throw new NotFoundException('Listing not found');
    const dest = dbStore.destinations.find((d) => d.id === listing.destination_id);
    const slots = dbStore.availabilitySlots.filter((s) => s.listing_id === listing.id);

    return {
      ...listing,
      destination_name: dest ? dest.name : 'Global',
      available_slots: slots,
    };
  }
}
