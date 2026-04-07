```markdown
# Implementation Plan: Theme Packages Should Own Their Header and Footer

**Date:** 2026-04-06  
**Project:** Local Business Platform monorepo  
**Author:** Codex Peer Review  
**Deliverable:** Implementation Plan

---

## Overview

This plan enables each theme package (Cygnus, Orion, Vega) to own and export typed, theme-specific `Header` and `Footer` React Server Components. These will be imported directly in each site's `layout.tsx`, deprecating the generic header/footer in site layouts. The plan addresses the architectural constraint that footers require site-specific data only available via app-local imports, by adapting the factory-based pattern used for other shared utilities.

---

## Implementation Steps

### 1. **Design Data Injection Pattern for Footer Components**

**Goal:**  
Solve the hardest constraint: enabling a theme package's Footer component to access _site-specific_ data (e.g. from `@/lib/content`) despite living in the package.

**Approach:**  
- Use a **factory pattern**: 
  - In each theme package, export a `create[Theme]Footer()` *function* that takes config and data-fetching functions as arguments and returns an async Footer component.
  - Each site's `lib/` folder will define a thin site-specific wrapper or "shim" that calls the factory with site-local dependencies, and re-exports the configured Footer for internal imports.

**Files/Artifacts:**
- `packages/themes/cygnus/components/footer-factory.tsx`  
- `packages/themes/orion/components/footer-factory.tsx`  
- `packages/themes/vega/components/footer-factory.tsx`
- Interface definition for config/data shape: e.g. `FooterConfig` in theme packages.

**Verification:**
- Footer factory pattern compiles.
- Accepts data/config via params & has type safety.
- No hardcoded `@/` imports inside theme packages.

**Risks:**  
- Some complexity in build tooling; requires discipline for site maintainers.

---

### 2. **Extract Theme-Specific Header/Footer Implementations**

**Goal:**  
Move the actual JSX/TSX for Cygnus, Orion, and Vega headers/footers from their current locations (reference pages) into themed component files inside their respective packages.

**Steps:**  
- For each theme:
  - In `packages/themes/<theme>/components/`, create `header.tsx` and `footer-factory.tsx`.
  - Extract header/footer HTML from the relevant site's reference `layout.tsx` or direct HTML.
  - Refactor to use only public APIs/props (for headers) and injected config/data (for footers, via the factory).
  - For *headers*, accept typed props for site display details (site name, nav, phone, cta, etc.), similar to existing `SiteHeader`.
  - For *footers*, do *not* use any direct imports from `@/`, only use factory-injected data.

**Files Created:**
- `packages/themes/cygnus/components/header.tsx`
- `packages/themes/cygnus/components/footer-factory.tsx`
- `packages/themes/orion/components/header.tsx`
- `packages/themes/orion/components/footer-factory.tsx`
- `packages/themes/vega/components/header.tsx`
- `packages/themes/vega/components/footer-factory.tsx`

**Verification:**
- Headers/footers can be rendered in Storybook or a test site when passed required props/data.
- Visual parity with previous appearance in test/reference sites.

**Risks:**  
- Regressions in header/footer layout due to missed details in extraction process.

---

### 3. **Establish Typed Entry Points and Subpath Exports**

**Goal:**  
Allow consumers (sites) to import `Header`/`Footer` components via subpath exports.

**Steps:**  
- For each theme, add an `index.ts` in `components/` exporting:
  - `Header` (React component)
  - `createFooter` (factory function)

- Update `packages/themes/package.json` `"exports"` map:
  - Add: `"./cygnus/components": "./cygnus/components/index.ts"`, etc for orion/vega.

- Update `tsconfig.base.json` or monorepo TS path mapping so `@platform/themes/cygnus/components` resolves.

**Files Modified:**
- `packages/themes/cygnus/components/index.ts`
- `packages/themes/orion/components/index.ts`
- `packages/themes/vega/components/index.ts`
- `packages/themes/package.json`
- `tsconfig.base.json` and/or root `tsconfig.json`

**Verification:**
- `import { Header, createFooter } from '@platform/themes/cygnus/components'` works in a site.
- No TypeScript/TSPaths errors when building sites.

**Risks:**  
- Incorrect path resolutions can cause TypeScript or build failures; needs careful workspace build/test.

---

### 4. **Add Site-Specific Footer/Config Shims and Update layout.tsx**

**Goal:**  
Let sites use the new themed Header/Footer, with all data dependencies satisfied.

**Steps:**  
- In each site using Cygnus, Orion, Vega:
  - Create a new file, e.g. `lib/themed-footer.tsx`, which:
    - Imports `createFooter` from the correct theme package.
    - Imports local data dependencies (from `@/lib/content`, etc).
    - Exports a default async Server Component calling the theme Footer factory with *site-specific* data.
  - Similarly, for header, decide if it's better to pass site data via props in layout.tsx, or via a site-specific wrapper.
- Refactor `app/layout.tsx`:
  - Import `Header` directly from theme package component.
  - Import and render the site-specific Footer wrapper from `lib/themed-footer.tsx`.

**Site Files Modified:**
- `sites/mad-graphics/app/layout.tsx`
- `sites/mad-graphics/lib/themed-footer.tsx`
- `sites/cygnus-test/app/layout.tsx`
- `sites/cygnus-test/lib/themed-footer.tsx`
- `sites/dj-fox-electrical/app/layout.tsx`
- `sites/dj-fox-electrical/lib/themed-footer.tsx`
- `sites/colossus-scaffolding/app/layout.tsx`
- `sites/colossus-scaffolding/lib/themed-footer.tsx`
- `sites/base-template/app/layout.tsx`
- `sites/base-template/lib/themed-footer.tsx`

**Verification:**
- Sites build and render correct theme header/footer using new components.
- All footer content/data is correct.
- No more `SiteHeader`/generic `Footer` imports from core-components in these sites.
- Tests/Storybook render the header/footer as expected.

**Risks:**  
- Data mapping errors in site shims.
- All dependencies on header/footer props must be fulfilled.

---

### 5. **Update Pipeline to Copy layout.tsx on Theme Page Overrides**

**Goal:**  
Ensure new sites get the correct header and footer by default.

**Steps:**  
- In `tools/create-site-from-project.ts`:
  - Add `'app/layout.tsx'` to `THEMED_PAGE_FILES` so it is copied from the source (theme reference) site, not generated/genericized.
- Ensure that pipeline correctly overwrites/appends `app/layout.tsx` along with existing page files on site creation.

**Files Modified:**
- `tools/create-site-from-project.ts`

**Verification:**
- Create a new site using the pipeline; confirm the layout has the correct theme's header/footer imports and renders as expected.
- Confirm all pipeline-built sites still build and run.

**Risks:**  
- Overwriting user-modified layouts if workflow is unclear. May need pipeline warning/message.

---

### 6. **Keep Generic Header/Footer as Internal Primitives**

**Goal:**  
Do NOT delete generic `SiteHeader`/`Footer` from core-components.

**Steps:**  
- Document in code and/or ADRs that `SiteHeader` remains as a fallback or for legacy/baseline cases.
- Theme package headers/footers may **reuse** these as building blocks (composition), but should *not* depend on them for branding or own exports.

**Verification:**
- All builds pass; no circular dependencies introduced.
- Themes only *optionally* compose via core-components.

**Risks:**  
- None; purely preserves backward compatibility.

---

### 7. **Testing and Acceptance Gates**

**For Each Step/Phase:**
- Run `pnpm build` and `pnpm lint` for all workspaces.
- For all updated sites:
  - Confirm successful Next.js build (including Server Component compilation).
  - Check (via Storybook, local dev, or e2e) for correct visual output of headers/footers.
  - Confirm no `@/` path alias errors in theme package code.
  - TypeScript passes in all packages/sites.
  - Mobil menu works (if included in header).
  - For `mad-graphics`, confirm that it's using `CygnusHeader/CygnusFooter` correctly with zero `SiteHeader` import.

---

### 8. **Phasing/Rollout Plan**

- *Recommend doing all three themes (Cygnus, Orion, Vega) in one PR* as test coverage and reuse patterns are simplest in bulk, but Cygnus (mad-graphics) can be done first as a pilot.
- Use feature branches for isolation; land to main only after all test gates pass for **all affected sites**.
- If hitting major edge-case with factory/shim pattern, can delay for Orion/Vega and raise as an architecture caveat.

---

## Tradeoffs & Risks

- **Factory + site shim** is slightly more complex than props-based approach, but is *necessary* to keep Server Component purity and support live content data.
- Requires all new sites to maintain a thin "footer shim" in their own `lib/`—could be automated or templated via pipeline.
- Changing `app/layout.tsx` source via pipeline may cause confusion if local changes are overwritten; appropriate documentation or warnings should be provided.
- No generic "one-liner" header/footer import for legacy/unthemed sites: these still use core-components fallback.
- **No additional dependencies, no CSS-in-JS or new runtime mechanisms.**

---

## Example layout.tsx Before/After (Cygnus site):

**Before:**
```tsx
import { SiteHeader } from '@platform/core-components';
import Footer from '@platform/core-components';

<SiteHeader appearance="dark" siteName={...} ... />
...
<Footer />
```

**After:**
```tsx
import { Header as CygnusHeader } from '@platform/themes/cygnus/components';
import ThemedFooter from '@/lib/themed-footer';

<CygnusHeader siteName={...} nav={...} ... />
...
<ThemedFooter />
```

---

## Summary

This plan:
- Migrates theme branding logic into the theme packages by default,
- Handles site data/context via factory+shim, not via cross-site imports,
- Updates the pipeline to correctly wire up new `layout.tsx` for all new sites,
- Ensures all theme headers/footers are server-side, type-safe, portable, and easily composed,
- Is backward compatible with generic header/footer for legacy/unbranded sites.

---

## Next Steps

1. Review plan with all affected stakeholders/maintainers.
2. Begin by implementing for Cygnus/mad-graphics as pilot.
3. Validate the pattern and roll out to Orion/Vega.

---

```

**DO NOT EDIT BELOW THIS LINE — for Claude Code:**
```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-06_theme-structural-components/
```
