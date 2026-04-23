# Component Library Migration Brief (Self-Containment)

## What This Brief Is

Site-agnostic YOLO brief for migrating a site off `@platform/themes/*` to self-contained architecture.
Reference site: `sites/colossus-scaffolding/` (post-migration gold standard).

## Invariant

After migration, this must return zero hits:

```bash
grep -rn "@platform/themes\|packages/themes" sites/<name> --exclude-dir=node_modules --exclude-dir=.next
```

## Per-Site Configuration

| Site          | Theme   | Source package           | Components to copy (source → dest)                                                            |
| ------------- | ------- | ------------------------ | --------------------------------------------------------------------------------------------- |
| base-template | vega    | packages/themes/vega/    | header.tsx → SiteHeader, footer.tsx → SiteFooter                                              |
| dcs           | solaris | packages/themes/solaris/ | header.tsx → SiteHeader, footer.tsx → SiteFooter, scroll-reveal-script.tsx → SiteScrollReveal |
| mad-graphics  | cygnus  | packages/themes/cygnus/  | header.tsx → SiteHeader, footer.tsx → SiteFooter                                              |

## The 7-Step Recipe

### Step 1 — Inline theme globals.css

Read `packages/themes/<theme>/globals.css`.
Open `sites/<name>/app/globals.css`.
Replace the `@import` line for the theme (e.g. `@import "../../packages/themes/vega/globals.css"`)
with the **FULL CONTENT** of the theme globals.css file.

**IMPORTANT — two lines to strip from the inlined content:**

1. Remove the `@import "../../core-components/src/styles/animations.css"` line (or the single-quoted variant).
   It is a relative path from the theme package and will break from the site.
   The site should instead ensure it has `@import "../../../packages/core-components/src/styles/animations.css"`
   at the top of its globals.css (check colossus reference: that import is the first line after any leaflet import).

2. **cygnus only:** Remove the `@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined...')` line.
   External CSS `@import url()` is silently ignored after `@tailwind` expansion (CSS spec: `@import` must precede all other rules).
   Instead, add the equivalent `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />` tag inside the `<head>` block of `sites/mad-graphics/app/layout.tsx`.

### Step 2 — Copy theme layout components into the site

Read `packages/themes/<theme>/components/header.tsx` (and footer.tsx, scroll-reveal-script.tsx where applicable).
Write them to `sites/<name>/components/site-header.tsx` and `sites/<name>/components/site-footer.tsx` (and `site-scroll-reveal.tsx` for dcs).
Rename all exported identifiers to generic names (`SiteHeader`, `SiteFooter`, `SiteScrollReveal`).

Update `sites/<name>/app/layout.tsx`:

- Replace `import { VegaHeader, VegaFooter } from '@platform/themes/vega/components'`
  (or equivalent for solaris/cygnus) with:
  ```ts
  import { SiteHeader } from "@/components/site-header";
  import { SiteFooter } from "@/components/site-footer";
  // (dcs also adds:) import { SiteScrollReveal } from '@/components/site-scroll-reveal';
  ```
- Replace all JSX usages of the theme component names with the new generic names.
- Remove the `ThemeProvider` wrapper if present — colossus layout.tsx has no ThemeProvider.
  (ThemeProvider from core-components is client-only and not needed in self-contained sites.)
  Remove: `import { ThemeProvider } from '@platform/core-components'`
  Remove: `<ThemeProvider theme="..." registry={...}>` wrapper element (keep its children).
- Remove `import { <theme>Registry } from '@platform/themes/<theme>'`
- Remove `registry={<theme>Registry}` from PageShell props if present.

### Step 3 — Inline the componentRegistry into theme.config.ts

Read `packages/themes/<theme>/index.ts` — extract the `<theme>Registry` object literal.
Open `sites/<name>/theme.config.ts`.
Delete: `import { <theme>Registry } from '@platform/themes/<theme>'`
Delete: `componentRegistry: <theme>Registry,` line from themeConfig.
Add a separate export:

```ts
export const registry: ComponentRegistry = { <paste inline object> };
```

Add import at top:

```ts
import type { ComponentRegistry } from "@platform/theme-system";
```

(No runtime side effects — the registry is consumed by tooling only.)

**Registry values by theme:**

- **vega:** `{ theme: "vega", heroVariant: "split", headerVariant: "light", cardVariant: "standard", sectionVariant: "standard" }`
- **solaris:** `{ theme: "solaris", heroVariant: "split-geometric", headerVariant: "light", cardVariant: "elevated", sectionVariant: "skewed" }`
- **cygnus:** `{ theme: "cygnus", heroVariant: "image-overlay", headerVariant: "dark", cardVariant: "standard", sectionVariant: "dark-accent" }`

### Step 4 — Delete @platform/themes path aliases from tsconfig.json

Open `sites/<name>/tsconfig.json`.
Delete every `"paths"` entry whose key starts with `@platform/themes/` or `@platform/themes`.
Keep all `@platform/core-components`, `@platform/theme-system`, `@platform/component-composition` entries.

### Step 5 — Scope Tailwind content globs

Open `sites/<name>/tailwind.config.ts`.
Remove these glob patterns (they scan theme packages):

```
'../../packages/themes/*/*.{js,ts,jsx,tsx}'
'../../packages/themes/*/components/**/*.{js,ts,jsx,tsx}'
```

Keep: `'../../packages/core-components/src/**/*.{js,ts,jsx,tsx}'`
Keep: `'../../packages/component-composition/src/**/*.{js,ts,jsx,tsx}'` (if present)

### Step 6 — Remove @platform/themes from package.json

Open `sites/<name>/package.json`.
Delete `"@platform/themes": "workspace:*"` from dependencies and/or devDependencies.
Keep `@platform/core-components`, `@platform/theme-system`, `@platform/component-composition`.

### Step 7 — Verify

Run the invariant grep:

```bash
grep -rn "@platform/themes\|packages/themes" sites/<name> --exclude-dir=node_modules --exclude-dir=.next
```

Must return **ZERO hits**. If any hits remain, fix them before continuing.

## Worktree Pre-flight

Fresh git worktrees do not have `dist/` built for the shared packages. Before running any site build, run:

```bash
pnpm --filter @platform/theme-system run build
```

This produces `packages/theme-system/dist/tailwind-plugin.js` which Tailwind's jiti loader requires at config evaluation time. Without it, all site builds fail with `Cannot find module '@platform/theme-system/dist/tailwind-plugin.js'`.

## Discovered in Parallel Run 2026-04-23

**Pages components also need copying.** All theme packages include a `pages/` directory with page-level template components (e.g. `VegaHomePage`, `SolarisServicesPage`, `CygnusProjectDetailPage`). These are imported by the site's `app/` page files and must be copied and renamed just like the layout components:

- Copy `packages/themes/<theme>/pages/*.tsx` → `sites/<name>/components/pages/*.tsx`
- Rename exported identifiers: `<Theme><PageName>Page` → `<PageName>Page` (e.g. `VegaHomePage` → `HomePage`)
- Update all `app/<page>/page.tsx` imports to point at `@/components/pages/<PageName>`
- Run the invariant grep after — `@platform/themes/*/pages` imports also break it

**Header may have sibling component dependencies.** The cygnus header imports `CygnusLocationsDropdown` from a sibling file in the theme's components directory. Check each theme's `components/` directory for sibling files referenced by header.tsx or footer.tsx and copy them too.

**Check app/page.tsx for registry imports.** Some sites import the theme registry in `app/page.tsx` for conditional logic. If the invariant grep finds a match there, replace the import with `import { registry } from '@/theme.config'` (no logic change — only the import source changes).

## Verification Commands (per site, run from site directory)

```bash
npm run type-check           # must exit 0
npm run build                # must exit 0 — use --no-lint to skip lint if needed
```
