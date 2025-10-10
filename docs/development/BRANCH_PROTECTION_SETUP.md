# Branch Protection Setup Guide

This guide provides step-by-step instructions for configuring GitHub branch protection rules to enforce quality gates.

## Why Branch Protection?

Branch protection ensures:

- ✅ Tests must pass before merging/promoting
- ✅ Prevents accidental force pushes
- ✅ Enforces code review on production
- ✅ Maintains consistent deployment quality

---

## Configuration Steps

### Prerequisites

1. You need **Admin** access to the repository
2. Navigate to: `https://github.com/rickydwilson-dcs/colossus-scaffolding/settings/branches`

---

## Branch: `develop`

### Settings

1. Click **"Add rule"** or edit existing `develop` rule
2. Branch name pattern: `develop`

### Required Status Checks

✅ **Enable:** Require status checks to pass before merging

- ✅ Require branches to be up to date before merging
- **Add required checks:**
  - `Quality Checks`
  - `Smoke Tests (Fast)`

### Additional Settings

- ✅ **Require linear history** (optional but recommended)
- ❌ **Do not require pull requests** (we use direct push workflow)
- ✅ **Do not allow bypassing the above settings** (enforce for admins)
- ✅ **Restrict who can push to matching branches** (optional - add team/users)

### Rules Summary

```
Branch: develop
├── Require status checks: YES
│   ├── Quality Checks (required)
│   └── Smoke Tests (Fast) (required)
├── Require branches up-to-date: YES
├── Require pull requests: NO (direct push allowed)
├── Allow force push: NO
└── Enforce for administrators: YES
```

---

## Branch: `staging`

### Settings

1. Click **"Add rule"** for `staging`
2. Branch name pattern: `staging`

### Required Status Checks

✅ **Enable:** Require status checks to pass before merging

- ✅ Require branches to be up to date before merging
- **Add required checks:**
  - `Quality Checks`
  - `Smoke Tests (Fast)`

### Additional Settings

- ✅ **Require linear history** (optional but recommended)
- ❌ **Do not require pull requests** (we use direct push workflow)
- ✅ **Do not allow bypassing the above settings**
- ✅ **Restrict who can push to matching branches** (optional)

### Rules Summary

```
Branch: staging
├── Require status checks: YES
│   ├── Quality Checks (required)
│   └── Smoke Tests (Fast) (required)
├── Require branches up-to-date: YES
├── Require pull requests: NO (direct push allowed)
├── Allow force push: NO
└── Enforce for administrators: YES
```

---

## Branch: `main` (Production)

### Settings

1. Click **"Add rule"** for `main`
2. Branch name pattern: `main`

### Required Status Checks

✅ **Enable:** Require status checks to pass before merging

- ✅ Require branches to be up to date before merging
- **Add required checks:**
  - `Quality Checks`
  - `Smoke Tests (Fast)`
  - `Performance Baseline` (add this after Phase 3)

### Additional Settings

- ❌ **Do NOT require pull requests** (sole deployer - cannot self-approve)
- ✅ **Require linear history** (optional but recommended)
- ✅ **Do not allow bypassing the above settings** (enforce for admins)
- ✅ **Restrict who can push to matching branches** (optional - limit to specific users)

### Rules Summary

```
Branch: main (Production)
├── Require status checks: YES
│   ├── Quality Checks (required)
│   ├── Smoke Tests (Fast) (required)
│   └── Performance Baseline (required - add in Phase 3)
├── Require branches up-to-date: YES
├── Require pull requests: NO (direct push workflow - sole deployer)
├── Allow force push: NO
├── Restrict push access: OPTIONAL (can limit to specific users)
└── Enforce for administrators: YES
```

---

## Verification Checklist

After configuration, verify each branch:

### Test `develop` Branch

```bash
# 1. Try to push with failing tests (should be blocked)
git checkout develop
# Make a change that breaks tests
git commit -am "Test: intentional failure"
git push origin develop
# Expected: Push succeeds locally, CI runs, but merge would be blocked if tests fail

# 2. Verify status checks appear
gh run list --branch develop --limit 1
# Expected: Should show required checks running/completed
```

### Test `staging` Branch

```bash
# 1. Try to merge develop with failing CI (should be blocked by GitHub)
git checkout staging
git merge develop  # If develop CI is failing
git push origin staging
# Expected: GitHub blocks the push with status check error

# 2. Verify with passing CI
# Wait for develop CI to pass, then try again
git push origin staging
# Expected: Push succeeds only if develop CI passed
```

### Test `main` Branch

```bash
# 1. Try to merge staging directly (should require PR)
git checkout main
git merge staging
git push origin main
# Expected: GitHub blocks direct push, requires PR

# 2. Create PR instead
gh pr create --base main --head staging --title "Production Deploy"
# Expected: PR created, shows required status checks
```

---

## Troubleshooting

### Issue: "Required status check not found"

**Cause:** Status check name mismatch between workflow and branch protection

**Solution:**

1. Check workflow job names in `.github/workflows/ci.yml` and `.github/workflows/e2e-tests.yml`
2. Ensure exact match (case-sensitive):
   - `Quality Checks` (from ci.yml)
   - `Smoke Tests (Fast)` (from e2e-tests.yml)

### Issue: "Can't push even though tests passed"

**Cause:** Branch not up-to-date with target branch

**Solution:**

```bash
git checkout develop
git pull origin develop
# Then push
```

### Issue: "Accidentally blocked myself"

**Cause:** Branch protection enforced for administrators

**Solution:**

1. Temporarily disable "Enforce for administrators" in branch settings
2. Complete your push
3. Re-enable enforcement

---

## Current vs. Future State

### Current State (After Phase 1.1)

| Branch  | Push Type | Required Checks | Approval |
| ------- | --------- | --------------- | -------- |
| develop | Direct    | Quality + Smoke | No       |
| staging | Direct    | Quality + Smoke | No       |
| main    | Direct    | Quality + Smoke | No       |

**Note:** All branches use direct push workflow (sole deployer - cannot self-approve PRs)

### Future State (After Phase 3)

| Branch  | Push Type | Required Checks               | Approval |
| ------- | --------- | ----------------------------- | -------- |
| develop | Direct    | Quality + Smoke               | No       |
| staging | Direct    | Quality + Smoke               | No       |
| main    | Direct    | Quality + Smoke + Performance | No       |

---

## Related Documentation

- [DEVELOPMENT.md](DEVELOPMENT.md) - Git workflow and branch structure
- [E2E_TESTING_STRATEGY.md](../testing/E2E_TESTING_STRATEGY.md) - Testing strategy
- [GitHub Docs: Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

---

## Next Steps

After configuring branch protection:

1. ✅ Verify each branch is protected (check settings)
2. ✅ Test with a dummy commit (verify blocking works)
3. ✅ Proceed to Phase 1.2 (Enhanced pre-push hook)

**Status:** Configuration must be done manually via GitHub UI
**Estimated Time:** 10-15 minutes
**Impact:** Immediate enforcement of quality gates
