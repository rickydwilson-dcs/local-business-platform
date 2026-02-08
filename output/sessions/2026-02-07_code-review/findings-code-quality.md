# Code Quality Review Findings

**Reviewer:** cs-code-reviewer
**Scope:** Full codebase review of `sites/` (base-template, colossus-reference, smiths-electrical-cambridge) and `packages/` (core-components, theme-system, intake-system). Checked for: named export violations, missing TypeScript prop interfaces, console.log in production code, unused/dead code, content-schema completeness, code duplication between sites, and TypeScript `any` types.
**Date:** 2026-02-07

## Summary

The codebase has significant code duplication problems -- multiple lib files are copied verbatim across sites instead of being imported from core-components. There are also numerous `console.log` statements in production API routes and library code that should use a structured logger or be removed. The `services-data.ts` file in core-components is a centralized data file that contradicts the MDX-only content architecture. The content-schemas have silently diverged between sites, creating a maintenance risk.

## Findings

### [HIGH] CQ-001: content-schemas.ts duplicated across all sites instead of re-exporting from core-components

- **File:** `sites/base-template/lib/content-schemas.ts` (all 797 lines), `sites/smiths-electrical-cambridge/lib/content-schemas.ts` (all 797 lines)
- **Issue:** The `content-schemas.ts` file is duplicated verbatim in both `base-template` and `smiths-electrical-cambridge` (both are identical copies at 797 lines each). The canonical source is `packages/core-components/src/lib/content-schemas.ts`. These site files should re-export from core-components rather than maintaining full copies. Previous code review batch 4 was supposed to have addressed this.
- **Impact:** Schema changes in core-components will not propagate to sites unless all copies are manually updated. Schemas will silently diverge over time.
- **Fix:** Replace site-level `content-schemas.ts` files with re-exports: `export * from '@platform/core-components/lib/content-schemas';`
- **Effort:** small

### [HIGH] CQ-002: content-schemas.ts has silently diverged between colossus-reference and base-template

- **File:** `sites/colossus-reference/lib/content-schemas.ts` (lines 127-221) vs `sites/base-template/lib/content-schemas.ts` (lines 242-365)
- **Issue:** The `LocationFrontmatterSchema` differs between colossus-reference and base-template. Colossus uses `hero.title`/`hero.description`/`hero.phone` with a required (non-optional) hero object. Base-template uses `hero.heading`/`hero.subheading` with an optional hero object and nested `cta` sub-object. This means the same schema name validates against different structures depending on which site you are in.
- **Impact:** Content created for one site may fail validation in another. The "single source of truth" principle is violated. The core-components canonical version matches colossus, leaving base-template and smiths-electrical-cambridge with an incompatible schema.
- **Fix:** Reconcile the LocationFrontmatterSchema across all sites and core-components. Decide on one canonical shape, update all location MDX frontmatter to match, and then have sites re-export from core-components.
- **Effort:** medium

### [HIGH] CQ-003: content.ts duplicated across all three sites with near-identical logic

- **File:** `sites/base-template/lib/content.ts` (570 lines), `sites/smiths-electrical-cambridge/lib/content.ts` (570 lines), `sites/colossus-reference/lib/content.ts` (384 lines)
- **Issue:** `base-template` and `smiths-electrical-cambridge` have identical 570-line copies of `content.ts`. The `colossus-reference` version is a variant with colossus-specific sorting logic and location-slug filtering but shares the same blog/project/testimonial utility functions (~250 lines identical). `packages/core-components/src/lib/content.ts` also exists with the colossus-specific version. Three copies of the same utility code exist with minor variations.
- **Impact:** Bug fixes or new content utility functions must be applied in 3-4 places manually. High risk of drift.
- **Fix:** Move the generic content utilities (blog, projects, testimonials functions) to core-components. Allow sites to import and optionally override the `getContentItems` function for site-specific sorting/filtering.
- **Effort:** medium

### [HIGH] CQ-004: services-data.ts in core-components violates MDX-only content architecture

