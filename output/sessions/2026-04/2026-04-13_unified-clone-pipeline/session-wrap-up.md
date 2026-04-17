# Session Wrap-Up: Unified Clone-to-Theme-to-Scaffold Pipeline

**Date:** 2026-04-13
**Session folder:** output/sessions/2026-04-13_unified-clone-pipeline/
**Branch:** feature/unified-clone-pipeline
**Status:** Completed

## Goal

Implement the full 3-stage Clone → Extract Theme → Scaffold pipeline with a formal Clone Package Format (CPF), three entry points, and a Playwright visual QA loop.

## What Was Done

- Defined `JobBriefSchema` (Zod), CPF directory spec + validator, and a corvus fixture — the contracts all pipeline stages depend on
- Built `asset-downloader.ts` (HTML → all asset URLs → downloads with manifest) and `html-to-jsx-converter.ts` (deterministic HTML→JSX using node-html-parser, no AI)
- Extended `computed-style-extractor.ts` with `extractAllSectionStyles()` and enhanced `computed-style-token-mapper.ts` with per-section color mapping and typography scale extraction
- Implemented Entry A ingest orchestrator (`ingest-live-site.ts`) with step-level resumability, plus `visual-qa-loop.ts` capture→diff→fix→re-capture cycle (pixel and structural modes)
- Assembled `content-stripper.ts`, `extract-theme.ts`, `scaffold-client-site.ts`, generalized `generate-image-manifest.ts`, and the top-level `clone-and-scaffold.ts` E2E orchestrator with 3-stage resumability

## Key Decisions

- **CPF as the synchronisation barrier** — every entry point must produce a valid CPF directory before Stage 2 runs; `cpf-validator.ts` enforces this at runtime
- **Visual QA loop v1 uses heuristic fixes** — full agent-based fixing (cs-visual-fidelity-reviewer → cs-frontend-engineer) deferred to v2; loop framework supports it
- **Entry B (Stitch) stubbed, Entry C functional** — Stitch requires MCP context unavailable in autonomous mode; Entry C reads pre-generated HTML via `file://` URLs
- **`pipeline-visual-compare.ts` exports `compareImages` not `compareScreenshots`** — caught during Phase 6 and corrected inline; not documented elsewhere

## Commits

- `d7e4d54` — feat(pipeline): add JobBrief schema, CPF spec, and CPF validator
- `3aa7b01` — feat(pipeline): add comprehensive asset downloader
- `1789252` — feat(pipeline): add per-section computed style extraction
- `fe9db09` — feat(pipeline): add mechanical HTML-to-JSX converter
- `e6d231c` — feat(pipeline): add Entry A — ingest live site to CPF
- `9c90e1f` — feat(pipeline): add Playwright visual QA loop
- `0c7cb2c` — feat(pipeline): add content stripper for theme extraction
- `ae5ab7c` — feat(pipeline): add theme extraction from clone
- `3f7eeeb` — feat(pipeline): add client site scaffolding + generalize image manifest
- `63361bc` — feat(pipeline): add E2E orchestrator with resumability

## Files Changed

- `tools/lib/pipeline-brief-types.ts` — JobBrief + sub-schemas (Zod)
- `tools/lib/cpf-validator.ts` — CPF directory structure validator + CLI
- `tools/lib/html-to-jsx-converter.ts` — deterministic HTML→JSX conversion
- `tools/lib/visual-qa-loop.ts` — dev server lifecycle + pixel/structural diff loop
- `tools/lib/clone-entry/ingest-live-site.ts` — Entry A: full clone orchestrator
- `tools/clone-and-scaffold.ts` — E2E orchestrator with 3-stage resumability
- `tools/lib/computed-style-extractor.ts` — added `extractAllSectionStyles()`
- `tools/lib/computed-style-token-mapper.ts` — added `mapSectionColors()`, `extractTypographyScale()`
- `tools/generate-image-manifest.ts` — generalized to `--site <path>` flag

## What Was Learned / Why It Matters

The pipeline now has a formal intermediate representation (CPF) that decouples cloning from theme extraction — any source can produce a CPF directory and the same Stage 2/3 machinery runs unchanged. The step-tracker pattern (`hasCompletedStep`/`markStepDone`) makes long-running runs safe to resume after interruption. Pre-existing ThemeName union errors on develop (from the 20-reserved-names commit) are unrelated to this work and remain open.

## Follow-On Tasks

- Fix pre-existing ThemeName union mismatch in `colossus-scaffolding` (separate issue on develop)
- Implement Entry B (`stitch-mcp.ts`) as a real CPF-output mode in `/pipeline.stitch-design`
- Upgrade visual QA loop to v2: spawn `cs-visual-fidelity-reviewer` on failure, pass findings to `cs-frontend-engineer`
- Run `npx tsx tools/clone-site.ts --url https://colorcode.events --name corvus` as a live integration test
