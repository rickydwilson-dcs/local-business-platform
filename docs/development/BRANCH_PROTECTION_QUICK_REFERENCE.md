# Branch Protection - Quick Reference Card

**Repository:** `rickydwilson-dcs/colossus-scaffolding`
**Settings URL:** https://github.com/rickydwilson-dcs/colossus-scaffolding/settings/branches

---

## Required Status Check Names (EXACT MATCH)

These names must match exactly (case-sensitive):

**All Branches:**

- ✅ `Quality Checks` (includes lint, type-check, tests, build, content validation)
- ✅ `Smoke Tests (Fast)` (E2E smoke tests - 7 tests, ~30s)

**Staging & Main Only (Phase 2):**

- ✅ `Standard E2E Tests (Auto)` (functional tests - 51 tests, ~2-3min)

**Future (Phase 3):**

- ⏳ `Performance Baseline` (add in Phase 3 - main branch only)

### ❌ Remove Old/Legacy Checks

If you see these in existing branch protection, **REMOVE THEM**:

- ❌ `Build Test` (LEGACY - now included in "Quality Checks")
  - Found on: staging, main
  - This check no longer exists in workflows
  - Remove immediately

- ❌ `Deployment Readiness` (LEGACY - removed from workflows)
  - Found on: main
  - This check no longer exists
  - Remove immediately

---

## Quick Setup Checklist

### For `develop` Branch

```
☐ Go to: Settings → Branches → Add rule
☐ Branch name pattern: develop
☐ ✅ Require status checks to pass before merging
☐ ✅ Require branches to be up to date
☐ Add checks: "Quality Checks", "Smoke Tests (Fast)"
☐ ❌ Do NOT require pull requests
☐ ✅ Do not allow force pushes
☐ ✅ Do not allow bypassing (enforce for admins)
☐ Save changes
```

### For `staging` Branch

```
☐ Go to: Settings → Branches → Add rule
☐ Branch name pattern: staging
☐ ✅ Require status checks to pass before merging
☐ ✅ Require branches to be up to date
☐ Add checks: "Quality Checks", "Smoke Tests (Fast)", "Standard E2E Tests (Auto)"
☐ ❌ Do NOT require pull requests
☐ ✅ Do not allow force pushes
☐ ✅ Do not allow bypassing (enforce for admins)
☐ Save changes
```

### For `main` Branch (Production)

```
☐ Go to: Settings → Branches → Add rule
☐ Branch name pattern: main
☐ ✅ Require status checks to pass before merging
☐ ✅ Require branches to be up to date
☐ Add checks: "Quality Checks", "Smoke Tests (Fast)", "Standard E2E Tests (Auto)"
☐ ❌ Do NOT require pull requests (sole deployer - cannot self-approve)
☐ ✅ Do not allow force pushes
☐ ✅ Do not allow bypassing (enforce for admins)
☐ ⚪ Restrict who can push (optional)
☐ Save changes
```

**Note:** All three branches use the **same direct push workflow** since you're the sole deployer.

---

## Verification Commands

After setup, run these to verify:

```bash
# Check if branch protection is working
gh api repos/rickydwilson-dcs/colossus-scaffolding/branches/develop/protection

# View protected branches
gh api repos/rickydwilson-dcs/colossus-scaffolding/branches --jq '.[].name + " (protected: " + (.protected|tostring) + ")"'

# Check required status checks for develop
gh api repos/rickydwilson-dcs/colossus-scaffolding/branches/develop/protection/required_status_checks --jq '.contexts'
```

Expected output for develop:

```json
["Quality Checks", "Smoke Tests (Fast)"]
```

Expected output for staging/main (Phase 2):

```json
["Quality Checks", "Smoke Tests (Fast)", "Standard E2E Tests (Auto)"]
```

---

## Test the Protection

```bash
# 1. Make a trivial change
echo "# Test" >> README.md
git add README.md
git commit -m "Test: branch protection"

# 2. Push to develop
git push origin develop

# 3. Watch CI run
gh run watch

# 4. Verify protection works
# - If tests fail, GitHub should block merges
# - If tests pass, merges should proceed
```

---

## What Happens When Tests Fail?

### On `develop` or `staging`:

- ❌ Push succeeds (code uploaded)
- ❌ CI runs and fails
- ❌ Branch shows red X in GitHub
- ⚠️ **Merge to next environment is BLOCKED by GitHub**
- ✅ You must fix locally and push again

### On `main`:

- ❌ Cannot push directly (PR required)
- ❌ PR shows failing checks
- ❌ "Merge" button is disabled
- ⚠️ **Cannot merge until checks pass**
- ✅ Approvals don't override failing tests

---

## Emergency Override (Use Sparingly!)

If you absolutely must bypass (not recommended):

1. Go to branch protection settings
2. Temporarily uncheck "Include administrators"
3. Complete your action
4. **IMMEDIATELY** re-enable enforcement
5. Document why in commit message

**Note:** This defeats the purpose of quality gates. Use only for genuine emergencies.

---

## Completion Checklist

- [ ] All 3 branches configured (develop, staging, main)
- [ ] Status check names exactly match workflow names
- [ ] Tested with dummy commit (verified blocking works)
- [ ] Documented completion in commit message
- [ ] Proceeded to Phase 1.2

---

**Status:** Manual configuration required via GitHub UI
**Time:** 10-15 minutes
**Next:** Phase 1.2 - Enhanced pre-push hook
