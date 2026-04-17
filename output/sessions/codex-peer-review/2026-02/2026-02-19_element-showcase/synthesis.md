# Implementation Plan: Element Showcase Site

**Date:** 2026-02-19
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect                      | Claude                                                                               | Codex                                                                                                                                                                             | Synthesised Decision                                                                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CSS isolation mechanism     | Inline `style` injection of all CSS vars on ThemeFrame div — no build changes needed | Modify `createThemePlugin()` to accept a `selector` option; register twice in showcase tailwind.config to emit `[data-theme="orion"]` and `[data-theme="vega"]` scoped CSS blocks | **Codex wins.** The selector approach fixes the globals.css utility class collision (`.btn-primary` etc.) that Claude accepted as a known limitation. Small non-breaking change to a single function. |
| globals.css handling        | Do NOT import either theme's globals.css — accept that `.btn-primary` classes break  | Import both globals.css files; selector-scoped CSS vars mean `.btn-primary` resolves correctly per container                                                                      | **Codex wins.** Importing both is safe once vars are scoped per data-theme attribute.                                                                                                                 |
| Theme config sourcing       | Add canonical configs to theme packages (orion/index.ts, vega/index.ts)              | Existing site theme.config.ts files (or defaults from the plugin) — implied                                                                                                       | **Claude wins.** Canonical per-theme configs in `packages/themes/orion/` and `packages/themes/vega/` is cleaner than coupling the showcase to specific client sites.                                  |
| Registry structure          | Category-based files (~10 files), each exporting an array of ElementDefinition       | Single `lib/registry.ts` with all entries and inline fixtures                                                                                                                     | **Claude wins.** Category files are easier to navigate and extend without one giant file. Keep one file per category, all exported from `registry/index.ts`.                                          |
| turbo.json changes          | No changes needed (glob covers all sites)                                            | Explicitly update turbo.json                                                                                                                                                      | Both are correct; `sites/*` glob already covers it so no change needed.                                                                                                                               |
| ThemeFrame Server vs Client | Client component (to compute inline styles)                                          | Server component (just sets data-theme attribute; CSS does the work)                                                                                                              | **Codex wins.** With the selector-scoped build approach, ThemeFrame only sets `data-theme` — no JavaScript needed. Server Component, zero bundle cost.                                                |

## Blind Spots Caught

**Codex caught (that Claude missed):**

- Claude accepted the globals.css collision problem as "known limitation — document it". Codex's selector approach actually _solves_ it. With `[data-theme="orion"]` scoping in the CSS output, both globals.css files can be imported because `.btn-primary` inside a `[data-theme="orion"]` container gets orion's brand colors, and `.btn-primary` inside `[data-theme="vega"]` gets vega's. This is the key insight Claude missed.
- Codex noted the `pnpm lint` sanity check at start — establish a clean baseline before making changes to shared packages.
- Codex noted the "token probe" early visual gate (a minimal test component showing only brand colors) before building the full registry — de-risks the core isolation mechanism before investing in 55 component fixtures.

**Claude caught (that Codex missed):**

- The need for canonical per-theme configs in `packages/themes/orion/` and `packages/themes/vega/`. Codex's plan uses unspecified theme configs and doesn't address where orion's red vs vega's blue comes from when calling `createThemePlugin()` with the selector option.
- The `/compare` page performance concern (110 component renders). Claude proposed Suspense boundaries per row; Codex didn't mention this.
- The risk that inline style hover/pseudo-element cascade might not work — though this is moot with the Codex selector approach.

---

## Implementation Plan

### Phase 0: Baseline Sanity Check

Before touching any code:

```bash
pnpm lint  # confirm clean starting point
```

If lint fails, stop and fix. Don't make changes to shared packages from a dirty baseline.

---

### Phase 1: Extend `createThemePlugin()` with Selector Option

**Files modified:**

- `packages/theme-system/src/tailwind-plugin.ts`
- `packages/theme-system/src/types.ts` (if a PluginOptions type is needed)

**Change:** Add an optional second argument `options?: { selector?: string }` to `createThemePlugin()`. Default selector is `:root` (preserves all existing site behaviour). When a selector is provided, CSS variables are emitted under that selector instead.

```ts
// Before
export function createThemePlugin(userConfig: DeepPartialThemeConfig = {}) {
  return plugin(({ addBase }) => {
    addBase({ ":root": generateCssVariables(config) });
  });
}

// After
export function createThemePlugin(
  userConfig: DeepPartialThemeConfig = {},
  options: { selector?: string } = {}
) {
  const selector = options.selector ?? ":root";
  return plugin(({ addBase }) => {
    addBase({ [selector]: generateCssVariables(config) });
  });
}
```

