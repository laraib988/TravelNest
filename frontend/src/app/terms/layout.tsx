import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  
  return {
    title: 'Terms | Vaitour',
    alternates: {
      canonical: `https://www.vaitour.com/${locale}/terms`,
      languages: {
        en: `https://www.vaitour.com/en/terms`,
        ja: `https://www.vaitour.com/ja/terms`,
        ur: `https://www.vaitour.com/ur/terms`,
        fr: `https://www.vaitour.com/fr/terms`,
        ar: `https://www.vaitour.com/ar/terms`,
        'x-default': `https://www.vaitour.com/en/terms`,
      }
    }
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
