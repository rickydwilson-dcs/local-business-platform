import { describe, expect, it } from 'vitest';
import photosJson from '@/content/photos.json';
import chaptersJson from '@/content/chapters.json';
import { buildGallery } from '@/lib/gallery';
import { buildRows } from '@/lib/rows';
import type { Chapter, Photo } from '@/lib/types';

const g = buildGallery({
  photos: photosJson.photos as Photo[],
  chapters: chaptersJson.chapters as Chapter[],
  heroOrder: photosJson.heroOrder,
  curation: { version: 0, updatedAt: null, photos: {} },
  mediaBase: '',
});

describe('buildRows', () => {
  for (const mobile of [false, true]) {
    it(`places every photo exactly once (${mobile ? 'mobile' : 'desktop'})`, () => {
      for (const c of g.chapters) {
        const placed = buildRows(c.photos, mobile).flatMap((r) => r.items.map((p) => p.id));
        expect(placed).toEqual(c.photos.map((p) => p.id));
      }
    });

    it(`gives favourites a row of their own (${mobile ? 'mobile' : 'desktop'})`, () => {
      for (const c of g.chapters) {
        for (const r of buildRows(c.photos, mobile)) {
          if (r.items.some((p) => p.featured)) expect(r.items).toHaveLength(1);
        }
      }
    });
  }
});
