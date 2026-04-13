# Entry A Pipeline Results

**Date:** 2026-04-13
**Reference:** colorcode.events
**Theme:** corvus
**Entry point:** Ingest from live URL

## Stage 1: Clone

- CPF directory: `output/clones/corvus/`
- Pages cloned: 5 JSX pages (AboutPage, Blog-listPage, Blog-postPage, CustomPage, HomePage)
- Reference screenshots: 5 (one per page type)
- Assets downloaded: 4 (CSS/image files; the pipeline discovered 148 but only retained 4 unique referenced assets)
- HTML pages: 10 pages fetched successfully

**Issues in Stage 1:**

- Section style extraction timed out for 9/10 pages (only home page succeeded before timeout). Root cause: Playwright `networkidle` wait on pages with embedded fonts/external resources. The section style extraction uses a 20s timeout. The home page extracted 12 sections and 10 custom color vars.
- Visual QA step failed all 3 iterations with `ERR_CONNECTION_REFUSED` / `ERR_EMPTY_RESPONSE`. The clone preview dev server (port 3799) started but Playwright couldn't connect in time. This is a known timing issue — the QA step starts taking screenshots before the server is fully ready. Pipeline continued to Stage 2 despite QA failures.

## Stage 2: Extract Theme

- Theme package: `packages/themes/corvus/`
- Components: 37
- Page layouts: 6 (AboutPage, BlogListPage, BlogPostPage, CustomPage, HomePage, + index)
- Sections extracted: 12 (from home page styles)
- Custom color vars: 10
- Typography scale extracted: `{"hero":"16px"}` — only one size detected, likely because section style extraction failed for most pages

**Issues in Stage 2:**

- Typography scale extraction underperformed: only `hero: 16px` extracted. Caused by the stage 1 timeout issue — most page styles weren't captured, so only home hero section contributed to the scale.

## Stage 3: Scaffold

- Site directory: `sites/_corvus-digital-marketing-events/`
- Service MDX files: 10
- Location MDX files: 4
- Dev server: READY (confirmed by scaffold step 8)

**Issues in Stage 3:**

- **TypeScript errors (site does not type-check).** The scaffolder generates a minimal `site.config.ts` based on the brief (name, trade, tagline, tone, etc.), but the site's pages (copied from base-template) expect the full `SiteConfig` shape with: `business`, `about`, `credentials`, `url`, `slug`, `features`, `cta`, `services`, `serviceAreas`. These properties are missing from the generated config.
- **`app/layout.tsx` imports `vegaRegistry`** from `@platform/themes/corvus`. The scaffolder doesn't update this import to reflect the corvus theme's actual registry export. The corvus theme exports `corvusRegistry` not `vegaRegistry`.
- **Implicit `any` types** in page components — the theme's page layouts lack TypeScript types on `.map()` callbacks, causing `noImplicitAny` violations.

## Summary

| Stage                  | Status               | Notes                                                    |
| ---------------------- | -------------------- | -------------------------------------------------------- |
| Stage 1: Clone         | PASS (with warnings) | Pages cloned, QA visual comparison skipped due to timing |
| Stage 2: Extract Theme | PASS (with warnings) | Theme package assembled; typography scale incomplete     |
| Stage 3: Scaffold      | PARTIAL              | Site created and dev server started; fails type-check    |

## Pipeline Bugs Found (for tracking)

1. **Clone QA**: Dev server readiness check too short — Playwright connects before server is ready
2. **Section style extraction**: 20s timeout too short for pages with heavy external resources; needs retry or longer timeout
3. **Scaffold site.config.ts**: Generated config uses brief structure, not `SiteConfig` shape — pages can't compile
4. **Scaffold layout.tsx**: Imports `vegaRegistry` hardcoded from base-template; should use corvus theme registry
5. **Theme page types**: Extracted page layouts don't add TypeScript types to `.map()` callbacks

## Token Usage (estimated)

| Phase                             | Model  | Approx cost |
| --------------------------------- | ------ | ----------- |
| Phase 1: Archive (4 haiku agents) | haiku  | ~$0.03      |
| Phase 2-3: Delete + verify        | haiku  | ~$0.002     |
| Phase 4: Brief creation           | sonnet | ~$0.01      |
| Phase 5: Pipeline + analysis      | sonnet | ~$0.10      |
| Phase 6: Final verify             | haiku  | ~$0.002     |
| **Total**                         |        | **~$0.14**  |
