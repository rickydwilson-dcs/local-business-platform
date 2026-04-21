# YOLO Implementation Brief: Generalise Header Nav Dropdowns

**Branch:** feature/nav-dropdown-generalisation (created from develop)
**Session spec:** output/sessions/2026-04/2026-04-21_nav-dropdown-generalisation/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The Colossus Scaffolding header's "Locations" dropdown is broken: 37 locations render in a 3-column grid inside a 600px container, causing text overlap. The root cause is architectural — `SiteHeader` hardcodes a branch to `LocationsDropdown`, and the existing component can't gracefully handle long flat lists. Services will soon need the same multi-column treatment.

This plan introduces a generic `HeaderNavDropdown` primitive driven by a per-nav-item `dropdown` config, plus a shared `buildAlphaColumns` helper. A legacy adapter in `SiteHeader` fixes Colossus with zero changes to that site's code — it upgrades the flat `locations` list to an alpha-grouped mega-menu automatically. DJ Fox (just promoted to production) gets deduped against the shared helper with no visual change.

The synthesis was reviewed and approved. Implement it exactly as specified below.

Source synthesis: `output/sessions/codex-peer-review/2026-04/2026-04-21_nav-dropdown-generalisation/synthesis.md`

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | /                      | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | /                      | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | /                      | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/nav-dropdown-generalisation
pnpm type-check   # must be clean before starting
```

If `pnpm type-check` fails on a clean develop, STOP — do not proceed. Surface the error and wait for guidance.

---

## Phase 1 — Extract shared helper `buildAlphaColumns`

**Goal:** Single source of truth for alphabetical chunking. No consumer changes yet.
**Model:** sonnet — small, careful pure-function extraction with new types.

### Steps

1. Read `sites/dj-fox-electrical/lib/page-data.ts` lines 60-90 to confirm the current `buildAlphaGroups` implementation.
2. Create `packages/core-components/src/lib/nav-grouping.ts` with these exports:

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
   ): HeaderDropdownGroup[];
   ```

   Behaviour:
   - Sort items by `label` using `String.localeCompare` (case-insensitive, stable).
   - Split into `numCols` roughly-equal chunks via `Math.ceil(items.length / numCols)`.
   - Each group's `label` = first-letter range of its items: if first-letter-of-first === first-letter-of-last, use just that letter; otherwise `"A-C"` style.
   - Handle empty input → return `[]`. Handle single item → single group with 1-letter label. Skip any chunk that would be empty.
   - Pure function. No React imports.

3. Edit `packages/core-components/src/index.ts` — add these exports:

   ```ts
   export { buildAlphaColumns } from "./lib/nav-grouping";
   export type { HeaderDropdownItem, HeaderDropdownGroup } from "./lib/nav-grouping";
   ```

### Verification gate — STOP if this fails

```bash
pnpm --filter @platform/core-components type-check
```

### Commit

```
feat(core-components): extract buildAlphaColumns shared helper

Pure function for alphabetical column grouping. Will be used by the
new HeaderNavDropdown primitive and replaces the site-local
buildAlphaGroups in dj-fox-electrical.
```

---

## Phase 2 — Introduce `HeaderNavDropdown` primitive

**Goal:** Build the generic client-side dropdown that will replace `LocationsDropdown` internals.
**Model:** sonnet — single component file, careful behaviour preservation from existing `LocationsDropdown`.

### Steps

