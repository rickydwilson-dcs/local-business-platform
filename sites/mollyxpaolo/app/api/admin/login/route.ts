import { NextResponse, type NextRequest } from 'next/server';
import { accessEnv, sessionCookie } from '@/lib/access';
import { safeEqual } from '@/lib/token';
import { clearFailures, clientIp, isLockedOut, recordFailure } from '@/lib/throttle';

/** Admin password form post. The guest passcode never grants admin. */
export async function POST(request: NextRequest) {
  const back = (error: string) =>
    NextResponse.redirect(new URL(`/admin/login?e=${error}`, request.url), 303);

  const ip = clientIp(request.headers);
  if (isLockedOut(`admin:${ip}`)) return back('locked');

  const { adminPassword, secret } = accessEnv();
  if (!adminPassword || !secret) return back('config');

  const form = await request.formData();
  if (!(await safeEqual(String(form.get('password') ?? ''), adminPassword))) {
    recordFailure(`admin:${ip}`);
    return back('wrong');
  }

  clearFailures(`admin:${ip}`);
  const res = NextResponse.redirect(new URL('/admin', request.url), 303);
  // Admin also gets a guest cookie, so "View the gallery" works without a second login.
  for (const scope of ['admin', 'guest'] as const) {
    const c = await sessionCookie(scope);
    res.cookies.set(c.name, c.value, c.options);
  }
  return res;
}
