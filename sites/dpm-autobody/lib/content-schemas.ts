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

/**
 * A hex colour sampled from a real, verifiable source (a paint code, or the prototype's own
 * per-page `--accent`/`data-accent` value) — never eyeballed here.
 */
const HexColourSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Colour must be a 6-digit hex value, e.g. #3C5563');

/**
 * Per-car accent pair, mirroring the prototype's per-page `--accent` / `--accent-ink` custom
 * properties (and the `data-accent`/`data-ink` attributes its scroll script reads into them).
 * Each documented-car page themes itself to that car's own paint rather than to the site-wide
 * Volvo/candy red: `#3C5563`/`#A3BFCE` on etype-941pvo.html (Opalescent Silver Blue),
 * `#A61C24`/`#E4776C` on volvo-p1800.html (Candy Red). Optional, and deliberately left unset
 * for every build whose paint has no published/verified value — the page then falls back to the
 * theme's brand tokens rather than showing an invented colour.
 *
 * `base` is the fill (swatch, paint-spec gradient); `ink` is the text/rule colour, which is the
 * one the prototype's own head comment computes for WCAG contrast against the near-black ground.
 */
const BuildAccentSchema = z.object({
  base: HexColourSchema,
  ink: HexColourSchema,
});

/**
 * A two-part caption: a bold lead-in and the regular continuation that follows it — the
 * prototype's `<b>Above — the Jaguar script,</b> raised chrome on Opalescent Silver Blue.`
 * shape, used on every `figcaption` in both documented-car pages (`.stage__cap`, `.caption`,
 * `.grid figcaption`, `.plaque__note`). Split into two fields rather than stored as one string
 * with markup so the copy stays plain text in frontmatter.
 */
const BuildCaptionSchema = z.object({
  lead: z.string().min(1, 'Caption lead-in must not be empty when set'),
  rest: z.string().optional(),
});

/**
 * One real photograph: its URL plus the prototype's own `alt` text and `figcaption` copy.
 * `wide` marks the prototype's `.grid--wide` entries, which span the full grid row.
 */
const BuildPhotoSchema = z.object({
  src: BuildImagePathSchema,
  alt: z.string().min(1, 'Photo alt text must not be empty when set').optional(),
  caption: BuildCaptionSchema.optional(),
  wide: z.boolean().optional(),
});

/** A grouped grid of photographs placed at a known point in the narrative — see `photoSections`. */
const BuildPhotoSectionSchema = z.object({
  /** 1-based ordinal of the MDX `##` section this grid follows. */
  afterSection: z.number().int().min(1),
  /** Chapter eyebrow ("Finished, in daylight"). Omit to append the grid with no new chapter band. */
  kind: z.string().min(1).optional(),
  /** The section's `h2`. Omit together with `kind` for an unheaded grid. */
  title: z.string().min(1).optional(),
  /** Lead paragraph under the heading. */
  intro: z.string().min(1).optional(),
  /** Three-up grid (the prototype's `.grid--3`) rather than the default two-up `.grid`. */
  columns: z.union([z.literal(2), z.literal(3)]).optional(),
  photos: z.array(BuildPhotoSchema).min(1, 'A photo section must contain at least one photo'),
});

/** See the `plaque` field comment. */
const BuildPlaqueSchema = z.object({
  image: BuildImagePathSchema,
  alt: z.string().min(1, 'Plaque photo alt text must not be empty when set').optional(),
  /** The attribution/source line under the photo. */
  caption: BuildCaptionSchema.optional(),
});

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

  /**
   * Short human-readable labels for facts this build's page genuinely does not have yet
   * (e.g. "Chassis number", "Owner names and show awards", "Current race status") — rendered as
   * a visible highlighted "needs sourcing from David" notice on both the library card and the
   * build page, rather than silently omitting the fact or inventing a plausible-sounding value.
   * Remove an entry (not just the underlying fact) once David confirms it.
   */
  sourcingGaps: z.array(z.string().min(1, 'A sourcing gap label must not be empty')).optional(),

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

  /**
   * The hero's own `figcaption`, transcribed from the prototype's `.stage__cap` line for the
   * image `heroImage` actually points at. Optional: a build with no published caption for its
   * hero photo simply renders none.
   */
  heroCaption: BuildCaptionSchema.optional(),

  /** Alt text for `heroImage`, transcribed from the prototype's own `alt` attribute. */
  heroImageAlt: z.string().min(1, 'Hero image alt text must not be empty when set').optional(),

  /**
   * Flat list of gallery photo URLs, or richer per-photo objects carrying the prototype's own
   * real `alt` text and two-part `figcaption`. The bare-string form is kept so an existing or
   * future caller can still pass a plain URL list.
   */
  galleryImages: z.array(z.union([BuildImagePathSchema, BuildPhotoSchema])).optional(),

  /**
   * Grouped photo sections, matching the prototype's real structure: each documented-car page
   * interleaves its photo grids INTO the narrative rather than appending one gallery at the end
   * (volvo-p1800.html has two — "The car, in detail" and the unheaded grid inside "Concours
   * evidence"; etype-941pvo.html has one, "Finished, in daylight"). `afterSection` is the 1-based
   * ordinal of the MDX body's `##` heading this grid belongs after, so the numbered chapter
   * sequence on the rendered page matches the prototype's.
   */
  photoSections: z.array(BuildPhotoSectionSchema).optional(),

  /**
   * The full-bleed "plaque" treatment: a photo of the finished car (or of the engraved plaque
   * itself) with a quote set over it, and an attribution note below — `<figure class="plaque">`
   * in both prototype pages. The quote text is NOT duplicated here: it stays in the MDX body as
   * a blockquote, which the page renders into this treatment when `plaque` is present.
   */
  plaque: BuildPlaqueSchema.optional(),

  /**
   * The `.paintspec` block (volvo-p1800.html only): a paint swatch set beside that section's
   * spec table. `section` is the 1-based ordinal of the MDX `##` section it applies to;
   * `swatchLabel` is the swatch's accessible description, transcribed from the prototype's own
   * `aria-label`. The swatch colour is derived from `accent.base` — there is no separate colour
   * field, so it can never disagree with the car's accent.
   */
  paintSpec: z
    .object({
      section: z.number().int().min(1),
      swatchLabel: z.string().min(1, 'Paint swatch label must not be empty when set'),
    })
    .optional(),

  /** Per-car accent pair — see BuildAccentSchema. */
  accent: BuildAccentSchema.optional(),

  video: BuildVideoSchema.optional(),
});

/**
 * Type exports for TypeScript usage
 */
export type BuildFrontmatter = z.infer<typeof BuildFrontmatterSchema>;
export type BuildPhoto = z.infer<typeof BuildPhotoSchema>;
export type BuildPhotoSection = z.infer<typeof BuildPhotoSectionSchema>;
export type BuildCaption = z.infer<typeof BuildCaptionSchema>;
export type BuildStatusValue = z.infer<typeof BuildStatusSchema>;
export type BuildPageStatusValue = z.infer<typeof BuildPageStatusSchema>;
export type BuildTypeValue = z.infer<typeof BuildTypeSchema>;
export type BuildVideoTypeValue = z.infer<typeof BuildVideoTypeSchema>;
