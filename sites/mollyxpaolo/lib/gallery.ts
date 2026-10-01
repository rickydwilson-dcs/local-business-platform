/**
 * Pure gallery assembly: photos.json + curation → what the page renders.
 *
 * Hidden photos are dropped here, on the server, so a visitor's page payload never contains a
 * hidden photo's id, placeholder or position.
 */
import type { Chapter, Curation, GalleryData, GalleryPhoto, Photo, PhotoState } from './types';

/** Effective state of a photo: its curation override, else its seed. */
export function stateOf(p: Photo, curation: Curation): PhotoState {
  return curation.photos[p.id] ?? (p.featured ? 'featured' : 'shown');
}

/** The chapter a capture time falls in; undated photos go in the last chapter. */
export function chapterFor(t: string | null, chapters: Chapter[]): string {
  if (t) {
    const c = chapters.find((c) => c.from <= t && t < c.to);
    if (c) return c.id;
  }
  return chapters[chapters.length - 1].id;
}

export function buildGallery(input: {
  photos: Photo[];
  chapters: Chapter[];
  heroOrder: string[];
  curation: Curation;
  mediaBase: string;
}): GalleryData {
  const { photos, chapters, heroOrder, curation, mediaBase } = input;
  const visible: GalleryPhoto[] = [];
  for (const p of photos) {
    const state = stateOf(p, curation);
    if (state === 'hidden') continue;
    visible.push({ ...p, featured: state === 'featured', chapter: chapterFor(p.t, chapters) });
  }

  const fav = visible.filter((p) => p.featured);
  const lead = heroOrder.filter((id) => fav.some((p) => p.id === id && p.heroOk));
  const fallback = (fav.length ? fav : visible.slice(0, 1)).map((p) => p.id);
  const hero = [...lead, ...fav.filter((p) => p.heroOk && !lead.includes(p.id)).map((p) => p.id)];

  return {
    mediaBase,
    chapters: chapters
      .map((c) => ({ ...c, photos: visible.filter((p) => p.chapter === c.id) }))
      .filter((c) => c.photos.length > 0),
    hero: hero.length ? hero : fallback,
    heroLead: hero.length ? lead.length || hero.length : fallback.length,
  };
}
