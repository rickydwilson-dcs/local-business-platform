# Architecture Review Findings

**Reviewer:** cs-architect
**Scope:** Full monorepo architecture review -- sites (base-template, colossus-scaffolding, dj-fox-electrical, showcase), packages (core-components, theme-system, themes, intake-system), build config (turbo.json), and cross-cutting concerns (content system, theme tokens, package boundaries, code duplication).
**Date:** 2026-03-07

## Summary

The platform's foundational architecture is sound: dynamic routing is correctly implemented across all sites, no static content page files exist, and the MDX-only content rule is respected. However, there is significant code duplication across sites that undermines the monorepo's value proposition. Three files (`content.ts`, `mdx.tsx`, `schema.ts`) are copy-pasted across sites with minor variations instead of being consumed from `@platform/core-components`. Additionally, the shared `coverage-map` component in core-components contains hardcoded hex colors that break the white-label contract.

## Findings

### [HIGH] ARCH-001: content.ts duplicated across all three sites instead of using shared package

- **File:** `sites/base-template/lib/content.ts` (579 lines), `sites/colossus-scaffolding/lib/content.ts` (383 lines), `sites/dj-fox-electrical/lib/content.ts` (570 lines)
- **Issue:** Each site maintains its own `lib/content.ts` with the same core logic (reading MDX files, parsing frontmatter, content type functions like `getServices()`, `getLocations()`, `getBlogPosts()`, etc.). A shared version exists at `packages/core-components/src/lib/content.ts` but no site imports from it. base-template and dj-fox-electrical are nearly identical (570-579 lines, differences limited to a location-slug filter and hero image field name). Colossus diverged further (383 lines) but implements the same core `getContentItems()` pattern.
- **Impact:** Bug fixes or improvements to content reading must be applied three times. Drift between implementations creates inconsistent behavior across sites (e.g., the `heroImage` vs `image` field handling already differs).
- **Fix:** Consolidate into `@platform/core-components/lib/content.ts`. Site-specific variations (location slug filtering, image field preferences) should be handled via configuration parameters or composable wrappers, not copy-paste forks.
- **Effort:** medium

### [HIGH] ARCH-002: Hardcoded hex colors in shared coverage-map component

- **File:** `packages/core-components/src/components/ui/coverage-map.tsx` (lines 94-100, 211-215)
- **Issue:** The `CoverageMap` component hardcodes county-to-color mappings using raw hex values (`"#2563eb"`, `"#059669"`, `"#dc2626"`, `"#7c3aed"`, `"#4DB2E4"`). These colors are injected as inline styles into Leaflet DivIcon HTML strings. An eslint-disable comment acknowledges the violation but does not resolve it.
- **Impact:** This is a shared component in core-components that all sites consume. The hardcoded colors bypass the theme system entirely -- they will not adapt when a site changes its brand palette, breaking the white-label guarantee for any site using the coverage map.
- **Fix:** Accept county colors as a prop (e.g., `countyColors?: Record<string, string>`) with defaults derived from theme tokens. Alternatively, use CSS custom properties injected via the theme system (e.g., `var(--color-map-county-1)`) so sites can override them in `theme.config.ts`.
- **Effort:** small

### [HIGH] ARCH-003: mdx-components.tsx identical in base-template and dj-fox-electrical

- **File:** `sites/base-template/mdx-components.tsx` (276 lines), `sites/dj-fox-electrical/mdx-components.tsx` (276 lines)
- **Issue:** These two files are byte-for-byte identical (0 lines of diff). The MDX component mapping -- which defines how `<h2>`, `<p>`, `<a>`, `<img>`, and custom components render inside MDX content -- is duplicated rather than shared. Colossus has a stripped-down 66-line version, suggesting it was independently reimplemented.
- **Impact:** Any styling or component changes to MDX rendering must be applied in multiple places. The three different implementations risk visual inconsistency across sites for the same MDX content.
- **Fix:** Extract the common MDX component map to `@platform/core-components` as a shared default. Sites can extend or override specific components if needed, but the base mapping should be single-sourced.
- **Effort:** medium

### [HIGH] ARCH-004: schema.ts duplicated identically in base-template and dj-fox-electrical

- **File:** `sites/base-template/lib/schema.ts` (419 lines), `sites/dj-fox-electrical/lib/schema.ts` (419 lines)
- **Issue:** These two files are byte-for-byte identical (0 lines of diff). They contain JSON-LD schema generation logic (LocalBusiness, BreadcrumbList, FAQPage, etc.). A shared `schema.ts` exists in `packages/core-components/src/lib/schema.ts` (229 lines) but the site-level copies are nearly double its size, containing additional generators not yet extracted to the package.
- **Impact:** Schema.org generation changes must be applied twice. As new sites are created from the template, the duplication multiplies.
- **Fix:** Merge the additional schema generators from the site-level files into `@platform/core-components/lib/schema.ts`. Site-level files should be thin wrappers (like `image.ts`) that inject site-specific config.
- **Effort:** medium

### [MEDIUM] ARCH-005: ContactForm.tsx duplicated across all three sites with significant divergence

- **File:** `sites/base-template/components/ui/ContactForm.tsx` (333 lines), `sites/colossus-scaffolding/components/ui/ContactForm.tsx` (379 lines), `sites/dj-fox-electrical/components/ui/ContactForm.tsx` (319 lines)
- **Issue:** Each site has its own ContactForm with the same core structure (name/email/phone/message fields, CSRF protection, validation, submission to `/api/contact`). The implementations have diverged: colossus is 379 lines vs dj-fox at 319 lines (627 diff lines between base-template and colossus). This component handles critical business functionality (lead capture).
- **Impact:** Security patches (e.g., CSRF handling, input sanitization), UX improvements, or validation changes must be applied three times and tested independently. A bug in one copy may not be fixed in others.
- **Fix:** Extract a shared `ContactForm` to `@platform/core-components` with configuration props for site-specific field labels, required fields, and styling tokens. Site-specific customizations should be handled through props, not forked implementations.
- **Effort:** medium

