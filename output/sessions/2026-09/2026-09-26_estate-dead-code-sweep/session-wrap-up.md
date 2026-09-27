# Session Wrap-Up: Estate-wide dead-code sweep

**Date:** 2026-09-26
**Session folder:** output/sessions/2026-09/2026-09-26_estate-dead-code-sweep/
**Branch:** feature/estate-dead-code-sweep
**Status:** Completed

## Goal

Run `find-dead-code.ts`-driven cleanup across every site in the monorepo except `dcs` (already
cleaned) and `npracing-v3` (frozen), plus two one-off systemic decisions on patterns inherited from
`base-template`.

## What Was Done

- See `yolo-brief.md`'s `## Completed` section for the full phase-by-phase account, including the
  `lib/analytics/types.ts` false-start-and-correction story and the three pre-existing
  `test:e2e:smoke` gaps surfaced during verification.
- Verification gates run this session (type-check, lint, build, test, test:e2e:smoke) across all 8
  touched packages: base-template, mad-graphics, dj-fox-electrical, colossus-scaffolding, showcase,
  npracing-v1, dch-automotive, dpm-autobody. Unit-level gates (type-check/lint/build/test) are green
  across all 8; `test:e2e:smoke` has 3 pre-existing failures unrelated to this branch (documented
  below and in `yolo-brief.md`).
- Confirmed `npracing-v3` untouched and `colossus-scaffolding/components/ui/accreditation-section.tsx`
  intact throughout.

## Key Decisions

- The `lib/analytics/types.ts` shim decision was deliberately re-run as ONE whole-estate
  investigation rather than trusting an earlier per-site sub-agent's isolated (and incorrect)
  deletion on dch-automotive — see `yolo-brief.md`'s Completed section for the alias-resolution
  evidence that made "kept everywhere" the correct call.
- The 3 `test:e2e:smoke` failures (mad-graphics has no e2e/ dir at all; npracing-v1 and
  dch-automotive test routes/slugs that don't exist on their sites) were verified pre-existing via
  git diff of each cleanup commit and route listings on `develop` before this branch — treated as
  flagged follow-up work, not fixed inline, to avoid scope creep beyond dead-code deletion.
- Running multiple sites' `test:e2e:smoke` concurrently via turbo causes false failures (every
  site's Playwright config hardcodes `localhost:3000`) — re-ran with `--concurrency=1` to get real
  per-site results.

## Commits

- `7a2f1839` — chore: remove dead .text-balance CSS class (unused across the estate)
- `69ad17cb` — chore(dj-fox-electrical): remove dead code and lib/locations.ts architecture violation
- `aa876050` — chore(dpm-autobody): remove dead lib/mdx.tsx shim
- `d217d46d` — chore(dch-automotive): remove orphaned home-page.tsx and unused analytics shim
- `bbf8fc8b` — chore(npracing-v1): remove dead code
- `2438c8d2` — chore(mad-graphics): remove dead code flagged by find-dead-code.ts
- `988c8d65` — revert(dch-automotive): restore lib/analytics/types.ts shim

## Files Changed

- `sites/mad-graphics/app/globals.css`, `sites/mad-graphics/lib/performance-tracker.ts`
- `sites/dj-fox-electrical/app/globals.css`, `lib/locations.ts`, `lib/service-icons.ts`
- `sites/dch-automotive/components/pages/home-page.tsx`
- `sites/dpm-autobody/lib/mdx.tsx`
- `sites/npracing-v1/app/globals.css`, `lib/mdx.tsx`
- `sites/colossus-scaffolding/app/globals.css`

## What Was Learned / Why It Matters

A grep-only dead-code tool cannot see indirect, tsconfig-alias-mediated references — `@/lib/...`
imports inside `core-components` resolve through each _consuming_ site's own `@/*` path mapping,
not through core-components' own module resolution, so a literal path-string search for a shim's own
filename will always read as "unreferenced" even when it's structurally load-bearing. Any future
estate-wide dead-code decision touching a file that core-components imports via `@/` must verify by
deletion + type-check, not by grep alone. Separately, this sweep's verification pass is the first
time `test:e2e:smoke` was run across the estate in this session's scope, and it surfaced that at
least 3 sites have stale or entirely-missing smoke-test infrastructure predating this work — worth a
dedicated follow-up rather than folding into future dead-code sweeps.

## Follow-On Tasks

- Author a proper `e2e/` + Playwright config for `mad-graphics` (currently has neither, despite
  defining a `test:e2e:smoke` script).
- Update `npracing-v1`'s and `dch-automotive`'s `e2e/smoke.spec.ts` to test routes/slugs that
  actually exist on those sites instead of base-template-inherited placeholders.
- Consider giving each site's Playwright config a distinct port (or `PORT` env override) to remove
  the port-3000 collision risk when running `test:e2e:smoke` across multiple sites concurrently.
- `colossus-scaffolding/components/ui/accreditation-section.tsx` still needs a content-owner
  decision on whether it's dead and safe to remove.
