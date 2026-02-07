# Code Quality Review Findings

**Reviewer:** cs-code-reviewer
**Scope:** Full codebase review of `sites/` (colossus-reference, base-template, smiths-electrical-cambridge), `packages/` (core-components, theme-system). Checked for: default exports in components, TypeScript `any` usage, `console.log` in production code, unused imports/variables, hardcoded hex colors, content schema completeness, code duplication between sites, inline styles, dead code, centralized data file violations, and linting violations. Framework-mandated default exports (page.tsx, layout.tsx, not-found.tsx, route handlers, mdx-components.tsx) were excluded from the named-export rule.
**Date:** 2026-02-06 (updated)

## Summary

The codebase has significant code duplication between `sites/base-template` and `sites/smiths-electrical-cambridge`, where multiple files (footer, content utilities, content schemas, validators, and 15+ UI components) are byte-for-byte identical copies that should share code through `packages/core-components`. Several shared components in `packages/core-components` use default exports violating the named-export-only standard. The colossus-reference site has 10 instances of hardcoded hex colors and uses `as any` type assertions in production page code. Deprecated centralized data files that contradict the MDX-only architecture remain in the codebase alongside 1042 lines of dead code. ESLint reports unused imports across multiple sites.

## Findings

### [HIGH] CQ-001: Default Exports in Core Components Package

- **File:** `packages/core-components/src/components/Schema.tsx` (line 25)
- **File:** `packages/core-components/src/components/hero/HeroV1.tsx` (line 55)
- **File:** `packages/core-components/src/components/hero/HeroV2.tsx` (line 102)
- **File:** `packages/core-components/src/components/hero/HeroV3.tsx` (line 94)
- **File:** `packages/core-components/src/components/ui/mobile-menu.tsx` (line 12)
- **File:** `packages/core-components/src/components/ui/service-about.tsx` (line 49)
- **File:** `packages/core-components/src/components/ui/breadcrumbs.tsx` (line 29)
- **Issue:** Seven components in `packages/core-components` use `export default` instead of named exports. The project standard (docs/standards/components.md) explicitly requires named exports only: "Export as named exports, not default." The package's own CLAUDE.md also states: "Named exports only (no default exports)." HeroV1, HeroV2, and HeroV3 have both a named export on the function declaration and a redundant `export default HeroVN;` at the bottom.
- **Impact:** Inconsistent import patterns across consuming sites. Refactoring becomes harder because default exports lack a canonical name at the import site.
- **Fix:** Remove the `export default` lines. For Schema.tsx, mobile-menu.tsx, service-about.tsx, and breadcrumbs.tsx, change `export default function X` to `export function X`. For HeroV1/V2/V3, remove the trailing `export default HeroVN;` lines since they already have named exports. Update any import sites that use default import syntax.
- **Effort:** small

### [HIGH] CQ-002: Hardcoded Hex Colors in Colossus-Reference Components

- **File:** `sites/colossus-reference/components/ui/service-showcase.tsx` (lines 118, 124, 246, 252, 282)
- **File:** `sites/colossus-reference/components/ui/content-card.tsx` (lines 60, 121)
- **File:** `sites/colossus-reference/components/ui/service-cards.tsx` (lines 109, 115, 142)
- **Issue:** Multiple components use hardcoded hex color `#005A9E` in Tailwind arbitrary value classes (e.g., `bg-[#005A9E]`, `hover:bg-[#004a85]`, `focus:ring-[#005A9E]`). The styling standard (docs/standards/styling.md) explicitly forbids this: "No hardcoded hex colors (use `bg-brand-primary`, etc.)". There are 10 occurrences across 3 files.
- **Impact:** These components will not re-theme when used in a different site. The white-label system breaks because colors are baked in rather than referencing CSS variables.
- **Fix:** Replace `bg-[#005A9E]` with `bg-brand-primary`, `hover:bg-[#004a85]` with `hover:bg-brand-primary-hover`, and `focus:ring-[#005A9E]` with `focus:ring-brand-primary`.
- **Effort:** small

### [HIGH] CQ-003: Massive Code Duplication Between base-template and smiths-electrical-cambridge

