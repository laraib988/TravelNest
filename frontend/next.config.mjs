/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Workaround for Next.js 14.1.0 `ENOENT _ssgManifest.js` / `/_document`
    // build-harvest races on Windows. Disabling the webpack build worker and
    // capping CPU concurrency serializes the build so the static build-id
    // folder and pages manifest are written before they are read.
    webpackBuildWorker: false,
    cpus: 1,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in the application
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            // Enforce HTTPS
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            // Prevent Clickjacking (stops hackers from embedding your site in an invisible iframe)
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            // Prevent MIME-sniffing
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Control referrer information sent to other sites
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            // Content Security Policy (CSP): The ultimate shield against XSS & Data Injection
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com; frame-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://api.mapbox.com https://fonts.googleapis.com https://cdn.jsdelivr.net; img-src 'self' data: blob: https://images.unsplash.com https://*.cloudinary.com https://*.tile.openstreetmap.org https://unpkg.com https://*.mapbox.com https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://*.supabase.co https://api.mapbox.com https://events.mapbox.com https://api.frankfurter.app http://localhost:4000;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
