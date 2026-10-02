import { NextResponse, type NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { ADMIN_COOKIE, accessEnv } from '@/lib/access';
import { verifyToken } from '@/lib/token';
import {
  CURATION_TAG,
  CurationConflictError,
  StaleCurationError,
  curationSchema,
  patchPhotos,
  publicState,
  readCuration,
  replaceCuration,
} from '@/lib/curation';
import { photos } from '@/lib/data';

const seeds = new Map(photos.map((p) => [p.id, p.featured]));

const patchBody = z.object({ changes: curationSchema.shape.photos });
const putBody = z.object({
  baseVersion: z.number().int().nonnegative(),
  photos: curationSchema.shape.photos,
});

/**
 * The proxy already requires the admin cookie; checked again here so these handlers are never
 * only as safe as the matcher. Writes also refuse another site's Origin.
 */
async function refuse(request: NextRequest, write: boolean): Promise<NextResponse | null> {
  const { secret, version } = accessEnv();
  const admin = await verifyToken(request.cookies.get(ADMIN_COOKIE)?.value, {
    secret,
    version,
    scope: 'admin',
  });
  if (!admin) return NextResponse.json({ error: 'unauthorised' }, { status: 401 });
  const origin = request.headers.get('origin');
  if (write && origin) {
    let host = '';
    try {
      host = new URL(origin).host;
    } catch {}
    if (host !== request.nextUrl.host) {
      return NextResponse.json({ error: 'cross-origin' }, { status: 403 });
    }
  }
  return null;
}

function unknownId(ids: string[]): NextResponse | null {
  const unknown = ids.find((id) => !seeds.has(id));
  return unknown ? NextResponse.json({ error: `unknown photo ${unknown}` }, { status: 400 }) : null;
}

/** Current state, for the curation screen to pick up a partner's changes. */
export async function GET(request: NextRequest) {
  const no = await refuse(request, false);
  if (no) return no;
  return NextResponse.json(publicState(await readCuration()), {
    headers: { 'Cache-Control': 'no-store' },
  });
}

/** Sets one or a few photos. Responds with the whole current state, partner's changes included. */
export async function PATCH(request: NextRequest) {
  const no = await refuse(request, true);
  if (no) return no;
  const parsed = patchBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const bad = unknownId(Object.keys(parsed.data.changes));
  if (bad) return bad;

  try {
    const next = await patchPhotos(parsed.data.changes, seeds);
    // Expire immediately rather than stale-while-revalidate: the couple check the gallery straight after.
    revalidateTag(CURATION_TAG, { expire: 0 });
    return NextResponse.json(publicState(next));
  } catch (e) {
    if (e instanceof CurationConflictError) {
      return NextResponse.json({ error: 'busy' }, { status: 503 });
    }
    console.error('curation patch failed', e);
    return NextResponse.json({ error: 'write failed' }, { status: 502 });
  }
}

/** Replaces the whole map. Used only by Reset, and refused if the state moved on since. */
export async function PUT(request: NextRequest) {
  const no = await refuse(request, true);
  if (no) return no;
  const parsed = putBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const bad = unknownId(Object.keys(parsed.data.photos));
  if (bad) return bad;

  try {
    const next = await replaceCuration(parsed.data.baseVersion, parsed.data.photos, seeds);
    revalidateTag(CURATION_TAG, { expire: 0 });
    return NextResponse.json(publicState(next));
  } catch (e) {
    if (e instanceof StaleCurationError) {
      return NextResponse.json({ error: 'stale' }, { status: 409 });
    }
    console.error('curation write failed', e);
    return NextResponse.json({ error: 'write failed' }, { status: 502 });
  }
}
