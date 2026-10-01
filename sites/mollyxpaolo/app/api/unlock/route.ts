import { NextResponse, type NextRequest } from 'next/server';
import { accessEnv, normalisePasscode, safeNext, sessionCookie } from '@/lib/access';
import { safeEqual } from '@/lib/token';
import { clearFailures, clientIp, isLockedOut, recordFailure } from '@/lib/throttle';

/** Passcode form post. A plain form, so the gate works before any JavaScript has loaded. */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const next = safeNext(String(form.get('next') ?? ''));
  const back = (error: string) => {
    const url = new URL('/unlock', request.url);
    url.searchParams.set('e', error);
    if (next !== '/') url.searchParams.set('next', next);
    return NextResponse.redirect(url, 303);
  };

  const ip = clientIp(request.headers);
  if (isLockedOut(ip)) return back('locked');

  const { passcode, secret } = accessEnv();
  if (!passcode || !secret) return back('config');

  const ok = await safeEqual(
    normalisePasscode(String(form.get('passcode') ?? '')),
    normalisePasscode(passcode)
  );
  if (!ok) {
    recordFailure(ip);
    return back('wrong');
  }

  clearFailures(ip);
  const res = NextResponse.redirect(new URL(next, request.url), 303);
  const c = await sessionCookie('guest');
  res.cookies.set(c.name, c.value, c.options);
  return res;
}