**Existing sites:** Pass no options → selector defaults to `:root` → zero behaviour change.

**Verification gate:**

```bash
pnpm --filter @platform/theme-system type-check
pnpm --filter dj-fox-electrical build  # Existing site still builds correctly
```

---

### Phase 2: Add Canonical Theme Configs to Theme Packages

**Files modified:**

- `packages/themes/orion/index.ts`
- `packages/themes/vega/index.ts`

These export the representative color palettes for each named theme — what the showcase calls when it builds its `[data-theme]` CSS blocks. Sites may override these; this is what orion/vega look like by default.

```ts
// packages/themes/orion/index.ts (addition)
import type { DeepPartialThemeConfig } from "@platform/theme-system";

export const orionDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#dc2626", // Red-600
      primaryHover: "#b91c1c", // Red-700
      secondary: "#1f2937", // Gray-800
      accent: "#f97316", // Orange-500
    },
    surface: {
      background: "#ffffff",
      foreground: "#111827",
      // ... (full set from dj-fox-electrical theme.config.ts as canonical reference)
    },
  },
};
```

```ts
// packages/themes/vega/index.ts (addition)
export const vegaDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#2563eb", // Blue-600
      primaryHover: "#1d4ed8", // Blue-700
      // ...
    },
  },
};
```

**Verification gate:** `pnpm --filter @platform/themes type-check` (or whichever package name is used).

---

### Phase 3: Scaffold `sites/showcase`

**New files:**

**`sites/showcase/package.json`**

```json
{
  "name": "showcase",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3002",
    "build": "next build",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@platform/core-components": "workspace:*",
    "@platform/theme-system": "workspace:*",
    "@platform/themes": "workspace:*",
    "next": "15.x",
    "react": "19.x",
    "react-dom": "19.x"
  },
  "devDependencies": {
    "@platform/tsconfig": "workspace:*",
    "tailwindcss": "3.x",
    "typescript": "^5.x"
  }
}
```

**`sites/showcase/next.config.ts`**

```ts
import type { NextConfig } from "next";
const config: NextConfig = {
  transpilePackages: ["@platform/core-components", "@platform/theme-system", "@platform/themes"],
};
export default config;
```

**`sites/showcase/tsconfig.json`** — extends `@platform/tsconfig`, includes standard Next.js paths.

**`sites/showcase/tailwind.config.ts`** — the dual-plugin setup:

```ts
import type { Config } from "tailwindcss";
import { createThemePlugin } from "@platform/theme-system/plugin";
import { orionDefaultConfig } from "@platform/themes/orion";
import { vegaDefaultConfig } from "@platform/themes/vega";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./registry/**/*.{js,ts,jsx,tsx}",
    "../../packages/core-components/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/themes/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    createThemePlugin(orionDefaultConfig, { selector: ':where([data-theme="orion"])' }),
    createThemePlugin(vegaDefaultConfig, { selector: ':where([data-theme="vega"])' }),
  ],
};
export default config;
```

Note: `:where()` keeps specificity at 0, so no specificity wars with component styles.

**`sites/showcase/app/globals.css`**

```css
/* Import both theme utility class definitions */
@import "../../../packages/themes/orion/globals.css";
@import "../../../packages/themes/vega/globals.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Note on the globals.css import: Both files define `.btn-primary` etc. Last import wins for the class definition — BUT since the actual styles use `@apply bg-brand-primary` which resolves to `var(--color-brand-primary)`, and that variable is now scoped per `[data-theme]` container, the visual output is still correct. The class definition collision is irrelevant because the token resolution is what matters.

**`sites/showcase/app/layout.tsx`** — minimal shell, dark sidebar nav, no client site header/footer.

**After creating:**

```bash
pnpm install  # from root — wire up the new workspace
pnpm --filter showcase lint
pnpm --filter showcase type-check
```

**Verification gate:** Both commands pass with stub content.

---

### Phase 4: ThemeFrame Component + Token Probe

**`sites/showcase/components/ThemeFrame.tsx`** — Server Component (no `'use client'` needed):

```tsx
import type { ThemeName } from "@platform/theme-system";

interface ThemeFrameProps {
  theme: ThemeName;
  children: React.ReactNode;
  className?: string;
}

