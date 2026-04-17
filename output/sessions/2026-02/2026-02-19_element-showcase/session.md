# Session: 2026-02-19_element-showcase

**Start Date:** 2026-02-19
**Status:** Ready for implementation
**Source:** Dual-model peer review (Claude + Codex synthesis) + additional requirements review

---

## Objective

Build `sites/showcase` — a standalone Next.js dev tool that:

1. Displays all ~55 platform UI components with real content and proper names (e.g. "Hero Wide Image", "Testimonial Card")
2. Renders each component per named theme, so you can see "Testimonial Card" in Orion and Vega side-by-side
3. Provides a full compare matrix: all elements × all themes
4. Auto-discovers new themes when added — zero changes to showcase code required
5. Provides a live brand injector — paste client colors/fonts and see all components update in real time (shareable via URL)

---

## Architecture Decisions

### CSS Isolation: `[data-theme]` selector-scoped CSS at build time

`createThemePlugin()` is extended with an optional `selector` parameter (default `:root`). The showcase registers each theme with `:where([data-theme="orion"])` and `:where([data-theme="vega"])` selectors. CSS variables are scoped to the container — no iframe, no JS, no CSS bleed between theme columns.

Both theme globals.css files can be imported because `.btn-primary` uses `@apply bg-brand-primary` which resolves to `var(--color-brand-primary)` — the scoped variable wins per container. The class definition collision is irrelevant.

`:where()` keeps specificity at 0 — no specificity wars with component styles.

### ThemeFrame: Server Component

Just sets `data-theme` attribute. No JS needed. Extended to accept an optional `vars` prop for the custom brand injector column (inline CSS var cascade).

### Theme Discovery: Registry Pattern

`packages/theme-system/src/theme-registry.ts` is the single source of truth. Theme packages self-register by calling `registerTheme()`. Showcase reads `getRegisteredThemes()` (returns a frozen copy). To add a future "nova" theme: create `packages/themes/nova/index.ts`, call `registerTheme()` — showcase picks it up automatically.

**Import order risk (critical):** `tailwind.config.ts` must explicitly import each theme package before reading the registry. Use `sites/showcase/lib/register-all-themes.ts` as a barrel for explicit side-effect imports — imported first in `tailwind.config.ts`.

### Live Brand Injector: Client Island

Only the "Custom" column is a client component (`CustomBrandProvider`). Orion/Vega columns stay pure Server Components. State stored in URL search params (no `#` — use `db0b0b` not `%23db0b0b`). `generateCssVariables()` called client-side with user overrides, memoized with `useMemo`. Debounce `history.replaceState` to avoid URL churn.

Inline CSS var injection is safe for `hover:`, `focus:`, pseudo-elements — they resolve at computed-style time from the element's cascade.

### TypeScript: Keep Existing Union, Extend in Showcase Only

`ThemeName = "orion" | "vega"` stays untouched in `types.ts` for app/runtime code. In showcase-only code: `ThemeNameLiteral = ThemeName | (string & {})` to accept future names.

---

## Implementation Plan

### Phase 0: Baseline

```bash
pnpm lint  # must be clean before touching shared packages
grep -r '#[0-9a-fA-F]\{6\}' packages/themes/orion/globals.css packages/themes/vega/globals.css
# Any hardcoded hex found → wrap in a CSS variable before proceeding
```

### Phase 1: Extend `createThemePlugin()` with Selector Option

**`packages/theme-system/src/tailwind-plugin.ts`** — add optional second arg:

```ts
export function createThemePlugin(
  userConfig: DeepPartialThemeConfig = {},
  options: { selector?: string } = {}
) {
  const selector = options.selector ?? ":root";
  // ... existing merge logic ...
  return plugin(({ addBase, addUtilities }) => {
    addBase({ [selector]: generateCssVariables(config) });
    // ... existing utility registrations unchanged ...
  });
}
```

**Verification:**

```bash
pnpm --filter @platform/theme-system type-check
pnpm --filter dj-fox-electrical build  # must still pass
```

