# Vercel Config Audit Findings

**Reviewer:** cs-vercel-config-auditor
**Scope:** full
**Date:** 2026-04-21
**Rules run:** VCA-001, VCA-002, VCA-003, VCA-004, VCA-005, VCA-006, VCA-007, VCA-008, VCA-009
**Rules skipped:** VCA-008 (no middleware.ts or middleware.js files exist in any sites/ directory)

## Summary

One warning-level finding was identified. No Critical or High failures were found. The single finding is VCA-007: `sites/poc-composition-test/next.config.ts` sets `dangerouslyAllowSVG: true` without the accompanying `contentSecurityPolicy` that every other site includes. This does not block a deploy on its own, but it is a security configuration gap that should be resolved before the PoC site is promoted to production.

## Findings

### [Low / Warning] VCA-007: poc-composition-test dangerouslyAllowSVG without contentSecurityPolicy

- **File:** `sites/poc-composition-test/next.config.ts` (line 16-17)
- **Rule:** VCA-007 — `dangerouslyAllowSVG: true` must be accompanied by an appropriate `contentSecurityPolicy` or `contentDispositionType`
- **Violation:** `images.dangerouslyAllowSVG` is set to `true` but `images.contentSecurityPolicy` is absent. Every other site in the monorepo (base-template, colossus-scaffolding, mad-graphics, dcs, designlab-test, navagarden-test, dj-fox-electrical) sets `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` alongside this flag.
- **Impact:** SVG images served via Next.js image optimisation can execute embedded scripts if contentSecurityPolicy is not set. This is a security risk, not a build-time failure — the deploy will succeed but the site will serve SVGs without the script-execution sandbox.
- **Fix:** Add `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` to the `images` block in `sites/poc-composition-test/next.config.ts`.
- **Effort:** trivial

## Statistics

- Critical (blocks deploy): 0
- High (deploy likely fails): 0
- Medium (cache/perf/correctness): 0
- Low / warning: 1
- Total: 1

## Out-of-scope observations

`sites/poc-composition-test/next.config.ts` also sets `turbopack: {}` at the top level (line 4). This is a Next.js 16 configuration key that enables Turbopack globally for all commands including production builds. This potentially conflicts with the monorepo rule that production builds must use `next build --webpack` (VCA-002). However, the site's `package.json` build script explicitly includes `--webpack`, which should override the config-level turbopack setting. The interaction between the `turbopack: {}` config key and the `--webpack` CLI flag in Next.js 16 is not explicitly covered by the current rule set. Not raised as a VCA-002 violation because the build script explicitly passes `--webpack`, but flagged here for human review — not covered by current rule set.
