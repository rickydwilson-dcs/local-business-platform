# Fixes Applied

**Date:** 2026-03-07
**Scope:** SEO-001, SEO-002, A11Y-001, SEC-001, A11Y-002
**Review session:** 2026-03-07_code-review

## Applied (Direct Fixes)

| ID       | Severity | Effort | File                                                                                                         | Notes                                                                                                                                                                                                                |
| -------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEO-001  | CRITICAL | small  | `sites/dj-fox-electrical/app/page.tsx`                                                                       | Added `metadata` export with title, description, OG, Twitter, canonical. Added LocalBusiness, WebSite, BreadcrumbList JSON-LD schemas.                                                                               |
| SEO-002  | CRITICAL | small  | `sites/base-template/app/page.tsx`                                                                           | Same pattern as SEO-001 — metadata export + 3 structured data schemas. Uses siteConfig values for template portability.                                                                                              |
| SEC-001  | HIGH     | small  | `package.json`, `pnpm-lock.yaml`                                                                             | Added `pnpm.overrides` for fast-xml-parser >=5.3.8, minimatch >=9.0.6, rollup >=4.59.0, axios >=1.13.5. Ran `pnpm install` — 6 packages added, 11 removed.                                                           |
| A11Y-002 | HIGH     | small  | `sites/base-template/components/ui/ContactForm.tsx`, `sites/dj-fox-electrical/components/ui/ContactForm.tsx` | Added `aria-required`, `aria-invalid`, `aria-describedby` to name/email/message inputs; `id` + `role="alert"` on error paragraphs; `role="alert"` on error banner. colossus-scaffolding already had ARIA attributes. |
| A11Y-001 | CRITICAL | medium | 31 page files across base-template (14), dj-fox-electrical (16), colossus-scaffolding (1)                    | Replaced `<main>` with `<div>` (preserving all className attributes). PageShell provides `<main id="main-content">` — pages no longer create a duplicate landmark.                                                   |

## Applied (Large Fixes via Sub-Agent)

| ID     | Severity | Effort | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Notes                                                                                                                      |
| ------ | -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| CQ-007 | HIGH     | medium | `sites/colossus-scaffolding/app/privacy-policy/page.tsx` — 73 hardcoded gray classes replaced with theme tokens; `sites/colossus-scaffolding/app/cookie-policy/page.tsx` — 56 hardcoded gray classes replaced; `tools/eslint/rules/no-hardcoded-tailwind-colors.mjs` — new ESLint rule; rule integrated into all 3 site ESLint configs. eslint-disable pairs added to all policy pages, ContactForm, and other intentional color patterns across all sites. | Semantic callout boxes (blue/green/purple/red/yellow) kept with eslint-disable comments. Rule prevents future regressions. |

## Stale (Code Changed Since Review)

_None_

## Failed (Verification Error)

_None_

## Skipped

_None_

## Final Verification (A11Y-001 + SEC-001 + A11Y-002 session)

- Type check: PASS (7/7 workspaces)
- Lint: PASS (5/5 workspaces, 0 violations)
- Build: PASS (6/6 workspaces)
- Unit tests: PASS (12/12 tasks)
- E2E smoke tests: PASS (base-template 7/7, colossus-scaffolding 7/7; dj-fox has pre-existing `--project=chromium` config issue unrelated to these changes)

## Changes Summary (cumulative)

```
 package.json                                             |   6 +-
 pnpm-lock.yaml                                           | 305 ++++++---
 sites/base-template/app/page.tsx                        |  78 +++-
 sites/base-template/app/about/page.tsx                  |   4 +-
 sites/base-template/app/blog/[slug]/page.tsx             |   4 +-
 sites/base-template/app/blog/page.tsx                   |   4 +-
 sites/base-template/app/contact/page.tsx                |   4 +-
 sites/base-template/app/cookie-policy/page.tsx          |   4 +-
 sites/base-template/app/locations/[slug]/page.tsx        |   4 +-
 sites/base-template/app/locations/page.tsx              |   4 +-
 sites/base-template/app/not-found.tsx                   |   4 +-
 sites/base-template/app/privacy-policy/page.tsx         |   4 +-
 sites/base-template/app/projects/[slug]/page.tsx         |   4 +-
 sites/base-template/app/projects/page.tsx               |   4 +-
 sites/base-template/app/reviews/page.tsx                |   4 +-
 sites/base-template/app/services/[slug]/page.tsx         |   4 +-
 sites/base-template/app/services/page.tsx               |   4 +-
 sites/base-template/components/ui/ContactForm.tsx       |  17 +-
 sites/colossus-scaffolding/app/about/page.tsx           |   4 +-
 sites/dj-fox-electrical/app/page.tsx                    |  77 +++
 sites/dj-fox-electrical/app/about/page.tsx              |   4 +-
 sites/dj-fox-electrical/app/blog/[slug]/page.tsx         |   4 +-
 sites/dj-fox-electrical/app/blog/page.tsx               |   4 +-
 sites/dj-fox-electrical/app/contact/page.tsx            |   4 +-
 sites/dj-fox-electrical/app/cookie-policy/page.tsx      |   4 +-
 sites/dj-fox-electrical/app/locations/[slug]/page.tsx    |   4 +-
 sites/dj-fox-electrical/app/locations/page.tsx          |   4 +-
 sites/dj-fox-electrical/app/not-found.tsx               |   4 +-
 sites/dj-fox-electrical/app/pricing/page.tsx            |   4 +-
 sites/dj-fox-electrical/app/privacy-policy/page.tsx     |   4 +-
 sites/dj-fox-electrical/app/projects/[slug]/page.tsx     |   4 +-
 sites/dj-fox-electrical/app/projects/page.tsx           |   4 +-
 sites/dj-fox-electrical/app/reviews/page.tsx            |   4 +-
 sites/dj-fox-electrical/app/services/[slug]/page.tsx     |   4 +-
 sites/dj-fox-electrical/app/services/page.tsx           |   4 +-
 sites/dj-fox-electrical/components/ui/ContactForm.tsx   |  16 +-
 37 files changed, ~400 insertions(+), ~230 deletions(-)
```