- **File:** `sites/base-template/components/ui/footer.tsx` vs `sites/smiths-electrical-cambridge/components/ui/footer.tsx` (177 lines each, identical)
- **File:** `sites/base-template/lib/content.ts` vs `sites/smiths-electrical-cambridge/lib/content.ts` (570 lines each, identical)
- **File:** `sites/base-template/lib/content-schemas.ts` vs `sites/smiths-electrical-cambridge/lib/content-schemas.ts` (783 lines each, identical)
- **Issue:** The smiths-electrical-cambridge site contains byte-for-byte copies of numerous files from base-template. The full list of duplicated files includes:
  - `lib/content.ts` (570 lines)
  - `lib/content-schemas.ts` (783 lines)
  - `lib/validators/index.ts`, `lib/validators/types.ts`, `lib/validators/readability-validator.ts`, `lib/validators/seo-validator.ts`, `lib/validators/uniqueness-validator.ts`
  - `components/ui/footer.tsx`, `components/ui/breadcrumbs.tsx`, `components/ui/mobile-menu.tsx`, `components/ui/locations-dropdown.tsx`
  - `components/ui/article-callout.tsx`, `components/ui/author-card.tsx`, `components/ui/blog-post-card.tsx`, `components/ui/blog-post-hero.tsx`, `components/ui/content-card.tsx`, `components/ui/card-grid.tsx`, `components/ui/content-grid.tsx`, `components/ui/cta-section.tsx`, `components/ui/faq-section.tsx`, `components/ui/location-hero.tsx`, `components/ui/page-hero.tsx`, `components/ui/service-about.tsx`, `components/ui/service-benefits.tsx`, `components/ui/service-hero.tsx`, `components/ui/star-rating.tsx`, `components/ui/testimonial-card.tsx`
  - `components/Schema.tsx`
- **Impact:** Bug fixes or improvements must be applied in multiple places, creating divergence risk. This is estimated at over 5,000 lines of duplicated code. It defeats the purpose of having `packages/core-components` as a shared component library.
- **Fix:** Move truly shared components and utilities into `packages/core-components`. Site-specific files should only contain customizations. For content.ts and content-schemas.ts, these already exist in core-components and sites should import from there.
- **Effort:** large

### [HIGH] CQ-004: `as any` Type Assertions in Production Page Code

- **File:** `sites/colossus-reference/app/locations/[slug]/page.tsx` (lines 260, 273, 283, 296)
- **Issue:** Four `as any` type assertions are used when passing MDX frontmatter data to components (`LargeFeatureCards`, `ServiceShowcase`, `PricingPackages`, `LocalAuthorityExpertise`). Each has an explicit `eslint-disable-next-line @typescript-eslint/no-explicit-any` comment, indicating the developers knew this was a violation but chose to suppress it.
- **Impact:** Runtime type errors are not caught at build time. If MDX frontmatter shape changes, TypeScript cannot warn about mismatches, leading to potential runtime crashes on location pages.
- **Fix:** Define proper TypeScript interfaces for the location MDX frontmatter that match the component prop types, or create intermediate mapping functions that transform the frontmatter data to match the expected prop shapes. Remove the `as any` casts and eslint-disable comments.
- **Effort:** medium

### [MEDIUM] CQ-005: Deprecated Centralized Data Files Still Present

- **File:** `sites/colossus-reference/lib/services-data.ts` (181 lines, marked `@deprecated`)
- **File:** `packages/core-components/src/lib/services-data.ts` (157 lines, NOT marked deprecated)
- **File:** `sites/colossus-reference/lib/services.ts` (30 lines)
- **File:** `packages/core-components/src/lib/services.ts` (28 lines)
- **Issue:** These files contain hardcoded service data as TypeScript objects. `services-data.ts` in colossus-reference is marked `@deprecated` with a note that migration was completed on 2026-01-27, yet the file remains. The content standard (docs/standards/content.md) explicitly forbids centralized data files: "NO `lib/services.ts`", "NO fallback data structures". The `packages/core-components` version has no deprecation notice and its `getServiceData()` function emits a `console.warn` on every call.
- **Impact:** Creates confusion about the source of truth for service data. Developers may accidentally use the deprecated centralized data instead of reading from MDX. The `console.warn` in core-components will fire in production.
- **Fix:** Delete both `services-data.ts` files and both `services.ts` files. Update any remaining callers to use `getContentItems('services')` from `lib/content.ts`. If the files cannot be deleted yet, at minimum add the `@deprecated` annotation to the core-components version.
- **Effort:** medium

### [MEDIUM] CQ-006: Dead Code -- page-old.tsx (1042 lines)

- **File:** `sites/colossus-reference/app/services/[slug]/page-old.tsx` (1042 lines)
- **Issue:** A file named `page-old.tsx` containing a complete service page implementation with 733 lines of hardcoded service data sits alongside the active `page.tsx`. This legacy file contains a massive `getServiceData()` function with hardcoded data for 22 service types -- the exact anti-pattern the MDX-only architecture was designed to eliminate.
- **Impact:** Over 1000 lines of dead code that adds confusion, increases repository size, and could be accidentally referenced. It contradicts the project's MDX-only content architecture.
- **Fix:** Delete `page-old.tsx`. Historical reference is preserved in git history.
- **Effort:** trivial