- **File:** `packages/core-components/src/lib/services-data.ts` (lines 1-157)
- **Issue:** This file is a centralized TypeScript data structure containing hardcoded service descriptions, badges, images, and features for 19 scaffolding services. The project CLAUDE.md and content standards explicitly prohibit centralized data files: "NO `lib/services.ts`", "No centralized TypeScript data structures". The file comment itself notes it was "migrated from services-data.ts to comply with MDX-only architecture" but the file still exists.
- **Impact:** Creates a dual-source-of-truth for service data. Content editors updating MDX frontmatter may not realize there is a parallel TypeScript data file. Breaks the architectural principle that content is managed only through MDX files.
- **Fix:** Verify all data from `services-data.ts` has been migrated to MDX frontmatter fields (badge, features, subtitle, image), then delete the file. Update any imports to read from MDX content instead.
- **Effort:** medium

### [HIGH] CQ-005: Validator files duplicated across all three sites and core-components

- **File:** `sites/*/lib/validators/` (4 files each: `index.ts`, `types.ts`, `readability-validator.ts`, `seo-validator.ts`, `uniqueness-validator.ts`)
- **Issue:** All three sites contain identical copies of the validator library (5 files each, 15 files total). The canonical versions also exist in `packages/core-components/src/lib/validators/`. This is 4 copies of the same code.
- **Impact:** Any validator improvements or bug fixes must be replicated across 4 locations. Drift has likely already occurred.
- **Fix:** Delete the site-level validator copies and import from `@platform/core-components`. The validator scripts (`scripts/validate-quality.ts`) should reference the package version.
- **Effort:** small

### [MEDIUM] CQ-006: console.log statements in production API routes

- **File:** `sites/base-template/app/api/contact/route.ts` (lines 154, 180-181), `sites/smiths-electrical-cambridge/app/api/contact/route.ts` (lines 154, 180-181), `sites/colossus-reference/app/api/contact/route.tsx` (lines 164-170, 189)
- **Issue:** Contact form API routes contain `console.log` calls that log submission data (name, email, service, location) in production. While `next.config.ts` strips `console.log` from client-side bundles, server-side API routes (route handlers) are NOT processed by the SWC compiler's `removeConsole` option -- these logs execute in production Node.js runtime.
- **Impact:** PII (customer names, email addresses) is logged to production server output. This creates GDPR compliance concerns and potential information disclosure.
- **Fix:** Replace with a structured logger that respects log levels, or guard with `process.env.NODE_ENV === 'development'` checks. For the contact route specifically, remove PII from log output.
- **Effort:** small

### [MEDIUM] CQ-007: console.log in core-components library code (non-debug-guarded)

- **File:** `packages/core-components/src/lib/rate-limiter.ts` (line 84), `packages/core-components/src/lib/performance-tracker.ts` (line 118), `packages/core-components/src/lib/analytics/google-ads.ts` (lines 113, 137), `packages/core-components/src/lib/analytics/facebook.ts` (line 174), `packages/core-components/src/lib/analytics/ga4.ts` (line 147)
- **Issue:** Multiple `console.log` calls in core library code are not guarded by a development-mode check. The `rate-limiter.ts` logs on every request when Supabase is not configured. The analytics files log response data in some paths without checking `NODE_ENV`. While `dataLayer.ts` (line 62) correctly guards its log with `if (process.env.NODE_ENV === "development")`, these other files do not follow the same pattern.
- **Impact:** Unnecessary log noise in production. The rate limiter log fires on every API request when Supabase is not configured, which could be every request in development/staging.
- **Fix:** Guard all `console.log` calls with `process.env.NODE_ENV === "development"` or use a configurable debug flag like the `debugMode` parameter already used in `Analytics.tsx`.
- **Effort:** small

### [MEDIUM] CQ-008: anchor-text.ts duplicated across all three sites and core-components

- **File:** `sites/base-template/lib/anchor-text.ts`, `sites/colossus-reference/lib/anchor-text.ts`, `sites/smiths-electrical-cambridge/lib/anchor-text.ts`, `packages/core-components/src/lib/anchor-text.ts`
- **Issue:** Four copies of the same `anchor-text.ts` utility file exist. The canonical version is in core-components.
- **Impact:** Bug fixes or improvements must be applied in 4 places.
- **Fix:** Delete site-level copies and import from `@platform/core-components`.
- **Effort:** trivial

### [MEDIUM] CQ-009: csrf.ts duplicated across sites

