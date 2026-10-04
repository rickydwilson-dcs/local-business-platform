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

describe('chapter cover', () => {
  for (const mobile of [false, true]) {
    it(`leads its chapter full width (${mobile ? 'mobile' : 'desktop'})`, () => {
      for (const c of g.chapters) {
        const rows = buildRows(c.photos, mobile, c.cover);
        const covers = rows.filter((r) => r.cover);
        if (!c.cover) {
          expect(covers).toHaveLength(0);
          continue;
        }
        expect(rows[0]).toMatchObject({ type: 'full', cover: true });
        expect(rows[0].items.map((p) => p.id)).toEqual([c.cover]);
        expect(covers).toHaveLength(1);
        // Shown once: not also in its time slot.
        const placed = rows.flatMap((r) => r.items.map((p) => p.id));
        expect(placed.filter((id) => id === c.cover)).toHaveLength(1);
      }
    });
  }

  it('gives every favourite, portrait included, a full-width row on desktop', () => {
    for (const c of g.chapters) {
      for (const r of buildRows(c.photos, false, c.cover)) {
        if (r.items[0].featured) expect(r.type).toBe('full');
      }
    }
  });
});
