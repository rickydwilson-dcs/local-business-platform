/**
 * Next.js Middleware Template
 *
 * This is a minimal middleware template for new sites.
 * Customize this file based on your site's needs:
 * - Analytics tracking
 * - Rate limiting
 * - Authentication
 * - Redirects
 * - A/B testing
 */

import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Default behavior: pass through all requests
  // Uncomment and customize the sections below as needed

  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and internal routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Add custom middleware logic here
  // Example: Add security headers
  const response = NextResponse.next();

  // Security headers (customize as needed)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
