# 🚨 URGENT: Fix Branch Protection - Remove Legacy Checks

## Problem - Current State

**✅ develop:** Correct (already fixed)

```
- Quality Checks
- Smoke Tests (Fast)
```

**❌ staging:** Has 1 legacy check

```
- Quality Checks ✅
- Build Test ❌ REMOVE THIS
- Smoke Tests (Fast) (needs to be added)
```

**❌ main:** Has 2 legacy checks

```
- Quality Checks ✅
- Build Test ❌ REMOVE THIS
- Deployment Readiness ❌ REMOVE THIS
- Smoke Tests (Fast) (needs to be added)
```

### Legacy Checks (No Longer Exist)

- ❌ `Build Test` - Consolidated into "Quality Checks"
- ❌ `Deployment Readiness` - No longer exists in workflows

## Impact

- GitHub is waiting for checks that will never complete
- Blocks merges unnecessarily
- Causes confusion in CI status
- Wastes time debugging phantom failures

## Fix Now (2 minutes)

### Step 1: Go to Branch Settings

Visit: https://github.com/rickydwilson-dcs/colossus-scaffolding/settings/branches

### Step 2: Fix staging Branch

1. Click **"Edit"** on the `staging` branch rule
2. Scroll to **"Require status checks to pass before merging"**
3. In the search box where it shows required checks:
   - ❌ **REMOVE** `Build Test`
   - ✅ **KEEP** `Quality Checks`
   - ✅ **ADD** `Smoke Tests (Fast)`
4. Click **"Save changes"**

### Step 3: Fix main Branch

1. Click **"Edit"** on the `main` branch rule
2. Scroll to **"Require status checks to pass before merging"**
3. In the search box where it shows required checks:
   - ❌ **REMOVE** `Build Test`
   - ❌ **REMOVE** `Deployment Readiness`
   - ✅ **KEEP** `Quality Checks`
   - ✅ **ADD** `Smoke Tests (Fast)`
4. Click **"Save changes"**

### Step 4: Leave develop Alone

✅ **develop is already correct** - no changes needed

### Step 5: Verify All Branches

Run these commands to verify the fix:

```bash
# Check develop (should already be correct)
gh api repos/rickydwilson-dcs/colossus-scaffolding/branches/develop/protection/required_status_checks --jq '.contexts'

# Check staging (after your fix)
gh api repos/rickydwilson-dcs/colossus-scaffolding/branches/staging/protection/required_status_checks --jq '.contexts'

# Check main (after your fix)
gh api repos/rickydwilson-dcs/colossus-scaffolding/branches/main/protection/required_status_checks --jq '.contexts'

# All three should return:
# [
#   "Quality Checks",
#   "Smoke Tests (Fast)"
# ]
```

## Correct Configuration

### All Branches Should Have:

- ✅ `Quality Checks` - Includes lint, type-check, unit tests, **build**, content validation
- ✅ `Smoke Tests (Fast)` - E2E smoke tests (7 tests, ~3min)

### Main Branch Only (Phase 3):

- ⏳ `Performance Baseline` - Will be added later

## Why This Happened

The `Build Test` was an old workflow job name that was consolidated into `Quality Checks` to reduce redundancy. The branch protection wasn't updated when workflows changed.

---

**After fixing, delete this file:**

```bash
git rm URGENT_BRANCH_PROTECTION_FIX.md
git commit -m "Remove urgent fix notice (applied)"
```
