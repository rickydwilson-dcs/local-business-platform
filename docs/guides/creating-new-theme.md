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

The pipeline assigns a theme name automatically from the constellation namespace. Current themes: `atlas`, `castor`, `cygnus`, `lyra`, `nova`, `orion`, `polaris`, `rigel`, `sirius`, `solaris`, `vega`.

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
3. The pipeline runs a **heading drift report** (Step 2e) before downloading assets. It checks whether H1/H2 Tailwind classes are consistent across all 5 pages. If drift is detected you'll be asked to choose: proceed anyway, auto-normalise (rewrites drifted classes to match home), or stop to re-generate. The normaliser is `tools/stitch-normalize-headings.mjs` — run it manually with `--enforce` at any time if you need to re-normalise after iterating on designs.
4. Run `cd sites/<theme-name>-test && npm run dev` to preview
5. Adjust colours in `packages/themes/<theme-name>/index.ts` if needed
6. Run `/deploy.changes` when satisfied

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
