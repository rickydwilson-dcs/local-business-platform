# Performance Audit Findings

**Reviewer:** cs-frontend-engineer (performance mode)
**Scope:** /Users/rickywilson/Sites/local-business-platform/sites/dj-fox-electrical-test
**Date:** 2026-04-19

## Findings

### [Medium] PERF-001: Raw `<img>` tag in split hero bypasses Next.js image optimisation

- **File:** `packages/core-components/src/components/composable/hero-section.tsx` (line 246)
- **Issue:** Split layout variant uses raw `<img>` instead of `<Image>` from next/image
- **Impact:** No WebP/AVIF negotiation, no responsive srcset, no lazy loading
- **Fix:** Replace with `<Image fill sizes="(max-width: 1024px) 100vw, 50vw" />`
- **Effort:** small

### [Medium] PERF-002: `'use client'` on `not-found.tsx` for one window.history.back() call

- **File:** `sites/dj-fox-electrical-test/app/not-found.tsx` (line 1)
- **Issue:** Entire 404 page is client-only for a single event handler
- **Fix:** Extract GoBackButton as minimal client component
- **Effort:** small

### [Medium] PERF-003: `'use client'` on `Breadcrumbs` with no client-side logic

- **File:** `packages/core-components/src/components/ui/breadcrumbs.tsx` (line 1)
- **Issue:** No hooks, event handlers, or browser APIs — pure Link rendering
- **Fix:** Remove `'use client'` directive
- **Effort:** trivial

### [Medium] PERF-004: `'use client'` on `HeroWithImage` with no client-side logic

- **File:** `packages/core-components/src/components/ui/hero-with-image.tsx` (line 28)
- **Issue:** Uses only next/link, next/image, and pure string functions
- **Fix:** Remove `'use client'` directive
- **Effort:** small

### [Medium] PERF-005: `'use client'` on `CoverageStatsSection` with no client-side logic

- **File:** `packages/core-components/src/components/ui/coverage-stats-section.tsx` (line 1)
- **Issue:** Static array rendering, no browser dependencies
- **Fix:** Remove `'use client'` directive
- **Effort:** trivial

### [Medium] PERF-006: `'use client'` on `LocalSpecialistsBenefits` with no client-side logic

- **File:** `packages/core-components/src/components/ui/local-specialists-benefits.tsx` (line 1)
- **Issue:** Static JSX with inline SVGs, no browser dependencies
- **Fix:** Remove `'use client'` directive
- **Effort:** trivial

## Statistics

- Critical: 0
- High: 0
- Medium: 6
- Low: 0
- Total: 6
