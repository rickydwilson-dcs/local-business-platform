# YOLO Implementation Brief: Fix W4 Self-Check Hard Block + Max-Turns Ceiling

**Branch:** feature/w4-fix-constraint-block (created from develop, in force repo)
**Session spec:** output/sessions/2026-04-01_w4-fix-constraint-block/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

W4 (site build workflow in `~/Sites/force`) has two outstanding bugs diagnosed in the
2026-04-01 Mad Graphics build session:

1. **Self-check doesn't BLOCK on unresolvable constraints.** When the Cygnus theme was
   not found in `packages/themes/`, W4 silently substituted Vega and continued instead
   of stopping to report a blocker. The `## Step 2b: Pre-Write Self-Check` section in
   `w4-site-build.md` tells W4 to "state explicitly" its theme choice, but has no STOP
   condition for when a named constraint from the brief cannot be fulfilled exactly.

2. **MAX_TURNS ceiling too low for full builds.** `listen/worker.py` has `MAX_TURNS[4] = 40`.
   The Mad Graphics build (49 services + 19 locations) ran 167 turns. W4 completed only
   because a prior hotfix raised the limit on deathstar — this repo copy still says 40.
   The ceiling must be raised to 200 for W4 to reliably complete large builds.

Both files are in the force repo at `~/Sites/force`, not the LBP monorepo.
The force repo has its own `develop → main` workflow. All changes go on a feature branch,
then get committed to develop. The force repo has a GitHub Actions CI that auto-promotes
develop → main after clean builds (confirmed from git log).

The implementation is straightforward — targeted edits to two files.

---

## Model Tiers

| Tier | Alias | Cost (in/out per MTok) | Use for |
|------|-------|----------------------|---------|
| Opus | `opus` | $15 / $75 | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15 | Standard implementation — file edits, feature wiring, most phases |
| Haiku | `haiku` | $0.25 / $1.25 | Mechanical tasks: find-replace, import additions, grep checks, content validation |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
cd ~/Sites/force
git checkout develop && git pull
git checkout -b feature/w4-fix-constraint-block
```

No pnpm/build step needed — these are markdown and Python edits only.

---

## Phase 1 — Add STOP condition to W4 Pre-Write Self-Check

**Goal:** Extend `Step 2b: Pre-Write Self-Check` in `w4-site-build.md` so W4 STOPS and
reports to Telegram instead of substituting when a hard constraint from the brief cannot
be fulfilled.
**Model:** sonnet — requires understanding the context of what constitutes an
"unresolvable constraint" to write an unambiguous instruction

**File:** `~/Sites/force/workflows/w4-site-build.md`

**Current Step 2b content:**
```
### Step 2b: Pre-Write Self-Check

Before writing any files, state explicitly:
- Theme name and primary colour
- Total service page count
- Total location page count
- Source of this information (brief file path, or "inferred")

**If source is "inferred" and a brief path was provided in the input: stop and re-read the brief.**
```

**Replace Step 2b with this exact content:**
```
### Step 2b: Pre-Write Self-Check

Before writing any files, state explicitly:
- Theme name and primary colour — and whether that theme package exists at `PLATFORM_REPO/packages/themes/[theme-name]/`
- Total service page count
- Total location page count
- Source of this information (brief file path, or "inferred")

**If source is "inferred" and a brief path was provided in the input: stop and re-read the brief.**

**Hard-block rule:** If any constraint from the brief cannot be fulfilled exactly, STOP immediately. Do not substitute, approximate, or continue. Post to Telegram:

> 🚫 **W4 Blocked — [Project Name]**
> Cannot fulfil constraint: [description of what is missing]
> Action required: [what the user needs to do to unblock]

Examples of hard constraints requiring a STOP:
- Theme named in the brief does not exist at `PLATFORM_REPO/packages/themes/[name]/`
- Brief specifies a service count that conflicts with platform MDX validation limits
- `PLATFORM_REPO` cannot be resolved from projects.json

