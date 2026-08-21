import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RevalidateService {
  private readonly logger = new Logger(RevalidateService.name);
  private readonly frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  private readonly secret = process.env.REVALIDATE_SECRET || 'travelnest_revalidate_secret_2026';

  async revalidateTour(slug: string) {
    try {
      this.logger.log(`Requesting on-demand revalidation for tour: ${slug}`);
      const response = await fetch(`${this.frontendUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          secret: this.secret,
        }),
      });
      
      const data = await response.json();
      this.logger.log(`Revalidation response: ${JSON.stringify(data)}`);
      return data;
    } catch (error: any) {
      this.logger.error(`Failed to revalidate ${slug}: ${error.message}`);
      return null;
    }
  }
}
