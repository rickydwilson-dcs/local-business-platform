# Deploy

Commit (if needed) and push all changes through the full git workflow: develop → staging → main.

**This skill runs `/update.docs` first** to verify documentation is accurate before deploying.

## Steps

### Step 1: Verify Branch

```bash
git branch --show-current
```

Must be on `develop`. If not, STOP and inform the user. Never push from the wrong branch.

### Step 2: Verify Documentation

Run the `/update.docs` verification. If issues are found, fix them before proceeding (they'll be included in the commit).

### Step 3: Pre-commit Verification — parallel + sequential

Pre-commit verification runs in two groups:

- **Group 3a (parallel, read-only):** type-check, lint, and Vercel config audit run concurrently. Each is independent and does not write files.
- **Group 3b (sequential, write-side-effects):** build and test run sequentially AFTER Group 3a passes. These have filesystem side effects and must not run in parallel.

If anything in Group 3a fails, STOP — do not proceed to Group 3b.
If anything in Group 3b fails, STOP — do not commit broken code.

#### Group 3a — Parallel read-only checks

Launch these three checks in parallel. Type-check and lint are bash commands that run independently; the Vercel config audit is a Task-tool sub-agent invocation. **All three must be launched together — use a single message with parallel Bash calls for type-check and lint, and the Task call for the audit agent, so Claude Code runs them concurrently.**

##### Check 3a-i: TypeScript check

```bash
pnpm type-check
```

##### Check 3a-ii: Lint

```bash
pnpm lint
```

##### Check 3a-iii: Vercel config audit

Spawn `cs-vercel-config-auditor` via the Task tool:

```
Task tool parameters:
  description: "Pre-deploy Vercel config audit"
  subagent_type: "cs-vercel-config-auditor"
```

**Prompt for the agent:**

> You are running a pre-deploy audit of the local-business-platform monorepo for Vercel / Next.js / Turborepo configuration issues.
>
> **Scope:** Full audit. Run all applicable rules (VCA-001 through VCA-009).
>
> **Session directory:** If `output/sessions/YYYY-MM/YYYY-MM-DD_deploy/` already exists (today's date), write into it. Otherwise, create `output/sessions/YYYY-MM/YYYY-MM-DD_deploy/` and write findings there.
>
> **Output file:** `output/sessions/YYYY-MM/YYYY-MM-DD_deploy/findings-vercel-config.md`
>
> Follow the review procedure in your agent definition exactly. Do NOT modify any files — this is a read-only audit. Report all findings with severity per the mapping table.
>
> **Return:** The Statistics line from your findings file (format: `Critical: N | High: N | Medium: N | Low: N | Total: N`) so the orchestrator can decide whether to proceed.

##### Group 3a aggregation

Wait for all three checks to complete. Then:

1. If `pnpm type-check` failed, STOP and report the error. Do not continue.
2. If `pnpm lint` failed, STOP and report the error.
3. Read the Statistics line from `output/sessions/YYYY-MM/YYYY-MM-DD_deploy/findings-vercel-config.md`. If `Critical + High > 0`:
   - Print the full findings file
   - Tell the user: "Vercel config audit blocked the deploy. See `output/sessions/YYYY-MM/YYYY-MM-DD_deploy/findings-vercel-config.md`. Fix the Critical/High findings and re-run `/deploy.changes`."
   - Do NOT proceed to Group 3b.
4. If Group 3a passed entirely (possibly with Medium/Low Vercel warnings), continue to Group 3b. Note any warnings in the final report.

#### Group 3b — Sequential write-side-effect checks

These run ONLY if Group 3a passed. They run sequentially because each writes files (`.next/`, `dist/`, node_modules cache) and parallel execution causes filesystem races.

```bash
pnpm build
```

If build fails, STOP.

```bash
pnpm test
```

If test scripts are available and test fails, STOP.

Only proceed to committing once both Group 3a and Group 3b have passed.

### Step 4: Commit if Needed

```bash
git status --porcelain
```

If there are uncommitted changes (staged or unstaged):

1. Stage all changes: `git add -A`
2. Review what's staged with `git diff --cached --stat`
3. Generate a commit message that summarizes the changes. Use a HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
[summary of changes]

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

If the working tree is already clean, check there are commits ahead of remote:

```bash
git log origin/develop..HEAD --oneline
```

If nothing to commit AND nothing ahead of remote, STOP: "Nothing to deploy."

### Step 5: Push to Develop

```bash
git push origin develop
```

Wait for CI to pass:

```bash
gh run watch
```

If CI fails, STOP. Diagnose the failure, fix it, commit to develop, and restart from Step 5.

### Step 6: Merge to Staging

```bash
git checkout staging
git merge develop
git push origin staging
```

Wait for CI:

```bash
gh run watch
```

If CI fails, STOP and diagnose. Do not proceed to main with failing CI.

### Step 7: Merge to Main

```bash
git checkout main
git merge staging
git push origin main
```

Wait for CI:

```bash
gh run watch
```

### Step 8: Return to Develop

```bash
git checkout develop
```

### Step 9: Report

Report the final state:

- Commit SHA deployed to main
- CI status for all three branches
- Any issues encountered

## Rules

- **NEVER skip a branch** — always go develop → staging → main
- **NEVER force push** to any branch
- **NEVER proceed** if CI is failing
- If any step fails, STOP and inform the user with the error details
- Always return to the develop branch when done
- **Pre-flight checks run in two groups** — Group 3a (parallel read-only) and Group 3b (sequential write-side-effect). Do not serialise Group 3a or parallelise Group 3b.
