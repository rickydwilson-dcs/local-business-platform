# Implementation Plan: Generalise Header Nav Dropdowns

**Date:** 2026-04-21
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

## Key Differences Between Plans

| Aspect                              | Claude                                                                                                              | Codex                                                                                                                                    | Synthesised Decision                                                                                                                                                                                                                                                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primitive name                      | `NavDropdown`                                                                                                       | `HeaderNavDropdown`                                                                                                                      | **`HeaderNavDropdown`** — Codex's name is more precise (clarifies this is a header dropdown, not a generic `<select>` replacement).                                                                                                                                                                                    |
| Config shape                        | Discriminated union on `type: "simple" \| "mega"`                                                                   | Single config with optional `mode`, `items`, `groups`, `grouping: "alpha"`, `columns`                                                    | **Codex's single-object shape.** A discriminated union forces callers to pick up-front; Codex's "give me `items` and I'll alpha-group them, or give me `groups` and I'll render them as-is" is more ergonomic and aligns with the "auto-promote long simple lists" behaviour Claude wanted without making it implicit. |
| Auto-promotion of long simple lists | Yes — silently promote `type: "simple"` with >8 items to mega                                                       | No — explicit `mode` + `grouping`                                                                                                        | **Hybrid:** explicit `mode: "mega" \| "list"` (Codex), default `"mega"` for desktop, and when caller supplies only `items`, default `grouping: "alpha"`. No silent-surprise auto-promote; the defaults do the right thing without magic.                                                                               |
| Colossus fix strategy               | Update `sites/colossus-scaffolding/app/layout.tsx` to build the new `dropdown` config and pass through `VegaHeader` | Legacy adapter in `SiteHeader` auto-builds alpha-column mega from the flat `locations` prop when `hasDropdown` is true and no `counties` | **Codex's legacy adapter** as the primary fix. Colossus gets fixed with **zero changes to site code** — the adapter in `SiteHeader` upgrades the SimpleDropdown path to alpha-grouped mega automatically. This also protects any other un-migrated site that hits the same class of bug.                               |
| PR phasing                          | Two PRs (DJ Fox first, Colossus second)                                                                             | One plan, implicit single PR                                                                                                             | **One PR.** With Codex's adapter approach, DJ Fox doesn't need migration for the Colossus fix to land — the risk-spreading rationale for two PRs evaporates. Single PR, smaller blast radius than Claude's two-PR plan.                                                                                                |
| Helper filename                     | `packages/core-components/src/lib/nav-grouping.ts` with `buildAlphaColumns`                                         | `packages/core-components/src/lib/build-alpha-columns.ts` with `buildAlphaColumns`                                                       | **`packages/core-components/src/lib/nav-grouping.ts`** — better future home if we add `buildLetterColumns` or other grouping strategies. Matches other core-components lib filenames (noun-phrases: `content-schemas.ts`, `site-utils.ts`).                                                                            |
| DJ Fox migration urgency            | Part of the core PR (Phase 3)                                                                                       | Part of the same work but presented as a concrete step                                                                                   | **Include in the PR** — it dedupes the helper, which is the whole point. But treat it as a mechanical refactor, not a risky migration.                                                                                                                                                                                 |
| Services smoke test                 | Temporary commit on Colossus, revert after                                                                          | Unit test fixture + manual QA route                                                                                                      | **Codex's approach.** A unit test in core-components that renders `SiteHeader` with a Services-style `dropdown` config is permanent value and doesn't require a disposable commit dance.                                                                                                                               |

## Blind Spots Caught

