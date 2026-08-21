import TourDetailClient from './TourDetailClient';

export const revalidate = 3600; // ISR

export default function Page() {
  return <TourDetailClient />;
}
