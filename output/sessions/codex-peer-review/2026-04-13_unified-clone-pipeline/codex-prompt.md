# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04-13_unified-clone-pipeline/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-13_unified-clone-pipeline/
```

---

## Brief: Unified Clone-to-Theme-to-Scaffold Pipeline with Visual QA Loops

**Date:** 2026-04-13
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The platform needs to generate client websites from design references, but the current ingest pipeline (`tools/analyse-site.ts`) produces sites that diverge significantly from reference sites. The corvus theme (generated from colorcode.events) demonstrates the gap: zero of 18 downloaded images are referenced by any generated component, hero layout is wrong (blurred circles vs centered text), section colors default to generic tokens instead of the reference's bold yellow/blue/green, and the about page is completely different from the reference (missing full-bleed speaker cards with photos).

Root cause: the component generator receives only abstract `SectionBlueprint` metadata and hallucinates "inspired by" components. It never sees the actual HTML structure, downloaded images, or per-section computed colors.

The owner wants a 3-stage pipeline architecture:

1. **Clone** a reference design (near-indistinguishable reproduction)
2. **Extract** a reusable theme (strip content, leave structure)
3. **Scaffold** a client site (fill theme with new content + AI-generated images)

With three entry points into Stage 1:

- **Entry A: Ingest** — clone a live website URL via Playwright + HTML download
- **Entry B: Stitch MCP** — generate screens via Google Stitch AI design tool
- **Entry C: Design Skill** — use Claude design skills (high-end-visual-design, minimalist-ui, industrial-brutalist-ui, etc.) to generate HTML/CSS directly

All three entries must converge to the same intermediate format before Stages 2-3.

Additionally, a **pre-step intake Q&A** session (interactive, separate from the pipeline) must produce a self-contained job brief JSON that the autonomous pipeline reads. This enables overnight runs on a remote Mac Mini ("deathstar") via a single command.

### Goals

1. Test sites should be near-indistinguishable from their reference (whether that's a live URL, Stitch output, or design skill output)
2. Three entry points converge to one clone format, then Stages 2-3 are identical
3. Playwright-driven visual QA loops automatically iterate to improve fidelity (capture → diff → review → fix → re-capture)
4. Pre-step intake produces a complete job brief JSON; the pipeline itself is fully autonomous from that point
5. Interactive mode has checkpoints (post-clone, post-extract, pre-image-gen, post-scaffold); autonomous mode runs straight through
6. Gemini image generation (already production-ready) plugs into Stage 3

### Non-Goals

- Rewriting the existing Stitch pipeline skill from scratch (modify it to output to clone format)
- Capturing JavaScript interactivity from reference sites (static reproduction only)
- Real-time visual preview during generation (QA loops run after generation, not during)
- Replacing the existing theme package format (orion/vega/corvus pattern must be preserved)

### Acceptance Criteria

1. `npx tsx tools/clone-and-scaffold.ts --brief output/briefs/[jobId].json` runs end-to-end unattended
2. Stage 1 visual diff: <5% pixel difference on home/about pages vs reference screenshots
3. Stage 2 theme package passes TPV (Theme Package Validator) and type-check
4. Stage 3 scaffold site runs `npm run dev` successfully with placeholder images
5. Gemini image manifest generated for any site (not just colossus)
6. Brief JSON contains all information needed for autonomous execution (no interactive prompts mid-pipeline)

### Constraints

**Architecture constraints (from CLAUDE.md):**

- MDX-only content — no centralized data files
- Theme tokens only — never hardcode hex colors in components (but per-section custom properties in globals.css are acceptable)
- Named exports only, TypeScript interfaces for all props
- Git workflow: develop → staging → main (never push directly to main)
- Build uses `next build --webpack` (not Turbopack) in CI
- Tailwind content globs must NOT use `packages/themes/**/*.{ext}` (descends into node_modules)
- Theme packages export Header/Footer as Server Components

**Pipeline constraints:**

- Visual QA loop must cap iterations (default 3) to avoid infinite loops
- `cs-visual-fidelity-reviewer` agent is read-only (14 rules, VFR-001 through VFR-014); a separate `cs-frontend-engineer` agent applies fixes
- Existing `pipeline-visual-compare.ts` uses per-pixel RGB diff with threshold 30, page thresholds 5% home/about, 10% default
- Gemini image generation: real-time mode (3s/image) or batch API (overnight, 2M token quota)
- Image manifest currently hardcoded to colossus-scaffolding — must be generalized

**Intake constraints:**

- Pre-step intake is interactive and CANNOT be part of the autonomous pipeline
- The brief JSON must be self-contained — the pipeline reads it and needs nothing else
- Existing intake system (`packages/intake-system/`) has chat-based flow with 10 sections, industry templates, color extraction, and Zod-validated ProjectFile schema

### Relevant Architecture

**Current ingest pipeline** (`tools/analyse-site.ts`): 15-step orchestrator — discover pages, fetch HTML, capture screenshots, extract colors, vision analysis (Claude Sonnet, max 6 pages), component matching, AI component generation, page templates, theme package scaffold, TypeScript check. HTML is downloaded but only vision analysis feeds the component generator.

**Stitch pipeline** (`.claude/commands/pipeline.stitch-design.md`): MCP-based — create project, create design system (with taste-informed DESIGN.md), generate 5 screens, apply design system, export HTML, download images, convert HTML→React (Step 4b), scaffold test site, visual fidelity review (Step 5i). Already does HTML-to-React conversion but outputs directly to theme package, not to an intermediate clone.

**Design skills**: System-provided Claude skills (stitch-design-taste, high-end-visual-design, minimalist-ui, industrial-brutalist-ui, design-taste-frontend). Output HTML/CSS files. Currently used standalone or fed into Stitch's `designMd` field.

**Visual comparison** (`tools/lib/pipeline-visual-compare.ts`): Sharp-based pixel diff. Compares two PNGs, outputs diffPercent + optional red-highlighted diff image. No iteration loop — one-shot comparison.

**Gemini image pipeline**: Production-ready. `generate-image-manifest.ts` → `generate-images-ai.ts` (real-time) or `generate-images-batch.ts` (batch API) → `upload-generated-images.ts` (R2) → `update-mdx-images.ts`. Currently hardcoded to colossus locations content.

**Intake system** (`packages/intake-system/`): Chat-based with 8 MCP tools. Collects business info across 10 sections (identity, address, hours, credentials, services, locations, pricing, brand, social). Produces ProjectFile JSON. Has industry templates for scaffolding, plumbing, electrical, cleaning, landscaping.

### Codebase Snapshot

| Path                                         | What it contains                                          |
| -------------------------------------------- | --------------------------------------------------------- |
| `tools/analyse-site.ts`                      | 15-step ingest pipeline orchestrator (~700 lines)         |
| `tools/lib/`                                 | 29 utility modules for the pipeline                       |
| `tools/lib/html-structure-analyzer.ts`       | Regex-based section detection from HTML                   |
| `tools/lib/screenshot-capture.ts`            | Playwright wrapper, 1440x900, computed styles             |
| `tools/lib/computed-style-extractor.ts`      | 16 role-based CSS extraction via page.evaluate()          |
| `tools/lib/theme-component-generator.ts`     | AI-driven TSX generation with fallback                    |
| `tools/lib/theme-component-templates.ts`     | Component shell templates, prompt builder                 |
| `tools/lib/pipeline-visual-compare.ts`       | Sharp pixel diff, per-page thresholds                     |
| `tools/lib/page-template-generator.ts`       | Next.js page file generation                              |
| `tools/lib/reference-analysis-types.ts`      | Core types: SectionBlueprint, PageBlueprint, SiteAnalysis |
| `tools/lib/component-matcher.ts`             | Jaccard similarity against core component catalog         |
| `tools/scaffold-theme-package.ts`            | Theme package directory scaffolder                        |
| `tools/generate-image-manifest.ts`           | Image manifest from MDX (colossus-specific)               |
| `tools/generate-images-ai.ts`                | Gemini 3 Pro real-time image generation                   |
| `tools/generate-images-batch.ts`             | Gemini batch API for overnight runs                       |
| `tools/upload-generated-images.ts`           | R2 upload + manifest update                               |
| `tools/update-mdx-images.ts`                 | MDX frontmatter image reference injection                 |
| `tools/create-site-from-project.ts`          | Site generation from ProjectFile JSON (~37KB)             |
| `packages/intake-system/`                    | Chat intake, schemas, templates, color extraction         |
| `packages/theme-system/src/types.ts`         | ThemeName, ComponentRegistry, ThemeConfig types           |
| `packages/themes/corvus/`                    | Example generated theme (38 components, colorcode.events) |
| `.claude/commands/pipeline.stitch-design.md` | Stitch pipeline skill (~1560 lines)                       |
| `e2e/visual-regression.full.spec.ts`         | Playwright visual regression tests                        |

### What a Good Plan Should Cover

1. **Clone format specification** — What exactly goes in `output/clones/[name]/`? How do the three entry points converge to produce the same structure?

2. **HTML-to-JSX conversion strategy** — Mechanical conversion (parser-based, no AI) vs AI-assisted? How to handle WordPress markup, third-party scripts, inline styles, responsive images, CSS-in-JS? What parser library?

3. **Visual QA loop mechanics** — How does the orchestrator manage the capture → diff → review → fix → re-capture cycle? How do the read-only reviewer agent and the fix-applying engineer agent communicate? What's the data flow between iterations?

4. **Content stripping approach** — How to reliably identify "content" (text, images, business info) vs "structure" (layout, CSS, decorative elements) in arbitrary JSX? What becomes a prop vs what stays hardcoded?

5. **Token extraction from computed styles** — How to map arbitrary hex colors to semantic tokens? What about colors that don't fit the standard token palette (e.g., colorcode.events' per-section yellow/blue/green)?

6. **Brief schema and validation** — What fields are required vs optional? How to validate completeness before handoff to autonomous pipeline? What happens if the brief is incomplete?

7. **Image manifest generalization** — How to make `generate-image-manifest.ts` work for any site, not just colossus? What content types produce image slots?

8. **Error handling and resumability** — What happens if the pipeline crashes mid-Stage-2? Can it resume? How are partial results handled?

9. **Testing strategy** — How to verify this pipeline works without running it 50 times against real sites? Unit tests for converter? Integration test with a known reference?

10. **Stitch pipeline modification scope** — How much of the existing `/pipeline.stitch-design` skill needs to change to output to clone format? Is it a thin wrapper or a significant rewrite?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04-13_unified-clone-pipeline/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-13_unified-clone-pipeline/`
