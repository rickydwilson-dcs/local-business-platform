# Deployment Guide

Complete guide for deploying sites in the Local Business Platform.

**Last Updated:** 2025-10-19
**Week:** 4 - Deployment Pipeline

---

## 📋 Overview

We have three deployment tools for different scenarios:

1. **`deploy-site.ts`** - Deploy a single site with pre-checks
2. **`deploy-batch.ts`** - Deploy multiple sites in phased rollout
3. **`rollback.ts`** - Quick rollback to previous version

All tools support `--dry-run` for safe testing before actual deployment.

---

## 🚀 Single Site Deployment

### Basic Usage

```bash
# Deploy to production (from main branch)
tsx tools/deploy-site.ts colossus-reference

# Deploy to staging
tsx tools/deploy-site.ts colossus-reference --env=staging

# Deploy to development
tsx tools/deploy-site.ts colossus-reference --env=development
```

### Options

```bash
--env=<environment>    # Target environment (development, staging, production)
--skip-tests           # Skip pre-deployment smoke tests (emergency use only)
--dry-run              # Show what would happen without deploying
--help                 # Show help message
```

### Pre-Deployment Checks

The tool automatically runs these checks before deploying:

1. ✅ **Site Exists** - Verifies `sites/<site-name>` directory exists
2. ✅ **Git Status** - Warns if uncommitted changes
3. ✅ **Branch Verification** - Warns if on wrong branch for environment
4. ✅ **TypeScript Validation** - Runs `pnpm type-check`
5. ✅ **Production Build** - Runs `pnpm build` to verify it compiles
6. ✅ **E2E Smoke Tests** - Runs 7 smoke tests (unless `--skip-tests`)

### Examples

```bash
# Dry run to see what would happen
tsx tools/deploy-site.ts colossus-reference --dry-run

# Emergency deployment (skip tests)
tsx tools/deploy-site.ts colossus-reference --skip-tests

# Deploy staging environment for testing
tsx tools/deploy-site.ts joes-plumbing-canterbury --env=staging
```

### Expected Output

```
============================================================
🚀 Starting Deployment
============================================================

Site: colossus-reference
Environment: production
Dry Run: No
Skip Tests: No

============================================================
🔍 Verifying Site
============================================================

✅ Site found: sites/colossus-reference

============================================================
🔍 Checking Git Status
============================================================

✅ Working directory is clean

============================================================
🔍 Verifying Branch
============================================================

✅ On correct branch: main

============================================================
🔍 Running TypeScript Validation
============================================================

✅ TypeScript validation passed

============================================================
🔨 Running Production Build
============================================================

✅ Production build successful

============================================================
🧪 Running E2E Smoke Tests
============================================================

✅ Smoke tests passed

============================================================
🚀 Deploying to Vercel (production)
============================================================

✅ Deployment successful!

🌐 URL: https://colossus-reference.vercel.app
⏱️  Duration: 32.5s

============================================================
📊 Deployment Summary
============================================================

Site:        colossus-reference
Environment: production
Status:      ✅ Success
Duration:    58.3s
URL:         https://colossus-reference.vercel.app

============================================================
```

---

## 📦 Batch Deployment

### Basic Usage

```bash
# Deploy all sites in phased rollout
tsx tools/deploy-batch.ts

# Dry run to see deployment plan
tsx tools/deploy-batch.ts --dry-run

# Deploy with tests skipped (emergency)
tsx tools/deploy-batch.ts --skip-tests
```

### Phased Rollout Strategy

The batch deployment automatically follows this strategy:

```
Phase 1: Canary (Internal Site)
  ├─ Deploy colossus-reference first
  ├─ Wait 5 minutes for error monitoring
  └─ If successful, proceed to Phase 2

Phase 2: First Batch (Small - 5 sites)
  ├─ Deploy 5 client sites concurrently
  ├─ Wait 10 minutes for error monitoring
  └─ If successful, proceed to Phase 3

Phase 3: Second Batch (Medium - 10 sites)
  ├─ Deploy 10 client sites concurrently
  ├─ Wait 10 minutes for error monitoring
  └─ If successful, proceed to Phase 4

Phase 4: Remaining Sites (All)
  └─ Deploy all remaining sites concurrently
```

### Options

```bash
--dry-run              # Show deployment plan without deploying
--skip-tests           # Skip smoke tests for all sites
--config=<file>        # Use custom deployment configuration
--help                 # Show help message
```

### Custom Configuration

Create a custom deployment config file:

```json
// custom-deployment.json
{
  "environment": "staging",
  "rollbackOnFailure": true,
  "phases": [
    {
      "name": "Phase 1: Test Sites",
      "sites": ["site-1", "site-2"],
      "waitTimeMinutes": 5,
      "maxConcurrent": 2
    },
    {
      "name": "Phase 2: Production Sites",
      "sites": ["site-3", "site-4", "site-5"],
      "waitTimeMinutes": 10,
      "maxConcurrent": 3
    }
  ]
}
```

Then use it:

```bash
tsx tools/deploy-batch.ts --config=custom-deployment.json
```

### Expected Output