- **File:** `sites/base-template/lib/csrf.ts`, `sites/smiths-electrical-cambridge/lib/csrf.ts`, `packages/core-components/src/lib/security/csrf.ts`
- **Issue:** The CSRF utility is duplicated in base-template and smiths-electrical-cambridge. Colossus-reference has its own version at `lib/security/csrf.ts`. The canonical version exists in core-components at `src/lib/security/csrf.ts`.
- **Impact:** CSRF security logic drift across sites. A vulnerability fix in one copy may not propagate to others.
- **Fix:** Delete site-level copies and import from `@platform/core-components`.
- **Effort:** trivial

### [MEDIUM] CQ-010: analytics/types.ts duplicated across sites

- **File:** `sites/base-template/lib/analytics/types.ts`, `sites/colossus-reference/lib/analytics/types.ts`, `sites/smiths-electrical-cambridge/lib/analytics/types.ts`
- **Issue:** Analytics type definitions are duplicated across all three sites. The canonical version exists in `packages/core-components/src/lib/analytics/types.ts`.
- **Impact:** Type definition changes in core-components do not propagate automatically to sites.
- **Fix:** Delete site-level copies and import types from `@platform/core-components`.
- **Effort:** trivial

### [MEDIUM] CQ-011: Inline styles in colossus-reference layout.tsx

- **File:** `sites/colossus-reference/app/layout.tsx` (lines 207, 214)
- **Issue:** The layout uses `style={{ position: "relative", width: 180, height: 48 }}` and `style={{ objectFit: "contain" }}` for the logo container. The styling standards document explicitly prohibits inline styles (`style={{}}`) and requires Tailwind CSS utilities.
- **Impact:** Bypasses the Tailwind-based styling system. These styles cannot be overridden by theme tokens or responsive utilities.
- **Fix:** Replace `style={{ position: "relative", width: 180, height: 48 }}` with `className="relative w-[180px] h-12"` and `style={{ objectFit: "contain" }}` with `className="object-contain"`.
- **Effort:** trivial

### [MEDIUM] CQ-012: Inline styles in core-components HeroV3 and CoverageMap

- **File:** `packages/core-components/src/components/hero/HeroV3.tsx` (lines 44, 52), `packages/core-components/src/components/ui/coverage-map.tsx` (lines 169, 208), `packages/core-components/src/components/ui/certificate-lightbox.tsx` (line 310)
- **Issue:** Multiple core components use inline `style={{}}` attributes. `HeroV3` uses it for background image URL and opacity. `CoverageMap` uses it for dimensions and positioning. These violate the "Tailwind CSS Only" styling standard.
- **Impact:** Styling is not themeable, not overridable via className, and inconsistent with the rest of the component library. Note: background-image URL and dynamic opacity may be legitimate exceptions since Tailwind cannot easily handle dynamic values from props.
- **Fix:** For the opacity in HeroV3, consider using Tailwind's opacity utilities with CSS custom properties. For coverage-map dimensions, use Tailwind classes (`h-full w-full`). For dynamic background images, inline style is an acceptable exception -- add a code comment noting why.
- **Effort:** small

### [MEDIUM] CQ-013: validate-quality.ts script duplicated between sites

- **File:** `sites/colossus-reference/scripts/validate-quality.ts`, `sites/base-template/scripts/validate-quality.ts`
- **Issue:** The content quality validation script is duplicated between colossus-reference and base-template. Both files are substantial (400+ lines).
- **Impact:** Validation logic improvements must be applied in both places.
- **Fix:** Move to a shared location (either `scripts/` at repo root or into core-components) and reference from site-level `package.json` scripts.
- **Effort:** small

### [LOW] CQ-014: TypeScript `any` type in core-components test file

- **File:** `packages/core-components/src/components/analytics/__tests__/Analytics.test.tsx` (line 14)
- **Issue:** Uses `any` type in the Script mock: `({ id, children, dangerouslySetInnerHTML, onLoad }: any)`. The project standard says to avoid `any` types and use TypeScript interfaces for all props.
- **Impact:** Low -- this is in a test file and the `any` is on a mock function parameter. However, it sets a bad precedent and could mask type errors in tests.
- **Fix:** Define a proper interface for the mock Script component props: `interface MockScriptProps { id?: string; children?: React.ReactNode; dangerouslySetInnerHTML?: { __html: string }; onLoad?: () => void; }`
- **Effort:** trivial

