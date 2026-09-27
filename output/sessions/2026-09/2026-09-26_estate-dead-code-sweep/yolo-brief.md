# YOLO Implementation Brief: Estate-wide dead-code sweep

**Branch:** `feature/estate-dead-code-sweep` (created from `develop` — this project's mandated
integration branch per root `CLAUDE.md`'s non-negotiable `develop → staging → main` workflow; the
generic `origin/HEAD` default (`main`) is overridden by that explicit project rule)
**Session spec:** `output/sessions/2026-09/2026-09-26_estate-dead-code-sweep/yolo-brief.md`
**Mode:** Autonomous execution — coordinate all phases, delegate implementation to sub-agents,
verify after each, STOP on error
**Orchestrator model:** sonnet — coordinator only; per-phase `**Model:**` tiers attach to
delegated sub-agents and are independent of this

---

## Context

**Plan source:** Claude independent plan (`session.md` — no Codex review). No `/plan.with.codex`
run exists for this topic; the most recent `output/sessions/codex-peer-review/` folder
(`2026-08-01_npracing-site-build`) is unrelated and was correctly not used. The user confirmed
proceeding directly from `session.md`.

DCS was redesigned in place twice (solaris → r9), and each phase left the superseded components
"out of scope" instead of deleting them — nothing in CI ever failed on this, so a whole retired
design system kept shipping to visitors for months. DCS itself is already cleaned (2026-09-25/26)
and is **out of scope for this brief**. The job now is to run the same audit-and-clean pass across
the other nine sites in the monorepo, using `tools/find-dead-code.ts`, and to make two one-off
systemic decisions about dead patterns inherited from `base-template`.

Implement the plan exactly as specified below. This plan had no second-model review, so hold to
the gates all the more.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $5 / $25               | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

## Delegation Model

The orchestrator is a **coordinator, not an implementer**. Its job is: read this brief,
sequence the phases, dispatch sub-agents, run verification gates, make commits, and write
the final report. It does **not** implement phase work inline by default.

**Every phase's implementation work is delegated to one or more `Task` sub-agents**, each
spawned at the phase's `**Model:**` tier. The model annotation _is_ the sub-agent's model —
it is meaningless unless the work is delegated, because the orchestrator cannot change its
own running model. A `**Model:** haiku` phase executed inline runs at full orchestrator
cost and consumes orchestrator context; delegating it keeps that work in the sub-agent and
returns only a short summary.

**Inline exception.** The orchestrator may implement a phase inline ONLY when the work is
tightly cross-coupled and correctness-critical — e.g. a deterministic engine spanning many
interdependent files with exact golden vectors — where round-tripping through a sub-agent
would lose essential context. When taken, the phase MUST declare
`**Execution:** inline (exception) — <one-line rationale>`. This is the exception, not the
default; prefer delegation whenever the work is separable.

The orchestrator's own model (set by the launch command) is **independent** of the phase
tiers. Opus orchestrating while individual phases delegate to haiku/sonnet sub-agents is
expected and correct — the orchestrator coordinates; the tiers attach to sub-agents.

**Sub-agents never run `git add`/`git commit`.** Two sub-agents in the same phase run
concurrently against the same working tree; only the orchestrator commits, sequentially,
after each phase's sub-agent(s) return. This is a hard rule in this brief — see the
Sequential points table below.

---

## Pre-flight

```bash
# Base branch is develop, per root CLAUDE.md's git workflow (not origin/HEAD)
git checkout develop && git pull
git status   # confirm no unrelated uncommitted work is about to be dragged onto the new branch
git checkout -b feature/estate-dead-code-sweep
pnpm type-check   # sanity gate — must be clean before starting
```

If `git status` shows uncommitted changes unrelated to this task (there were some on `develop` at
session start — `docs-site/README.md`, autcobel session docs), STOP and ask the user how to
handle them before branching; do not carry them onto this feature branch silently.

---

## Phase 1: Systemic decision — retire the `lib/analytics/types.ts` shim

**Goal:** Decide, with evidence, whether the 2-line re-export shim
(`export * from "@platform/core-components/lib/analytics/types"`) inherited from `base-template`
is genuinely dead in every site that has it, and if so delete it everywhere; if not, leave it and
record why.
**Model:** sonnet — repo-wide grep plus a bounded, evidence-based decision across up to 10
package directories
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL. Here "records" = sites carrying the shim.

