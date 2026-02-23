# Codex Implementation Plan: Reference-Site Recreation + Visual Validation for Pipeline Theme Wiring

## Updated Brief (from Codex chat 2026-02-22)

The test site should **recreate the target reference site** using the pipeline-generated theme components, so each module's correctness can be verified through simple visual comparison. This also enables automated Playwright screenshot comparison.

---

## 1. Objective and hard-fail contract

1. Add a validation mode that recreates reference pages from generated modules and compares them visually against reference captures.
2. Make this a release gate for ingestion quality, not an optional report.
3. Hard-fail conditions:
- missing required generated modules/pages
- theme wiring inconsistency (registry/theme import mismatch)
- visual diff above thresholds

Files to create/modify:
- `tools/analyse-site.ts` (invoke validation mode)
- `tools/lib/pipeline-validation-types.ts` (new)
- `tools/lib/pipeline-validation-report.ts` (new)

Verification gate:
- Pipeline exits non-zero when validation fails.

## 2. Reference recreation scope

1. Define required page set (MVP):
- home
- services list
- one service detail
- blog list
- one blog post
- contact
2. Require deterministic fixture data for dynamic content pages to avoid noise.
3. Build generated pages from pipeline outputs (components + token config) into a temporary test site (`sites/test-<theme>`).

Files to create/modify:
- `tools/lib/page-template-generator.ts` (ensure required route generation)
- `.claude/commands/pipeline.ingest.md` (enforce required page set)
- `sites/test-<theme>/*` (runtime generated)

Verification gate:
- all required routes resolve locally before screenshot comparison.

## 3. Theme wiring correctness checks (pre-visual)

1. Enforce generated theme package exports include `<theme>Registry` and `<theme>DefaultConfig`.
2. Enforce test site wiring:
- `theme.config.ts` imports `<theme>Registry` from `@platform/themes/<theme>`
- `ThemeProvider` uses `theme="<theme>"` and `registry={<theme>Registry}`
3. Hard-fail on any fallback-to-vega/orion wiring unless explicitly requested override.

Files to modify:
- `tools/scaffold-theme-package.ts`
- `.claude/commands/pipeline.ingest.md`
- `tools/lib/theme-wiring-validator.ts` (new)

Verification gate:
- validator passes before visual capture starts.

## 4. Reference screenshot acquisition model

1. Keep source of truth as image baselines, not live-site rerenders each run.
2. Baseline options:
- captured during ingestion screenshot step
- user-provided baseline directory
3. Normalize capture settings for parity:
- viewport, DPR, wait strategy, font loading wait, fixed animation state.

Files to create/modify:
- `tools/lib/screenshot-capture.ts` (persist normalized metadata)
- `tools/lib/reference-baseline-manager.ts` (new)

Verification gate:
- every required page has a baseline image + metadata.

## 5. Playwright visual diff harness

1. Add dedicated visual compare runner:
- render generated site locally
- capture generated route screenshots with same capture config
- compare against baseline using Playwright screenshot comparisons
2. Add region masks for known dynamic areas:
- dates/times
- rotating sections
- user-generated or async counters
3. Emit artifacts:
- actual screenshot
- expected screenshot
- diff image
- per-page mismatch metrics

Files to create/modify:
- `tools/lib/visual-compare.ts` (new)
- `tools/lib/visual-mask-config.ts` (new)
- `tools/lib/pipeline-validation-report.ts` (new)

Verification gate:
- deterministic rerun on same input yields stable diff results.

## 6. Threshold model and failure policy

1. Global threshold (strict default) + per-page overrides:
- e.g. `maxDiffRatio` for each route
2. Require all critical pages pass; non-critical pages may warn.
3. Include explicit "unknown/dynamic mismatch" classification when masked regions drive most diff.

Files to create/modify:
- `tools/lib/pipeline-validation-types.ts`
- `tools/lib/visual-thresholds.ts` (new)
- `tools/analyse-site.ts`

Verification gate:
- threshold breaches fail run with actionable summary.

## 7. Pipeline integration flow

1. Extend ingestion steps:
- after site scaffold + wiring
- run pre-visual wiring validator
- run visual compare suite
- write validation report JSON/MD
2. Add CLI flags:
- `--validate-reference` (default true for test command)
- `--baseline-dir <path>`
- `--no-visual` (debug only)

Files to modify:
- `tools/analyse-site.ts`
- `.claude/commands/pipeline.ingest.md`

Verification gate:
- `/pipeline.ingest ...` ends with pass/fail validation block and artifact paths.

## 8. Reporting and developer workflow

1. Write artifacts under run output:
- `output/ingestion/<theme>/validation/report.json`
- `output/ingestion/<theme>/validation/report.md`
- `output/ingestion/<theme>/validation/diffs/*`
2. Include top causes list:
- wiring mismatch
- missing component
- visual threshold exceeded by page

Files to create/modify:
- `tools/lib/pipeline-validation-report.ts`
- `tools/analyse-site.ts`

Verification gate:
- report is sufficient to debug without rerunning ingestion immediately.

## 9. Test strategy

1. Unit tests:
- wiring validator
- threshold policy
- mask application
2. Integration tests:
- fixture theme + fixture baselines, deterministic diff pass/fail
3. Command-level smoke:
- simulate `/pipeline.ingest` with local fixture URL and ensure hard-fail behavior triggers correctly.

Files to create/modify:
- `tools/__tests__/theme-wiring-validator.test.ts` (new)
- `tools/__tests__/visual-compare.test.ts` (new)
- `tools/__tests__/pipeline-validation.test.ts` (new)

Verification gate:
- `pnpm type-check` and target tests pass without network dependency for core validation logic.

## 10. Rollout phases

1. Phase A: wiring validator + hard-fail guard
2. Phase B: baseline manager + visual compare runner
3. Phase C: pipeline/command integration + artifacts
4. Phase D: thresholds tuning + flaky-diff stabilization

Verification gate per phase:
- Phase A: no vega fallback wiring slips through
- Phase B: visual artifacts generated correctly
- Phase C: ingest command enforces validation outcome
- Phase D: stable pass/fail across reruns

## 11. Risks and mitigations

1. Flaky diffs from fonts/async rendering
- Mitigation: strict wait conditions, font readiness checks, deterministic test data, masks.
2. False failures from dynamic page content
- Mitigation: fixed fixture content and route-level mask config.
3. Overly strict thresholds blocking useful iteration
- Mitigation: per-page thresholds with documented rationale.
4. Runtime cost increase
- Mitigation: validate required page subset first, optional extended suite.
