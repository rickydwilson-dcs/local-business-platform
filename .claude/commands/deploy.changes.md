# Deploy

Push all committed changes through the full git workflow: develop → staging → main.

**This skill runs `/update.docs` first** to verify documentation is accurate before deploying.

## Steps

### Step 1: Verify Documentation

Run the `/update.docs` verification. If issues are found, fix them and commit to develop before proceeding.

### Step 2: Verify Branch State

```bash
# Must be on develop branch
git branch --show-current

# Must have no uncommitted changes
git status

# Must be ahead of remote or in sync
git log origin/develop..HEAD --oneline
```

If not on develop, STOP and inform the user. Never push from the wrong branch.

### Step 3: Push to Develop

```bash
git push origin develop
```

Wait for CI to pass:

```bash
gh run watch
```

If CI fails, STOP. Diagnose the failure, fix it, commit to develop, and restart from Step 3.

### Step 4: Merge to Staging

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

### Step 5: Merge to Main

```bash
git checkout main
git merge staging
git push origin main
```

Wait for CI:

```bash
gh run watch
```

### Step 6: Return to Develop

```bash
git checkout develop
```

### Step 7: Report

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