### Phase 2: Theme Registry + Canonical Configs

**New: `packages/theme-system/src/theme-registry.ts`**

```ts
import type { DeepPartialThemeConfig } from "./types";

export interface ThemeRegistryEntry {
  name: string;
  label: string;
  config: DeepPartialThemeConfig;
}

const registry: ThemeRegistryEntry[] = [];

export function registerTheme(entry: ThemeRegistryEntry): void {
  registry.push(Object.freeze(entry));
}

export function getRegisteredThemes(): readonly ThemeRegistryEntry[] {
  return [...registry];
}
```

Re-export from `packages/theme-system/src/index.ts`: `registerTheme`, `getRegisteredThemes`, `ThemeRegistryEntry`.

**`packages/themes/orion/index.ts`** — add canonical config + register:

```ts
import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const orionDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: { primary: "#dc2626", primaryHover: "#b91c1c", secondary: "#1f2937", accent: "#f97316" },
    surface: {
      background: "#ffffff",
      foreground: "#111827",
      muted: "#f3f4f6",
      mutedForeground: "#6b7280",
      card: "#ffffff",
      cardBorder: "#e5e7eb",
    },
    semantic: { success: "#10b981", warning: "#f59e0b", error: "#ef4444", info: "#3b82f6" },
    overlay: {
      dark: "rgba(0,0,0,0.8)",
      light: "rgba(255,255,255,0.8)",
      primary: "rgba(220,38,38,0.8)",
    },
  },
};

registerTheme({ name: "orion", label: "Orion", config: orionDefaultConfig });
```

**`packages/themes/vega/index.ts`** — same pattern:

```ts
export const vegaDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: { primary: "#2563eb", primaryHover: "#1d4ed8", secondary: "#1e3a5f", accent: "#06b6d4" },
    surface: {
      background: "#ffffff",
      foreground: "#111827",
      muted: "#f8fafc",
      mutedForeground: "#64748b",
      card: "#ffffff",
      cardBorder: "#e2e8f0",
    },
    semantic: { success: "#10b981", warning: "#f59e0b", error: "#ef4444", info: "#3b82f6" },
    overlay: {
      dark: "rgba(0,0,0,0.7)",
      light: "rgba(255,255,255,0.8)",
      primary: "rgba(37,99,235,0.8)",
    },
  },
};

registerTheme({ name: "vega", label: "Vega", config: vegaDefaultConfig });
```

**Verification:**

```bash
pnpm --filter @platform/theme-system type-check
```

### Phase 3: Scaffold `sites/showcase`

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

**`sites/showcase/lib/register-all-themes.ts`** — explicit side-effect barrel (imported first in tailwind.config.ts):

```ts
// Must be imported before reading getRegisteredThemes()
// Guarantees theme packages execute registerTheme() regardless of tree-shaking
import "@platform/themes/orion";
import "@platform/themes/vega";
```

**`sites/showcase/tailwind.config.ts`**

```ts
import "./lib/register-all-themes"; // MUST be first
import type { Config } from "tailwindcss";
import { createThemePlugin, getRegisteredThemes } from "@platform/theme-system";

const themes = getRegisteredThemes();

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./registry/**/*.{js,ts,jsx,tsx}",
    "../../packages/core-components/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/themes/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: themes.map((t) =>
    createThemePlugin(t.config, { selector: `:where([data-theme="${t.name}"])` })
  ),
};
export default config;
```

**`sites/showcase/next.config.ts`**

```ts
import type { NextConfig } from "next";
const config: NextConfig = {
  transpilePackages: ["@platform/core-components", "@platform/theme-system", "@platform/themes"],
};
export default config;
```

**`sites/showcase/tsconfig.json`** — extends `../../packages/tsconfig/nextjs.json` (same pattern as other sites).

**`sites/showcase/app/globals.css`**

