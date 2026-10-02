/**
 * Curation state: one JSON object in the mollyxpaolo R2 bucket, read and written over the S3 API
 * with the bucket-scoped token. Never fetched through the public URL.
 *
 * The bucket is public, so the object lives under MXP_STATE_KEY, a random folder that is a
 * separate secret from the image path token; that unguessable key is what keeps the hidden list
 * off r2.dev.
 *
 * Writes are conditional on the object's ETag (If-Match, or If-None-Match: * for the first
 * write). R2 lists both headers as supported on PutObject in its S3 API compatibility table,
 * checked 2026-10-02.
 */
import 'server-only';
import { GetObjectCommand, NoSuchKey, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { unstable_cache } from 'next/cache';
import {
  EMPTY,
  curationSchema,
  diffTo,
  applyChanges,
  patchCuration,
  publicState,
  type CurationIO,
  type Seeds,
} from './curation-core';
import type { Curation, PhotoState } from './types';

export { curationSchema, CurationConflictError, publicState } from './curation-core';

export const CURATION_TAG = 'curation';

let client: S3Client | null = null;
function s3() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.MXP_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.MXP_R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials are not configured (R2_ACCOUNT_ID, MXP_R2_*)');
  }
  client ??= new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return client;
}

function location() {
  const key = process.env.MXP_STATE_KEY;
  if (!key) throw new Error('MXP_STATE_KEY is not configured');
  return { Bucket: process.env.MXP_R2_BUCKET ?? 'mollyxpaolo', Key: `state/${key}/curation.json` };
}

const r2: CurationIO = {
  async read() {
    try {
      const res = await s3().send(new GetObjectCommand(location()));
      const curation = curationSchema.parse(JSON.parse(await res.Body!.transformToString()));
      return { curation, etag: res.ETag ?? null };
    } catch (e) {
      if (e instanceof NoSuchKey) return { curation: EMPTY, etag: null };
      throw e;
    }
  },
  async write(next, etag) {
    try {
      await s3().send(
        new PutObjectCommand({
          ...location(),
          Body: JSON.stringify(next),
          ContentType: 'application/json',
          CacheControl: 'no-store',
          ...(etag ? { IfMatch: etag } : { IfNoneMatch: '*' }),
        })
      );
      return 'ok';
    } catch (e) {
      const status = (e as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
      if (status === 412) return 'conflict';
      throw e;
    }
  },
};

/** Uncached read, for the admin page and its polling. */
export async function readCuration(): Promise<Curation> {
  return (await r2.read()).curation;
}

/**
 * Cached read for the gallery, without the change log; every admin write invalidates it via
 * revalidateTag(CURATION_TAG).
 */
export const readCurationCached = unstable_cache(
  async () => publicState(await readCuration()),
  ['mxp-curation'],
  { tags: [CURATION_TAG] }
);

/** Sets one or a few photos, merged into whatever is stored now (see curation-core). */
export function patchPhotos(changes: Record<string, PhotoState>, seeds: Seeds) {
  return patchCuration(r2, changes, seeds);
}

export class StaleCurationError extends Error {}

/**
 * Replaces the whole map: used only by Reset. Still refused if `baseVersion` is no longer
 * current, and still conditional on the ETag, so a reset never lands on top of a change made
 * after the curator last saw the screen.
 */
export async function replaceCuration(
  baseVersion: number,
  photos: Curation['photos'],
  seeds: Seeds
): Promise<Curation> {
  const { curation, etag } = await r2.read();
  if (curation.version !== baseVersion) throw new StaleCurationError();
  const next = applyChanges(curation, diffTo(curation.photos, photos, seeds), seeds);
  if ((await r2.write(next, etag)) === 'conflict') throw new StaleCurationError();
  return next;
}
