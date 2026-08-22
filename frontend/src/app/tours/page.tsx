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
