import TourSearchClient from './TourSearchClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  // In Next.js App Router, to set Cache-Control headers for a page,
  // we either rely on fetch cache options or route segment config.
  // We use force-dynamic to ensure SSR per request.
  return <TourSearchClient />;
}
