import { describe, expect, it } from 'vitest';
import { safeEqual, signToken, verifyToken } from '@/lib/token';

const secret = 'test-secret-that-is-long-enough';
const now = 1_800_000_000;
const opts = { secret, version: 1, scope: 'guest' as const, now };

describe('signed tokens', () => {
  it('round-trips a valid token', async () => {
    const t = await signToken({ s: 'guest', v: 1, exp: now + 60 }, secret);
    expect(await verifyToken(t, opts)).toEqual({ s: 'guest', v: 1, exp: now + 60 });
  });

  it('rejects a tampered payload', async () => {
    const t = await signToken({ s: 'guest', v: 1, exp: now + 60 }, secret);
    const [, sig] = t.split('.');
    const forged = Buffer.from(JSON.stringify({ s: 'admin', v: 1, exp: now + 60 })).toString(
      'base64url'
    );
    expect(await verifyToken(`${forged}.${sig}`, { ...opts, scope: 'admin' })).toBeNull();
  });

  it('rejects a token signed with another secret', async () => {
    const t = await signToken({ s: 'guest', v: 1, exp: now + 60 }, 'another-secret');
    expect(await verifyToken(t, opts)).toBeNull();
  });

  it('rejects an expired token', async () => {
    const t = await signToken({ s: 'guest', v: 1, exp: now - 1 }, secret);
    expect(await verifyToken(t, opts)).toBeNull();
  });

  it('a version bump revokes every earlier token', async () => {
    const t = await signToken({ s: 'guest', v: 1, exp: now + 60 }, secret);
    expect(await verifyToken(t, { ...opts, version: 2 })).toBeNull();
  });

  it('a guest token never passes as admin', async () => {
    const t = await signToken({ s: 'guest', v: 1, exp: now + 60 }, secret);
    expect(await verifyToken(t, { ...opts, scope: 'admin' })).toBeNull();
  });

  it('rejects junk, empty input and an empty secret', async () => {
    for (const t of [undefined, '', 'abc', 'a.b.c', '!!!.???']) {
      expect(await verifyToken(t, opts)).toBeNull();
    }
    const t = await signToken({ s: 'guest', v: 1, exp: now + 60 }, secret);
    expect(await verifyToken(t, { ...opts, secret: '' })).toBeNull();
    await expect(signToken({ s: 'guest', v: 1, exp: now + 60 }, '')).rejects.toThrow(
      /empty secret/
    );
  });

  it('safeEqual compares exactly and never matches empty strings', async () => {
    expect(await safeEqual('vegas', 'vegas')).toBe(true);
    expect(await safeEqual('vegas', 'vegaS')).toBe(false);
    expect(await safeEqual('', '')).toBe(false);
  });
});
