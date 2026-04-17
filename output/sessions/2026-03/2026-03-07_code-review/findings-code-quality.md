# Code Quality Review Findings

**Reviewer:** cs-code-reviewer
**Scope:** Full monorepo scan of `packages/` (core-components, theme-system, intake-system, themes) and `sites/` (base-template, dj-fox-electrical, colossus-scaffolding, showcase). Checked against project standards in `docs/standards/components.md`, `docs/standards/content.md`, and `docs/standards/styling.md`. Ran `pnpm lint` (passed clean). Manual analysis for default exports, `any` types, `console.log`, hardcoded colors, inline styles, code duplication, and content schema completeness.
**Date:** 2026-03-07

## Summary

The codebase is in solid shape -- ESLint passes clean across all workspaces, no TypeScript `any` types were found in production code, and site-level components correctly use named exports. The primary issues are: (1) hardcoded neutral Tailwind colors (`text-gray-*`, `bg-gray-*`) across policy pages and the showcase site that bypass theme tokens, (2) a default export in `packages/core-components` violating the named-export-only rule, (3) `console.log` statements in production-path code within `packages/core-components` analytics modules, and (4) identical `mdx-components.tsx` files between base-template and dj-fox-electrical representing code duplication that should be extracted.

## Findings

### [MEDIUM] CQ-001: Default export in accent-underline.tsx

- **File:** `packages/core-components/src/components/ui/accent-underline.tsx` (line 88)
- **Issue:** The file exports both a named export (`export const AccentUnderline`) and a default export (`export default AccentUnderline`). The project standard requires named exports only for UI components. The `core-components/CLAUDE.md` explicitly states "Named exports only (no default exports)".
- **Impact:** Inconsistent import patterns; consumers may use `import AccentUnderline` instead of `import { AccentUnderline }`, making refactoring harder.
- **Fix:** Remove line 88 (`export default AccentUnderline;`). Verify no consumers import it as a default.
- **Effort:** trivial

### [MEDIUM] CQ-002: Inline styles in accent-underline.tsx

- **File:** `packages/core-components/src/components/ui/accent-underline.tsx` (lines 60-65)
- **Issue:** Uses `style={{}}` with four inline CSS properties for underline styling. While it references `var(--color-brand-primary)` for the color (good), the approach bypasses Tailwind. The styling standard says "NO inline styles (`style={{}}` properties)".
- **Impact:** Cannot be overridden via Tailwind utilities; inconsistent styling approach.
- **Fix:** Replace with Tailwind classes: `underline decoration-brand-primary decoration-[4px] underline-offset-[8px]`. If dynamic thickness/offset is needed, consider CSS custom properties set via a wrapper class in globals.css.
- **Effort:** small

### [MEDIUM] CQ-003: console.log in Analytics.tsx (production-reachable)

- **File:** `packages/core-components/src/components/analytics/Analytics.tsx` (lines 75, 91, 102)
- **Issue:** `console.log` calls are guarded by `debugMode` but NOT by `process.env.NODE_ENV === "development"`. If a site enables `debugMode` in production, these log statements will fire in user browsers.
- **Impact:** Leaks analytics configuration details (GA4 ID, Facebook Pixel ID, Google Ads ID) to browser console in production.
- **Fix:** Add `process.env.NODE_ENV === "development"` guard to each block, or ensure `debugMode` is never enabled in production builds.
- **Effort:** trivial

### [MEDIUM] CQ-004: console.log in analytics library modules (unconditional in some paths)

- **File:** `packages/core-components/src/lib/analytics/google-ads.ts` (lines 114, 140)
- **Issue:** `console.log("Google Ads conversion tracked successfully:", responseData)` and `console.log("Prepared client-side conversion data:", conversionEvent)` are not gated by any environment or debug check.
- **Impact:** Logs conversion data to console in production, exposing tracking implementation details.
- **Fix:** Wrap in `if (process.env.NODE_ENV === "development")` or remove entirely.
- **Effort:** trivial

