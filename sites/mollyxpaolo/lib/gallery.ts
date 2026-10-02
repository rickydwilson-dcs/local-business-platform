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

/** Capture-time order with undated photos last; ties keep their photos.json order. */
const byTime = (a: GalleryPhoto, b: GalleryPhoto) =>
  a.t === b.t ? 0 : a.t === null ? 1 : b.t === null ? -1 : a.t < b.t ? -1 : 1;

/**
 * The chapter's cover is its earliest favourite. It moves to the front, out of its time slot,
 * so it is shown once and the lightbox (which follows `photos`) opens the chapter with it too.
 */
function withCover<C extends { photos: GalleryPhoto[] }>(c: C): C & { cover: string | null } {
  const cover = c.photos.filter((p) => p.featured).sort(byTime)[0];
  if (!cover) return { ...c, cover: null };
  return { ...c, cover: cover.id, photos: [cover, ...c.photos.filter((p) => p !== cover)] };
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

  // Eligible unless explicitly ruled out, so a photo the couple promote can join the hero.
  const heroOk = (p: Photo) => p.heroOk !== false;
  const fav = visible.filter((p) => p.featured);
  const lead = heroOrder.filter((id) => fav.some((p) => p.id === id && heroOk(p)));
  const fallback = (fav.length ? fav : visible.slice(0, 1)).map((p) => p.id);
  const hero = [...lead, ...fav.filter((p) => heroOk(p) && !lead.includes(p.id)).map((p) => p.id)];

  return {
    mediaBase,
    chapters: chapters
      .map((c) => withCover({ ...c, photos: visible.filter((p) => p.chapter === c.id) }))
      .filter((c) => c.photos.length > 0),
    hero: hero.length ? hero : fallback,
    heroLead: hero.length ? lead.length || hero.length : fallback.length,
  };
}
