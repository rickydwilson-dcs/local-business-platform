import 'server-only';
import photosJson from '@/content/photos.json';
import chaptersJson from '@/content/chapters.json';
import { buildGallery, chapterFor } from './gallery';
import { publicState, readCuration, readCurationCached } from './curation';
import type { Chapter, Curation, GalleryData, GalleryPhoto, Photo } from './types';

export const photos = photosJson.photos as Photo[];
export const heroOrder = photosJson.heroOrder;
export const chapters = chaptersJson.chapters as Chapter[];

/** The public bucket base including the path token, with a trailing slash. Server-only. */
export function mediaBase(): string {
  const base = process.env.MXP_MEDIA_BASE;
  if (!base) throw new Error('MXP_MEDIA_BASE is not configured');
  return base.endsWith('/') ? base : `${base}/`;
}

export async function getGallery(): Promise<GalleryData> {
  return buildGallery({
    photos,
    chapters,
    heroOrder,
    curation: await readCurationCached(),
    mediaBase: mediaBase(),
  });
}

/**
 * Everything the curation screen needs. `featured` on each photo is its seed (the
 * photographer's selection), not its current state: the screen applies the curation itself.
 * Only the colour placeholder is sent, since the screen is always in colour.
 */
export async function getAdminData(): Promise<{
  photos: GalleryPhoto[];
  chapters: Chapter[];
  curation: Curation;
  mediaBase: string;
}> {
  return {
    photos: photos.map((p) => ({
      ...p,
      ph: { colour: p.ph.colour, sepia: '', bw: '' },
      chapter: chapterFor(p.t, chapters),
    })),
    chapters,
    curation: publicState(await readCuration()),
    mediaBase: mediaBase(),
  };
}
