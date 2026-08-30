import { getAlternates } from '@/lib/seo';
import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  
  const seoTitle = 'Vaitour | Book Local Tours, Activities & Experiences Worldwide';
  const seoDesc = 'Find and book the best local tours, day trips, and travel experiences. Connect directly with verified local guides in Japan and worldwide. Instant booking and free cancellation.';
  const url = locale === 'en' ? 'https://www.vaitour.com/en' : `https://www.vaitour.com/${locale}`;

  return {
    title: seoTitle,
    description: seoDesc,
    keywords: ['book local tours', 'Japan local guides', 'travel experiences', 'day trips', 'verified tour operators', 'holiday activities', 'best museums in tokyo', 'sapporo', 'harajuku', 'kamakura', 'asakusa', 'dotonbori', 'kobe japan', 'nara japan', 'nikko', 'things to do in tokyo', 'japan food', 'kabukicho', 'kyoto station', 'ueno park', 'ghibli museum tickets', 'hakone japan', 'kansai region', 'kanto'],
    alternates: {
      canonical: url,
      languages: {
        en: 'https://www.vaitour.com/en',
        ja: 'https://www.vaitour.com/ja',
        ur: 'https://www.vaitour.com/ur',
        fr: 'https://www.vaitour.com/fr',
        ar: 'https://www.vaitour.com/ar',
        'x-default': 'https://www.vaitour.com/en',
      }
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: url,
      type: 'website',
      images: [{ url: 'https://www.vaitour.com/og-image.jpg', width: 1200, height: 630, alt: 'Vaitour Experiences' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDesc,
      images: ['https://www.vaitour.com/og-image.jpg'],
    }
  };
}
import HomePageClient from './HomePageClient';

export const revalidate = 3600;

export default function Page() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Vaitour',
    url: 'https://www.vaitour.com',
    logo: 'https://www.vaitour.com/icon.png',
    description: 'Multi-locale OTA marketplace for booking tours, activities, and travel experiences worldwide, with a strong focus on Japan.',
    sameAs: [
      'https://twitter.com/vaitour',
      'https://www.facebook.com/vaitour',
      'https://www.instagram.com/vaitour',
      'https://www.linkedin.com/company/vaitour'
    ],
    founder: {
      '@type': 'Person',
      name: 'Vaitour Team',
      sameAs: [
        'https://www.linkedin.com/in/vaitour-founder', // placeholder
        'https://github.com/vaitour',
        'https://www.upwork.com/agencies/vaitour'
      ]
    },
    knowsAbout: [
      'Japan Travel', 'Guided Tours', 'Experiences', 'Day Trips', 'Ticket Booking'
    ],
    areaServed: 'Worldwide',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@vaitour.com',
      availableLanguage: ['English', 'Japanese', 'French', 'Arabic', 'Urdu']
    }
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
