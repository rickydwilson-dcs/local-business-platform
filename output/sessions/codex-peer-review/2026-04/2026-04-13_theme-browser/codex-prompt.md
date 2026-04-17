# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04-13_theme-browser/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise
```

---

## Brief: Theme Browser — Kill Showcase, Build Live Theme Preview in DCS

**Date:** 2026-04-13
**Project:** Local Business Platform monorepo (`/Users/rickywilson/Sites/local-business-platform`)
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

---

### Problem Statement

`sites/showcase/` is an abandoned standalone Next.js app that was an early attempt at a theme component browser. It hasn't been used, isn't deployed, and has accrued automation debt: `tools/sync-themes.ts` writes a `register-all-themes.ts` file into it at build time, and `tools/scaffold-theme-package.ts` generates `showcase-registry.tsx` stubs in every new theme package. The site itself has never properly worked.

The goal is to kill showcase entirely and replace it with a working, publicly-accessible (but unlisted) theme browser hosted as a section of the existing DCS site (`sites/dcs/`) at the route `/theme-preview`. This replaces the internal developer tool with something that can also be shown to a client to demonstrate what theme options are available.

---

### Goals

1. Completely remove `sites/showcase/` and all automation that serves it
2. Build `/theme-preview` in `sites/dcs/` as an unlisted section (not in nav, not in sitemap)
3. Gallery page: visual grid of all 11 themes showing their colour identity, font names, and design variant badges
4. Per-theme detail page: **live rendered components** — actually render the theme's Header, a hero section, card grid, and Footer using the theme's real React components with mock content
5. UI kit page: render Solaris (DCS's native theme) components in their native context — buttons, cards, type scale, colour palette
6. All pages are noindex but publicly accessible (no auth)

---

### Non-Goals

- No theme switching / live editor / custom brand colour input
- No side-by-side comparison view
- No screenshot-based previews (components must render live)
- No changes to theme package internals (no new exports from theme packages, no new CSS files)
- No auth / login gate
- No changes to the DCS sitemap or navigation config

---

### Acceptance Criteria

1. `sites/showcase/` directory no longer exists in the repo
2. `pnpm type-check` passes from repo root after changes
3. `pnpm --filter dcs build` completes without error
4. `/theme-preview` returns a grid of theme cards with colour swatches
5. `/theme-preview/orion` renders OrionHeader, a hero section, and OrionFooter using mock content — colours are red/orange (Orion's brand), not Solaris's blue
6. `/theme-preview/solaris` (or `/theme-preview/ui-kit`) renders Solaris's own component set
7. `/theme-preview/polaris` gracefully shows "Design spec — no component implementations yet" since Polaris is token-only
8. None of the `/theme-preview/*` URLs appear in the DCS sitemap or are indexed

---

### Constraints

**Architecture: DCS root layout wraps everything**
`sites/dcs/app/layout.tsx` uses Next.js App Router and wraps all pages with `PageShell` containing `SolarisHeader` and `SolarisFooter`. Nested layouts are ADDITIVE in Next.js — you cannot remove the root layout's frame. Per-theme detail pages will therefore always show within the Solaris nav bar at top and Solaris footer at bottom. This is acceptable — the DCS site is the host frame, and the theme preview content fills the page body.

**CSS isolation: use generateCssVariables()**
`packages/theme-system/src/generate-css.ts` exports `generateCssVariables(config: ThemeConfig): Record<string, string>`. This returns all CSS custom property names and values for a given theme config (e.g. `{ '--color-brand-primary': '#dc2626', '--color-surface-background': '#0f172a', ... }`).

CSS custom properties cascade through the DOM. Setting them via inline `style` on a wrapper div overrides the `:root` values set by the Solaris globals.css — all theme components rendered inside the wrapper will pick up the correct theme colours via Tailwind's `var(--color-brand-primary)` resolution. No changes to theme packages needed.

**No new theme package exports**
The per-theme detail page must import only what already exists:

- Theme config: `import { orionConfig } from '@platform/themes/orion'` (or similar — check actual exports)
- Header/Footer: `import { OrionHeader, OrionFooter } from '@platform/themes/orion/components'`
- Page templates (if available): `import { OrionHomePage } from '@platform/themes/orion/pages'`

If a theme doesn't export page templates, the detail page renders only the Header, a manually composed hero stub, cards, and Footer.

**pnpm workspace: no change needed**
`pnpm-workspace.yaml` uses `sites/*` wildcard. Deleting `sites/showcase/` removes it from the workspace automatically.

**Utility classes are global**
Theme globals.css files set utility classes (`.btn-primary`, `.card`, etc.) using `@apply`. These are defined globally via CSS cascade — only one theme's utility classes can be "active" on any given page (whichever globals.css is imported last wins). On per-theme preview pages within DCS, the Solaris utility classes are the ones active globally. The CSS variable injection approach handles colour tokens correctly, but border-radius, font-weight, etc. in `.btn-primary` will reflect Solaris's values. This is an acceptable limitation — the preview shows colours and visual style accurately, minor component token drift is fine.

---

### Relevant Architecture

**Theme system:**

- `packages/theme-system/src/types.ts` — `ThemeConfig` type (all token paths)
- `packages/theme-system/src/generate-css.ts` — `generateCssVariables(config)` returns `Record<string, string>` of CSS var names → hex values
- `packages/theme-system/src/tailwind-plugin.ts` — the Tailwind plugin that registers `bg-brand-primary` etc. as utility classes pointing to CSS custom properties

**Available themes (11 total):**

- **Full component + page themes (9):** atlas, castor, corvus, cygnus, lyra, nova, orion, solaris, vega — each exports Header, Footer; most export page templates from `pages/`
- **Token-only themes (2):** polaris, sirius — no component implementations

**DCS site:**

- `sites/dcs/app/layout.tsx` — root layout; imports Solaris CSS via `globals.css`, renders `SolarisHeader` + `SolarisFooter` via `PageShell`
- `sites/dcs/app/sitemap.ts` — generates sitemap; must NOT include `/theme-preview/*`
- `sites/dcs/site.config.ts` — nav config; must NOT add theme-preview to navigation

**Showcase (to kill):**

- `sites/showcase/` — entire directory
- `tools/sync-themes.ts` lines 26, 67-69, 124 — showcase-specific logic
- `tools/scaffold-theme-package.ts` — generates `showcase-registry.tsx` in new theme packages

**OrionHeader props:** `siteName, phoneDisplay?, phoneTel?, showPhone?, primaryCta: {label, href}, navigation: [{label, href}], locations: [{name, slug}]`

**SolarisHeader props:** `logoText?, logoSrc?, logoAlt?, navItems: [{label, href}], ctaLabel?, ctaHref?, phone?, showPhone?`

---

### Codebase Snapshot

```
sites/dcs/
├── app/
│   ├── layout.tsx              ← root layout (SolarisHeader/Footer in PageShell)
│   ├── sitemap.ts              ← XML sitemap (must not include /theme-preview)
│   ├── globals.css             ← imports Solaris theme CSS
│   └── [various routes]
├── site.config.ts              ← nav config (must not add theme-preview)
└── package.json

packages/theme-system/src/
├── types.ts                    ← ThemeConfig shape
├── generate-css.ts             ← generateCssVariables(config) → Record<string, string>
└── tailwind-plugin.ts          ← registers CSS var utility classes

packages/themes/
├── orion/                      ← index.ts, components/header.tsx + footer.tsx, pages/
├── solaris/                    ← index.ts, components/header.tsx + footer.tsx, pages/
├── [7 other full themes]
├── polaris/                    ← index.ts + globals.css only (token-only)
└── sirius/                     ← index.ts + globals.css only (token-only)

tools/
├── sync-themes.ts              ← lines 26, 67-69, 124 write to showcase
└── scaffold-theme-package.ts  ← generates showcase-registry.tsx stubs
```

---

### What a Good Plan Should Cover

1. **Showcase removal** — what exactly gets deleted, which tool script lines are removed, and how to verify nothing is broken after removal

2. **DCS routing structure** — how to add `/theme-preview`, `/theme-preview/[name]`, `/theme-preview/ui-kit` without touching existing DCS routes; where the nested layout goes and what it does

3. **CSS injection** — how exactly `generateCssVariables()` output gets applied to the wrapper div, and whether this correctly scopes Tailwind utility class colour resolution

4. **Component rendering for full themes** — how to handle the varying prop interfaces across OrionHeader, SolarisHeader, etc. without writing 9 different sets of mock props; can a shared mock interface satisfy all of them?

5. **Token-only themes** — what does the Polaris/Sirius detail page look like when there are no components to render?

6. **Sitemap exclusion** — how to ensure `/theme-preview/*` doesn't leak into the DCS sitemap

7. **Type safety** — how does the data layer import all theme configs without creating a maintenance burden? Is a static array of imports acceptable or should it use the theme registry?

8. **Build verification** — what to run to confirm the changes work end-to-end

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04-13_theme-browser/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise`
