# Deploy-path audit — where a failure can be reported as success

**Scope:** the deploy staircase `develop → staging → main → Vercel` and the regression
watchdog. **Method:** read-only review of the CI workflows, the watchdog triage engine,
the deploy script, the smoke config, and the pre-push hook.

> **Phase 2 status (2026-07-18):** F1, F2, F5, and F6 are **closed** — the watchdog can
> now fail its own check. A new authoritative gate (`tools/watchdog/gate.ts`,
> `lib/gate.ts`) fails on missing/empty/fabricated results, zero tests, or real failures;
> `index.ts main()` now exits non-zero on failures; `watchdog.yml` no longer fabricates a
> passing report; and `deploy-to-production.sh` no longer claims checks it never ran. A
> fault-injection harness (`tools/watchdog/fault-injection.ts`, wired into `ci.yml`) proves
> 4 of the 5 failure classes scream. **Still open:** F3 is covered by the gate (NO_TESTS_RAN)
> but F4, F7, F8, F9, F10, F11 remain — F7/F8/F9 (server-side promotion gate) and F4
> (per-failure error swallowing) are Phase 3. Line references below are **as of the Phase 1
> commit** and have drifted; locate by content.

The brief that prompted this: _"the watchdog once said 'nothing needs attention' while
five bugs cascaded."_ This audit finds the mechanism behind that, and it is not a
one-off bug — it is structural.

---

## Systemic finding

**The regression watchdog is observation-only and cannot fail its own check.** Its job
is to open GitHub issues, not to gate a deploy. Every link in the chain that produces its
signal — Playwright writing a results file, the smoke step's exit code, the triage
engine's exit code, the Anthropic and GitHub APIs — **fails open (green) when it breaks.**
So a broken watchdog and a healthy one look identical from the outside: a green check and
silence. That is precisely "nothing needs attention" while regressions ship.

Separately, the **deploy is decoupled from the quality gate**: Vercel Git Integration
deploys on push to `main` regardless of the GitHub Actions result, and the manual deploy
script prints "All quality checks passed" without running any.

---

## Findings

| ID  | Location                                              | Mechanism                                                                                                                                                             | Rec failure-class                 | Severity    |
| --- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------- |
| F1  | `.github/workflows/watchdog.yml:99-100`               | Missing results file → workflow writes `{"stats":{"ok":true},"suites":[]}` — a fabricated pass                                                                        | missing data / partial sync       | **High**    |
| F2  | `watchdog.yml:87` + `tools/watchdog/index.ts:198,236` | Smoke exit is OR-swallowed to exit 0, and triage `main()` exits 0 even with failures → the check is green regardless of the result                                    | (root mechanism)                  | **High**    |
| F3  | `watchdog.yml:103`                                    | Triage only runs `if: smoke_failed == 'true'`; a silent smoke pass (0 tests / faked ok) never triages                                                                 | empty models/targets list         | **High**    |
| F4  | `index.ts:133-136, 193-195`                           | Per-failure `runAutoTriage`/`openIssue` errors are logged and `continue`d — a real regression yields no issue, job still green                                        | network timeout / dependency down | **High**    |
| F5  | `index.ts:94-97`                                      | Missing results file → "nothing to triage" → `exit 0` (independent of F1)                                                                                             | missing data                      | Medium      |
| F6  | `scripts/deploy-to-production.sh:79`                  | Prints "✅ All quality checks passed" while running **no** checks (only merges + pushes)                                                                              | reported-as-success               | **High**    |
| F7  | `.github/workflows/deploy.yml`                        | Vercel deploys on push to `main` independent of the "Production Quality Gate" job — a red gate does not block the deploy                                              | gate doesn't gate                 | Medium-High |
| F8  | `.husky/pre-push:61-64,108`                           | main→staging gate is skipped (fails open) if `gh` CLI absent, then prints "All pre-push checks passed"; hook is also bypassable (`--no-verify`) with no CI equivalent | guardrail fails open              | Medium      |
| F9  | `.husky/pre-push:67`                                  | Gate reads the **latest** staging "E2E Tests" run, not the run for the commit being promoted → a stale green run satisfies it                                         | stale background-task status      | Medium      |
| F10 | `.github/workflows/ci.yml:48`                         | Content validation runs for **one** site only (`colossus-scaffolding`) → other sites' invalid content passes CI silently                                              | partial coverage as full          | Low-Medium  |
| F11 | `smoke.config.ts:10` vs `watchdog.yml:92,99`          | Results path is defined in three places (config `outputFile`, `PLAYWRIGHT_JSON_OUTPUT_FILE`, the `cp` source); any drift routes into F1's fake-ok                     | (fragility behind F1)             | Medium      |