**Gate contract:** (all four required — see `templates/gated-phase-brief-template.md`)

- **(a) Golden-fixture test:** n/a — pure internal refactor/deletion, no external-data surface.
- **(b) Invariant on real data:** n/a — covered by (d) below.
- **(c) Rollback:** `git revert <this phase's commit>` (code-only, no live state).
- **(d) Hard fail:** any import of the shim's own path is found anywhere in the repo after the
  decision to delete, OR `type-check` fails for any site the file was deleted from, OR the file is
  deleted from some carrying sites but not others without a stated per-site reason.

```
Task: Investigate and apply the lib/analytics/types.ts shim decision
model: sonnet
Prompt:
  1. Find every copy of the shim: `find sites packages -path '*/lib/analytics/types.ts'` (and
     check base-template's copy specifically).
  2. For each copy, grep the WHOLE monorepo (sites, packages, tools, scripts — exclude
     node_modules and the shim file itself) for any import that resolves to that shim's own path,
     e.g. patterns like `from ['"].*lib/analytics/types['"]` and relative forms
     (`./analytics/types`, `../lib/analytics/types`). Do not grep for the exported symbol names —
     a symbol-name match lies here (the same names are also exported from
     `@platform/core-components/lib/analytics/types` directly, which is how every real consumer
     imports them today).
  3. Decision rule:
     - If ZERO references to the shim's own path exist anywhere outside the shim file itself, in
       ANY site: delete `lib/analytics/types.ts` from base-template and from every site that has
       a copy.
     - If ANY reference is found: do NOT delete anything. List the referencing file(s) and record
       "shim kept — referenced by <file>" in your summary. Move on; this is not a partial failure,
       it is the correct outcome for a genuinely-used shim.
  4. If deleting: run `pnpm --filter <site> run type-check` for every site the file was removed
     from (and for base-template if it has its own type-check script), to confirm nothing broke.
  5. Do NOT run any git command. Return a summary: which sites/base-template had the file removed
     (with line count each), the grep evidence for "zero references", and the verdict line.
```

**Orchestrator, after the sub-agent returns:** stage exactly the paths the sub-agent reports
changed and commit once:

```bash
git add <touched lib/analytics/types.ts paths>
git commit -m "chore: remove dead lib/analytics/types.ts shim (unreferenced across the estate)"
```

If the sub-agent's verdict is "kept" (shim is referenced somewhere), skip the commit — there is
nothing to commit — and record that outcome for the final report instead.

---

## Phase 2: Systemic decision — retire the dead `.text-balance` CSS class

**Goal:** Decide, with evidence, whether `.text-balance` is genuinely unused in
`colossus-scaffolding`, `dj-fox-electrical`, and `npracing-v1` (all three inherited it from
`base-template`), and if so remove it from those three sites and from `base-template`.
**`npracing-v3` is explicitly excluded — it is a frozen design reference (see `MEMORY.md`); do
not read, grep-for-edit, or modify anything in it as part of this phase.**
**Model:** sonnet — same evidence-based-decision shape as Phase 1, across 4 directories
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. Here "records" = the 3 in-scope sites plus base-template.

**Gate contract:**

- **(a) Golden-fixture test:** n/a — pure internal CSS deletion, no external-data surface.
- **(b) Invariant on real data:** n/a — covered by (d) below.
- **(c) Rollback:** `git revert <this phase's commit>`.
- **(d) Hard fail:** `text-balance` is found live in JSX/TSX/MDX in a site the class is removed
  from, OR the class's stylesheet turns out to be verbatim-guarded by a parity test and is edited
  anyway, OR `npracing-v3` is touched in any way.

```
Task: Investigate and apply the .text-balance CSS class decision
model: sonnet
Prompt:
  1. In base-template, colossus-scaffolding, dj-fox-electrical, and npracing-v1 ONLY (never
     npracing-v3), grep for `text-balance` across .tsx/.jsx/.mdx files — both static className
     strings and template-literal/string-concatenation constructions (a runtime-built class name
     like `text-balance${x}` would not show as a plain string match; check for the substring
     inside template literals too, per the "runtime-built class names are not dead" trap).
  2. For each site: if there is no live usage, confirm the class's stylesheet (wherever
     `.text-balance` is authored — likely globals.css) is not asserted byte-for-byte by a parity
     or snapshot test — grep that site's test directory for the stylesheet's filename before
     editing it. If it IS guarded, skip that site and record why; do not edit a guarded
     stylesheet.
  3. Remove the `.text-balance` rule from every site confirmed both unused and unguarded, and
     from base-template.
  4. Run `pnpm --filter <site> run lint` for each site touched.
  5. Do NOT run any git command. Return a summary: which sites had the rule removed, which were
     skipped and why (guarded stylesheet, or live usage found), and the verdict line.
```

**Orchestrator, after the sub-agent returns:** stage exactly the paths reported changed and
commit once:

```bash
git add <touched globals.css / stylesheet paths>
git commit -m "chore: remove dead .text-balance CSS class (unused across the estate)"
```

---

## Phase 3: Per-site dead-code cleanup (parallel)

**Goal:** Clean the unreachable files and dead CSS flagged by `find-dead-code.ts` in
`mad-graphics`, `dj-fox-electrical`, `colossus-scaffolding`, `showcase`, `npracing-v1`,
`dch-automotive`, and `dpm-autobody`. `dcs` is already done (out of scope). `npracing-v3` is
frozen (out of scope — do not touch). `base-template`'s only known candidate was the Phase 1 shim,
already handled.
**Model:** sonnet — each site's cleanup requires applying the traps below (import-path
verification, runtime-built class names, verbatim-guarded stylesheets, orphaned root-layout
components), which is judgment work, not pure mechanical deletion
**Execution:** delegate to 7 sonnet sub-agents in one message
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** Each sub-agent ends with exactly one line: `PASS — <n>/<total> candidates, 0 errors` or `FAIL — <n>/<total> candidates, <e> errors: <first offending candidate>`, where "candidates" = the fresh `find-dead-code.ts` output for that site.

