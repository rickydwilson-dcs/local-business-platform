# YOLO Implementation Brief E: Cross-repo Doc Sync + Force `/review.code` Customization

**Branch:** `feature/pipeline-upgrades-e` (created from `develop` in LBP)
**Session spec:** `output/sessions/2026-04-10_pipeline-upgrades/E-cross-repo-sync.md`
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** **opus** (cross-repo coordination + force-specific customization with governance constraints)

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                     |
| ------ | -------- | ---------------------- | ----------------------------------------------------------- |
| Opus   | `opus`   | $5 / $25               | Cross-repo coordination, governance-sensitive customization |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation                                     |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks                                            |

Default orchestrator: **opus**.

---

## Context

This brief is the final brief in the 2026-04-10 pipeline upgrades sequence. It **depends on Brief A having completed** — specifically, on the `orchestration-patterns.md` guide existing in `/Users/rickywilson/Sites/local-business-platform/docs/guides/`. If that file does not exist, STOP and wait for Brief A to complete first.

The two items merged here are:

- **F2** — Move the orchestration-patterns doc to a cross-repo reference location so both LBP and force can link to it.
- **F4** — Customize force's copy of `/review.code` to conditionally add `cs-observability-engineer` and `cs-backend-engineer` (Python-capable) as additional review agents when the diff touches `listen/*.py` or `bridge/*.ts`.

F4 is the first and only legitimate divergence from the "force skills are byte-identical copies of LBP originals" rule. It is force-specific and addresses a real gap: force's Python/FastAPI infrastructure (the `listen/server.py` job queue, the `bridge/telegram-listener.ts` dispatcher) currently gets no specialist review when force runs `/review.code` on itself.

**Important governance constraint:** Brief A adds a "Parallel sessions & git worktrees" section to LBP's `CLAUDE.md`. This brief **must not** propagate that rule to force. Force has its own `GOVERNANCE §8` that forbids parallel job execution, and `force/CLAUDE.md` (populated earlier in the pipeline upgrade session) explicitly says the LBP worktree rule does not apply to force. Under no circumstances may this brief alter that position.

## Pre-flight

```bash
cd /Users/rickywilson/Sites/local-business-platform
git checkout develop && git pull
git checkout -b feature/pipeline-upgrades-e
pnpm type-check
```

### Dependency check — STOP if any of these fail

```bash
# Dependency check — STOP if this fails
# Brief A must have landed the orchestration-patterns guide
test -f /Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md || {
  echo "STOP: orchestration-patterns.md does not exist. Brief A must complete before Brief E."
  exit 1
}

# Brief A must have added the worktree decision rule to LBP CLAUDE.md
grep -q "Parallel sessions & git worktrees" /Users/rickywilson/Sites/local-business-platform/CLAUDE.md || {
  echo "STOP: Worktree decision rule is not in LBP CLAUDE.md. Brief A must complete before Brief E."
  exit 1
}

# Force must still have its governance file intact
test -f /Users/rickywilson/Sites/force/GOVERNANCE.md || {
  echo "STOP: force GOVERNANCE.md missing."
  exit 1
}

# Force must have the root CLAUDE.md populated (F5 from the prior session)
test -s /Users/rickywilson/Sites/force/CLAUDE.md || {
  echo "STOP: force root CLAUDE.md is empty. F5 must have completed."
  exit 1
}

grep -q "§8" /Users/rickywilson/Sites/force/CLAUDE.md || {
  echo "STOP: force CLAUDE.md does not reference §8. Cannot safely customize force /review.code without the governance boundary in place."
  exit 1
}
```

---

## Phase 1 — F2: Move orchestration-patterns.md to a cross-repo location

**Goal:** Move the canonical copy of `docs/guides/orchestration-patterns.md` from LBP's tree into a shared location that both LBP and force can symlink to, without losing git history for either repo and without making force depend on LBP's git state at runtime.

**Model:** opus — cross-repo coordination with symlink decisions.

**Design decision — where "cross-repo" lives:**

The cleanest cross-repo location for user-level documentation is `~/.claude/docs/`. That directory is **outside both git repos** but is guaranteed to be present on this machine (it lives alongside `~/.claude/agents/` and `~/.claude/commands/` which are already established as user-global paths). Both LBP and force can contain a relative symlink into it.

