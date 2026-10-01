import 'server-only';
import photosJson from '@/content/photos.json';
import chaptersJson from '@/content/chapters.json';
import { buildGallery } from './gallery';
import { readCuration, readCurationCached } from './curation';
import type { Chapter, Curation, GalleryData, Photo } from './types';

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

export async function getAdminData(): Promise<{
  photos: Photo[];
  curation: Curation;
  mediaBase: string;
}> {
  return { photos, curation: await readCuration(), mediaBase: mediaBase() };
}
