# GitHub Actions CI/CD Guide

This guide explains the GitHub Actions workflows configured for the local business platform monorepo.

---

## 📋 Overview

We have four main workflows:

1. **CI** ([ci.yml](/.github/workflows/ci.yml)) - Quality checks on every push/PR
2. **E2E Tests** ([e2e-tests.yml](/.github/workflows/e2e-tests.yml)) - Automated end-to-end testing
3. **Deploy** ([deploy.yml](/.github/workflows/deploy.yml)) - Automated deployment pipeline
4. _(Future)_ **Performance Monitoring** - Track Core Web Vitals

---

## 🔄 Workflow 1: CI (Continuous Integration)

**File:** `.github/workflows/ci.yml`

**Triggers:**

- Push to `develop`, `staging`, or `main` branches
- Pull requests to `staging` or `main` branches

**What It Does:**

1. ✅ Runs ESLint (code quality)
2. ✅ Runs TypeScript type checking
3. ✅ Validates content (MDX files, location data)
4. ✅ Runs unit tests
5. ✅ Tests production build

**Duration:** ~5-7 minutes

**Example Output:**

```
✅ ESLint passed
✅ TypeScript check passed
✅ Content validation passed
✅ Tests passed (12 passed)
✅ Build successful
```

### Using CI Workflow

**Manual Trigger:** Not available (runs automatically)

**View Results:**

1. Go to GitHub → Actions tab
2. Click on "CI" workflow
3. View latest run status

**Fix Failures:**

- **ESLint errors:** Run `pnpm run lint` locally, fix issues
- **TypeScript errors:** Run `pnpm run type-check`, fix type issues
- **Content errors:** Run `pnpm --filter colossus-reference run validate:content`
- **Build errors:** Run `pnpm run build` and debug

---

## 🧪 Workflow 2: E2E Tests

**File:** `.github/workflows/e2e-tests.yml`

**Triggers:**

- Push to `develop` → Smoke tests only (fast)
- Push to `staging` → Smoke + Standard tests
- Manual trigger → Choose test suite

**Test Suites:**

### 1. Smoke Tests (Fast)

- **Duration:** ~2 minutes
- **Tests:** 7 critical path tests
- **When:** Every push to develop/staging
- **Purpose:** Catch breaking changes quickly

### 2. Standard Tests (Auto)

- **Duration:** ~10 minutes
- **Tests:** Full E2E test suite
- **When:** Push to staging (quality gate before main)
- **Purpose:** Comprehensive testing before production

### 3. Full Tests (Manual)

- **Duration:** ~30 minutes
- **Tests:** All E2E + performance + accessibility
- **When:** Manual trigger only
- **Purpose:** Deep testing before major releases

### Manual Trigger

Manually run E2E tests:

1. Go to GitHub → Actions tab
2. Click "E2E Tests" workflow
3. Click "Run workflow" button
4. Select test suite:
   - **smoke** - Quick validation (2 min)
   - **standard** - Full E2E suite (10 min)
   - **full** - Everything including performance (30 min)
5. Click "Run workflow"

**Command Line:**

```bash
gh workflow run e2e-tests.yml -f test-suite=smoke
gh workflow run e2e-tests.yml -f test-suite=standard
gh workflow run e2e-tests.yml -f test-suite=full
```

### Test Results

**View Results:**

1. Go to workflow run
2. Scroll to "Artifacts" section
3. Download test reports (HTML report)
4. Download test videos (if tests failed)

**Analyze Failures:**

```bash
# Download and extract test report
gh run download <run-id> -n standard-test-report

# Open HTML report
open playwright-report/index.html
```

---

## 🚀 Workflow 3: Deploy (New!)

**File:** `.github/workflows/deploy.yml`

**Triggers:**

- Push to `main` → Auto-deploy all sites (batch mode)
- Manual trigger → Deploy single site or batch

**Jobs:**

### Job 1: Pre-Deployment Checks

- TypeScript validation
- ESLint checks
- Production build test
- Smoke tests (unless skipped)

### Job 2: Deploy Single Site (Manual)

- Deploys one specific site
- Uses `tools/deploy-site.ts`
- Supports dry-run mode

### Job 3: Deploy Batch (Auto/Manual)

- Deploys multiple sites with phased rollout
- Uses `tools/deploy-batch.ts`
- Canary → Small batch → Medium batch → All

### Job 4: Post-Deployment Tests

- Runs smoke tests against production URLs
- Validates deployment success
- Creates GitHub issue if tests fail

---

## 📖 Using Deploy Workflow

### Automatic Deployment (Production)

**When:** Push to `main` branch

**What Happens:**

1. Pre-deployment checks run
2. If checks pass → Batch deployment starts
3. Phased rollout (canary → batches)
4. Post-deployment tests verify success
5. GitHub issue created if tests fail