1. Read `packages/core-components/src/components/ui/locations-dropdown.tsx` in full — the new primitive must preserve its keyboard nav, focus trap, Esc, click-outside, and dark/light variant behaviour.
2. Read `packages/core-components/src/hooks/useFocusTrap.ts` to confirm its signature.
3. Create `packages/core-components/src/components/ui/header-nav-dropdown.tsx` (`'use client'`, ~220 lines):

   ```ts
   import type { HeaderDropdownItem, HeaderDropdownGroup } from "../../lib/nav-grouping";

   export interface HeaderDropdownConfig {
     mode?: "mega" | "list"; // default "mega"
     items?: HeaderDropdownItem[]; // flat — auto-grouped if mode is "mega"
     groups?: HeaderDropdownGroup[]; // pre-grouped — takes precedence over items
     columns?: number; // default 4
     title?: string; // e.g. "Service Areas"
     subtitle?: string; // e.g. "We proudly serve these locations"
     footerLink?: HeaderDropdownItem; // e.g. "View all service areas →"
     footerCta?: HeaderDropdownItem; // e.g. "Get Free Quote" button
   }

   export interface HeaderNavDropdownProps {
     config: HeaderDropdownConfig;
     label: string;
     variant?: "dark" | "light";
   }

   export function HeaderNavDropdown(props: HeaderNavDropdownProps): JSX.Element;
   ```

   Behaviour:
   - **Resolve groups:** if `config.groups` is present, use it. Else if `config.items` is present and `mode` defaults to/is `"mega"`, call `buildAlphaColumns(items, columns ?? 4)`. Else `"list"` mode renders `items` as a flat grid.
   - **Mega render:** 4-column responsive grid (`grid-cols-2 md:grid-cols-4 gap-4`), each column has a group header (`<Link>` styled as in current `MegaMenuDropdown`) and a `<ul>` of items with the circle-bullet marker. Preserve the visual style of lines 308-357 of `locations-dropdown.tsx`.
   - **List render:** flat `<div>` grid. Responsive cols: `items.length > 16 → grid-cols-4`, `> 8 → grid-cols-3`, `> 4 → grid-cols-2`, else `grid-cols-1`. Wider container (`max-w-[min(720px,calc(100vw-2rem))]`). Each item `whitespace-nowrap` to prevent mid-word wrap.
   - **Header strip** (if `title` or `subtitle`): render above the grid with border-b, matching the existing simple dropdown header style (lines 232-246 of `locations-dropdown.tsx`).
   - **Footer strip** (if `footerLink` and/or `footerCta`): render below the grid with border-t. `footerLink` renders as a link; `footerCta` renders as a CTA-styled link (existing pattern lines 367-381 of `locations-dropdown.tsx`).
   - **Interactivity:** trigger button uses `aria-expanded`, `aria-haspopup="true"`, `aria-controls` pointing to the dropdown id. Reuse existing keyboard handling: arrow keys move focus within, Tab/Esc close and return focus to trigger, Escape closes, click outside closes. Use `useFocusTrap`.
   - **Variants:** `dark` uses `bg-surface-inverse`, `border-white/10`, `text-white` variants; `light` uses `bg-surface-card`, `border-surface-subtle`, `text-surface-foreground`. Match the token usage already in `locations-dropdown.tsx`.
   - **No hardcoded strings:** no "Service Areas" or "Our Coverage Areas" literals — those come from `config.title`/`config.subtitle`. If both are undefined, render no header strip at all.
   - **Use theme tokens only.** No hex colours. No new Tailwind utility classes outside the Theme Component Contract.

4. Edit `packages/core-components/src/index.ts` — add:

   ```ts
   export { HeaderNavDropdown } from "./components/ui/header-nav-dropdown";
   export type {
     HeaderDropdownConfig,
     HeaderNavDropdownProps,
   } from "./components/ui/header-nav-dropdown";
   ```

### Verification gate — STOP if this fails

```bash
pnpm --filter @platform/core-components type-check
```

### Commit

```
feat(core-components): add HeaderNavDropdown generic primitive

Category-agnostic header dropdown. Supports flat lists (auto
alpha-grouped in mega mode) and pre-grouped mega-menus. Reuses
focus trap, keyboard nav, and theme tokens from LocationsDropdown.
```

---

## Phase 3 — Dispatch via per-item `dropdown` config in `SiteHeader` + legacy adapter

**Goal:** Make `SiteHeader` generic. Colossus's bug is fixed here — via the legacy adapter, with zero changes to Colossus's site code.
**Model:** sonnet — two files with interrelated changes; careful type + adapter wiring.

### Steps