```css
@import "../../../packages/themes/orion/globals.css";
@import "../../../packages/themes/vega/globals.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

**`sites/showcase/app/layout.tsx`** — minimal shell: sidebar nav with links to `/`, `/compare`, brand injector panel area. No client site header/footer chrome.

```bash
pnpm install  # from repo root
pnpm --filter showcase lint
pnpm --filter showcase type-check
```

**Verification:** Both pass with stub content.

### Phase 4: ThemeFrame + TokenProbe Isolation Gate

**`sites/showcase/components/ThemeFrame.tsx`** — Server Component:

```tsx
interface ThemeFrameProps {
  theme: string;
  vars?: Record<string, string>; // only for 'custom' column — inline CSS var cascade
  children: React.ReactNode;
  className?: string;
}

export function ThemeFrame({ theme, vars, children, className }: ThemeFrameProps) {
  return (
    <div
      data-theme={theme !== "custom" ? theme : undefined}
      style={vars as React.CSSProperties | undefined}
      className={className}
    >
      {children}
    </div>
  );
}
```

**`sites/showcase/components/TokenProbe.tsx`** — isolation test only, deleted after gate:

```tsx
export function TokenProbe() {
  return (
    <div className="flex gap-2 p-4 border rounded">
      <div className="w-8 h-8 bg-brand-primary" title="brand-primary" />
      <div className="w-8 h-8 bg-brand-secondary" title="brand-secondary" />
      <div className="w-8 h-8 bg-surface-muted border border-gray-300" title="surface-muted" />
    </div>
  );
}
```

**`sites/showcase/app/test/page.tsx`** — temporary:

```tsx
import { ThemeFrame } from "../../components/ThemeFrame";
import { TokenProbe } from "../../components/TokenProbe";
export default function TestPage() {
  return (
    <div className="flex gap-8 p-8">
      <div>
        <p className="mb-2 font-mono text-sm">orion</p>
        <ThemeFrame theme="orion">
          <TokenProbe />
        </ThemeFrame>
      </div>
      <div>
        <p className="mb-2 font-mono text-sm">vega</p>
        <ThemeFrame theme="vega">
          <TokenProbe />
        </ThemeFrame>
      </div>
    </div>
  );
}
```

**CRITICAL GATE:** `pnpm --filter showcase dev` → visit `/test`. Orion squares must be red, Vega squares must be blue. If both are the same color, CSS isolation has failed — stop and debug before continuing.

Delete `app/test/` after gate passes.

### Phase 5: Element Registry

**`sites/showcase/registry/index.ts`**

```ts
import { heroElements } from "./hero";
import { cardElements } from "./cards";
import { socialProofElements } from "./social-proof";
import { ctaElements } from "./cta";
import { contentElements } from "./content";
import { navigationElements } from "./navigation";
import { blogElements } from "./blog";
import { statsElements } from "./stats";
import { typographyElements } from "./typography";
import { tokenElements } from "./tokens";

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
  name: string; // Human-readable: "Hero Wide Image", "Testimonial Card"
  category: ElementCategory;
  description: string;
  themes: string[]; // Which themes support it
  render: () => React.ReactNode; // Real component + fake data
}

export const elements: ElementDefinition[] = [
  ...heroElements,
  ...cardElements,
  ...socialProofElements,
  ...ctaElements,
  ...contentElements,
  ...navigationElements,
  ...blogElements,
  ...statsElements,
  ...typographyElements,
  ...tokenElements,
];

