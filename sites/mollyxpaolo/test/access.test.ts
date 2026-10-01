import { beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as unlock } from '@/app/api/unlock/route';
import { GET as shareLink } from '@/app/s/[token]/route';
import { proxy } from '@/proxy';
import { signToken } from '@/lib/token';
import { safeNext } from '@/lib/access';

const ORIGIN = 'https://gallery.test';
const SECRET = 'test-secret-that-is-long-enough';

beforeEach(() => {
  process.env.MXP_LINK_SECRET = SECRET;
  process.env.MXP_LINK_VERSION = '1';
  process.env.MXP_PASSCODE = 'Vegas Baby';
  process.env.MXP_ADMIN_PASSWORD = 'admin-only';
});

function post(passcode: string, ip: string, next = '') {
  const body = new URLSearchParams({ passcode, next });
  return new NextRequest(`${ORIGIN}/api/unlock`, {
    method: 'POST',
    body,
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-forwarded-for': ip },
  });
}

const future = () => Math.floor(Date.now() / 1000) + 3600;

describe('POST /api/unlock', () => {
  it('rejects a wrong passcode without setting a cookie', async () => {
    const res = await unlock(post('nope', '10.0.0.1'));
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe(`${ORIGIN}/unlock?e=wrong`);
    expect(res.cookies.get('mxp')).toBeUndefined();
  });

  it('accepts the passcode ignoring case and spaces, sets an httpOnly cookie', async () => {
    const res = await unlock(post('  vegas baby ', '10.0.0.2', '/?tone=sepia'));
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe(`${ORIGIN}/?tone=sepia`);
    const c = res.cookies.get('mxp')!;
    expect(c.httpOnly).toBe(true);
    expect(c.sameSite).toBe('lax');
  });

  it('locks an IP out after five wrong tries, even for the right code', async () => {
    for (let i = 0; i < 5; i++) await unlock(post('nope', '10.0.0.3'));
    const res = await unlock(post('vegas baby', '10.0.0.3'));
    expect(res.headers.get('location')).toContain('e=locked');
    expect(res.cookies.get('mxp')).toBeUndefined();
  });

  it('never redirects off-site', () => {
    expect(safeNext('//evil.test/x')).toBe('/');
    expect(safeNext('https://evil.test')).toBe('/');
    expect(safeNext('/\\evil.test')).toBe('/');
    expect(safeNext('/?tone=bw')).toBe('/?tone=bw');
  });
});

describe('GET /s/<token>', () => {
  const call = (t: string) =>
    shareLink(new NextRequest(`${ORIGIN}/s/${t}`), { params: Promise.resolve({ token: t }) });

  it('a valid link sets the cookie and redirects to a clean URL', async () => {
    const t = await signToken({ s: 'guest', v: 1, exp: future() }, SECRET);
    const res = await call(t);
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe(`${ORIGIN}/`);
    expect(res.cookies.get('mxp')?.value).toBeTruthy();
  });

  it('a revoked (old version) link goes to the passcode page', async () => {
    const t = await signToken({ s: 'guest', v: 1, exp: future() }, SECRET);
    process.env.MXP_LINK_VERSION = '2';
    const res = await call(t);
    expect(res.headers.get('location')).toBe(`${ORIGIN}/unlock?e=link`);
    expect(res.cookies.get('mxp')).toBeUndefined();
  });
});

describe('proxy', () => {
  const req = (path: string, cookies: Record<string, string> = {}) =>
    new NextRequest(`${ORIGIN}${path}`, {
      headers: {
        cookie: Object.entries(cookies)
          .map(([k, v]) => `${k}=${v}`)
          .join('; '),
      },
    });

  it('sends a visitor without a cookie to /unlock, keeping where they were going', async () => {
    expect((await proxy(req('/'))).headers.get('location')).toBe(`${ORIGIN}/unlock`);
    expect((await proxy(req('/?tone=bw'))).headers.get('location')).toBe(`${ORIGIN}/unlock`);
    expect((await proxy(req('/admin'))).headers.get('location')).toBe(`${ORIGIN}/admin/login`);
  });

  it('lets the public routes through', async () => {
    for (const p of ['/unlock', '/api/unlock', '/s/abc', '/admin/login', '/api/admin/login']) {
      expect((await proxy(req(p))).headers.get('location')).toBeNull();
    }
  });

  it('a guest cookie opens the gallery but not admin', async () => {
    const guest = await signToken({ s: 'guest', v: 1, exp: future() }, SECRET);
    expect((await proxy(req('/', { mxp: guest }))).headers.get('location')).toBeNull();
    expect((await proxy(req('/admin', { mxp: guest }))).headers.get('location')).toBe(
      `${ORIGIN}/admin/login`
    );
    const api = await proxy(req('/api/admin/curation', { mxp: guest }));
    expect(api.status).toBe(401);
  });

  it('an admin cookie opens admin', async () => {
    const admin = await signToken({ s: 'admin', v: 1, exp: future() }, SECRET);
    expect((await proxy(req('/admin', { mxp_admin: admin }))).headers.get('location')).toBeNull();
  });
});