Note on F2: the smoke step ends with a shell OR-fallback that sets a `smoke_failed` flag
and returns exit 0, so a failing smoke run does not fail the step; see `watchdog.yml:87`.

---

## Detail on the load-bearing ones

### F1 + F2 — the "nothing needs attention" mechanism

`watchdog.yml` runs smoke, and on any non-zero exit an OR-fallback sets `smoke_failed=true`
and the **step** still exits 0. The next step copies the JSON results, and on failure
writes a **fabricated passing report** (`ok:true`, empty `suites`). Triage runs only when
`smoke_failed == 'true'`, and even when it does run, `index.ts main()` returns normally
(exit 0) after opening issues — it only exits non-zero on an internal fatal error. Net
effect: the "Regression Watchdog" check is **green in every case** — smoke passed, smoke
failed, or the results file was missing and faked. The only externally visible difference
between "all clear" and "five regressions" is whether an issue happened to get opened,
which depends on F4's fragile chain.

### F6 — the deploy script lies about checks

`deploy-to-production.sh` merges `staging → main`, pushes, then unconditionally prints
`✅ All quality checks passed` and `✅ Staging → Main → Production complete`. It runs no
type-check, lint, test, or smoke itself. An operator reading the terminal sees success for
checks that never ran in-band; the real checks (if any) run asynchronously in CI and can
go red _after_ the script has declared victory.

### F8 + F9 — the promotion gate fails open and reads stale status

The pre-push hook's `main` gate verifies staging's E2E run — but only if `gh` is installed
(else it warns and proceeds), only against the _latest_ staging run (not the promoted
commit), and only locally (a `--no-verify` push, or any push from CI/another machine,
bypasses it). There is no CI-side check enforcing "staging E2E green before main."

---

## Existing mitigation and its limits

`tools/watchdog/validate-loop.ts` is a real end-to-end self-test — it injects a broken
staging site URL, runs the true triage loop, and asserts a GitHub issue appears. Credit
where due. But it does not cover the gap this audit describes:

1. **One failure class only** — an unreachable site URL. It does not exercise missing
   data, an empty targets list, a network timeout mid-run, stale status, or partial sync.
2. **Manual / dispatch-only** — it runs on `workflow_dispatch` with `validate_loop=true`
   or locally, not as part of normal CI.
3. **It asserts the wrong thing** — "an issue was created" (the observational signal), not
   "the watchdog blocked/failed the deploy." It validates that observation _works_, not
   that a bad deploy is _stopped_ — so it would not catch F1/F2/F3 at all.

It is the seed of a fault-injection harness, not the harness itself.

---

## Failure-class coverage today (the brief's five)

| Failure class                | Caught & screams today? | Slips through via                                   |
| ---------------------------- | ----------------------- | --------------------------------------------------- |
| Missing data                 | ❌                      | F1 (fake ok), F5                                    |
| Empty models/targets list    | ❌                      | F3 (0 tests → exit 0 → no triage)                   |
| Network timeout              | ⚠️ partial              | F4 (triage error swallowed); smoke retry=1 may mask |
| Stale background-task status | ❌                      | F9 (latest-run gate)                                |
| Partial sync                 | ❌                      | F1/F2 (green regardless)                            |

Only the "unreachable site" variant (via `validate-loop`) is proven to produce a signal —
and even that produces an _issue_, not a failed check.

---

## What Phase 2+ needs to close (pointers only — not done here)

- **Make the watchdog able to fail.** The smoke/triage job must exit non-zero when real
  failures exist, and must **not** fabricate a passing report on a missing file (delete
  the F1 fallback; treat missing/empty results as FAIL, not pass).
- **Fault-injection harness (Phase 2):** drive each of the five classes and assert the
  watchdog **screams** (non-zero check), not merely "opens an issue". Any silent pass is a
  bug. This generalises `validate-loop.ts` from one class to all five and moves it into CI.
- **Gate the promotion in CI (Phase 3):** a server-side check that `main` only advances
  when the _promoted commit's_ staging E2E is green — not the local, bypassable, latest-run
  hook; and stop the deploy script asserting checks it didn't run.
- **Health-drift + auto-revert (Phase 4)** should be built only _after_ the fault-injection
  harness gives confidence the signal is trustworthy — auto-reverting on an untrustworthy
  metric is itself a new silent-failure risk.

---

_Phase 1 audit — read-only. No deploy-path files were modified. Findings reference exact
`file:line` as of this commit._
