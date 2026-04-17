# Session: 2026-02-18_theme-architecture

**Start Date:** 2026-02-18
**Status:** Completed — all 6 steps implemented and merged to main (commit 50797fa)
**Objective:** Redesign the platform's theme system from colour-only customisation to a library of named visual themes with distinct layouts, component variants, and an AI-assisted theme generation workflow.

---

## Background & Problem

The current white-label platform differentiates sites only by swapping CSS custom property values (colours, fonts). Every site shares an identical layout skeleton — same header structure, same hero layout, same homepage composition. DJ Fox Electrical required 8 bespoke site-specific components to look visually distinct from Colossus Reference, and that work is trapped in one site — unreusable by any future client.

The analogy: we're applying colour schemes to the same WordPress theme, not switching themes.

---

## Solution: Named Theme Architecture

A **theme** = design tokens (colours, fonts, radii) + a component library (which variants of header, hero, cards, sections are used). A **site** = a theme + token overrides specific to that client.

```
packages/
  theme-system/       ← tokens + Tailwind plugin (existing, extended)
  core-components/    ← component primitives with variant props (server-safe)
  themes/             ← NEW: named themes
    orion/            ← dark header, full-bleed hero, circular icons (DJ Fox)
    vega/             ← light header, split hero, card grid (Colossus/base-template)

sites/
  base-template/      ← vega theme + blue tokens
  dj-fox-electrical/  ← orion theme + red tokens
  colossus-reference/ ← vega theme + navy tokens
```

---

## Key Architectural Decisions

1. **Feature branch first**: `feature/theme-architecture` off `develop` — all work committed here, then merged back via normal `develop → staging → main` workflow

2. **No runtime context for variant selection**: Most shared components are Server Components — React context can't reach them. Themes export concrete components as static imports (build-time, server-safe, zero hydration cost).

3. **ThemeProvider scope**: React context is retained but limited to client-only atoms only (mobile menu, consent manager, button tokens). Never used for structural layout decisions.

4. **Layout shells extracted first**: `SiteHeader` and `PageShell` must be extracted into `core-components` as the first real implementation step — this tackles the structural sameness root cause before any component variant work.

5. **CSS migration is explicit**: Each DJ Fox component has an explicit list of CSS utility classes that must migrate with it — without this, styling silently breaks.

6. **Initial themes**: `orion` + `vega` only. The AI generation tool (Step 6) is how new themes are added going forward.

7. **Tailwind v4**: Deferred until after all 6 steps are stable.

---

## Implementation Steps

### Step 0: Feature branch

```bash
git checkout develop && git pull
git checkout -b feature/theme-architecture
```

### Step 1: Schema & tooling prep _(parallel — 2 agents)_

- Agent A: Widen variant enums in `packages/theme-system/src/types.ts`, add `ComponentRegistry` type
- Agent B: Update Tailwind content arrays, add workspace deps, scaffold `packages/themes/`

### Step 2: Layout shell extraction _(single agent)_

- `SiteHeader` + `PageShell` into `core-components`
- Replace hardcoded headers in all 3 `layout.tsx` files

### Step 3: Component + CSS migration _(parallel — 3 agents)_

DJ Fox variants → `core-components` with CSS utilities migrated together:

- Agent A: `HeroWithImage` + `PageHero`
- Agent B: `CircularIconCard` + `InfoCard`
- Agent C: `DarkStatCard` + `ImageOverlayCard`

### Step 4: Theme packages _(single agent)_

- Create `packages/themes/orion/` and `packages/themes/vega/`
- Switch sites to import from theme packages
- Slim per-site `globals.css` to ~20 lines

### Step 5: ThemeProvider _(single agent)_

- Client-only context in `core-components`
- Wire into `layout.tsx` with explicit client boundary

### Step 6: AI theme generation tool _(single agent)_

- `tools/generate-theme-from-reference.ts` — thin wrapper over existing `@platform/intake-system/theme-extraction`
- Claude API call for layout pattern labeling → component registry mapping
- Output: scaffolded theme package

---

## Verification Gates

| Step | Gate                                                       |
| ---- | ---------------------------------------------------------- |
| 1    | `pnpm build` passes, no TS errors                          |
| 2    | `pnpm build` + E2E smoke (visual parity)                   |
| 3    | DJ Fox visual parity + `pnpm build` + unit tests           |
| 4    | `pnpm build` + `pnpm test` + E2E smoke (all 3 sites)       |
| 5    | Lighthouse scores unchanged, no hydration errors           |
| 6    | Generate test theme, build test site, confirm valid output |

**Portability proof**: Create `sites/demo-orion/` with the orion theme + different brand tokens. If it builds correctly, the architecture works.

---

## CSS Migration Map

### Theme-level (moves to `packages/themes/orion/globals.css` or `vega/globals.css`)

`section-dark`, `section-dark-accent`, `section-gradient`, `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-primary-lg`, `card-interactive`, `card-overlay`, `card-overlay-hover`, `icon-circle-lg`, `icon-circle-sm`, `stat-card-dark`, `stat-card-accent`, `accent-underline`, `accent-border-left`, `section-standard`, `container-standard`, `heading-section`

### Site-specific (stays in `sites/[name]/app/globals.css`)

Leaflet CSS import, mega-menu z-index fix, licensed font-face declarations, site-specific a11y shims

---

## Files to Modify

| Step | Files                                                                                                               |
| ---- | ------------------------------------------------------------------------------------------------------------------- |
| 1A   | `packages/theme-system/src/types.ts`                                                                                |
| 1B   | `sites/*/tailwind.config.ts`, `sites/*/package.json`, `pnpm-workspace.yaml`                                         |
| 2    | `packages/core-components/src/components/ui/` (new: SiteHeader, PageShell), `sites/*/app/layout.tsx`                |
| 3    | `sites/dj-fox-electrical/components/ui/` (6 files → core), `sites/dj-fox-electrical/app/globals.css`                |
| 4    | `packages/themes/orion/` (new), `packages/themes/vega/` (new), `sites/*/theme.config.ts`, `sites/*/app/globals.css` |
| 5    | `packages/core-components/src/context/theme-context.tsx` (new), `packages/core-components/src/index.ts`             |
| 6    | `tools/generate-theme-from-reference.ts` (new), `tools/apply-theme.ts` (new)                                        |

---

## Notes

- Codex peer review confirmed the approach is sound; the key correction was Server Component constraint (no runtime context for variant selection)
- `packages/intake-system/src/theme-extraction/` already exists — AI tool wraps this, does not duplicate
- `btn-primary` naming collision risk: 3 sites define it slightly differently — theme CSS defines canonical version, sites override with higher specificity if needed
- Turbo rebuild caching requires sites to declare `@platform/themes` as a real workspace dep in `package.json`