### [MEDIUM] CQ-005: console.log in rate-limiter.ts (production path)

- **File:** `packages/core-components/src/lib/rate-limiter.ts` (line 154)
- **Issue:** `console.log("[Rate Limiter] Request denied", {...})` runs unconditionally on every rate-limited request in production. This is server-side so not user-visible, but pollutes server logs with unstructured output.
- **Impact:** Noisy server logs; should use a structured logger or at minimum be behind a debug flag.
- **Fix:** Replace with a proper logging utility, or gate with `process.env.NODE_ENV === "development"`. The `console.error` on line 168 for actual errors is acceptable.
- **Effort:** small

### [MEDIUM] CQ-006: console.log in instrumentation.ts (both sites)

- **File:** `sites/colossus-scaffolding/instrumentation.ts` (line 15), `sites/base-template/instrumentation.ts` (line 15)
- **Issue:** `console.log("NewRelic instrumentation loaded")` fires on every cold start in production. While harmless, it adds noise to production logs.
- **Impact:** Minor log pollution on every serverless cold start.
- **Fix:** Remove or gate behind `process.env.NODE_ENV === "development"`.
- **Effort:** trivial

### [HIGH] CQ-007: Hardcoded neutral colors in colossus privacy-policy and cookie-policy pages

- **File:** `sites/colossus-scaffolding/app/privacy-policy/page.tsx` (23 occurrences), `sites/colossus-scaffolding/app/cookie-policy/page.tsx` (17 occurrences)
- **Issue:** Extensive use of `text-gray-600`, `text-gray-700`, `text-gray-900`, `bg-gray-50` instead of theme tokens (`text-surface-foreground`, `text-surface-muted-foreground`, `bg-surface-muted`). The styling standard explicitly bans hardcoded color classes.
- **Impact:** These pages will not re-theme when the site's brand is changed. On a dark theme, gray text on a dark background would be unreadable.
- **Fix:** Replace all `text-gray-*` with `text-surface-foreground` or `text-surface-muted-foreground`; replace `bg-gray-50` with `bg-surface-muted`. Total ~40 replacements across both files.
- **Effort:** medium

### [LOW] CQ-008: Hardcoded neutral colors in showcase site

- **File:** `sites/showcase/components/BrandInjectorModal.tsx`, `sites/showcase/components/ElementBrowser.tsx`, `sites/showcase/components/ElementCard.tsx`, `sites/showcase/app/layout.tsx`, `sites/showcase/app/compare/page.tsx`, `sites/showcase/app/elements/[slug]/page.tsx`, `sites/showcase/app/page.tsx` (38+ total occurrences)
- **Issue:** Extensive use of `text-gray-*`, `bg-gray-*` hardcoded Tailwind neutral classes throughout the showcase site.
- **Impact:** Lower severity since showcase is an internal development tool, not a client-facing white-label site. However, it sets a bad precedent and the showcase site itself demonstrates themes -- it should eat its own dog food.
- **Fix:** Replace with theme tokens where applicable. Since showcase has its own theming context for previewing, some hardcoded values in the chrome/shell may be intentional.
- **Effort:** medium

### [LOW] CQ-009: Hardcoded `text-gray-*` in dj-fox-electrical USAGE_EXAMPLES.tsx

- **File:** `sites/dj-fox-electrical/components/ui/USAGE_EXAMPLES.tsx` (lines 258, 301, 356)
- **Issue:** Uses `text-gray-700` and `bg-gray-50` in example code.
- **Impact:** Low -- this is a documentation/example file, not rendered in production pages. But if copy-pasted into real components, it propagates the anti-pattern.
- **Fix:** Update examples to use theme tokens to prevent copy-paste propagation.
- **Effort:** trivial

### [MEDIUM] CQ-010: Identical mdx-components.tsx between base-template and dj-fox-electrical

