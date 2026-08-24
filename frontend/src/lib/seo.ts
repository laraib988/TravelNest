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
