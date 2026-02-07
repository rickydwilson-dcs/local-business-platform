# Architecture Review Findings

**Reviewer:** cs-architect
**Scope:** Monorepo architecture compliance review covering sites/, packages/, and turbo.json configuration
**Date:** 2026-02-06

## Summary

The codebase has several significant violations of the MDX-only content architecture and theme token system. The most critical issues are centralized TypeScript data files for services and locations in colossus-reference (violating the MDX-only rule), hardcoded hex colors in UI components (breaking white-labeling), and substantial code duplication across sites that should be extracted to packages.

## Findings

### [CRITICAL] ARCH-001: Centralized Service Data File Violates MDX-Only Architecture

- **File:** `sites/colossus-reference/lib/services.ts` (lines 1-30)
- **Issue:** This file contains a hardcoded TypeScript array of all 15 services with slugs, names, and intro text. The architecture explicitly states "MDX is the single source of truth. Never create lib/locations.ts or app/services/specific-service/page.tsx." Services should be read dynamically from `content/services/*.mdx` files.
- **Impact:** Content editors must now maintain service data in two places (TypeScript file AND MDX files), creating synchronization issues and violating the principle that content editors don't touch code.
- **Fix:** Delete `lib/services.ts` and use `getContentItems('services')` from `lib/content.ts` instead. Any code importing from `lib/services.ts` should be refactored to use the MDX-based content loader.
- **Effort:** medium

### [CRITICAL] ARCH-002: Deprecated Service Data File Still Contains Active Content

- **File:** `sites/colossus-reference/lib/services-data.ts` (lines 1-181)
- **Issue:** Although marked as `@deprecated`, this file still contains a massive `serviceMap` object with descriptions, badges, images, features, and subtitles for 17 services. The deprecation notice says data has been migrated to MDX frontmatter, but the file still exists with active fallback code being used.
- **Impact:** Creates confusion about source of truth. Components may still be using this fallback data instead of MDX frontmatter. The file should have been deleted after migration, not left with deprecation warnings.
- **Fix:** Verify all consuming code reads from MDX frontmatter, then delete this file entirely. If any component uses `getServiceData()`, refactor it to use MDX content utilities.
- **Effort:** medium

### [CRITICAL] ARCH-003: Town Locations Centralized Data File

- **File:** `sites/colossus-reference/lib/town-locations.ts` (lines 1-305)
- **Issue:** Contains a hardcoded `TOWN_LOCATIONS` array with 34 towns including coordinates, county, URL, and descriptions. This duplicates data that should come from location MDX frontmatter. The file also has helper functions like `getLocationsByCounty()` and `getCountySummary()`.
- **Impact:** Location data is maintained in TypeScript instead of MDX, violating the content architecture. Changes require code updates rather than MDX edits.
- **Fix:** Move geographic metadata (coordinates, county, description) into location MDX frontmatter. Create utility functions in `lib/content.ts` to aggregate this data from MDX files.
- **Effort:** large

### [CRITICAL] ARCH-004: Locations Dropdown Centralized Data

- **File:** `sites/colossus-reference/lib/locations-dropdown.ts` (lines 1-159)
- **Issue:** Contains hardcoded `RICH_TOWN_PAGES` array and `LOCATIONS_DROPDOWN` structure with 34 locations organized by county. This is pure navigation data that duplicates location content.
- **Impact:** Adding a new location requires updating both MDX content AND this TypeScript file. Violates single source of truth principle.
- **Fix:** Generate dropdown data dynamically from location MDX files by reading county from frontmatter and building the navigation structure at build time.
- **Effort:** medium

### [HIGH] ARCH-005: Hardcoded Hex Colors in Service Components

- **File:** `sites/colossus-reference/components/ui/service-showcase.tsx` (lines 118, 124, 246, 252, 282)
- **Issue:** Multiple instances of hardcoded hex colors: `bg-[#005A9E]/90`, `hover:bg-[#004a85]`, `focus:ring-[#005A9E]`. The architecture states: "Never hardcode hex colors (bg-[#005A9E]) - they break white-labeling."
- **Impact:** This component cannot be white-labeled. If used in another site with different brand colors, the hardcoded blue will conflict with the new brand.
- **Fix:** Replace all hardcoded colors with theme tokens: `bg-[#005A9E]` -> `bg-brand-primary`, `hover:bg-[#004a85]` -> `hover:bg-brand-primary-hover`, `focus:ring-[#005A9E]` -> `focus:ring-brand-primary`.
- **Effort:** small