export const elementsBySlug = new Map(elements.map((e) => [e.slug, e]));
export const categories = [...new Set(elements.map((e) => e.category))] as ElementCategory[];
```

**Category files** — one per category, inline fixtures colocated. Start with ~10 elements across 4 categories; expand to full 55 in follow-up pass.

Example `registry/cards.tsx`:

```tsx
import { TestimonialCard, ServiceCard } from "@platform/core-components";
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
          rating: 5,
          text: "Absolutely first-class work. Would recommend to anyone.",
        }}
      />
    ),
  },
];
```

**Verification:**

```bash
pnpm --filter showcase type-check  # fixture props must match component interfaces
```

### Phase 6: Element Browser Page (`/`)

**`sites/showcase/app/page.tsx`** — Server Component, reads `searchParams.category`:

- Imports `elements`, `categories` from registry
- Filters by category if param present
- Renders `<ElementBrowser elements={filtered} />`

**`sites/showcase/components/ElementBrowser.tsx`** — category filter links (URL params, no JS) + element grid.

**`sites/showcase/components/ElementCard.tsx`** — per element:

- Name (e.g. "Testimonial Card"), category badge, description
- Small preview: `ThemeFrame` per registered theme at reduced scale
- Link to `/elements/[slug]`

**Verification:** `/` loads with all elements. `?category=Cards` filters correctly.

### Phase 7: Element Detail Page (`/elements/[slug]`)

**`sites/showcase/app/elements/[slug]/page.tsx`**

```tsx
import { getRegisteredThemes } from "@platform/theme-system";
import "./lib/register-all-themes"; // ensure registration

export function generateStaticParams() {
  return elements.map((e) => ({ slug: e.slug }));
}

export default function ElementDetailPage({ params }: { params: { slug: string } }) {
  const element = elementsBySlug.get(params.slug);
  const themes = getRegisteredThemes();
  // Renders one full-width row per theme
}
```

**Verification:** `/elements/testimonial-card` → orion row (red), vega row (blue), both full-width, no bleed.

### Phase 8: Compare Matrix Page (`/compare`)

**`sites/showcase/app/compare/page.tsx`** — Server Component.

CSS grid layout: themes as columns, elements as rows, sticky headers.

```tsx
const themes = getRegisteredThemes();

<div className="grid" style={{ gridTemplateColumns: `240px repeat(${themes.length}, 1fr)` }}>
  {/* sticky header */}
  <div className="sticky top-0 bg-white z-10">Element</div>
  {themes.map((t) => (
    <div key={t.name} className="sticky top-0 bg-white z-10">
      {t.label}
    </div>
  ))}

  {/* rows */}
  {elements.map((element) => (
    <React.Fragment key={element.slug}>
      <div className="font-medium text-sm py-2">{element.name}</div>
      {themes.map((t) => (
        <ThemeFrame key={t.name} theme={t.name}>
          {element.render()}
        </ThemeFrame>
      ))}
    </React.Fragment>
  ))}
</div>;
```

Performance note: ~110 RSC renders. Add `<Suspense>` per row if streaming needed.

**Verification:** `/compare` loads. Sticky headers visible on scroll. Orion column red, Vega column blue throughout.

### Phase 9: Live Brand Injector

**`sites/showcase/lib/brand-vars.ts`**

```ts
import { generateCssVariables } from "@platform/theme-system/generate-css";
import { defaultTheme } from "@platform/theme-system/defaults";
import { deepMerge } from "@platform/theme-system/utils";

export function parseBrandOverrides(params: URLSearchParams) {
  // Reads brand_primary, brand_secondary, brand_accent, font_sans (no # in values)
  // Returns DeepPartialThemeConfig
}