export function ThemeFrame({ theme, children, className }: ThemeFrameProps) {
  return (
    <div data-theme={theme} className={className}>
      {children}
    </div>
  );
}
```

**`sites/showcase/components/TokenProbe.tsx`** — visual CSS isolation test:

```tsx
// Renders coloured squares using brand-primary and surface-background tokens
// Used to verify isolation before building the full registry
export function TokenProbe() {
  return (
    <div className="flex gap-2 p-4">
      <div className="w-8 h-8 bg-brand-primary" title="brand-primary" />
      <div
        className="w-8 h-8 bg-surface-background border border-gray-300"
        title="surface-background"
      />
    </div>
  );
}
```

Add a temporary test route `app/test/page.tsx`:

```tsx
<ThemeFrame theme="orion"><TokenProbe /></ThemeFrame>
<ThemeFrame theme="vega"><TokenProbe /></ThemeFrame>
```

**Verification gate (critical):** Run `pnpm --filter showcase dev`. Visit `/test`. The orion box must be red, the vega box must be blue. If both are the same color, CSS isolation has failed — stop and debug before proceeding.

Delete `app/test/page.tsx` after verification passes.

---

### Phase 5: Element Registry

**Structure:** Category-based files in `sites/showcase/registry/`, all aggregated in `registry/index.ts`.

**`sites/showcase/registry/index.ts`**

```ts
import type { ThemeName } from "@platform/theme-system";
import { cardElements } from "./cards";
import { heroElements } from "./hero";
// ... etc

export type ElementCategory =
  | "Hero"
  | "Cards"
  | "Social Proof"
  | "CTAs"
  | "Content"
  | "Navigation"
  | "Blog"
  | "Stats"
  | "Typography"
  | "Tokens";

export interface ElementDefinition {
  slug: string;
  name: string;
  category: ElementCategory;
  description: string;
  themes: ThemeName[];
  render: () => React.ReactNode;
}

export const elements: ElementDefinition[] = [
  ...heroElements,
  ...cardElements,
  // ...
];

export const elementsBySlug = new Map(elements.map((e) => [e.slug, e]));
export const categories = [...new Set(elements.map((e) => e.category))];
```

**Category files** (`registry/cards.tsx`, `registry/hero.tsx`, etc.) — each exports an array. Inline fixtures colocated in the same file. ~5-8 elements per file.

Example:

```tsx
// registry/cards.tsx
import { TestimonialCard } from "@platform/core-components";
import type { ElementDefinition } from "./index";

export const cardElements: ElementDefinition[] = [
  {
    slug: "testimonial-card",
    name: "Testimonial Card",
    category: "Social Proof",
    description: "Customer review with star rating and attribution",
    themes: ["orion", "vega"],
    render: () => (
      <TestimonialCard
        testimonial={{
          author: "Jane Smith",
          role: "Homeowner",
          text: "Absolutely first-class work. Would recommend to anyone.",
          rating: 5,
        }}
      />
    ),
  },
];
```

**Start with ~10 elements across 4 categories** for initial build. Expand to all 55 in a follow-up pass.

**Verification gate:**

```bash
pnpm --filter showcase type-check  # All fixture props must match component types
```

---

### Phase 6: Element Browser Page (`/`)

**`sites/showcase/app/page.tsx`** — Server Component. Reads `searchParams` for category filter.

```tsx
// URL: /?category=Cards filters to Cards category
// No client JS needed
```

**`sites/showcase/components/ElementBrowser.tsx`** — renders the grid.

**`sites/showcase/components/ElementCard.tsx`** — grid card with:

- Element name + category badge + description
- Small side-by-side preview: two `ThemeFrame` wrappers at reduced scale (`scale-50` or similar)
- Link to `/elements/[slug]`

**Verification gate:** `/` loads. Category filter (URL param) shows filtered subset. All elements are accessible.

---

### Phase 7: Element Detail Page (`/elements/[slug]`)

**`sites/showcase/app/elements/[slug]/page.tsx`**

```tsx
export function generateStaticParams() {
  return elements.map((e) => ({ slug: e.slug }));
}
```

Renders one full-width row per theme. Each row: theme label + `<ThemeFrame theme={name}>{element.render()}</ThemeFrame>`.

**Verification gate:** `/elements/testimonial-card` shows orion row (red brand) and vega row (blue brand), full-width, no CSS bleed.

---

### Phase 8: Compare Matrix Page (`/compare`)

**`sites/showcase/app/compare/page.tsx`** — Server Component.

Layout: CSS grid with sticky headers. Themes as columns, elements as rows.

```tsx
// Simplified structure
<div className="grid" style={{ gridTemplateColumns: `200px repeat(${themes.length}, 1fr)` }}>
  {/* Sticky header row */}
  <div className="sticky top-0">Element</div>
  {themes.map((t) => (
    <div key={t} className="sticky top-0">
      {t}
    </div>
  ))}

  {/* Element rows */}
  {elements.map((element) => (
    <React.Fragment key={element.slug}>
      <div>{element.name}</div>
      {themes.map((theme) => (
        <ThemeFrame key={theme} theme={theme}>
          {element.render()}
        </ThemeFrame>
      ))}
    </React.Fragment>
  ))}
