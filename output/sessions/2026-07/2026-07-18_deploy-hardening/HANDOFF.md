# Deploy-staircase hardening — handoff

**Status:** in-progress — Phase 1 (audit) complete and committed; Phases 2–4 **not started**. The audit is read-only findings only; **no deploy-path file has been changed**, so every documented failure (including the live F1 fabricated-pass) is still present in `main`/`develop`.
**Branch:** `develop` (local-business-platform). Audit commits are **unpushed** and **not merged** to staging or main.
**Commits:** 2 audit commits on this branch — `17e9f586` (Phase 1 audit), `83514037` (table-render fix). Both trace-verified below.
**Working tree:** clean except `.claude/scheduled_tasks.lock` (pre-existing, not part of this work — do not commit it).

## What this is trying to resolve

The goal is to make the `develop → staging → main → Vercel` deploy staircase trustworthy **unattended** — the recurring pain is the regression watchdog reporting success while regressions ship ("the watchdog once said 'nothing needs attention' while five bugs cascaded"). The user asked for a 4-phase plan (Audit → Fault-injection → Guardrails → Automation), but explicitly wanted the relevance assessed first and each phase gated. We agreed to do **Phase 1 (read-only audit) only**, and to get an explicit go-ahead before Phase 2 because Phase 2+ modifies live deploy files. That constraint is a user decision — honour it.

## Actions taken

1. `17e9f586 docs(deploy): Phase 1 audit` — wrote `docs/deploy-audit.md`: 11 "failure-reported-as-success" findings (F1–F11) with exact `file:line`, the systemic root cause, a failure-class coverage table, and pointers for Phase 2+. Read-only; no deploy files touched.
2. `83514037 docs(deploy): fix F2 table row` — reworded one table cell whose literal `||` broke the markdown table under prettier. Findings unchanged.

## Current state — verified 2026-07-18

- **`docs/deploy-audit.md` exists and is committed** (verified: it's in the last 2 commits on `develop`).
- **The deploy path is UNCHANGED.** Verified by reading the files this session:
  - **F1 is live:** `.github/workflows/watchdog.yml:99-100` still writes `{"stats":{"ok":true},"suites":[]}` when the results file is missing — a fabricated pass.
  - **F2 is live:** `tools/watchdog/index.ts` `main()` still exits 0 even after finding failures; the smoke step still OR-swallows its exit. The "Regression Watchdog" check is green in every case.
  - **F6 is live:** `scripts/deploy-to-production.sh:79` still prints "✅ All quality checks passed" while running none.
- **Systemic finding (verified by reading `index.ts`, `watchdog.yml`):** the watchdog is observation-only — it opens issues but cannot fail its own check; every dependency fails **open (green)**.
- **Existing partial mitigation:** `tools/watchdog/validate-loop.ts` genuinely injects one failure class (unreachable site URL) and asserts an issue is created — but it covers 1 of 5 classes, is dispatch-only (not in normal CI), and asserts "issue created" not "deploy blocked". It would NOT catch F1/F2/F3. (Verified by reading the file.)

## What was NOT done

- **No fix applied.** F1's fabricated-pass fallback is untouched. Nothing in `watchdog.yml`, `index.ts`, `deploy.yml`, `ci.yml`, `deploy-to-production.sh`, or `.husky/pre-push` was modified. Do **not** assume the audit fixed anything — it is findings only.
- **Phase 2 (fault-injection harness)** — not started. This is the highest-value next piece: drive each of the 5 failure classes (missing data, empty targets, network timeout, stale status, partial sync) and assert the watchdog **screams** (non-zero check).
- **Phase 3 (CI-side promotion gate + retry/backoff)** — not started. The branch guard today is only the local, bypassable pre-push hook (F8/F9); there is no server-side check.
- **Phase 4 (headless staircase, health-drift auto-revert, auto-issue)** — not started.
- **Not pushed, not promoted.** The audit commits are on local `develop` only; nothing merged to staging/main, nothing on Vercel.

## Live-data changes already applied

**None.** Phase 1 was entirely read-only — no writes to any store, API, or live environment, and no production deploy. There is nothing to roll back.

## Traps

- **The `output/sessions/.current-session` pointer was stale** (pointed at `2026-07/2026-07-11_car-remaps-savings-calculator`, unrelated). It has been repointed to this session folder. A fresh session that trusts the old pointer would resume the wrong work.
- **Audit `file:line` references are "as of this commit".** The moment any deploy file is edited (Phase 2), the line numbers in `docs/deploy-audit.md` (e.g. `watchdog.yml:99-100`) will drift. Re-locate by content, not line number.
- **`validate-loop.ts` looks like it already solves Phase 2 — it does not.** See Current state; it's one class and asserts the wrong thing. Don't skip Phase 2 because it exists.
- **Phase 2 changes live deploy files** — unlike Phase 1. The user has NOT yet approved that boundary (see Open questions). Do not start editing `watchdog.yml`/`index.ts` without it.
- **Cross-repo loose ends from this session (all committed, NONE pushed):** `claude-skills` develop +7 (Failure contract, gated-phase template, Gate contract, codebase-aware `plan.to.yolo`, new `investigate.this` command, fork retirements), `cpf` main +9 (phase-gate framework merged locally), `svolta` on branch `chore/retire-plan-to-yolo-fork` +1 (**unmerged** — its plan.to.yolo fork removal only takes effect once merged to develop), `thebotleague` develop +1. These are separate, shipped-but-unpushed work — not part of the deploy thread, but a fresh session should know nothing is pushed anywhere.

## Next step

1. **Get the user's explicit go-ahead for Phase 2** (it modifies live deploy files). This is a hard gate they set.
2. Once approved, start Phase 2 by **making the watchdog able to fail at all** before building the harness:
   - Delete the F1 fallback at `.github/workflows/watchdog.yml:99-100` (do not fabricate `ok:true`); treat a missing/empty results file as FAIL.
   - Make `tools/watchdog/index.ts` `main()` exit non-zero when `collectFailures()` returns > 0 (currently exits 0 — see `index.ts:198`).
   - Remove/replace the smoke-step OR-swallow so a failing smoke run fails the step (`watchdog.yml:87`).
3. Then build the fault-injection harness generalising `validate-loop.ts` to all five classes, asserting a non-zero check (not "issue created"), and wire it into CI. Gate the phase on that harness going green.
4. Full findings and the Phase 2+ pointer list are in `docs/deploy-audit.md` — read it first; do not re-derive.

## Open questions

- **Approve Phase 2 modifying live deploy files** (`watchdog.yml`, `tools/watchdog/index.ts`, and the fault-injection harness)? Phase 1 deliberately stopped at this boundary.
- **Push / promote the audit?** The audit commits sit on local `develop` unpushed. Decide whether to push `develop` (and whether the audit should reach staging/main) before or after Phase 2.