- **Codex: the legacy adapter is the cleanest Colossus fix.** Claude's plan had Colossus's layout.tsx doing the work of building the new `dropdown` config. Codex spotted that `SiteHeader` can adapt legacy `locations`/`hasDropdown` into the new alpha-column mega internally — meaning Colossus needs **no changes at all** to get the fix. This collapses Phase 4 of Claude's plan into the adapter that's already needed for backwards compat. Elegant.
- **Codex: flagged that `MobileMenu` is intentionally untouched** and called it out explicitly as part of the non-goals in the plan itself (not just the brief). Good defensive hygiene — reduces scope creep risk when the brief is interpreted during implementation.
- **Claude: the `auto-promote` discussion surfaced a real design tension.** Codex didn't confront it — silently relying on sensible defaults can mask bugs. The synthesised decision (explicit `mode` with opinionated defaults) is better than either plan alone.
- **Claude: risk that multiple theme packages might strip props.** Confirmed via grep that all current theme headers are `{...props}` passthroughs. Codex didn't audit this but also didn't add changes that would depend on it — safe regardless.
- **Both missed: `sites/dj-fox-electrical-test/` still exists.** Per file tree, the test site is still on disk alongside production. It likely uses its own `SiteHeader` wrapper. Synthesis adds a verification gate: grep for other site wrappers and confirm either (a) they follow the passthrough pattern or (b) we include them in the PR. See Phase 5.
- **Both underspecified: where the "Services" header/subtitle/footer CTA strings come from.** The existing `MegaMenuDropdown` has hardcoded "Our Coverage Areas" and "Can't find your area?" text. The new primitive needs these as config, not hardcoded — otherwise Services would say "Coverage Areas" too. Synthesis pulls this into the `HeaderDropdownConfig` type explicitly.

---

## Implementation Plan

### Phase 1 — Extract shared helper `buildAlphaColumns`

**Goal:** Single source of truth for alphabetical chunking. No consumer changes yet.

**Files:**

- NEW `packages/core-components/src/lib/nav-grouping.ts` (~50 lines):

  ```ts
  export interface HeaderDropdownItem {
    label: string;
    href: string;
  }
  export interface HeaderDropdownGroup {
    label: string;
    items: HeaderDropdownItem[];
  }

  export function buildAlphaColumns(
    items: HeaderDropdownItem[],
    numCols: number = 4
  ): HeaderDropdownGroup[] {
    // Sort by label (case-insensitive, stable)
    // Split into numCols roughly-equal chunks
    // Each group's label = first-letter range of its items (e.g. "A-C", "D", "E-H")
    // Handle empty input (return []) and single-item cases
  }
  ```

- MODIFY `packages/core-components/src/index.ts` — export `buildAlphaColumns`, `HeaderDropdownItem`, `HeaderDropdownGroup`.

**Source reference:** Lift and generalise from `sites/dj-fox-electrical/lib/page-data.ts:66-84`.

**Verification gate:**

```bash
pnpm --filter @platform/core-components type-check
```

**Commit:**

```
feat(core-components): extract buildAlphaColumns shared helper

Pure function for alphabetical column grouping. Will be used by the
new HeaderNavDropdown primitive and replaces the site-local
buildAlphaGroups in dj-fox-electrical.
```

---

### Phase 2 — Introduce `HeaderNavDropdown` primitive

**Goal:** Build the generic client-side dropdown that will replace `LocationsDropdown` internals.

**Files:**

- NEW `packages/core-components/src/components/ui/header-nav-dropdown.tsx` (~220 lines, `'use client'`):

  ```ts
  export interface HeaderDropdownConfig {
    mode?: "mega" | "list"; // default "mega"
    items?: HeaderDropdownItem[]; // flat — gets alpha-grouped if mode is "mega"
    groups?: HeaderDropdownGroup[]; // pre-grouped — wins over items if present
    columns?: number; // default 4
    title?: string; // e.g. "Service Areas"
    subtitle?: string; // e.g. "We proudly serve these locations"
    footerLink?: HeaderDropdownItem; // e.g. "View all service areas →"
    footerCta?: HeaderDropdownItem; // e.g. "Get Free Quote" button
  }

  export function HeaderNavDropdown(props: {
    config: HeaderDropdownConfig;
    label: string;
    variant?: "dark" | "light";
  }): JSX.Element;
  ```

