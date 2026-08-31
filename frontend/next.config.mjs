import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  experimental: {
    webpackBuildWorker: false,
    cpus: 1,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'media.istockphoto.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'static.toiimg.com' },
    ],
  },
  async redirects() {
    // Point directly to /en/destination to avoid the middleware locale
    // redirect chain (which would add an extra 307 hop).
    // All destination paths have been verified to return HTTP 200.
    const brokenLinks = [
      { from: 'bookings',         to: '/en/my-bookings' },
      { from: 'saved',            to: '/en/wishlist' },
      { from: 'corporate',        to: '/en/about' },
      { from: 'investors',        to: '/en/about' },
      { from: 'press',            to: '/en/about' },
      { from: 'cookies',         to: '/en/privacy' },
      { from: 'dashboard',        to: '/en' },
      { from: 'become-a-host',   to: '/en/supplier/signup' },
      { from: 'impact',           to: '/en/about' },
      { from: 'gift-cards',       to: '/en' },
      { from: 'accessibility',    to: '/en/support' },
      { from: 'profile/settings', to: '/en/profile' },
      { from: 'safety',           to: '/en/support' },
      { from: 'affiliates',       to: '/en/supplier/signup' },
      { from: 'careers',          to: '/en/about' },
    ];
    
    return brokenLinks.flatMap(link => [
      { source: `/${link.from}`,     destination: link.to, permanent: true },
      { source: `/en/${link.from}`,  destination: link.to, permanent: true },
    ]);
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(self), camera=()' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com; frame-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://api.mapbox.com https://fonts.googleapis.com https://cdn.jsdelivr.net; img-src 'self' data: blob: https://images.unsplash.com https://unsplash.com https://plus.unsplash.com https://media.istockphoto.com https://encrypted-tbn0.gstatic.com https://*.cloudinary.com https://*.tile.openstreetmap.org https://unpkg.com https://*.mapbox.com https://ui-avatars.com https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mapbox.com https://events.mapbox.com https://api.frankfurter.app https://travelnest-backend.onrender.com https://*.onrender.com http://localhost:4000 https://cdn.jsdelivr.net;",
          },
        ],
      },
    ];
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
