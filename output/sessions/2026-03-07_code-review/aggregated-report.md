# Aggregated Code Review Report

**Date:** 2026-03-07
**Branch:** develop
**Scope:** full

---

## Executive Summary

| Severity  | Security | Code Quality | A11y/SEO | Architecture | **Total** |
| --------- | -------- | ------------ | -------- | ------------ | --------- |
| Critical  | 0        | 0            | 3        | 0            | **3**     |
| High      | 1        | 1            | 4        | 4            | **10**    |
| Medium    | 4        | 8            | 1        | 5            | **18**    |
| Low       | 3        | 5            | 4        | 2            | **14**    |
| **Total** | **8**    | **14**       | **12**   | **11**       | **45**    |

_4 findings fixed in Session 4 (A11Y-005, A11Y-006, A11Y-007, A11Y-009 — see [Fixed in Session 4](#fixed-in-session-4) below)_

**Immediate attention required:**
- **A11Y-001** — Duplicate `<main>` landmark on ~30 pages across all sites (WCAG 1.3.1 violation)
- **SEO-001/002** — Homepage metadata/structured data missing on DJ Fox and base-template (highest-traffic pages)
- **SEC-001** — 15 dependency vulnerabilities including 1 critical (fast-xml-parser in AWS SDK chain)

---

## Cross-Domain Issues

### 1. mdx-components.tsx Duplication (Code Quality + Architecture)

**Severity:** MEDIUM | **Files:** `sites/base-template/mdx-components.tsx`, `sites/dj-fox-electrical/mdx-components.tsx`

- **Finding IDs:** CQ-010, ARCH-003
- **Summary:** 276 lines byte-for-byte identical across two sites. Colossus has already extracted this pattern. Shared default should live in `@platform/core-components`.
- **Effort:** medium

### 2. Contact API Route Duplication (Code Quality + Architecture)

**Severity:** MEDIUM | **Files:** `sites/base-template/app/api/contact/route.ts`, `sites/dj-fox-electrical/app/api/contact/route.ts`, `sites/colossus-scaffolding/app/api/contact/route.tsx`

- **Finding IDs:** CQ-011, ARCH-006
- **Summary:** base-template and dj-fox are byte-for-byte identical (346 lines each); colossus has diverged. Security-critical code (rate limiting, CSRF, email) maintained in three places.
- **Effort:** large

---

## All Findings by Severity

### CRITICAL (3)

| ID       | Domain   | File                                                | Issue                                          |
| -------- | -------- | --------------------------------------------------- | ---------------------------------------------- |
| A11Y-001 | A11y/SEO | Multiple page components across all 3 sites         | Duplicate `<main>` landmark — PageShell already provides `<main>`, pages add another |
| SEO-001  | A11y/SEO | `sites/dj-fox-electrical/app/page.tsx`              | Homepage has no `metadata` export and no structured data |
| SEO-002  | A11y/SEO | `sites/base-template/app/page.tsx`                  | Same as SEO-001; base-template is the clone source — all new sites inherit this gap |

### HIGH (10)

| ID       | Domain       | File                                                          | Issue                                                              |
| -------- | ------------ | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| SEC-001  | Security     | `pnpm-lock.yaml`                                              | 15 dep vulnerabilities incl. 1 critical (fast-xml-parser GHSA-m7jm) |
| CQ-007   | Code Quality | `colossus-scaffolding/app/privacy-policy/page.tsx` (+ cookie) | 40 hardcoded `text-gray-*`/`bg-gray-*` classes bypass theme tokens |
| A11Y-002 | A11y/SEO     | `ContactForm.tsx` across all 3 sites                          | No `aria-invalid`, `aria-describedby`, `role="alert"` on errors   |
| SEO-003  | A11y/SEO     | `base-template` + `dj-fox` `locations/[slug]/page.tsx`        | Missing LocalBusiness schema on location pages (colossus has it)  |
| A11Y-003 | A11y/SEO     | `location-hero.tsx`, `faq-section.tsx`, blog slug page        | Decorative SVGs missing `aria-hidden="true"`                      |
| A11Y-004 | A11y/SEO     | `packages/core-components/src/components/ui/breadcrumbs.tsx`  | Hardcoded `text-slate-*` colors break dark themes and WCAG contrast |
| ARCH-001 | Architecture | `sites/*/lib/content.ts` (all 3 sites)                        | content.ts copy-pasted 3×; shared version in core-components unused |
| ARCH-002 | Architecture | `packages/core-components/src/components/ui/coverage-map.tsx` | Hardcoded hex colors break white-label theming in shared component |
| ARCH-003 | Architecture | `base-template/mdx-components.tsx` + `dj-fox/mdx-components.tsx` | Byte-for-byte identical 276-line files (see Cross-Domain #1) |
| ARCH-004 | Architecture | `base-template/lib/schema.ts` + `dj-fox/lib/schema.ts`        | Byte-for-byte identical 419-line schema generators |

### MEDIUM (20)

| ID       | Domain       | Issue Summary                                                          |
| -------- | ------------ | ---------------------------------------------------------------------- |
| SEC-002  | Security     | `CSRF_SECRET` missing from root + base-template + dj-fox `.env.example` |
| SEC-003  | Security     | `sites/showcase/next.config.ts` has zero security headers              |
| SEC-004  | Security     | NRQL injection in `tools/sync-external-services.ts` via unsanitized `appName` |
| SEC-005  | Security     | Analytics track endpoint (`/api/analytics/track`) lacks CSRF protection |
| CQ-001   | Code Quality | Default export in `packages/core-components/src/components/ui/accent-underline.tsx` |
| CQ-002   | Code Quality | Inline `style={{}}` in `accent-underline.tsx` bypasses Tailwind        |
| CQ-003   | Code Quality | `console.log` in `Analytics.tsx` — `debugMode` only, not NODE_ENV gated |
| CQ-004   | Code Quality | `console.log` unconditional in `google-ads.ts` (conversion data)       |
| CQ-005   | Code Quality | `console.log` unconditional in `rate-limiter.ts` (server-side noise)   |
| CQ-006   | Code Quality | `console.log` on every cold start in `instrumentation.ts` (both sites) |
| CQ-010   | Code Quality | Identical `mdx-components.tsx` in base-template + dj-fox (276 lines)  |
| CQ-011   | Code Quality | Identical contact route in base-template + dj-fox (346 lines)          |
| CQ-012   | Code Quality | Identical analytics track route in base-template + colossus             |
| SEO-004  | A11y/SEO     | Colossus `robots.ts` missing `/api/` disallow rule                     |
| SEO-005  | A11y/SEO     | Layout OG metadata incomplete (no image/url); fix covered by SEO-001/002 |
| ~~A11Y-005~~ | ~~A11y/SEO~~     | ~~LocationsDropdown lacks `role="menu"` and arrow-key keyboard navigation~~ — **Fixed in Session 4** |
| ~~A11Y-006~~ | ~~A11y/SEO~~     | ~~FAQ section renders static content; no accordion expand/collapse option~~ — **Fixed in Session 4** |
| SEO-007  | A11y/SEO     | Homepage h1 uses business name; could be more keyword-focused           |
| ARCH-005 | Architecture | `ContactForm.tsx` duplicated across all 3 sites with significant divergence |
| ARCH-006 | Architecture | Contact API route duplicated identically in base-template + dj-fox (see Cross-Domain #2) |
| ARCH-007 | Architecture | CSRF token route duplicated across 3 sites (base-template + dj-fox identical) |
| ARCH-008 | Architecture | Colossus dual-config pattern (`business-config.ts` + `site.config.ts`) |
| ARCH-009 | Architecture | `contact-info.ts` and `site.ts` utilities duplicated with silent divergence |

### LOW (16)

| ID       | Domain       | Issue Summary                                                             |
| -------- | ------------ | ------------------------------------------------------------------------- |
| SEC-006  | Security     | Email subject not HTML-escaped in colossus contact route                  |
| SEC-007  | Security     | CSRF replay set is in-memory (not distributed across serverless instances) |
| SEC-008  | Security     | Analytics debug endpoint catch blocks leak error messages                 |
| CQ-008   | Code Quality | Hardcoded gray colors throughout showcase site                            |
| CQ-009   | Code Quality | Hardcoded `text-gray-*` in dj-fox `USAGE_EXAMPLES.tsx`                   |
| CQ-013   | Code Quality | Hardcoded `text-yellow-400` for star ratings in 7+ locations              |
| CQ-014   | Code Quality | `docs/standards/content.md` documents `services.cards` but schema uses `services.items` |
| ~~A11Y-007~~ | ~~A11y/SEO~~     | ~~`userScalable` not explicitly set in base-template + dj-fox viewport~~ — **Fixed in Session 4** |
| A11Y-008 | A11y/SEO     | Phone SVG in mobile menu bottom CTA missing `aria-hidden="true"`          |
| SEO-008  | A11y/SEO     | Service page OG image alt text uses bare title (could include business name) |
| ~~A11Y-009~~ | ~~A11y/SEO~~     | ~~DJ Fox `#db0b0b` red borderline WCAG AA contrast (4.58:1) on white~~ — **Fixed in Session 4** (documented, no color change needed) |
| SEO-009  | A11y/SEO     | `/reviews` page missing from sitemap in all 3 sites                       |
| SEO-010  | A11y/SEO     | Colossus breadcrumbs conditional on frontmatter; no default fallback       |
| ARCH-010 | Architecture | `image.ts` hardcodes brand name instead of reading from `siteConfig`      |
| ARCH-011 | Architecture | `lib/mdx.tsx` identical in base-template + dj-fox (179 lines)             |

---

## Per-Domain Breakdown

### Security (8 findings)

**Key themes:** Solid baseline (no hardcoded secrets, comprehensive headers on prod sites, HMAC-signed CSRF). Main gaps are a critical dependency vulnerability, missing env example entries, and the showcase site having zero headers.

**Quick wins:**
- SEC-002 — Add `CSRF_SECRET` to 3 `.env.example` files (trivial)
- SEC-003 — Copy `headers()` function to `showcase/next.config.ts` (trivial)
- SEC-004 — Sanitize `appName` in NRQL query (trivial regex validation)
- SEC-008 — Move NODE_ENV check outside try-catch in debug endpoint (trivial)

**Priority fixes:**
- SEC-001 — Dependency audit remediation via `pnpm.overrides` (small, but has 1 critical CVE)
- SEC-005 — Add CSRF/Origin validation to analytics track endpoint (small)

---

### Code Quality (14 findings)

**Key themes:** ESLint passes clean, no `any` types in prod code. Primary debt is code duplication (contact route, mdx-components, analytics route) and `console.log` leakage in packages/core-components analytics modules.

**Quick wins:**
- CQ-001 — Remove default export from `accent-underline.tsx` (trivial)
- CQ-003/004/006 — Add NODE_ENV guards to console.log statements (trivial each)
- CQ-014 — Fix content.md documentation mismatch (trivial)

**Priority fixes:**
- CQ-007 — Replace ~40 hardcoded gray classes in colossus policy pages (medium)
- CQ-010/011/012 — Extract shared mdx-components, contact route, analytics route (medium/large)

---

### Accessibility & SEO (16 findings)

**Key themes:** Skip links, focus management, and aria on interactive components are good. Critical gaps are duplicate `<main>` landmarks (affects all pages), missing homepage metadata/schema, and form accessibility.

**Quick wins:**
- A11Y-003 — Add `aria-hidden="true"` to decorative SVGs (small)
- A11Y-004 — Replace hardcoded slate colors in breadcrumbs (trivial)
- A11Y-008 — Add `aria-hidden="true"` to phone SVG in mobile menu (trivial)
- SEO-004 — Add `/api/` disallow to colossus robots.ts (trivial)
- SEO-009 — Add `/reviews` to all 3 sitemaps (trivial)

**Priority fixes:**
- A11Y-001 — Remove `<main>` from all individual page components (medium, ~30 files)
- SEO-001/002 — Add metadata + Schema to both homepages (small)
- A11Y-002 — Add ARIA error attributes to ContactForm across 3 sites (small)
- SEO-003 — Add LocalBusiness schema to location pages in base-template + dj-fox (medium)

---

### Architecture (11 findings)

**Key themes:** Core architecture rules respected (dynamic routing, no static content files, no cross-site imports). The problem is code duplication — 4 files are copy-pasted across sites instead of being consumed from `@platform/core-components`. The shared coverage-map component also violates the theme token rule.

**Quick wins:**
- ARCH-002 — Accept county colors as prop in coverage-map (small)
- ARCH-007 — CSRF token route factory function (small)
- ARCH-008 — Remove colossus `business-config.ts` dual-config (small)
- ARCH-010 — Read brand name from `siteConfig` in `image.ts` wrappers (trivial)

**Priority fixes:**
- ARCH-001 — Consolidate `content.ts` into core-components (medium)
- ARCH-003/004 — Extract mdx-components + schema.ts to shared package (medium each)

---

## Recommended Remediation Order

### Immediate (High Impact, Low Effort)

1. **SEC-001** — `pnpm.overrides` for fast-xml-parser + other audited deps — _1 critical CVE_
2. **SEO-001 + SEO-002** — Homepage metadata + Schema components on dj-fox + base-template — _highest-traffic pages, small effort_
3. **A11Y-001** — Remove `<main>` from individual page components (~30 files) — _WCAG violation, mechanical change_
4. **SEC-002** — Add `CSRF_SECRET` to 3 `.env.example` files — _prevents intermittent 403s on new sites_
5. **SEC-003** — Add security headers to `showcase/next.config.ts` — _trivial copy-paste_
6. **A11Y-004** — Replace hardcoded slate colors in `breadcrumbs.tsx` — _trivial, affects all sites_

### This Sprint (High Impact)

7. **A11Y-002** — ARIA error attributes on ContactForm × 3 sites — _core user-facing path_
8. **SEO-003** — LocalBusiness schema on location pages (base-template + dj-fox) — _core platform SEO value_
9. **CQ-007** — Replace ~40 hardcoded gray classes in colossus policy pages — _breaks dark theming_
10. **SEC-004/005** — NRQL sanitization + analytics CSRF — _security hardening_
11. **CQ-003/004/005/006** — NODE_ENV gate all console.log in packages — _quick cluster of trivials_
12. **ARCH-008** — Remove colossus dual-config (`business-config.ts`) — _eliminates maintenance trap_
13. **ARCH-002** — Accept `countyColors` prop in `coverage-map.tsx` — _fixes theme violation in shared component_

### Next Sprint (Technical Debt)

14. **ARCH-001** — Consolidate `content.ts` into shared package — _high value, some complexity_
15. **ARCH-003/004 + CQ-010** — Extract mdx-components + schema.ts to core-components — _eliminates biggest duplication clusters_
16. **ARCH-005/006/007** — Shared ContactForm + contact route + CSRF route — _security-critical code in multiple places_
17. **CQ-013** — Theme token for star ratings — _small, scattered fix_
18. **SEO-009 + SEO-004** — Reviews in sitemaps, colossus robots.ts disallow — _trivial cluster_
19. **ARCH-009/011** — Extract `contact-info.ts` utilities + `mdx.tsx` — _completes deduplication_

---

## Fixed in Session 4

_Branch: `develop` (commit `0202d6c`) — 2026-03-08_

| ID | Fix Summary |
|---|---|
| A11Y-005 | Added `role="menu"`, `role="menuitem"`, arrow key navigation (ArrowDown/Up/Home/End), and focus-on-open to `LocationsDropdown` in `packages/core-components/src/components/ui/locations-dropdown.tsx` |
| A11Y-006 | Extracted `FAQAccordionItem` client component (`faq-accordion-item.tsx`) with accordion expand/collapse, `aria-expanded`, `aria-controls`/`aria-labelledby` pairing; `FAQSection` remains a Server Component |
| A11Y-007 | Added `userScalable: true` to viewport config in `sites/base-template/app/layout.tsx` and `sites/dj-fox-electrical/app/layout.tsx` |
| A11Y-009 | Verified `#db0b0b` passes WCAG AA (4.58:1 > 4.5:1 threshold); added contrast ratio documentation comment to `sites/dj-fox-electrical/theme.config.ts` — no color change required |

---

## Previously Fixed (Excluded from Counts)

All 59 findings from the 2026-02-07 review were resolved (verified 2026-02-19). No findings were re-reported in this review.

---

## Files

- `findings-security.md` — Full security review details
- `findings-code-quality.md` — Full code quality review details
- `findings-accessibility-seo.md` — Full accessibility and SEO review details
- `findings-architecture.md` — Full architecture review details

---

_Generated by parallel code review agents on 2026-03-07_
