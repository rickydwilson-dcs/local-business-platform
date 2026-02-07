# Architecture Review Findings

**Reviewer:** cs-architect
**Scope:** Full monorepo architecture review covering all three sites (base-template, colossus-reference, smiths-electrical-cambridge), all three packages (core-components, theme-system, intake-system), Turborepo configuration, and adherence to the documented architecture principles: MDX-only content, dynamic routing, theme token usage, package boundaries, and code deduplication.
**Date:** 2026-02-06

## Summary

The colossus-reference site contains several critical architecture violations, primarily around centralized TypeScript data files that duplicate what should be MDX-only content. There is also substantial code duplication across all three sites for core utilities (content.ts, content-schemas.ts, validators/, contact-info.ts) that belong in the shared packages/ layer. Additionally, hardcoded hex colors in colossus-reference components and the widespread use of a non-standard "brand-blue" theme alias break the white-label theming contract. The base-template and smiths-electrical-cambridge sites are structurally cleaner but still carry significant duplicated code.

## Findings

### [CRITICAL] ARCH-001: Centralized Service Data File Violates MDX-Only Rule

- **File:** `sites/colossus-reference/lib/services.ts` (lines 1-29)
- **Issue:** This file is a hardcoded TypeScript array of 15 service objects with slugs, names, and descriptions. The architecture explicitly states: "MDX is the single source of truth. Never create `lib/locations.ts` or `lib/services.ts`." Service data should be read dynamically from `content/services/*.mdx` files via `lib/content.ts`. Although no active imports of this file were found in app/ or components/ code, the file remains in the codebase and is also duplicated in `packages/core-components/src/lib/services.ts` (with a diverged list -- different entries like "suspended-scaffolding" and "public-access-staircases" vs "hangers-truss-outs-advanced-scaffolding" and "birdcage-scaffolds"). This divergence proves the data has already drifted.
- **Impact:** Creates a second source of truth for service data that has already diverged from both MDX content and the package copy. New services added via MDX will not appear in these lists, causing silent inconsistencies.
- **Fix:** Delete `sites/colossus-reference/lib/services.ts` and `packages/core-components/src/lib/services.ts`. Any code that needs service lists should call `getContentItems('services')` from `lib/content.ts`.
- **Effort:** small

### [CRITICAL] ARCH-002: Deprecated Services Data File Still Present with 180 Lines of Hardcoded Content

- **File:** `sites/colossus-reference/lib/services-data.ts` (lines 1-180)
- **Issue:** Despite being marked `@deprecated` with a migration date of 2026-01-27, this file still exists with 180 lines of hardcoded service metadata (descriptions, badges, images, features, subtitles) for 17 services. The `getServiceData()` function logs a deprecation warning at runtime but still returns data from an in-memory map. This file is also duplicated in `packages/core-components/src/lib/services-data.ts`. No active imports were found in current code (only the dead `page-old.tsx` file references it).
- **Impact:** The file's existence invites future developers to import it instead of reading MDX frontmatter. The deprecation warning would pollute server logs if called. The data may be stale relative to the actual MDX frontmatter values.
- **Fix:** Delete `sites/colossus-reference/lib/services-data.ts` and `packages/core-components/src/lib/services-data.ts`. Also delete `page-old.tsx` (see ARCH-005) which is the only remaining consumer.
- **Effort:** small

### [CRITICAL] ARCH-003: Town Locations Hardcoded in TypeScript Instead of Derived from MDX

- **File:** `sites/colossus-reference/lib/town-locations.ts` (lines 1-305)
- **Issue:** Contains a hardcoded array of 32 town locations with names, coordinates, counties, URLs, descriptions, and a `isRichContent` flag. This is content data that should be derivable from `content/locations/*.mdx` frontmatter. The architecture rule states: "Never create centralized TypeScript data structures." This data is also duplicated in `packages/core-components/src/lib/town-locations.ts`. The file is actively imported by `components/ui/coverage-map.tsx`.
- **Impact:** Adding a new location requires editing both an MDX file and this TypeScript file. If someone adds an MDX file without updating this list, the town won't appear on the coverage map. Geographic coordinates and county associations can drift from the MDX content.
- **Fix:** Add `coordinates`, `county`, and `description` fields to the location MDX frontmatter schema. Create a utility that reads location MDX files and builds the map data dynamically, replacing the hardcoded array. The existing `locations-config.ts` file already demonstrates the correct pattern (reading from the filesystem).
- **Effort:** medium

