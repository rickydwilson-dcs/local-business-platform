import { describe, expect, it } from 'vitest';
import {
  EMPTY,
  LOG_LIMIT,
  CurationConflictError,
  applyChanges,
  diffTo,
  patchCuration,
  type CurationIO,
} from '@/lib/curation-core';
import type { Curation } from '@/lib/types';

// vk-341 is a seeded favourite; vk-001 and vk-002 are regular.
const seeds = new Map([
  ['vk-341', true],
  ['vk-001', false],
  ['vk-002', false],
]);
const state = (photos: Curation['photos'], version = 1): Curation => ({
  version,
  updatedAt: null,
  photos,
  log: [],
});

describe('applyChanges', () => {
  it('stores only departures from the seed', () => {
    const a = applyChanges(state({}), { 'vk-001': 'featured', 'vk-341': 'shown' }, seeds);
    expect(a.photos).toEqual({ 'vk-001': 'featured', 'vk-341': 'shown' });
    // Back to the seed deletes the key.
    const b = applyChanges(a, { 'vk-001': 'shown', 'vk-341': 'featured' }, seeds);
    expect(b.photos).toEqual({});
    expect(b.version).toBe(3);
  });

  it('leaves photos it was not asked about alone', () => {
    const a = applyChanges(state({ 'vk-002': 'hidden' }), { 'vk-001': 'featured' }, seeds);
    expect(a.photos).toEqual({ 'vk-002': 'hidden', 'vk-001': 'featured' });
  });

  it('logs each real change with from and to, and nothing for a no-op', () => {
    const a = applyChanges(state({}), { 'vk-001': 'hidden', 'vk-002': 'shown' }, seeds, 'T');
    expect(a.log).toEqual([{ at: 'T', id: 'vk-001', from: 'shown', to: 'hidden' }]);
  });

  it(`keeps the last ${LOG_LIMIT} log entries`, () => {
    let c = state({});
    for (let k = 0; k < LOG_LIMIT + 20; k++) {
      c = applyChanges(c, { 'vk-001': k % 2 ? 'shown' : 'hidden' }, seeds, String(k));
    }
    expect(c.log).toHaveLength(LOG_LIMIT);
    expect(c.log!.at(-1)!.at).toBe(String(LOG_LIMIT + 19));
  });
});

describe('diffTo', () => {
  it('lists what a reset changes, as effective states', () => {
    expect(diffTo({ 'vk-001': 'hidden', 'vk-341': 'shown' }, {}, seeds)).toEqual({
      'vk-001': 'shown',
      'vk-341': 'featured',
    });
  });
});

/** In-memory storage with an ETag, which can be made to lose the first `losses` writes. */
function memory(initial: Curation | null, losses = 0) {
  let stored = initial;
  let etag = initial ? 'e0' : null;
  let n = 0;
  const io: CurationIO & { writes: number } = {
    writes: 0,
    async read() {
      return { curation: stored ?? EMPTY, etag };
    },
    async write(next, expected) {
      io.writes++;
      if (losses > 0) {
        losses--;
        // Someone else saved in between: their change lands, ours is refused.
        stored = applyChanges(stored ?? EMPTY, { 'vk-002': 'hidden' }, seeds);
        etag = `e${++n}`;
        return 'conflict';
      }
      if (expected !== etag) return 'conflict';
      stored = next;
      etag = `e${++n}`;
      return 'ok';
    },
  };
  return { io, get: () => stored };
}

describe('patchCuration', () => {
  it('merges into the stored state instead of replacing it', async () => {
    const m = memory(state({ 'vk-002': 'hidden' }));
    const next = await patchCuration(m.io, { 'vk-001': 'featured' }, seeds);
    expect(next.photos).toEqual({ 'vk-002': 'hidden', 'vk-001': 'featured' });
    expect(m.get()!.photos).toEqual(next.photos);
  });

  it('re-reads and re-applies after a lost conditional write, keeping both changes', async () => {
    const m = memory(state({}), 1);
    const next = await patchCuration(m.io, { 'vk-001': 'featured' }, seeds);
    expect(m.io.writes).toBe(2);
    expect(next.photos).toEqual({ 'vk-002': 'hidden', 'vk-001': 'featured' });
  });

  it('writes the first state with no ETag', async () => {
    const m = memory(null);
    await patchCuration(m.io, { 'vk-001': 'hidden' }, seeds);
    expect(m.get()!.photos).toEqual({ 'vk-001': 'hidden' });
  });

  it('gives up after the retries are spent', async () => {
    const m = memory(state({}), 10);
    await expect(patchCuration(m.io, { 'vk-001': 'featured' }, seeds)).rejects.toBeInstanceOf(
      CurationConflictError
    );
    expect(m.io.writes).toBe(4);
  });
});
