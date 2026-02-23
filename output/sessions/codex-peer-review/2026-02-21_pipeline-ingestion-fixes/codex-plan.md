# Codex Implementation Plan: Fix Three Ingestion Pipeline Issues

## 1. Stabilize synthesis output handling (Issue 1 root cause + detection)

1. Split token budgets for per-page analysis vs site synthesis:
- keep per-page vision at current budget
- raise synthesis budget to a separate constant (target 8k-12k range, start at `8192`)
2. Add explicit truncation detection on Anthropic responses:
- inspect `stop_reason`
- if truncated (`max_tokens`) or validation fails due missing required tail fields, retry synthesis once with higher token budget (bounded)
3. Persist raw synthesis response when parse/validation fails for postmortem.

Files to modify:
- `tools/lib/multi-page-analyzer.ts`

Verification gate:
- For large fixture payloads, synthesis parse returns `registryRecommendation` and `themeTokenRecommendations` present.
- Logs clearly state whether response was complete/retried/truncated.

Risks/trade-offs:
- Higher max tokens increases cost; bounded retry + dedicated budget limits waste.

## 2. Fix synthesis fallback behavior to avoid silent vega defaults

1. Tighten fallback logic in `analyse-site.ts`:
- if synthesis is present but incomplete, treat as recoverable synthesis error and prefer computed/vision with explicit warning
- avoid silent “vega low confidence” unless every higher-fidelity source is absent
2. Add assertion/reporting field in output JSON (`tokenSource`, `synthesisStatus`) so failures are visible.

Files to modify:
- `tools/analyse-site.ts`
- optionally `tools/lib/reference-analysis-types.ts` (if status fields persisted)

Verification gate:
- Truncated synthesis no longer quietly forces `vega`; run summary states chosen source.

Risks/trade-offs:
- More explicit warnings may look noisy, but they prevent hidden degradations.

## 3. Eliminate `__name` leakage in `page.evaluate` (Issue 2)

1. Refactor `extractComputedStyles` evaluate callback to be completely transform-safe:
- avoid named function declarations inside callback
- avoid callback forms that trigger esbuild helper injection in browser context
- use plain arrow functions and minimal inlined helpers only
2. Extract any complex transformation logic to Node-side post-processing after `evaluate` result is returned.
3. Add defensive try/catch in evaluate payload for per-role extraction so one selector failure does not abort whole page extraction.

Files to modify:
- `tools/lib/computed-style-extractor.ts`

Verification gate:
- No `__name is not defined` error appears during screenshot capture.
- `computedStyles` array in pipeline output has entries for analyzed pages.

Risks/trade-offs:
- Over-simplifying in-browser logic can reduce extracted richness; compensate with Node-side normalization.

## 4. Add targeted regression guard for computed extraction path

1. Add unit/integration-style test for extractor using a mocked Playwright page evaluate return and/or minimal browser fixture.
2. Validate key fields are extracted and no runtime helper references are required.

Files to create/modify:
- `tools/lib/__tests__/computed-style-extractor.test.ts` (new)
- test fixtures under `tools/lib/__tests__/fixtures/` if needed

Verification gate:
- Test fails on `__name`-style runtime failures and passes with the refactor.

Risks/trade-offs:
- Playwright-based tests can be flaky; prefer deterministic mocks for CI stability.

## 5. Fix token allowlist false positives for non-color `bg-*` classes (Issue 3)

1. Refine color-class detection instead of broad `bg-*` rejection:
- add explicit non-color background utility allowlist (`bg-cover`, `bg-center`, `bg-no-repeat`, `bg-contain`, `bg-fixed`, `bg-scroll`, `bg-clip-text`, `bg-auto`, plus related positional/repeat utilities if present)
- evaluate `looksLikeColorClass()` after checking these structural background utilities
2. Keep strict rejection for invented theme-like classes (`bg-brand-dark-purple`) by preserving token-prefix validation.
3. Add similar sanity pass for other ambiguous prefixes only where needed (verify `text-*` layout utilities are already allowed).

Files to modify:
- `tools/lib/token-class-allowlist.ts`
- optionally `tools/lib/theme-component-generator.ts` (warning text clarity if violations remain)

Verification gate:
- `isAllowedClass()` returns true for required standard classes listed in acceptance.
- `isAllowedClass("bg-brand-dark-purple")` remains false.

Risks/trade-offs:
- Over-broad exemptions could weaken safety; keep exemptions explicit and minimal.

## 6. Align class-validation warnings with actual behavior

1. Update warning text in generator to distinguish:
- auto-fixed classes
- flagged-but-not-fixed classes
2. Ensure future aggressive auto-fix won’t silently strip valid utilities by adding a protected-class check for standard Tailwind structural classes.

Files to modify:
- `tools/lib/theme-component-generator.ts`

Verification gate:
- Pipeline warnings are actionable and accurate (no misleading “auto-fixed” message for untouched classes).

Risks/trade-offs:
- Minor behavior change, primarily DX/logging clarity.

## 7. Add fixture-driven tests for synthesis truncation handling

1. Create synthesis response fixtures:
- complete valid JSON
- truncated JSON missing tail fields
2. Test extraction/validation/retry path:
- truncated first response triggers retry and succeeds
- persistent truncation produces explicit status + fallback path, not silent vega hard default

Files to create/modify:
- `tools/lib/__tests__/multi-page-analyzer.test.ts` (or extend existing)
- `tools/lib/__tests__/fixtures/synthesis-complete.json`
- `tools/lib/__tests__/fixtures/synthesis-truncated.txt`
- `tools/analyse-site.ts` tests if test harness exists

Verification gate:
- Tests cover both success and truncation branches deterministically without live API calls.

Risks/trade-offs:
- Requires lightweight mocking of Anthropic responses.

## 8. Verification and rollout sequence

1. Phase A: Issue 1 (budget split + truncation detection + retry)
- Files: `tools/lib/multi-page-analyzer.ts`
- Gate: fixture tests green.

2. Phase B: Issue 2 (`page.evaluate` hardening)
- Files: `tools/lib/computed-style-extractor.ts`
- Gate: no `__name` errors in local dry run.

3. Phase C: Issue 3 (allowlist precision)
- Files: `tools/lib/token-class-allowlist.ts`
- Gate: explicit class acceptance/rejection assertions pass.

4. Phase D: integration and regression checks
- Run: `pnpm type-check` + relevant unit tests.
- Optional real smoke: `/pipeline.ingest --url https://colorcode.events/ --name atlas2` to validate acceptance criteria 1-3.

## 9. Key design decisions to lock

1. Synthesis and per-page calls should not share token budget constant.
2. Retry count for synthesis should remain bounded (single retry) to control cost.
3. Allowlist should stay deny-by-default for color-like tokens, with narrowly scoped exemptions for structural `bg-*` utilities.
4. Computed style extraction logic in browser context should remain minimal and esbuild-safe, with richer mapping outside `page.evaluate`.
