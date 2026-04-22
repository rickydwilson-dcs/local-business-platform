# Claude's Plan: Generalise Header Nav Dropdowns

**Date:** 2026-04-21
**Author:** Claude (Opus 4.7)
**Status:** Independent plan — written before seeing Codex output

## Executive summary

Introduce a generic `NavDropdown` primitive in `@platform/core-components` plus a shared `buildAlphaColumns()` helper. Replace `SiteHeader`'s hardcoded `LocationsDropdown` call with a data-driven dispatch on a new `dropdown` config attached to each nav item. The old `LocationsDropdown` delegates to `NavDropdown` for one release, then can be deleted. Colossus's fix becomes: compute `dropdown.groups` from its 37 MDX locations via the new helper and pass through `VegaHeader`. Services become a one-line opt-in on any site.

Land in two PRs: **(1)** introduce the primitive + helper + migrate DJ Fox (composition path). **(2)** fix Colossus (legacy path). Keeping them separate limits blast radius on the freshly-promoted DJ Fox production site.

---

## Phase 1 — Introduce `NavDropdown` and `buildAlphaColumns` in core-components

**Goal:** Ship the new primitive and helper with no consumer changes yet. Zero runtime impact on existing sites.

### Files created

| File                                                          | Purpose                                                                                                                                                                                    |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/core-components/src/components/ui/nav-dropdown.tsx` | New client component. Replaces the two-component `LocationsDropdown` with one generic primitive that renders either a simple flat grid or a grouped mega-menu based on config. ~220 lines. |
| `packages/core-components/src/lib/nav-grouping.ts`            | Pure function exports: `buildAlphaColumns<T>(items, numCols?)` and types. ~50 lines.                                                                                                       |

### Files modified

- `packages/core-components/src/index.ts` — export `NavDropdown`, `NavDropdownConfig`, `NavDropdownGroup`, `NavDropdownItem`, `buildAlphaColumns`.

### `NavDropdownConfig` shape (proposed)

```ts
export type NavDropdownItem = { label: string; href: string };
export type NavDropdownGroup = { label: string; items: NavDropdownItem[] };

export type NavDropdownConfig =
  | {
      type: "simple";
      items: NavDropdownItem[]; // flat list
      title?: string; // optional header like "Service Areas"
      subtitle?: string;
      footerLink?: NavDropdownItem; // e.g. "View all service areas →"
    }
  | {
      type: "mega";
      groups: NavDropdownGroup[]; // columns with sub-headers
      title?: string;
      subtitle?: string;
      footerLink?: NavDropdownItem;
      footerCta?: NavDropdownItem; // DJ Fox uses this for "Get Free Quote"
    };
```

Data lives _in_ the config — not resolved via dataKey. That's already the composition system's job (it spreads `siteData.header` before the nav reaches `SiteHeader`).

### `NavDropdown` internals

- Client component (`'use client'`). Props: `{ config: NavDropdownConfig, label: string, variant?: "dark" | "light" }`.
- For `type: "simple"` with ≤8 items: 1-2 column flat grid, `max-w-[min(600px,calc(100vw-2rem))]`, `whitespace-nowrap` on items.
- For `type: "simple"` with >8 items: auto-promote to 4 columns A-Z layout by calling `buildAlphaColumns` internally and delegating to the mega path. (Makes simple+long lists self-healing — a defence against future sites forgetting to pre-group.)
- For `type: "mega"`: 4-column grid, each column has group header, space-y-2 item lists. Responsive breakpoints `md:grid-cols-4`, `grid-cols-2` on narrow.
- Keyboard: Tab to open, arrow keys navigate within, Esc closes, Tab continues past. Focus trap via existing `useFocusTrap` hook.
- Click-outside close via a document listener on the open state.
- Dark/light variants via existing theme tokens (`bg-surface-card`, `bg-surface-inverse`, `text-surface-foreground`, `text-white/80`, etc.) — no new tokens.

### `buildAlphaColumns` signature

```ts
export function buildAlphaColumns<T extends { label: string; href: string }>(
  items: T[],
  numCols: number = 4
): Array<{ label: string; items: T[] }>;
```

Sort items by `label`. Chunk into `numCols` roughly-equal slices. Label each chunk by first-letter range of its contents ("A", "A-C", "D-H"). Lifted from `sites/dj-fox-electrical/lib/page-data.ts:66-84`, generalised off the town-specific shape.

### Verification gate

```bash
pnpm --filter @platform/core-components type-check
# Must pass cleanly.
```

No visual regression possible — no consumers use the new primitive yet.

### Commit

```
feat(core-components): add NavDropdown primitive and buildAlphaColumns helper

