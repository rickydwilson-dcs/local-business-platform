# Code Quality Review Findings

**Reviewer:** cs-code-reviewer
**Scope:** Full codebase review of `local-business-platform` monorepo including `sites/`, `packages/core-components/`, and `tools/`. Reviewed TypeScript/TSX files for compliance with project standards (components.md, content.md, styling.md).
**Date:** 2026-02-06

## Summary

The codebase has several standards violations that should be addressed. The most significant issues are: (1) the `smiths-electrical-cambridge` site is missing its ESLint configuration file causing lint failures, (2) multiple components in `packages/core-components` use default exports which violates the project's named-export-only standard, and (3) significant code duplication exists between `sites/base-template` and `sites/smiths-electrical-cambridge`. The codebase also contains hardcoded hex colors in colossus-reference that violate theme token requirements.

## Findings

### [CRITICAL] CQ-001: Missing ESLint Configuration in smiths-electrical-cambridge

- **File:** `sites/smiths-electrical-cambridge/eslint.config.mjs` (missing)
- **Issue:** The site has no ESLint configuration file, causing `pnpm lint` to fail across the entire monorepo with error: `ESLint couldn't find the config "next/core-web-vitals" to extend from`
- **Impact:** CI/CD pipeline failures, no linting coverage for this site, blocking deployment workflow
- **Fix:** Copy `sites/base-template/eslint.config.mjs` to `sites/smiths-electrical-cambridge/eslint.config.mjs`
- **Effort:** trivial

### [HIGH] CQ-002: Default Exports in core-components Package

- **File:** `packages/core-components/src/components/hero/HeroV1.tsx` (line 55)
- **File:** `packages/core-components/src/components/hero/HeroV2.tsx` (line 102)
- **File:** `packages/core-components/src/components/hero/HeroV3.tsx` (line 94)
- **File:** `packages/core-components/src/components/Schema.tsx` (line 25)
- **File:** `packages/core-components/src/components/ui/mobile-menu.tsx` (line 12)
- **File:** `packages/core-components/src/components/ui/breadcrumbs.tsx` (line 29)
- **File:** `packages/core-components/src/components/ui/service-about.tsx` (line 49)
- **Issue:** These components use `export default` which violates the project standard: "Export as named exports, not default" (components.md line 20). The CLAUDE.md for core-components also states: "Named exports only (no default exports)"
- **Impact:** Inconsistent import patterns, harder refactoring, violates documented standards
- **Fix:** Remove `export default` lines from each file. Components already have named exports (e.g., `export function HeroV1`), so the default exports are redundant.
- **Effort:** small

### [HIGH] CQ-003: TypeScript `any` Types in Production Code

- **File:** `tools/update-mdx-images.ts` (lines 87, 94)
  ```typescript
  function findCard(cards: any[], title: string): any | undefined;
  function updateCard(card: any, r2Key: string): boolean;
  ```
- **File:** `tools/manage-sites.ts` (lines 190, 618)
  ```typescript
  const filters: any = {};
  const listOptions: any = { format: "table" };
  ```
- **File:** `tools/setup-vercel-env.ts` (line 132)
  ```typescript
  return data.envs?.map((env: any) => env.key) || [];
  ```
- **File:** `packages/core-components/src/components/analytics/__tests__/Analytics.test.tsx` (line 14)
- **Issue:** Use of `any` type bypasses TypeScript's type safety. The coding standards warn against this pattern.
- **Impact:** Loss of type safety, potential runtime errors, harder debugging
- **Fix:** Define proper TypeScript interfaces for these objects. For test mocks, use `unknown` with type assertions or proper mock types.
- **Effort:** medium

### [HIGH] CQ-004: Code Duplication - content.ts Between Sites

- **File:** `sites/base-template/lib/content.ts` (570 lines)
- **File:** `sites/smiths-electrical-cambridge/lib/content.ts` (570 lines)
- **Issue:** These files are identical. The content reading utilities should be shared code in `packages/core-components/src/lib/content.ts` (which already exists but may not be used by all sites).
- **Impact:** Maintenance burden - bug fixes must be applied in multiple places, risk of drift between copies
- **Fix:** Have sites import from `@platform/core-components/lib/content` instead of maintaining local copies
- **Effort:** medium

### [HIGH] CQ-005: Code Duplication - content-schemas.ts Between Sites

- **File:** `sites/base-template/lib/content-schemas.ts` (783 lines)
- **File:** `sites/smiths-electrical-cambridge/lib/content-schemas.ts` (783 lines)
- **Issue:** These Zod validation schemas are identical across both sites. Should be shared code.
- **Impact:** Same as CQ-004 - maintenance burden and risk of schema drift
- **Fix:** Move to `packages/core-components/src/lib/content-schemas.ts` and import from there
- **Effort:** medium

### [MEDIUM] CQ-006: Hardcoded Hex Colors in colossus-reference Components

- **File:** `sites/colossus-reference/components/ui/service-cards.tsx` (lines 109, 115, 142)
  ```tsx
  className = "... bg-[#005A9E]/90 ...";
  className = "... bg-[#005A9E] ... hover:bg-[#004a85] ...";
  ```
