# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-02-19_migrate-core-components-to-theme-tokens/`

When done, tell the user to run `/plan.with.codex synthesise` in Claude Code.

---

## Brief: Migrate core-components to Theme System Tokens

**Date:** 2026-02-19
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

---

### Problem Statement

The Local Business Platform is a white-label monorepo where swapping a `theme.config.ts` file is meant to fully re-theme a client site. This works through a chain: config → CSS custom properties → Tailwind utilities → component classes. But a large proportion of `packages/core-components` components bypass this chain entirely, using hardcoded Tailwind classes like `text-gray-900`, `bg-white`, and `border-gray-200` instead of the token-backed equivalents (`text-surface-foreground`, `bg-surface-card`, `border-surface-card-border`).

The problem exists at two levels:

**Level 1 — Component classes (primary problem):** 336+ hardcoded color instances across ~56 component files. Common patterns:
- `text-gray-900`, `text-gray-800`, `text-gray-700`, `text-gray-600` → should map to surface tokens
- `bg-white`, `bg-gray-50`, `bg-gray-100` → should map to surface/card tokens
- `border-gray-200`, `border-gray-300` → should map to surface-card-border tokens
- `text-white` on brand-colored backgrounds → needs `text-on-brand-primary`
- `bg-black` in dark sections → needs a dark surface token

**Level 2 — Token system gaps (must fix first):** The existing token set doesn't cover all the surface variants that components need:
- Missing: secondary/tertiary text colors (`text-gray-700` has no token equivalent)
- Missing: subtle background variants (`bg-gray-50` has no token equivalent)
- Missing: `text-on-brand-primary` (safe contrast text for brand-colored backgrounds)
- Missing: dark surface token (`bg-black` in dark header sections)
- The typography utilities (`.text-h1` etc.) may not set `font-family`, so heading font only applies if combined with `font-heading` — this needs investigation

**Level 3 — Theme CSS files (secondary):** The vega and orion `globals.css` theme files define utility classes using `@apply`, but some of those `@apply` calls hardcode colors (e.g. `@apply text-gray-900`) rather than using surface tokens.

Three components already demonstrate correct implementation: `LocationHero`, `TestimonialCard`, and `FaqSection`. These are the gold standard to follow.

---

### Constraints

1. **Server Components only in core-components layouts.** `packages/core-components` uses React Server Components for all layout and content components. No `useContext`, no `useState`, no dynamic reads of theme at runtime. The theme system works through CSS variables set at build time — not runtime.

2. **No new JavaScript theme-switching.** All theming must be CSS-only. Do not introduce runtime theme detection or dynamic class application via JS.

3. **Backward compatibility in token names.** Existing token names (`bg-brand-primary`, `text-surface-foreground`, `border-surface-card-border`) must not change — these are already in use by the three correct components. New tokens may be added, existing ones may not be renamed.

4. **Token definitions live in the theme-system package.** All CSS variable definitions and Tailwind utilities belong in `packages/theme-system/`. Named themes (`packages/themes/vega/`, `packages/themes/orion/`) provide default values. Individual sites may override via `theme.config.ts`.

5. **No site-level changes until tokens and components are confirmed.** The migration should be testable in `packages/` before touching any `sites/` files.

6. **MDX content is not affected.** Content files (`content/`) have no color classes and are out of scope.

7. **The build must remain green throughout.** Each phase should be independently verifiable — meaning no broken builds mid-migration.

8. **Proportionality.** 336 hardcoded instances across 56 files is a lot of changes. The plan must prioritise: high-impact components first (SiteHeader, ServiceHero, ContentCard, mobile-menu) and consider whether a Tailwind linting rule (or similar enforcement) should come before or after the manual migration.

---

### Relevant Architecture

**Theme System** (`packages/theme-system/`):
- `src/types.ts` — `ThemeConfig` TypeScript interface defining all token categories
- `src/generate-css.ts` — `generateCssVariables()` outputs `:root { --color-brand-primary: ...; }` from a ThemeConfig
- `src/tailwind-plugin.ts` — Tailwind plugin that creates utility classes referencing the CSS variables
- `src/defaults.ts` — Default theme values (blue brand, gray surfaces, Inter font)
- `src/index.ts` — Package exports

