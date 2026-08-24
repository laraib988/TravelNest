import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  
  return {
    title: 'Contact | Vaitour',
    alternates: {
      canonical: `https://www.vaitour.com/${locale}/contact`,
      languages: {
        en: `https://www.vaitour.com/en/contact`,
        ja: `https://www.vaitour.com/ja/contact`,
        ur: `https://www.vaitour.com/ur/contact`,
        fr: `https://www.vaitour.com/fr/contact`,
        ar: `https://www.vaitour.com/ar/contact`,
        'x-default': `https://www.vaitour.com/en/contact`,
      }
    }
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