**However**, `~/.claude/docs/` is not currently versioned. Moving authoritative doc there means the content is no longer tracked by git unless we also commit a copy into each repo. There are three options:

- **Option 1 (canonical in ~/.claude/docs/, symlinks in repos)** — Cleanest architecturally. Content lives in one place. But if `~/.claude/docs/` gets corrupted or machine-migrated without it, the symlinks break.
- **Option 2 (canonical in LBP, force has a copy synced via `just sync-skills`)** — Keep LBP as the source of truth, add the doc path to the force sync target so it's copied alongside the 8 shared skills. Git history is preserved in LBP; force has a working copy.
- **Option 3 (canonical in a dedicated `~/Sites/claude-shared/` repo, both repos symlink)** — Maximum cleanliness but requires creating a new repo just for shared docs.

**Choose Option 2.** Rationale: preserves git history, requires no new repos, extends the existing `just sync-skills` target that Brief A created, and the doc is small (single file). Option 1 is cleaner in theory but introduces symlink fragility. Option 3 is overkill for a single doc.

**Changes to make:**

### 1a. Do NOT move the LBP file.

Keep `/Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md` as the canonical source of truth. No file move, no symlink in LBP.

### 1b. Add a note at the top of the doc stating it is cross-repo

Read the current LBP file and add a note at the top, immediately after the title:

```markdown
# Orchestration Patterns

> **Cross-repo doc.** This guide is authored in local-business-platform and is the canonical reference for orchestration patterns across LBP and force. Force maintains a copy in `~/Sites/force/docs/guides/orchestration-patterns.md` that is synced via `just sync-skills` — see force's justfile.

[...existing content...]
```

### 1c. Extend force's `just sync-skills` target (created in Brief A Phase 2) to also sync this doc

Read `/Users/rickywilson/Sites/force/justfile`. Locate the `sync-skills` recipe added in Brief A. Extend it so that after the 8 shared skills are copied, it also copies `docs/guides/orchestration-patterns.md` from LBP to force.

Add this logic at the end of the recipe body, before the "Sync complete" echo:

```bash
    # Sync the orchestration patterns guide (cross-repo doc)
    LBP_DOC="$LBP_COMMANDS/../../docs/guides/orchestration-patterns.md"
    FORCE_DOCS_DIR="/Users/rickywilson/Sites/force/docs/guides"
    FORCE_DOC="$FORCE_DOCS_DIR/orchestration-patterns.md"
    mkdir -p "$FORCE_DOCS_DIR"
    if [ -f "$LBP_DOC" ]; then
      if [ -f "$FORCE_DOC" ] && cmp -s "$LBP_DOC" "$FORCE_DOC"; then
        echo "  OK:   docs/guides/orchestration-patterns.md (already in sync)"
      else
        cp "$LBP_DOC" "$FORCE_DOC"
        echo "  COPY: docs/guides/orchestration-patterns.md"
        UPDATED=$((UPDATED + 1))
      fi
    else
      echo "  SKIP: docs/guides/orchestration-patterns.md (not present in LBP)"
      SKIPPED=$((SKIPPED + 1))
    fi
```

### 1d. Run the updated sync-skills to populate force's copy

```bash
cd /Users/rickywilson/Sites/force
just sync-skills
```

This must produce a `docs/guides/orchestration-patterns.md` file in force.

### 1e. Update force's `.claude/CLAUDE.md` to reference the doc

Add one line to force's `.claude/CLAUDE.md` in an appropriate section (e.g. near where it lists the justfile commands or the cross-repo interaction model):

```markdown
Orchestration patterns guide: see `docs/guides/orchestration-patterns.md` (synced from LBP via `just sync-skills`).
```

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails

# LBP doc has the cross-repo note at the top
grep -A 5 "^# Orchestration Patterns" /Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md | grep -q "Cross-repo doc"

# Force justfile sync-skills target now handles the doc
grep -q "orchestration-patterns.md" /Users/rickywilson/Sites/force/justfile

# Force has a working copy of the doc
test -f /Users/rickywilson/Sites/force/docs/guides/orchestration-patterns.md

# Force doc content matches LBP content (they should be byte-identical after sync)
diff -q /Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md /Users/rickywilson/Sites/force/docs/guides/orchestration-patterns.md

