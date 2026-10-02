import { describe, expect, it } from 'vitest';
import photosJson from '@/content/photos.json';
import chaptersJson from '@/content/chapters.json';
import { buildGallery, chapterFor } from '@/lib/gallery';
import type { Chapter, Curation, Photo } from '@/lib/types';

const photos = photosJson.photos as Photo[];
const chapters = chaptersJson.chapters as Chapter[];
const build = (c: Curation['photos'] = {}) =>
  buildGallery({
    photos,
    chapters,
    heroOrder: photosJson.heroOrder,
    curation: { version: 1, updatedAt: null, photos: c },
    mediaBase: 'https://media.test/token/',
  });

describe('photos.json', () => {
  it('holds all 350 photos with every tone placeholder and no path token', () => {
    expect(photos).toHaveLength(350);
    for (const p of photos) expect(Object.keys(p.ph).sort()).toEqual(['bw', 'colour', 'sepia']);
    expect(JSON.stringify(photosJson)).not.toMatch(/r2\.dev|\/w480\//);
  });
});

describe('buildGallery', () => {
  it('assigns every photo to exactly one chapter', () => {
    const g = build();
    const ids = g.chapters.flatMap((c) => c.photos.map((p) => p.id));
    expect(ids).toHaveLength(350);
    expect(new Set(ids).size).toBe(350);
    // Every photo lands inside its chapter's capture-time window (undated ones go last).
    for (const c of g.chapters) {
      for (const p of c.photos) if (p.t) expect(p.t >= c.from && p.t < c.to).toBe(true);
    }
    expect(g.chapters.map((c) => c.id)).toEqual(['vows', 'fast-lane', 'strip', 'staircase']);
  });

  it('removes hidden photos from the payload entirely', () => {
    const g = build({ 'vk-010': 'hidden', 'vk-343': 'hidden' });
    const payload = JSON.stringify(g);
    expect(payload).not.toContain('"vk-010"');
    expect(payload).not.toContain('"vk-343"');
    expect(payload).not.toContain(photos.find((p) => p.id === 'vk-010')!.ph.colour);
    expect(g.hero).not.toContain('vk-343');
  });

  it('applies featured overrides in both directions', () => {
    const g = build({ 'vk-010': 'featured', 'vk-348': 'shown' });
    const all = g.chapters.flatMap((c) => c.photos);
    expect(all.find((p) => p.id === 'vk-010')!.featured).toBe(true);
    expect(all.find((p) => p.id === 'vk-348')!.featured).toBe(false);
    expect(g.hero).not.toContain('vk-348');
  });

  it('leads the hero with heroOrder and never uses lettered photos or collages', () => {
    const g = build();
    expect(g.hero.slice(0, 4)).toEqual(['vk-343', 'vk-348', 'vk-345', 'vk-342']);
    expect(g.heroLead).toBe(4);
    for (const id of ['vk-341', 'vk-347', 'vk-349', 'vk-350']) expect(g.hero).not.toContain(id);
  });

  it('makes every photo hero-eligible except the lettered and collage ones', () => {
    const ruledOut = photos
      .filter((p) => p.heroOk === false)
      .map((p) => p.id)
      .sort();
    expect(ruledOut).toEqual(['vk-341', 'vk-347', 'vk-349', 'vk-350']);
    // A regular landscape photo promoted to favourite joins the hero.
    const promoted = photos.find((p) => !p.featured && p.w > p.h)!;
    expect(build({ [promoted.id]: 'featured' }).hero).toContain(promoted.id);
    // Undefined counts as eligible; only an explicit false rules a photo out.
    const loose = photos.map((p) => (p.id === promoted.id ? { ...p, heroOk: undefined } : p));
    const g = buildGallery({
      photos: loose as Photo[],
      chapters,
      heroOrder: photosJson.heroOrder,
      curation: { version: 1, updatedAt: null, photos: { [promoted.id]: 'featured' } },
      mediaBase: '',
    });
    expect(g.hero).toContain(promoted.id);
  });

  it('covers each chapter with its earliest favourite, moved to the front', () => {
    const g = build({ 'vk-100': 'featured', 'vk-020': 'featured' });
    const vows = g.chapters.find((c) => c.id === 'vows')!;
    const favs = vows.photos.filter((p) => p.featured);
    const earliest = [...favs].sort((a, b) => (a.t! < b.t! ? -1 : 1))[0];
    expect(vows.cover).toBe(earliest.id);
    expect(vows.photos[0].id).toBe(earliest.id);
    expect(vows.photos.filter((p) => p.id === earliest.id)).toHaveLength(1);
    // The rest stay in time order.
    const rest = vows.photos
      .slice(1)
      .map((p) => p.t)
      .filter(Boolean) as string[];
    expect(rest).toEqual([...rest].sort());
  });

  it('gives a chapter without favourites no cover', () => {
    const unfav = Object.fromEntries(
      photos.filter((p) => p.featured).map((p) => [p.id, 'shown' as const])
    );
    for (const c of build(unfav).chapters) expect(c.cover).toBeNull();
  });

  it('drops hidden photos from chapter counts and covers', () => {
    const before = build();
    const cover = before.chapters[0].cover!;
    const after = build({ [cover]: 'hidden' });
    expect(after.chapters[0].photos).toHaveLength(before.chapters[0].photos.length - 1);
    expect(after.chapters[0].cover).not.toBe(cover);
  });

  it('falls back to some photo when every favourite is hidden', () => {
    const hideAll = Object.fromEntries(
      photos.filter((p) => p.featured).map((p) => [p.id, 'hidden' as const])
    );
    const g = build(hideAll);
    expect(g.hero.length).toBeGreaterThan(0);
  });

  it('puts undated photos in the last chapter', () => {
    expect(chapterFor(null, chapters)).toBe('staircase');
    expect(chapterFor('13:31', chapters)).toBe('vows');
    expect(chapterFor('14:12', chapters)).toBe('fast-lane');
  });
});