- **File:** `sites/base-template/mdx-components.tsx` (276 lines), `sites/dj-fox-electrical/mdx-components.tsx` (276 lines)
- **Issue:** These two files are byte-for-byte identical (diff produces zero output). This is 276 lines of duplicated code. Colossus has already extracted its MDX overrides into `components/mdx/html-overrides.tsx`, showing the pattern for deduplication.
- **Impact:** Bug fixes or styling changes must be applied to both files independently; divergence is inevitable.
- **Fix:** Extract the shared MDX component definitions into `packages/core-components` (or a dedicated MDX package), then have each site's `mdx-components.tsx` re-export from the shared source. Note: `mdx-components.tsx` itself must remain per-site as a default export (Next.js requirement), but its contents can delegate to shared code.
- **Effort:** medium

### [MEDIUM] CQ-011: Identical contact route between base-template and dj-fox-electrical

- **File:** `sites/base-template/app/api/contact/route.ts` (346 lines), `sites/dj-fox-electrical/app/api/contact/route.ts` (346 lines)
- **Issue:** These files are byte-for-byte identical (diff produces zero output). Meanwhile, colossus-scaffolding has a different implementation (285 lines, `.tsx` extension), meaning there are two divergent implementations of the same feature with no shared code.
- **Impact:** Security fixes, rate limiting changes, or validation updates must be applied to all three files. The colossus version has already diverged in structure and imports.
- **Fix:** Extract the contact form handler logic into a shared utility in `packages/core-components` that each site's route calls with site-specific configuration (business email, business name, theme colors). Each site keeps its `route.ts` but it becomes a thin wrapper.
- **Effort:** large

### [MEDIUM] CQ-012: Identical analytics track route between base-template and colossus-scaffolding

- **File:** `sites/base-template/app/api/analytics/track/route.ts`, `sites/colossus-scaffolding/app/api/analytics/track/route.ts`
- **Issue:** These files are byte-for-byte identical (diff produces zero output). DJ Fox does not have this route at all, creating inconsistency.
- **Impact:** Analytics tracking behavior changes require updating multiple files. DJ Fox may be missing analytics tracking capability.
- **Fix:** Extract shared analytics tracking logic to `packages/core-components`. Each site re-exports or wraps the shared handler.
- **Effort:** medium

### [LOW] CQ-013: Hardcoded `text-yellow-400` for star ratings across sites

- **File:** `sites/colossus-scaffolding/app/reviews/page.tsx` (lines 46, 75, 83), `sites/colossus-scaffolding/app/projects/page.tsx` (line 117), `sites/base-template/app/projects/page.tsx` (line 119), `sites/dj-fox-electrical/app/projects/page.tsx` (line 119), `packages/core-components/src/components/ui/star-rating.tsx` (lines 66, 76)
- **Issue:** Star rating color `text-yellow-400` is hardcoded in 7+ locations across the codebase rather than using a theme token. The `text-gray-200` fallback for empty stars is also hardcoded.
- **Impact:** Star rating color cannot be customized per site. Minor since yellow stars are a universal convention, but the empty-star `text-gray-200` will break on dark themes.
- **Fix:** Define a `semantic-rating` or `semantic-star` token in the theme system, or at minimum replace `text-gray-200` with `text-surface-muted` for the empty star state.
- **Effort:** small

### [LOW] CQ-014: Content standard documents `services.cards` but schema defines `services.items`

- **File:** `docs/standards/content.md` (line 123), `packages/core-components/src/lib/content-schemas.ts` (line 233)
- **Issue:** The content standard shows location frontmatter with `services.cards` containing objects with `title` and `href`. The actual Zod schema defines `services.items` containing objects with `title`, `description`, `link`, and `icon`. The actual MDX files use `services.title` + `services.description` + `services.items` structure.
- **Impact:** Developers following the documentation will write invalid frontmatter that fails validation.
- **Fix:** Update `docs/standards/content.md` to match the actual schema in `content-schemas.ts`.
- **Effort:** trivial

## Statistics

- Critical: 0
- High: 1
- Medium: 8
- Low: 5
- Total: 14