**Example:**

```bash
# Deploy to production automatically
git checkout main
git merge staging
git push origin main

# GitHub Actions will:
# ✅ Run pre-deployment checks
# ✅ Deploy canary site (colossus-reference)
# ✅ Wait 5 minutes, monitor for errors
# ✅ Deploy first batch (5 sites)
# ✅ Wait 10 minutes
# ✅ Deploy second batch (10 sites)
# ✅ Deploy remaining sites
# ✅ Run post-deployment tests
```

---

### Manual Deployment (Single Site)

**Use Case:** Deploy one site quickly for urgent fixes

**Steps:**

1. **Via GitHub UI:**
   - Go to Actions → "Deploy Sites"
   - Click "Run workflow"
   - Configure:
     - **Deployment type:** single
     - **Site name:** colossus-reference
     - **Environment:** production
     - **Skip tests:** false
     - **Dry run:** false
   - Click "Run workflow"

2. **Via Command Line:**

```bash
gh workflow run deploy.yml \
  -f deployment-type=single \
  -f site-name=colossus-reference \
  -f environment=production \
  -f skip-tests=false \
  -f dry-run=false
```

**Example Scenarios:**

```bash
# Deploy single site to production
gh workflow run deploy.yml \
  -f deployment-type=single \
  -f site-name=joes-plumbing-canterbury \
  -f environment=production

# Deploy with tests skipped (urgent fix)
gh workflow run deploy.yml \
  -f deployment-type=single \
  -f site-name=colossus-reference \
  -f environment=production \
  -f skip-tests=true

# Dry run to test deployment process
gh workflow run deploy.yml \
  -f deployment-type=single \
  -f site-name=colossus-reference \
  -f environment=staging \
  -f dry-run=true
```

---

### Manual Deployment (Batch)

**Use Case:** Deploy multiple sites manually with control

**Steps:**

1. **Via GitHub UI:**
   - Go to Actions → "Deploy Sites"
   - Click "Run workflow"
   - Configure:
     - **Deployment type:** batch
     - **Environment:** production
     - **Skip tests:** false
     - **Dry run:** false
   - Click "Run workflow"

2. **Via Command Line:**

```bash
# Deploy all sites in batch mode
gh workflow run deploy.yml \
  -f deployment-type=batch \
  -f environment=production

# Dry run batch deployment
gh workflow run deploy.yml \
  -f deployment-type=batch \
  -f environment=staging \
  -f dry-run=true

# Batch deploy skipping tests (use cautiously)
gh workflow run deploy.yml \
  -f deployment-type=batch \
  -f environment=production \
  -f skip-tests=true
```

---

## 🔐 Required Secrets

Configure these secrets in GitHub repository settings:

### 1. VERCEL_TOKEN

- **What:** Vercel authentication token
- **Get It:** Vercel Dashboard → Settings → Tokens → Create Token
- **Scope:** Read & Write access to projects

### 2. VERCEL_ORG_ID

- **What:** Your Vercel organization ID
- **Get It:** Vercel Dashboard → Settings → General → Organization ID
- **Format:** `team_xxxxxxxxxxxxx`

### 3. NEXT_PUBLIC_R2_PUBLIC_URL

- **What:** Cloudflare R2 public URL for images
- **Get It:** R2 bucket settings in Cloudflare dashboard
- **Format:** `https://pub-xxxxx.r2.dev`

### 4. NEW_RELIC_API_KEY (Optional)

- **What:** NewRelic API key for deployment tracking
- **Get It:** NewRelic → Account Settings → API Keys → Create Key
- **Type:** User API Key
- **Scope:** Deployment marker creation

### Setting Secrets

**Via GitHub UI:**

1. Go to repository Settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Add name and value
5. Click "Add secret"

**Via Command Line:**

```bash
gh secret set VERCEL_TOKEN
# Paste token when prompted

gh secret set VERCEL_ORG_ID
# Paste org ID when prompted

gh secret set NEXT_PUBLIC_R2_PUBLIC_URL
# Paste R2 URL when prompted
```

---

## 📊 Monitoring Workflows

### View Active Workflows

```bash
# List all workflow runs
gh run list

# List runs for specific workflow
gh run list --workflow=deploy.yml

# Watch a running workflow
gh run watch
```

### Check Workflow Status

```bash
# View latest run status
gh run view

# View specific run
gh run view <run-id>

# View logs
gh run view <run-id> --log
```

### Download Artifacts

```bash
# List artifacts for a run
gh run view <run-id> --json artifacts

# Download specific artifact
gh run download <run-id> -n test-results

# Download all artifacts
gh run download <run-id>
```

---

## 🚨 Troubleshooting

### Deployment Failed

