import { getAlternates } from '@/lib/seo';
import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  return {
    title: 'Vaitour - Global Tours, Activities & Experiences',
    description: 'Vaitour connects travelers with KYC-verified local tour operators across Japan and globally, offering instant booking, free cancellation, and multilingual support.',
    alternates: {
      canonical: locale === 'en' ? 'https://www.vaitour.com/en' : `https://www.vaitour.com/${locale}`,
      languages: {
        en: 'https://www.vaitour.com/en',
        ja: 'https://www.vaitour.com/ja',
        ur: 'https://www.vaitour.com/ur',
        fr: 'https://www.vaitour.com/fr',
        ar: 'https://www.vaitour.com/ar',
        'x-default': 'https://www.vaitour.com/en',
      }
    }
  };
}
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