### [HIGH] ARCH-006: Hardcoded Hex Colors in Service Cards

- **File:** `sites/colossus-reference/components/ui/service-cards.tsx` (lines 109, 115, 142)
- **Issue:** Same pattern of hardcoded hex colors (`bg-[#005A9E]/90`, `hover:bg-[#004a85]`, `focus:ring-[#005A9E]`) in service card components.
- **Impact:** Breaks white-labeling capability for these components.
- **Fix:** Replace with theme tokens as described in ARCH-005.
- **Effort:** small

### [HIGH] ARCH-007: Hardcoded Hex Colors in Content Card

- **File:** `sites/colossus-reference/components/ui/content-card.tsx` (lines 60, 121)
- **Issue:** Hardcoded `bg-[#005A9E]/90` and `hover:bg-[#004a85]` colors.
- **Impact:** Breaks white-labeling capability.
- **Fix:** Replace with theme tokens.
- **Effort:** trivial

### [HIGH] ARCH-008: Duplicated content.ts Across Three Sites

- **Files:**
  - `sites/base-template/lib/content.ts` (570 lines)
  - `sites/smiths-electrical-cambridge/lib/content.ts` (570 lines)
  - `sites/colossus-reference/lib/content.ts` (384 lines)
- **Issue:** The base-template and smiths-electrical-cambridge versions are nearly identical (570 lines each). A version also exists in `packages/core-components/src/lib/content.ts`. This utility code for reading MDX files should be centralized.
- **Impact:** Bug fixes and improvements must be applied to 3-4 files. Risk of implementations drifting apart.
- **Fix:** Consolidate to `packages/core-components/src/lib/content.ts` and have sites import from `@platform/core-components`. The colossus-reference version has site-specific filtering logic that can be handled via configuration or callbacks.
- **Effort:** medium

### [HIGH] ARCH-009: Duplicated content-schemas.ts Across Sites

- **Files:**
  - `sites/base-template/lib/content-schemas.ts` (783 lines)
  - `sites/smiths-electrical-cambridge/lib/content-schemas.ts` (783 lines)
  - `packages/core-components/src/lib/content-schemas.ts` (exists)
- **Issue:** Identical 783-line Zod schema files in both template sites, with another version in core-components. Content validation schemas should be shared.
- **Impact:** Schema changes must be made in multiple places. Risk of validation drift between sites.
- **Fix:** Move canonical schemas to `packages/core-components/src/lib/content-schemas.ts` and have sites import from there. If sites need custom schemas, they can extend the base schemas.
- **Effort:** medium

### [MEDIUM] ARCH-010: Centralized Data Files in packages/core-components

- **Files:**
  - `packages/core-components/src/lib/services.ts`
  - `packages/core-components/src/lib/services-data.ts`
  - `packages/core-components/src/lib/town-locations.ts`
  - `packages/core-components/src/lib/locations-dropdown.ts`
- **Issue:** The core-components package contains the same architecture violations found in colossus-reference. Centralized service and location data files violate MDX-only content architecture.
- **Impact:** The violation is now propagated to the shared package, making it easier for new sites to inherit the anti-pattern.
- **Fix:** Remove these files from core-components. The package should provide utility functions for reading MDX content, not hardcoded data.
- **Effort:** medium

### [MEDIUM] ARCH-011: rate-limiter.ts Duplication with Different Implementations

- **Files:**
  - `sites/base-template/lib/rate-limiter.ts` (38 lines - stub)
  - `sites/colossus-reference/lib/rate-limiter.ts` (59 lines - full Redis implementation)
  - `sites/smiths-electrical-cambridge/lib/rate-limiter.ts` (likely duplicated)
  - `packages/core-components/src/lib/rate-limiter.ts` (exists)
- **Issue:** Rate limiter exists in multiple places with different implementations. base-template has a stub that always allows requests; colossus-reference has full Redis/Upstash implementation.
- **Impact:** Sites may have inconsistent security behavior. Production rate limiting logic is duplicated.
- **Fix:** Create a configurable rate limiter in core-components that accepts configuration (enabled/disabled, Redis URL, limits). Sites configure it via environment variables.
- **Effort:** medium

