# Codex Implementation Plan — LocationFrontmatter Generalisation (2026-02-19)

1) Capture current state (fast guardrail)
- Commands: `pnpm --filter colossus-reference validate:content`, `pnpm --filter dj-fox-electrical validate:content`, `pnpm --filter base-template validate:content`, then `pnpm --filter colossus-reference type-check` and `pnpm --filter dj-fox-electrical type-check`.
- Purpose: baseline to prove all sites are green before any schema edits; note any surprising warnings.

2) Introduce schema composability (no site code changes yet)
- File: `packages/core-components/src/lib/content-schemas.ts`.
- Action: factor the current location shape into `BaseLocationFrontmatterSchema = z.object({...})` (no behavioural change). Export factory `createLocationFrontmatterSchema = (shapeOverride?: Partial<ZodRawShape>) => BaseLocationFrontmatterSchema.extend(shapeOverride ?? {})`.
- Keep `LocationFrontmatterSchema = createLocationFrontmatterSchema();` and `export type LocationFrontmatter = z.infer<typeof LocationFrontmatterSchema>;` so existing imports remain stable.
- Verification: `pnpm lint` for types; no content changes expected.

3) Generalise geography fields with backward-safe defaults
- Replace `county` enum with `z.string().trim().min(1).optional()` and add optional `countySlug: z.string().regex(/^[a-z0-9-]+$/).optional()`.
- Add `.describe` notes clarifying `county` is human-readable and `countySlug` is grouping-friendly; no component touches required.
- Verification: rerun the three `validate:content` commands — expect all green because this is a relaxation.

4) Make hero industry-agnostic without breaking colossus
- Keep existing hero keys (`title`, `description`, `image`, `phone`, `trustBadges`, `ctaText`, `ctaUrl`) to avoid TS breakage.
- Add generic peers: `primaryActionLabel`, `primaryActionHref` (regex `/^\//`), and `highlightItems` (string array, min length 1 if provided). Add JSDoc marking `phone`/`trustBadges` as legacy/colossus-leaning.
- No MDX migration required immediately; future sites can use the new fields.
- Verification: `pnpm --filter colossus-reference type-check` (ensures hero access still typed); spot-check one colossus MDX continues to validate.

5) Loosen services link constraint safely
- Change `services.items[].link` to `z.string().regex(/^\/[A-Za-z0-9\/_-]+$/, "Service link must be a site-relative path")` allowing any prefix while still blocking external URLs.
- Verification: rerun `validate:content` for all sites.

6) Document author guidance and extension entry point
- Add short inline comments/JSDoc in `content-schemas.ts` explaining legacy vs generic hero fields and the countySlug intent.
- Update or create `packages/core-components/CHANGELOG.md` summarising: county now free text + slug, hero generic actions/highlights, services link relaxed, new schema factory for extensions.
- (Optional) Add a brief note in `CLAUDE.md` or team docs pointing to `createLocationFrontmatterSchema` for new client onboarding.

7) Final verification gate
- Commands: `pnpm --filter colossus-reference validate:content`, `pnpm --filter dj-fox-electrical validate:content`, `pnpm --filter base-template validate:content`, `pnpm --filter colossus-reference type-check`, `pnpm --filter dj-fox-electrical type-check`, and optionally `pnpm lint` at root.
- Success criteria: all pass; no TypeScript regressions in pages using hero or county; no content files modified during this change set.

8) Deferred cleanups (do not couple to this change)
- Plan future migrations: colossus to move from `phone/trustBadges` to generic hero fields; add `countySlug` values to improve grouping; reconsider rendering precedence in hero components once content migrates.
- Track as separate tickets to keep this change minimal and low-risk.

Hand-off
- Save this plan (done) and instruct to run `/plan.with.codex synthesise` in Claude Code once reviewed.
