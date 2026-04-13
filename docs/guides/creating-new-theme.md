# Creating a New Theme

**Scope:** Local Business Platform — `packages/themes/`

There are two ways to create a new theme, depending on whether you have a reference website to work from. Both produce the same output: a named theme package in `packages/themes/` and a test site in `sites/` to verify it.

---

## Which pipeline to use?

| Situation                                      | Command                   |
| ---------------------------------------------- | ------------------------- |
| Client has an existing website to extract from | `/pipeline.ingest`        |
| No existing website — generate from scratch    | `/pipeline.stitch-design` |

---

## Option A: From a reference website (`/pipeline.ingest`)

Use this when the client has an existing website. The pipeline screenshots the site, extracts colours and layout patterns, and builds a theme package from what it finds.

```bash
/pipeline.ingest --url "https://example.com" [--trade "electrical contractor"]
```

- `--url` (required) — the reference website to scrape
- `--trade` (optional) — business type hint; helps with content generation

The pipeline assigns a theme name automatically from the constellation namespace. Current themes: `atlas`, `castor`, `corvus`, `cygnus`, `lyra`, `nova`, `orion`, `polaris`, `sirius`, `solaris`, `vega`.

**What it produces:**

- Screenshots and extracted tokens in `output/ingestion/<theme-name>/`
- `packages/themes/<theme-name>/` — the theme package
- `sites/test-<theme-name>/` — a test site wired to the new theme

**After it runs:**

1. Check `output/ingestion/<theme-name>/meta/token-mapping-report.json` — verify colour extraction looks right
2. Run `cd sites/test-<theme-name> && npm run dev` to preview
3. Adjust colours in `packages/themes/<theme-name>/index.ts` if needed
4. Run `/deploy.changes` when satisfied

---

## Option B: AI-generated from a trade description (`/pipeline.stitch-design`)

Use this when there's no existing website. Google Stitch generates a bespoke design from a trade/profession description. The pipeline extracts the design tokens and wires up a theme package.

**Requires:** Google Stitch MCP configured at user level. If you see "Stitch MCP tools not available", the MCP server needs to be registered first:

```bash
claude mcp add stitch --transport http https://stitch.googleapis.com/mcp \
  --header "X-Goog-Api-Key: YOUR_API_KEY" -s user
```

```bash
/pipeline.stitch-design --trade "electrical contractor" [--colors "dark navy and yellow"]
```

- `--trade` (required) — the business/profession type; drives the Stitch generation prompt
- `--colors` (optional) — colour scheme hint; omit to let Stitch choose

The pipeline assigns a theme name automatically from the constellation namespace.

**What it produces:**

- 5 Stitch-generated page designs (home, about, contact, services, service detail)
- Design tokens in `output/ingestion/<theme-name>-stitch/`
- `packages/themes/<theme-name>/` — the theme package
- `sites/<theme-name>-test/` — a test site wired to the new theme

**After it runs:**

