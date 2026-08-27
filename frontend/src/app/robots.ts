import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProd = true; // Always allow crawling for production audit
  return {
    rules: isProd
      ? [
          { 
            userAgent: '*', 
            allow: '/', 
            disallow: [
              '/admin-portal/', '/supplier/', '/checkout/', '/cart',
              '/wishlist', '/api/', '/login', '/signup', '/*/login', '/*/signup',
              '/notifications', '/profile', '/my-bookings', '/*/notifications', '/*/profile', '/*/my-bookings',
              '/cdn-cgi/',
              '/*?*sort=', '/*?*session=', '/*?*duration=', '/*?*category=', '/*?*price=', '/*?*date=', '/*?*redirect='
            ] 
          },
        ]
      : [{ userAgent: '*', disallow: '/' }], // staging = fully blocked
    sitemap: 'https://www.vaitour.com/sitemap.xml',
  };
}
