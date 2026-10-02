/**
 * Curation merging, kept free of S3 and env so it can be tested on its own. lib/curation.ts
 * wires it to the R2 object.
 *
 * Molly and Paolo may curate at the same time, so a save is a per-photo patch the server merges
 * into whatever is stored now, never a whole map that replaces it: two people changing different
 * photos can't conflict, and on the same photo the last write wins.
 */
import { z } from 'zod';
import type { Curation, PhotoState } from './types';

export const LOG_LIMIT = 500;
/** Re-reads after a lost conditional write, on top of the first attempt. */
export const RETRIES = 3;

const state = z.enum(['shown', 'featured', 'hidden']);
const photoId = z.string().regex(/^vk-\d{3}$/);

export const curationSchema = z.object({
  version: z.number().int().nonnegative(),
  updatedAt: z.string().nullable(),
  photos: z.record(photoId, state),
  log: z.array(z.object({ at: z.string(), id: photoId, from: state, to: state })).optional(),
});

export const EMPTY: Curation = { version: 0, updatedAt: null, photos: {}, log: [] };

/** Each photo's seed: the photographer's selection, which stored state departs from. */
export type Seeds = ReadonlyMap<string, boolean>;

const seedState = (featured: boolean | undefined): PhotoState => (featured ? 'featured' : 'shown');

/**
 * The next state after setting each photo in `changes`. Only departures from the seed are
 * stored: a photo set back to its seed loses its key, and a seeded favourite set to regular
 * stores `shown` explicitly. A change that alters nothing is neither stored nor logged.
 */
export function applyChanges(
  current: Curation,
  changes: Record<string, PhotoState>,
  seeds: Seeds,
  at = new Date().toISOString()
): Curation {
  const photos = { ...current.photos };
  const log = [...(current.log ?? [])];
  for (const [id, to] of Object.entries(changes)) {
    const seed = seedState(seeds.get(id));
    const from = photos[id] ?? seed;
    if (from === to) continue;
    if (to === seed) delete photos[id];
    else photos[id] = to;
    log.push({ at, id, from, to });
  }
  return {
    version: current.version + 1,
    updatedAt: at,
    photos,
    log: log.slice(-LOG_LIMIT),
  };
}

/** The changes that turn `current` into `target` (both as stored maps), for logging a reset. */
export function diffTo(
  current: Curation['photos'],
  target: Curation['photos'],
  seeds: Seeds
): Record<string, PhotoState> {
  const changes: Record<string, PhotoState> = {};
  for (const id of new Set([...Object.keys(current), ...Object.keys(target)])) {
    const seed = seedState(seeds.get(id));
    if ((current[id] ?? seed) !== (target[id] ?? seed)) changes[id] = target[id] ?? seed;
  }
  return changes;
}

/** Storage as the merge loop sees it: a read with its ETag, and a write conditional on one. */
export interface CurationIO {
  read(): Promise<{ curation: Curation; etag: string | null }>;
  /** Writes only if the object still has `etag` (or still doesn't exist, when null). */
  write(next: Curation, etag: string | null): Promise<'ok' | 'conflict'>;
}

export class CurationConflictError extends Error {}

/**
 * Read, apply, conditionally write; on a lost race re-read and re-apply. The retry happens here
 * on the server, so a curator's tap never fails just because their partner saved first.
 */
export async function patchCuration(
  io: CurationIO,
  changes: Record<string, PhotoState>,
  seeds: Seeds
): Promise<Curation> {
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    const { curation, etag } = await io.read();
    const next = applyChanges(curation, changes, seeds);
    if ((await io.write(next, etag)) === 'ok') return next;
  }
  throw new CurationConflictError();
}

/** What a browser gets: the state without the log. */
export function publicState({ version, updatedAt, photos }: Curation): Curation {
  return { version, updatedAt, photos };
}