1. Open the Stitch project URL (printed in the report) to review designs visually
2. Check `output/ingestion/<theme-name>-stitch/meta/token-mapping-report.json` — verify colour extraction
3. **Step 4b: Convert Stitch HTML → React page templates.** The pipeline extracts tokens automatically but does not yet auto-convert the HTML into TSX components. You must translate each Stitch HTML page into its corresponding `packages/themes/<theme-name>/pages/<page>.tsx`. See [How the Stitch Design Pipeline Works — Step 4b](../architecture/how-stitch-design-pipeline-works.md#step-4b-html--react-conversion-required) for the full checklist.
4. The pipeline runs a **heading drift report** (Step 2e) before downloading assets. It checks whether H1/H2 Tailwind classes are consistent across all 5 pages. If drift is detected you'll be asked to choose: proceed anyway, auto-normalise (rewrites drifted classes to match home), or stop to re-generate. The normaliser is `tools/stitch-normalize-headings.mjs` — run it manually with `--enforce` at any time if you need to re-normalise after iterating on designs.
5. Run `cd sites/<theme-name>-test && npm run dev` to preview
6. Adjust colours in `packages/themes/<theme-name>/index.ts` if needed
7. Run `/deploy.changes` when satisfied

---

## Iterating on colours after the pipeline

Both pipelines extract colours automatically, but you'll often want to fine-tune them. Edit the theme package directly:

```typescript
// packages/themes/<theme-name>/index.ts
export const lyraDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#dc2626", // Adjust this
      primaryHover: "#b91c1c", // ~12% darker than primary
      secondary: "#1e3a5f",
      accent: "#fbbf24",
      onPrimary: "#ffffff",
    },
    // ...
  },
};
```

See [theming.md](./theming.md) for the full token reference and overlay colour guidance.

---

## Cleaning up test sites

Both pipelines create test sites that are CI-inert and marked for easy removal. Clean up once you're done iterating:

```bash
/pipeline.kill-site <theme-name>-test   # removes test site (stitch-design output)
/pipeline.kill-site test-<theme-name>   # removes test site (ingest output)
/pipeline.kill-theme <theme-name>       # removes the theme package
```

Only run `/pipeline.kill-theme` if you're abandoning the theme entirely. If you're promoting it to a real site, keep the package.

---

## Theme Package File Conventions

These conventions are **mandatory** — violating them causes jiti/Tailwind resolution failures at dev time.

### Component files: lowercase, named exports

Theme components (`components/`) use **lowercase filenames** and **named exports** in the barrel:

```
packages/themes/<theme-name>/components/
├── index.ts      # Named exports only (no export *)
├── header.tsx    # lowercase filename
└── footer.tsx    # lowercase filename
```

```typescript
// components/index.ts — CORRECT
export { LyraHeader } from "./header";
export { LyraFooter } from "./footer";

// components/index.ts — WRONG (causes jiti resolution failure)
export * from "./Header"; // PascalCase + wildcard = broken
export * from "./Footer";
```

**Why:** Tailwind evaluates `theme.config.ts` at dev startup via jiti (a CJS-compatible TypeScript loader). Jiti resolves module paths differently from the TypeScript compiler — PascalCase filenames and `export *` patterns can fail to resolve, causing `Cannot find module` errors that block the dev server entirely.

### Theme index.ts: no barrel re-exports

The theme's root `index.ts` must **NOT** re-export from `./components` or `./pages`:

```typescript
// index.ts — CORRECT
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const lyraRegistry: ComponentRegistry = { ... };
export const lyraDefaultConfig: DeepPartialThemeConfig = { ... };
registerTheme({ name: "lyra", label: "Lyra", config: lyraDefaultConfig });

// index.ts — WRONG (forces jiti to load every component/page at config time)
export * from "./components";
export * from "./pages";
```

Sites import components via the **subpath** `@platform/themes/lyra/components`, not from the theme barrel. This avoids pulling component code into the Tailwind config evaluation.

### Page layout files: PascalCase (exception)

Page layouts (`pages/`) use PascalCase filenames (`HomePage.tsx`, `AboutPage.tsx`). This is safe because pages are imported by site code (bundled by Next.js), never evaluated by jiti.

---

## Required: Page Templates

Every new theme package **must** include a `pages/` directory exporting page layout templates. These are props-based Server Components that own the visual layout — the consuming site's `page.tsx` files are thin wrappers that handle data fetching and metadata.

**Required page set for tradesperson themes:**

```
packages/themes/<theme-name>/pages/
├── index.ts              # Named exports for all templates
├── HomePage.tsx
├── ServicesPage.tsx
├── ServiceDetailPage.tsx
├── LocationsPage.tsx
├── LocationDetailPage.tsx
├── BlogPage.tsx
├── BlogPostPage.tsx
├── ProjectsPage.tsx
├── ProjectDetailPage.tsx
├── ReviewsPage.tsx
├── AboutPage.tsx
└── ContactPage.tsx
```

Event/conference themes (atlas, corvus) use a custom page set suited to their use case instead of the tradesperson set.

All template props interfaces (`HomePageTemplateProps`, `ServicePageTemplateProps`, `LocationPageTemplateProps`, etc.) are defined in `@platform/core-components` — specifically `packages/core-components/src/lib/page-template-types.ts`. Import and use these types; do not define local prop types in the theme package. The `SiteConfigSummary` type (also from that file) is the standard way to pass minimal site config to templates.

---

## Promoting a theme to a real site

Once the theme looks right in the test site:

1. Create the new site: [Adding a New Site](./adding-new-site.md)
2. In the new site's `theme.config.ts`, import from the theme package:

```typescript
import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { lyraRegistry, lyraDefaultConfig } from "@platform/themes/lyra";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: lyraRegistry,
  ...lyraDefaultConfig,
  colors: {
    ...lyraDefaultConfig.colors,
    brand: {
      ...lyraDefaultConfig.colors?.brand,
      primary: "#dc2626", // Override with client's exact brand color if needed
    },
  },
};
```

3. Remove the test site: `/pipeline.kill-site <theme-name>-test`

---

## Related

- [theming.md](./theming.md) — token reference, overlay colours, Tailwind utilities
- [Adding a New Site](./adding-new-site.md) — full site creation workflow
- [How the Ingestion Pipeline Works](../architecture/how-ingestion-pipeline-works.md)
- [How the Stitch Design Pipeline Works](../architecture/how-stitch-design-pipeline-works.md)
