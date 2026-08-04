import { Injectable } from '@nestjs/common';
import { dbStore, Listing } from '../mock-db/db.store';

@Injectable()
export class VectorSearchService {
  private cosineSimilarity(v1: number[], v2: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < v1.length; i++) {
      dotProduct += v1[i] * v2[i];
      normA += v1[i] * v1[i];
      normB += v2[i] * v2[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-9);
  }

  private generateQueryVector(query: string): number[] {
    const text = query.toLowerCase();
    const vec = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];
    if (text.includes('cruise') || text.includes('boat') || text.includes('sunset') || text.includes('ocean') || text.includes('sea') || text.includes('bali')) {
      vec[0] = 0.95; vec[2] = 0.85; vec[5] = 0.8; vec[7] = 0.95;
    }
    if (text.includes('food') || text.includes('ramen') || text.includes('sake') || text.includes('eat') || text.includes('tokyo') || text.includes('izakaya')) {
      vec[1] = 0.95; vec[3] = 0.9; vec[4] = 0.85; vec[6] = 0.8;
    }
    if (text.includes('museum') || text.includes('art') || text.includes('louvre') || text.includes('paris') || text.includes('history')) {
      vec[4] = 0.95; vec[5] = 0.9; vec[1] = 0.4;
    }
    if (text.includes('lahore') || text.includes('mosque') || text.includes('walled') || text.includes('heritage') || text.includes('pakistan')) {
      vec[3] = 0.9; vec[6] = 0.85; vec[7] = 0.8;
    }
    return vec;
  }

  public hybridSearch(query: string, destinationSlug?: string, category?: string): Array<Listing & { match_score: number }> {
    if (!query || !query.trim()) {
      return dbStore.listings.map((l) => ({ ...l, match_score: 1.0 }));
    }

    const cleanQuery = query.trim().toLowerCase();
    const keywords = cleanQuery.split(/\s+/).filter((w) => w.length > 1 && !['in', 'at', 'the', 'for', 'of', 'and', 'a', 'to'].includes(w));
    const queryVec = this.generateQueryVector(cleanQuery);

    // Check if query contains any explicit destination keyword (e.g., "bali", "tokyo", "paris", "lahore")
    const explicitDest = dbStore.destinations.find((d) => 
      cleanQuery.includes(d.slug.toLowerCase()) || cleanQuery.includes(d.name.toLowerCase()) || cleanQuery.includes(d.country.toLowerCase())
    );

    let candidates = dbStore.listings;
    if (explicitDest) {
      candidates = candidates.filter((l) => l.destination_id === explicitDest.id);
    } else if (destinationSlug) {
      const dest = dbStore.destinations.find((d) => d.slug === destinationSlug);
      if (dest) candidates = candidates.filter((l) => l.destination_id === dest.id);
    }

    if (category && category !== 'ALL') {
      candidates = candidates.filter((l) => l.category_name.toLowerCase().includes(category.toLowerCase()) || l.category_id === category);
    }

    const scored = candidates.map((l) => {
      const dest = dbStore.destinations.find((d) => d.id === l.destination_id);
      const fullContent = `${l.title} ${l.summary} ${l.description} ${l.category_name} ${dest ? dest.name + ' ' + dest.country : ''}`.toLowerCase();

      let keywordHits = 0;
      keywords.forEach((kw) => {
        if (fullContent.includes(kw)) {
          keywordHits += 1;
        }
      });

      const textMatchRatio = keywords.length > 0 ? keywordHits / keywords.length : 0;
      const vecScore = this.cosineSimilarity(queryVec, l.embedding);

      // Require textMatchRatio > 0 if explicit keywords are typed
      const finalScore = textMatchRatio > 0 ? Number((textMatchRatio * 0.7 + vecScore * 0.3).toFixed(4)) : 0;
      return { ...l, match_score: finalScore };
    });

    // Strictly return items that matched the keywords
    const matched = scored.filter((item) => item.match_score > 0);
    if (matched.length > 0) {
      return matched.sort((a, b) => b.match_score - a.match_score);
    }

    // Fallback if no exact keyword hit: return candidate listings for that destination or top listings
    return candidates.map((l) => ({ ...l, match_score: 0.5 }));
  }
}
