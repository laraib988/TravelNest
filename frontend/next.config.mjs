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
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  async redirects() {
    const brokenLinks = [
      { from: 'bookings', to: '/my-bookings' },
      { from: 'saved', to: '/wishlist' },
      { from: 'corporate', to: '/about' },
      { from: 'investors', to: '/about' },
      { from: 'press', to: '/about' },
      { from: 'cookies', to: '/privacy' },
      { from: 'dashboard', to: '/' },
      { from: 'become-a-host', to: '/supplier/signup' },
      { from: 'impact', to: '/about' },
      { from: 'gift-cards', to: '/' },
      { from: 'accessibility', to: '/support' },
      { from: 'profile/settings', to: '/settings' },
      { from: 'safety', to: '/support' },
      { from: 'affiliates', to: '/supplier/signup' },
      { from: 'careers', to: '/about' },
    ];
    
    return brokenLinks.flatMap(link => [
      { source: `/${link.from}`, destination: link.to, permanent: true },
      { source: `/en/${link.from}`, destination: link.to, permanent: true }
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com; frame-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://api.mapbox.com https://fonts.googleapis.com https://cdn.jsdelivr.net; img-src 'self' data: blob: https://images.unsplash.com https://*.cloudinary.com https://*.tile.openstreetmap.org https://unpkg.com https://*.mapbox.com https://ui-avatars.com https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mapbox.com https://events.mapbox.com https://api.frankfurter.app https://travelnest-backend.onrender.com https://*.onrender.com http://localhost:4000 https://cdn.jsdelivr.net;",
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