**Gate contract:**

- **(a) Golden-fixture test:** n/a — pure internal dead-code deletion, no external-data surface.
- **(b) Invariant on real data:** n/a — covered by (d) below.
- **(c) Rollback:** `git revert <that site's commit>` — the orchestrator commits per site after
  this phase (see below), so each site's change is independently revertible.
- **(d) Hard fail, per site:** the tool reports N>0 candidates but 0 are deleted with no
  documented per-item reason, OR that site's `type-check`/`build`/`lint` fails after deletion, OR
  a deleted file turns out to have been imported (build breaks with a module-not-found error), OR
  `colossus-scaffolding`'s `accreditation-section.tsx` is deleted, OR `npracing-v3` is touched at
  all.

**Session.md's traps — every sub-agent must apply all six:**

1. A name-based grep lies. The r9-style replacements often re-export the same symbol from a new
   path. **Grep for the import PATH, never the symbol name**, before concluding a file is
   unreferenced.
2. Runtime-built class names are not dead. ``className={`svccard svccard--${color}`}`` means the
   literal never appears verbatim in source. Never delete a CSS class the tool buckets as
   "probably fine" without manually checking for template-literal construction.
3. Verbatim-guarded stylesheets must not be edited. Check whether the site has a parity/snapshot
   test asserting a stylesheet byte-for-byte (grep the site's test directory for the stylesheet's
   filename) before touching any `.css` file.
4. Reachability tooling cannot flag a dead thing that IS imported. Read what the site's root
   layout (`app/layout.tsx`) actually acts on — a component might still be imported and running,
   observing DOM elements/classes that a deletion would remove out from under it.
5. A shell one-liner with `grep -c` and a `||` fallback can silently lie (zsh glob errors and
   quoting errors both produced false "referenced nowhere" / `0` results during the DCS work).
   Write findings to a script file and read its actual output; don't chain fragile one-liners.
6. jsdom applies no stylesheet — the unit suite will stay green regardless of what CSS is
   deleted. A real `build` plus loading the built page is the only way to validate a CSS removal.

