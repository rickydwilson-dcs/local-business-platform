# Performance Audit Findings

**Reviewer:** cs-frontend-engineer (performance mode)
**Scope:** sites/dj-fox-electrical-test
**Date:** 2026-04-19

## Findings

### [HIGH] PERF-001: `ImageGridSection` uses `fill` without a `sizes` prop

- **File:** `packages/core-components/src/components/composable/image-grid-section.tsx` (line 65)
- **Issue:** The `<Image>` component uses the `fill` prop but no `sizes` attribute is provided. Next.js Image defaults to `100vw`, which causes the browser to request a full-viewport-width image for every card. In a 3-column grid each card is approximately 33vw wide, so images are ~3x larger than necessary on desktop.
- **Impact:** On a 1440px viewport the browser requests a ~1440px-wide image per card instead of ~480px. ~3x wasted bandwidth per page load. Directly penalises LCP when `ImageGridSection` is above the fold.
- **Fix:** Add `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"` to the `<Image>` element.
- **Effort:** trivial

### [MEDIUM] PERF-002: `images.formats` not configured — AVIF not enabled

- **File:** `sites/dj-fox-electrical-test/next.config.ts`
- **Issue:** The `images` block does not set `formats`. The Next.js default is `['image/webp']`; AVIF is not enabled.
- **Impact:** AVIF achieves 40–50% smaller file sizes than WebP at equivalent quality. Measurable LCP and bandwidth improvements on a hero-heavy site.
- **Fix:** Add `formats: ['image/avif', 'image/webp']` to the `images` block.
- **Effort:** trivial

### [LOW] PERF-003: `compress` not explicitly set

- **File:** `sites/dj-fox-electrical-test/next.config.ts`
- **Issue:** The `compress` option is absent. Defaults to `true` for `next start` but undocumented and could silently disable in non-Vercel environments.
- **Impact:** Minimal risk on Vercel (edge compression applies), but worth making explicit.
- **Fix:** Add `compress: true` to `nextConfig`.
- **Effort:** trivial

### [LOW] PERF-004: `swcMinify` absent — informational only

- **File:** `sites/dj-fox-electrical-test/next.config.ts`
- **Issue:** `swcMinify` is absent. Correct for Next.js 13.4+ where it became the permanent default and the option was removed.
- **Impact:** None. SWC minification is active by default.
- **Fix:** No action required.
- **Effort:** n/a

## Statistics

- Critical: 0
- High: 1
- Medium: 1
- Low: 2
- Total: 4