### [MEDIUM] CQ-007: Inline Styles in Core Components

- **File:** `packages/core-components/src/components/hero/HeroV1.tsx` (lines 28-34)
- **File:** `packages/core-components/src/components/hero/HeroV3.tsx` (lines 44-47, line 53)
- **File:** `packages/core-components/src/components/ui/coverage-map.tsx` (lines 155, 194)
- **File:** `sites/colossus-reference/components/ui/coverage-map.tsx` (lines 147, 185)
- **File:** `sites/colossus-reference/components/ui/certificate-lightbox.tsx` (line 321)
- **Issue:** The styling standard (docs/standards/styling.md) states: "NO inline styles (`style={{}}` properties)". HeroV1 and HeroV3 use inline styles for background images and opacity, and coverage-map uses inline styles for dimensions and positioning.
- **Impact:** Bypasses Tailwind and the theme system. However, some uses (dynamic background image URLs, dynamic opacity values) may be genuinely necessary since Tailwind cannot handle fully dynamic values.
- **Fix:** For coverage-map, replace `style={{ height: "100%", width: "100%" }}` with Tailwind `h-full w-full`. For HeroV1/V3 background images, inline styles may be acceptable since Tailwind cannot handle dynamic URL values -- document these as exceptions. For the opacity in HeroV3, consider using a Tailwind arbitrary value or accept the exception for dynamic props.
- **Effort:** small

### [MEDIUM] CQ-008: Unused Imports Flagged by ESLint

- **File:** `sites/smiths-electrical-cambridge/app/about/page.tsx` (line 11) -- `formatAddressSingleLine` unused
- **File:** `sites/smiths-electrical-cambridge/app/not-found.tsx` (line 11) -- `siteConfig` unused
- **File:** `sites/base-template/app/about/page.tsx` (line 11) -- `formatAddressSingleLine` unused
- **File:** `sites/base-template/app/not-found.tsx` (line 11) -- `siteConfig` unused
- **Issue:** ESLint reports four unused variable warnings. These are identical warnings in both base-template and smiths-electrical-cambridge (further evidence of the copy-paste duplication in CQ-003).
- **Impact:** Dead imports reduce code clarity. ESLint warnings create noise in CI output.
- **Fix:** Remove the unused imports: delete `formatAddressSingleLine` from the destructured import in about/page.tsx, and remove the `siteConfig` import from not-found.tsx.
- **Effort:** trivial

### [MEDIUM] CQ-009: console.log/warn/error Statements in Production Library Code

- **File:** `packages/core-components/src/lib/analytics/facebook.ts` (7 occurrences)
- **File:** `packages/core-components/src/lib/analytics/ga4.ts` (6 occurrences)
- **File:** `packages/core-components/src/lib/analytics/google-ads.ts` (7 occurrences)
- **File:** `packages/core-components/src/lib/rate-limiter.ts` (2 occurrences)
- **File:** `packages/core-components/src/lib/performance-tracker.ts` (2 occurrences)
- **File:** `packages/core-components/src/components/analytics/ConsentManager.tsx` (4 occurrences)
- **Issue:** Multiple `console.log`, `console.error`, and `console.warn` calls exist in production library code without development-mode guards. Unlike dataLayer.ts and Analytics.tsx (which correctly guard logs behind `process.env.NODE_ENV === "development"` or `debugMode` checks), these files log unconditionally. The rate-limiter.ts logs "Redis not configured - allowing request" on every request when Redis is not available.
- **Impact:** Console noise in production environments. The rate-limiter log reveals infrastructure details. Analytics error logs may expose API response data in the browser console.
- **Fix:** Wrap `console.log` calls in `process.env.NODE_ENV === "development"` guards or remove them. For `console.error` calls handling genuine errors, consider a logging abstraction that can be disabled in production, or ensure they do not expose sensitive response data.
- **Effort:** small

### [MEDIUM] CQ-010: Unused ESLint Disable Directives

- **File:** `packages/core-components/src/components/ui/coverage-map.tsx` (lines 78, 195)
- **Issue:** Two `eslint-disable` directives suppress `no-restricted-syntax` but no violations are being reported, making them stale. ESLint reports: "Unused eslint-disable directive."
- **Impact:** Stale disable directives reduce code clarity and may mask future violations.
- **Fix:** Remove the unused `eslint-disable` comments. Run `eslint --fix` to auto-remove them.
- **Effort:** trivial