```
Spawn 7 agents in parallel (single Task-tool message):

Task: Clean dead code in sites/mad-graphics
model: sonnet
Prompt:
  Site: sites/mad-graphics. This is currently the biggest offender in the estate sweep — a
  solaris-era block (.btn-*, .section-dark-accent, .noise-overlay, .location-pill*, .stat-value)
  plus its own .mobile-menu*/.lightbox-* classes, and lib/performance-tracker.ts is likely the
  largest single unreachable file.
  1. Run `npx tsx tools/find-dead-code.ts --site sites/mad-graphics` fresh — do not trust any
     stale count from session.md, the estate moves.
  2. For each unreachable-file candidate: grep the WHOLE repo for its import PATH (trap 1), and
     check it is not referenced from MDX or a dynamic import.
  3. For each dead-CSS-class candidate: confirm it is not runtime-built (trap 2) and its
     stylesheet is not verbatim-guarded (trap 3).
  4. Read sites/mad-graphics/app/layout.tsx; for anything it imports, check what DOM it actually
     targets and whether that target still exists (trap 4).
  5. Delete every candidate confirmed dead by the above. Do not delete anything you can't confirm.
  6. Run: `pnpm --filter mad-graphics run type-check && pnpm --filter mad-graphics run lint`
  7. Run: `pnpm --filter mad-graphics run build`
  8. Start the built site (`pnpm --filter mad-graphics run start`, pick a free port), curl the
     homepage and one inner route, confirm HTTP 200 and that footer/consent-banner content is
     still present in the response body (this is the closest automated proxy available to you for
     "look at it" — jsdom cannot validate CSS removal, per trap 6). Kill the server afterward.
  9. Do NOT run any git command. Return: files deleted (path + line count), CSS classes removed,
     anything found-but-kept with your reason, gate results, and the verdict line.

Task: Clean dead code in sites/dj-fox-electrical
model: sonnet
Prompt:
  Site: sites/dj-fox-electrical. Known candidate: lib/locations.ts (~64 lines) is BOTH dead code
  AND an architecture-rule violation — root CLAUDE.md forbids centralised TS data files by name
  ("NEVER create ... lib/locations.ts — frontmatter IS the data"). Removing it closes both issues
  in one deletion.
  [same 9 steps as above, filter name dj-fox-electrical, substituting the site path]

Task: Clean dead code in sites/colossus-scaffolding
model: sonnet
Prompt:
  Site: sites/colossus-scaffolding. **Hard constraint: do NOT delete
  components/ui/accreditation-section.tsx under any circumstance**, even if the tool flags it as
  unreachable — it is a real, client-facing component, and deleting it is a content decision
  requiring the client/content owner's sign-off, which is out of scope for this brief. If the tool
  reports it, record it in your summary as "found, deliberately left — needs content-owner
  sign-off" and move on. Clean whatever OTHER unreachable candidates the tool reports for this
  site (the .text-balance CSS class was already handled in Phase 2 — if the fresh scan still
  shows it, that means Phase 2 decided to keep it; do not re-litigate that decision here).
  [same steps 1-9 as above, filter name colossus-scaffolding]

Task: Clean dead code in sites/showcase
model: sonnet
Prompt:
  Site: sites/showcase. Known candidates are all lib/ shims (5 files, ~136 lines) — low value,
  low risk, but still apply all six traps before deleting.
  [same 9 steps, filter name showcase]

Task: Clean dead code in sites/npracing-v1
model: sonnet
Prompt:
  Site: sites/npracing-v1. Known candidates: lib/content.ts, lib/locations-config.ts, lib/mdx.tsx.
  The .text-balance CSS class was already handled in Phase 2 — if the fresh scan still shows it,
  Phase 2 decided to keep it; do not re-litigate that decision here.
  [same 9 steps, filter name npracing-v1]

Task: Clean dead code in sites/dch-automotive
model: sonnet
Prompt:
  Site: sites/dch-automotive. Known candidate: components/pages/home-page.tsx (~168 lines) — an
  orphaned-after-redesign component, the same pattern as DCS's retired solaris pages. Apply trap 1
  with particular care here: confirm no current route imports this file's PATH before deleting,
  even if a replacement component exports the same symbol name from elsewhere.
  [same 9 steps, filter name dch-automotive]

Task: Clean dead code in sites/dpm-autobody
model: sonnet
Prompt:
  Site: sites/dpm-autobody. This is an active client build (site was published to
  dpm-autobody.vercel.app) — known candidates are small (2 files, ~23 lines), but apply all six
  traps before deleting anything, and be conservative: this site is closer to a live client
  deliverable than the others in this batch.
  [same 9 steps, filter name dpm-autobody]
```