Generic multi-column nav dropdown that supports both simple flat lists
and grouped mega-menus. Unblocks reusing the mega-menu layout for
services and other nav categories, not only locations.
```

---

## Phase 2 — Wire `NavDropdown` into `SiteHeader`

**Goal:** Make `SiteHeader` dispatch on per-nav-item config, with backwards compat for legacy `counties`/`locations` callers.

### Files modified

- `packages/core-components/src/components/ui/site-header.tsx`:
  - Extend `SiteHeaderNavItem`: add optional `dropdown?: NavDropdownConfig`. Keep `hasDropdown?: boolean` as deprecated (mark with JSDoc).
  - In the render loop (lines 127-147), when `item.dropdown` is present, render `<NavDropdown config={item.dropdown} label={item.label} variant={isDark ? "dark" : "light"} />`.
  - **Backwards compat shim:** if `item.hasDropdown && !item.dropdown && (counties || locations).length > 0`, synthesise a `NavDropdownConfig` at runtime from the top-level `counties`/`locations` props and render `NavDropdown` with it. This keeps un-migrated sites working without changes.
  - Keep `counties`, `locations`, `maxTownsPerCounty` as deprecated props in `SiteHeaderProps` with JSDoc `@deprecated` notes.
- `packages/core-components/src/components/ui/locations-dropdown.tsx`:
  - Replace internals so both `SimpleDropdown` and `MegaMenuDropdown` delegate to `NavDropdown`. Keep the exported component + `CountyGroup` type as a deprecated shim for one release. No breaking changes for any current importer.

### Verification gate

```bash
pnpm --filter @platform/core-components type-check
pnpm --filter dj-fox-electrical build   # DJ Fox prod still green
pnpm --filter colossus-scaffolding build   # Colossus legacy path still green (still broken visually — that's Phase 3)
```

Then `pnpm dev` on DJ Fox and visually confirm the Locations dropdown renders unchanged — regression check on the delegation.

### Commit

```
refactor(site-header): dispatch to NavDropdown via per-item config

SiteHeader nav items now accept a `dropdown` config object that can
represent simple or mega-menu dropdowns. Legacy `hasDropdown` +
`counties`/`locations` props are retained as deprecated passthroughs
for backwards compat. LocationsDropdown becomes a thin delegation
layer.
```

---

## Phase 3 — Migrate DJ Fox onto the new config

**Goal:** Remove DJ Fox's reliance on the legacy `counties`/`maxTownsPerCounty` top-level props by moving its dropdown data into the new per-item config. Delete the local `buildAlphaGroups` in favour of the shared `buildAlphaColumns`.

### Files modified

- `sites/dj-fox-electrical/lib/page-data.ts`:
  - Import `buildAlphaColumns` from `@platform/core-components`. Delete local `buildAlphaGroups`.
  - In `siteData.header.navigation`, locate the Locations item and attach a `dropdown: { type: "mega", groups: buildAlphaColumns(allTownsSorted), footerLink: {...}, footerCta: {...} }`.
  - Remove `counties` and `maxTownsPerCounty` from `siteData.header`.
- `sites/dj-fox-electrical/components/site-header.tsx`:
  - Drop `counties` and `maxTownsPerCounty` from the wrapper's props interface and forward.
  - Simplify to a near-pure passthrough.

### Verification gate

```bash
pnpm --filter dj-fox-electrical build
pnpm --filter dj-fox-electrical dev
# Manually: hover Locations, confirm the mega-menu renders identically.
```

Keyboard nav, Esc, click-outside all still work (they're now in `NavDropdown` proper).

### Commit

```
refactor(dj-fox-electrical): migrate Locations dropdown to NavDropdown config

Uses the new per-nav-item dropdown config. Shared buildAlphaColumns
replaces the local buildAlphaGroups. No visual change.
```

### PR boundary

Phases 1-3 form PR #1. Ship it. Verify DJ Fox production stays green.

---

## Phase 4 — Fix Colossus

**Goal:** Colossus's Locations dropdown renders as a 4-column mega-menu with no overlap.

### Files modified

- `sites/colossus-scaffolding/site.config.ts`:
  - On the Locations nav item, keep `hasDropdown: true` for now OR start adopting the new shape. Safer to leave static config alone and inject the dropdown at runtime in `layout.tsx`, since the MDX list is runtime-loaded anyway.
- `sites/colossus-scaffolding/app/layout.tsx`:
  - Import `buildAlphaColumns` from `@platform/core-components`.
  - After `allLocations` loads, compute:
    ```ts
    const locationGroups = buildAlphaColumns(
      allLocations.map((loc) => ({ label: loc.title, href: `/locations/${loc.slug}` }))
    );
    const navigationWithDropdowns = siteConfig.navigation.main.map((item) =>
      item.href === "/locations"
        ? {
            ...item,
            dropdown: {
              type: "mega" as const,
              groups: locationGroups,
              footerLink: { label: "View all service areas →", href: "/locations" },
            },
          }
        : item
    );
    ```
  - Pass `navigation={navigationWithDropdowns}` to `<VegaHeader>`.
  - Stop passing `locations={locationItems}` if the new mechanism covers it — but keep it for `MobileMenu` which still needs the flat list (see next point).
- `packages/themes/vega/components/header.tsx`:
  - No interface change required. `SiteHeaderNavItem.dropdown` flows through the `navigation` prop untouched.

### Verification gate

```bash
pnpm --filter colossus-scaffolding build
pnpm --filter colossus-scaffolding dev
# Visually confirm: Locations dropdown renders in 4 columns, no overlap.
# Mobile menu: flat list still present.
```

### Commit

```
fix(colossus-scaffolding): Locations dropdown uses NavDropdown mega-menu