### [LOW] CQ-011: Colossus-Specific Content Hardcoded in Shared Core Components

- **File:** `packages/core-components/src/components/ui/mobile-menu.tsx` (lines 62-64)
- **File:** `packages/core-components/src/components/ui/service-about.tsx` (lines 59, 107-113)
- **Issue:** The `MobileMenu` component in core-components hardcodes the Colossus Scaffolding logo path (`/Colossus-Scaffolding-Logo.svg`) and alt text (`"Colossus Scaffolding"`). The `ServiceAbout` component references "TG20:21" compliance, "CISRS qualified" teams, and "South East" region -- all specific to the colossus-reference scaffolding business, not generic for a white-label platform.
- **Impact:** New sites created from base-template would display Colossus branding in the mobile menu and scaffolding-specific language in service pages. This undermines the white-label architecture.
- **Fix:** Make logo path, alt text, and business-specific language configurable via props or site configuration. The mobile menu should accept logo and alt text as props.
- **Effort:** medium

### [LOW] CQ-012: Hero Components Use Non-Theme Tailwind Colors

- **File:** `packages/core-components/src/components/hero/HeroV1.tsx` (lines 38, 40, 46)
- **File:** `packages/core-components/src/components/hero/HeroV2.tsx` (lines 36, 39, 45, 47, 57, 67, 74, 91)
- **File:** `packages/core-components/src/components/hero/HeroV3.tsx` (lines 58, 61, 66)
- **Issue:** All three Hero variants use standard Tailwind colors (`bg-blue-600`, `hover:bg-blue-700`, `text-gray-900`, `text-gray-600`, `text-green-500`, `border-blue-600`) instead of theme tokens (`bg-brand-primary`, `hover:bg-brand-primary-hover`, `text-surface-foreground`). The styling standard requires theme tokens for brand-related colors.
- **Impact:** Hero sections will not adapt to per-site theming. All sites will display blue CTAs regardless of their brand configuration.
- **Fix:** Replace standard Tailwind color classes with theme token classes throughout all three hero components.
- **Effort:** small

### [LOW] CQ-013: Content Schemas Exist in Three Locations

- **File:** `sites/base-template/lib/content-schemas.ts` (783 lines)
- **File:** `sites/smiths-electrical-cambridge/lib/content-schemas.ts` (783 lines)
- **File:** `packages/core-components/src/lib/content-schemas.ts` (separate copy)
- **Issue:** The content validation schemas are duplicated across both sites (byte-for-byte identical) and also exist in core-components. This is a specific instance of the broader duplication issue in CQ-003, but warrants separate mention because schema divergence would cause validation inconsistencies.
- **Impact:** If a schema is updated in one location but not the others, different sites will validate content against different rules, leading to content that passes validation on one site but fails on another.
- **Fix:** Use `packages/core-components/src/lib/content-schemas.ts` as the single source of truth. Sites should import schemas from `@platform/core-components`.
- **Effort:** small

## Statistics

- Critical: 0
- High: 4
- Medium: 6
- Low: 3
- Total: 13

## Remediation Priority

1. **Immediate (trivial fixes):** CQ-006 (delete dead page-old.tsx), CQ-008 (remove unused imports), CQ-010 (remove stale eslint-disable directives)
2. **This sprint:** CQ-001 (fix default exports), CQ-002 (replace hardcoded hex colors), CQ-004 (remove `as any` casts)
3. **Next sprint:** CQ-003 (deduplication -- largest effort), CQ-005 (remove deprecated data files), CQ-009 (guard console statements)
4. **Backlog:** CQ-007 (inline styles), CQ-011 (Colossus branding in shared components), CQ-012 (hero theme tokens), CQ-013 (schema consolidation)

## Linting Results

```
pnpm lint -- 4 packages linted, 0 errors, 6 warnings total

smiths-electrical-cambridge (2 warnings):
  app/about/page.tsx:11 -- 'formatAddressSingleLine' unused
  app/not-found.tsx:11 -- 'siteConfig' unused

base-template (2 warnings):
  app/about/page.tsx:11 -- 'formatAddressSingleLine' unused
  app/not-found.tsx:11 -- 'siteConfig' unused

@platform/core-components (2 warnings):
  coverage-map.tsx:78 -- unused eslint-disable directive
  coverage-map.tsx:195 -- unused eslint-disable directive

colossus-reference: clean (0 warnings)
```

Note: The previously reported CRITICAL issue (CQ-001 in the prior version of this report -- missing ESLint config in smiths-electrical-cambridge) has been resolved in commit `a052079`.