**Symptom:** Deploy workflow shows red X

**Debug Steps:**

1. **Check pre-deployment checks:**

```bash
gh run view --log | grep "Pre-Deployment"
```

2. **Check deployment logs:**

```bash
gh run view --log | grep "Deploy"
```

3. **Common Issues:**

**TypeScript errors:**

```bash
# Run locally first
pnpm run type-check
```

**Build failures:**

```bash
# Test build locally
pnpm run build
```

**Vercel authentication:**

- Verify `VERCEL_TOKEN` is set correctly
- Check token hasn't expired
- Ensure token has correct permissions

**Site not found:**

- Verify site name matches directory in `sites/`
- Check site is configured in Vercel

### Post-Deployment Tests Failed

**Symptom:** Deployment succeeded but tests failed afterward

**What To Do:**

1. **Check if site is accessible:**

```bash
curl -I https://colossus-reference.vercel.app
```

2. **Review test failure:**

```bash
# Download test results
gh run download <run-id> -n post-deployment-test-results

# Open HTML report
open test-results/index.html
```

3. **Consider rollback:**

```bash
# If site is broken
tsx tools/rollback.ts
```

### Workflow Not Triggering

**Check:**

1. Branch name matches trigger conditions
2. Workflow file has correct YAML syntax
3. GitHub Actions is enabled for repository

**Validate YAML:**

```bash
# Install YAML linter
npm install -g yaml-lint

# Validate workflow file
yamllint .github/workflows/deploy.yml
```

---

## ⚡ Performance Tips

### Speed Up Workflows

1. **Use caching:**

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.pnpm-store
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
```

2. **Skip unnecessary steps:**

```bash
# Skip tests for urgent hotfixes
gh workflow run deploy.yml -f skip-tests=true
```

3. **Run jobs in parallel:**
   - Workflows already optimized for parallel execution
   - Pre-deployment checks run concurrently

### Reduce Costs

**GitHub Actions Free Tier:**

- 2,000 minutes/month for private repos
- Unlimited for public repos

**Optimize:**

- Use smoke tests instead of full E2E when possible
- Run full tests on staging only
- Use manual triggers for expensive workflows

---

## 📈 Best Practices

### 1. Always Run Pre-Deployment Checks

Never skip checks unless absolutely necessary:

```bash
# ✅ Good - runs all checks
gh workflow run deploy.yml -f deployment-type=single -f site-name=mysite

# ⚠️ Risky - skips checks
gh workflow run deploy.yml -f skip-tests=true
```

### 2. Use Dry Run for Testing

Test deployment process without actual deployment:

```bash
gh workflow run deploy.yml \
  -f deployment-type=batch \
  -f environment=production \
  -f dry-run=true
```

### 3. Monitor After Deployment

- Watch GitHub Actions logs during deployment
- Check NewRelic for errors and performance in first 15 minutes
- Verify key pages load correctly
- Monitor Core Web Vitals in NewRelic Browser dashboard

### 4. Deploy During Low Traffic

- **Best time:** Early morning (2-6 AM local time)
- **Avoid:** Peak business hours
- **Exception:** Urgent security fixes

### 5. Document Deployments

Create GitHub release after successful deployment:

```bash
gh release create v1.2.3 \
  --title "Release v1.2.3" \
  --notes "Deployed 15 sites with new feature X"
```

---

## 🔗 Related Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Using deployment tools locally
- [NewRelic Setup Guide](./NEWRELIC_SETUP_GUIDE.md) - APM and error monitoring setup
- [Monitoring Comparison](./MONITORING_COMPARISON.md) - NewRelic vs Sentry analysis
- [Week 4 Strategy](./progress/WEEK_4_STRATEGY.md) - Overall deployment pipeline plan

---

## ✅ Quick Reference

### Common Commands

```bash
# Trigger single site deployment
gh workflow run deploy.yml -f deployment-type=single -f site-name=SITENAME -f environment=production

# Trigger batch deployment
gh workflow run deploy.yml -f deployment-type=batch -f environment=production

# Run smoke tests
gh workflow run e2e-tests.yml -f test-suite=smoke

# View latest deployment status
gh run list --workflow=deploy.yml --limit 1

# Watch current deployment
gh run watch

# Download deployment logs
gh run view --log > deployment.log
```

### Workflow Status Badges

Add to README.md:

```markdown
![CI](https://github.com/USERNAME/REPO/workflows/CI/badge.svg)
![E2E Tests](https://github.com/USERNAME/REPO/workflows/E2E%20Tests/badge.svg)
![Deploy](https://github.com/USERNAME/REPO/workflows/Deploy%20Sites/badge.svg)
```

---

**Status:** Production Ready
**Last Updated:** 2025-10-19
**Version:** 1.0