Replaces the broken 3-column grid layout with an A-Z 4-column
mega-menu driven by the shared buildAlphaColumns helper. 37
locations now render without text overlap.
```

### PR boundary

Phase 4 is PR #2, merged after PR #1 soaks.

---

## Phase 5 — Services smoke test (disposable)

**Goal:** Prove the generic path works end-to-end for non-location data before landing the PRs.

### Steps

1. On a feature branch only, temporarily inject a Services dropdown on Colossus:
   ```ts
   const serviceGroups = buildAlphaColumns(
     allServices.map((s) => ({ label: s.title, href: `/services/${s.slug}` }))
   );
   navigationWithDropdowns.map((item) =>
     item.href === "/services"
       ? { ...item, dropdown: { type: "mega", groups: serviceGroups } }
       : item
   );
   ```
2. `pnpm dev`, hover Services, confirm the same mega-menu appearance.
3. Revert the commit — ship Phase 4 without it.

**This phase never makes it into a PR — it's a local verification only.** Document the findings in the session wrap-up.

### Verification gate

Visual confirmation + one keyboard nav check.

---

## Phase 6 — Clean up deprecated props

**Goal:** After 1-2 releases of co-existence, delete the legacy `counties`/`locations`/`hasDropdown` props on `SiteHeader` and the stub `LocationsDropdown`.

**Out of scope for this plan** — schedule as a separate `chore:` PR once all sites use `dropdown` config.

---

## Risks and trade-offs

### Risk: DJ Fox production regression

DJ Fox was just promoted to production. Phases 2-3 touch its render path. Mitigation: Phase 2's backwards-compat shim means even if Phase 3 is delayed or reverted, DJ Fox keeps working. Run visual QA on the `/` and `/locations/*` pages before merging PR #1.

### Risk: The auto-promotion in `NavDropdown` (simple → mega for >8 items)

This is a defensive convenience, but it means a `type: "simple"` dropdown can silently become a mega. Trade-off: less surprising if we make `type` authoritative and let simple overflow ugly. Counter-argument: the whole reason Colossus broke is that SimpleDropdown silently handled too many items. The auto-promote is the right call — it's one less footgun. **Flag for Codex to challenge.**

### Risk: Where does the `dropdown` config live — static config or runtime-built?

Static in `site.config.ts` works for hardcoded lists; runtime (in `layout.tsx` or `page-data.ts`) works for MDX-loaded lists. Both patterns should be supported. The brief leans toward "runtime build" since MDX is the dominant content source. Document the pattern in the plan output but don't force either.

### Risk: Multiple theme-package headers still exist (vega, orion, cygnus, castor, solaris)

Any of them could have a local interface that strips props. Audit: all current theme headers grep as thin passthroughs spreading `{...props}` — so new nav item fields flow through without code changes. **Safe.**

### Risk: `MobileMenu` needs a flat `locations` list — what if a site only passes `dropdown` config and no `locations`?

For now, keep the `locations` prop on `SiteHeader` and require sites to pass both for mobile compat. Long-term fix (out of scope here): extend `MobileMenu` to derive its list from `navigation[].dropdown.items` or `.groups.flatMap(items)`.

### Trade-off: One primitive vs two

Merging `SimpleDropdown` and `MegaMenuDropdown` into one `NavDropdown` is slightly more complex but removes a fork of "which one is active". The auto-promote on long simple lists further justifies this. Net: one primitive, cleaner.

---

## Open questions for synthesis

1. Should `NavDropdown` auto-promote long simple lists to mega, or preserve authoritative `type`? Claude's instinct is auto-promote.
2. Should `buildAlphaColumns` return typed-preserving arrays (`<T>`) or concretely `NavDropdownItem[]`? Typed-preserving is more flexible but slightly more ceremony at call sites.
3. Is a two-PR split warranted, or is one PR acceptable? Claude's instinct: two, because DJ Fox is freshly in prod.
4. Does the new config shape have enough affordances (`footerLink`, `footerCta`, `title`, `subtitle`), or will sites want more (e.g. featured items highlighted above groups)? Start minimal; extend when needed.
5. Where does the new nav-grouping helper live — `packages/core-components/src/lib/nav-grouping.ts` or `packages/core-components/src/components/ui/nav-dropdown/utils.ts`? Claude prefers `src/lib/` because it's a pure function with no React deps.
