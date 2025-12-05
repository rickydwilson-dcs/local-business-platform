# How to Deploy a Site

**Estimated Time:** 10-15 minutes
**Prerequisites:** Repository access, Vercel CLI access
**Difficulty:** Beginner

---

## Overview

This guide covers deploying sites to staging and production environments using the Local Business Platform deployment pipeline. All deployments follow the git workflow: develop → staging → main.

## Prerequisites

- Repository access with push permissions
- GitHub CLI (`gh`) installed
- Access to Vercel dashboard (for emergency rollbacks)

## Deployment Workflow

### Standard Deployment (Recommended)

```
develop → staging → main
   ↓         ↓        ↓
 Test      Verify   Deploy
```

### Step 1: Ensure You're on Develop

```bash
git checkout develop
git pull origin develop
```

### Step 2: Make and Commit Changes

```bash
# Make your changes...
git add .
git commit -m "feat(content): add new service page"
```

### Step 3: Push to Develop

```bash
git push origin develop
```

**Wait for CI to pass:**

```bash
gh run watch
# Or check status
gh run list --branch develop --limit 1
```

### Step 4: Merge to Staging

```bash
git checkout staging
git merge develop
git push origin staging
```

**Wait for CI + E2E to pass:**

```bash
gh run watch
```

### Step 5: Verify on Staging

1. Visit staging URL (Vercel preview deployment)
2. Test all affected pages
3. Verify no console errors
4. Check mobile responsiveness

### Step 6: Merge to Main (Production)

```bash
git checkout main
git merge staging
git push origin main
```

**Monitor deployment:**

```bash
gh run watch
```

## CLI Deployment Tools

### Single Site Deployment

```bash
# From repository root
tsx tools/deploy-site.ts [site-name] --env [environment]

# Examples:
tsx tools/deploy-site.ts colossus-reference --env production
tsx tools/deploy-site.ts joes-plumbing-canterbury --env staging
```

### Batch Deployment (Multiple Sites)

```bash
# Deploy all sites with phased rollout
tsx tools/deploy-batch.ts --env production

# Specify sites
tsx tools/deploy-batch.ts --sites colossus-reference,joes-plumbing-canterbury --env production
```

**Phased Rollout Strategy:**

1. Canary (1 site) - 5 minute observation
2. Small batch (5 sites) - 10 minute observation
3. Medium batch (10 sites) - 10 minute observation
4. Remaining sites

### Emergency Rollback

```bash
# Rollback to previous deployment
tsx tools/rollback.ts [site-name]

# Example:
tsx tools/rollback.ts colossus-reference
```

## GitHub Actions CI/CD

### Automatic Triggers

| Branch  | Trigger | Tests Run                                           |
| ------- | ------- | --------------------------------------------------- |
| develop | Push    | ESLint, TypeScript, Unit Tests, Build, Smoke E2E    |
| staging | Push    | ESLint, TypeScript, Unit Tests, Build, Standard E2E |
| main    | Push    | ESLint, TypeScript, Unit Tests, Build, Standard E2E |

### Monitoring CI

```bash
# Watch current run
gh run watch

# List recent runs
gh run list --branch main --limit 5

# View specific run
gh run view [run-id]

# Open in browser
gh run view --web
```

### CI Failure Response

1. **Check error logs:**

   ```bash
   gh run view [run-id] --log-failed
   ```

2. **Reproduce locally:**

   ```bash
   npm run lint
   npm run type-check
   npm test
   npm run build
   ```

3. **Fix and re-push:**
   ```bash
   git add .
   git commit -m "fix: resolve CI failure"
   git push origin [branch]
   ```

## Vercel Deployment

### Automatic Deployments

Vercel automatically deploys when changes are pushed:

- **develop** → Preview deployment
- **staging** → Preview deployment
- **main** → Production deployment

### Manual Deployment (Vercel Dashboard)

1. Go to Vercel Dashboard
2. Select project
3. Click "Deployments"
4. Click "Redeploy" on desired deployment

### Rollback via Vercel

1. Go to Vercel Dashboard → Project → Deployments
2. Find the last working deployment
3. Click the three dots → "Promote to Production"

## Pre-Deployment Checklist

Before deploying to production:

### Code Quality

- [ ] TypeScript compiles (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Unit tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)

### Content

- [ ] Content validation passes (`npm run validate:content`)
- [ ] All new MDX files have required frontmatter
- [ ] Hero images uploaded to R2

### Testing

- [ ] Smoke tests pass (`npm run test:e2e:smoke`)
- [ ] Manual testing on staging complete
- [ ] No console errors

### Review

- [ ] CI passes on develop
- [ ] CI + E2E passes on staging
- [ ] Visual verification on staging URL

## Environment-Specific Considerations

### Development (develop)

- Fast iteration
- Smoke tests only (7 tests, ~30s)
- OK to push frequently

### Staging

- Pre-production verification
- Full E2E test suite
- Must pass before production

### Production (main)

- Live customer-facing
- Full E2E test suite
- Requires staging verification

## Troubleshooting

### Push blocked by pre-push hook

```bash
# Run checks manually to see errors
npm run type-check
npm run build

# Fix errors, then retry push
```

### CI fails but local passes

- CI uses `npm ci` (clean install) vs local `npm install`
- Check for environment-specific issues
- Verify all dependencies are in package.json

### Vercel deployment fails

1. Check Vercel build logs
2. Verify environment variables are set
3. Check Root Directory configuration
4. Verify build command is correct

### E2E tests fail on CI

```bash
# Run locally to debug
npm run test:e2e:smoke

# Check if it's a timing issue
# CI may be slower than local machine
```

## Related

- [Git Workflow](./git-workflow.md) - Branch workflow details
- [GitHub Actions](./github-actions.md) - CI/CD pipeline guide
- [Deployment Standards](../standards/deployment.md) - Deployment requirements
- [Quality Standards](../standards/quality.md) - Quality gates

---

**Last Updated:** 2025-12-05
