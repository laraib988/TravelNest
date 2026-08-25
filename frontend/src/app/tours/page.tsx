import { getDynamicAlternates } from '@/lib/seo';
export async function generateMetadata() {
  return {
    title: 'Search Tours | Vaitour',
    description: 'Find your next adventure.',
    alternates: await getDynamicAlternates('/tours')
  };
}
import TourSearchClient from './TourSearchClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>}>
      <TourSearchClient />
    </Suspense>
  );
}
