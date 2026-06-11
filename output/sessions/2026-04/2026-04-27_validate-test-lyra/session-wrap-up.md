# Session Wrap-Up: pipeline.ingest → lyra → validate-site

**Date:** 2026-04-27
**Goal:** Run the full `/pipeline.ingest` pipeline against https://www.fountaindigital.co.uk/, generate the `lyra` theme package, scaffold `sites/test-lyra/`, and validate it.

---

## What Was Done

### Phase A — Reference Harvest

- `tools/analyse-site.ts` ran against fountaindigital.co.uk and generated `packages/themes/lyra/`
- Sub-agents A1 (HTML/image capture) and A3 (scaffold inventory) completed in parallel
- 48 components generated; site analysis and scaffold inventory written to `output/ingestion/lyra/`

### Phase B — Theme Package Validation

- `cs-theme-package-validator` found Critical findings: TPV-003 (unused `'use client'` on all 48 generated stubs) and TPV-013 (inline `backgroundImage` style in two components)
- **User approved fixes**
- Fixed: bulk-stripped `'use client'` + `import { useState }` from all 48 components; moved `dot-grid-overlay` to `globals.css`; removed dynamic `url()` background from `gradient-divider-band.tsx`
- Phase B re-run: passed (0 Critical, 0 High)

### Phase C — Test Site Scaffolding

- Copied `sites/base-template` → `sites/test-lyra`
- Resolved workspace exclusion (`!sites/test-*` in pnpm-workspace.yaml) via node_modules symlink + webpack aliases + tsconfig paths
- Generated 5 pages: home, about, contact, blog listing, blog detail
- Font: Work Sans (body), Inter (heading) — "Be Vietnam Pro" from site analysis not in confirmed next/font list, fell back to Work Sans
- Fixed CSS import path (`../../../` not `../../../../`) after initial HTTP 500

### Phase C Validate — pipeline.validate-site

- Screenshots captured via Playwright (5 pages, 1440×900)
- 3 parallel review agents (visual fidelity, accessibility, performance)
- **Aggregated findings: 2 Critical, 6 High, 7 Medium, 6 Low**
- Fix agent resolved 6 of 8 Critical+High findings; 2 skipped (A11Y-003 file upload keyboard, A11Y-005 mobile menu aria-expanded — both require component-level client state)
- Additional fixes applied by orchestrator: `"lyra"` added to `ThemeName` union in `core-components/theme-context.tsx`; `blog/[slug]/page.tsx` updated to async params (Next.js 15 requirement)
- Console QA: all 5 pages clean, no errors or 4xx resources

---

## Key Decisions

- **"Be Vietnam Pro" → Work Sans fallback**: The site's detected body font isn't in the confirmed `next/font/google` list. Work Sans used as fallback. VFR-014 Low finding documents this.
- **`ThemeName` union**: Added `"lyra"` to `packages/core-components/src/context/theme-context.tsx`. This file has its own local copy of the union (decoupled from theme-system to avoid tsconfig cross-package path issues). Future generated themes will need the same addition.
- **A11Y-003/005 deferred**: File upload keyboard operability and mobile menu `aria-expanded` require adding client-side state to stub components. Acceptable for a pipeline test site.

---

## Commits

None — test sites are not committed (excluded from workspace).

## Significant Files Changed

| File                                                          | Change                                                          |
| ------------------------------------------------------------- | --------------------------------------------------------------- |
| `packages/themes/lyra/` (48 components)                       | Stripped unused `'use client'` + `useState` generator artifact  |
| `packages/themes/lyra/components/cta-full-bleed-gradient.tsx` | TPV-013: inline style → CSS class                               |
| `packages/themes/lyra/components/gradient-divider-band.tsx`   | TPV-013: removed dynamic `url()` background feature             |
| `packages/themes/lyra/globals.css`                            | Added `.dot-grid-overlay` CSS class                             |
| `packages/themes/lyra/components/contact-form-panel.tsx`      | Added `<button type="submit">`                                  |
| `packages/themes/lyra/components/primary-navigation.tsx`      | Added `aria-label="Primary navigation"`                         |
| `packages/themes/lyra/components/services-grid.tsx`           | Replaced `text-surface-background` with `text-white`            |
| `packages/core-components/src/context/theme-context.tsx`      | Added `"lyra"` to `ThemeName` union                             |
| `sites/test-lyra/`                                            | New test site: 5 pages, theme wiring, webpack aliases           |
| `sites/test-lyra/app/blog/[slug]/page.tsx`                    | Fixed async params (Next.js 15)                                 |
| `sites/test-lyra/next.config.ts`                              | Added `formats: ['image/avif', 'image/webp']`, `compress: true` |

## What Was Learned

- The generator emits `'use client'` + `import { useState }` as boilerplate on every stub — this should be fixed in the generator template, not patched post-generation.
- Test sites excluded from pnpm workspace (`!sites/test-*`) need either a node_modules symlink or explicit workspace inclusion. Webpack aliases + tsconfig paths handle the theme package without symlinks for the generated theme specifically.
- `ThemeName` in `core-components/theme-context.tsx` must be kept in sync with `THEME_NAMES` in `theme-system`. Generated themes need this patched.
- Next.js 15 requires `params: Promise<{...}>` + `await params` in dynamic route page components.