```
======================================================================
🚀 Starting Batch Deployment
======================================================================

Environment: production
Dry Run: No
Skip Tests: No
Rollback on Failure: Yes
Total Phases: 2
Total Sites: 2

======================================================================
Phase 1: Canary (Internal Site) - 1 sites
======================================================================

Sites to deploy: colossus-reference
Max concurrent: 1
Wait time after: 5 minutes

Deploying batch 1: colossus-reference
  Deploying colossus-reference...
  ✅ colossus-reference deployed (58.3s)

✅ Phase complete: 1/1 successful

======================================================================
Phase 2: First Batch (Small) - 1 sites
======================================================================

Sites to deploy: joes-plumbing-canterbury
Max concurrent: 3
Wait time after: 10 minutes

Deploying batch 1: joes-plumbing-canterbury
  Deploying joes-plumbing-canterbury...
  ✅ joes-plumbing-canterbury deployed (42.1s)

✅ Phase complete: 1/1 successful

======================================================================
📊 Batch Deployment Summary
======================================================================

Environment:      production
Total Sites:      2
Successful:       2 ✅
Failed:           0 ❌
Total Duration:   2.5 minutes
Overall Status:   ✅ Success

Phase Results:

  1. Phase 1: Canary (Internal Site)
     Sites: 1
     Success: 1/1
     Duration: 58.3s

  2. Phase 2: First Batch (Small)
     Sites: 1
     Success: 1/1
     Duration: 42.1s

======================================================================
```

---

## ⏮️ Rollback

### Basic Usage

```bash
# List recent deployments
tsx tools/rollback.ts colossus-reference --list

# Rollback to previous version (dry run)
tsx tools/rollback.ts colossus-reference --dry-run

# Rollback to previous version (actual)
tsx tools/rollback.ts colossus-reference
```

### Options

```bash
--list                 # List recent deployment history
--to=<commit>          # Rollback to specific commit (default: HEAD~1)
--dry-run              # Show what would be rolled back
--help                 # Show help message
```

### How Rollback Works

