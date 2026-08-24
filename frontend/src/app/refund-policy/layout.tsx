import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  
  return {
    title: 'Refund Policy | Vaitour',
    alternates: {
      canonical: `https://www.vaitour.com/${locale}/refund-policy`,
      languages: {
        en: `https://www.vaitour.com/en/refund-policy`,
        ja: `https://www.vaitour.com/ja/refund-policy`,
        ur: `https://www.vaitour.com/ur/refund-policy`,
        fr: `https://www.vaitour.com/fr/refund-policy`,
        ar: `https://www.vaitour.com/ar/refund-policy`,
        'x-default': `https://www.vaitour.com/en/refund-policy`,
      }
    }
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
