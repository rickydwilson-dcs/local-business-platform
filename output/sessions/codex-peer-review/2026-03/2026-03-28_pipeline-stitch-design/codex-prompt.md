# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-03-28_pipeline-stitch-design/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise
```

---

## Brief: Pipeline — Stitch Design

**Date:** 2026-03-28
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

---

### Problem Statement

The existing `pipeline.ingest` skill bootstraps a new theme by scraping a reference website. This requires a real reference site to exist. For net-new clients with no existing site, there is no design input — the theme ends up generic or requires manual iteration inside the codebase. We need a parallel pipeline path that uses Google Stitch (AI design tool with MCP server) to generate a bespoke UI design upfront, extract its design system and HTML, and use that as the reference to build a new named theme package and test site — without ever touching code until the design is approved.

---

### Goals

- A new skill file `.claude/commands/pipeline.stitch-design.md` that accepts `--trade` (required) and optional `--colors` as inputs
- Theme name is auto-generated — not user-supplied — via `pickNextThemeName()` from `tools/lib/theme-name-picker.ts`, which returns the first unused name from `CONSTELLATION_NAMES` in `packages/theme-system/src/theme-names.ts` (e.g. with orion + vega used, next is `lyra`)
- Uses the Stitch MCP server (pre-installed at user level) to create a project and generate exactly 5 pages: Home, About, Contact, Services collection, Individual service/location detail
- Downloads the Stitch design system tokens + per-page HTML into `output/ingestion/[theme-name]-stitch/design-system/`
- Creates a new named theme package `packages/themes/[theme-name]/` from the design system — following the orion/vega pattern
- Scaffolds a test site from `sites/base-template` → `sites/[theme-name]-test`, wired to the new theme
- Leaves the user with a running test site, no commit, ready to review — the same end state as `pipeline.ingest`

---

### Non-Goals

- Does not iterate on or edit Stitch designs (manual step in Stitch UI)
- Does not commit or push anything
- Does not install or configure the Stitch MCP server (assumed pre-installed)
- Does not replace `pipeline.ingest` — this is a parallel path for when no reference site exists
- Does not generate production-quality images or copy

---

### Acceptance Criteria

- Given `--trade "electrical contractor"`, the skill auto-picks a theme name, creates a Stitch project, generates 5 pages, downloads design system + HTML, creates `packages/themes/[name]/index.ts`, and scaffolds `sites/[name]-test/` — all without error
- `packages/themes/[name]/index.ts` exports `*Registry` (ComponentRegistry), `*DefaultConfig` (DeepPartialThemeConfig), calls `registerTheme()` — passes `pnpm type-check`
- `sites/[name]-test/` carries `.pipeline-test-site.json` marker and `pnpm build` succeeds
- `--colors` is optional: if omitted, Stitch picks its own palette; if provided, it's included in the Stitch generation prompt
- `pipeline.kill-site [name]-test` cleans up the test site (theme package remains)

---

### Constraints

- Skill file: `.claude/commands/pipeline.stitch-design.md` — a Claude Code skill (markdown instruction file, not a script)
- No commit, no push — consistent with `pipeline.ingest`
- Theme package must follow exact orion/vega structure: types from `@platform/theme-system`, same exports (`*Registry`, `*DefaultConfig`, `registerTheme()`)
- Stitch MCP assumed pre-installed at user level (`~/.claude/` config) — fail fast with a clear pointer if tools aren't reachable
- Output folder: `output/ingestion/[theme-name]-stitch/` — parallel to existing ingestion output

---

### Relevant Architecture

**Theme package pattern** (`packages/themes/orion/index.ts`):

```typescript
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const orionRegistry: ComponentRegistry = {
  theme: "orion",
  heroVariant: "image-overlay",  // or "split"
  headerVariant: "dark",          // or "light"
  cardVariant: "icon-circle",     // or "standard"
  sectionVariant: "dark-accent",  // or "standard"
};

export const orionDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: { primary: '#dc2626', primaryHover: '#b91c1c', secondary: '#1f2937', accent: '#f97316' },
    surface: { background: '#ffffff', foreground: '#111827', ... },
    semantic: { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' },
    overlay: { dark: 'rgba(0,0,0,0.8)', ... },
  },
};

