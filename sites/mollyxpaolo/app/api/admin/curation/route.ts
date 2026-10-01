import { NextResponse, type NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { ADMIN_COOKIE, accessEnv } from '@/lib/access';
import { verifyToken } from '@/lib/token';
import { CURATION_TAG, StaleCurationError, curationSchema, writeCuration } from '@/lib/curation';
import { photos } from '@/lib/data';

const body = z.object({
  baseVersion: z.number().int().nonnegative(),
  photos: curationSchema.shape.photos,
});

const known = new Set(photos.map((p) => p.id));

export async function PUT(request: NextRequest) {
  // The proxy already requires the admin cookie; checked again here so this handler is never
  // only as safe as the matcher.
  const { secret, version } = accessEnv();
  const admin = await verifyToken(request.cookies.get(ADMIN_COOKIE)?.value, {
    secret,
    version,
    scope: 'admin',
  });
  if (!admin) return NextResponse.json({ error: 'unauthorised' }, { status: 401 });

  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const unknown = Object.keys(parsed.data.photos).filter((id) => !known.has(id));
  if (unknown.length) {
    return NextResponse.json({ error: `unknown photo ${unknown[0]}` }, { status: 400 });
  }

  try {
    const next = await writeCuration(parsed.data.baseVersion, parsed.data.photos);
    // Expire immediately rather than stale-while-revalidate: Molly checks the gallery straight after.
    revalidateTag(CURATION_TAG, { expire: 0 });
    return NextResponse.json(next);
  } catch (e) {
    if (e instanceof StaleCurationError) {
      return NextResponse.json({ error: 'stale' }, { status: 409 });
    }
    console.error('curation write failed', e);
    return NextResponse.json({ error: 'write failed' }, { status: 502 });
  }
}