### [LOW] CQ-015: colossus-reference analytics library files duplicated from core-components

- **File:** `sites/colossus-reference/lib/analytics/dataLayer.ts`, `sites/colossus-reference/lib/analytics/google-ads.ts`, `sites/colossus-reference/lib/analytics/facebook.ts`, `sites/colossus-reference/lib/analytics/ga4.ts`, `sites/colossus-reference/lib/analytics/consent-schema.ts`
- **Issue:** The colossus-reference site maintains its own copies of analytics library files that also exist in `packages/core-components/src/lib/analytics/`. These appear to be near-identical copies with minor formatting differences (single vs double quotes).
- **Impact:** Analytics bug fixes or improvements in core-components will not automatically apply to colossus-reference.
- **Fix:** Delete the site-level analytics library files and import from `@platform/core-components`. If colossus-reference needs site-specific analytics configuration, use the config/options pattern rather than duplicating implementation files.
- **Effort:** small

### [LOW] CQ-016: colossus-reference has site-specific files that should be in core-components

- **File:** `sites/colossus-reference/lib/performance-tracker.ts`, `sites/colossus-reference/lib/image-config.ts`, `sites/colossus-reference/lib/schema.ts`, `sites/colossus-reference/lib/image.ts`
- **Issue:** Several utility files in colossus-reference have canonical counterparts in core-components (`packages/core-components/src/lib/performance-tracker.ts`, `packages/core-components/src/lib/image-config.ts`, `packages/core-components/src/lib/schema.ts`, `packages/core-components/src/lib/image.ts`). The site maintains its own copies rather than importing from the shared package.
- **Impact:** Divergence risk for shared utility logic.
- **Fix:** Audit each file pair for differences. Where identical, delete the site copy and import from core-components. Where different, determine if the differences are site-specific configuration or logic that should be merged upstream.
- **Effort:** small

### [LOW] CQ-017: mdx-components.tsx uses `export default` (framework-required but non-standard pattern)

- **File:** `sites/base-template/mdx-components.tsx` (line 266), `sites/smiths-electrical-cambridge/mdx-components.tsx` (line 266), `sites/colossus-reference/mdx-components.tsx` (line 955)
- **Issue:** These files use `export default mdxComponents` -- exporting a pre-built object as default. While `mdx-components.tsx` is a Next.js-mandated default export file, the component standard says to use named exports. The current pattern of `const mdxComponents = { ... }; export default mdxComponents;` could be changed to `export function useMDXComponents() { return { ... }; }` which is the documented Next.js pattern and uses a named export internally.
- **Impact:** Minimal -- this is a framework-mandated file. However, the colossus-reference version is 955 lines (significantly larger than the others at 266 lines), suggesting it contains component logic that should be extracted into separate named-export component files.
- **Fix:** For colossus-reference, extract the inline component definitions from `mdx-components.tsx` into separate files in `components/ui/` with named exports, then import them into `mdx-components.tsx`. Consider migrating all sites to the `useMDXComponents()` function pattern.
- **Effort:** medium (colossus-reference), trivial (others)

## Statistics

- Critical: 0
- High: 5
- Medium: 8
- Low: 4
- Total: 17

## Notes

- **Linting:** Unable to run `pnpm lint` due to Bash permission restrictions during this review session. The lint results should be obtained separately and any violations added to this report.
- **Scoping exemptions applied:** Default exports in `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `mdx-components.tsx`, route handlers, `next.config.ts`, `vitest.config.ts`, `playwright.config.ts`, and `tailwind.config.ts` were not flagged as they are framework-mandated patterns.
- **console.log in scripts/:** The `console.log` statements in `sites/*/scripts/` (validate-content.ts, validate-quality.ts, etc.) and `sites/*/e2e/` test files were not flagged because these are CLI tools and test suites, not production code.
- **Duplication theme:** The dominant finding is code duplication. Despite a previous batch 4 remediation that was supposed to centralize code into core-components, many site-level copies remain. A systematic sweep is needed to delete all site-level copies of files that have canonical versions in core-components.
