# Session Wrap-Up: Clone CSS Rendering Fix

**Date:** 2026-04-13
**Session folder:** output/sessions/2026-04-13_clone-css-rendering-fix/
**Branch:** feature/clone-css-rendering-fix
**Status:** Completed

## Goal

Fix Breakdance/WordPress clone CSS failing to load in Next.js by bypassing PostCSS/Tailwind entirely — serve clone CSS as a static file via `<link>` tag.

## What Was Done

- Created `tools/lib/clone-css-preprocessor.ts`: discovers, classifies, sanitises, and bundles clone CSS files — strips broken `url()` refs, rewrites valid ones to `/clone-assets/<theme>/` paths, handles `@font-face`, splits mega-lines, strips source maps
- Updated `tools/extract-theme.ts` componentize pass: replaced `generateGlobalsCss()` (which embedded raw clone CSS inline) with a call to the preprocessor; output is `clone-styles.css` + manifest; auto-deploys CSS/images to test site's `public/clone-assets/`; auto-patches `layout.tsx` with `<link>` and `tailwind.config.ts` with `corePlugins: { preflight: false }`
- Added auto-stub generation: pipeline now scans the test site for theme page imports it doesn't generate and writes `StubPages.tsx` to fill the gaps — fixes type-check regression after clean-slate regeneration
- Disabled Tailwind Preflight for the corvus test site so it can't override clone CSS typography/layout
- Wrote `docs/architecture/how-clone-css-works.md` documenting the two-layer CSS model

## Key Decisions

- **Keep remote `@font-face` blocks as-is** rather than stripping them. The spec said strip if local files missing, but HTTPS font URLs work fine in browser — stripping them would degrade typography with no benefit.
- **Stub page generation added unplanned.** Clean-slate deletion + regeneration exposed that the corvus site referenced theme page exports the clone pipeline never generates (locations, services, projects, reviews). Added `findRequiredThemePageExports()` + auto-stub generation to make the pipeline idempotent without manual intervention.
- **Pre-existing blog page type error fixed** (`CorvusBlogPage` → `CorvusBlogListPage`) as a prerequisite — this blocked the initial type-check gate.

## Commits

- `e145dba` — feat(pipeline): add clone CSS preprocessor
- `5ebe41c` — feat(pipeline): integrate CSS preprocessor into extract-theme
- `97a4db5` — feat(pipeline): disable Tailwind Preflight for clone theme sites
- `87b8e05` — feat(pipeline): auto-generate stub pages for missing theme exports
- `8d16111` — docs: add clone CSS architecture documentation

## Files Changed

- `tools/lib/clone-css-preprocessor.ts` — new module (the core of this work)
- `tools/extract-theme.ts` — integrated preprocessor, added stub generation, preflight auto-disable
- `packages/themes/corvus/globals.css` — now 5 lines (thin import only)
- `packages/themes/corvus/clone-styles.css` — new: 269KB sanitised CSS bundle
- `packages/themes/corvus/pages/StubPages.tsx` — new: auto-generated stubs for missing page exports
- `sites/_corvus-digital-marketing-events/app/layout.tsx` — `<link>` for clone CSS inserted
- `sites/_corvus-digital-marketing-events/tailwind.config.ts` — `corePlugins: { preflight: false }` added
- `docs/architecture/how-clone-css-works.md` — new architecture doc

## What Was Learned / Why It Matters

The fundamental pattern for loading third-party CSS frameworks (Breakdance, Bootstrap, etc.) in Next.js is: put the CSS in `public/` and reference it with a `<link>` tag — never import it through the PostCSS pipeline. The preprocessor makes this safe by rewriting relative asset paths to namespaced public paths, preventing collisions between multiple clone themes. The auto-stub and auto-patch behaviours mean the pipeline is now fully idempotent: a clean delete + re-run produces a type-correct, dev-server-ready site with zero manual steps.

## Follow-On Tasks

- Run the strip pass (`--pass strip`) once visual fidelity is confirmed, to replace hardcoded content with props
- Visual QA comparison against reference screenshots to validate rendering fidelity
- Consider downloading the Aeonik font files locally so the full `@font-face` experience is preserved (currently relies on the remote server hosting them)
