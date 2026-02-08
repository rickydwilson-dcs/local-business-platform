# Architecture Review Findings

**Reviewer:** cs-architect
**Scope:** Full monorepo architecture review covering MDX-only content compliance, dynamic routing, theme token usage, package boundaries, component placement, build config, and code duplication across all 3 sites (`colossus-reference`, `base-template`, `smiths-electrical-cambridge`) and 3 packages (`core-components`, `theme-system`, `intake-system`).
**Date:** 2026-02-07

## Summary

The platform's core architecture patterns (dynamic `[slug]` routing, Turborepo build ordering, theme token usage in components) are sound. However, the shared `core-components` package has become deeply contaminated with Colossus Scaffolding-specific business data, hardcoded service definitions, and legacy schema markup -- undermining the white-label architecture. Additionally, content-schemas and several utility files are duplicated across all three sites despite a canonical copy existing in core-components, with the colossus variant diverging structurally from base-template/smiths on the LocationFrontmatterSchema.

## Findings

### [CRITICAL] ARCH-001: Hardcoded Scaffolding Service Data in Shared Package

- **File:** `packages/core-components/src/lib/services-data.ts` (lines 1-156)
- **Issue:** The shared `core-components` package contains a `getServiceData()` function with a hardcoded map of 18 scaffolding-specific services (access-scaffolding, facade-scaffolding, birdcage-scaffolds, etc.) with descriptions, images, badges, and features. This violates the MDX-only content rule: "Never create centralized TypeScript data files."
- **Impact:** Non-scaffolding sites (e.g., smiths-electrical-cambridge) importing from core-components inherit scaffolding service data. This file acts as a centralized data structure that contradicts the platform's fundamental design principle of deriving all content from MDX frontmatter.
- **Fix:** Delete `services-data.ts`. Any component that needs service metadata should read it from MDX frontmatter via `getContentItems("services")` at build time, which already exists in `lib/content.ts`.
- **Effort:** medium

### [CRITICAL] ARCH-002: Hardcoded Service List in Shared Package

- **File:** `packages/core-components/src/lib/services.ts` (lines 1-27)
- **Issue:** Contains a hardcoded `services` array listing 16 scaffolding service slugs and names. This is a centralized TypeScript data file for content -- the exact pattern the architecture docs call out as a violation (`lib/services.ts`).
- **Impact:** Breaks MDX-only architecture. Any new site that does not offer scaffolding services would have incorrect service data available through this module. Even though it is not currently imported by other modules, it exists in the shared package and could be used inadvertently.
- **Fix:** Delete `services.ts`. Service listings should come from `getContentItems("services")` reading MDX files.
- **Effort:** small

### [CRITICAL] ARCH-003: Colossus Business Data Hardcoded in Shared Package

- **File:** `packages/core-components/src/lib/business-config.ts` (lines 1-116)
- **Issue:** Contains `colossusBusinessConfig` with Colossus Scaffolding's legal name, address, phone number, email, geo coordinates, credentials, social profiles, and service catalog. This is site-specific business data living in the shared component library.
- **Impact:** The white-label model requires each site to define its own business config. Having one client's data in the shared package creates confusion about the source of truth and could leak into other sites' schema markup. Each site already has its own `lib/business-config.ts` -- this copy in core-components serves no architectural purpose.
- **Fix:** Delete the core-components copy. Each site's `lib/business-config.ts` is the correct location for site-specific business data. If a shared type/interface is needed, export only the `BusinessConfig` type from core-components (which already happens via `schema-types.ts`).
- **Effort:** small

### [CRITICAL] ARCH-004: Hardcoded Colossus Schema.org Markup in Shared Package

- **File:** `packages/core-components/src/lib/schema.ts` (lines 1-135+)
- **Issue:** Contains `getOrganizationSchema()` and `getWebSiteSchema()` functions with hardcoded Colossus Scaffolding data: company name, legal name, address, phone, email, social profiles, area served, credentials, and service catalog. Although marked `@deprecated`, these functions are exported from the package barrel (`index.ts` line 75: `export * from "./lib/schema"`).
- **Impact:** Any site importing schema utilities from core-components gets Colossus-specific organization data. The deprecation notice suggests `getLocalBusinessSchema()` should be used instead, but the legacy exports remain active and available to all sites.
- **Fix:** Remove the hardcoded legacy schema functions. The configurable `getLocalBusinessSchema()` (which accepts a `BusinessConfig` parameter) is the correct pattern. Each site should call it with its own business config.
- **Effort:** medium

### [HIGH] ARCH-005: Content Schemas Duplicated Across All Sites Despite Core-Components Canonical

