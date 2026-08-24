import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  
  return {
    title: 'Privacy | Vaitour',
    alternates: {
      canonical: `https://www.vaitour.com/${locale}/privacy`,
      languages: {
        en: `https://www.vaitour.com/en/privacy`,
        ja: `https://www.vaitour.com/ja/privacy`,
        ur: `https://www.vaitour.com/ur/privacy`,
        fr: `https://www.vaitour.com/fr/privacy`,
        ar: `https://www.vaitour.com/ar/privacy`,
        'x-default': `https://www.vaitour.com/en/privacy`,
      }
    }
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