export function buildCustomVars(overrides: DeepPartialThemeConfig): Record<string, string> {
  const merged = deepMerge(defaultTheme, overrides);
  return generateCssVariables(merged);
}
```

**`sites/showcase/components/CustomBrandProvider.tsx`** — `'use client'` — client island:

- Native `<input type="color">` pickers + font text input
- `useMemo` on `buildCustomVars(overrides)` keyed on serialized params
- Debounced `history.replaceState` to update URL
- Renders a "Custom" `<ThemeFrame theme="custom" vars={cssVars}>` wrapping children (passed as render prop)

**`sites/showcase/components/BrandInjectorPanel.tsx`** — sidebar drawer that renders the `CustomBrandProvider` with controls visible.

Integration: the detail page (`/elements/[slug]`) and compare page (`/compare`) include the injector panel. When active (any URL param set), a "Custom" column appears alongside the named theme columns.

URL param schema: `?brand_primary=db0b0b&brand_secondary=1e3a5f&font_sans=Inter`
"Copy share link" button builds the URL including current overrides.

**Verification:**

1. Open `/elements/testimonial-card`
2. Set primary to green via color picker → "Custom" column appears with green brand color
3. Copy URL → paste in new tab → same green preview loads
4. `hover:` on a button in the custom column → hover color is correct (inherits the injected var)

### Phase 10: Type-check and Build

```bash
pnpm --filter showcase type-check
pnpm --filter showcase build
pnpm build  # full monorepo — verify no regressions in dj-fox-electrical or other sites
```

---

## Files to Create / Modify

### Shared packages (modified)

| File                                           | Change                                                           |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| `packages/theme-system/src/tailwind-plugin.ts` | Add `selector` option (default `:root`)                          |
| `packages/theme-system/src/theme-registry.ts`  | **New** — registry + `registerTheme()` + `getRegisteredThemes()` |
| `packages/theme-system/src/index.ts`           | Re-export registry API                                           |
| `packages/themes/orion/index.ts`               | Add `orionDefaultConfig`, call `registerTheme()`                 |
| `packages/themes/vega/index.ts`                | Add `vegaDefaultConfig`, call `registerTheme()`                  |

### Showcase site (all new)

```
sites/showcase/
  package.json
  next.config.ts
  tsconfig.json
  tailwind.config.ts
  app/
    globals.css
    layout.tsx
    page.tsx
    elements/[slug]/page.tsx
    compare/page.tsx
  components/
    ThemeFrame.tsx
    TokenProbe.tsx          ← deleted after Phase 4 gate passes
    ElementBrowser.tsx
    ElementCard.tsx
    CompareTable.tsx
    CustomBrandProvider.tsx
    BrandInjectorPanel.tsx
  lib/
    register-all-themes.ts
    brand-vars.ts
  registry/
    index.ts
    hero.tsx
    cards.tsx
    social-proof.tsx
    cta.tsx
    content.tsx
    navigation.tsx
    blog.tsx
    stats.tsx
    typography.tsx
    tokens.tsx
```

### NOT modified

- `pnpm-workspace.yaml` — `sites/*` glob already covers showcase
- `turbo.json` — pipeline already covers all sites
- Any client site files — zero impact on production sites
- `ThemeName` union in `types.ts` — left intact for existing sites

---

## Risks and Mitigations

| Risk                                               | Mitigation                                                                          |
| -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| globals.css has hardcoded hex (breaks scoping)     | Phase 0 grep; wrap in CSS vars if found                                             |
| `createThemePlugin()` change breaks existing sites | Default selector `:root`; gate: build dj-fox-electrical after Phase 1               |
| Registry empty at build time (tree-shaking)        | `register-all-themes.ts` explicit barrel imported first in tailwind.config.ts       |
| Fixture props don't match component types          | Type-check gate in Phase 5                                                          |
| `/compare` slow with 55 elements                   | `<Suspense>` per row; acceptable for internal tool                                  |
| Brand injector forces whole page to client         | `CustomBrandProvider` is a client island; Orion/Vega columns stay Server Components |

---

## What Was Learned / Decisions Made

- Codex's `[data-theme]` selector-scoped CSS approach is superior to inline vars for named themes — it fixes the globals.css collision that Claude initially accepted as a known limitation
- The theme registry pattern (`registerTheme` side-effect + `getRegisteredThemes()` frozen copy) makes the showcase evergreen — adding a new theme is one file with zero showcase changes
- `register-all-themes.ts` is a necessary safeguard against tree-shaking stripping side-effect imports in the Tailwind config (Node build context)
- The brand injector uses inline CSS var injection (the approach Claude originally proposed for all themes) — but limited to the custom column only, where it's the right tool since values are unknown at build time
- `CustomBrandProvider` as a client island keeps Orion/Vega columns as pure Server Components

---

## Next Steps After This Session

- [ ] Expand element registry from ~10 initial elements to full ~55
- [ ] Add a "theme" filter on the browser page (`?theme=orion`) — show only elements supported by a specific theme
- [ ] Consider exporting a `@platform/themes/all` barrel that `register-all-themes.ts` can import as a single line
