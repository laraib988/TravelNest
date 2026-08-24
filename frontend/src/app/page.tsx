import { getAlternates } from '@/lib/seo';
export const metadata = {
  title: 'Vaitour - Global Tours, Activities & Experiences',
  description: 'Book top-rated tours worldwide.',
  alternates: getAlternates('/')
};
import HomePageClient from './HomePageClient';

export const revalidate = 3600;

export default function Page() {
  return <HomePageClient />;
}