### [MEDIUM] ARCH-006: contact API route duplicated identically across sites

- **File:** `sites/base-template/app/api/contact/route.ts` (346 lines), `sites/dj-fox-electrical/app/api/contact/route.ts` (346 lines), `sites/colossus-scaffolding/app/api/contact/route.tsx` (285 lines)
- **Issue:** The contact form API handler is identical between base-template and dj-fox-electrical (0 diff lines). Colossus has a variant (route.tsx) that reads theme colors for email templates but otherwise implements the same logic: rate limiting, CSRF validation, input sanitization, Resend email dispatch.
- **Impact:** Security-critical server code (rate limiting, CSRF, email sending) is maintained in three places. A vulnerability fix in one copy could be missed in others.
- **Fix:** Extract the contact route handler logic into a shared utility in `@platform/core-components/lib/api/contact.ts` that each site's thin route file calls with site-specific configuration (business email, theme colors for email templates).
- **Effort:** medium

### [MEDIUM] ARCH-007: CSRF token API route duplicated across sites

- **File:** `sites/base-template/app/api/csrf-token/route.ts` (39 lines), `sites/dj-fox-electrical/app/api/csrf-token/route.ts` (39 lines), `sites/colossus-scaffolding/app/api/csrf-token/route.ts` (62 lines)
- **Issue:** base-template and dj-fox are identical. Colossus has a longer variant (62 lines). All three implement the same CSRF token generation endpoint.
- **Impact:** Security-critical code duplicated. Changes to CSRF token generation need to be propagated manually.
- **Fix:** The CSRF validation logic already lives in `@platform/core-components/lib/security/csrf.ts`. The route handler itself is thin enough that a shared factory function could eliminate the duplication.
- **Effort:** small

### [MEDIUM] ARCH-008: colossus-scaffolding uses dual config pattern (site.config.ts + business-config.ts)

- **File:** `sites/colossus-scaffolding/lib/business-config.ts`, `sites/colossus-scaffolding/site.config.ts`
- **Issue:** Colossus maintains a separate `business-config.ts` that duplicates business identity data (name, legal name, phone, email, address) alongside the standard `site.config.ts`. The `contact-info.ts` imports from `business-config.ts` instead of `site.config.ts` (unlike base-template and dj-fox which import from `site.config`). The `schema.ts` also imports from `business-config.ts`.
- **Impact:** Two sources of truth for business data in one site. When updating business info, an editor must know to update `business-config.ts` (not just `site.config.ts`), creating a maintenance trap. New sites created from this pattern will inherit the inconsistency.
- **Fix:** Consolidate all business data into `site.config.ts` (the platform standard). Remove `business-config.ts` and update `contact-info.ts` and `schema.ts` imports to use `siteConfig`.
- **Effort:** small

### [MEDIUM] ARCH-009: contact-info.ts and site.ts duplicated with minor variations

- **File:** `sites/*/lib/contact-info.ts` (92-136 lines each), `sites/*/lib/site.ts`
- **Issue:** `contact-info.ts` appears in all three sites with the same structure (phone formatting, address constants, helper functions) but varies in import source (site.config vs business-config) and phone formatting logic. `site.ts` provides URL utilities (`absUrl()`) with different implementations across sites (base-template uses `siteConfig.url`, colossus/dj-fox use `process.env.NEXT_PUBLIC_SITE_URL`).
- **Impact:** Utility functions that should behave identically across all sites have silently diverged.
- **Fix:** Extract `contact-info.ts` utilities (phone formatting, address formatting) into `@platform/core-components` as functions that accept `siteConfig` as a parameter. Standardize `site.ts` URL resolution in one shared implementation.
- **Effort:** small

### [LOW] ARCH-010: image.ts wrapper pattern should read brand name from site.config

- **File:** `sites/base-template/lib/image.ts` (line 17), `sites/dj-fox-electrical/lib/image.ts` (line 16)
- **Issue:** Both files are thin wrappers around `@platform/core-components/lib/image` (good pattern), but hardcode the brand name as a string constant (`'Your Business'` in base-template, `'D J Fox Electrical'` in dj-fox). The base-template even has a TODO comment: `// TODO: Replace with actual business name from site.config`.
- **Impact:** Minor -- brand name for image alt text must be manually updated per site instead of being read from the existing `siteConfig.business.name`.
- **Fix:** Import `siteConfig` and use `siteConfig.business.name` instead of the hardcoded string.
- **Effort:** trivial

### [LOW] ARCH-011: mdx.tsx duplicated between base-template and dj-fox-electrical

- **File:** `sites/base-template/lib/mdx.tsx` (179 lines), `sites/dj-fox-electrical/lib/mdx.tsx` (179 lines)
- **Issue:** These files are identical (0 diff lines). They handle MDX compilation with remark/rehype plugins and custom component injection. Colossus has a different 87-line implementation.
- **Impact:** MDX rendering configuration changes (e.g., adding a new remark plugin) must be applied in multiple places.
- **Fix:** Extract the core `loadMdx()` function to `@platform/core-components`. Sites can pass custom component overrides as a parameter.
- **Effort:** small

## Statistics

- Critical: 0
- High: 4
- Medium: 5
- Low: 2
- Total: 11