1. Read `packages/core-components/src/components/ui/site-header.tsx` in full.
2. Read `packages/core-components/src/components/ui/locations-dropdown.tsx` in full (already read in Phase 2).
3. Edit `packages/core-components/src/components/ui/site-header.tsx`:
   - Import `HeaderNavDropdown` and `HeaderDropdownConfig` from the new primitive.
   - Extend `SiteHeaderNavItem`:

     ```ts
     export interface SiteHeaderNavItem {
       label: string;
       href: string;
       /** @deprecated Use `dropdown` instead. */
       hasDropdown?: boolean;
       dropdown?: HeaderDropdownConfig;
     }
     ```

   - Mark `counties`, `locations`, `maxTownsPerCounty` on `SiteHeaderProps` with `/** @deprecated Pass per-item `dropdown`config on`navigation` items instead. */`.
   - Replace the dropdown branch (currently lines 127-147, the `if (item.hasDropdown && (counties.length > 0 || locations.length > 0))` path) with this dispatch logic:

     ```ts
     // 1. Explicit per-item dropdown config wins.
     if (item.dropdown) {
       return (
         <HeaderNavDropdown
           key={item.href}
           config={item.dropdown}
           label={item.label}
           variant={isDark ? "dark" : "light"}
         />
       );
     }

     // 2. Legacy adapter: synthesise a config from top-level props.
     if (item.hasDropdown && (counties.length > 0 || locations.length > 0)) {
       const legacyConfig: HeaderDropdownConfig =
         counties.length > 0
           ? {
               mode: "mega",
               groups: counties.map((c) => ({
                 label: c.name,
                 items: c.towns
                   .slice(0, maxTownsPerCounty)
                   .map((t) => ({ label: t.name, href: t.href })),
               })),
               title: "Our Coverage Areas",
               subtitle: "Professional services across the region",
               footerCta: { label: "Get Free Quote", href: "/contact" },
             }
           : {
               mode: "mega",
               items: locations.map((l) => ({
                 label: l.name,
                 href: `/locations/${l.slug}`,
               })),
               title: "Service Areas",
               subtitle: "We proudly serve these locations",
               footerLink: {
                 label: "View all service areas →",
                 href: "/locations",
               },
             };
       return (
         <HeaderNavDropdown
           key={item.href}
           config={legacyConfig}
           label={item.label}
           variant={isDark ? "dark" : "light"}
         />
       );
     }

     // 3. Plain nav link.
     return (
       <Link key={item.href} href={item.href} className={navLinkClasses}>
         {item.label}
       </Link>
     );
     ```

   - Remove the now-unused `LocationsDropdown` import from this file.

4. Edit `packages/core-components/src/components/ui/locations-dropdown.tsx`:
   - Delete the `SimpleDropdown` and `MegaMenuDropdown` internal components.
   - Rewrite `LocationsDropdown` as a thin shim that maps its legacy props into `HeaderDropdownConfig` and delegates to `HeaderNavDropdown`:

     ```ts
     "use client";
     import { HeaderNavDropdown, type HeaderDropdownConfig } from "./header-nav-dropdown";

     export interface LocationItem { name: string; slug: string }
     export interface CountyGroup {
       name: string;
       slug: string;
       href: string;
       towns: Array<{ name: string; slug: string; href: string }>;
     }

     export interface LocationsDropdownProps {
       locations?: LocationItem[];
       counties?: CountyGroup[];
       maxTownsPerCounty?: number;
       label?: string;
       variant?: "dark" | "light";
     }

     /**
      * @deprecated Use HeaderNavDropdown with a `dropdown` config on the
      * nav item instead. This wrapper remains for backwards compat only.
      */
     export function LocationsDropdown({
       locations = [],
       counties = [],
       maxTownsPerCounty = 10,
       label = "Locations",
       variant = "light",
     }: LocationsDropdownProps): JSX.Element {
       const config: HeaderDropdownConfig =
         counties.length > 0
           ? {
               mode: "mega",
               groups: counties.map((c) => ({
                 label: c.name,
                 items: c.towns
                   .slice(0, maxTownsPerCounty)
                   .map((t) => ({ label: t.name, href: t.href })),
               })),
               title: "Our Coverage Areas",
               subtitle: "Professional services across the region",
               footerCta: { label: "Get Free Quote", href: "/contact" },
             }
           : {
               mode: "mega",
               items: locations.map((l) => ({
                 label: l.name,
                 href: `/locations/${l.slug}`,
               })),
               title: "Service Areas",
               subtitle: "We proudly serve these locations",
               footerLink: {
                 label: "View all service areas →",
                 href: "/locations",
               },
             };
       return <HeaderNavDropdown config={config} label={label} variant={variant} />;
     }
     ```

   - Keep `LocationItem` and `CountyGroup` exports so any direct importers don't break.

