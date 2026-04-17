# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04-17_design-brief-pipeline/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-17_design-brief-pipeline/
```

---

## Brief: Design Brief Pipeline

**Date:** 2026-04-17
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan. No clarified brief was produced for this topic. Challenge assumptions accordingly and flag any scope gaps you identify.

### Problem Statement

The platform creates white-label websites for local service businesses (electricians, plumbers, scaffolders, gardeners). Each client site needs a custom theme package. The current approach clones a reference website's HTML via Playwright, then extracts a theme package from the clone. The HTML cloning is faithful, but the extraction step (`tools/extract-theme.ts`) is fundamentally lossy: it discards the clone's actual HTML structure, generates stub components, and produces output that doesn't visually resemble the reference site.

After multiple iterations of trying to improve the extraction, the decision has been made to take a different approach: **extract a structured design brief from the reference site, then forward-generate components using AI design skills** (Claude with specialized design skill prompts, or Google Stitch MCP).

This decouples "understanding what the reference looks like" from "generating components that capture that look." The brief becomes a reusable, tweakable intermediate format.

### Goals

1. Define a `DesignBrief` intermediate format that captures all design decisions (colors, fonts, layout patterns, section structures, component variants, visual tone) without any HTML/CSS from the reference
2. Build a compiler that deterministically transforms existing analysis outputs (`SiteAnalysis`, `MappedTokens`, vision analysis) into a `DesignBrief`
3. Build a generator that takes a `DesignBrief` + a user-selected design skill and produces a valid theme package
4. Support multiple design skills at the generation step (Impeccable, Stitch, high-end-visual-design, design-taste-frontend, minimalist-ui, etc.)
5. Integrate with the existing visual QA loop for iterative refinement
6. Deprecate the lossy clone-to-theme extraction layer (~8 modules)

### Non-Goals

- Pixel-perfect reproduction of the reference site (we accept visual similarity, not clone fidelity)
- Generating all 11 page templates in the first version (homepage + header/footer first)
- Building a composite "Frankenstein" skill from the start (test individual skills first, consolidate later)
- Changing the theme package output format (must produce standard `packages/themes/<name>/` structure)
- Modifying `analyse-site.ts` or the harvest/analysis pipeline

### Acceptance Criteria

1. `DesignBrief` schema is Zod-validated and contains: palette, typography, layout, componentVariants, pageBlueprints, visualTone
2. Brief compiler produces valid JSON from any `SiteAnalysis` + `MappedTokens` input without calling AI
3. Generator produces a theme package that passes `cs-theme-package-validator` (all 15 rules)
4. Generated components use only theme tokens (no hardcoded hex colors)
5. The pipeline works with at least 2 different design skills
6. Visual QA loop can compare generated output against reference screenshots
7. CLI tool supports both `--url` (full pipeline) and `--brief` (skip harvest) entry points

### Constraints

**Architecture constraints (from CLAUDE.md):**

- All styling must use theme tokens (`bg-brand-primary`, `text-surface-foreground`), never hardcoded hex
- Components are React Server Components by default (no useState/useEffect in layout components)
- Theme packages must export: `ComponentRegistry`, `DeepPartialThemeConfig`, and call `registerTheme()`
- Theme `components/` files use lowercase filenames and named exports in the barrel
- Theme `index.ts` must NOT re-export from `./components` or `./pages` (jiti constraint)
- No `theme()` function in CSS files (causes parser panics) — use CSS custom properties
- Tailwind content globs must not use `**` that descends into node_modules

**Runtime constraints:**

- Header and footer are generated once from the homepage and become fixed assets for all subsequent pages (consistency constraint)
- The design brief contains NO HTML fragments or CSS rules from the reference — only design decisions
- The brief compiler is a pure data transformation (no AI calls)
- User picks the design skill per-run (no auto-detection in v1)

**Integration constraints:**

- Must reuse `analyse-site.ts` unchanged for Stage 1 (harvest)
- Must reuse existing validation functions from `theme-component-generator.ts` (autoRepairHexLiterals, scanForHexLiterals, validateAndFixTokenClasses, validateTypeScriptSyntax, validateTypeScriptSemantic)
- Must reuse `scaffold-theme-package.ts` for final package assembly
- Must reuse `visual-qa-loop.ts` + `pipeline-visual-compare.ts` for QA

### Relevant Architecture

**How the current pipeline works:**

`analyse-site.ts` is a 15-step orchestrator that:

1. Discovers pages via sitemap/nav/probing
2. Captures screenshots + computed styles via Playwright
3. Runs Claude vision analysis on screenshots (produces `ReferenceAnalysis` with section blueprints)
4. Runs multi-page synthesis (deduplicates blueprints across pages)
5. Maps computed CSS values to theme tokens via CIE76 color distance snapping
6. Generates React components from blueprints (this is the lossy part we're replacing)
7. Scaffolds the theme package

**Token reconciliation priority chain:**

```
synthesis+computed (CIE76 snapping) → synthesis only → computed only → vision palette → CSS-scraped → hardcoded defaults
```

**Key types:**

- `SiteAnalysis` — v3, contains discoveredPages, pageBlueprints, visualLanguage, sectionBlueprints, componentMatches, themeTokenRecommendations, registryRecommendation, computedStyles
- `MappedTokens` — { config: DeepPartialThemeConfig, provenance: Record<string, TokenProvenance>, unmappedColours: string[] }
- `SectionBlueprint` — { id, name, category, purpose, layoutPattern, contentSlots, interactionNeeds, tokenUsageHints, confidence, cloneHtmlFragment?, cloneRelevantCss?, matchScore? }
- `ComponentRegistry` — { theme, heroVariant, headerVariant, cardVariant, sectionVariant }
- `JobBrief` — unified pipeline input with source, business, content, theme, qa, imageGen config

**Design skills available:**

- `pbakaus/impeccable` — 18 commands including `/craft`, `/audit`, `/polish`, `/extract`. Anti-pattern detection (24 checks). Apache 2.0.
- `google-labs-code/stitch-skills/stitch-design` — Unified Stitch MCP workflow (prompt refinement + generation + download)
- `google-labs-code/stitch-skills/enhance-prompt` — Transforms briefs into Stitch-optimized prompts
- `google-labs-code/stitch-skills/design-md` — Analyzes Stitch projects into DESIGN.md consistency docs
- `arvindrk/extract-design-system` — Playwright-based token extraction to `tokens.json`/`tokens.css`
- Existing installed skills: `high-end-visual-design`, `design-taste-frontend`, `minimalist-ui`, `industrial-brutalist-ui`, `stitch-design-taste`, `redesign-existing-projects`

**Theme package output structure:**

```
packages/themes/<name>/
├── index.ts          (registry + default config + registerTheme())
├── globals.css       (btn-primary, card, section utility classes)
├── manifest.ts       (component entries)
├── components/
│   ├── index.ts      (barrel export)
│   ├── header.tsx    (themed header)
│   └── footer.tsx    (themed footer)
└── pages/
    ├── index.ts      (barrel export)
    └── home.tsx      (HomePage template)
