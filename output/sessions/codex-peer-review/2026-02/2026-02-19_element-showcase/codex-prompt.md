# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-02-19_element-showcase/`

When done, tell the user to run `/plan.with.codex synthesise` in Claude Code.

---

## Brief: Element Showcase Site

**Date:** 2026-02-19
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The white-label platform has two named themes (Orion and Vega) and ~55 shared components in `packages/core-components`. There is currently no way for developers or future users to:

1. See what UI elements are available across the platform
2. Visually compare how the same element looks in Orion vs Vega themes
3. Verify that new theme variants render correctly without deploying a full client site

The goal is to build a dedicated showcase site (`sites/showcase`) as a Next.js app within the existing Turborepo monorepo. It should render real components (not mockups) with placeholder/fake content, display them side-by-side across themes, and provide a browsable library with category filtering.

This is a developer/internal tool only — it does not need production deployment.

### Constraints

- **Server Components by default.** Next.js 15 app router; components from `@platform/core-components` are Server Components. React context (ThemeProvider) is client-only and cannot be used in layout-level component selection.
- **Tailwind is build-time.** The theme system works by: (a) each site has a `tailwind.config.ts` that calls `createThemePlugin(themeConfig)`, which injects CSS variables into `:root` and registers utility classes like `bg-brand-primary`. There is no runtime CSS-in-JS. This means you cannot swap themes at runtime by changing a React context — the CSS variables are set at build time in `:root`.
- **Theme globals.css files use `@apply` with Tailwind utilities.** Classes like `.btn-primary`, `.card`, etc. are defined in `packages/themes/orion/globals.css` and `packages/themes/vega/globals.css` using `@apply`. These are global CSS classes, not scoped to a theme attribute.
- **No per-component theme prop.** Components do not accept a `theme` prop — they use Tailwind utility classes referencing CSS variables. There is no mechanism to pass theme context into a component.
- **MDX-only content for client sites.** This constraint applies to client sites, not necessarily to the showcase site, which is a developer tool.
- **pnpm workspaces + Turborepo.** `sites/showcase` follows the same workspace pattern as `sites/base-template`. Must be added to `pnpm-workspace.yaml` (already covers `sites/*`) and `turbo.json`.
- **Named exports only, TypeScript interfaces for all props.**
- **No hardcoded hex colors — Tailwind tokens only.**

### Relevant Architecture

**Theme system flow:**

1. `packages/theme-system/` — defines `ThemeConfig` interface, `generateCssVariables()`, Tailwind plugin
2. Each site has `theme.config.ts` (partial theme override) → merged with `defaults.ts` → passed to `createThemePlugin()` → CSS variables in `:root` + utility classes
3. `packages/themes/orion/` and `packages/themes/vega/` each export: `index.ts` (ComponentRegistry metadata), `globals.css` (utility class definitions using `@apply`)
4. Sites import theme globals.css at the top of their `app/globals.css`

**ThemeName type:** `"orion" | "vega"` — defined in `packages/theme-system/src/types.ts`

**ComponentRegistry:** Metadata only — `{ theme, heroVariant, headerVariant, cardVariant, sectionVariant }`. Used by tooling, not at runtime for component selection.

**Components:** All shared components are in `packages/core-components/src/components/ui/`. They use Tailwind utility classes referencing CSS variables. They do not have internal theme-awareness.

**Existing theme configs:** Each client site has its own `theme.config.ts` with brand colors. Orion (dj-fox-electrical): red brand. Vega (base-template): blue brand.

### Codebase Snapshot

```
packages/
  theme-system/
    src/
      types.ts          → ThemeConfig, ThemeName, ComponentRegistry interfaces
      generate-css.ts   → generateCssVariables(config): Record<string,string>
      tailwind-plugin.ts → createThemePlugin(config) — Tailwind plugin factory
      defaults.ts        → default theme values
  themes/
    orion/
      globals.css       → .btn-primary, .card, etc. using @apply
      index.ts          → orionRegistry: ComponentRegistry
    vega/
      globals.css       → .btn-primary, .card, etc. using @apply
      index.ts          → vegaRegistry: ComponentRegistry
  core-components/
    src/
      components/ui/    → ~55 component files (testimonial-card.tsx, service-card.tsx, etc.)
      index.ts          → all component exports

sites/
  base-template/
    app/globals.css     → @import vega/globals.css + @tailwind directives
    tailwind.config.ts  → createThemePlugin(themeConfig)
    theme.config.ts     → site-specific color overrides

turbo.json              → build/dev/lint/type-check/test tasks
pnpm-workspace.yaml     → packages/*, sites/*, tools/*
```

**Key technical challenge:** The `bg-brand-primary` class resolves to `var(--color-brand-primary)`. That CSS variable is set on `:root` by the Tailwind plugin at build time. If two theme variants are rendered on the same page, they both reference the same `:root` variables — there is no built-in isolation mechanism. The session notes propose using `[data-theme="orion"]` attribute scoping to solve this, but the current globals.css files do not contain scoped variants.

### What a Good Plan Should Cover

1. **CSS isolation strategy:** How can Orion and Vega components coexist on a single page without CSS variable bleed? Options include: (a) inline style injection of CSS variables per container, (b) `[data-theme]` attribute scoping in CSS, (c) separate iframes per theme, (d) shadow DOM. The plan should evaluate these and choose one, explaining the trade-offs.

2. **Tailwind build scope:** The showcase's `tailwind.config.ts` needs to generate utility classes for both themes simultaneously. How should this work given that `createThemePlugin()` normally takes a single theme config? Can two plugins coexist without collision?

3. **ThemeFrame component design:** What does the container component that wraps each component-in-a-theme look like? How does it inject the right variables?

4. **Registry structure:** How are the ~55 components registered with fake/placeholder data? Is this a static TypeScript array, a file-based registry (one file per component), or something else? How do you avoid maintaining 55 individual fixture files?

5. **Page architecture:** How are the three pages (`/`, `/elements/[slug]`, `/compare`) structured given the constraint that components are Server Components and there's no runtime theme switching?

6. **Scaffolding minimum:** What is the minimum set of files to create a working `sites/showcase` that builds cleanly with Turborepo?

7. **Verification gates:** How do you confirm that CSS isolation is actually working (no bleed between Orion red and Vega blue) before building out the full component registry?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-02-19_element-showcase/`.