1. **Git Revert** - Creates a revert commit (doesn't rewrite history)
2. **Push to Main** - Pushes revert commit to main branch
3. **Auto-Deploy** - Vercel automatically deploys the reverted code

### Safety Checks

The rollback tool verifies:

- ✅ On `main` branch (rollback only works from main)
- ✅ Working directory is clean (no uncommitted changes)
- ✅ Shows commit details before rollback
- ✅ Asks for confirmation before proceeding

### Examples

```bash
# List recent deployments to see what you'd rollback to
tsx tools/rollback.ts colossus-reference --list

# Dry run to see what would happen
tsx tools/rollback.ts colossus-reference --dry-run

# Actually rollback
tsx tools/rollback.ts colossus-reference
```

### Expected Output

```
============================================================
📜 Recent Deployments for colossus-reference
============================================================

* 231710b (HEAD -> main) Add Week 4 deployment pipeline tools
* dc0aa8a Fix E2E test timeout issues in CI
* 4a19e11 Optimize hero image compression for better performance
* c4c74b3 Reduce default image quality to 65 for better compression
* a9cae0b Revert "Optimize LCP performance..."

Current commit:
231710b Add Week 4 deployment pipeline tools
```

```
============================================================
🔄 Starting Rollback
============================================================

Site: colossus-reference
Target: HEAD~1
Dry Run: No

============================================================
🔍 Verifying Branch
============================================================

✅ On main branch

============================================================
🔍 Checking Git Status
============================================================

✅ Working directory is clean

============================================================
📝 Commit Details: HEAD
============================================================

commit 231710b...
Author: ...
Date: ...

    Add Week 4 deployment pipeline tools

    ...

⚠️  This will revert the last commit and push to main.
Vercel will automatically redeploy the previous version.

Continue with rollback? (y/N): y

============================================================
⏮️  Performing Rollback
============================================================

Reverting last commit...
✅ Git revert successful

Pushing to main branch...
✅ Pushed to main - Vercel will auto-deploy

============================================================
✅ Verifying Rollback
============================================================

Checking current commit...
dc0aa8a Fix E2E test timeout issues in CI

✅ Rollback complete!

Vercel will automatically deploy the rolled-back version.
Monitor deployment at: https://vercel.com/dashboard
```

---

## 🔒 Safety Features

### All Tools Include

1. **Dry-Run Mode** - Test without actually deploying
2. **Pre-Deployment Validation** - TypeScript + Build + Tests
3. **Git Status Checks** - Warns about uncommitted changes
4. **Branch Verification** - Warns if on wrong branch
5. **Interactive Confirmation** - Requires confirmation for destructive actions
6. **Detailed Logging** - Clear, colored console output
7. **Error Handling** - Graceful failures with helpful error messages

### Rollback Safety

- Only works from `main` branch
- Creates revert commit (doesn't rewrite history)
- Shows commit details before rollback
- Asks for confirmation
- Provides instructions to undo if needed

---

## 🚨 Emergency Procedures

### Failed Deployment

If a deployment fails:

1. **Check the error message** - The tool shows detailed errors
2. **Fix the issue** - Address the root cause (TypeScript error, test failure, etc.)
3. **Commit the fix** - `git commit -m "Fix deployment issue"`
4. **Re-deploy** - Run the deployment tool again

### Site Down After Deployment

If a site goes down after deployment:

1. **Rollback immediately** - `tsx tools/rollback.ts <site-name>`
2. **Verify rollback** - Check site is working again
3. **Investigate** - Find what caused the issue
4. **Fix and re-deploy** - Deploy the fix once ready

### Tests Failing in CI

If smoke tests are failing but you need to deploy urgently:

```bash
# Skip tests (USE ONLY IN EMERGENCIES)
tsx tools/deploy-site.ts <site-name> --skip-tests
```

**Important:** Always fix failing tests afterwards. Don't make this a habit!

---

## 📊 Deployment Checklist

### Before Deploying

- [ ] All changes committed to Git
- [ ] On correct branch (main for production, staging for staging)
- [ ] TypeScript passes (`pnpm type-check`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Smoke tests pass (`pnpm test:e2e:smoke`)
- [ ] Reviewed changes one last time

### Single Site Deployment

- [ ] Run dry-run first: `tsx tools/deploy-site.ts <site> --dry-run`
- [ ] Verify pre-checks pass
- [ ] Deploy: `tsx tools/deploy-site.ts <site>`
- [ ] Verify deployment URL works
- [ ] Check Vercel dashboard for status

### Batch Deployment

- [ ] Run dry-run first: `tsx tools/deploy-batch.ts --dry-run`
- [ ] Review phased rollout plan
- [ ] Deploy: `tsx tools/deploy-batch.ts`
- [ ] Monitor Phase 1 (canary) deployment
- [ ] Watch for errors in subsequent phases
- [ ] Verify all sites deployed successfully

### After Deployment

- [ ] Visit deployed URLs to verify they work
- [ ] Check Vercel dashboard for any errors
- [ ] Monitor error tracking (Sentry, once set up)
- [ ] Document any issues encountered
- [ ] Celebrate successful deployment! 🎉

---

## 🐛 Troubleshooting

### "Site not found" Error

**Problem:** Tool can't find `sites/<site-name>` directory

**Solution:**

```bash
# List available sites
ls sites/

# Use exact site name
tsx tools/deploy-site.ts colossus-reference  # ✅ Correct
tsx tools/deploy-site.ts colossus           # ❌ Wrong
```

### "Working directory has uncommitted changes"

**Problem:** You have uncommitted changes in Git

**Solution:**

```bash
# Commit your changes
git add .
git commit -m "Your commit message"

# Or stash them temporarily
git stash
# ... deploy ...
git stash pop
```

### "On wrong branch" Warning

**Problem:** You're on develop/staging but deploying to production

**Solution:**

```bash
# Switch to main branch for production deployments
git checkout main

# Or deploy to matching environment
tsx tools/deploy-site.ts <site> --env=staging  # Deploy to staging instead
```

### TypeScript or Build Errors

**Problem:** Pre-deployment checks failing

**Solution:**

```bash
# Run locally to see detailed errors
pnpm --filter <site-name> run type-check
pnpm --filter <site-name> run build

# Fix the errors
# Then try deploying again
```

### "Vercel CLI not found"

**Problem:** Vercel CLI not installed

**Solution:**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Verify installation
vercel --version
```

### Rollback Fails

**Problem:** Rollback command fails

**Solution:**

```bash
# Manual rollback via Git
git revert HEAD --no-edit
git push origin main

# Or reset to previous commit (CAREFUL - rewrites history)
git reset --hard HEAD~1
git push origin main --force  # Only if absolutely necessary
```

---

## 📚 Related Documentation

- [Week 4 Strategy](../progress/WEEK_4_STRATEGY.md) - Overall deployment pipeline plan
- [Development Guide](DEVELOPMENT.md) - Local development workflow
- [Vercel Documentation](https://vercel.com/docs) - Official Vercel docs

---

## 💡 Tips & Best Practices

### 1. Always Dry Run First

```bash
# See what would happen before deploying
tsx tools/deploy-site.ts <site> --dry-run
tsx tools/deploy-batch.ts --dry-run
tsx tools/rollback.ts <site> --dry-run
```

### 2. Deploy to Staging First

```bash
# Test in staging before production
tsx tools/deploy-site.ts <site> --env=staging
# ... verify it works ...
tsx tools/deploy-site.ts <site> --env=production
```

### 3. Use Batch Deployment for Multiple Sites

Don't deploy sites one-by-one manually. Use batch deployment:

```bash
# Deploys all sites with phased rollout
tsx tools/deploy-batch.ts
```

### 4. Monitor After Deployment

- Check Vercel dashboard
- Visit deployed URLs
- Watch for error alerts (Sentry, once set up)
- Keep terminal open to see any immediate issues

### 5. Keep Rollback Ready

If something goes wrong, rollback immediately:

```bash
tsx tools/rollback.ts <site-name>
```

### 6. Document Issues

If you encounter issues during deployment:

- Note what failed
- Document the fix
- Update this guide if needed

---

**Remember:** These tools are here to make deployments safe and reliable. Use them, trust them, and improve them when needed!