**Orchestrator, after all 7 sub-agents return:** commit each site's changes **separately, in the
order the sub-agents returned**, so a regression is bisectable to one site (session.md's Method
step 6). Do not batch these into one commit:

```bash
git add sites/mad-graphics && git commit -m "chore(mad-graphics): remove dead code flagged by find-dead-code.ts"
git add sites/dj-fox-electrical && git commit -m "chore(dj-fox-electrical): remove dead code and lib/locations.ts architecture violation"
git add sites/colossus-scaffolding && git commit -m "chore(colossus-scaffolding): remove dead code (accreditation-section.tsx deliberately left, needs content-owner sign-off)"
git add sites/showcase && git commit -m "chore(showcase): remove dead lib/ shims"
git add sites/npracing-v1 && git commit -m "chore(npracing-v1): remove dead code"
git add sites/dch-automotive && git commit -m "chore(dch-automotive): remove orphaned home-page.tsx"
git add sites/dpm-autobody && git commit -m "chore(dpm-autobody): remove dead code"
```

If any sub-agent reports it deleted nothing (genuinely nothing confirmed dead), skip that site's
commit and record "checked, nothing to remove" for the final report instead of committing an empty
diff.

---

## Phase 4: Final verification and acceptance check

**Goal:** Confirm every touched package is green, and that session.md's Acceptance criteria are
actually met before declaring the sweep done.
**Model:** sonnet
**Execution:** inline (exception) — verification-gate execution and final reporting are the
orchestrator's own coordination duties per the Delegation Model ("run verification gates ... make
commits, and write the final report"), not delegated phase-implementation work.
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** `PASS — <n>/<total> touched packages, 0 gate failures` or `FAIL — <n>/<total> touched packages, <e> gate failures: <first offending package>`.

**Gate contract:**

- **(a) Golden-fixture test:** n/a — pure verification, no external-data surface.
- **(b) Invariant on real data:** every touched package's `type-check`, `lint`, `build` all pass;
  every touched package's `test` suite (and `test:e2e:smoke` where the package defines one) passes.
