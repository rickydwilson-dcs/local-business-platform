/**
 * The passcode gate, and nothing else: no analytics, no tracking.
 *
 * Every page needs a valid guest cookie (set by /api/unlock or a /s/<token> share link);
 * /admin and /api/admin need the separate admin cookie. Next 16 runs proxy.ts on the Node.js
 * runtime (confirmed in Next's own build check, 16.1.5).
 */
import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, GUEST_COOKIE, accessEnv } from '@/lib/access';
import { verifyToken } from '@/lib/token';

/** Reachable without any cookie. */
const PUBLIC = [
  /^\/unlock$/,
  /^\/api\/unlock$/,
  /^\/s\/[^/]+$/,
  /^\/admin\/login$/,
  /^\/api\/admin\/login$/,
];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC.some((re) => re.test(pathname))) return NextResponse.next();

  const { secret, version } = accessEnv();
  const isAdmin =
    pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/admin/');

  if (isAdmin) {
    const ok = await verifyToken(request.cookies.get(ADMIN_COOKIE)?.value, {
      secret,
      version,
      scope: 'admin',
    });
    if (ok) return NextResponse.next();
    if (pathname.startsWith('/api/'))
      return NextResponse.json({ error: 'unauthorised' }, { status: 401 });
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const ok = await verifyToken(request.cookies.get(GUEST_COOKIE)?.value, {
    secret,
    version,
    scope: 'guest',
  });
  if (ok) return NextResponse.next();
  if (pathname.startsWith('/api/'))
    return NextResponse.json({ error: 'unauthorised' }, { status: 401 });

  const unlock = new URL('/unlock', request.url);
  if (pathname !== '/') unlock.searchParams.set('next', pathname + search);
  return NextResponse.redirect(unlock);
}

export const config = {
  // Everything except Next's static output and the files a browser asks for unprompted.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt).*)'],
};
