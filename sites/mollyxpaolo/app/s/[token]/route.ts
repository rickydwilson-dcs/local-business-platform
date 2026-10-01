import { NextResponse, type NextRequest } from 'next/server';
import { accessEnv, sessionCookie } from '@/lib/access';
import { verifyToken } from '@/lib/token';

/**
 * Signed share link. A valid token sets the guest cookie and redirects to a clean URL, so the
 * token isn't left in the address bar, history or a screenshot.
 */
export async function GET(request: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const { secret, version } = accessEnv();
  const ok = await verifyToken(token, { secret, version, scope: 'guest' });
  if (!ok) return NextResponse.redirect(new URL('/unlock?e=link', request.url), 303);

  const res = NextResponse.redirect(new URL('/', request.url), 303);
  const c = await sessionCookie('guest');
  res.cookies.set(c.name, c.value, c.options);
  res.headers.set('Referrer-Policy', 'no-referrer');
  return res;
}