### Verification gate — STOP if this fails

Run these three commands in parallel (independent reads/type-checks):

```bash
# G3a (parallel)
pnpm --filter @platform/core-components type-check
pnpm --filter @platform/themes type-check
```

Then run sequentially (builds must not overlap):

```bash
pnpm --filter dj-fox-electrical build
pnpm --filter colossus-scaffolding build
```

All four must pass. Any failure → STOP.

### Commit

```
refactor(site-header): dispatch to HeaderNavDropdown via per-item config

SiteHeader nav items now accept a generic dropdown config. A legacy
adapter upgrades flat locations lists to alpha-grouped mega-menus
automatically, fixing Colossus's 37-location overlap bug without
changes to that site. LocationsDropdown is now a deprecated
compatibility wrapper.
```

---

## Phase 4 — Dedupe DJ Fox's `buildAlphaGroups`

**Goal:** Remove the local copy in favour of the shared helper. No behaviour change.
**Model:** haiku — mechanical import swap + call-site rewrite.

### Steps

1. Read `sites/dj-fox-electrical/lib/page-data.ts` in full.
2. Delete the local `buildAlphaGroups(towns)` function (around lines 66-84).
3. Import `buildAlphaColumns` from `@platform/core-components` (barrel import — this is a UI helper, not a factory).
4. Update the call site that produced `headerCounties`:

   ```ts
   // Before:
   const headerCounties = buildAlphaGroups(allTownsSorted);

   // After:
   const headerCounties = buildAlphaColumns(
     allTownsSorted.map((t) => ({ label: t.name, href: `/locations/${t.slug}` }))
   );
   ```

5. If the downstream consumer of `headerCounties` expects the old `{ name, slug, href, towns: [{ name, slug, href }] }` shape: inspect `sites/dj-fox-electrical/components/site-header.tsx` and `siteData.header` usage. The new shape is `{ label, items: [{ label, href }] }`. Two options:
   - **Preferred:** update `siteData.header` to pass the new shape directly as `dropdown` config on the Locations nav item rather than as `counties` at the header level. This starts migrating DJ Fox to the new per-nav-item pattern.
   - **Minimal:** transform at the call site — `.map((g) => ({ name: g.label, slug: g.label.toLowerCase(), href: "/locations", towns: g.items.map((i) => ({ name: i.label, slug: i.href.split("/").pop() ?? "", href: i.href })) }))`.

   Choose the **preferred** path: pass the new shape as `navigation[].dropdown`, remove `counties` from `siteData.header`, and slim down `sites/dj-fox-electrical/components/site-header.tsx` to not forward `counties`/`maxTownsPerCounty`. This is more invasive but is the correct long-term shape. If doing so requires changes to `composition.json` or more than the above two files, STOP and record the blocker.

6. Edit `sites/dj-fox-electrical/components/site-header.tsx` to drop `counties` and `maxTownsPerCounty` from its props interface and the forwarded props.

### Verification gate — STOP if this fails

```bash
pnpm --filter dj-fox-electrical build
```

Then start the dev server and visually confirm no regression:

```bash
cd sites/dj-fox-electrical && pnpm dev
# Visual: Locations dropdown pixel-identical to before.
# STOP the dev server after confirming.
```

If any visual regression, STOP and report.

### Commit

