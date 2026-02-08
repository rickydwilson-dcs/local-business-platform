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

### Step 3: Pre-commit Verification

Before committing anything, verify the codebase is healthy:

```bash
pnpm type-check && pnpm lint && pnpm build
```

If any step fails, STOP. Report the failure and do NOT commit broken code. The user should fix the issue first.

If there are test scripts available, also run:

```bash
pnpm test
```

Only proceed to committing once all verification passes.

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
