/**
 * Curation state: one JSON object in the mollyxpaolo R2 bucket, read and written over the S3 API
 * with the bucket-scoped token. Never fetched through the public URL.
 *
 * The bucket is public, so the object lives under MXP_STATE_KEY, a random folder that is a
 * separate secret from the image path token; that unguessable key is what keeps the hidden list
 * off r2.dev.
 */
import 'server-only';
import { GetObjectCommand, NoSuchKey, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { unstable_cache } from 'next/cache';
import { z } from 'zod';
import type { Curation } from './types';

export const CURATION_TAG = 'curation';

export const curationSchema = z.object({
  version: z.number().int().nonnegative(),
  updatedAt: z.string().nullable(),
  photos: z.record(z.string().regex(/^vk-\d{3}$/), z.enum(['shown', 'featured', 'hidden'])),
});

const EMPTY: Curation = { version: 0, updatedAt: null, photos: {} };

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

/** Uncached read, for the admin page and for the version check before a write. */
export async function readCuration(): Promise<Curation> {
  try {
    const res = await s3().send(new GetObjectCommand(location()));
    return curationSchema.parse(JSON.parse(await res.Body!.transformToString()));
  } catch (e) {
    if (e instanceof NoSuchKey) return EMPTY;
    throw e;
  }
}

/** Cached read for the gallery; an admin save invalidates it via revalidateTag(CURATION_TAG). */
export const readCurationCached = unstable_cache(readCuration, ['mxp-curation'], {
  tags: [CURATION_TAG],
});

export class StaleCurationError extends Error {}

/**
 * Writes a new state if `baseVersion` is still current. One curator makes concurrent saves
 * unlikely; when they happen, the stale one is refused instead of silently overwriting.
 */
export async function writeCuration(
  baseVersion: number,
  photos: Curation['photos']
): Promise<Curation> {
  const current = await readCuration();
  if (current.version !== baseVersion) throw new StaleCurationError();
  const next: Curation = {
    version: current.version + 1,
    updatedAt: new Date().toISOString(),
    photos,
  };
  await s3().send(
    new PutObjectCommand({
      ...location(),
      Body: JSON.stringify(next),
      ContentType: 'application/json',
      CacheControl: 'no-store',
    })
  );
  return next;
}