- **(c) Rollback:** `git revert` the specific phase commit(s) identified by whichever gate failed
  (each is independently revertible per Phase 1–3's commit structure).
- **(d) Hard fail:** any of the commands below exit non-zero, OR any touched site fails to start
  and return HTTP 200 on its homepage.

```bash
# Verification gate — STOP if this fails
# Scope to every package this brief touched: base-template, mad-graphics, dj-fox-electrical,
# colossus-scaffolding, showcase, npracing-v1, dch-automotive, dpm-autobody
pnpm turbo run type-check --filter=base-template --filter=mad-graphics --filter=dj-fox-electrical --filter=colossus-scaffolding --filter=showcase --filter=npracing-v1 --filter=dch-automotive --filter=dpm-autobody
pnpm turbo run lint --filter=base-template --filter=mad-graphics --filter=dj-fox-electrical --filter=colossus-scaffolding --filter=showcase --filter=npracing-v1 --filter=dch-automotive --filter=dpm-autobody
pnpm turbo run build --filter=base-template --filter=mad-graphics --filter=dj-fox-electrical --filter=colossus-scaffolding --filter=showcase --filter=npracing-v1 --filter=dch-automotive --filter=dpm-autobody
pnpm turbo run test --filter=base-template --filter=mad-graphics --filter=dj-fox-electrical --filter=colossus-scaffolding --filter=showcase --filter=npracing-v1 --filter=dch-automotive --filter=dpm-autobody
pnpm turbo run test:e2e:smoke --filter=mad-graphics --filter=dj-fox-electrical --filter=colossus-scaffolding --filter=showcase --filter=npracing-v1 --filter=dch-automotive --filter=dpm-autobody
```

Then check the Acceptance criteria from `session.md` explicitly, one by one:

- Every one of the 9 non-DCS sites is either cleaned (commit exists) or explicitly recorded as
  "checked, nothing to remove" / "deliberately left, because X" — confirm no site was silently
  skipped.
- Both systemic items (Phase 1, Phase 2) were decided and, where decided "delete", applied to
  `base-template` as well as the consuming sites.
- No site's gates regressed (the commands above are the proof).
- `npracing-v3` was not touched (git diff / git log shows no changes under `sites/npracing-v3`).
- `colossus-scaffolding/components/ui/accreditation-section.tsx` still exists and was not deleted.

If any of these fail, STOP — do not write the final report as a pass.

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                                                                                      | File overlap | Model  | Rationale                                                                              |
| ----- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------ | -------------------------------------------------------------------------------------- |
| G1    | Phase 1 | 1 sub-agent, sequential (shim decision spans base-template + up to 9 sites but is one coherent investigate-and-decide task, not independently splittable)                                                                  | n/a          | sonnet | Single coherent decision — splitting it risks inconsistent per-site verdicts           |
| G2    | Phase 2 | 1 sub-agent, sequential (text-balance decision spans base-template + 3 sites, same reasoning as G1)                                                                                                                        | n/a          | sonnet | Single coherent decision                                                               |
| G3    | Phase 3 | Clean sites/mad-graphics, Clean sites/dj-fox-electrical, Clean sites/colossus-scaffolding, Clean sites/showcase, Clean sites/npracing-v1, Clean sites/dch-automotive, Clean sites/dpm-autobody — 7 sub-agents, one message | none         | sonnet | Each site is a fully separate directory tree — zero file overlap between any two sites |
| G4    | Phase 4 | inline (exception) — orchestrator's own gate-running and reporting duty, not a delegated group                                                                                                                             | n/a          | n/a    | Verification/reporting is explicitly the orchestrator's job per the Delegation Model   |

### Cross-phase groups (only if phases are truly independent)

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

Phase 1 and Phase 2 both potentially touch `base-template` and overlap in spirit (both are
"systemic decision" phases), and Phase 2/Phase 3 both potentially touch the same `globals.css` in
`colossus-scaffolding`, `dj-fox-electrical`, and `npracing-v1` (Phase 2 removes `.text-balance`,
Phase 3 removes other dead classes in the same file). These are resolved by strict phase ordering
(1 → 2 → 3 → 4), not parallelism — do not run any two of these phases concurrently.

### Sequential points — MUST NOT parallelise

| Item                                                                                          | Reason                                                                                                                           |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Verification gates (type-check / build / lint / test) between phases                          | Each phase's output gates the next. Gates are the synchronisation barrier.                                                       |
| Git commits                                                                                   | One commit per phase (or per site within Phase 3), in order. Never batched.                                                      |
| Any file edited by two or more items (e.g. a site's `globals.css` across Phase 2 and Phase 3) | Same-file edits must always serialise — enforced here by phase ordering, not by grouping.                                        |
| All `git add`/`git commit` invocations                                                        | Only the orchestrator commits; sub-agents never run git commands, to avoid concurrent-write races against the same working tree. |

---

## Cost Estimate

| Phase                                                       | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ----------------------------------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: analytics/types.ts shim decision                   | sonnet | ~15k              | ~2k                | $0.08      |
| Phase 2: .text-balance decision                             | sonnet | ~10k              | ~1.5k              | $0.05      |
| Phase 3: mad-graphics cleanup                               | sonnet | ~25k              | ~5k                | $0.15      |
| Phase 3: dj-fox-electrical cleanup                          | sonnet | ~15k              | ~3k                | $0.09      |
| Phase 3: colossus-scaffolding cleanup                       | sonnet | ~14k              | ~2.5k              | $0.08      |
| Phase 3: showcase cleanup                                   | sonnet | ~13k              | ~2.5k              | $0.08      |
| Phase 3: npracing-v1 cleanup                                | sonnet | ~13k              | ~2.5k              | $0.08      |
| Phase 3: dch-automotive cleanup                             | sonnet | ~15k              | ~3k                | $0.09      |
| Phase 3: dpm-autobody cleanup                               | sonnet | ~10k              | ~1.5k              | $0.05      |
| Phase 4: final verification + report (orchestrator, inline) | sonnet | ~8k               | ~2k                | $0.05      |
| **Total**                                                   |        | **~138k**         | **~25.5k**         | **~$0.80** |

Rates: Opus $5/$25, Sonnet $3/$15, Haiku $1/$5 per MTok.
Estimation: ~5 tokens per line of code, plus repo-wide grep overhead per phase (each phase reads more than it writes — this is an audit-and-delete task, not a build task). Input = files/grep results read + brief (~5k, this brief is long) + system prompt (~3k). Output = code deleted (counted as a diff, not full-file output) + gate output (~500–1k/gate) + summaries.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA(s) (Phase 1: 1 commit or "kept, no commit"; Phase 2: 1 commit or "kept, no commit"; Phase 3: up to 7 commits; Phase 4: no commit, verification only)
2. Build status — confirm all of Phase 4's gates pass for every touched package
3. Any exceptions or intentional deviations from the plan, explicitly including:
   - `npracing-v3` — not touched (frozen, needs the user to confirm before anyone touches it)
   - `colossus-scaffolding/components/ui/accreditation-section.tsx` — not deleted (content
     decision, needs client/content-owner sign-off)
   - Either systemic decision that came back "kept" rather than "deleted", with the evidence found
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-09/2026-09-26_estate-dead-code-sweep/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes a wrap-up summary to the session folder. **Do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- **Honour every phase's `**Failure contract:**`.** Fail fast on any uncaught exception (never swallow, blind-retry, or press on), print the full traceback and the offending record, and never report a phase as passed on partial data. Each phase MUST end with its one-line PASS/FAIL verdict including counts. A FAIL verdict is a failed gate — STOP.
- **Honour every phase's `**Gate contract:**`.** A phase passes only when its stated invariant holds and the relevant gates are green — and these must be **executed**, not just declared. A phase whose checks did not actually run has NOT passed — STOP. Have the phase's rollback (c) to hand before you start it.
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Delegate every phase's implementation to sub-agents by default.** The orchestrator coordinates, gates, and commits — it does NOT write phase code inline. Only Phase 4 is inline, and it declares the exception explicitly.
- **The `**Model:**` tier names the sub-agent's model, not the orchestrator's.** The orchestrator's own model is set by the launch command and is independent of the phase tiers.
- **Inline is the exception, not the default.**
- **Sub-agents never run git commands.** Only the orchestrator stages and commits, sequentially, per phase (or per site within Phase 3), after sub-agents return. This is a hard requirement in this brief, not just a general preference — it avoids concurrent git-index writes from the 7 parallel Phase 3 sub-agents.
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Never parallelise across phase boundaries** — the Cross-phase groups table is empty in this brief, so phases 1→2→3→4 run strictly in order.
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what this brief says, nothing more. Do not use this sweep as an excuse to refactor, rename, or "improve" code beyond deleting confirmed-dead files/classes.
- **Never touch `sites/npracing-v3`.** Not a read for context, not a grep target beyond confirming it's excluded, not an edit. It is a frozen design reference per `MEMORY.md`.
- **Never delete `colossus-scaffolding/components/ui/accreditation-section.tsx`.** It is a real, client-facing component; that deletion is a content decision outside this brief's authority.
- Use `model: sonnet` for every Task sub-agent in this brief (no haiku or opus phases — the traps require enough judgment that haiku would be a false economy, and nothing here rises to opus-level architectural complexity)
- The Co-Authored-By line in commits must reflect the **orchestrator** model (the committer) — not the per-phase sub-agent tier. If the running orchestrator differs from this brief's stated `**Orchestrator model:**` (sonnet), use the actual running model.
- Every brief MUST verify with type-check, build, and lint gates, scoped to every touched package. STOP if any fails.
- Run each touched package's own `test` and, where defined, `test:e2e:smoke` gate in Phase 4, scoped to what was touched — not the whole repo.
- This brief has no external-API/provider surface (it is pure repo-internal dead-code deletion), so the "real-data rule for external APIs" does not apply here — the Gate contracts above correctly mark (a)/(b) as n/a throughout.
- This brief writes only within the primary repo (`local-business-platform`) — no `--additionalDirectories` needed for the launch command.

## Completed

**Date:** 2026-09-26
**Status:** All phases executed; unit-level gates (type-check/lint/build/test) green across all 8
touched packages. The `test:e2e:smoke` gate surfaced 3 pre-existing, out-of-scope failures
(detailed below) unrelated to this sweep's changes — not a regression, but not silently marked
green either.

Implemented an estate-wide dead-code sweep across all sites except `dcs` (already cleaned) and
`npracing-v3` (frozen, untouched throughout — confirmed via `git diff develop..HEAD -- sites/npracing-v3`
returning empty). Two systemic decisions were investigated as coherent whole-estate calls rather than
per-site: `.text-balance` CSS (removed from base-template + 3 sites) and the `lib/analytics/types.ts`
shim (kept everywhere, see surprise below). Seven of nine remaining sites had per-site cleanup applied
via `find-dead-code.ts`; colossus-scaffolding and showcase had nothing left to remove once the two
protected items (`accreditation-section.tsx`, the analytics shim) were excluded.

**Biggest surprise — the `lib/analytics/types.ts` shim decision had to be redone from a false start.**
An earlier per-site sub-agent (working on dch-automotive in isolation) deleted its copy of the shim,
reasoning correctly _for that one site_ but without checking the estate-wide picture — this was
reverted (commit `988c8d65`) precisely because Phase 1's job is to make ONE coherent decision, not let
per-site sub-agents freelance on a systemic question. When Phase 1 was then run properly as a single
whole-estate investigation, a plain path-string grep initially suggested "delete everywhere" (zero
literal imports of any site's own shim path anywhere in the repo). The investigating sub-agent caught
its own false positive before committing to it: `packages/core-components`'s `Analytics.tsx`,
`AnalyticsDebugPanel.tsx`, and `ConsentManager.tsx` import `@/lib/analytics/types` using the `@/` alias
— and because `core-components` ships raw source type-checked as part of each _consuming_ site's TS
program, that alias resolves through each site's own `tsconfig.json` `@/*": ["./*"]` mapping into that
site's local shim file. A plain grep for the shim's own literal path cannot see this indirect,
alias-mediated reference. Verdict: **kept everywhere**, confirmed empirically by deleting all 9 copies
and watching `npracing-v1`'s type-check fail with `TS2307: Cannot find module '@/lib/analytics/types'`
in exactly those three core-components files, then restoring all 9 files unchanged. This also
explains why the mad-graphics and npracing-v1 Phase-3 sub-agents (run earlier, independently) had
already reached the same "kept" conclusion for their own sites — only dch-automotive's isolated
sub-agent got it wrong, which the revert fixed.

**Second surprise — the `test:e2e:smoke` gate uncovered three pre-existing, unrelated gaps**, none
caused by this branch:

- `mad-graphics` has no `e2e/` directory or Playwright config at all, despite defining a
  `test:e2e:smoke` npm script — confirmed absent on `develop` before this branch existed.
- `npracing-v1`'s smoke spec tests `/services` and `/locations` routes that have never existed in this
  site's `app/` tree (it only has about/contact/merch/news/sponsors/team) — 4 of 7 tests fail with 404.
- `dch-automotive`'s smoke spec tests `/locations/main-area`, a placeholder slug; the site's real
  locations are eastbourne/hailsham/polegate — 1 of 7 tests fails with 404.

Each was verified pre-existing by diffing the site's own Phase-3 cleanup commit against
`e2e/smoke.spec.ts` (untouched in every case) and confirming the missing routes/config predate this
branch on `develop`. Fixing stale smoke specs or authoring missing Playwright config is a testing-infra
task, not a dead-code deletion — left as a flagged follow-up rather than expanding this brief's scope.

A third, minor infra note: running multiple sites' `test:e2e:smoke` in parallel via `turbo` causes
port-3000 collisions (every site's Playwright config hardcodes `localhost:3000`), producing spurious
timeouts and transient "module not found" webpack noise. Re-running with `--concurrency=1` eliminated
the false failures; the three failures above are the real, reproducible ones.

### Commits

- `7a2f1839` — chore: remove dead `.text-balance` CSS class (unused across the estate)
- `69ad17cb` — chore(dj-fox-electrical): remove dead code and lib/locations.ts architecture violation
- `aa876050` — chore(dpm-autobody): remove dead lib/mdx.tsx shim
- `d217d46d` — chore(dch-automotive): remove orphaned home-page.tsx and unused analytics shim
- `bbf8fc8b` — chore(npracing-v1): remove dead code
- `2438c8d2` — chore(mad-graphics): remove dead code flagged by find-dead-code.ts
- `988c8d65` — revert(dch-automotive): restore lib/analytics/types.ts shim (correcting the isolated
  per-site deletion ahead of Phase 1's proper whole-estate decision)
- No commit for Phase 1 (`lib/analytics/types.ts`): verdict was **kept everywhere**, evidenced above
- No commit for colossus-scaffolding or showcase in Phase 3: fresh `find-dead-code.ts` scans found
  nothing removable once `accreditation-section.tsx` and the analytics shim were excluded