```
refactor(dj-fox-electrical): use shared buildAlphaColumns helper

Removes local buildAlphaGroups in favour of the shared core-components
helper. Moves header counties into the navigation[].dropdown config
as a step toward the generic nav dropdown pattern. No visual change.
```

---

## Phase 5 — Audit other sites and theme wrappers

**Goal:** Confirm no other site-local wrappers strip the new `navigation[].dropdown` field or depend on the old `counties`/`locations` prop shape in a way we missed.
**Model:** haiku — grep + read audit, no edits unless a real issue surfaces.

### Steps

1. Spawn parallel grep tasks (single Task-tool message):
   - Task A (haiku): `grep -rn "SiteHeaderNavItem\|hasDropdown" sites/ packages/themes/` — list every occurrence.
   - Task B (haiku): `grep -rn "VegaHeader\|OrionHeader\|LocationsDropdown" sites/ packages/themes/` — list every import/call site.

2. For each theme-package header found (`packages/themes/{vega,orion,cygnus,castor,solaris}/components/header.tsx`): read it and confirm it is a `{...props}` passthrough. If any destructures `navigation` and rebuilds it in a way that would strip the new `dropdown` field, fix it to forward untouched.
3. For each site's local `components/site-header.tsx` (e.g. `dj-fox-electrical-test`, `dj-fox-electrical-legacy`): read and confirm passthrough. If broken, fix.
4. No commit if audit is clean. If fixes are needed, make them minimal and commit:

### Verification gate — STOP if this fails

```bash
# G5 (parallel, read-only)
pnpm type-check
pnpm lint
```

### Commit (only if fixes were made)

```
fix(themes): forward navigation[].dropdown through header wrappers

Audit found [list affected files] stripping the new dropdown field.
Fixes ensure the generic nav dropdown pattern works across all themes.
```

If no fixes needed, note "No changes required — all headers are passthroughs" in the final report and skip the commit.

---

## Phase 6 — Add Services smoke test

**Goal:** Permanent proof that the generic path works for non-location data.
**Model:** sonnet — writing a new test requires some judgement on fixtures/harness.

### Steps

1. Check whether `@platform/core-components` has a Vitest + React Testing Library harness:

   ```bash
   ls packages/core-components/package.json
   cat packages/core-components/package.json | grep -E '"test"|vitest|testing-library'
   ```

2. **If a test harness exists:** create `packages/core-components/src/components/ui/__tests__/site-header.test.tsx` (or add to an existing test file for `SiteHeader` if present). The test must:
   - Render `<SiteHeader>` with `navigation` containing a Services item with `dropdown: { mode: "mega", items: [{ label: "Electrical Testing", href: "/services/testing" }, { label: "Fuse Board Upgrades", href: "/services/fuse-board-upgrades" }, ...at least 10 items...], title: "Our Services" }`.
   - Provide required props (`siteName`, `primaryCta`, etc.) with minimal fixtures.
   - Assert: rendered output contains each service label.
   - Assert: no dependency on `locations` or `counties` props — do NOT pass them.
   - Assert (minimal): the dropdown trigger button has `aria-expanded` or equivalent.

3. **If no test harness exists:** do NOT scaffold one. Instead, add a `// @smoke-test` file at `packages/core-components/src/components/ui/header-nav-dropdown.fixture.ts` that exports a realistic Services fixture any future test or dev story can consume:

   ```ts
   import type { HeaderDropdownConfig } from "./header-nav-dropdown";

   export const SERVICES_DROPDOWN_FIXTURE: HeaderDropdownConfig = {
     mode: "mega",
     items: [
       { label: "Electrical Testing", href: "/services/testing" },
       { label: "Fuse Board Upgrades", href: "/services/fuse-board-upgrades" },
       // ... 10+ items total
     ],
     title: "Our Services",
   };
   ```

   Also export it from `packages/core-components/src/index.ts`. Document in the commit message that no test runner was found and that the fixture substitutes for the test.

### Verification gate — STOP if this fails

```bash
# If test harness exists:
pnpm --filter @platform/core-components test

# Either way:
pnpm --filter @platform/core-components type-check
```