**Named Themes** (`packages/themes/`):
- `vega/index.ts` — Exports `vegaRegistry`, `vegaDefaults` (light header, professional)
- `orion/index.ts` — Exports `orionRegistry`, `orionDefaults` (dark header, industrial)
- Each theme may export a `globals.css` that defines theme-specific utility classes via `@apply`

**Core Components** (`packages/core-components/src/components/ui/`):
- ~56 component files
- Gold standard (correct): `LocationHero.tsx`, `TestimonialCard.tsx`, `FaqSection.tsx`
- High-priority to fix: `SiteHeader.tsx`, `MobileMenu.tsx`, `ServiceHero.tsx`, `ContentCard.tsx`

**Sites** (`sites/`):
- `sites/base-template/` — Gold-standard template, vega theme, ~20-line `globals.css`
- `sites/dj-fox-electrical/` — Live production site, orion theme
- `sites/colossus-scaffolding/` — Reference site, vega theme

**Site `globals.css` pattern** (correct):
```css
@import "../../../packages/themes/vega/globals.css";
@tailwind base;
@tailwind components;
@tailwind utilities;
/* 5-10 lines of site-specific overrides maximum */
```

---

### Codebase Snapshot

**Token utilities currently available** (Tailwind classes referencing CSS vars):

Colors:
```
bg-brand-primary, text-brand-primary, border-brand-primary
bg-brand-secondary, text-brand-secondary
bg-brand-accent, text-brand-accent
bg-surface-background, bg-surface-muted, bg-surface-card
text-surface-foreground, text-surface-muted-foreground
border-surface-card-border
bg-overlay-dark, bg-overlay-light, bg-overlay-primary
bg-success, bg-warning, bg-error, bg-info
text-success, text-warning, text-error, text-info
```

Typography:
```
text-hero, text-h1, text-h2, text-h3, text-h4, text-body, text-small, text-caption
```
(Each is a composite utility setting size + lineHeight + letterSpacing + weight)

Navigation/Component:
```
h-nav, pt-nav, mt-nav (navigation height)
shadow-card (card shadow)
rounded-card, rounded-button
```

**Currently missing tokens** (that would eliminate most hardcoded classes):
```
text-surface-secondary      ← replaces text-gray-700
text-surface-tertiary       ← replaces text-gray-600
bg-surface-subtle           ← replaces bg-gray-50 / bg-gray-100
border-surface-subtle       ← replaces border-gray-200 / border-gray-300
text-on-brand-primary       ← replaces text-white on brand-colored BGs
bg-surface-dark             ← replaces bg-black in dark sections
```

**TypeScript types** (from `packages/theme-system/src/types.ts`):
```typescript
interface ThemeConfig {
  colors: {
    brand: { primary, primaryHover, secondary, accent }
    surface: { background, foreground, muted, mutedForeground, card, cardBorder }
    semantic: { success, warning, error, info }
    overlay: { dark, light, primary }
  }
  typography: { ... }
  spacing: { ... }
  radii: { ... }
  shadows: { ... }
  components: {
    navigation: { style, height }
    button: { radius, paddingX, paddingY }
    card: { radius, shadow, padding }
    hero: { variant }
  }
}
```

---

### What a Good Plan Should Cover

1. **Where to add missing tokens** — Which new entries go in `ThemeConfig`, `defaults.ts`, theme CSS, and `tailwind-plugin.ts`? In what order?

2. **How to validate the token system works** before touching components — What's the smoke test?

3. **Prioritisation of component migration** — Which 5-10 components should be done first for maximum impact? Should the full 56-file sweep be automated or manual?

4. **The typography question** — Do `.text-h1` etc. currently set `font-family`? If not, is that a plugin fix or a component-level fix (add `font-heading` alongside `text-h1`)?

5. **Theme CSS cleanup** — How should the `@apply text-gray-900` in vega/orion `globals.css` be resolved?

6. **Enforcement** — Should a `tailwind-plugin/no-hardcoded-colors` ESLint rule be part of this migration, or a follow-up? If follow-up, what's the guard?

7. **Verification gates** — How do you confirm each step worked before moving to the next? (Build? TypeScript check? Visual diff? Content validation?)

8. **Rollout sequence** — Should token additions, plugin updates, component migration, and theme CSS fixes be separate commits? One PR? Multiple PRs?

---

## Deliverable

Produce a numbered implementation plan with:
- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-02-19_migrate-core-components-to-theme-tokens/`.