registerTheme({ name: 'orion', label: 'Orion', config: orionDefaultConfig });
```

Each theme also has a `globals.css` (vega has one; orion does not). Vega's `globals.css` is ~360 lines of utility classes using `@apply` with theme tokens (`bg-brand-primary`, `text-surface-foreground`, etc.) — buttons, cards, sections, containers, grids, typography, mobile menu, lightbox.

**Theme name auto-assignment** (`tools/lib/theme-name-picker.ts`):

```typescript
export function pickNextThemeName(): string {
  const usedNames: ReadonlySet<string> = new Set(THEME_NAMES);
  for (const name of CONSTELLATION_NAMES) {
    if (!usedNames.has(name)) return name;
  }
  throw new Error("No available theme names remaining.");
}
```

`THEME_NAMES` = implemented themes (currently `["orion", "vega"]`). After this skill runs, the new theme name must be added to `THEME_NAMES`.

**Test site wiring** (from `pipeline.ingest` steps 3–7 — replicate exactly):

1. Copy `sites/base-template` → `sites/[theme-name]-test`, remove `node_modules/.next/.turbo`
2. Write `.pipeline-test-site.json` marker with `createdAt`, `themeName`, `sourceUrl` (empty for Stitch), `pipelineOutput`
3. Rewrite `theme.config.ts` importing registry + defaultConfig from `@platform/themes/[theme-name]`
4. Rewrite `app/globals.css` importing theme's `globals.css`
5. Generate CI-inert `package.json` via `tools/lib/test-site-package.ts` `generateTestSitePackageJson()`
6. Update `site.config.ts` tagline
7. Rewrite `app/layout.tsx` as a bare shell with ThemeProvider (no SiteHeader/Footer — example pages supply their own)
8. Unlike `pipeline.ingest`, there are no pre-generated example pages from an ingestion run — the test site will use the base-template pages wired to the new theme (or this is a gap to address)
9. Run `pnpm install --lockfile-only`; stage `pnpm-lock.yaml` + new site + new theme package

**Stitch MCP integration**: Stitch provides an MCP server with tools including:

- Create project
- Generate screen (create a page with a prompt)
- Get design system (returns tokens JSON)
- Get screen HTML (returns full working HTML for a screen)
- List projects / list screens

The workflow: create project → generate each screen → get design system → get HTML for each screen.

---

### Codebase Snapshot

| Path                                       | What it is                                                       |
| ------------------------------------------ | ---------------------------------------------------------------- |
| `.claude/commands/pipeline.ingest.md`      | Reference skill — replicate steps 3–7 for test site wiring       |
| `.claude/commands/pipeline.kill-site.md`   | Cleanup skill — already handles `.pipeline-test-site.json` sites |
| `packages/themes/orion/index.ts`           | Theme package template                                           |
| `packages/themes/vega/index.ts`            | Theme package template (alternate variants)                      |
| `packages/themes/vega/globals.css`         | Theme CSS template (~360 lines of utility classes)               |
| `packages/theme-system/src/types.ts`       | `ComponentRegistry`, `DeepPartialThemeConfig`, `ThemeConfig`     |
| `packages/theme-system/src/theme-names.ts` | `CONSTELLATION_NAMES` master list                                |
| `tools/lib/theme-name-picker.ts`           | `pickNextThemeName()` function                                   |
| `tools/lib/test-site-package.ts`           | `generateTestSitePackageJson()` utility                          |
| `sites/base-template/`                     | Source for test site copy                                        |

---

### What a Good Plan Should Cover

1. **Stitch prompt design**: What exactly should Claude send to Stitch to generate pages for a given trade type? How should colour guidance be incorporated? How specific should the page-level prompts be?

2. **Design system → ThemeConfig mapping**: Stitch returns a token JSON blob. What is the mapping from Stitch token names to the platform's `ThemeConfig` shape (`colors.brand.primary`, etc.)? The plan should define a concrete mapping table, because executing agents need to know how to handle unknown or missing tokens.

3. **ComponentRegistry inference**: The `heroVariant`, `headerVariant`, `cardVariant`, `sectionVariant` choices must be inferred from the Stitch design. What heuristics should the executing agent use? (e.g. is the hero full-bleed → `image-overlay`; is the header dark-background → `dark`)

4. **globals.css decision**: Should the new theme package include a `globals.css`? Vega has one (extensive); orion does not. The test site wiring in `pipeline.ingest` assumes a globals.css exists (Step 5b imports it). What's the right call here, and why?

5. **Example pages gap**: `pipeline.ingest` copies generated example pages into the test site (Step 5f). Those pages don't exist for a Stitch-generated theme. Should the Stitch HTML be used as example pages (converted to TSX), or should the test site just use base-template pages with theme tokens applied?

6. **THEME_NAMES sync**: After the skill creates a new theme package, `THEME_NAMES` in `packages/theme-system/src/types.ts` must be updated so `pickNextThemeName()` doesn't reassign the same name on the next run. Should the skill do this, or is it a manual step?

7. **Visual comparison**: `pipeline.ingest` generates a Playwright visual comparison test. Should `pipeline.stitch-design` do something similar — e.g. comparing the test site against the Stitch HTML exports?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-03-28_pipeline-stitch-design/`.

Then output this command for the user to copy-paste into Claude Code:

```
/plan.with.codex synthesise
```
