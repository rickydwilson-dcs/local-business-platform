# Session Wrap-Up: Design Brief Pipeline — Foundation (Session 1)

**Date:** 2026-04-17
**Session folder:** output/sessions/2026-04/2026-04-17_design-brief-pipeline/
**Branch:** feature/design-brief-pipeline
**Status:** Completed

## Goal

Build the foundation of the DesignBrief pipeline: schema, deterministic compiler, and skill adapter layer — no AI calls, no CLI yet.

## What Was Done

- **Phase 0:** Installed 5 design skills (impeccable, stitch-design, enhance-prompt, design-md, extract-design-system) via `npx skills add --yes` into `.agents/skills/` with Claude Code symlinks
- **Phase 1:** Created `tools/lib/design-brief-types.ts` — 8-section Zod schema with `.refine()` HTML/CSS injection guards on every color field; plus 3 test fixtures (valid, invalid, minimal)
- **Phase 2:** Built the deterministic compiler — 6 per-section mappers + `compileDesignBrief()` orchestrator + `renderBriefSummary()` markdown renderer; pure data transformation, no AI calls
- **Phase 3:** Created skill adapter layer — `DesignSkillAdapter` interface, `GenericSkillAdapter`, `ImpeccableAdapter` (OKLCH-aware colors, anti-slop directives), `StitchAdapter` (DESIGN.md format), and `adapter-registry`

## Key Decisions

- **`npx skills add` installs to `.agents/skills/`**, not `~/.claude/commands/` — CLI changed install location; skills are symlinked to `.claude/skills/` for Claude Code discovery; Phase 0 verification gate path assumption was wrong but skills are correctly installed
- **Phase 2 verification gate had a bug**: `JSON.stringify(brief.palette).includes('{')` always fails since JSON uses `{` for objects; fixed to check only leaf color string values — Zod `.refine()` already enforces the real constraint
- **`TYPOGRAPHY_TOKENS` not exported** from `token-class-allowlist.ts` — inlined the list in `shared-constraints.ts` rather than modifying the allowlist module
- **Overlay values use `rgba()`** — these contain `(` but not `<` or `{`, so they pass the injection guard correctly without special treatment

## Commits

- `84d6160` — chore: install design pipeline skills (impeccable, stitch, extract-design-system)
- `1ab64e1` — feat(design-brief): DesignBrief Zod schema + test fixtures
- `87bc365` — feat(design-brief): deterministic DesignBrief compiler with per-section mappers
- `d1f9d37` — feat(design-brief): skill adapter layer with generic, impeccable, and stitch adapters

## Files Changed

- `tools/lib/design-brief-types.ts` — central Zod schema and type exports
- `tools/lib/design-brief-compiler.ts` — orchestrator: SiteAnalysis → DesignBrief
- `tools/lib/design-brief-mappers/` — 6 mapper files + barrel index
- `tools/lib/design-brief-renderer.ts` — markdown summary renderer
- `tools/lib/design-skills/` — adapter-types, shared-constraints, adapter-registry, 3 adapter classes
- `tools/__fixtures__/briefs/` — 3 test fixtures
- `tools/__fixtures__/analyses/bexhill-removals-site-analysis.json` — offline compiler fixture

## What Was Learned / Why It Matters

The DesignBrief format cleanly separates the analysis phase (lossy, reference-dependent) from generation (AI-driven, skill-agnostic). Stripping all clone HTML/CSS in `mapPageBlueprints()` and expressing everything as semantic tokens and layout patterns makes the brief portable across all six design skill adapters without modification. The relative import path `../../../packages/intake-system/src/theme-extraction/color-utils` resolves correctly from `tools/lib/` under `tsx`, confirming the cross-package import pattern works without a workspace build step.

## Follow-On Tasks

- Session 2: generator orchestration — calls the AI with adapter prompts, collects TSX section blocks
- Session 2: CLI tool (`generate-brief-from-analysis.ts`) — takes a site-analysis JSON, writes a brief JSON + markdown summary
- Session 2: `/generate-theme-from-brief` skill command wiring the full pipeline
- Consider exporting `TYPOGRAPHY_TOKENS` from `token-class-allowlist.ts` to avoid duplication in adapters
