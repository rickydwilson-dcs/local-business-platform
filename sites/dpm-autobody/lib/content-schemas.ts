import { z } from 'zod';

/**
 * DPM Autobody — `builds` content-type Zod schema
 * ================================================
 * Site-local (not shared via @platform/core-components) because "a restoration build" isn't a
 * content type any other site in the monorepo needs — see sites/dpm-autobody/CLAUDE.md and
 * output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/session.md Phase 2. Structurally
 * follows the ServiceFrontmatterSchema / LocationFrontmatterSchema pattern in
 * packages/core-components/src/lib/content-schemas.ts (named field-group schemas, an
 * ImagePathSchema variant, z.infer'd types at the bottom).
 *
 * Field list per session.md Phase 2: car make/model/year, chassis number, owner/commissioner
 * names (optional), status (completed | in-progress), hours of labour, scope of work, heroImage,
 * video reference (id + type), build type (concours restoration / resto-mod / race car). Plus
 * `pageStatus` ('built' | 'pending'), added for this brief: a later phase uses it to decide which
 * builds get a generated [slug] route, matching the discovery prototype's own `golink` (real
 * link) vs `golink--dead` (indicative, not yet built) distinction — see
 * output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/library.html.
 *
 * DELIBERATELY SPARSE-FRIENDLY. Only `title`, `status`, and `pageStatus` are required. Verified
 * against all 12 real rows in library.html (the 2026-09-08 review-meeting content): several
 * builds have no chassis number, no hours, no owner name, and no photo at all (e.g. "Volvo, model
 * to be confirmed", No. 11 — previous owner's name also still pending from David). One *delivered*
 * build — "Jaguar — Aston Martin Sea Green", No. 06 — has nothing beyond a title, a photo, and its
 * completed status: no chassis, no hours, no scope-of-work note, no meta line at all. Requiring a
 * narrative/detail field (e.g. a "meta note" or scope-of-work summary) would force a later phase to
 * invent a value for that build, which the build-out brief explicitly rules out ("do not make
 * anything required that would force a later phase to invent a value for a build that doesn't have
 * one"). `scopeOfWork` is therefore optional, not required, despite being the closest analogue to
 * a required "meta-note" field — the real No. 06 row is the concrete counter-example.
 */

/**
 * Image path schema for build photography.
 *
 * The discovery-phase prototype's photography is hosted on a full R2 public URL
 * (`https://pub-<hash>.r2.dev/prototypes/...`), not the site-relative `/...` path or bare
 * `site-name/...` R2 key shape that @platform/core-components' ImagePathSchema expects. Support
 * all three shapes so a build's `heroImage` can point straight at the existing prototype asset
 * (see library.html's `<img src>` values) without a migration/rehost step first.
 */
const BuildImagePathSchema = z
  .string()
  .refine(
    (val) => val.startsWith('/') || val.startsWith('https://') || /^[\w-]+\//.test(val),
    'Image path must start with / (local), be a full https:// URL, or a valid R2 path (site-name/...)'
  );

export const BuildStatusSchema = z.enum(['completed', 'in-progress']);

export const BuildPageStatusSchema = z.enum(['built', 'pending']);

export const BuildTypeSchema = z.enum(['concours-restoration', 'resto-mod', 'race-car']);

export const BuildVideoTypeSchema = z.enum(['professional', 'amateur', 'none']);

const BuildVideoSchema = z.object({
  id: z.string().min(1, 'Video id/reference is required when a video block is present'),
  type: BuildVideoTypeSchema,
});

/**
 * `builds` MDX frontmatter schema.
 * Used to validate all files in content/builds/ once Phase 3 authors them.
 */
export const BuildFrontmatterSchema = z.object({
  title: z
    .string()
    .min(3, 'Build title must be at least 3 characters')
    .max(100, 'Build title must be less than 100 characters'),

  seoTitle: z
    .string()
    .min(10, 'SEO title must be at least 10 characters')
    .max(70, 'SEO title should be under 70 characters')
    .optional(),

  description: z
    .string()
    .min(50, 'Description must be at least 50 characters for good SEO')
    .max(200, 'Description should be under 200 characters - ideally 160 for Google')
    .optional(),

  // --- Car identity (all optional — not every build has make/model/year recorded yet) ---------
  make: z.string().min(2, 'Make must be at least 2 characters').optional(),
  model: z.string().min(1, 'Model must not be empty when set').optional(),
  /** Free-text distinguisher that isn't make/model, e.g. "Candy Red", "941 PVO", "the pink one". */
  variant: z.string().min(1, 'Variant text must not be empty when set').optional(),
  year: z.number().int().min(1900).max(2100).optional(),

  chassisNumber: z.string().min(1, 'Chassis number must not be empty when set').optional(),

  // --- People (optional — not every build has owner/commissioner names confirmed yet) ----------
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters').optional(),
  commissionerName: z.string().min(2, 'Commissioner name must be at least 2 characters').optional(),

  // --- Status (required) ------------------------------------------------------------------------
  status: BuildStatusSchema,

  /**
   * Which builds get a generated [slug] route in Phase 3 — see file header. Required: every build,
   * even a bare stub, must declare whether it's publishable as its own page yet.
   */
  pageStatus: BuildPageStatusSchema,

  buildType: BuildTypeSchema.optional(),

  // --- Work detail (optional — see file header for why nothing here is required) ----------------
  /** Free text, not a structured number — real values are "1,300 hours", "Over 1,000 hours...". */
  hoursOfLabour: z.string().min(1, 'Hours of labour text must not be empty when set').optional(),

  /** Free text, e.g. "A year in the building", "Now in reassembly". */
  buildDuration: z.string().min(1, 'Build duration text must not be empty when set').optional(),

  /** The narrative equivalent of library.html's `.ledger__note` paragraph. */
  scopeOfWork: z
    .string()
    .min(10, 'Scope of work should be at least 10 characters when set')
    .optional(),

  // --- Media ---------------------------------------------------------------------------------
  heroImage: BuildImagePathSchema.optional(),
  galleryImages: z.array(BuildImagePathSchema).optional(),

  video: BuildVideoSchema.optional(),
});

/**
 * Type exports for TypeScript usage
 */
export type BuildFrontmatter = z.infer<typeof BuildFrontmatterSchema>;
export type BuildStatusValue = z.infer<typeof BuildStatusSchema>;
export type BuildPageStatusValue = z.infer<typeof BuildPageStatusSchema>;
export type BuildTypeValue = z.infer<typeof BuildTypeSchema>;
export type BuildVideoTypeValue = z.infer<typeof BuildVideoTypeSchema>;