### Commit

```
test(site-header): verify HeaderNavDropdown works for non-location categories

Proves that Services (or any other category) can opt into the mega-menu
by setting navigation[].dropdown — no SiteHeader changes needed per
category.
```

---

## Phase 7 — Final repo-wide verification

**Goal:** Full-repo green before merge.
**Model:** sonnet — orchestrates the verification and final report.

### Steps

1. Run the full verification suite:

   ```bash
   # G7 (parallel — lint and type-check are read-only and independent)
   pnpm lint
   pnpm type-check
   ```

2. Then run builds sequentially (builds write to `.next/` and `dist/`):

   ```bash
   pnpm build
   ```

3. If `pnpm build` fails in any site, STOP and report.

4. Manual QA checklist — start each dev server, spot-check, STOP the server before moving on:

   ```bash
   cd sites/colossus-scaffolding && pnpm dev
   # Visual: Locations dropdown renders 4-column A-Z mega-menu, no overlap.
   # Keyboard: Tab into Locations, Enter opens, arrows navigate, Esc closes.
   # STOP dev server.

   cd sites/dj-fox-electrical && pnpm dev
   # Visual: Locations dropdown pixel-parity with pre-change state.
   # Variant: dark theme colours correct.
   # STOP dev server.
   ```

5. If a visual regression appears on either site, STOP and report before any final commit.

No additional commit in this phase unless a final fix is required.

### Verification gate — STOP if this fails

```bash
pnpm lint && pnpm type-check && pnpm build
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed.

### Intra-phase groups

| Group | Phase          | Items                                                                                                                                                  | File overlap      | Model  | Rationale                                                                    |
| ----- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- | ------ | ---------------------------------------------------------------------------- |
| G1    | Phase 1        | — no parallel work in this phase —                                                                                                                     | —                 | sonnet | Single-file pure function extraction; index.ts edit depends on the new file. |
| G2    | Phase 2        | — no parallel work in this phase —                                                                                                                     | —                 | sonnet | Single component file + one barrel edit; sequential.                         |
| G3a   | Phase 3 verify | Run `pnpm --filter @platform/core-components type-check`, Run `pnpm --filter @platform/themes type-check`                                              | none (read-only)  | n/a    | Independent type-checks; safe to parallelise.                                |
| G3b   | Phase 3 verify | — builds run sequentially —                                                                                                                            | `.next/`, `dist/` | n/a    | `pnpm build` writes artefacts; serialise.                                    |
| G4    | Phase 4        | — no parallel work in this phase —                                                                                                                     | —                 | haiku  | Two files (`page-data.ts`, `components/site-header.tsx`) but interdependent. |
| G5    | Phase 5        | Grep `SiteHeaderNavItem\|hasDropdown` in sites/ and packages/themes/, Grep `VegaHeader\|OrionHeader\|LocationsDropdown` in sites/ and packages/themes/ | none (read-only)  | haiku  | Independent audit greps.                                                     |
| G5v   | Phase 5 verify | Run `pnpm lint`, Run `pnpm type-check`                                                                                                                 | none (read-only)  | n/a    | Independent verification commands.                                           |
| G6    | Phase 6        | — no parallel work in this phase —                                                                                                                     | —                 | sonnet | Single test file or single fixture file.                                     |
| G7    | Phase 7 verify | Run `pnpm lint`, Run `pnpm type-check`                                                                                                                 | none (read-only)  | n/a    | Independent verification. Then `pnpm build` runs alone afterwards.           |

### Cross-phase groups (only if phases are truly independent)

| Group  | Phases | Items | Rationale                                          |
| ------ | ------ | ----- | -------------------------------------------------- |
| (none) |        |       | Phases are strictly ordered by verification gates. |

### Sequential points — MUST NOT parallelise

| Item                                                                   | Reason                                                                                                                       |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Verification gates between phases (`pnpm type-check`, `pnpm build`)    | Each phase's output gates the next. Gates are the synchronisation barrier.                                                   |
| Git commits                                                            | One commit per phase, in order. Commits are never batched.                                                                   |
| `pnpm build` commands                                                  | Writes to `.next/` and `dist/`; concurrent runs corrupt output.                                                              |
| Dev server runs in Phase 4 and Phase 7                                 | Use a shared port; only one at a time.                                                                                       |
| Phase 3's two-file edit (`site-header.tsx` + `locations-dropdown.tsx`) | The two files import from each other after the edit; edit them sequentially in one agent to keep the working state coherent. |

---

## Cost Estimate

| Phase                                                 | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ----------------------------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: buildAlphaColumns extraction                 | sonnet | ~8k               | ~1k                | $0.04      |
| Phase 2: HeaderNavDropdown primitive                  | sonnet | ~15k              | ~3k                | $0.09      |
| Phase 3: SiteHeader dispatch + LocationsDropdown shim | sonnet | ~18k              | ~3k                | $0.10      |
| Phase 4: DJ Fox dedupe                                | haiku  | ~6k               | ~1k                | $0.01      |
| Phase 5: audit                                        | haiku  | ~8k               | ~0.5k              | $0.01      |
| Phase 6: Services test/fixture                        | sonnet | ~6k               | ~1k                | $0.03      |
| Phase 7: final verify + QA                            | sonnet | ~8k               | ~0.5k              | $0.03      |
| **Total**                                             |        | **~69k**          | **~10k**           | **~$0.31** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Estimation basis: ~5 tokens per line of code. Input = files read + brief (~10k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. **Phases completed** — list each with commit SHA (`git log --oneline develop..HEAD`).
2. **Build status** — confirm `pnpm lint && pnpm type-check && pnpm build` passes.
3. **Any exceptions or intentional deviations** from the plan (e.g. "Phase 6 used fixture path because no test harness found").
4. **Token usage and cost estimate:**

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | opus      | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from files read (lines × 5) and written (lines × 5). Compare to the pre-flight Cost Estimate above. For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-21_nav-dropdown-generalisation/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-04-21
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises, visual QA result]

### Commits

[list each commit SHA and message — format: `<sha> <subject>`]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

```
/wrap-up-session
```

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.** The groups block is the authoritative execution plan.
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6` not `Opus 4.6`)
- **No pipeline or theme package creation in this work** — all changes are to `@platform/core-components` and two consumer sites. `pnpm pipeline:smoke` is NOT required.
- All writes stay within `/Users/rickywilson/Sites/local-business-platform/` — no `--additionalDirectories` needed.

