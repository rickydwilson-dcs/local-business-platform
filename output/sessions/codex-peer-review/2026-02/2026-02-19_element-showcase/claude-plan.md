# Claude's Plan: Element Showcase Site

**Date:** 2026-02-19
**Author:** Claude (independent plan — written before seeing Codex's plan)

---

## Core Technical Decision: CSS Isolation Strategy

The biggest challenge is rendering Orion and Vega on the same page without CSS variable bleed. All components reference `var(--color-brand-primary)` which resolves from `:root`. Four options:

### Option A: Inline CSS variable injection per container

Each `ThemeFrame` wraps the component in a `<div style={{ '--color-brand-primary': '#e53e3e', ... }}>`. CSS variables cascade — a variable set on a parent element overrides the `:root` value for all descendants. This is valid CSS and browser-supported.

**Pros:** No changes to existing theme files. Works at runtime. Pure React (no extra build step). Components continue using `var(--...)` as-is.
**Cons:** Need to inject all ~40+ CSS variables inline. The Tailwind utility classes (`bg-brand-primary`) still resolve to `var(--color-brand-primary)` — but since CSS custom properties cascade, this works correctly as long as the ThemeFrame div is the ancestor.

**Verdict: Use this.** It requires no changes to globals.css, no iframe overhead, no shadow DOM complexity. CSS variable cascade is the mechanism this theme system was designed around.

### Option B: `[data-theme]` attribute scoping in CSS

Requires rewriting globals.css files to have duplicate rule sets under `[data-theme="orion"]` and `[data-theme="vega"]` selectors. This is significant ongoing maintenance debt since every utility class addition in globals.css would need a scoped variant.

**Verdict: Reject.** Too much maintenance burden.

### Option C: Iframes

Simplest CSS isolation — each theme preview is a separate document. But: cross-origin issues, no shared React component tree, hard to size/layout, poor dev experience.

**Verdict: Reject.** Over-engineered for an internal dev tool.

### Option D: Shadow DOM

No standard support in Next.js/React. Would require a web component wrapper.

**Verdict: Reject.**

**Decision: Option A — inline CSS variable injection in ThemeFrame.**

---

## Tailwind Configuration for the Showcase

The showcase needs both Orion and Vega globals.css utility classes (`.btn-primary`, `.card`, etc.) available, but both define `.btn-primary` with different styles. This means you cannot `@import` both — last one wins.

**Solution:** The showcase does NOT import either theme's globals.css. Instead:

- It imports only `@tailwind base/components/utilities`
- All component rendering happens inside `ThemeFrame` containers with inline CSS variables
- Components use only CSS variable-based Tailwind utilities (`bg-brand-primary`) — not the `.btn-primary` class-based utilities from globals.css
- The `tailwind.config.ts` runs `createThemePlugin()` with a merged/neutral config (or just the default theme) — enough to register the utility class names without baking in specific values

This means components that rely on `.btn-primary` in globals.css won't display correctly in the showcase without additional work. **Pragmatic decision:** Accept this limitation initially. The showcase is for previewing component structure and color theming, not every CSS utility class variant. Document this.

---

## Implementation Plan

### Phase 1: Scaffold `sites/showcase`

**Files to create:**

**`sites/showcase/package.json`**

```json
{
  "name": "showcase",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3002",
    "build": "next build",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@platform/core-components": "workspace:*",
    "@platform/theme-system": "workspace:*",
    "next": "15.x",
    "react": "19.x",
    "react-dom": "19.x"
  },
  "devDependencies": {
    "@platform/tsconfig": "workspace:*",
    "tailwindcss": "^3.x",
    "typescript": "^5.x"
  }
}
```

**`sites/showcase/next.config.ts`** — minimal, transpile workspace packages:

```ts
import type { NextConfig } from "next";
const config: NextConfig = {
  transpilePackages: ["@platform/core-components", "@platform/theme-system"],
};
export default config;
```

**`sites/showcase/tsconfig.json`** — extends shared tsconfig, paths for workspace packages.

**`sites/showcase/tailwind.config.ts`** — `createThemePlugin()` with default config (no site-specific overrides), content scanning both the site and packages.

**`sites/showcase/app/globals.css`** — only Tailwind directives, no theme import (to avoid `.btn-primary` conflicts).

**`sites/showcase/app/layout.tsx`** — minimal HTML shell, no site header/footer.

**`turbo.json`** — no change needed. `sites/*` already matches. The new site will participate automatically.

**Verification gate:** `pnpm --filter showcase dev` starts without errors on port 3002.

---

### Phase 2: Build the CSS Isolation Primitive

**`sites/showcase/lib/theme-vars.ts`**

Imports the Orion and Vega theme.config.ts files (or hardcodes color values directly). Calls `generateCssVariables()` from `@platform/theme-system` for each and exports:

```ts
export const orionVars: Record<string, string> = generateCssVariables(orionThemeConfig);
export const vegaVars: Record<string, string> = generateCssVariables(vegaThemeConfig);
export const themeVars: Record<ThemeName, Record<string, string>> = {
  orion: orionVars,
  vega: vegaVars,
};
```

**Problem:** This requires access to each site's `theme.config.ts`. Options:

1. Import directly: `import { themeConfig } from '../../dj-fox-electrical/theme.config'` — works but couples showcase to specific sites
2. Maintain theme configs within the showcase — duplicates config
3. Export theme configs from each theme package — cleanest

**Decision:** Export representative theme configs from `packages/themes/orion/` and `packages/themes/vega/`. These are the "canonical" Orion and Vega color palettes — not site-specific overrides. The showcase showcases themes, not sites.

Add to `packages/themes/orion/index.ts`:

```ts
export const orionDefaultConfig: DeepPartialThemeConfig = { colors: { brand: { primary: '#e53e3e', ... } } };
```

**`sites/showcase/components/ThemeFrame.tsx`** — a client component (because inline styles computed at render):

```tsx
"use client";
import { themeVars } from "../lib/theme-vars";
interface ThemeFrameProps {
  theme: ThemeName;
  children: React.ReactNode;
  label?: boolean;
}
export function ThemeFrame({ theme, children }: ThemeFrameProps) {
  const vars = themeVars[theme];
  return (
    <div style={vars as React.CSSProperties} data-theme={theme} className="...">
      {" "}
      {children}{" "}
    </div>
  );
}
```

**Verification gate:** Render a simple `<div className="bg-brand-primary w-8 h-8" />` inside `<ThemeFrame theme="orion">` next to `<ThemeFrame theme="vega">`. Orion box should be red, Vega box should be blue. If both show the same color, isolation has failed.

---

### Phase 3: Element Registry

**Design:** One TypeScript file per element category, not one file per component. ~10 category files rather than ~55 element files. Each file exports an array of `ElementDefinition` objects.

```ts
// registry/cards.tsx
export const cardElements: ElementDefinition[] = [
  {
    slug: 'testimonial-card',
    name: 'Testimonial Card',
    category: 'Social Proof',
    description: 'Customer review with star rating and attribution',
    themes: ['orion', 'vega'],
    render: () => <TestimonialCard testimonial={{ author: 'Jane Smith', role: 'Homeowner', text: 'Excellent work...', rating: 5 }} />,
  },
  // ...
];
```

**`registry/index.ts`** — collects all category arrays into a flat `ElementDefinition[]` with a `bySlug` lookup map.

**Key constraint on `render`:** The render function cannot accept `theme` as a parameter and switch behavior — components are not theme-aware. The function just returns the component with fake data. The `ThemeFrame` wrapper provides the CSS context.

**Verification gate:** `registry/index.ts` exports an array with >10 items. TypeScript compiles. No component import errors.

---

### Phase 4: Browser Page (`/`)

Server component. Imports the element registry. Renders an `ElementBrowser` grid with category filter.

**Category filter:** Since this is a Server Component, filtering is done via search params (`?category=Cards`). The URL is the filter state — no client-side state required. This avoids needing a `'use client'` wrapper for the whole page.

**`components/ElementCard.tsx`** — displays element name, category, description, and a small preview (renders the component inside TWO `ThemeFrame` wrappers side by side at reduced scale).

**Layout:** CSS grid, responsive. Card links to `/elements/[slug]`.

**Verification gate:** `/` loads with all elements visible, category filter (via URL param) works.

---

### Phase 5: Element Detail Page (`/elements/[slug]`)

Uses `generateStaticParams()` from the element registry (consistent with platform pattern). One row per theme, full-width.

```tsx
// app/elements/[slug]/page.tsx
export function generateStaticParams() {
  return elements.map((e) => ({ slug: e.slug }));
}
```

Each theme row: `<ThemeFrame theme={themeName}>{element.render()}</ThemeFrame>` with a visible label.

**Verification gate:** `/elements/testimonial-card` renders two full-width rows. Orion row has red brand color, Vega row has blue brand color.

---

### Phase 6: Compare Matrix Page (`/compare`)

Full matrix: elements as rows, themes as columns.

This page renders ALL elements × ALL themes. With ~55 elements and 2 themes = ~110 component renders on one page. Potential performance concern. Mitigations:

- Use `React.Suspense` boundaries per row
- Consider lazy loading below-fold rows

Layout: `<table>` with sticky `<thead>` (theme names) and sticky first column (element name). Or CSS grid with sticky rows. Table is semantically appropriate for a matrix.

**Verification gate:** `/compare` loads. Scroll reveals sticky headers. No CSS variable bleed between Orion and Vega columns.

---

### Phase 7: Type-check and Build

```bash
pnpm --filter showcase type-check
pnpm --filter showcase build
```

Fix any TypeScript errors. Verify build artifacts are generated cleanly.

---

## Risks and Trade-offs

| Risk                                                                                    | Likelihood | Impact | Mitigation                                                                                             |
| --------------------------------------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------ |
| `.btn-primary` classes not available in showcase (globals.css conflict)                 | High       | Medium | Accept limitation, document it; showcase targets CSS-variable-based tokens, not utility class variants |
| Inline style injection doesn't cascade to pseudo-elements or Tailwind `hover:` variants | Medium     | Medium | Test early in Phase 2; if broken, fall back to `<style>` tag injection per ThemeFrame                  |
| `/compare` page too slow to render 110 components server-side                           | Low        | Medium | Add Suspense boundaries; if still slow, lazy-load below-fold rows                                      |
| Orion/Vega canonical theme configs don't exist (coupling to site configs)               | Medium     | Low    | Create representative configs in theme packages in Phase 2                                             |
| Turborepo caching issues after adding new workspace                                     | Low        | Low    | Run `pnpm install` from root after creating package.json                                               |

---

## Files to Create/Modify

### New files

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
- `sites/showcase/components/ElementCard.tsx`
- `sites/showcase/components/ElementBrowser.tsx`
- `sites/showcase/components/CompareTable.tsx`
- `sites/showcase/lib/theme-vars.ts`
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

### Modified files

- `packages/themes/orion/index.ts` — add `orionDefaultConfig` export
- `packages/themes/vega/index.ts` — add `vegaDefaultConfig` export

### NOT modified

- `pnpm-workspace.yaml` — `sites/*` glob already covers showcase
- `turbo.json` — pipeline already covers all sites
- Any client site files — zero impact on production sites