</div>
```

**Performance:** With ~55 elements × 2 themes, this is ~110 RSC renders on one page. Should be acceptable for a server-rendered dev tool. Add `<Suspense>` per row if streaming is needed.

**Verification gate:** `/compare` loads. Sticky theme headers visible on scroll. Orion column shows red brand, Vega column shows blue brand throughout. No bleed.

---

### Phase 9: Type-check and Build

```bash
pnpm --filter showcase type-check
pnpm --filter showcase build
pnpm build  # Full monorepo build — verify no regressions in other sites
```

Fix any TypeScript errors. Confirm clean build.

---

## Risks and Mitigations

| Risk                                                                               | Likelihood | Impact | Mitigation                                                                                            |
| ---------------------------------------------------------------------------------- | ---------- | ------ | ----------------------------------------------------------------------------------------------------- |
| globals.css `@apply` rules use hardcoded colors (not vars), breaking theme scoping | Medium     | High   | Scan orion/vega globals.css before Phase 3; wrap any hardcoded rules in `[data-theme=name]` selectors |
| `createThemePlugin()` selector change breaks existing sites                        | Low        | High   | Default selector stays `:root`; verify by building dj-fox-electrical after Phase 1                    |
| Component props don't match inline fixture types                                   | Medium     | Low    | Type-check gate in Phase 5 catches this before building pages                                         |
| `/compare` too slow with all 55 elements                                           | Low        | Medium | Add `<Suspense>` + streaming; or lazy-load below-fold rows with Intersection Observer                 |
| Turborepo doesn't pick up new workspace without reinstall                          | Low        | Low    | Run `pnpm install` from root after creating package.json                                              |
| `:where()` specificity fix causes unexpected cascade issues                        | Low        | Low    | Test ThemeFrame isolation gate in Phase 4 catches this early                                          |

---

## Files to Create/Modify

### Modified (shared packages)

- `packages/theme-system/src/tailwind-plugin.ts` — add `selector` option
- `packages/theme-system/src/types.ts` — add `PluginOptions` type (if needed)
- `packages/themes/orion/index.ts` — add `orionDefaultConfig` export
- `packages/themes/vega/index.ts` — add `vegaDefaultConfig` export

### New (showcase site)

- `sites/showcase/package.json`
- `sites/showcase/next.config.ts`
- `sites/showcase/tsconfig.json`
- `sites/showcase/tailwind.config.ts`
- `sites/showcase/app/globals.css`
- `sites/showcase/app/layout.tsx`
- `sites/showcase/app/page.tsx`
- `sites/showcase/app/elements/[slug]/page.tsx`
- `sites/showcase/app/compare/page.tsx`
- `sites/showcase/components/ThemeFrame.tsx`
- `sites/showcase/components/TokenProbe.tsx`
- `sites/showcase/components/ElementBrowser.tsx`
- `sites/showcase/components/ElementCard.tsx`
- `sites/showcase/components/CompareTable.tsx`
- `sites/showcase/registry/index.ts`
- `sites/showcase/registry/cards.tsx`
- `sites/showcase/registry/hero.tsx`
- `sites/showcase/registry/social-proof.tsx`
- `sites/showcase/registry/cta.tsx`
- `sites/showcase/registry/content.tsx`
- `sites/showcase/registry/navigation.tsx`
- `sites/showcase/registry/blog.tsx`
- `sites/showcase/registry/stats.tsx`
- `sites/showcase/registry/typography.tsx`
- `sites/showcase/registry/tokens.tsx`

### NOT modified

- `pnpm-workspace.yaml` — `sites/*` glob already covers showcase
- `turbo.json` — pipeline already covers all sites via glob
- Any client site files — zero impact on production sites

---

## Implementation Order

1. Phase 0: Baseline lint check
2. Phase 1: `createThemePlugin()` selector option + Phase 2: canonical theme configs (can be done in parallel)
3. Phase 3: Scaffold + install
4. Phase 4: ThemeFrame + TokenProbe isolation gate ← **do not skip this**
5. Phase 5: Registry (10 elements across 4 categories to start)
6. Phase 6–8: Pages in order
7. Phase 9: Full type-check and build
8. Follow-up pass: expand registry to all 55 elements
