# 🚨 URGENT: Fix Branch Protection - Remove Legacy "Build Test"

## Problem

Your staging branch (and possibly others) has a **legacy status check** that no longer exists:

- ❌ `Build Test` - This workflow job no longer exists
- ✅ `Quality Checks` - This is correct and includes the build

## Impact

- GitHub is waiting for a check that will never complete
- May block merges unnecessarily
- Causes confusion in CI status

## Fix Now (2 minutes)

### Step 1: Go to Branch Settings

Visit: https://github.com/rickydwilson-dcs/colossus-scaffolding/settings/branches

### Step 2: Fix Each Branch

For **each branch** (develop, staging, main):

1. Click **"Edit"** on the branch rule
2. Scroll to **"Require status checks to pass before merging"**
3. In the search box where it shows required checks:
   - ❌ **REMOVE** `Build Test` (if present)
   - ✅ **KEEP** `Quality Checks`
   - ✅ **ADD** `Smoke Tests (Fast)` (if not already there)
4. Click **"Save changes"**

### Step 3: Verify

Run this command to verify:

```bash
# Check staging (example)
gh api repos/rickydwilson-dcs/colossus-scaffolding/branches/staging/protection/required_status_checks --jq '.contexts'

# Expected output:
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