- MODIFY `packages/core-components/src/index.ts` — export `HeaderNavDropdown` and `HeaderDropdownConfig`.

**Behaviour:**

- `mode: "mega"` (default) with `items` only → auto-builds groups via `buildAlphaColumns(items, columns)`.
- `mode: "mega"` with `groups` → renders groups as-is (4-col grid, group header, item list with bullet).
- `mode: "list"` → flat list, no grouping, responsive columns with `whitespace-nowrap`.
- Reuse `useFocusTrap`, keyboard nav (arrow keys, Esc, Tab), click-outside close — all lifted from current `LocationsDropdown`.
- Dark/light variants via existing theme tokens only. No hardcoded colours.
- Title/subtitle render in the header strip; footerLink/footerCta in the footer strip. Empty config fields render nothing (no hardcoded "Service Areas" text).

**Verification gate:**

```bash
pnpm --filter @platform/core-components type-check
```

**Commit:**

```
feat(core-components): add HeaderNavDropdown generic primitive

Category-agnostic header dropdown that supports both flat lists
(auto alpha-grouped) and pre-grouped mega-menus. Reuses the focus
trap, keyboard nav, and theme-token styling from LocationsDropdown.
```

---

### Phase 3 — Dispatch via per-item `dropdown` config in `SiteHeader` + legacy adapter

**Goal:** Make `SiteHeader` generic. Colossus's bug is fixed here — via the legacy adapter, with zero changes to Colossus.

**Files:**

- MODIFY `packages/core-components/src/components/ui/site-header.tsx`:
  - Add optional `dropdown?: HeaderDropdownConfig` to `SiteHeaderNavItem`.
  - Keep existing `hasDropdown?: boolean` with `@deprecated` JSDoc.
  - Replace the hardcoded `LocationsDropdown` branch (current lines 129-139) with:
    1. If `item.dropdown` is present → render `<HeaderNavDropdown config={item.dropdown} label={item.label} variant={...} />`.
    2. **Legacy adapter:** else if `item.hasDropdown` is true AND (`counties.length > 0` OR `locations.length > 0`):
       - If `counties.length > 0`: build `HeaderDropdownConfig` with `groups: counties.map(c => ({ label: c.name, items: c.towns.map(t => ({ label: t.name, href: t.href })).slice(0, maxTownsPerCounty) }))`, `title: "Our Coverage Areas"`, `subtitle: "Professional services across the region"`, `footerCta: { label: "Get Free Quote", href: "/contact" }` — preserves current DJ Fox visuals.
       - Else (flat `locations`): build `HeaderDropdownConfig` with `items: locations.map(l => ({ label: l.name, href: \`/locations/${l.slug}\` }))`, `mode: "mega"`, `title: "Service Areas"`, `subtitle: "We proudly serve these locations"`, `footerLink: { label: "View all service areas →", href: "/locations" }` — this is the Colossus fix.
    3. Else → render a plain nav link (current behaviour).
  - Keep `counties`, `locations`, `maxTownsPerCounty` as `@deprecated` props on `SiteHeaderProps`.

- MODIFY `packages/core-components/src/components/ui/locations-dropdown.tsx`:
  - Reduce to a thin compatibility wrapper that maps its legacy props to `HeaderDropdownConfig` and delegates to `HeaderNavDropdown`. Keep the existing exports (`LocationsDropdown`, `CountyGroup`, `LocationItem`) so no direct importer breaks. Mark the whole module `@deprecated`.
  - Delete `SimpleDropdown` and `MegaMenuDropdown` internal components — their logic now lives in `HeaderNavDropdown`.

**Verification gate:**

```bash
pnpm --filter @platform/core-components type-check
pnpm --filter @platform/themes type-check   # theme wrappers
pnpm --filter dj-fox-electrical build       # composition site
pnpm --filter colossus-scaffolding build    # legacy site
```

All four must pass. Then:

