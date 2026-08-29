import { getDynamicAlternates } from '@/lib/seo';
export async function generateMetadata() {
  return {
    title: 'Search Tours | Vaitour',
    description: 'Find your next adventure.',
    keywords: ['best museums in tokyo', 'sapporo', 'harajuku', 'kamakura', 'asakusa', 'dotonbori', 'kobe japan', 'nara japan', 'nikko', 'things to do in tokyo', 'japan food', 'kabukicho', 'kyoto station', 'ueno park', 'ghibli museum tickets', 'hakone japan', 'kansai region', 'kanto', 'japan tours', 'book tours'],
    alternates: await getDynamicAlternates('/tours')
  };
}
import TourSearchClient from './TourSearchClient';
import { Suspense } from 'react';

export const revalidate = 3600;

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>}>
      <TourSearchClient />
    </Suspense>
  );
}
