/**
 * Access configuration shared by the proxy and the route handlers.
 * All values are runtime env vars set in the Vercel dashboard (see .env.example).
 */
import { signToken, type Scope } from './token';

export const GUEST_COOKIE = 'mxp';
export const ADMIN_COOKIE = 'mxp_admin';

const DAY = 24 * 60 * 60;
/** How long an unlocked browser stays unlocked. Revocation is by MXP_LINK_VERSION, not expiry. */
export const GUEST_TTL = 365 * DAY;
export const ADMIN_TTL = 30 * DAY;

export function accessEnv() {
  return {
    secret: process.env.MXP_LINK_SECRET ?? '',
    version: Number(process.env.MXP_LINK_VERSION ?? '1'),
    passcode: process.env.MXP_PASSCODE ?? '',
    adminPassword: process.env.MXP_ADMIN_PASSWORD ?? '',
  };
}

/** Cookie value + options for a fresh session of the given scope. */
export async function sessionCookie(scope: Scope) {
  const { secret, version } = accessEnv();
  const ttl = scope === 'admin' ? ADMIN_TTL : GUEST_TTL;
  const value = await signToken(
    { s: scope, v: version, exp: Math.floor(Date.now() / 1000) + ttl },
    secret
  );
  return {
    name: scope === 'admin' ? ADMIN_COOKIE : GUEST_COOKIE,
    value,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: ttl,
    },
  };
}

/** Passcodes are typed on phones, so case and stray spaces don't count. */
export function normalisePasscode(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * Only same-site relative paths may be used as a post-unlock destination, so the gate can't be
 * turned into an open redirect.
 */
export function safeNext(next: string | null | undefined, fallback = '/'): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
    return fallback;
  }
  return next;
}
