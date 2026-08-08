import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'http://localhost:3000';

  const staticPages = [
    '',
    '/ai-planner',
    '/blog',
    '/destinations/bali',
    '/destinations/tokyo',
    '/destinations/paris',
    '/destinations/lahore',
    '/destinations/dubai',
    '/destinations/rome',
    '/destinations/karachi',
    '/destinations/islamabad',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
    '/cancellation-policy',
    '/refund-policy',
  ];

  const tourSlugs = [
    'luxury-bali-sunset-catamaran-cruise',
    'louvre-museum-masterpieces-guided-tour',
    'lahore-walled-city-heritage-food-walk',
    'dubai-vip-red-dune-desert-safari',
    'colosseum-gladiator-arena-floor-tour',
    'karachi-city-of-lights-private-tour',
    'islamabad-margalla-hills-faisal-mosque-tour',
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>`
    )
    .join('')}
  ${tourSlugs
    .map(
      (slug) => `
    <url>
      <loc>${baseUrl}/tours/${slug}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
