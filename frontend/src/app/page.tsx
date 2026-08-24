import { getAlternates } from '@/lib/seo';
export const metadata = {
  title: 'Vaitour - Global Tours, Activities & Experiences',
  description: 'Vaitour connects travelers with KYC-verified local tour operators across Japan and globally, offering instant booking, free cancellation, and multilingual support.',
  alternates: getAlternates('/')
};
import HomePageClient from './HomePageClient';

export const revalidate = 3600;

export default function Page() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vaitour',
    url: 'https://www.vaitour.com',
    logo: 'https://www.vaitour.com/icon.png',
    description: 'Multi-locale OTA marketplace for booking tours, activities, and travel experiences worldwide, with a strong focus on Japan.',
    sameAs: [
      'https://twitter.com/vaitour',
      'https://www.facebook.com/vaitour',
      'https://www.instagram.com/vaitour'
    ]
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vaitour',
    url: 'https://www.vaitour.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.vaitour.com/tours?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomePageClient />
    </>
  );
}
