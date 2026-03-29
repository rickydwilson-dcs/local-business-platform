# How the Stitch Design Pipeline Works

The Stitch design pipeline is a parallel path to `/pipeline.ingest` for generating new themes when no reference website exists. Instead of scraping an existing site, it uses Google Stitch (a free AI UI design tool with MCP integration) to generate a bespoke design from a trade/profession description, then extracts the design system and builds a theme package from it.

## When to Use It

Use `/pipeline.stitch-design` when:
- The client has no existing website to scrape
- You want to start from a clean, AI-generated design rather than reverse-engineering an existing one
- You want to iterate on designs visually before touching code

Use `/pipeline.ingest` when a real reference website exists.

## Pipeline Flow

```
--trade "electrical contractor" [--colors "dark navy and yellow"]
  → [Step 1] Preflight — branch check, Stitch MCP probe, auto-pick theme name
  → [Step 2] Create Stitch project, generate 5 pages via MCP
  → [Step 3] Download design system tokens + HTML for each page
  → [Step 4] Map tokens → ThemeConfig, infer ComponentRegistry variants, write theme package
  → [Step 5] Scaffold test site from base-template, wire to new theme
  → [Step 6] Reconcile lockfile, type-check, stage
  → [Step 7] Report — Stitch project, design assets, theme package, test site
```

## Inputs

```bash
/pipeline.stitch-design --trade "electrical contractor" [--colors "dark navy and yellow"]
```

- `--trade` (required) — the business/profession type; drives the Stitch generation prompt
- `--colors` (optional) — colour scheme guidance; if omitted, Stitch chooses its own palette

Theme name is **auto-assigned** from the constellation namespace via `tools/lib/theme-name-picker.ts` — the next unused name from `packages/theme-system/src/theme-names.ts` (e.g. `lyra` after orion + vega).

## Stitch MCP Integration

Stitch provides an MCP server that Claude calls directly. The skill requires the Stitch MCP server to be pre-installed at user level (`~/.claude/`). It will fail fast with setup instructions if the tools are unreachable.

The skill generates exactly 5 pages:

| Page | Purpose |
|------|---------|
| Home | Hero, services overview, testimonials, stats, footer |
| About | Company story, values, trust signals |
| Contact | Contact form, address, hours, map placeholder |
| Services | Collection/listing of all service categories |
| Service Detail | Single service/location detail page |

## Design System Extraction

After generation, the skill downloads:
- `output/ingestion/<theme-name>-stitch/design-system/tokens.json` — Stitch design tokens
- `output/ingestion/<theme-name>-stitch/html/<page>.html` — Full working HTML per page
- `output/ingestion/<theme-name>-stitch/meta/` — Project metadata and token mapping report

### Token Mapping

Stitch token names don't match the platform's `ThemeConfig` shape directly. The skill uses a priority-ordered alias table to map them (e.g. `primaryColor` → `colors.brand.primary`), with sensible fallback defaults when a token isn't present. Every token's resolution source (direct match, alias, or fallback) is recorded in `meta/token-mapping-report.json` — inspect this to verify colour extraction worked correctly.

### ComponentRegistry Inference

The `ComponentRegistry` variants (`heroVariant`, `headerVariant`, `cardVariant`, `sectionVariant`) are inferred by examining the home page HTML — checking for full-bleed background images, header luminance, circular icon containers, and section alternation patterns.

## Theme Package Output

The skill creates `packages/themes/<theme-name>/` following the exact orion/vega pattern:

- `index.ts` — exports `*Registry` (ComponentRegistry), `*DefaultConfig` (DeepPartialThemeConfig), calls `registerTheme()`
- `globals.css` — utility classes using theme tokens (based on vega's template, which is fully colour-agnostic)

It also appends the new theme name to `THEME_NAMES` in `packages/theme-system/src/types.ts` so `pickNextThemeName()` skips it on subsequent runs.

## Test Site

The test site is created at `sites/<theme-name>-test/` (note: suffix style, not prefix — distinct from `/pipeline.ingest` which uses `test-<name>`). It is:
- A copy of `sites/base-template/` wired to the new theme
- Marked with `.pipeline-test-site.json` so `/pipeline.kill-site` can remove it
- CI-inert (no build/test/type-check scripts)
- Uses base-template pages to verify theme tokens resolve — no Stitch HTML conversion

## After the Pipeline

1. Open the Stitch project in your browser to review and iterate on designs visually
2. Check `meta/token-mapping-report.json` — verify colour extraction looks correct
3. Run `cd sites/<theme-name>-test && npm run dev` to confirm the theme wires up
4. When satisfied, run `/deploy.changes`

To clean up:
- `/pipeline.kill-site <theme-name>-test` — removes the test site
- `/pipeline.kill-theme <theme-name>` — removes the theme package

## Key Files

| File | Purpose |
|------|---------|
| `.claude/commands/pipeline.stitch-design.md` | The skill definition |
| `tools/lib/theme-name-picker.ts` | Auto theme name from constellation namespace |
| `packages/theme-system/src/theme-names.ts` | `CONSTELLATION_NAMES` master list |
| `packages/themes/vega/globals.css` | Template for new theme globals.css |
| `packages/themes/orion/index.ts` | Template for new theme index.ts |