- **File:** `sites/colossus-reference/lib/content-schemas.ts` (468 lines), `sites/base-template/lib/content-schemas.ts` (797 lines), `sites/smiths-electrical-cambridge/lib/content-schemas.ts` (797 lines), `packages/core-components/src/lib/content-schemas.ts` (468 lines)
- **Issue:** Content validation schemas exist in four separate locations. The core-components package exports them via `index.ts` (line 74: `export * from "./lib/content-schemas"`), and all three site CHANGELOGs claim "Content schemas now imported from @platform/core-components." However, every site imports from its local `./content-schemas` (e.g., `sites/colossus-reference/lib/content.ts:11`), not from the package.
- **Impact:** Schema changes must be applied in four places. The colossus/core-components version and the base-template/smiths version have already diverged structurally (see ARCH-006). This creates validation inconsistency: the same MDX file could pass validation in one site but fail in another.
- **Fix:** Sites should import content-schemas from `@platform/core-components` as the CHANGELOGs already claim they do. Delete the local `lib/content-schemas.ts` from each site and update imports in `lib/content.ts` and `scripts/validate-content.ts` to use `@platform/core-components`.
- **Effort:** medium

### [HIGH] ARCH-006: LocationFrontmatterSchema Structural Divergence Between Sites

- **File:** `sites/colossus-reference/lib/content-schemas.ts` (lines 164-174) vs `sites/base-template/lib/content-schemas.ts` (lines 285-305)
- **Issue:** The `LocationFrontmatterSchema` hero object has different field names and structures:
  - **Colossus/core-components:** `hero.title`, `hero.description`, required `hero.phone`, optional `hero.ctaText`/`hero.ctaUrl`. Hero is required.
  - **Base-template/smiths:** `hero.heading`, `hero.subheading`, optional `hero.phone`, `hero.cta` (as `HeroCtaSchema` object with `label`/`href`), optional `hero.image`. Hero is optional.
- **Impact:** Location MDX files valid for colossus will fail validation for base-template and vice versa. This makes the base-template unreliable as a "gold-standard template for new sites" since its schema no longer matches the reference implementation.
- **Fix:** Reconcile the two schemas into a single canonical version. The base-template version (with `heading`/`subheading` and optional hero) is more generic and white-label friendly. Update colossus MDX frontmatter to match and migrate the core-components canonical copy.
- **Effort:** large

### [HIGH] ARCH-007: ServicesOverview Component Has Hardcoded Colossus Service Slugs

- **File:** `packages/core-components/src/components/ui/services-overview.tsx` (lines 7-16)
- **Issue:** The `homePageServices` array hardcodes 8 scaffolding-specific service slugs (access-scaffolding, facade-scaffolding, edge-protection, etc.) and the component renders "Our Scaffolding Services" as a heading and "View All Scaffolding Services" as a CTA. The index.ts barrel even notes this: "has hardcoded colossus slugs."
- **Impact:** Any site using this component will display scaffolding services regardless of their actual business. An electrical or plumbing site using this component would show empty results or incorrect content.
- **Fix:** Refactor to accept `services` and heading text as props, or have it dynamically read all services from MDX without filtering to a hardcoded list.
- **Effort:** medium

### [HIGH] ARCH-008: Scaffolding-Specific Content in 42 Core-Components Files

- **File:** 42 files across `packages/core-components/src/` (see below for key files)
- **Issue:** References to "scaffolding," "Colossus," scaffolding-specific service names, and scaffolding industry terminology appear in 42 source files within the shared package. Key violations beyond those already noted:
  - `lib/analytics/facebook.ts` (line 124, 288, 310): Hardcoded `"Scaffolding Services"` category
  - `lib/analytics/dataLayer.ts` (line 142): Hardcoded `category: "scaffolding"`
  - `lib/image-config.ts` (line 52): `scaffoldingImageConfig` export
  - `components/ui/large-feature-cards.tsx` (line 70): Hardcoded `"scaffolding services"` in title attribute
  - `lib/anchor-text.ts`: Scaffolding-specific anchor text utilities
- **Impact:** The shared component library is not truly white-label. Non-scaffolding sites that use these utilities will have incorrect analytics categories, image alt text, and content.
- **Fix:** Replace hardcoded business/industry references with configurable parameters. Analytics should use a site-level `BUSINESS_CATEGORY` config value. Image utilities should accept business name as a parameter.
- **Effort:** large

### [HIGH] ARCH-009: Content Utility Files Duplicated Across All Sites

- **File:** `sites/*/lib/content.ts`, `sites/*/lib/mdx.tsx`, `sites/*/lib/schema.ts`, `sites/*/lib/image.ts`, `sites/*/lib/csrf.ts`, `sites/*/lib/anchor-text.ts`
- **Issue:** Multiple `lib/` files are fully duplicated between base-template and smiths-electrical-cambridge (zero diff for `content.ts`, `mdx.tsx`, `schema.ts`, `image.ts`, `csrf.ts`). These are generic utilities with no site-specific customization, yet each site maintains its own copy.
- **Impact:** Bug fixes or improvements must be applied to every site independently. As the platform scales to more client sites, this O(n) maintenance burden becomes unsustainable. The base-template versions (569 lines for content.ts) also diverge from the core-components versions (383 lines), creating two parallel implementations.
- **Fix:** Extract generic utilities (`image.ts`, `csrf.ts`, `anchor-text.ts`) into core-components. For `content.ts`, `mdx.tsx`, and `schema.ts`, which have server-side dependencies (`fs/promises`), either move to core-components with appropriate documentation (they already work there since Next.js compiles them), or create a new `@platform/content-utils` package.
- **Effort:** large

