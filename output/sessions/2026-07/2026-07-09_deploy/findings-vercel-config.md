# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-07-09
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-008, VCA-009
**Rules skipped:** none

## Summary

All checks passed, 9 rules run. Special attention was paid to `sites/dch-automotive/` (new `vercel.json`, first-time deploy, Vercel project "dch" / team_wr412hUEEmAULurOOD1ZPXfm confirmed via `.vercel/project.json`) — its config matches the canonical site pattern exactly and has no violations. Resolved Next.js major is 16 (16.1.5 via root `pnpm.overrides`, all sites declare 16.0.10); all seven sites pin `next build --webpack` on Next ≥ 16, which would normally be flagged under VCA-002, but CLAUDE.md / `docs/standards/deployment.md` / `docs/architecture/how-build-pipeline-works.md` all document the specific, current reason (Turbopack PostCSS parser panics in CI on Next 16), satisfying the rule's documented-exception clause — so this is not reported as a finding.

## Findings

_No violations found._

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 0
- Total: 0

## Out-of-scope observations

- `sites/dcs/vercel.json` uses `"buildCommand": "cd ../.. && pnpm build --filter @platform/dcs"`, which deviates from the canonical pattern documented in `docs/standards/deployment.md` (`pnpm turbo run build --filter=<site-name>`) used by every other site (`dj-fox-electrical`, `dch-automotive`, `mad-graphics`, `colossus-scaffolding`). Not a violation of VCA-001/003 (no `outputDirectory`, no `ignoreCommand`/`turbo-ignore`), but the inconsistent pattern is worth human review — not covered by current rule set.
- Root `package.json` `pnpm.overrides` pins `"next": ">=16.1.5"`, which resolves to `next@16.1.5` in `pnpm-lock.yaml`, while every site `package.json` and `packages/core-components/package.json` still declare `"next": "16.0.10"` verbatim. This is a minor-version drift between declared and resolved versions, not a major-version mismatch across sites, so it does not trigger VCA-009 as written — but it means `package.json` no longer reflects the actually-installed version. For human review.
- `sites/base-template` and `sites/showcase` have no site-level `vercel.json` at all (unlike the other five sites). Not required by any rule, but noted for consistency awareness.