Do not proceed until the user responds to the Telegram block message.
```

**Verification gate — STOP if this fails:**
```bash
grep -n "Hard-block rule" ~/Sites/force/workflows/w4-site-build.md
# Must return a line number
grep -n "Do not substitute" ~/Sites/force/workflows/w4-site-build.md
# Must return a line number
```

**Commit:**
```bash
cd ~/Sites/force
git add workflows/w4-site-build.md
git commit -m "fix(w4): hard-block on unresolvable constraints — stop and report instead of substituting

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2 — Raise MAX_TURNS ceiling for W4

**Goal:** Raise `MAX_TURNS[4]` from 40 to 200 in `listen/worker.py` so full site builds
(49+ service pages, 19+ locations) can complete without hitting the ceiling.
**Model:** haiku — single number change in a Python dict

**File:** `~/Sites/force/listen/worker.py`

**Current:**
```python
MAX_TURNS: dict[int, int] = {
    1: 10,
    2: 20,
    3: 15,
    4: 40,
    5: 60,
}
```

**Replace with:**
```python
MAX_TURNS: dict[int, int] = {
    1: 10,
    2: 20,
    3: 15,
    4: 200,   # large builds (49 services + 19 locations) require ~167 turns
    5: 60,
}
```

**Verification gate — STOP if this fails:**
```bash
grep "4: 200" ~/Sites/force/listen/worker.py
# Must return exactly one match
```

**Commit:**
```bash
cd ~/Sites/force
git add listen/worker.py
git commit -m "fix(worker): raise W4 MAX_TURNS from 40 to 200 for large site builds

Mad Graphics build (49 services + 19 locations) required 167 turns.
Previous ceiling of 40 was insufficient — completed only due to a
local hotfix. Raising to 200 to reliably support full builds.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3 — Push feature branch and verify

**Goal:** Push the feature branch to origin so it can be merged to develop.
**Model:** haiku — git commands only

```bash
cd ~/Sites/force
git push origin feature/w4-fix-constraint-block
```

**Verify both commits are on the branch:**
```bash
git log --oneline develop..HEAD
# Must show exactly 2 commits
```

---

## Cost Estimate

| Phase | Model | Est. input tokens | Est. output tokens | Est. cost |
|-------|-------|------------------|--------------------|-----------|
| Phase 1: w4 hard-block | sonnet | ~6k | ~0.5k | ~$0.03 |
| Phase 2: max-turns | haiku | ~3k | ~0.1k | <$0.01 |
| Phase 3: push | haiku | ~1k | ~0.1k | <$0.01 |
| **Total** | | **~10k** | **~0.7k** | **~$0.04** |

Rates: Sonnet $3/$15 per MTok, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:
1. Phases completed — list each with commit SHA
2. Verification gates — confirm each passed
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model | Est. input tokens | Est. output tokens | Est. cost |
   |-------|------------------|--------------------|-----------|
   | sonnet | [total] | [total] | $X.XX |
   | haiku | [total] | [total] | $X.XX |
   | **Total** | | | **$X.XX** |

---

## Update Session File

After completing all phases, append to this file:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits
[list each commit SHA and message]
```

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push to main or develop directly — feature branch only
- The force repo is at `~/Sites/force` — use absolute paths throughout
- Minimal changes only — implement exactly what the plan says, nothing more
- Both fixes are surgical: one markdown edit, one integer change
- The Co-Authored-By line must say `Claude Sonnet 4.6` (orchestrator model)

## Completed

**Date:** 2026-04-01
**Status:** All phases executed successfully

Both fixes applied as specified. Phase 1 extended `Step 2b: Pre-Write Self-Check` in `workflows/w4-site-build.md` with a hard-block rule and Telegram message template — W4 will now stop and report instead of silently substituting when a named constraint (e.g. a theme package) cannot be fulfilled. Phase 2 raised `MAX_TURNS[4]` in `listen/worker.py` from 40 to 200 with an inline comment referencing the Mad Graphics build. Both verification gates passed on first attempt. Feature branch pushed to origin with exactly 2 commits.

### Commits
- `04e82f5` fix(w4): hard-block on unresolvable constraints — stop and report instead of substituting
- `75b9f67` fix(worker): raise W4 MAX_TURNS from 40 to 200 for large site builds
