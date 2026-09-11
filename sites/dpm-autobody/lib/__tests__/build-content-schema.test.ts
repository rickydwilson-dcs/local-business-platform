import { describe, it, expect } from 'vitest';
import { BuildFrontmatterSchema, type BuildFrontmatter } from '../content-schemas';

/**
 * Fixtures are drawn from the real 12 rows in
 * output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/library.html (the
 * 2026-09-08 review-meeting content), not synthetic placeholder data. See that file's
 * `<ul class="ledger">` blocks (No. 01 - No. 12) for the source of every fact used below.
 */

describe('BuildFrontmatterSchema', () => {
  describe('a fully-populated build — No. 01, Volvo P1800 Candy Red (has its own page)', () => {
    const p1800Candy: BuildFrontmatter = {
      title: 'Volvo P1800 — Candy Red',
      make: 'Volvo',
      model: 'P1800',
      variant: 'Candy Red',
      chassisNumber: '26282',
      status: 'completed',
      pageStatus: 'built',
      buildType: 'concours-restoration',
      hoursOfLabour: '1,300 hours',
      buildDuration: 'A year in the building',
      scopeOfWork:
        'Full body and paint, plus five changes the owner specified himself — wire wheels, ' +
        'power steering, smoothed chrome bumpers, lowered. The most completely documented car ' +
        'DPM have finished.',
      heroImage:
        'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/prototypes/2026-08-26_dpm-autobody-discovery/assets/dpm-instagram/DU2rgo5DXqC/web/slide-01.jpg',
    };

    it('validates', () => {
      expect(() => BuildFrontmatterSchema.parse(p1800Candy)).not.toThrow();
    });

    it('round-trips every field unchanged', () => {
      const parsed = BuildFrontmatterSchema.parse(p1800Candy);
      expect(parsed).toEqual(p1800Candy);
    });
  });

  describe('a sparse build — No. 06, Jaguar Aston Martin Sea Green (name/status/photo only)', () => {
    const jaguarSeaGreen: BuildFrontmatter = {
      title: 'Jaguar — Aston Martin Sea Green',
      status: 'completed',
      pageStatus: 'pending',
      heroImage:
        'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/prototypes/2026-08-26_dpm-autobody-discovery/assets/dpm-work/jaguar-sea-green/booth.jpg',
    };

    it('validates with no chassis, hours, owner, or scope-of-work fields set', () => {
      expect(() => BuildFrontmatterSchema.parse(jaguarSeaGreen)).not.toThrow();
    });

    it('does not silently invent any of the omitted optional fields', () => {
      const parsed = BuildFrontmatterSchema.parse(jaguarSeaGreen);
      expect(parsed.chassisNumber).toBeUndefined();
      expect(parsed.hoursOfLabour).toBeUndefined();
      expect(parsed.scopeOfWork).toBeUndefined();
      expect(parsed.ownerName).toBeUndefined();
      expect(parsed.buildType).toBeUndefined();
      expect(parsed.video).toBeUndefined();
    });
  });

  describe('a build with owner + commissioner names — No. 02, P1800 resto-mod', () => {
    const p1800RestoMod: BuildFrontmatter = {
      title: 'Volvo P1800 — Resto-mod, Candy Red',
      make: 'Volvo',
      model: 'P1800',
      chassisNumber: '23925',
      ownerName: 'Tonja',
      commissionerName: 'Ahmet',
      status: 'completed',
      pageStatus: 'pending',
      buildType: 'resto-mod',
      scopeOfWork:
        'Full body and paint, plus in-depth body and trim modifications — a total one-off ' +
        'example. A separate car from the Candy Red P1800 above.',
    };

    it('validates', () => {
      expect(() => BuildFrontmatterSchema.parse(p1800RestoMod)).not.toThrow();
    });
  });

  describe('a build with a confirmed video credit — No. 05, Bentley S3 Continental 1963', () => {
    const bentleyS3Continental: BuildFrontmatter = {
      title: 'Bentley S3 Continental, 1963',
      make: 'Bentley',
      model: 'S3 Continental',
      year: 1963,
      status: 'completed',
      pageStatus: 'pending',
      video: { id: 'JpztIam_ARE', type: 'professional' },
      heroImage:
        'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/prototypes/2026-08-26_dpm-autobody-discovery/assets/dpm-work/bentley-s3/whole.jpg',
    };

    it('validates', () => {
      expect(() => BuildFrontmatterSchema.parse(bentleyS3Continental)).not.toThrow();
    });
  });

  describe('an in-progress build with no chassis number yet — No. 10, Bentley S3 1964', () => {
    const bentleyS3InProgress: BuildFrontmatter = {
      title: 'Bentley S3, 1964',
      make: 'Bentley',
      model: 'S3',
      year: 1964,
      status: 'in-progress',
      pageStatus: 'pending',
      hoursOfLabour: 'Over 1,000 hours of hand-crafted metalwork to date',
      scopeOfWork:
        'All new panels made by hand, in house. The chassis is being rebuilt now, ahead of ' +
        'mating it back to the body for final prep and paint.',
    };

    it('validates without a chassisNumber (chassis number still pending from David)', () => {
      expect(() => BuildFrontmatterSchema.parse(bentleyS3InProgress)).not.toThrow();
    });
  });

  describe('a race-car build — No. 09, Aston Martin DB6 (the pink one)', () => {
    const db6: BuildFrontmatter = {
      title: 'Aston Martin DB6 — the pink one',
      make: 'Aston Martin',
      model: 'DB6',
      status: 'completed',
      pageStatus: 'pending',
      buildType: 'race-car',
      scopeOfWork:
        'DPM repaired the body, including a new door fabricated in house, then finished the car ' +
        'in pink at the owner’s request — to stand out at the next race. Due to race again.',
    };

    it('validates', () => {
      expect(() => BuildFrontmatterSchema.parse(db6)).not.toThrow();
    });
  });

  describe('required fields', () => {
    const minimalValid: BuildFrontmatter = {
      title: 'Volvo, model to be confirmed',
      status: 'in-progress',
      pageStatus: 'pending',
    };

    it('accepts a build with only title, status, and pageStatus set', () => {
      expect(() => BuildFrontmatterSchema.parse(minimalValid)).not.toThrow();
    });

    it('rejects a build missing title', () => {
      const { title: _title, ...rest } = minimalValid;
      expect(() => BuildFrontmatterSchema.parse(rest)).toThrow();
    });

    it('rejects a build missing status', () => {
      const { status: _status, ...rest } = minimalValid;
      expect(() => BuildFrontmatterSchema.parse(rest)).toThrow();
    });

    it('rejects a build missing pageStatus', () => {
      const { pageStatus: _pageStatus, ...rest } = minimalValid;
      expect(() => BuildFrontmatterSchema.parse(rest)).toThrow();
    });

    it('rejects a title under 3 characters', () => {
      expect(() => BuildFrontmatterSchema.parse({ ...minimalValid, title: 'P1' })).toThrow();
    });
  });

  describe('status / pageStatus / buildType enums', () => {
    const base: BuildFrontmatter = {
      title: 'Test build',
      status: 'completed',
      pageStatus: 'built',
    };

    it('rejects an invalid status value', () => {
      expect(() => BuildFrontmatterSchema.parse({ ...base, status: 'finished' })).toThrow();
    });

    it('rejects an invalid pageStatus value', () => {
      expect(() => BuildFrontmatterSchema.parse({ ...base, pageStatus: 'live' })).toThrow();
    });

    it('rejects an invalid buildType value', () => {
      expect(() => BuildFrontmatterSchema.parse({ ...base, buildType: 'daily-driver' })).toThrow();
    });

    it('accepts each of the three valid buildType values', () => {
      for (const buildType of ['concours-restoration', 'resto-mod', 'race-car'] as const) {
        expect(() => BuildFrontmatterSchema.parse({ ...base, buildType })).not.toThrow();
      }
    });
  });

  describe('heroImage path shapes', () => {
    const base: BuildFrontmatter = {
      title: 'Test build',
      status: 'completed',
      pageStatus: 'pending',
    };

    it('accepts a full https:// R2 URL (the shape every real prototype photo uses)', () => {
      expect(() =>
        BuildFrontmatterSchema.parse({
          ...base,
          heroImage: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/prototypes/x/y.jpg',
        })
      ).not.toThrow();
    });

    it('accepts a local /public path', () => {
      expect(() =>
        BuildFrontmatterSchema.parse({ ...base, heroImage: '/images/builds/db6.jpg' })
      ).not.toThrow();
    });

    it('accepts a bare R2 key path (site-name/...)', () => {
      expect(() =>
        BuildFrontmatterSchema.parse({ ...base, heroImage: 'dpm-autobody/builds/db6.jpg' })
      ).not.toThrow();
    });

    it('rejects a path that is neither local, R2-key, nor https', () => {
      expect(() => BuildFrontmatterSchema.parse({ ...base, heroImage: 'not a path' })).toThrow();
    });
  });

  describe('video block', () => {
    const base: BuildFrontmatter = {
      title: 'Test build',
      status: 'completed',
      pageStatus: 'pending',
    };

    it('rejects a video block missing id', () => {
      expect(() =>
        BuildFrontmatterSchema.parse({ ...base, video: { type: 'professional' } })
      ).toThrow();
    });

    it('rejects a video block with an invalid type', () => {
      expect(() =>
        BuildFrontmatterSchema.parse({
          ...base,
          video: { id: 'JpztIam_ARE', type: 'drone' },
        })
      ).toThrow();
    });

    it('accepts a valid video block', () => {
      expect(() =>
        BuildFrontmatterSchema.parse({
          ...base,
          video: { id: 'JpztIam_ARE', type: 'professional' },
        })
      ).not.toThrow();
    });
  });

  describe('empty-string edge cases (would silently pass a bare .optional(z.string()))', () => {
    const base: BuildFrontmatter = {
      title: 'Test build',
      status: 'completed',
      pageStatus: 'pending',
    };

    it('rejects an empty chassisNumber', () => {
      expect(() => BuildFrontmatterSchema.parse({ ...base, chassisNumber: '' })).toThrow();
    });

    it('rejects an empty hoursOfLabour', () => {
      expect(() => BuildFrontmatterSchema.parse({ ...base, hoursOfLabour: '' })).toThrow();
    });

    it('rejects a scopeOfWork under 10 characters', () => {
      expect(() => BuildFrontmatterSchema.parse({ ...base, scopeOfWork: 'Too short' })).toThrow();
    });
  });
});
