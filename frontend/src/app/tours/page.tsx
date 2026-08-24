import { getAlternates } from '@/lib/seo';
export const metadata = {
  title: 'Search Tours | Vaitour',
  description: 'Find your next adventure.',
  alternates: getAlternates('/tours')
};
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