## Completed

**Date:** 2026-04-21
**Status:** All phases executed successfully

All 7 phases implemented cleanly. Phase 1 extracted `buildAlphaColumns` as a pure shared helper. Phase 2 created `HeaderNavDropdown` — a generic client dropdown reusing `useFocusTrap`, keyboard nav, and theme tokens from the old `LocationsDropdown`. Phase 3 wired `SiteHeader` to dispatch to `HeaderNavDropdown` via per-item `dropdown` config, with a legacy adapter that fixes Colossus's 37-location overlap with zero site-code changes. Phase 4 deduped DJ Fox's local helper and migrated to the per-nav-item `dropdown` pattern. Phase 5 audited all theme headers — Vega and Orion are `{...props}` passthroughs; Cygnus has its own rendering but doesn't strip `dropdown`; no fixes needed. Phase 6 added 5 passing smoke tests for the Services mega-menu path. Phase 7: full monorepo build passed (11/11), lint clean (no errors), type-check clean. Visual QA on both Colossus and DJ Fox confirmed `header-nav-dropdown`, `aria-haspopup`, and "Service Areas" rendered correctly. No regressions detected.

### Commits

- `dd3eb47 feat(core-components): extract buildAlphaColumns shared helper`
- `35432ef feat(core-components): add HeaderNavDropdown generic primitive`
- `47fe2e2 refactor(site-header): dispatch to HeaderNavDropdown via per-item config`
- `3ba2656 refactor(dj-fox-electrical): use shared buildAlphaColumns helper`
- `2196050 test(site-header): verify HeaderNavDropdown works for non-location categories`