```bash
cd sites/colossus-scaffolding && pnpm dev
# Visual: Locations dropdown renders 4-column A-Z mega-menu, no overlap.

cd sites/dj-fox-electrical && pnpm dev
# Visual: Locations dropdown renders as before, pixel-parity with production.
```

**Commit:**

```
refactor(site-header): dispatch to HeaderNavDropdown via per-item config

SiteHeader nav items now accept a generic dropdown config. A legacy
adapter upgrades flat `locations` lists to alpha-grouped mega-menus
automatically, fixing Colossus's 37-location overlap bug without
changes to that site. LocationsDropdown is now a deprecated
compatibility wrapper.
```

---

### Phase 4 — Dedupe DJ Fox's `buildAlphaGroups`

**Goal:** Remove the local copy in favour of the shared helper. No behaviour change.

**Files:**

- MODIFY `sites/dj-fox-electrical/lib/page-data.ts`:
  - Delete local `buildAlphaGroups(towns)` (currently ~lines 66-84).
  - Import `buildAlphaColumns` from `@platform/core-components` (barrel import — this is a UI-adjacent helper, not a factory, so barrel is correct per CLAUDE.md).
  - Call site: replace `buildAlphaGroups(allTownsSorted)` with `buildAlphaColumns(allTownsSorted.map(t => ({ label: t.name, href: \`/locations/${t.slug}\` })))`.
  - The existing `siteData.header.counties` shape is preserved — the `HeaderDropdownGroup` shape is structurally compatible with the old `CountyGroup` for the subset of fields the header uses (label/items vs name/towns is a rename — adjust the downstream wrapper accordingly OR keep the local shape and transform at the call site).

- MODIFY `sites/dj-fox-electrical/components/site-header.tsx` if required by type changes (should be a minimal passthrough change).

**Verification gate:**

```bash
pnpm --filter dj-fox-electrical build
pnpm --filter dj-fox-electrical dev
# Visual: Locations dropdown pixel-identical to before.
```

**Commit:**

```
refactor(dj-fox-electrical): use shared buildAlphaColumns helper

Removes local buildAlphaGroups in favour of the shared core-components
helper. No visual change.
```

---

### Phase 5 — Audit other sites and theme wrappers

**Goal:** Confirm no other site-local wrappers strip the new `navigation[].dropdown` field or depend on the old `counties` prop shape.

**Tasks:**

- `grep -rn "SiteHeaderNavItem\|hasDropdown\|VegaHeader\|OrionHeader\|LocationsDropdown" sites/ packages/themes/` — audit every call site.
- For each theme-package header (`packages/themes/{vega,orion,cygnus,castor,solaris}/components/header.tsx`): confirm it's a `{...props}` passthrough. If any strips props explicitly, update its interface to include `counties?`/`locations?`/`navigation` compatible types.
- For each site's local `components/site-header.tsx` (e.g. `dj-fox-electrical-test`, `dj-fox-electrical-legacy` if they still exist): confirm passthrough behaviour.

**Verification gate:**

```bash
pnpm build   # root — all sites and packages
pnpm type-check
```

No new commit unless audit finds an issue requiring a fix — if so, one commit per affected file.

---

### Phase 6 — Add Services smoke test

**Goal:** Permanent proof that the generic path works for non-location data.

**Files:**

- NEW `packages/core-components/src/components/ui/__tests__/site-header.test.tsx` (or add to existing test file if one exists):
  - Render `<SiteHeader>` with `navigation` containing a Services item that has `dropdown: { mode: "mega", items: [{ label: "Electrical Testing", href: "/services/testing" }, ...], title: "Our Services" }`.
  - Assert: mega-menu renders, all items are present, no dependency on `locations` or `counties` props.
  - Assert: keyboard nav reaches the Services dropdown.

**Verification gate:**

```bash
pnpm --filter @platform/core-components test
```

**Commit:**

