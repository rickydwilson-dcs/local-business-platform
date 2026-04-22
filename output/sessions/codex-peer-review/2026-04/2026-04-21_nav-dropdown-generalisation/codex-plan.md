# Codex Plan:

## 1) Scope alignment + contract decisions (before code)

1. **Lock the new header nav contract (additive, backwards-compatible for one release).**
   - Extend `SiteHeaderNavItem` to support a generic dropdown config:
     - `dropdown?: HeaderDropdownConfig`
   - Keep legacy props/flags for compatibility:
     - `hasDropdown?: boolean` (deprecated)
     - `locations`, `counties`, `maxTownsPerCounty` props on `SiteHeader` remain supported.
   - **Decision:** new dropdown behavior is driven by `navItem.dropdown`; legacy `hasDropdown` path is auto-adapted to dropdown config internally.

2. **Define generic dropdown data model in core-components (category-agnostic).**
   - Proposed types:
     - `HeaderDropdownItem = { label: string; href: string }`
     - `HeaderDropdownGroup = { label: string; items: HeaderDropdownItem[] }`
     - `HeaderDropdownConfig = {`
       - `mode?: "mega" | "list"` (default `"mega"` for desktop)
       - `items?: HeaderDropdownItem[]` (flat input)
       - `groups?: HeaderDropdownGroup[]` (pre-grouped input)
       - `columns?: number` (default `4`)
       - `grouping?: "alpha"` (when `items` provided; default `"alpha"` for mega)
       - `}`
   - This supports Locations, Services, and future categories without special casing in `SiteHeader`.

3. **Scope gaps to explicitly call out in PR description.**
   - No clarified brief exists for:
     - exact accessibility parity test coverage expectations (manual vs automated),
     - whether every existing `hasDropdown` site should be migrated now vs only compatibility path.
   - Plan assumes:
     - legacy behavior retained via adapter,
     - immediate migration only where required (DJ Fox helper dedupe + Colossus fix).

**Verification gate:** Type contract approved in review before component refactor starts.

---

## 2) Extract shared alphabetical column builder (single source of truth)

1. **Create new pure helper in core-components.**
   - **New file:** `packages/core-components/src/lib/build-alpha-columns.ts`
   - Export:
     - `buildAlphaColumns(items: HeaderDropdownItem[], numCols = 4): HeaderDropdownGroup[]`
   - Behavior:
     - normalize + stable A–Z sort by `label`,
     - split into near-even columns,
     - generate range labels (`A-C`, `D-H`, etc.) from each column’s first/last initial,
     - handle empty/1-item edge cases safely.

2. **Export helper from package public surface.**
   - **Modify:** `packages/core-components/src/index.ts`
   - Add barrel export for `buildAlphaColumns` and new dropdown types.

3. **Refactor DJ Fox duplicate logic to helper.**
   - **Modify:** `sites/dj-fox-electrical/lib/page-data.ts`
   - Remove local `buildAlphaGroups`.
   - Import `buildAlphaColumns` via **subpath import** (per constraints to avoid circular vitest issues).
   - Keep resulting output shape consistent with current header rendering to avoid visual regression.

**Verification gate:** DJ Fox page-data compiles with no local alpha-group function; output structure remains equivalent.

---

## 3) Introduce generic client dropdown primitive while preserving behavior

1. **Create generic dropdown component by reusing existing interactive logic.**
   - **New file:** `packages/core-components/src/components/ui/header-nav-dropdown.tsx` (`'use client'`)
   - Move/adapt from `locations-dropdown.tsx`:
     - keyboard navigation,
     - focus trap (`useFocusTrap`),
     - Esc close,
     - click-outside close,
     - dark/light variants and theme token classes.
   - Render paths:
     - grouped mega-menu (`groups` input),
     - flat list (`mode: "list"`), kept mainly for parity/fallback.
   - For `items + grouping: "alpha"` path, build groups via `buildAlphaColumns`.

2. **Keep `LocationsDropdown` as compatibility wrapper (deprecated).**
   - **Modify:** `packages/core-components/src/components/ui/locations-dropdown.tsx`
   - Reduce to adapter:
     - map legacy `locations/counties/maxTownsPerCounty` into `HeaderDropdownConfig`,
     - delegate rendering to `HeaderNavDropdown`.
   - This avoids breaking theme wrappers and any direct imports this release.

3. **Export new primitive.**
   - **Modify:** `packages/core-components/src/index.ts`
   - Export `HeaderNavDropdown` + related types.

**Verification gate:** Existing locations dropdown behavior still works via wrapper; interaction parity retained manually (Tab cycle, Esc, outside click).

---

