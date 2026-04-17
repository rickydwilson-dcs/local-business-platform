# Codex Implementation Plan: Pipeline Standard Pages (Step 5f Rewrite)

## 1. Scope Lock + Guardrails (Skill-only)

1.1 Modify only `.claude/commands/pipeline.ingest.md`, replacing Step 5f behavior; do not change TypeScript tools.

1.2 Preserve current Steps 1-5e and 5g-8 unless a Step 5f contract dependency requires a tiny wording adjustment.

1.3 Explicitly state in Step 5f that `output/ingestion/<theme-name>/site-analysis.json` is the sole source of truth for route/page decisions.

Files changed:

- `.claude/commands/pipeline.ingest.md`

Verification gate:

- `rg -n "Step 5f|site-analysis.json|example-pages" .claude/commands/pipeline.ingest.md` shows Step 5f no longer copies `example-pages/app/*` into the test site.

---

## 2. Replace Step 5f With Deterministic Five-Page Generator Workflow

2.1 Add a new Step 5f preamble that defines fixed output contract under `sites/test-<theme-name>/app/`:

- `page.tsx`
- `about/page.tsx`
- `contact/page.tsx`
- `<category-slug>/page.tsx`
- `<category-slug>/[slug]/page.tsx`
- plus existing `layout.tsx` and `globals.css`

  2.2 Add explicit cleanup command before generation:

- remove all existing `page.tsx` routes under test-site `app/`
- remove empty dirs
- keep `layout.tsx`, `globals.css`, `components/ReviewPanel.tsx`

  2.3 Generate pages one-by-one (not one giant pass): home → about → contact → category index → item detail. Require a local verification check after each file write (exists, imports compile at syntax level, expected nav/footer present).

Why sequence is preferred:

- Enables per-page fallback when blueprint data is missing.
- Makes failure isolation obvious (which page failed and why).
- Reduces model drift from large monolithic generation prompts.

Files changed:

- `.claude/commands/pipeline.ingest.md` (new ordered substeps for 5f)

Verification gate:

- `find sites/test-<theme-name>/app -name "page.tsx" | sort` returns exactly 5 page routes in expected locations.

---

## 3. Component Inventory and Import Contract (Before Writing Pages)

3.1 Add a mandatory inventory substep in 5f before any page generation:

- Read `output/ingestion/<theme-name>/site-analysis.json`
- List theme components: `ls packages/themes/<theme-name>/components/*.tsx`
- Read `packages/themes/<theme-name>/index.ts` for registry export names
- Read `packages/core-components/src/index.ts` for barrel-available core components

  3.2 Build two explicit sets in the skill instructions:

- `themeComponentExports`: from generated theme components (file->export derived from `sectionBlueprints.componentExportName` + file presence)
- `coreComponentExports`: from barrel exports (plus explicit note that Footer is subpath-only)

  3.3 Add resolution rule per section:

1. Use theme component when matching blueprint component exists in theme package.
2. Else use matched core component from `componentMatches` when available and exported.
3. Else generate inline JSX section in the page file (no one-off component files).

3.4 Nav/footer contract:

- Prefer `TopNavigation` + `SiteFooter` from `@platform/themes/<theme-name>/components` if present.
- If not present, fallback to `SiteHeader` from `@platform/core-components` and inline token-styled footer block (to avoid fragile footer subpath import with fs dependencies in this generated context).

Risk callout:

- Acceptance text says “TopNavigation and SiteFooter (or equivalent) from theme components (if those components exist)”. The plan enforces that exact conditional to avoid forcing nonexistent theme exports.

Verification gates:

- `rg -n "@platform/themes/<theme-name>/components|@platform/core-components" sites/test-<theme-name>/app/**/*.tsx`
- `rg -n "TopNavigation|SiteFooter|SiteHeader" sites/test-<theme-name>/app/**/*.tsx`

---

## 4. Category Slug Detection Decision Tree (From site-analysis.json)

Implement as explicit ordered logic in Step 5f instructions:

4.1 Candidate extraction from discovered pages:

- From `discoveredPages`, collect depth-1 paths (e.g. `/services`, `/blog`, `/events`, `/products`, `/locations`).
- Exclude reserved roots: `/`, `/about`, `/contact`, `/privacy`, `/terms`, `/cookies`.
- Prefer candidates whose `pageType` is one of:
  - `services-list`
  - `blog-list`
  - `locations-list`
  - `projects`
  - `reviews`
  - `pricing`

  4.2 Blueprint confirmation:

- Cross-check candidate path against `pageBlueprints.path` and favor candidates with non-empty `sections`.

  4.3 Detail route confirmation:

- Search for depth-2 discovered pages whose first segment equals candidate slug.
- If found, mark category type as having known detail precedent.

  4.4 Priority order if multiple candidates survive:

1. Candidate with both list + detail presence
2. Candidate with list pageType confidence (services-list/blog-list/locations-list)
3. Candidate with most blueprint sections
4. First nav/discovery order from `discoveredPages`

4.5 Fallback when no candidate survives:

- Use `services` as final fallback slug (explicitly labeled low-confidence fallback in skill output).
- Still generate category index + detail pages with default structure.

  4.6 Detail page route path rule:

- Always generate dynamic route `/<category-slug>/[slug]/page.tsx` even if source had concrete URLs; this meets fixed 5-route acceptance.

Files changed:

- `.claude/commands/pipeline.ingest.md` (category-detection algorithm text)

Verification gate:

- Emit a required Step 5f summary line: `Detected category slug: <slug> (source: discoveredPages|blueprints|fallback)`.

---

