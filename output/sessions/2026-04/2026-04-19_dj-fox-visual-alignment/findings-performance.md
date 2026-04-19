# Performance Audit Findings

**Reviewer:** cs-frontend-engineer (performance mode)
**Scope:** /Users/rickywilson/Sites/local-business-platform/sites/dj-fox-electrical-test
**Date:** 2026-04-19

---

## Findings

### [Medium] PERF-001: Raw `<img>` tag in split hero bypasses Next.js image optimisation

- **File:** `packages/core-components/src/components/composable/hero-section.tsx` (line 199)
- **Issue:** The non-image-background split hero variant renders a raw `<img>` element when `layout.align === "split"`. It bypasses Next.js image optimisation entirely — no format negotiation (WebP/AVIF), no responsive `srcset`, no lazy loading, no size hints.
- **Impact:** Split-layout hero images will be served at full original resolution/format, adding unnecessary KBs to initial page weight and delaying LCP when that image is above the fold.
- **Fix:** Replace the `<img>` with `next/image` `<Image>` using `fill` + `sizes="(max-width: 1024px) 100vw, 50vw"` inside the existing `relative aspect-video overflow-hidden rounded-xl` wrapper.
- **Effort:** small

---

### [Medium] PERF-002: `'use client'` on `HeroSection` with no client-side logic

- **File:** `packages/core-components/src/components/ui/hero-section.tsx` (line 1)
- **Issue:** `HeroSection` is marked `'use client'` but contains zero hooks, zero event handlers, and zero browser API calls. It is a pure rendering function.
- **Impact:** Forces the entire component sub-tree into the client bundle, adding unnecessary JS weight and preventing server-side streaming of this section.
- **Fix:** Remove the `'use client'` directive. The component uses only `next/link`, `next/image`, and `@/lib/image` — all safe on the server.
- **Effort:** trivial

---

### [Medium] PERF-003: `'use client'` on `LocalSpecialistsBenefits` with no client-side logic

- **File:** `packages/core-components/src/components/ui/local-specialists-benefits.tsx` (line 1)
- **Issue:** Hard-codes a static `benefits` array and renders it as plain JSX with inline SVG icons. No hooks, no event handlers, no browser globals.
- **Impact:** All JSX and inline SVG paths shipped to the client unnecessarily. Should be zero-JS server output.
- **Fix:** Remove the `'use client'` directive.
- **Effort:** trivial

---

### [Medium] PERF-004: `'use client'` on `CoverageStatsSection` with no client-side logic

- **File:** `packages/core-components/src/components/ui/coverage-stats-section.tsx` (line 1)
- **Issue:** Hard-codes a static `stats` array and renders a grid. No hooks, no event handlers, no browser globals.
- **Impact:** Unnecessary client bundle contribution for a component that could be fully server-rendered.
- **Fix:** Remove the `'use client'` directive.
- **Effort:** trivial

---

### [Medium] PERF-005: `'use client'` on `CountyGatewayCards` with no client-side logic

- **File:** `packages/core-components/src/components/ui/county-gateway-cards.tsx` (line 1)
- **Issue:** Only renders `Link` elements and SVG icons with no hooks, state, or browser API calls.
- **Impact:** County card JSX (including embedded SVG paths) shipped to client bundle unnecessarily.
- **Fix:** Remove the `'use client'` directive. `next/link` is safe in Server Components.
- **Effort:** trivial

---

### [Medium] PERF-006: `'use client'` on `Breadcrumbs` with no client-side logic

- **File:** `packages/core-components/src/components/ui/breadcrumbs.tsx` (line 1)
- **Issue:** Consists entirely of `Link` elements and inline SVG chevron/home icons. No hooks or event handlers.
- **Impact:** Every page that renders `Breadcrumbs` pulls the component into the client bundle unnecessarily.
- **Fix:** Remove the `'use client'` directive.
- **Effort:** trivial

---

### [Medium] PERF-007: `'use client'` on `HeroWithImage` with no client-side logic

- **File:** `packages/core-components/src/components/ui/hero-with-image.tsx` (line 28)
- **Issue:** Uses only `next/link`, `next/image`, and a pure string helper (`getImageUrl`). No hooks, no event handlers, no browser globals.
- **Impact:** Full-bleed hero with background image is forced into the client bundle on every page that uses it, including the homepage LCP path.
- **Fix:** Remove the `'use client'` directive. `getImageUrl` is a pure string function safe on the server.
- **Effort:** small

---

### [Low] PERF-008: Entire `not-found.tsx` is a client component for one `window.history.back()` call

- **File:** `sites/dj-fox-electrical-test/app/not-found.tsx` (line 1)
- **Issue:** The full 404 page is `'use client'` to support `onClick={() => window.history.back()}` on one button. All other content (heading, contact links, popular pages grid, Lucide icons) is static.
- **Impact:** Static 404 page content is forced into the client bundle instead of being server-rendered HTML. Low traffic impact but is an avoidable pattern.
- **Fix:** Extract the "Go Back" button into a minimal `GoBackButton` client component (~5 lines). Remove `'use client'` from `not-found.tsx`.
- **Effort:** small

---

## Items with No Issues Found

**Image `sizes` prop on `fill` images:** All three `fill` usages in composable components have correct `sizes` props — `hero-section.tsx` line 66 (`sizes="100vw"`), `blog-grid.tsx` line 105, `image-grid-section.tsx` line 69.

**PNG bitmaps in `public/`:** No PNG or JPEG files exist under `public/`. Only `public/logo.svg` and `public/README.md` are present.

**`next.config.ts` bundle hints:** `images.formats: ["image/avif", "image/webp"]` is set. `compress: true` is set. `swcMinify` is correctly absent — it is the default in Next.js 15+ and omitting it is correct.

**Critical CSS / unused font families:** `app/globals.css` declares `font-family` only for Outfit, matching `theme.config.ts` `typography.fontFamily`. No external `@import url()` Google Fonts calls — font is loaded via `next/font/google` in `layout.tsx` (correct per platform standards).

**Third-party `<Script>` tags:** `app/layout.tsx` contains no `<Script>` tags. No script loading strategy issues.

---

## Statistics

- Critical: 0
- High: 0
- Medium: 7
- Low: 1
- Total: 8
