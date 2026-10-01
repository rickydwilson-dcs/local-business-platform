/**
 * Signed tokens for the passcode gate, share links and the admin session.
 *
 * Format: `base64url(json payload).base64url(HMAC-SHA256(payload))`. Nothing in the payload is
 * secret; the signature only proves the server issued it. `v` must equal MXP_LINK_VERSION, so
 * bumping that env var revokes every cookie and share link at once.
 *
 * Web Crypto only, so the same code runs in the proxy, route handlers and tests.
 */

export type Scope = 'guest' | 'admin';

export interface TokenPayload {
  s: Scope;
  v: number;
  /** Expiry, seconds since the epoch. */
  exp: number;
}

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string): Uint8Array {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function signToken(payload: TokenPayload, secret: string): Promise<string> {
  if (!secret) throw new Error('Refusing to sign with an empty secret (MXP_LINK_SECRET)');
  const body = b64url(enc.encode(JSON.stringify(payload)));
  return `${body}.${b64url(await hmac(secret, body))}`;
}

/** Returns the payload when the signature, version, scope and expiry all check out; else null. */
export async function verifyToken(
  token: string | undefined,
  opts: { secret: string; version: number; scope: Scope; now?: number }
): Promise<TokenPayload | null> {
  if (!token || !opts.secret) return null;
  const [body, sig, extra] = token.split('.');
  if (!body || !sig || extra !== undefined) return null;
  try {
    if (!equalBytes(fromB64url(sig), await hmac(opts.secret, body))) return null;
    const p = JSON.parse(new TextDecoder().decode(fromB64url(body))) as TokenPayload;
    const now = opts.now ?? Math.floor(Date.now() / 1000);
    if (p.v !== opts.version || p.s !== opts.scope || typeof p.exp !== 'number' || p.exp <= now) {
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

/**
 * Constant-time string comparison: both sides are hashed first, so neither the length nor the
 * position of the first differing character leaks through timing.
 */
export async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ]);
  return equalBytes(new Uint8Array(ha), new Uint8Array(hb)) && a.length > 0 && b.length > 0;
}
