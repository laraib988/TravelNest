import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for rate limiting (works per Edge/Node instance)
const ipRequestCount = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT = 50; // Maximum requests allowed
const WINDOW_MS = 60 * 1000; // Time window (1 minute)

export function middleware(request: NextRequest) {
  // 1. Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    
    // 2. Extract Client IP Address
    const ip = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1';
    
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    // 3. Periodic Memory Cleanup (to prevent memory leaks on server)
    if (Math.random() < 0.05) { 
      for (const [key, value] of ipRequestCount.entries()) {
        if (value.timestamp < windowStart) {
          ipRequestCount.delete(key);
        }
      }
    }

    const currentRecord = ipRequestCount.get(ip);

    // 4. Rate Limiting Logic
    if (!currentRecord || currentRecord.timestamp < windowStart) {
      // First request in the current time window
      ipRequestCount.set(ip, { count: 1, timestamp: now });
    } else {
      if (currentRecord.count >= RATE_LIMIT) {
        // Block the request if it exceeds limit
        console.warn(`[SECURITY: DDoS/Spam Prevented] Blocked IP: ${ip}`);
        
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests (DDoS protection). Please try again in 1 minute.',
            retryAfter: Math.ceil((currentRecord.timestamp + WINDOW_MS - now) / 1000),
          }),
          {
            status: 429, // 429 Too Many Requests HTTP Code
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((currentRecord.timestamp + WINDOW_MS - now) / 1000).toString(),
            },
          }
        );
      }
      
      // Increment request count for this IP
      currentRecord.count += 1;
      ipRequestCount.set(ip, currentRecord);
    }
  }
  
  // Continue normal request if limit is not exceeded
  return NextResponse.next();
}

// Configure Next.js Middleware to ONLY intercept /api/ routes to save performance
export const config = {
  matcher: '/api/:path*',
};