## 5. Reference-First Page Composition Contract

5.1 For each required page type, instruct the model to resolve a source blueprint first:

- Home: `pageType === home` or `path === /`
- About: `pageType === about` or `/about`
- Contact: `pageType === contact` or `/contact`
- Category index: blueprint/path for detected slug
- Item detail: best matching depth-2 page under slug; if absent, synthesize from sectionBlueprints

  5.2 Section-order rule:

- If source blueprint exists and has sections, page section order must follow that `sections` order.
- Missing section implementations use inline JSX at the same sequence point.

  5.3 Fallback templates (when source blueprint/page absent):

- Encode the provided defaults as deterministic section skeletons for each of 5 pages.
- Require token classes only (`bg-brand-primary`, `text-surface-foreground`, etc.) + neutral utility classes.

  5.4 Inline JSX constraints for generated sections:

- no hex colors
- no TODO placeholders
- no empty sections
- meaningful heading/body/CTA copy
- no separate component files for one-off fallback sections

  5.5 Static-only constraints:

- no MDX loading
- no `generateStaticParams`
- no `fs.readdir`
- no `getContentItems`
- category/detail content may use hardcoded 2-3 items

Verification gates:

- `rg -n "#[0-9A-Fa-f]{3,8}" sites/test-<theme-name>/app/**/*.tsx` must return empty
- `rg -n "TODO|placeholder div|generateStaticParams|getContentItems|fs\.readdir" sites/test-<theme-name>/app/**/*.tsx` must return empty

---

## 6. Exact Route and Content Validation Before Step 6

Add hard-stop checks at end of new 5f:

6.1 Route completeness check:

- Verify all five required page files exist.
- Verify no extra `page.tsx` routes beyond those five.

  6.2 Structural checks on each page:

- Contains nav import+render (theme-first fallback allowed)
- Contains footer import+render (theme-first fallback allowed)
- Contains at least 3 semantic sections (`<section` count) for non-detail pages, and at least 2 for detail page.

  6.3 Home section-order check:

- If home blueprint exists, validate generated file includes mapped section comments/markers in blueprint order.
- If not possible to assert by marker, require generation step to include explicit ordered section labels/comments.

  6.4 Type check gate (existing Step 6 stays):

- Keep `npx tsc --noEmit` advisory behavior, but Step 5f must finish only after route+token contract checks pass.

Verification commands to embed in skill:

- `find .../app -name "page.tsx" | sort`
- `test -f` checks for each required route
- `rg` checks for nav/footer and forbidden patterns

---

## 7. Handling Existing `example-pages` Output

7.1 Do not copy `output/ingestion/<theme-name>/example-pages/app/*` into test site.

7.2 Keep `example-pages` as optional reference material only:

- The skill may read them for phrasing/layout hints when blueprint data is thin.
- They are non-authoritative and must not control route set.

  7.3 Do not delete `output/ingestion/<theme-name>/example-pages/` in this change.

Rationale:

- Avoid coupling Step 5f correctness to an unstable upstream artifact while preserving debugging value.

Verification gate:

- Step 5f contains no `cp -r output/ingestion/<theme-name>/example-pages/app/* ...` command.

---

## 8. Suggested Step 5f Markdown Structure (Implementation Shape)

Use explicit substeps in `.claude/commands/pipeline.ingest.md`:

1. Read analysis + assert fields exist (`discoveredPages`, `pageBlueprints`, `sectionBlueprints`, `componentMatches`)
2. Build component inventory (theme + core)
3. Detect category slug via decision tree
4. Clear page routes in test site app/
5. Generate `app/page.tsx` (reference-first + fallback)
6. Generate `app/about/page.tsx`
7. Generate `app/contact/page.tsx`
8. Generate `app/<category-slug>/page.tsx`
9. Generate `app/<category-slug>/[slug]/page.tsx`
10. Run 5f verification gates (routes, token checks, nav/footer checks, forbidden APIs)
11. Print a concise generation summary (slug detected, fallback pages used, theme components used)

This keeps behavior deterministic while still using the skill/model generation path (no TS tool rewrite).

---

## 9. Risks, Gaps, and Trade-offs

9.1 Data sparsity risk:

- Some `site-analysis.json` runs contain only home data. Mitigation: deterministic fallback templates + explicit low-confidence slug fallback.

  9.2 Component export ambiguity risk:

- Theme component files may not include `TopNavigation`/`SiteFooter`. Mitigation: explicit “if exists” logic + equivalent fallback.

  9.3 “Exactly five pages” interpretation risk:

- Base template may include extra routes unless cleaned first. Mitigation: hard delete of existing `page.tsx` before generation + exact count gate.

  9.4 Prompt drift risk in long Step 5f:

- Overly long freeform generation can produce inconsistent imports/classes. Mitigation: one-file-at-a-time generation with post-write checks.

  9.5 Acceptance ambiguity:

- Requirement says category from nav structure, but available schema primarily exposes `discoveredPages` and classified `pageType`. Mitigation: treat discovered depth-1 paths (sourced from sitemap/nav/probe) as nav-derived input and report source confidence.

---

## 10. Verification Checklist (Reviewer/Operator)

1. Run `/pipeline.ingest --url <url>`.
2. Confirm `sites/test-<theme-name>/app` has only required route files.
3. Start dev server in test site and hit all five routes (`/`, `/about`, `/contact`, `/<slug>`, `/<slug>/<sample>`).
4. Run grep checks for hex colors and forbidden APIs.
5. Confirm home page section order aligns with `site-analysis.json` home blueprint when present.
6. Confirm generation summary reports detected category slug and fallback usage.