```

### Codebase Snapshot

| File                                       | Purpose                                                                                                                |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `tools/analyse-site.ts`                    | 15-step orchestrator: URL → SiteAnalysis + theme package. ~600 lines.                                                  |
| `tools/lib/reference-analysis-types.ts`    | All type definitions: SiteAnalysis, SectionBlueprint, ComponentMatch, DiscoveredPage, PageBlueprint, ReferenceAnalysis |
| `tools/lib/computed-style-token-mapper.ts` | `mapStylesToTokens()`, `enhanceSynthesisWithComputedValues()`, `computedTokensToRecommendations()`. CIE76 snapping.    |
| `tools/lib/analysis-schemas.ts`            | Zod schemas: SiteSynthesisResponseSchema, VisualLanguageSchema, ThemeTokensSchema                                      |
| `tools/lib/reference-analysis-prompts.ts`  | Vision prompt template for Claude screenshot analysis → ReferenceAnalysis JSON                                         |
| `tools/lib/theme-component-generator.ts`   | Component generation + validation pipeline: syntax check, semantic check, token validation, hex repair, retry loops    |
| `tools/lib/theme-component-templates.ts`   | Prompt templates and shell wrappers (serverComponentShell, clientComponentShell) for generated components              |
| `tools/scaffold-theme-package.ts`          | Assembles packages/themes/<name>/ from analysis: index.ts, globals.css, manifest.ts, components/, README.md            |
| `tools/lib/visual-qa-loop.ts`              | Screenshot capture, pixel diff, structural diff, dev server management, iterative QA                                   |
| `tools/lib/pipeline-visual-compare.ts`     | `compareImages()` — per-pixel RGB diff using sharp                                                                     |
| `tools/lib/pipeline-brief-types.ts`        | `JobBrief` unified pipeline input schema (source, business, content, theme, qa)                                        |
| `tools/lib/computed-style-extractor.ts`    | Playwright `page.evaluate()` extraction of per-element computed CSS                                                    |
| `tools/lib/screenshot-capture.ts`          | Playwright screenshot capture at 1440x900                                                                              |
| `tools/lib/site-discovery.ts`              | `discoverPages()` — sitemap, nav, probe                                                                                |
| `tools/lib/multi-page-analyzer.ts`         | `analyzeMultiplePages()` — per-page vision + cross-page synthesis                                                      |
| `tools/lib/html-structure-analyzer.ts`     | `extractTopLevelBlocks()`, `classifySection()` — deterministic section detection                                       |
| `tools/lib/token-class-allowlist.ts`       | Tailwind class allowlist for validation                                                                                |
| `packages/theme-system/src/types.ts`       | `ThemeConfig`, `DeepPartialThemeConfig`, `ComponentRegistry` type definitions                                          |
| `.claude/commands/pipeline.ingest.md`      | Existing `/pipeline.ingest` skill (3-phase: harvest, validate, scaffold)                                               |

**Modules to be deprecated (replaced by the new pipeline):**

- `tools/extract-theme.ts` (Pass 1: Translate + Pass 2: Strip)
- `tools/lib/theme-component-templates.ts` (prompt templates)
- `tools/lib/clone-section-extractor.ts` (blueprint-to-HTML correlation)
- `tools/lib/clone-css-rule-extractor.ts` (CSS extraction from clones)
- `tools/lib/clone-entry/design-skill.ts` (old design skill entry)
- `tools/lib/html-to-jsx-converter.ts` (mechanical HTML→JSX)
- `tools/clone-site.ts` (optional — only needed for HTML baseline, not in primary path)

### What a Good Plan Should Cover

1. **DesignBrief schema design** — What fields, what Zod constraints, how does it map from existing types (SiteAnalysis, MappedTokens, ReferenceAnalysis)?
2. **Compiler architecture** — How to deterministically merge analysis outputs into a brief. Edge cases: missing computed styles, failed vision analysis, partial token reconciliation.
3. **Generator architecture** — How to format the brief into prompts for different design skills. How to handle the header/footer-from-homepage constraint. How to assemble output into theme package format.
4. **Skill adapter pattern** — What's the interface between the brief and each skill? How much skill-specific logic lives in the adapter vs. being generic?
5. **Visual QA enhancement** — How to diagnose diffs (not just detect them) and feed corrections back to the design skill. Component-level vs. page-level re-generation.
6. **CLI and skill command design** — Entry points, flags, phases, error handling.
7. **Deprecation strategy** — What to remove, in what order, how to verify nothing breaks.
8. **Testing strategy** — How to verify the pipeline end-to-end without requiring a live reference site every time.

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04-17_design-brief-pipeline/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-17_design-brief-pipeline/`
