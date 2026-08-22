import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NEXT_PUBLIC_SITE_ENV === 'production';
  return {
    rules: isProd
      ? [
          { 
            userAgent: '*', 
            allow: '/', 
            disallow: [
              '/admin/', '/supplier/', '/checkout/', '/cart',
              '/wishlist', '/api/', 
              '/*?*sort=', '/*?*session=', '/*?*duration=', '/*?*category=', '/*?*price=', '/*?*date='
            ] 
          },
        ]
      : [{ userAgent: '*', disallow: '/' }], // staging = fully blocked
    sitemap: 'https://www.vaitour.com/sitemap.xml',
  };
}
