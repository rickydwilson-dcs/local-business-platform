# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04/2026-04-21_nav-dropdown-generalisation/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04/2026-04-21_nav-dropdown-generalisation/
```

---

## Brief: Generalise Header Nav Dropdowns (Locations + Services + future categories)

**Date:** 2026-04-21
**Project:** Local Business Platform monorepo (white-label Next.js 15 sites for local service businesses)
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

**Note: no clarified brief was produced for this topic. Challenge assumptions accordingly and flag any scope gaps you identify.**

### Problem Statement

The Colossus Scaffolding site's header "Locations" dropdown is visually broken. It lists 37 location MDX entries in a three-column grid constrained to `max-w-[600px]`, so long names ("Burgess Hill", "Kingston upon Thames", "Royal Tunbridge Wells") overlap and wrap mid-word. This came to light via a user screenshot.

Compounding the bug:

1. The existing `LocationsDropdown` component (`packages/core-components/src/components/ui/locations-dropdown.tsx`) hardcodes two render paths: `SimpleDropdown` (flat list, 1–3 cols, fragile at >15 items) and `MegaMenuDropdown` (county-grouped, 4 cols, proper spacing). `SiteHeader` picks between them implicitly based on whether `counties` is passed.
2. `SiteHeader` (at `packages/core-components/src/components/ui/site-header.tsx:129`) hard-codes the dropdown render to `LocationsDropdown`. Any nav item flagged `hasDropdown: true` gets the locations dropdown, regardless of what it semantically represents.
3. The user has stated services will soon need the same multi-column treatment on some sites (potentially 20+ services). This makes the Locations-only dropdown path architecturally insufficient.
4. `sites/dj-fox-electrical-test/` has just been promoted to production as `sites/dj-fox-electrical/`, moving the platform onto the component-composition architecture. The existing `packages/themes/*` path is being retired per `project_site_self_containment.md`. Any fix must work in the composition world and not assume theme packages will exist long-term.

### Goals

- Colossus's Locations dropdown renders correctly (multi-column, no overflow) with the current 37-item MDX-sourced list.
- Services (or any other nav item type) can opt into a multi-column dropdown on any site with minimal config — no new component, no `SiteHeader` edits per category.
- Fix aligns with the composition system: site-local header wrappers consume data via `siteData` and `dataKey` spread. No regressions to `dj-fox-electrical` which is freshly in production.
- Shared logic (A-Z column grouping from a flat list) lives in `@platform/core-components` — not duplicated per site.
- Keyboard nav, focus trap, Esc, click-outside, and dark/light variant support are preserved from `LocationsDropdown`.

### Non-Goals

- Do NOT redesign the mobile menu. `MobileMenu` keeps its current flat-list rendering — mobile doesn't have the overflow bug.
- Do NOT migrate un-migrated sites onto composition — that's out of scope here. `sites/colossus-scaffolding/` is still on the legacy `PageShell` + `VegaHeader` pattern and must keep working.
- Do NOT delete `packages/themes/vega`, `packages/themes/orion`, etc. The self-containment migration is separate work.
- Do NOT introduce new runtime dependencies (headless-ui, Radix, etc.). The current component stack is plain React + Tailwind tokens.

### Acceptance Criteria

1. A new or reshaped primitive in `@platform/core-components` supports rendering any mega-menu dropdown from a config object attached to a nav item — usable for locations, services, or future categories.
2. A reusable `buildAlphaColumns(items, numCols?)` pure function exists in core-components and is the single source of truth for alphabetical chunking. `sites/dj-fox-electrical/lib/page-data.ts` (and wherever else the logic is currently duplicated) is refactored to use it.
3. Colossus's Locations dropdown visually matches the current DJ Fox production layout: 4 columns, A-Z range headers, no text overlap, proper spacing and typography, dark/light variant aware.
4. A site can enable a Services mega-menu by passing a `dropdown` config on the Services nav item — no changes to `SiteHeader`, theme packages, or any other shared code.
5. `dj-fox-electrical` (composition-based, freshly in production) renders identically to its current state — no visual or behavioural regression.
6. `pnpm type-check` and `pnpm build` pass at the repo root.
7. Keyboard navigation, focus trap, Esc, click-outside, and dark/light variants work on both Locations and a Services smoke-test dropdown.

### Constraints

Hard constraints from `CLAUDE.md` and memory:

- **Theme tokens only.** No hex colors, no `theme()` in CSS files. Tailwind classes must reference theme-contract tokens (`bg-brand-primary`, `text-surface-foreground`, etc.).
- **Server Component where possible.** `SiteHeader` is a Server Component. Any client-interactive part (dropdown toggle, focus trap) must be isolated to a `'use client'` leaf — same pattern `LocationsDropdown` already follows.
- **No `packages/themes/*` changes that assume the packages will be around long-term.** Pass-through prop changes are fine; new theme-specific components are not.
- **`SiteHeader` is the composition entry point.** Sites register site-local wrappers (e.g. `SiteHeader` in `sites/dj-fox-electrical/components/`) around `CoreSiteHeader`. The composition registry routes `"component": "SiteHeader"` in `composition.json` to that local wrapper. Prop data flows through `siteData.header` via `dataKey`.
- **Subpath imports for factories**, barrel imports for UI components. Site lib shims must import factories via subpath to avoid circular deps in vitest.
- **No new hex colors.** No hardcoded Tailwind color classes outside the theme contract.
- **Backwards compat for one release.** Legacy `VegaHeader`/Colossus must keep working without immediate migration. Deprecated props can be deleted in a follow-up.
- **Existing keyboard/focus behaviour is non-negotiable.** The `LocationsDropdown` already implements ARIA roles, focus trap, Esc, and click-outside. The new primitive must retain all of this.

### Relevant Architecture

**Composition system** (`packages/component-composition/`):

- `renderComposedLayout({ composition, data })` at `packages/component-composition/src/render-layout.tsx` returns `{ headerElement, footerElement }`.
- It resolves `config.dataKey` via `getByPath()` (dot-path supported for pages; header/footer use single-level keys currently).
- `registerLayoutComponent(name, { component })` is called in a site's `app/layout.tsx` before render. The registry is a module-level Map.
- `dj-fox-electrical` registers `SiteHeader` and `SiteFooter` site-local wrappers. `composition.json` declares `{ "component": "SiteHeader", "dataKey": "header" }`. `siteData.header` is spread as props.

**Current DJ Fox header flow:**

- `sites/dj-fox-electrical/components/site-header.tsx` is a 27-line wrapper around `CoreSiteHeader` (`@platform/core-components`), forwarding `appearance="dark"` and the `counties`/`maxTownsPerCounty` props.
- `sites/dj-fox-electrical/lib/page-data.ts` builds `headerCounties` via a local `buildAlphaGroups(towns)` that sorts A-Z and chunks into 4 columns with letter-range labels ("A-C", "D-H", etc.). This is the function to extract.
- `siteData.header` includes `locations`, `counties`, `maxTownsPerCounty: 10`.

**Current Colossus header flow (legacy, broken):**

- `sites/colossus-scaffolding/app/layout.tsx` uses `PageShell` + `VegaHeader` + `ThemeProvider`.
- `VegaHeader` at `packages/themes/vega/components/header.tsx` wraps `CoreSiteHeader` with `appearance="light"`. It does NOT currently forward `counties` — its interface only accepts `locations`.
- 37 location MDX files are loaded via `getContentItems("locations")`. They're passed as flat `locationItems` to `VegaHeader` as the `locations` prop.
- This hits `SiteHeader`'s hardcoded `LocationsDropdown` call with no `counties`, which triggers `SimpleDropdown` → visual breakage.

**`SiteHeader` current implementation** (`packages/core-components/src/components/ui/site-header.tsx`):

- Lines 20-24: `SiteHeaderNavItem = { label, href, hasDropdown?: boolean }`.
- Lines 129-139: hardcoded dispatch — if `hasDropdown && (counties || locations).length > 0`, render `<LocationsDropdown ... />`. No other dropdown types supported.
- Line 169: `MobileMenu` receives the flat `locations` list separately.

**`LocationsDropdown`** (`packages/core-components/src/components/ui/locations-dropdown.tsx`):

- 388 lines, `'use client'`.
- Exports `LocationsDropdown` and interfaces `LocationItem`, `CountyGroup`.
- Two internal components: `SimpleDropdown` (buggy for long lists) and `MegaMenuDropdown` (clean 4-column with headers).
- Handles keyboard nav, focus trap (via `useFocusTrap`), Esc, click-outside, dark/light variants.

### Codebase Snapshot

Key files:

- `packages/core-components/src/components/ui/site-header.tsx` — shared header Server Component. Lines 20-24 define nav item shape; lines 129-139 dispatch to LocationsDropdown.
- `packages/core-components/src/components/ui/locations-dropdown.tsx` — the client-side dropdown. Both render paths (`SimpleDropdown`, `MegaMenuDropdown`) live here. `CountyGroup` type exported.
- `packages/core-components/src/components/ui/mobile-menu.tsx` — separate mobile flow, out of scope.
- `packages/core-components/src/hooks/useFocusTrap.ts` — focus trap hook, reuse.
- `packages/core-components/src/index.ts` — barrel. Exports `SiteHeader`, `LocationsDropdown`, etc. Adds new exports here.
- `packages/component-composition/src/render-layout.tsx` — layout rendering. No changes expected.
- `packages/component-composition/src/layout-registry.ts` — registry. No changes expected.
- `packages/themes/vega/components/header.tsx` — 17-line passthrough. `VegaHeaderProps` currently lacks `counties`. Pass-through only.
- `packages/themes/orion/components/header.tsx` — same pattern for Orion (dark variant).
- `sites/dj-fox-electrical/components/site-header.tsx` — site-local composition wrapper. 27 lines.
- `sites/dj-fox-electrical/lib/page-data.ts` — contains `buildAlphaGroups(towns)` at roughly lines 66-84. Builds `headerCounties` consumed by the header wrapper.
- `sites/dj-fox-electrical/composition.json` — declares `headerConfig: { component: "SiteHeader", dataKey: "header" }`.
- `sites/dj-fox-electrical/app/layout.tsx` — registers `SiteHeader` with the layout registry, runs `renderComposedLayout`.
- `sites/colossus-scaffolding/app/layout.tsx` — legacy PageShell flow. Builds `locationItems` from 37 MDX files, passes flat to `VegaHeader`.
- `sites/colossus-scaffolding/site.config.ts` — contains navigation config. Does not populate `serviceAreaRegions`.

### What a Good Plan Should Cover

- **API shape for the new primitive.** What's the config object on a nav item look like? One type with variants (`type: "simple" | "mega" | "grouped"`), or different primitives? Does the config carry the data (`groups: [...]`), or does it reference a `dataKey` for lazy resolution?
- **Naming.** Does `LocationsDropdown` stay (with delegation) or get replaced? What does the new component get called (`NavDropdown`, `MegaMenu`, `HeaderDropdown`)?
- **Where to locate `buildAlphaColumns`.** `packages/core-components/src/lib/` is the obvious spot — but is there a naming convention for pure functions vs factories there? Grep existing lib files to match.
- **Backwards compat strategy.** Does `SiteHeader` keep the `counties` / `locations` / `maxTownsPerCounty` props as deprecated passthroughs that internally build a `dropdown` config? Or does it get a hard-break with a migration of every consumer in one PR?
- **Composition data flow.** Where does the `dropdown` config get constructed — in `page-data.ts` per site, or does a helper live in core-components that a site calls with its navigation array + MDX data to produce the enriched navigation?
- **Colossus's fix path.** Does Colossus keep its legacy layout (just changing what it passes to `VegaHeader`)? Or does the fix require migrating Colossus onto composition? (The brief says composition migration is out of scope — so probably the former.)
- **`VegaHeader` / `OrionHeader` passthrough.** Do these theme-package wrappers need interface updates to pass through any new props? If so, document the minimal surface.
- **Services smoke test.** How to prove the generic path works for Services without permanently enabling it on a site. A disposable branch commit? A dev-mode toggle?
- **Phasing.** Can this land in one PR, or should it be two (1: introduce primitive + helper + DJ Fox migration; 2: Colossus consumer)?
- **Risks.** What breaks if `SiteHeader`'s nav item shape changes? Where are all the call sites? Consider `packages/themes/*/components/header.tsx` (multiple themes), `sites/*/components/site-header.tsx` (any that exist), `sites/*/app/layout.tsx` (legacy path).

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04/2026-04-21_nav-dropdown-generalisation/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04/2026-04-21_nav-dropdown-generalisation/`
