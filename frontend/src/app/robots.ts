import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { 
        userAgent: '*', 
        allow: '/', 
        disallow: [
          '/admin-portal/', '/supplier/', '/checkout/', '/cart',
          '/wishlist', '/api/', '/login', '/signup', 
          '/notifications', '/profile', '/my-bookings'
        ] 
      }
    ],
    sitemap: 'https://www.vaitour.com/sitemap.xml',
  };
}
