# Session wrap-up — deploy-staircase hardening

**Goal:** make the `develop → staging → main → Vercel` deploy staircase trustworthy
unattended — stop the recurring "watchdog says all-clear while regressions ship" failure.
Started from a Phase-1 audit (`docs/deploy-audit.md`, findings F1–F11) and carried it
through to a blocking, verified promotion gate live on `main`.

## Outcome — all findings F1–F11 closed and live on `main` (`065fa76f`)

- **Watchdog can fail its own check (F1/F2/F3/F5).** New authoritative gate
  (`tools/watchdog/gate.ts` + `lib/gate.ts`): fails on missing/empty/fabricated results,
  zero tests, or real failures. `index.ts main()` exits non-zero on failures. `watchdog.yml`
  no longer fabricates a passing report. A fault-injection harness
  (`tools/watchdog/fault-injection.ts`, wired into `ci.yml`) proves 4/5 classes scream.
- **Deploy script honesty (F6).** `deploy-to-production.sh` no longer prints "All quality
  checks passed" while running none.
- **Server-side, SHA-pinned, fail-closed promotion gate (F7/F8/F9).**
  `scripts/verify-staging-e2e.ts` verifies the _promoted commit's_ staging E2E run;
  wired into `deploy.yml` (job), `.husky/pre-push`, and `deploy-to-production.sh`.
- **F7 made blocking.** Promotion is now PR-based (`deploy.yml` runs on `pull_request` into
  main; `deploy-to-production.sh` opens a gated staging→main PR). `main` is branch-protected:
  PR required, `Verify promoted commit passed staging E2E` required, admin bypass disabled.
- **Cleanups (F4/F10/F11).** F4 — triage/issue errors counted, reported, non-zero. F10 —
  `ci.yml` validates content for every site. F11 — results path defined once in `watchdog.yml`.

## Key decisions

- **Gated everything at the git layer, not per Vercel project.** Every site keys off `main`,
  so requiring the check on the promotion PR gates all sites at once — no per-project Vercel
  config or embedded tokens.
- **`strict` (require-branches-up-to-date) turned OFF.** It fought the repo's merge-based
  promotion (main accrues merge commits that never flow back → every PR reads "behind"),
  adding friction with no real safety (PR checks already run against the merge result). All
  other protections kept.
- **`production` branch is vestigial.** `origin/production` doesn't exist; `main` is the
  production branch for all projects. The `main:production` mirror in the deploy script is a
  no-op leftover (see Follow-ups).

## Verified live (not just locally)

- The gate ran for real at three layers on the way up: the pre-push hook, the `deploy.yml`
  job on push, and the required check on PR #30 — each resolved the true promoted commit and
  passed. PR #30 merged through the blocking gate unattended.
- All workflows green on `main`: Production Quality Gate (verify + quality), CI (harness +
  all-site content validation), Regression Watchdog; E2E Tests skipped on main by design.

## What was learned / traps

- **Verifier bug (fixed, `36fbfcd0`):** opening a staging→main PR creates a _second_ E2E run
  for the same SHA that SKIPS all jobs (conclusion "skipped"). The verifier took the newest
  run for the SHA and grabbed the skipped one → false-negative that blocked a green promotion.
  Fix: filter the workflow-runs query to `event=push`. This bug also affected the push-context
  verify on main. Lesson: when matching a workflow run by SHA, you must also match the event.
- **Promotion is merge-commit based**, so `deploy.yml`'s push-context resolve uses `HEAD^2`
  (the merge's 2nd parent = staging tip); PR-context uses the PR head SHA. Both needed.

## Commits (on `develop`, promoted to `main`)

`17e9f586` audit · `bcd3a56b` Phase 2 · `7c9fb37f` Phase 3 · `1e65b93c` PR plumbing ·
`bef343c7` F4/F10/F11 · `36fbfcd0` verifier event=push fix. Live on `main` at `065fa76f`.

## Follow-ups (small, optional)

- Remove the vestigial `git push origin origin/main:production` mirror from
  `deploy-to-production.sh` (production branch doesn't exist / isn't used). Left in to avoid
  another full promotion cycle just for a dormant line.
- Phase-4 plan doc (`phase4-plan-pr-promotion-gate.md`) is now largely executed; keep for
  reference or delete.
