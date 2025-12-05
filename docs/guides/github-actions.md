# GitHub Actions CI/CD Guide

**Estimated Time:** 15-20 minutes
**Prerequisites:** Repository access, GitHub account
**Difficulty:** Intermediate

---

## Overview

This guide explains the GitHub Actions CI/CD pipeline for the Local Business Platform. The pipeline automatically runs quality checks, tests, and deployments based on branch.

## Pipeline Overview

```
Push to develop → CI + Smoke Tests → Auto-deploy to Preview
       ↓
Push to staging → CI + Full E2E → Auto-deploy to Preview
       ↓
Push to main → CI + Full E2E → Auto-deploy to Production
```

## Workflow Files

### Main CI Workflow

Location: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main, staging, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm build

  e2e-smoke:
    if: github.ref == 'refs/heads/develop'
    needs: [lint, type-check, test, build]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
      - run: pnpm install
      - run: npx playwright install chromium
      - run: pnpm test:e2e:smoke

  e2e-full:
    if: github.ref == 'refs/heads/staging' || github.ref == 'refs/heads/main'
    needs: [lint, type-check, test, build]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
      - run: pnpm install
      - run: npx playwright install chromium
      - run: pnpm test:e2e
```

## Branch-Specific Behavior

| Branch  | Lint | Type Check | Unit Tests | Build | E2E Tests       |
| ------- | ---- | ---------- | ---------- | ----- | --------------- |
| develop | ✅   | ✅         | ✅         | ✅    | Smoke (7 tests) |
| staging | ✅   | ✅         | ✅         | ✅    | Full (58 tests) |
| main    | ✅   | ✅         | ✅         | ✅    | Full (58 tests) |

## Monitoring CI Status

### Using GitHub CLI

```bash
# Watch current run in real-time
gh run watch

# List recent runs
gh run list --limit 5

# List runs for specific branch
gh run list --branch develop --limit 3

# View specific run details
gh run view [run-id]

# View failed step logs
gh run view [run-id] --log-failed

# Open in browser
gh run view --web
```

### Status Badges

Add to README.md:

```markdown
![CI](https://github.com/[org]/[repo]/workflows/CI/badge.svg)
```

## Common CI Failures

### ESLint Failures

```bash
# Error: Linting error in src/components/Example.tsx
# Fix locally:
npm run lint
# or auto-fix:
npm run lint -- --fix
```

### TypeScript Failures

```bash
# Error: Type error in src/lib/utils.ts
# Fix locally:
npm run type-check
```

### Unit Test Failures

```bash
# Error: Test failed: should handle rate limiting
# Run locally to debug:
npm test
npm run test:watch  # Interactive mode
```

### E2E Test Failures

```bash
# Error: E2E test failed: homepage loads
# Run locally:
npm run test:e2e:smoke

# With UI for debugging:
npm run test:e2e:ui
```

### Build Failures

```bash
# Error: Build failed
# Run locally:
npm run build
```

## Caching Strategy

### pnpm Cache

The workflow caches pnpm store to speed up installs:

```yaml
- uses: actions/setup-node@v4
  with:
    cache: "pnpm"
```

### Turborepo Cache

Turborepo caches build outputs:

```yaml
- name: Cache Turborepo
  uses: actions/cache@v4
  with:
    path: .turbo
    key: turbo-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}
```

## Adding New Workflows

### Example: Deploy Preview

```yaml
# .github/workflows/preview.yml
name: Deploy Preview

on:
  pull_request:
    branches: [develop]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Example: Content Validation

```yaml
# .github/workflows/content.yml
name: Content Validation

on:
  push:
    paths:
      - "sites/*/content/**"

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm validate:content
```

## Secrets Management

### Required Secrets

Set in GitHub Repository Settings → Secrets:

| Secret              | Purpose             |
| ------------------- | ------------------- |
| `VERCEL_TOKEN`      | Vercel deployment   |
| `VERCEL_ORG_ID`     | Vercel organization |
| `VERCEL_PROJECT_ID` | Vercel project      |

### Adding Secrets

```bash
# Using GitHub CLI
gh secret set VERCEL_TOKEN

# Or in GitHub UI:
# Settings → Secrets and variables → Actions → New repository secret
```

## Troubleshooting

### CI passes locally but fails on GitHub

1. **Different Node version:**
   - CI uses Node 20
   - Check your local version: `node --version`

2. **Clean install vs incremental:**
   - CI uses `pnpm install` (clean)
   - Try locally: `rm -rf node_modules && pnpm install`

3. **Environment differences:**
   - CI runs on Ubuntu
   - Check for OS-specific issues

### Slow CI runs

1. **Enable Turborepo caching:**
   - Ensure `.turbo` is cached

2. **Parallelize jobs:**
   - Run lint, type-check, test in parallel (default)

3. **Skip unnecessary E2E:**
   - develop only runs smoke tests

### Flaky E2E tests

1. **Add retries:**

   ```yaml
   - run: pnpm test:e2e || pnpm test:e2e
   ```

2. **Increase timeouts in Playwright config**

3. **Use `waitFor` instead of fixed delays**

## Related

- [Git Workflow](./git-workflow.md) - Branch workflow
- [Deploying a Site](./deploying-site.md) - Deployment procedures
- [Testing Standards](../standards/testing.md) - Test requirements

---

**Last Updated:** 2025-12-05
