import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for rate limiting
const ipRequestCount = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT = 50; // Maximum requests allowed
const WINDOW_MS = 60 * 1000; // Time window (1 minute)

const SUPPORTED_LOCALES = ['en', 'ja', 'ur', 'fr', 'ar'];
const DEFAULT_LOCALE = 'en';

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // ─────────────────────────────────────────────
  // 0a. Strip trailing slashes (permanent 301)
  //     Prevents SEO "trailing slash mismatch" redirect chains.
  //     e.g. /en/ → /en, /tours/ → /tours
  //     Root "/" is intentionally excluded.
  // ─────────────────────────────────────────────
  if (pathname !== '/' && pathname.endsWith('/')) {
    const strippedUrl = new URL(request.url);
    strippedUrl.pathname = pathname.replace(/\/+$/, '');
    return NextResponse.redirect(strippedUrl, 301);
  }

  // 0b. WWW Redirect (Force www.vaitour.com)
  if (hostname === 'vaitour.com') {
    const wwwUrl = new URL(request.url);
    wwwUrl.hostname = 'www.vaitour.com';
    return NextResponse.redirect(wwwUrl, 301);
  }

  // 1. Only apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1';
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    if (Math.random() < 0.05) { 
      ipRequestCount.forEach((value, key) => {
        if (value.timestamp < windowStart) {
          ipRequestCount.delete(key);
        }
      });
    }

    const currentRecord = ipRequestCount.get(ip);
    if (!currentRecord || currentRecord.timestamp < windowStart) {
      ipRequestCount.set(ip, { count: 1, timestamp: now });
    } else {
      if (currentRecord.count >= RATE_LIMIT) {
        console.warn(`[SECURITY: DDoS/Spam Prevented] Blocked IP: ${ip}`);
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests (DDoS protection). Please try again in 1 minute.',
            retryAfter: Math.ceil((currentRecord.timestamp + WINDOW_MS - now) / 1000),
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((currentRecord.timestamp + WINDOW_MS - now) / 1000).toString(),
            },
          }
        );
      }
      currentRecord.count += 1;
      ipRequestCount.set(ip, currentRecord);
    }
    return NextResponse.next();
  }

  // 2. Internationalization (i18n) Sub-path Routing
  // Exclude static asset folders/files specifically to avoid redirect loops
  // Also exclude legacy paths that are handled by next.config.mjs permanent
  // redirects — letting middleware touch them first would add an extra 307 hop.
  const LEGACY_REDIRECT_PATHS = [
    '/bookings', '/saved', '/corporate', '/investors', '/press', '/cookies',
    '/dashboard', '/become-a-host', '/impact', '/gift-cards', '/accessibility',
    '/safety', '/affiliates', '/careers',
  ];
  if (
    pathname.includes('.') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/images/') || 
    pathname === '/favicon.ico' ||
    pathname.startsWith('/admin-portal') ||
    pathname.startsWith('/supplier') ||
    pathname.startsWith('/profile/settings') ||
    LEGACY_REDIRECT_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
  ) {
    return NextResponse.next();
  }

  // Check if pathname starts with a locale segment (e.g. /ja/tours or /ja)
  const pathnameLocale = SUPPORTED_LOCALES.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    // If it has a locale, strip it and perform an internal rewrite
    const rewrittenPath = pathname.replace(`/${pathnameLocale}`, '') || '/';
    
    const rewriteUrl = new URL(rewrittenPath, request.url);
    rewriteUrl.search = request.nextUrl.search;

    const response = NextResponse.rewrite(rewriteUrl);
    
    // Set headers and cookie
    response.headers.set('x-locale', pathnameLocale);
    response.cookies.set('NEXT_LOCALE', pathnameLocale, { path: '/' });
    
    return response;
  }

  // If URL has no locale prefix, detect and redirect
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  let detectedLocale = cookieLocale || DEFAULT_LOCALE;

  if (!cookieLocale) {
    const acceptLang = request.headers.get('accept-language');
    if (acceptLang) {
      const match = SUPPORTED_LOCALES.find(locale => acceptLang.toLowerCase().startsWith(locale));
      if (match) detectedLocale = match;
    }
  }

  const redirectPath = pathname === '/' ? `/${detectedLocale}` : `/${detectedLocale}${pathname}`;
  const redirectUrl = new URL(redirectPath, request.url);
  redirectUrl.search = request.nextUrl.search;

  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: [
    // Intercept all routes except Next.js internals, static files, images, etc.
    '/((?!_next/static|_next/image|favicon.ico|images|api/public/upload|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
  ],
};
