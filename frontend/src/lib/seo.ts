import { headers } from 'next/headers';

export const getDynamicAlternates = async (path: string) => {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  const p = path.startsWith('/') ? path : `/${path}`;
  const base = p === '/' ? '' : p;
  
  return {
    canonical: `https://www.vaitour.com/${locale}${base}`,
    languages: {
      en: `https://www.vaitour.com/en${base}`,
      ja: `https://www.vaitour.com/ja${base}`,
      ur: `https://www.vaitour.com/ur${base}`,
      fr: `https://www.vaitour.com/fr${base}`,
      ar: `https://www.vaitour.com/ar${base}`,
      'x-default': `https://www.vaitour.com/en${base}`,
    }
  };
};

export const getAlternates = (path: string) => {
  const p = path.startsWith('/') ? path : `/${path}`;
  const base = p === '/' ? '' : p;
  return {
    canonical: `https://www.vaitour.com/en${base}`,
    languages: {
      en: `https://www.vaitour.com/en${base}`,
      ja: `https://www.vaitour.com/ja${base}`,
      ur: `https://www.vaitour.com/ur${base}`,
      fr: `https://www.vaitour.com/fr${base}`,
      ar: `https://www.vaitour.com/ar${base}`,
      'x-default': `https://www.vaitour.com/en${base}`,
    }
  };
};
