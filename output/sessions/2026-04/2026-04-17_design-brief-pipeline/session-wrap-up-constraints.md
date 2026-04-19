# Session Wrap-Up: Design Brief Pipeline — Prompt Constraints & Defensive Layout

**Date:** 2026-04-17
**Session folder:** output/sessions/2026-04/2026-04-17_design-brief-pipeline/
**Branch:** feature/design-brief-pipeline
**Status:** Completed

## Goal

Wire the `brief.constraints` field end-to-end so adapter prompt builders include defensive layout rules that prevent image column collapse and narrow testimonial quotes — the two failures observed in the navagarden run.

## What Was Done

- Created `ConstraintsSchema` in `design-brief-types.ts` with 7 fields (3 token/RSC flags + 4 new layout fields), all with Zod `.default()` values so existing briefs parse without changes
- Updated `design-brief-compiler.ts` to populate all 7 constraint fields with safe defaults on every compile
- Added `buildLayoutConstraintsBlock(constraints)` to `shared-constraints.ts` — generates a prompt section covering image aspect-ratio fallbacks, text/testimonial minimum widths, flex `min-w-0`, and split-layout collapse prevention
- Wired `buildLayoutConstraintsBlock(brief.constraints)` into both `generic-adapter.ts` and `impeccable-adapter.ts` immediately before `## Generation Instructions`
- All 5 verification gates passed; `pnpm type-check` clean with no fixes needed

## Key Decisions

- `ConstraintsSchema` created from scratch — the field did not exist in the schema prior to this session (brief assumed it would be found and extended)
- Used `ConstraintsSchema.default({})` on the top-level schema so the entire `constraints` block is optional in existing JSON briefs while producing fully-populated typed output
- Phase 2 verification gate in the brief spec used wrong `MappedTokens` shape (`{ tokens, confidence, warnings }` instead of `{ config, provenance, unmappedColours }`); corrected in the test only, no production code changed

## Commits

- `b178b08` — feat(schema): add defensive layout constraint fields to DesignBrief constraints
- `87dec43` — feat(pipeline): populate defensive layout constraints in compiled DesignBrief
- `1006e21` — feat(pipeline): add buildLayoutConstraintsBlock() to shared-constraints
- `8dc44d2` — feat(pipeline): wire brief.constraints into adapter prompt builders
- `5aad15e` — chore: type-check fixes after constraint field additions (empty — no fixes needed)

## Files Changed

- `tools/lib/design-brief-types.ts` — new `ConstraintsSchema`, added to `DesignBriefSchema`, exported `DesignBriefConstraints` type
- `tools/lib/design-brief-compiler.ts` — constraints block populated in `DesignBriefSchema.parse()` call
- `tools/lib/design-skills/shared-constraints.ts` — new `buildLayoutConstraintsBlock()` export
- `tools/lib/design-skills/adapters/generic-adapter.ts` — import + call wired in
- `tools/lib/design-skills/adapters/impeccable-adapter.ts` — import + call wired in
- `tools/__fixtures__/briefs/sample-brief.json` — constraints block added explicitly as a full valid example

## What Was Learned / Why It Matters

The navagarden run proved that layout failures originate at prompt generation time, not in the model's creativity. By making defensive layout rules a typed, compiler-populated field on the brief — rather than ad-hoc text in a system prompt — every future adapter automatically inherits the rules, and they can be overridden per-client via `--brief` JSON overrides. This establishes the pattern for all future prompt hardening: schema field → compiler default → shared block builder → adapter wiring.
