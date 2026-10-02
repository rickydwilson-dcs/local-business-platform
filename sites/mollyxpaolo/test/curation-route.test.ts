import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { EMPTY, patchCuration, type CurationIO } from '@/lib/curation-core';
import type { Curation } from '@/lib/types';

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
  unstable_cache: (fn: unknown) => fn,
}));

// The real merge logic over in-memory storage, in place of R2.
let stored: Curation = EMPTY;
const io: CurationIO = {
  read: async () => ({ curation: stored, etag: String(stored.version) }),
  write: async (next, etag) => {
    if (etag !== String(stored.version)) return 'conflict';
    stored = next;
    return 'ok';
  },
};
vi.mock('@/lib/curation', async () => {
  const core = await vi.importActual<typeof import('@/lib/curation-core')>('@/lib/curation-core');
  class StaleCurationError extends Error {}
  return {
    CURATION_TAG: 'curation',
    CurationConflictError: core.CurationConflictError,
    StaleCurationError,
    curationSchema: core.curationSchema,
    publicState: core.publicState,
    readCuration: async () => stored,
    patchPhotos: (changes: Curation['photos'], seeds: Map<string, boolean>) =>
      patchCuration(io, changes, seeds),
    replaceCuration: async () => {
      throw new StaleCurationError();
    },
  };
});

const { GET, PATCH } = await import('@/app/api/admin/curation/route');
const { signToken } = await import('@/lib/token');
const { revalidateTag } = await import('next/cache');

const ORIGIN = 'https://gallery.test';
const SECRET = 'test-secret-that-is-long-enough';

beforeEach(() => {
  process.env.MXP_LINK_SECRET = SECRET;
  process.env.MXP_LINK_VERSION = '1';
  stored = { ...EMPTY, photos: { 'vk-002': 'hidden' }, version: 3 };
});

async function adminCookie() {
  const t = await signToken(
    { s: 'admin', v: 1, exp: Math.floor(Date.now() / 1000) + 3600 },
    SECRET
  );
  return `mxp_admin=${t}`;
}

async function patch(body: unknown, opts: { cookie?: boolean; origin?: string } = {}) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (opts.cookie !== false) headers.cookie = await adminCookie();
  if (opts.origin !== undefined) headers.origin = opts.origin;
  return PATCH(
    new NextRequest(`${ORIGIN}/api/admin/curation`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers,
    })
  );
}

describe('PATCH /api/admin/curation', () => {
  it('refuses without the admin cookie', async () => {
    const res = await patch({ changes: { 'vk-001': 'featured' } }, { cookie: false });
    expect(res.status).toBe(401);
  });

  it('refuses an unknown photo', async () => {
    const res = await patch({ changes: { 'vk-999': 'featured' } }, { origin: ORIGIN });
    expect(res.status).toBe(400);
  });

  it("refuses another site's Origin", async () => {
    const res = await patch({ changes: { 'vk-001': 'featured' } }, { origin: 'https://evil.test' });
    expect(res.status).toBe(403);
  });

  it("merges rather than replaces, keeps the partner's change, and revalidates", async () => {
    const res = await patch({ changes: { 'vk-001': 'featured' } }, { origin: ORIGIN });
    expect(res.status).toBe(200);
    const body = (await res.json()) as Curation;
    expect(body.photos).toEqual({ 'vk-002': 'hidden', 'vk-001': 'featured' });
    // The log stays on the server.
    expect(body).not.toHaveProperty('log');
    expect(stored.log).toHaveLength(1);
    expect(revalidateTag).toHaveBeenCalledWith('curation', { expire: 0 });
  });

  it('lets two curators change different photos one after the other', async () => {
    await patch({ changes: { 'vk-001': 'featured' } }, { origin: ORIGIN });
    const res = await patch({ changes: { 'vk-341': 'hidden' } }, { origin: ORIGIN });
    expect(((await res.json()) as Curation).photos).toEqual({
      'vk-002': 'hidden',
      'vk-001': 'featured',
      'vk-341': 'hidden',
    });
  });
});

describe('GET /api/admin/curation', () => {
  it('returns the current state to an admin only', async () => {
    const anon = await GET(new NextRequest(`${ORIGIN}/api/admin/curation`));
    expect(anon.status).toBe(401);
    const res = await GET(
      new NextRequest(`${ORIGIN}/api/admin/curation`, { headers: { cookie: await adminCookie() } })
    );
    expect(((await res.json()) as Curation).photos).toEqual({ 'vk-002': 'hidden' });
  });
});