### [CRITICAL] ARCH-004: Locations Dropdown Hardcoded in TypeScript Instead of Derived from MDX

- **File:** `sites/colossus-reference/lib/locations-dropdown.ts` (lines 1-159)
- **Issue:** Contains a hardcoded copy of all 32+ locations organized by county for navigation dropdown rendering. This is actively imported by 5 components and 1 route handler: `components/ui/county-gateway-cards.tsx`, `components/ui/coverage-map.tsx`, `components/ui/locations-dropdown.tsx`, `components/ui/mobile-menu.tsx`, `components/ui/town-finder-section.tsx`, and `app/locations/page.tsx`. Also duplicated in `packages/core-components/src/lib/locations-dropdown.ts`.
- **Impact:** Same duplication risk as ARCH-003. There are now three sources of truth for location data: MDX files, `town-locations.ts`, and `locations-dropdown.ts`. Any change requires updating all three. The `RICH_TOWN_PAGES` array (lines 19-60) duplicates entries already in the `LOCATIONS_DROPDOWN` structure (lines 64-127), meaning even within this single file there is internal redundancy.
- **Fix:** Generate the dropdown structure dynamically from location MDX frontmatter using county metadata. The `getContentItems('locations')` function already reads all locations; extend it to group by county from frontmatter.
- **Effort:** medium

### [HIGH] ARCH-005: Stale page-old.tsx Left in Codebase

- **File:** `sites/colossus-reference/app/services/[slug]/page-old.tsx`
- **Issue:** A dead file containing an old version of the service page that calls a local `getServiceData()` function (hardcoded data lookup at lines 62, 767, 880). This file is not used by Next.js (only `page.tsx` is routed to), but it clutters the codebase and contains patterns that violate the architecture (inline service data maps).
- **Impact:** Misleading to developers who may reference or copy from this file. Adds dead code to the repository. Contains architecture anti-patterns that could be propagated.
- **Fix:** Delete `sites/colossus-reference/app/services/[slug]/page-old.tsx`.
- **Effort:** trivial

### [HIGH] ARCH-006: Hardcoded Hex Colors in Components Break White-Label Theming

- **Files:**
  - `sites/colossus-reference/components/ui/service-cards.tsx` (lines 109, 115, 142)
  - `sites/colossus-reference/components/ui/service-showcase.tsx` (lines 118, 124, 246, 252, 282)
  - `sites/colossus-reference/components/ui/content-card.tsx` (lines 60, 121)