```
test(site-header): verify HeaderNavDropdown works for non-location categories

Proves that Services (or any other category) can opt into the
mega-menu by setting navigation[].dropdown — no SiteHeader changes
needed per category.
```

---

### Phase 7 — Final repo-wide verification

**Goal:** Full-repo green before PR.

**Gate:**

```bash
pnpm lint
pnpm type-check
pnpm build
```

All must pass. Then manual QA:

1. Colossus desktop `/`: open Locations dropdown → 4-column A-Z mega, no overlap, correct light variant.
2. DJ Fox desktop `/`: open Locations dropdown → pixel-parity with pre-change state, correct dark variant.
3. Both sites, mobile viewport: hamburger menu still shows flat location list via `MobileMenu`.
4. Keyboard on both: Tab into dropdown, arrow keys navigate, Esc closes and returns focus to the trigger, Tab past continues to next nav item.

---

## File-level change summary

### New files

1. `packages/core-components/src/lib/nav-grouping.ts`
2. `packages/core-components/src/components/ui/header-nav-dropdown.tsx`
3. `packages/core-components/src/components/ui/__tests__/site-header.test.tsx` (or extension of existing test file)

### Modified files

1. `packages/core-components/src/components/ui/site-header.tsx`
2. `packages/core-components/src/components/ui/locations-dropdown.tsx` (slimmed to delegation wrapper)
3. `packages/core-components/src/index.ts`
4. `sites/dj-fox-electrical/lib/page-data.ts`
5. `sites/dj-fox-electrical/components/site-header.tsx` (typing passthrough, if needed)
6. Any theme header found by Phase 5 audit that strips props

### Unchanged (despite being in scope of the bug)

- `sites/colossus-scaffolding/*` — fix lands entirely via the legacy adapter in `SiteHeader`. Zero site-code changes.
- `packages/themes/vega/components/header.tsx`, `packages/themes/orion/components/header.tsx`, etc. — verified passthroughs in Phase 5.
- `packages/component-composition/*` — no changes.
- `packages/core-components/src/components/ui/mobile-menu.tsx` — out of scope.

---

## Risks and mitigations

| Risk                                                                                         | Mitigation                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DJ Fox visual regression (just in production)                                                | Phase 4 dedupe preserves exact call-site semantics. Visual QA gate in Phase 7 catches drift. If parity fails, Phase 4 commit is revertable without losing the fix (Phases 1-3 stand alone). |
| Legacy adapter misinterprets an edge case (e.g. site passes both `counties` and `locations`) | Counties wins by precedence in the adapter. Document the precedence in JSDoc on the `@deprecated` props.                                                                                    |
| Theme-package header strips `dropdown` field                                                 | Phase 5 audit catches this. All current theme headers grep as `{...props}` — low risk.                                                                                                      |
| Naming collision — `HeaderDropdownConfig` vs existing `CountyGroup`                          | `CountyGroup` remains exported for backwards compat. `HeaderDropdownGroup` is the new name. No runtime collision.                                                                           |
| Focus trap regression                                                                        | The trap logic is lifted verbatim from `LocationsDropdown` — no algorithm change, just extraction.                                                                                          |
| Test harness for `site-header.test.tsx` doesn't exist yet in `@platform/core-components`     | Check during Phase 6: if Vitest config isn't set up, scaffold minimally (React Testing Library + Vitest) or downgrade Phase 6 to manual QA and document.                                    |

---

## Deprecation timeline (recorded for follow-up, not in scope)

- Next release: `SiteHeaderProps.counties`, `SiteHeaderProps.locations`, `SiteHeaderProps.maxTownsPerCounty`, `SiteHeaderNavItem.hasDropdown`, and `LocationsDropdown` are `@deprecated` but functional.
- Release after: migrate remaining sites (colossus and any others) to set `navigation[].dropdown` explicitly.
- Release after that: delete deprecated props and the `LocationsDropdown` module.

Out of scope for this PR. Track as a separate follow-up issue.
