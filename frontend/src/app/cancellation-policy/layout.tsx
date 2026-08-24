import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  
  return {
    title: 'Cancellation Policy | Vaitour',
    alternates: {
      canonical: `https://www.vaitour.com/${locale}/cancellation-policy`,
      languages: {
        en: `https://www.vaitour.com/en/cancellation-policy`,
        ja: `https://www.vaitour.com/ja/cancellation-policy`,
        ur: `https://www.vaitour.com/ur/cancellation-policy`,
        fr: `https://www.vaitour.com/fr/cancellation-policy`,
        ar: `https://www.vaitour.com/ar/cancellation-policy`,
        'x-default': `https://www.vaitour.com/en/cancellation-policy`,
      }
    }
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
