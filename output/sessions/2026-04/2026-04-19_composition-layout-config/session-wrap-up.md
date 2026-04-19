# Session Wrap-Up: Header/Footer Config in Composition System

**Date:** 2026-04-19
**Session folder:** output/sessions/2026-04/2026-04-19_composition-layout-config/
**Branch:** feature/composition-layout-config
**Status:** Completed

## Goal

Add `headerConfig`/`footerConfig` blocks to `SiteCompositionConfig` and a site-side layout registry pattern so header and footer components become visible to — and driven by — the composition model.

## What Was Done

- Extended `@platform/component-composition` types and schemas with `LayoutBlockConfig`, `LayoutComponentName`, and `LayoutBlockConfigSchema`; added optional `headerConfig`/`footerConfig` to `SiteCompositionConfig`
- Created `layout-registry.ts`: a module-level `LAYOUT_REGISTRY` map with `registerLayoutComponent()` and `getLayoutComponent()` — registration happens at site level, avoiding circular deps between the package and theme packages
- Created `render-layout.tsx`: `renderComposedLayout()` resolves registered components from `composition.json` config and returns `{ headerElement, footerElement }` React elements
- Extracted the PoC site's hard-coded header/footer into `DesignlabHeader` and `DesignlabFooter` Server Components with typed props; wired them via `registerLayoutComponent` in `layout.tsx`
- Added `headerConfig`/`footerConfig` blocks to `composition.json` and `header`/`footer` data keys to `siteData` in `page-data.ts`

## Key Decisions

- **Site-side registration (not package-side):** The registry lives in `component-composition` but components are injected by each site's `layout.tsx`. This keeps the package free of any dependency on theme packages, which would be circular.
- **Double cast required:** The brief showed `as React.ComponentType<Record<string, unknown>>` but TypeScript requires `as unknown as React.ComponentType<...>` when the source type's required props don't overlap with `Record<string, unknown>`. Applied to both registrations.
- **`dataKey` pattern for props:** `renderComposedLayout` spreads `data[config.dataKey]` as props when `dataKey` is set, so header/footer data stays namespaced in `siteData` (`siteData.header`, `siteData.footer`) rather than polluting the top-level namespace.

## Commits

- `c56207c` — feat(component-composition): add LayoutBlockConfig types and schemas for headerConfig/footerConfig
- `c76d956` — feat(component-composition): add layout registry and renderComposedLayout()
- `98bcbed` — feat(poc-composition-test): wire header/footer via composition layout registry

## Files Changed

- `packages/component-composition/src/types.ts` — new `LayoutBlockConfig`, `LayoutComponentName`, extended `SiteCompositionConfig`
- `packages/component-composition/src/schemas.ts` — new `LayoutBlockConfigSchema`, extended `SiteCompositionConfigSchema`
- `packages/component-composition/src/layout-registry.ts` — new file: registry map + register/get functions
- `packages/component-composition/src/render-layout.tsx` — new file: `renderComposedLayout()`
- `packages/component-composition/src/index.ts` — exports for new registry and renderer
- `sites/poc-composition-test/app/layout.tsx` — rewritten to use registry pattern
- `sites/poc-composition-test/components/designlab-header.tsx` — new extracted component
- `sites/poc-composition-test/components/designlab-footer.tsx` — new extracted component
- `sites/poc-composition-test/composition.json` — added `headerConfig`/`footerConfig`
- `sites/poc-composition-test/lib/page-data.ts` — added `header`/`footer` data keys

## What Was Learned / Why It Matters

The layout registry pattern resolves the one gap in the composition system that previously made it non-portable: header and footer were invisible to `composition.json` and had to be hard-coded per site. The site-side registration approach (declare the contract in the package, bind the component in the consumer) is a clean extension of the same inversion-of-control pattern already used elsewhere in the platform. With this in place, a future multi-site scaffolder can drive layout components entirely from config — the same way it already drives page sections.

## Follow-On Tasks

- The `registerLayoutComponent` call in `layout.tsx` runs at module evaluation time (top-level). If Next.js ever evaluates the module more than once across workers, the registry could be empty on a cold render — worth a note if this causes surprising production misses.
- Other sites (dj-fox-electrical, colossus-scaffolding) could adopt the same pattern once they have a `composition.json`; this PoC proves the shape is correct.