- **Issue:** These components use hardcoded Tailwind arbitrary values like `bg-[#005A9E]`, `hover:bg-[#004a85]`, `focus:ring-[#005A9E]` instead of theme tokens. The color `#005A9E` is the Colossus brand primary color, which is already available as `bg-brand-primary` via the theme system. The architecture states: "Never hardcode hex colors (`bg-[#005A9E]`) -- they break white-labeling."
- **Impact:** If these components are copied to a new site (the platform's standard workflow for creating new clients), the hardcoded hex values would show Colossus branding instead of the new client's brand. This defeats the purpose of the theme system.
- **Fix:** Replace all `bg-[#005A9E]` with `bg-brand-primary`, `hover:bg-[#004a85]` with `hover:bg-brand-primary-hover`, and `focus:ring-[#005A9E]` with `focus:ring-brand-primary`. Total: approximately 11 instances across three files.
- **Effort:** small

### [HIGH] ARCH-007: Hardcoded Service-Location Combinations Instead of Dynamic Discovery

- **File:** `sites/colossus-reference/app/services/[slug]/[location]/page.tsx` (lines 35-38)
- **Issue:** The `LOCATION_SERVICES` constant hardcodes which service-location combinations exist: `{ "commercial-scaffolding": ["brighton", "canterbury", "hastings"], "residential-scaffolding": ["brighton", "canterbury", "hastings"] }`. The `generateStaticParams()` function (line 111) iterates this hardcoded map instead of dynamically discovering `content/services/{service}/{location}.mdx` files.
- **Impact:** Adding a new location-specific service page requires both creating the MDX file and updating this TypeScript mapping. Missing the code change means the page won't be generated at build time, even though the content file exists. This is exactly the kind of "no code changes needed" guarantee that the dynamic routing architecture is designed to provide.
- **Fix:** Replace `LOCATION_SERVICES` with a function that scans the `content/services/` directory for subdirectories and enumerates their MDX files, e.g., `const serviceSubdirs = await fs.readdir(SERVICES_DIR, { withFileTypes: true })` then list `.mdx` files in each subdirectory.
- **Effort:** small

### [HIGH] ARCH-008: content.ts Duplicated Across All Three Sites (~570 Lines Each)

- **Files:**
  - `sites/base-template/lib/content.ts` (570 lines)
  - `sites/colossus-reference/lib/content.ts` (384 lines)
  - `sites/smiths-electrical-cambridge/lib/content.ts` (570 lines)
  - `packages/core-components/src/lib/content.ts` (also exists)
- **Issue:** The core content reading utility is copy-pasted across all three sites. The base-template and smiths-electrical-cambridge versions are identical (570 lines each). The colossus-reference version is a diverged variant with additional location-filtering logic (lines 36-49, 83-103 with custom service sorting and location suffix filtering) but the same core functions. Sites are not importing from `@platform/core-components` for content utilities; they maintain their own copies.
- **Impact:** Bug fixes or feature additions to content reading must be applied to 3-4 copies. Divergence has already occurred (colossus-reference has custom sorting and location filtering that the other sites lack). As more sites are added, this duplication multiplies.
- **Fix:** Consolidate the generic content reading functions (`getContentItems`, `getContentItem`, `generateContentParams`, `getBlogPosts`, `getProjects`, `getTestimonials`, etc.) into `packages/core-components/src/lib/content.ts`. Allow site-specific customizations via configuration callbacks (e.g., custom sorting, filtering). Sites import from the package and pass site-specific config.
- **Effort:** medium

### [HIGH] ARCH-009: content-schemas.ts Duplicated Across All Three Sites

- **Files:**
  - `sites/base-template/lib/content-schemas.ts`
  - `sites/colossus-reference/lib/content-schemas.ts`
  - `sites/smiths-electrical-cambridge/lib/content-schemas.ts`
  - `packages/core-components/src/lib/content-schemas.ts`
- **Issue:** The Zod validation schemas for MDX frontmatter are duplicated in all three sites plus core-components. The base-template and smiths versions are identical. The colossus version has slight differences in ImagePathSchema (references `colossus-reference/` paths vs generic `site-name/` paths). These schemas define the contract for content validation and should be centralized.
- **Impact:** Schema changes (e.g., adding a new required field) must be applied 4 times. Inconsistencies between sites mean content validated for one site may fail on another. The type exports (`BlogFrontmatter`, `ProjectFrontmatter`, etc.) are used throughout each site and would benefit from a single canonical source.
- **Fix:** Consolidate into `packages/core-components/src/lib/content-schemas.ts` with configurable options (e.g., site-name prefix for image paths). Sites import and optionally extend.
- **Effort:** medium

### [HIGH] ARCH-010: Validator Framework Duplicated Across Three Sites

- **Files:**
  - `sites/base-template/lib/validators/` (5 files: index.ts, types.ts, readability-validator.ts, seo-validator.ts, uniqueness-validator.ts)
  - `sites/colossus-reference/lib/validators/` (5 files)
  - `sites/smiths-electrical-cambridge/lib/validators/` (5 files)
- **Issue:** The entire content validation framework (readability scoring, SEO checks, uniqueness detection) is copied identically across all three sites. The `index.ts` files are byte-for-byte identical at 281 lines each (verified by reading both base-template and smiths-electrical-cambridge versions).
- **Impact:** Any improvement to validation logic requires three identical changes. New validators must be added to three separate directories. As the platform scales, this becomes increasingly costly.
- **Fix:** Move the validator framework to `packages/core-components/src/lib/validators/` or create a dedicated `packages/content-validators/` package. Sites import from the package.
- **Effort:** medium

### [MEDIUM] ARCH-011: Non-Standard Theme Token "brand-blue" Used Extensively in Colossus

- **File:** `sites/colossus-reference/tailwind.config.ts` (lines 24-33) and 100+ component references across the site
- **Issue:** The colossus-reference tailwind config defines custom color aliases (`brand-blue`, `brand-blue-hover`, `brand-blue-light`) that map to theme CSS variables. These are not standard theme system tokens -- the standard tokens are `brand-primary`, `brand-primary-hover`, `brand-secondary`. The aliases are defined as "legacy" compatibility (line 24 comment) but are used pervasively throughout the site in mdx-components.tsx, multiple UI components, and templates.
- **Impact:** Components using `brand-blue` classes cannot be directly reused in other sites without adding the same alias to their tailwind config. New sites created from base-template would not have `brand-blue` defined, resulting in missing/broken styles. The theme system documentation makes no mention of `brand-blue` -- only `brand-primary`.
- **Fix:** Replace all `brand-blue` references in components with the standard `brand-primary` token. Then remove the `brand-blue` aliases from `tailwind.config.ts`. This is a large search-and-replace (100+ occurrences) but mechanically straightforward.
- **Effort:** medium

### [MEDIUM] ARCH-012: contact-info.ts Duplicated with Divergent Implementations

- **Files:**
  - `sites/base-template/lib/contact-info.ts` (137 lines)
  - `sites/colossus-reference/lib/contact-info.ts` (93 lines)
  - `sites/smiths-electrical-cambridge/lib/contact-info.ts` (likely identical to base-template)
- **Issue:** Each site has its own contact-info.ts that provides phone formatting, address formatting, and business hours utilities. The implementations differ: base-template has a more robust phone parser (handles various formats with regex, includes `getBusinessHours()` and `isBusinessOpen()` functions at 137 lines) while colossus-reference uses simpler string replacement (93 lines, no business hours helpers). The exported API surface and structure are similar but not identical.
- **Impact:** Formatting bugs fixed in one site won't be fixed in others. The divergent phone parsing logic could produce different results for the same input. The base-template has strictly better logic but colossus-reference has not adopted it.
- **Fix:** Extract the contact-info utilities into `packages/core-components/src/lib/contact-info.ts` using the more robust base-template implementation. Sites import and configure with their business config object.
- **Effort:** small

### [MEDIUM] ARCH-013: Hardcoded Location Patterns in location-utils.ts

- **File:** `sites/colossus-reference/lib/location-utils.ts` (lines 15, 64-98)
- **Issue:** The `LOCATION_PATTERNS` constant hardcodes only three locations `["-brighton", "-canterbury", "-hastings"]`, and `getAreaServed()` has a hardcoded map of area names for only those three locations. The site serves 32+ locations but location-specific service detection only works for 3 of them.
- **Impact:** Adding location-specific services for other towns (e.g., Maidstone, Crawley, which both have MDX location pages) requires editing this TypeScript file in addition to creating content. The hardcoded patterns will miss any new locations.
- **Fix:** Derive location patterns dynamically from `content/locations/` MDX files (the `locations-config.ts` file already does this correctly -- use that approach). Move area-served data into location MDX frontmatter as an `areasServed` array field.
- **Effort:** small

### [MEDIUM] ARCH-014: core-components Contains Site-Specific Data Files

- **Files:**
  - `packages/core-components/src/lib/services.ts` (scaffolding-specific service list)
  - `packages/core-components/src/lib/services-data.ts` (scaffolding service metadata)
  - `packages/core-components/src/lib/town-locations.ts` (SE England town coordinates)
  - `packages/core-components/src/lib/locations-dropdown.ts` (SE England county/town structure)
  - `packages/core-components/src/lib/location-utils.ts` (Brighton/Canterbury/Hastings specific)
- **Issue:** The shared `core-components` package contains files with data specific to the colossus-reference scaffolding business and South East England geography. A shared package should contain generic, reusable code -- not business-specific content data. These appear to have been copied from colossus-reference into the package without being generalized.
- **Impact:** New sites for different businesses or regions would inherit scaffolding-specific data from the shared package. This pollutes the package with non-generic content and increases its conceptual complexity. The core-components CLAUDE.md describes `services.ts` as "service-specific data types and helpers," which normalizes this anti-pattern.
- **Fix:** Remove all business-specific data files from core-components. Keep only generic utilities and components. Site-specific data should live in MDX frontmatter.
- **Effort:** medium

### [LOW] ARCH-015: Tailwind bg-gray-50 Used Instead of Theme Surface Token

- **File:** `sites/colossus-reference/app/services/[slug]/[location]/page.tsx` (line 240)
- **Issue:** Uses `bg-gray-50` (raw Tailwind gray scale) instead of `bg-surface-muted` (theme token) in the breadcrumb wrapper div.
- **Impact:** If a site's muted background color differs from gray-50, this element would look inconsistent with the rest of the themed UI.
- **Fix:** Replace `bg-gray-50` with `bg-surface-muted`.
- **Effort:** trivial

### [LOW] ARCH-016: anchor-text.ts Contains Hardcoded Business-Specific SEO Data

- **File:** `sites/colossus-reference/lib/anchor-text.ts` (lines 17-52)
- **Issue:** Contains hardcoded maps of scaffolding-specific semantic alternatives (`SERVICE_SEMANTIC_MAP` with 18 entries like "access-scaffolding" -> "Safe working platforms") and location-specific SEO phrases (`LOCATION_SEMANTIC_MAP` with 12 entries). While correctly placed in the site (not in packages), this is content data that could be moved to MDX frontmatter.
- **Impact:** Low -- this is a reasonable trade-off for SEO optimization that is genuinely site-specific. However, adding or changing services/locations requires editing this code file in addition to MDX content.
- **Fix:** Consider adding an `anchorVariations` or `semanticAlternatives` field to service and location MDX frontmatter schemas. This is a nice-to-have, not urgent.
- **Effort:** medium

## Statistics

- Critical: 4
- High: 6
- Medium: 4
- Low: 2
- Total: 16

## Remediation Priority

### Immediate (trivial/small effort, high impact)

1. **Delete dead files (ARCH-002, ARCH-005)** -- Remove `services-data.ts` and `page-old.tsx`. Zero risk, removes confusion.
2. **Fix hardcoded hex colors (ARCH-006)** -- 11 instances across 3 files. Simple find-and-replace with `bg-brand-primary` / `hover:bg-brand-primary-hover`.
3. **Delete unused services.ts (ARCH-001)** -- No active imports found. Safe to delete.
4. **Fix hardcoded LOCATION_SERVICES (ARCH-007)** -- Replace static map with filesystem scan. Small code change with high architectural benefit.

### Short-term (medium effort, prevents ongoing drift)

5. **Consolidate content.ts to package (ARCH-008)** -- Most impactful deduplication. Stop 3-way drift.
6. **Consolidate content-schemas.ts to package (ARCH-009)** -- Single source for validation contracts.
7. **Consolidate validators to package (ARCH-010)** -- Identical code in 3 places.
8. **Migrate brand-blue to brand-primary (ARCH-011)** -- Large search-replace but mechanically simple.

### Medium-term (refactoring required)

9. **Refactor location data to MDX frontmatter (ARCH-003, ARCH-004)** -- Add coordinates/county to location schema, build dynamic readers.
10. **Clean core-components of site-specific data (ARCH-014)** -- Remove after location/service data refactoring is complete.
11. **Consolidate contact-info.ts (ARCH-012)** -- Extract to package with configurable business data.
12. **Fix location-utils.ts hardcoded patterns (ARCH-013)** -- Use dynamic filesystem-based discovery.

## Verification Commands

```bash
# Find all hardcoded hex colors in site components
grep -rn "bg-\[#\|text-\[#\|border-\[#\|ring-\[#" sites/ --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v .next

# Find all potential centralized data files (architecture violations)
find sites -name "services.ts" -o -name "locations.ts" -o -name "*-data.ts" | grep -v node_modules | grep -v .next

# Count content.ts duplication
wc -l sites/*/lib/content.ts

# Verify no cross-site imports exist
grep -rn "from ['\"].*sites/" sites/ --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v .next

# Count brand-blue references that need migration
grep -rn "brand-blue" sites/colossus-reference/ --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v .next | wc -l
```