- **File:** `sites/colossus-reference/components/ui/service-showcase.tsx` (lines 118, 124, 246, 252, 282)
- **File:** `sites/colossus-reference/components/ui/content-card.tsx` (lines 60, 121)
- **File:** `sites/colossus-reference/app/layout.tsx` (lines 36-146 in CSS)
- **Issue:** Styling standards require using theme tokens (`bg-brand-primary`) instead of hardcoded colors (`bg-[#005A9E]`). This breaks white-label theming capability.
- **Impact:** Site cannot be easily re-themed, violates white-label architecture
- **Fix:** Replace `bg-[#005A9E]` with `bg-brand-primary`, `hover:bg-[#004a85]` with `hover:bg-brand-primary-hover`, etc.
- **Effort:** medium

### [MEDIUM] CQ-007: Default Exports in Site Page Components

- **File:** All `page.tsx` files across sites use `export default function`
- **Issue:** While Next.js App Router requires default exports for page components, the project should document this exception clearly. Currently 60+ files use default exports for pages.
- **Impact:** Low - this is a Next.js requirement, but should be documented as an exception to the named-exports rule
- **Fix:** Add documentation note in components.md: "Exception: Next.js App Router page.tsx files must use default exports per framework requirement"
- **Effort:** trivial

### [MEDIUM] CQ-008: Hardcoded Hex Colors in coverage-map.tsx

- **File:** `packages/core-components/src/components/ui/coverage-map.tsx` (lines 80-87, 198-202)
  ```typescript
  "East Sussex": "#2563eb",
  "West Sussex": "#059669",
  Kent: "#dc2626",
  Surrey: "#7c3aed",
  ```
- **File:** `sites/colossus-reference/components/ui/coverage-map.tsx` (lines 77-83, 188-192)
- **Issue:** Map county colors are hardcoded. These have eslint-disable comments acknowledging the issue but no fix applied.
- **Impact:** Cannot theme map colors per-site, inconsistent with design system
- **Fix:** Define semantic color tokens for map regions in theme config, or accept this as intentional for map visualization consistency
- **Effort:** medium

### [MEDIUM] CQ-009: Unused React Import in Hero Components

- **File:** `packages/core-components/src/components/hero/HeroV1.tsx` (line 7)
- **File:** `packages/core-components/src/components/hero/HeroV2.tsx` (line 7)
- **File:** `packages/core-components/src/components/hero/HeroV3.tsx` (line 7)
- **Issue:** `import React from "react"` is unnecessary in React 17+ with the new JSX transform. This is dead code.
- **Impact:** Minor - slightly larger bundle, unnecessary import
- **Fix:** Remove the unused React imports. Modern React/Next.js does not require explicit React imports for JSX.
- **Effort:** trivial

### [LOW] CQ-010: console.log Statements in Tools (Acceptable)

- **Files:** `tools/*.ts` (multiple files)
- **Issue:** Many console.log statements exist in CLI tools. However, these are CLI scripts intended for terminal output, not production application code.
- **Impact:** None - this is appropriate for CLI tools
- **Fix:** No action required - console.log is appropriate for CLI feedback
- **Effort:** n/a

### [LOW] CQ-011: mdx-components.tsx Uses Default Export

- **File:** `mdx-components.tsx` (root level, line 30)
- **File:** `sites/base-template/mdx-components.tsx` (line 267)
- **File:** `sites/smiths-electrical-cambridge/mdx-components.tsx` (line 267)
- **File:** `sites/colossus-reference/mdx-components.tsx` (line 957)
- **Issue:** These files use default export. However, this may be required by the MDX framework integration.
- **Impact:** Low - framework requirement
- **Fix:** Verify if MDX requires default export; if so, document as exception
- **Effort:** trivial

### [LOW] CQ-012: Inline Styles in HeroV1 and HeroV3

- **File:** `packages/core-components/src/components/hero/HeroV1.tsx` (lines 28-35)
  ```tsx
  style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, ... } : undefined}
  ```
- **File:** `packages/core-components/src/components/hero/HeroV3.tsx` (lines 44-47, 52-54)
- **Issue:** Styling standards state "NO inline styles (`style={{}}` properties)". These components use inline styles for dynamic background images.
- **Impact:** Low - inline styles are sometimes necessary for dynamic values like URLs
- **Fix:** This may be acceptable for dynamic image URLs that cannot be known at build time. Consider documenting this as an acceptable exception.
- **Effort:** small

## Statistics

- Critical: 1
- High: 5
- Medium: 4
- Low: 3
- Total: 13

## Remediation Priority

1. **Immediate (blocking CI):** CQ-001 - Add missing ESLint config
2. **This sprint:** CQ-002, CQ-006 - Fix default exports and hardcoded colors
3. **Next sprint:** CQ-003, CQ-004, CQ-005 - TypeScript improvements and deduplication
4. **Backlog:** CQ-007 through CQ-012 - Documentation and minor cleanups