### [MEDIUM] ARCH-012: Site-Specific Components That Could Be Shared

- **Files:**
  - `sites/colossus-reference/components/ui/service-showcase.tsx`
  - `sites/colossus-reference/components/ui/service-cards.tsx`
  - `sites/colossus-reference/components/ui/content-card.tsx`
- **Issue:** These components exist only in colossus-reference but are generic enough to be shared (once hardcoded colors are fixed). Similar components exist in core-components (`service-cards.tsx`, `content-card.tsx`).
- **Impact:** Code duplication; other sites cannot benefit from these components without copying them.
- **Fix:** After fixing hardcoded colors, evaluate whether these should replace or merge with core-components versions.
- **Effort:** medium

### [LOW] ARCH-013: Potential Unused location-utils.ts in colossus-reference

- **File:** `sites/colossus-reference/lib/location-utils.ts` (37 lines)
- **Issue:** This file provides `hasLocationSuffix()` for filtering location-specific services. It's a utility that reads from the filesystem, which is acceptable, but it exists alongside the larger location data violations.
- **Impact:** Minor - this file itself isn't a violation, but it's part of a complex location handling system that could be simplified.
- **Fix:** Review usage and consolidate location-related utilities into a single well-documented file or extract to core-components.
- **Effort:** trivial

### [LOW] ARCH-014: locations-config.ts is Correctly Implemented

- **File:** `sites/colossus-reference/lib/locations-config.ts` (37 lines)
- **Issue:** This file dynamically reads location slugs from the content/locations directory, which is the correct approach. However, it exists alongside the violating town-locations.ts and locations-dropdown.ts files.
- **Impact:** None - this is actually the correct pattern. The issue is that other files don't use this pattern.
- **Fix:** Use this as the model for refactoring the other location files. Extend this approach to provide all location data dynamically.
- **Effort:** trivial (reference only)

## Statistics

- Critical: 4
- High: 5
- Medium: 4
- Low: 2
- Total: 15

## Recommendations

### Immediate Priority (Critical/High)

1. **Fix hardcoded colors (ARCH-005, 006, 007)** - Small effort, high impact for white-labeling capability. Can be done in a single PR.

2. **Delete deprecated services-data.ts (ARCH-002)** - Verify no code depends on it, then remove. This removes confusion about data source.

3. **Consolidate content.ts and content-schemas.ts (ARCH-008, 009)** - Move to core-components, update site imports. This prevents future drift.

### Medium-Term (This Sprint)

4. **Refactor centralized location data (ARCH-003, 004)** - This is larger effort. Move geographic metadata to MDX frontmatter, generate dropdown data dynamically.

5. **Delete services.ts (ARCH-001)** - Requires verifying all code uses MDX content utilities.

6. **Clean up core-components violations (ARCH-010)** - Remove hardcoded data files from shared package.

### Architecture Governance

7. **Add ESLint rule** for hardcoded Tailwind arbitrary values (`bg-[#...]`) - Prevent future color violations.

8. **Add pre-commit check** for files named `services.ts`, `locations.ts`, or `*-data.ts` in lib/ directories - Catch centralized data file creation.

9. **Document the MDX-only pattern** more prominently in CLAUDE.md and architecture docs.

## Files Reviewed

### Sites Examined

- `sites/colossus-reference/` - Full review
- `sites/base-template/` - Partial review (lib files)
- `sites/smiths-electrical-cambridge/` - Partial review (lib files)

### Packages Examined

- `packages/core-components/` - Structure and lib files

### Configuration Files

- `turbo.json` - Correct dependency ordering with `"dependsOn": ["^build"]`
- `pnpm-workspace.yaml` - Not directly reviewed but workspace structure is correct

## Verification Commands

```bash
# Find all hardcoded hex colors in sites
grep -r "bg-\[#[0-9a-fA-F]\+\]" sites/

# Find all potential centralized data files
find sites -name "services.ts" -o -name "locations.ts" -o -name "*-data.ts" | grep -v node_modules

# Verify content.ts duplication
wc -l sites/*/lib/content.ts

# Check for cross-site imports (should return nothing)
grep -r "from ['\"]../../sites/" sites/
```