### [MEDIUM] ARCH-010: Hardcoded County Slugs in Location Utility

- **File:** `sites/colossus-reference/lib/locations.ts` (line 36)
- **Issue:** `COUNTY_PAGE_SLUGS` is a hardcoded array `["east-sussex", "west-sussex", "kent", "surrey"]` used to distinguish county overview pages from town pages. Additionally, line 101-106 contains a hardcoded special case for "Hove" redirecting to Brighton.
- **Impact:** This utility is colossus-specific but uses a pattern that should be generic. If this utility were ever moved to core-components (or if another South East England site is created), the hardcoded counties and Hove special case would need modification. The MDX frontmatter already has `county` and `isCounty` fields that could drive this distinction.
- **Fix:** Derive county vs. town status from MDX frontmatter metadata (e.g., an `isCounty: true` field) rather than a hardcoded slug list. Move the Hove redirect logic to MDX frontmatter (e.g., `redirectTo: brighton`).
- **Effort:** medium

### [MEDIUM] ARCH-011: Facebook Analytics Hardcodes "Scaffolding Services" Category

- **File:** `packages/core-components/src/lib/analytics/facebook.ts` (lines 124, 288, 310)
- **Issue:** The Facebook Pixel analytics module hardcodes `content_category: "Scaffolding Services"` in conversion tracking (line 124) and the `FacebookEvents.lead()` and `FacebookEvents.viewContent()` utility functions (lines 288, 310). This is in the shared core-components package.
- **Impact:** An electrical services or plumbing site using this analytics module would report all Facebook conversions under "Scaffolding Services" category, corrupting analytics data.
- **Fix:** Accept `content_category` as a constructor parameter or read from site config. The `FacebookPixelAnalytics` constructor already accepts `pixelId` and `accessToken` -- add a `businessCategory` parameter.
- **Effort:** small

### [MEDIUM] ARCH-012: core-components image.ts Hardcodes "Colossus Scaffolding" Brand Name

- **File:** `packages/core-components/src/lib/image.ts` (visible from grep results, matches colossus reference copy at `sites/colossus-reference/lib/image.ts` lines 59, 63, 83, 86)
- **Issue:** The `generateImageAlt()` and `generateImageTitle()` functions in the core-components copy hardcode "Colossus Scaffolding" as the brand name in generated alt text and title attributes.
- **Impact:** Any site using these utilities from core-components gets "Colossus Scaffolding" in its image SEO attributes, damaging SEO for other sites.
- **Fix:** Accept the brand name as a parameter, or read it from site config. The base-template version already uses a generic `"Your Business"` placeholder with a TODO comment to replace it -- but neither approach is correct for a shared package. The function should require a `brandName` parameter.
- **Effort:** small

### [LOW] ARCH-013: CHANGELOG Claims Content-Schemas Imported from Core-Components (Inaccurate)

- **File:** `sites/colossus-reference/CHANGELOG.md` (line 24), `sites/smiths-electrical-cambridge/CHANGELOG.md` (line 23), `sites/base-template/CHANGELOG.md` (line 18)
- **Issue:** All three CHANGELOGs state "Content schemas now imported from @platform/core-components" but every site still imports from its local `./content-schemas` (confirmed by grep: `sites/*/lib/content.ts` all import from `'./content-schemas'`).
- **Impact:** Documentation is misleading. Engineers reading the CHANGELOG would believe the deduplication is complete when it is not.
- **Fix:** Either complete the migration (import from `@platform/core-components`) or correct the CHANGELOGs to reflect current state.
- **Effort:** trivial

### [LOW] ARCH-014: Default Export in core-components Type Declaration

- **File:** `packages/core-components/src/types/mdx-components.d.ts` (line 17)
- **Issue:** Contains `export default mdxComponents;` which is a default export. The component standards specify "Named exports only (no default exports)."
- **Impact:** Minor inconsistency. This is a type declaration file rather than a runtime module, so the practical impact is minimal. However, it sets a precedent that contradicts the naming convention.
- **Fix:** Change to a named export: `export { mdxComponents };`
- **Effort:** trivial

### [LOW] ARCH-015: scaffoldingImageConfig Export Name is Industry-Specific

- **File:** `packages/core-components/src/lib/image-config.ts` (line 52-78)
- **Issue:** The shared package exports `scaffoldingImageConfig` -- a named export that references a specific industry. The actual config values (image quality settings, responsive sizes) are generic and applicable to any business type (project photos, hero images, service images, team photos).
- **Impact:** Non-scaffolding sites importing this config would have a confusingly named variable. The values themselves are fine for any business.
- **Fix:** Rename to `imageConfig` or `siteImageConfig`. The quality and sizing values are industry-agnostic.
- **Effort:** trivial

## Statistics

- Critical: 4
- High: 5
- Medium: 3
- Low: 3
- Total: 15
