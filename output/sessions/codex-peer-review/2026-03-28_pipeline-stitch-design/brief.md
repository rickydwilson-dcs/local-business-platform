# Brief: Pipeline — Stitch Design

**Date:** 2026-03-28
**Status:** Clarified — ready for dual-model peer review

---

## Problem Statement

The existing `pipeline.ingest` skill bootstraps a new theme by scraping a reference website. This requires a real reference site to exist. For net-new clients with no existing site, there is no design input — the theme ends up generic or requires manual iteration inside the codebase. We need a parallel pipeline path that uses Google Stitch (AI design tool with MCP server) to generate a bespoke UI design upfront, extract its design system and HTML, and use that as the reference to build a new named theme package and test site — without ever touching code until the design is approved.

## Goals

- A new skill `/pipeline.stitch-design` that accepts a trade/profession description and optional colour scheme as inputs; theme name is auto-generated from the constellation namespace
- Uses the Stitch MCP server to create a Stitch project and generate 5 pages: Home, About, Contact, Services (collection/listing), and Individual Service/Location detail page
- Downloads the Stitch design system tokens and per-page HTML into a local reference folder
- Creates a new named theme package (`packages/themes/[name]/`) from the design system — following the orion/vega pattern (registry + defaultConfig + registerTheme)
- Scaffolds a test site from `sites/base-template` wired to the new theme (same as pipeline.ingest steps 3–7)
- Leaves the user at the same state pipeline.ingest does: test site running, no commit, ready to review

## Non-Goals

- Does not iterate on or edit Stitch designs (that is a manual step in the Stitch UI or a separate command)
- Does not commit or push anything (consistent with pipeline.ingest)
- Does not install or configure the Stitch MCP server (assumes pre-installed at user level)
- Does not generate real images/copy for production — Stitch placeholder content is fine at this stage
- Does not replace pipeline.ingest for the "reference site exists" path — these are parallel paths

## User Interactions / Happy Path

1. User runs: `/pipeline.stitch-design --trade "electrical contractor" --colors "dark navy and electric yellow"`
   - `--trade` required: describes the business type (used as the Stitch prompt)
   - `--colors` optional: preferred colour scheme; if omitted, Stitch chooses its own
   - Theme name is **auto-generated**: first unused name from `CONSTELLATION_NAMES` via `tools/lib/theme-name-picker.ts` (e.g. `lyra` next after orion + vega)
2. Claude performs preflight: checks git branch is `develop`, working tree clean, Stitch MCP tools available
3. Claude calls Stitch MCP to create a new project named `[theme-name]-stitch`
4. Claude sends a structured prompt to Stitch to generate 5 pages (Home, About, Contact, Services collection, Individual service/location detail), incorporating trade type and optional colours
5. Claude downloads the Stitch design system into `output/ingestion/[theme-name]-stitch/design-system/`
6. Claude downloads the HTML for each of the 5 pages into the same folder as `[page-slug].html`
7. Claude creates `packages/themes/[theme-name]/index.ts` — extracting colours, typography, and component variants from the design system into the orion/vega pattern
8. Claude creates a test site by copying `sites/base-template` → `sites/[theme-name]-test`
9. Claude wires the test site to the new theme (theme.config.ts, globals.css, package.json, site.config.ts, layout.tsx) — same as pipeline.ingest steps 5–5g
10. Claude reconciles the lockfile (`pnpm install --lockfile-only`)
11. Claude stages the lockfile + test site
12. Claude reports: Stitch project URL, design system location, test site name, and next steps

**Failure cases:**
- Stitch MCP tools not found → fail fast with setup instructions (point to Stitch MCP docs)
- Stitch project creation fails → report error, do not proceed
- Auto-picked theme name somehow already exists as a package or site → fail with diagnostic (this shouldn't happen if `THEME_NAMES` is kept in sync)

## Acceptance Criteria

- Given a valid `--trade`, when the skill runs to completion, then `packages/themes/[auto-theme-name]/index.ts` exists and exports a valid registry + defaultConfig following the orion/vega structure; theme name was auto-picked via `pickNextThemeName()`
- Given the skill completes, then `output/ingestion/[theme-name]-stitch/design-system/` contains the Stitch design system file and 5 HTML files
- Given the skill completes, then `sites/[theme-name]-test/` exists with `.pipeline-test-site.json` marker, theme wired, and `pnpm build` succeeds
- Given `--colors` is omitted, Stitch chooses its own palette and the skill still completes without error
- Given `--colors` is provided, the Stitch prompt includes that colour guidance and the extracted theme colours reflect it

## Constraints

- Skill file lives in `.claude/commands/pipeline.stitch-design.md` — same convention as pipeline.ingest.md
- Must follow the same no-commit/no-push rule as pipeline.ingest
- Theme package must follow the exact orion/vega structure: `index.ts` exports `*Registry` (ComponentRegistry), `*DefaultConfig` (DeepPartialThemeConfig), calls `registerTheme()` — types from `@platform/theme-system`
- Test site must carry `.pipeline-test-site.json` marker so `pipeline.kill-site` can clean it up
- Output folder for Stitch assets: `output/ingestion/[theme-name]-stitch/` (parallel to existing ingestion output structure)
- Assumes Stitch MCP is pre-installed at user level (`~/.claude/` config)

## Open Questions

- The Stitch MCP `get_design_system` tool returns a JSON blob — the skill needs to map Stitch's token names (primary color, font family, etc.) to the platform's `ThemeConfig` shape. This mapping logic should be documented in the skill so executing agents know how to handle it. The planning models should define the mapping table.
- Should the skill generate a `globals.css` for the new theme package (like vega has `globals.css`)? Vega has one; orion does not. Planning models should recommend based on what pipeline.ingest currently does for the theme CSS step.