# Force CLAUDE.md references the doc
grep -q "orchestration-patterns.md" /Users/rickywilson/Sites/force/.claude/CLAUDE.md

# LBP build still passes
cd /Users/rickywilson/Sites/local-business-platform
pnpm lint
```

**Commits:** This phase produces commits in BOTH repos.

**LBP commit** (on `feature/pipeline-upgrades-e`):

```bash
cd /Users/rickywilson/Sites/local-business-platform
git add docs/guides/orchestration-patterns.md
git commit -m "$(cat <<'EOF'
docs(guides): mark orchestration-patterns as cross-repo canonical

This doc is the authoritative reference for orchestration patterns
used across LBP and force. Force maintains a synced copy via its
justfile sync-skills target.

Part of the pipeline parallelization plan (item F2).

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

**Force commit** (on force's develop branch — create a new feature branch `feature/orchestration-patterns-sync`):

```bash
cd /Users/rickywilson/Sites/force
git checkout develop
git checkout -b feature/orchestration-patterns-sync
git add justfile docs/guides/orchestration-patterns.md .claude/CLAUDE.md
git commit -m "$(cat <<'EOF'
feat(justfile,docs): sync orchestration-patterns guide from LBP

Extends the sync-skills target to also copy the orchestration patterns
guide from local-business-platform. Force now has a working copy at
docs/guides/orchestration-patterns.md kept in sync on demand. CLAUDE.md
references the doc from the justfile commands section.

Part of the pipeline parallelization plan (item F2).

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"

# Return to LBP working copy before the next phase
cd /Users/rickywilson/Sites/local-business-platform
```

---

## Phase 2 — F4: Customize force's `/review.code` for Python/observability fan-out

**Goal:** Add a conditional 5th agent (Python/backend review) and 6th agent (observability review) to force's copy of `/review.code`. They activate when the changeset touches `listen/*.py`, `bridge/*.ts`, or `scripts/*.py` — i.e. force's actual infrastructure code.

**Model:** opus — this involves understanding force's codebase layout and not breaking the force-vs-LBP skill divergence.

**Files:**

- `/Users/rickywilson/Sites/force/.claude/commands/review.code.md`

**IMPORTANT DIVERGENCE WARNING:** This phase is the first legitimate divergence from the "force skills are byte-identical copies of LBP originals" rule. After this phase, running `just sync-skills` in force will OVERWRITE force's customized `/review.code` with the LBP version, losing the Python/observability customization.

To prevent this, **also modify force's `just sync-skills` recipe** to EXCLUDE `review.code.md` from the sync list, and add a comment explaining why.

### 2a. Read force's current `/review.code.md`

```bash
cat /Users/rickywilson/Sites/force/.claude/commands/review.code.md
```

This should currently be a byte-identical copy of the LBP version (including the Step 1.4 Conditional Agents block, the Agent 5 Vercel config block, and the Agent 6 Theme package block that were added earlier in the pipeline upgrade session).

**Important:** If force's copy is older and does not include Agents 5 and 6, do NOT sync it from LBP at this point — that would conflict with Phase 2's divergence. Instead, proceed to customize the existing content in place. The divergence note added to `just sync-skills` will protect the customization from future overwrites.

### 2b. Add Step 1.4 entries for the new conditional agents

Find the existing Step 1.4 "Determine Conditional Agents" block. Add two new entries after the Theme Package Validator entry.

Note that force's repo layout is different from LBP — there are no `sites/`, no `packages/themes/`. Instead there are `listen/*.py` (FastAPI job server), `bridge/*.ts` (Telegram → classifier → dispatcher), `scripts/*.py` (utilities), and `workflows/*.md` (workflow prompts).

Add after the Theme Package Validator block:

````markdown
### Conditional agent 3: Python backend reviewer (force-specific)

```bash
echo "$CHANGED_FILES" | grep -E '(listen/.*\.py$|bridge/.*\.ts$|scripts/.*\.py$|pyproject\.toml$)'
```
````

Run `cs-backend-engineer` (Python-capable) if **any** of the following is true:

1. The current branch diff touches `listen/*.py`, `bridge/*.ts`, `scripts/*.py`, or `pyproject.toml`
2. `$ARGUMENTS` is empty AND the last 20 commits touched any of those files
3. `$ARGUMENTS` is a path under `listen/`, `bridge/`, or `scripts/`
4. The user explicitly passed `--python` or `--backend` as an argument

### Conditional agent 4: Observability reviewer (force-specific)

```bash
echo "$CHANGED_FILES" | grep -E '(listen/server\.py$|listen/worker\.py$|scripts/log-.*\.py$|scripts/sync-fallback\.py$|bridge/notifier\.ts$)'
```

Run `cs-observability-engineer` if **any** of the following is true:

1. The current branch diff touches force's audit logging, fallback sync, or notification paths
2. `$ARGUMENTS` is empty AND the last 20 commits touched those files
3. The user explicitly passed `--observability` as an argument

**Force-specific note:** These two conditional agents do NOT exist in LBP's copy of `/review.code`. They are specific to force's Python infrastructure (the `listen/` job server, `bridge/` Telegram dispatcher, `scripts/` utilities). Do NOT propagate these agents to LBP — LBP has no equivalent code paths.

````

### 2c. Add Agent 7 and Agent 8 spawn blocks

Add these after Agent 6 (Theme Package Validation) and before the `## Step 3: Wait for Agents and Aggregate` section.

```markdown
---

### Agent 7 (Conditional, force-specific): Python Backend Review

**Only launch this agent if Step 1.4 set the Python backend flag.** Otherwise skip entirely.

When launched, include this agent in the **same single message** as the other active agents.

````

Task tool parameters:
description: "Python/backend review"
subagent_type: "cs-backend-engineer"
run_in_background: true

```

**Prompt for the agent:**

> You are reviewing force's Python/TypeScript backend infrastructure as part of a parallel code review. Force is a personal AI orchestration system — a FastAPI job queue (`listen/server.py`), a worker process (`listen/worker.py`), and a Telegram bridge (`bridge/`). This review focuses on backend correctness: async safety, subprocess handling, error propagation, queue semantics, and type correctness in TypeScript bridge code.
>
> **Step 1: Read the project standards**
>
> - `/Users/rickywilson/Sites/force/GOVERNANCE.md` — read §1 (capability tiers), §3 (cost governor), §6 (audit trail), §7 (security rules), §8 (queue execution model)
> - `/Users/rickywilson/Sites/force/.claude/CLAUDE.md` — read the rules section
> - `/Users/rickywilson/Sites/force/CLAUDE.md` — read the cross-repo interaction model
>
> **Step 2: Review these areas**
>
> - `listen/server.py` — FastAPI route correctness, async queue handling, sequential job execution (must not violate §8), proper shutdown, error paths
> - `listen/worker.py` — subprocess invocation of Claude Code, workflow file loading, model resolution (must not hardcode model names per §9), audit logging
> - `bridge/telegram-listener.ts` — grammy usage, allowlist enforcement, async handler correctness
> - `bridge/classifier.ts` — intent classification, prompt injection awareness (§7)
> - `bridge/notifier.ts` — outbound Telegram API handling, retry logic
> - `scripts/db.py` — Supabase REST wrapper, .jsonl fallback correctness
> - `scripts/sync-fallback.py` — retry logic for failed writes
> - `pyproject.toml` — dependency versions, Python version pin
>
> **Governance compliance checks (non-negotiable):**
>
> - No code path must bypass the sequential queue in `listen/server.py`. Any concurrent job execution is a §8 violation and is a CRITICAL finding.
> - No workflow prompt or worker code may reference model names directly. All model resolution must go through `model-config.json`. A hardcoded model name is a §9 violation.
> - All external input (Telegram messages, file contents from target repos, API responses) must be treated as untrusted per §7.
> - Audit log entries must include all required fields per §6.
>
> **Step 3: Write findings**
>
> Write to `output/sessions/YYYY-MM-DD_code-review/findings-backend.md` using the standard findings format used by the other review agents. Number findings `BE-001`, `BE-002`, etc. If a finding is a GOVERNANCE violation, mark it CRITICAL regardless of what the general severity scale would suggest.
>
> **Scope rule:** Do NOT review the Claude workflow prompts themselves (`workflows/w1-*.md`). Those are reviewed separately by `/review.workflows` which uses `cs-prompt-engineer`. This review is about the Python/TypeScript infrastructure only.

---

### Agent 8 (Conditional, force-specific): Observability Review

**Only launch this agent if Step 1.4 set the observability flag.** Otherwise skip entirely.

```

Task tool parameters:
description: "Observability review"
subagent_type: "cs-observability-engineer"
run_in_background: true

```

**Prompt for the agent:**

> You are reviewing force's observability posture as part of a parallel code review. Force runs unattended overnight — any failure that is not detected, logged, or reported to the user via Telegram is a major problem. This review focuses on audit trail completeness, log structure, metric coverage, alerting, and debugability.
>
> **Step 1: Read the project standards**
>
> - `/Users/rickywilson/Sites/force/GOVERNANCE.md` — especially §6 (Audit Trail)
> - `/Users/rickywilson/Sites/force/STATUS.md` — current observability state
>
> **Step 2: Review these areas**
>
> - `listen/server.py` — are all job state transitions logged? Are logs structured (JSON) or unstructured?
> - `listen/worker.py` — is every Claude Code subprocess invocation logged with model tier, turn count, cost estimate, outcome?
> - `scripts/log-job-*.py` — audit log helpers. Do they cover all required §6 fields?
> - `scripts/db.py` — Supabase write path + `.jsonl` fallback. Is the fallback path itself monitored? Silent fallback to `.jsonl` is an observability gap.
> - `scripts/sync-fallback.py` — retry loop. Does it log failures? Does it alert the user if sync is persistently failing?
> - `bridge/notifier.ts` — outbound Telegram. Are notification failures logged and retried? Silent notification failures are a CRITICAL observability gap because force has no other user-facing communication channel.
>
> **Key questions:**
>
> 1. If a job fails in a way the code doesn't anticipate, how does Ricky find out? (If the answer is "he doesn't", that is a CRITICAL finding.)
> 2. If Supabase is down for an hour, what does force do? Does it degrade gracefully, and does anyone know?
> 3. Are there metrics (job counts, success rate, cost, turn count distribution) being captured anywhere queryable?
> 4. What does a debug session look like after a failed overnight run? What logs would you read?
>
> **Step 3: Write findings**
>
> Write to `output/sessions/YYYY-MM-DD_code-review/findings-observability.md` using the standard findings format. Number findings `OBS-001`, `OBS-002`, etc.

---
```

### 2d. Update the aggregation file list

Find the section in force's `review.code.md` that lists the findings files to aggregate. Add the two new conditional ones:

```markdown
- `findings-backend.md` (only if the conditional Agent 7 was launched in Step 2)
- `findings-observability.md` (only if the conditional Agent 8 was launched in Step 2)
```

### 2e. Update the Executive Summary table columns

Find the Executive Summary table in the aggregated report section and add two new conditional columns for Backend and Observability. Use the same "conditional column" pattern established for Vercel Config and Theme Package — include the column only if the agent actually ran.

### 2f. Update force's `just sync-skills` to EXCLUDE review.code.md

```bash
cd /Users/rickywilson/Sites/force
```

Read the current `just sync-skills` recipe. Find the `SHARED_SKILLS` bash array. Remove `review.code.md` from it, and add a comment block explaining why.

Before the array:

```bash
    # Skills synced from LBP (byte-identical copies)
    #
    # NOTE: review.code.md is NOT in this list. Force maintains a customized
    # version that adds conditional agents for Python backend review
    # (cs-backend-engineer) and observability review (cs-observability-engineer)
    # when listen/*.py, bridge/*.ts, or scripts/*.py files are in scope. These
    # agents are force-specific and have no equivalent in LBP.
    #
    # If you need to pick up changes from LBP's review.code.md, do a manual
    # 3-way merge — do NOT add it back to this sync list.
```

And the `SHARED_SKILLS` array should have 7 entries now, not 8:

```bash
    SHARED_SKILLS=(
      "brief.me.md"
      "deploy.changes.md"
      "fix.findings.md"
      "plan.to.yolo.md"
      "plan.with.codex.md"
      "review.fix.deploy.md"
      "update.docs.md"
    )
```

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails

# Force review.code has the new agents
grep -q "cs-backend-engineer" /Users/rickywilson/Sites/force/.claude/commands/review.code.md
grep -q "cs-observability-engineer" /Users/rickywilson/Sites/force/.claude/commands/review.code.md
grep -q "Agent 7" /Users/rickywilson/Sites/force/.claude/commands/review.code.md
grep -q "Agent 8" /Users/rickywilson/Sites/force/.claude/commands/review.code.md
grep -q "findings-backend.md" /Users/rickywilson/Sites/force/.claude/commands/review.code.md
grep -q "findings-observability.md" /Users/rickywilson/Sites/force/.claude/commands/review.code.md

# Force review.code references GOVERNANCE by section number
grep -q "§8" /Users/rickywilson/Sites/force/.claude/commands/review.code.md
grep -q "§6" /Users/rickywilson/Sites/force/.claude/commands/review.code.md

# Force just sync-skills NO LONGER includes review.code.md in the array
! grep -A 20 'SHARED_SKILLS=' /Users/rickywilson/Sites/force/justfile | grep -q '"review.code.md"'

# Force just sync-skills has the explanation comment
grep -q "review.code.md is NOT in this list" /Users/rickywilson/Sites/force/justfile

# The customized force review.code MUST NOT reference LBP-specific code paths
! grep -q 'sites/[^/]*/vercel\.json' /Users/rickywilson/Sites/force/.claude/commands/review.code.md
! grep -q 'packages/themes/' /Users/rickywilson/Sites/force/.claude/commands/review.code.md
```

**Commit** (in force repo — same feature branch as Phase 1's force commit, `feature/orchestration-patterns-sync`):

```bash
cd /Users/rickywilson/Sites/force
git add .claude/commands/review.code.md justfile
git commit -m "$(cat <<'EOF'
feat(skills): customize /review.code for force Python/observability

Add conditional Agent 7 (cs-backend-engineer) and Agent 8
(cs-observability-engineer) that activate when listen/*.py,
bridge/*.ts, or scripts/*.py are in scope. These are force-specific
and have no equivalent in LBP.

Agent 7 reviews backend correctness with specific GOVERNANCE §6, §8,
§9 compliance checks (audit trail, sequential queue, model routing).
Agent 8 reviews observability posture — audit trail completeness,
notification failure handling, Supabase fallback visibility.

ALSO: Remove review.code.md from the just sync-skills list so future
syncs do not overwrite the customization. Added an explanatory
comment block in the justfile.

This is the first legitimate divergence from the "force skills are
byte-identical copies of LBP" rule. All other shared skills continue
to sync normally.

Part of the pipeline parallelization plan (item F4).

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"

# Return to LBP working copy
cd /Users/rickywilson/Sites/local-business-platform
```

---

## Phase 3 — Document the divergence in LBP's orchestration patterns guide

**Goal:** Add a note to `docs/guides/orchestration-patterns.md` in LBP documenting that force's `/review.code` has diverged and listing the reason. This keeps institutional memory in the doc that both repos reference.

**Model:** sonnet.

**Files:** `/Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md`

**Changes:** Find the "Cross-repo note" section added by Brief A. Replace or extend it with a paragraph documenting F4:

```markdown
### Force-specific divergences

Force maintains byte-identical copies of 7 of the 8 shared skills. The one exception is `/review.code`, which force customizes to add two conditional agents:

- **Agent 7: `cs-backend-engineer`** — triggered by changes to `listen/*.py`, `bridge/*.ts`, or `scripts/*.py`. Reviews force's FastAPI job server, TypeScript bridge, and Python utility scripts for backend correctness, async safety, and GOVERNANCE §6/§8/§9 compliance.
- **Agent 8: `cs-observability-engineer`** — triggered by changes to audit logging, fallback sync, or notification paths. Reviews force's observability posture — whether failures are logged, whether notification failures are retried, whether the Supabase/.jsonl fallback is itself monitored.

These agents are force-specific and have no equivalent in LBP because LBP has no Python infrastructure and different failure modes. LBP's `/review.code` still has Agents 1-6 (security, code quality, a11y/SEO, architecture, conditional Vercel config, conditional theme package).

The divergence is protected by force's `just sync-skills` target, which explicitly excludes `review.code.md` from the sync list.
```

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
grep -q "Force-specific divergences" /Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md
grep -q "cs-backend-engineer" /Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md
grep -q "cs-observability-engineer" /Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md
pnpm lint
```

**Commit** (in LBP, same feature branch as Phase 1's LBP commit):

```bash
cd /Users/rickywilson/Sites/local-business-platform
git add docs/guides/orchestration-patterns.md
git commit -m "$(cat <<'EOF'
docs(guides): document force /review.code divergence

Adds a "Force-specific divergences" subsection to the orchestration
patterns guide, explaining that force's /review.code has two
additional conditional agents (cs-backend-engineer and cs-observability-
engineer) that do not exist in LBP. The divergence is protected by
force's just sync-skills target.

Part of the pipeline parallelization plan (item F4 documentation).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Re-run sync-skills to propagate the updated orchestration-patterns doc

**Goal:** Now that the LBP doc has been updated in Phase 3, run `just sync-skills` in force to pull the latest version. This confirms the sync mechanism actually works end-to-end.

**Model:** sonnet — mechanical verification step.

```bash
cd /Users/rickywilson/Sites/force
just sync-skills
```

Confirm the output shows the doc was either updated or already in sync.

**Important:** The sync-skills target now has two commits' worth of changes in it since it was first created in Brief A Phase 2 — Brief A added the initial 8-skill sync, Brief E Phase 1 added the orchestration doc sync, and Brief E Phase 2 removed `review.code.md` from the skill list. All three changes are in the justfile. Running `just sync-skills` should:

1. Skip `review.code.md` (not in the list)
2. Sync the other 7 shared skills (no-op if already in sync)
3. Sync `orchestration-patterns.md` (update because Phase 3 just edited it)

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/force

# Docs are now in sync between repos
diff -q /Users/rickywilson/Sites/local-business-platform/docs/guides/orchestration-patterns.md /Users/rickywilson/Sites/force/docs/guides/orchestration-patterns.md

# Force has the force-specific customization of review.code (was NOT overwritten)
grep -q "cs-backend-engineer" /Users/rickywilson/Sites/force/.claude/commands/review.code.md
grep -q "cs-observability-engineer" /Users/rickywilson/Sites/force/.claude/commands/review.code.md
```

If the sync updated the doc, there will be uncommitted changes in force's `docs/guides/orchestration-patterns.md`. Commit them:

```bash
# Only if sync produced changes
if ! git diff --quiet docs/guides/orchestration-patterns.md; then
  git add docs/guides/orchestration-patterns.md
  git commit -m "$(cat <<'EOF'
docs(sync): update orchestration-patterns from LBP

Sync run picked up the Force-specific divergences section added in
LBP feature/pipeline-upgrades-e Phase 3.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
  )"
fi

# Return to LBP
cd /Users/rickywilson/Sites/local-business-platform
```

---

## Phase 5 — Build verification

**Goal:** Confirm nothing in LBP broke.

```bash
pnpm type-check
pnpm lint
pnpm build
```

**Verification gate — STOP if this fails:**

```bash
# Verification gate — STOP if this fails
pnpm type-check
pnpm lint
pnpm build
```

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase      | Items                                                                                                                                                                                                                                        | File overlap | Model | Rationale                                                               |
| ----- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----- | ----------------------------------------------------------------------- |
| G1    | Pre-flight | All 5 dependency-check bash commands                                                                                                                                                                                                         | none         | n/a   | Independent file existence + grep checks; batch in one message          |
| G2    | Phase 1    | Read `docs/guides/orchestration-patterns.md`, Read `force/justfile`, Read `force/.claude/CLAUDE.md`                                                                                                                                          | none         | n/a   | 3 independent reads to ground the phase                                 |
| G3    | Phase 2    | Read `force/.claude/commands/review.code.md`, Read `force/GOVERNANCE.md`, Read `force/.claude/CLAUDE.md`, Read `force/listen/server.py`, Read `force/listen/worker.py`, Read `force/bridge/telegram-listener.ts`, Read `force/scripts/db.py` | none         | n/a   | 7 independent reads to ground the F4 customization in actual force code |
| G4    | Phase 5    | Run `pnpm type-check`, Run `pnpm lint`                                                                                                                                                                                                       | none         | n/a   | Independent checks; `pnpm build` runs alone after                       |

### Cross-phase groups

**None.** Phases are sequential because they commit across two repos and must maintain a clean history.

### Sequential points — MUST NOT parallelise

| Item                                      | Reason                                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- |
| Pre-flight → Phase 1                      | Pre-flight gates the whole brief. If it fails, stop.                                        |
| Phase 1 LBP commit → Phase 1 force commit | Different repos, different branches                                                         |
| Phase 1 → Phase 2                         | Phase 1 extends sync-skills; Phase 2 then further modifies sync-skills. Must be sequential. |
| Phase 2 → Phase 3                         | Phase 3 documents the Phase 2 divergence. Doc must describe committed state.                |
| Phase 3 → Phase 4                         | Phase 4 syncs the doc that Phase 3 just wrote.                                              |
| `pnpm build` in Phase 5                   | Writes `.next/` and `dist/` — must run alone                                                |

---

## Cost Estimate

| Phase                                                   | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Pre-flight + Phase 1 (doc + justfile + force CLAUDE.md) | opus   | ~15k              | ~3k                | $0.15      |
| Phase 2 (force /review.code customization)              | opus   | ~25k              | ~8k                | $0.33      |
| Phase 3 (divergence doc note)                           | sonnet | ~8k               | ~2k                | $0.06      |
| Phase 4 (sync + verify)                                 | sonnet | ~6k               | ~1k                | $0.03      |
| Phase 5 (build verify)                                  | opus   | ~6k               | ~1k                | $0.06      |
| **Total**                                               |        | **~60k**          | **~15k**           | **~$0.63** |

---

## Final Report

After all phases complete:

1. Phases completed — list each with commit SHA. Note: commits span TWO repos (LBP and force).
2. Divergence count — confirm force's `/review.code` now has Agents 7 and 8 and that `just sync-skills` excludes it
3. Doc sync verification — confirm the orchestration-patterns doc is byte-identical between repos
4. Build status — confirm LBP `pnpm lint && pnpm type-check && pnpm build` passes
5. Force state — report that force's `feature/orchestration-patterns-sync` branch is ready for review and merge
6. Any exceptions or intentional deviations
7. Token usage and cost vs estimate

## Update Session File

Append to this brief file:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: whether the divergence wiring went cleanly, any force codebase reads that revealed surprises, confirmation that GOVERNANCE §8 was not touched]

### Commits

- LBP `feature/pipeline-upgrades-e` / Phase 1: [SHA] — cross-repo doc note
- force `feature/orchestration-patterns-sync` / Phase 1: [SHA] — justfile + doc sync + CLAUDE.md
- force `feature/orchestration-patterns-sync` / Phase 2: [SHA] — /review.code customization + sync exclusion
- LBP `feature/pipeline-upgrades-e` / Phase 3: [SHA] — divergence doc note
- force `feature/orchestration-patterns-sync` / Phase 4: [SHA or skipped] — resync doc

### Branches left uncommitted-upstream

- LBP: `feature/pipeline-upgrades-e` — ready for review and merge to develop
- force: `feature/orchestration-patterns-sync` — ready for review and merge to develop
```

## Rules

- STOP on any failed verification gate — do not continue to next phase
- **STOP on any failed pre-flight check.** Brief A MUST have completed first. Do not try to work around a missing dependency.
- **Do NOT modify force/GOVERNANCE.md under any circumstances.** It is read-only.
- **Do NOT propagate LBP's worktree decision rule to force.** The LBP rule is scoped to LBP only; force has §8.
- **Do NOT add Agents 7 or 8 to LBP's `/review.code`.** They are force-specific.
- **Consult the `## Parallel execution groups` section** — the reads in pre-flight, Phase 1, Phase 2, and Phase 5 can batch.
- Never push — leave all changes on feature branches in BOTH repos
- This brief touches BOTH repos. Be vigilant about `cd` — after every commit, confirm the working directory with `pwd`.
- Minimal changes only — implement what the brief says, nothing more
- Force's Python/TypeScript code is read in Phase 2 to ground the agent prompts — do NOT modify any of that code. Read-only references only.
- The Co-Authored-By line in commits must reflect the model used (opus for Phases 1, 2, 5; sonnet for Phases 3, 4).

---

## Terminal command to launch this brief

```
claude --dangerously-skip-permissions --model opus -p "Read output/sessions/2026-04-10_pipeline-upgrades/E-cross-repo-sync.md in full, confirm the pre-flight dependency check passes, then implement every phase it describes exactly as written."
```
