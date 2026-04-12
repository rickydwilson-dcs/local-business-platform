# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-12
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-008, VCA-009
**Rules skipped:** none

## Summary

All 9 rules passed with zero violations. No hard failures and no warnings triggered. The codebase reflects the April 2026 deployment fixes correctly — webpack builds, scoped Tailwind globs, no turbo-ignore, all build-time env vars declared in turbo.json, and no CSS theme() usage.

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 0
- Total: 0

## Out-of-scope observations

`sites/dcs/vercel.json` uses a non-standard pattern — not covered by current rule set — for human review:

- `installCommand` is `cd ../.. && pnpm install --filter @platform/dcs...` rather than `cd ../.. && pnpm install --frozen-lockfile`
- `buildCommand` is `cd ../.. && pnpm build --filter @platform/dcs` rather than `cd ../.. && pnpm turbo run build --filter=dcs`

The canonical pattern documented in `docs/standards/deployment.md` uses `pnpm turbo run build --filter=<name>` and `--frozen-lockfile`. The `dcs` site deviates on both. This does not violate any VCA rule but the install command omits `--frozen-lockfile` (which protects against lockfile drift in CI) and the build command bypasses Turborepo (which means it won't benefit from remote cache hits). A human should decide whether to align it with the canonical pattern.
