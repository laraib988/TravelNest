import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  
  return {
    title: 'About | Vaitour',
    alternates: {
      canonical: `https://www.vaitour.com/${locale}/about`,
      languages: {
        en: `https://www.vaitour.com/en/about`,
        ja: `https://www.vaitour.com/ja/about`,
        ur: `https://www.vaitour.com/ur/about`,
        fr: `https://www.vaitour.com/fr/about`,
        ar: `https://www.vaitour.com/ar/about`,
        'x-default': `https://www.vaitour.com/en/about`,
      }
    }
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
