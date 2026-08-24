import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  
  return {
    title: 'Faq | Vaitour',
    alternates: {
      canonical: `https://www.vaitour.com/${locale}/faq`,
      languages: {
        en: `https://www.vaitour.com/en/faq`,
        ja: `https://www.vaitour.com/ja/faq`,
        ur: `https://www.vaitour.com/ur/faq`,
        fr: `https://www.vaitour.com/fr/faq`,
        ar: `https://www.vaitour.com/ar/faq`,
        'x-default': `https://www.vaitour.com/en/faq`,
      }
    }
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