## 4) Generalize `SiteHeader` dispatch logic (single shared entry point)

1. **Update nav item typing and dropdown resolution in server component.**
   - **Modify:** `packages/core-components/src/components/ui/site-header.tsx`
   - Replace hardcoded “if hasDropdown then LocationsDropdown” branch with:
     1. If `navItem.dropdown` exists → render generic dropdown.
     2. Else if legacy `hasDropdown` and legacy location data exists → build legacy-adapted dropdown config (for backward compatibility).
     3. Else render normal nav link.
   - Keep mobile menu untouched (non-goal): still consumes current flat list props.

2. **Legacy adapter behavior for Colossus fix.**
   - For legacy flat `locations` with no `counties`, default to mega alpha columns (`columns=4`) instead of fragile simple list.
   - This alone resolves the 37-item overlap on Colossus without forcing composition migration.

**Verification gate:**

- Colossus desktop header now renders 4-column alpha-grouped dropdown with no overlap.
- No required `SiteHeader` edits per category in future; categories use `navItem.dropdown`.

---

## 5) Minimal passthrough updates in theme wrappers + composition wrappers

1. **Update wrapper prop interfaces to accept expanded nav typing.**
   - **Modify (pass-through only):**
     - `packages/themes/vega/components/header.tsx`
     - `packages/themes/orion/components/header.tsx`
     - `sites/dj-fox-electrical/components/site-header.tsx` (if typing requires)
   - Ensure wrappers don’t block new `navigation` item shape with `dropdown`.

2. **Do not add theme-specific dropdown components.**
   - Keep all new logic in `@platform/core-components`.

**Verification gate:** Theme package builds pass with no functional branching added.

---

## 6) Services smoke-test path (prove category-agnostic behavior)

1. **Add one non-breaking smoke-test data scenario using `dropdown` on Services nav item.**
   - Preferred: test fixture/unit test in core-components for `SiteHeader` rendering with:
     - `navigation` includes `Services` item with `dropdown: { items: [...] }`
     - no `locations/counties` dependency.
   - If test infra is limited, add a temporary site-data fixture (not production-visible) and document manual QA route.

2. **Confirm no shared code edits are needed to switch category.**
   - Validation criterion: only data config changes on nav item.

**Verification gate:** Services dropdown opens/render correctly with same keyboard/focus behavior as Locations.

---

## 7) QA, regression checks, and release notes

1. **Manual QA checklist (desktop):**
   - Colossus Locations: 37 items, 4 columns, readable spacing, no overlap/wrapping artifacts.
   - DJ Fox: visual parity to current production layout.
   - Keyboard/focus:
     - Enter/Space opens,
     - Tab stays trapped while open,
     - Esc closes and returns focus,
     - click-outside closes.
   - Light/dark appearance parity across Vega/Orion contexts.

2. **Build/type gates:**
   - `pnpm type-check`
   - `pnpm build`

3. **Deprecation notes (one release):**
   - Mark `hasDropdown` and direct `locations/counties/maxTownsPerCounty` reliance as deprecated path in comments/changelog.
   - Recommend migration to `navigation[].dropdown`.

---

## File-level change summary

### New files

1. `packages/core-components/src/lib/build-alpha-columns.ts`
2. `packages/core-components/src/components/ui/header-nav-dropdown.tsx`

### Modified files

1. `packages/core-components/src/components/ui/site-header.tsx`
2. `packages/core-components/src/components/ui/locations-dropdown.tsx` (compat wrapper/delegation)
3. `packages/core-components/src/index.ts`
4. `sites/dj-fox-electrical/lib/page-data.ts`
5. `packages/themes/vega/components/header.tsx` (typing/pass-through)
6. `packages/themes/orion/components/header.tsx` (typing/pass-through)
7. `sites/dj-fox-electrical/components/site-header.tsx` (typing/pass-through if needed)

(Optionally test files depending on existing harness layout.)

---

## Risks / trade-offs

1. **Risk: broad type ripple on `SiteHeaderNavItem`.**
   - Mitigation: additive typing + legacy fallback, no immediate hard break.

2. **Risk: interaction regressions during component extraction.**
   - Mitigation: reuse existing hook/event logic verbatim first, then rename/refactor.

3. **Risk: visual drift in DJ Fox while deduping helper logic.**
   - Mitigation: preserve current grouping algorithm semantics in `buildAlphaColumns` and verify parity screenshots.

4. **Trade-off: carrying deprecated legacy path temporarily adds complexity.**
   - Accepted due to one-release backward compatibility requirement and non-goal of full site migration.

---

```bash
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04/2026-04-21_nav-dropdown-generalisation/
```
