# Deployment Standards

**Version:** 1.0.0
**Last Updated:** 2025-12-05
**Scope:** All sites in local-business-platform

---

## Overview

The Local Business Platform uses a multi-stage deployment pipeline with GitHub Actions CI/CD, CLI deployment tools, and NewRelic APM monitoring. All deployments follow a phased rollout strategy.

## Core Principles

### 1. Git Branch Flow

```
develop → staging → main
```

- **develop:** Development environment, smoke tests required
- **staging:** Preview/QA gate, full E2E tests required
- **main:** Production, requires staging CI passing

### 2. Phased Rollout

Never deploy all sites at once. Use phased approach to minimize risk.

### 3. Automated CI/CD

All deployments validated by GitHub Actions before proceeding.

## GitHub Actions Workflows

### CI Workflow (ci.yml)

Runs on every push to develop, staging, main:

```yaml
- TypeScript validation
- ESLint linting
- Unit tests
- Production build
- Content validation
```

### E2E Tests Workflow (e2e-tests.yml)

| Branch  | Tests                       | Duration |
| ------- | --------------------------- | -------- |
| develop | Smoke (7 tests)             | ~30s     |
| staging | Smoke + Standard (58 tests) | ~3-4 min |
| main    | Smoke + Standard (58 tests) | ~3-4 min |

### Deploy Workflow (deploy.yml)

- Automated on main push (batch with phased rollout)
- Manual single-site deployment available
- Pre-deployment validation
- Post-deployment smoke tests

## Deployment Tools

### Single Site Deployment

```bash
# Deploy single site
tsx tools/deploy-site.ts colossus-reference --env production

# Dry run (preview)
tsx tools/deploy-site.ts colossus-reference --env production --dry-run
```

### Batch Deployment

```bash
# Deploy all sites with phased rollout
tsx tools/deploy-batch.ts --env production

# Dry run batch
tsx tools/deploy-batch.ts --env production --dry-run
```

### Emergency Rollback

```bash
# Quick rollback (< 1 minute)
tsx tools/rollback.ts colossus-reference

# Dry run rollback
tsx tools/rollback.ts colossus-reference --dry-run
```

## Phased Rollout Strategy

### Phase 1: Canary

1. Deploy to colossus-reference only
2. Wait 5 minutes
3. Monitor NewRelic for errors
4. If errors > threshold, stop and rollback

### Phase 2: First Batch

1. Deploy to 5 sites
2. Wait 10 minutes
3. Check performance metrics
4. Verify no error spikes

### Phase 3: Second Batch

1. Deploy to 10 sites
2. Wait 15 minutes
3. Verify stability

### Phase 4: Full Rollout

1. Deploy remaining sites
2. Final validation
3. Monitor for 30 minutes

## Pre-Deployment Checks

Before any deployment:

```bash
# TypeScript validation
npm run type-check

# Lint check
npm run lint

# Unit tests
npm test

# E2E smoke tests
npm run test:e2e:smoke

# Content validation
npm run validate:content
```

## NewRelic Monitoring

### What's Monitored

- ✅ **Errors:** JavaScript, API, server errors
- ✅ **Performance:** Response times, throughput
- ✅ **Core Web Vitals:** LCP, FID, CLS
- ✅ **Browser Metrics:** Frontend performance
- ✅ **Transactions:** Request flow

### Alert Thresholds

| Metric        | Warning | Critical |
| ------------- | ------- | -------- |
| Error rate    | > 1%    | > 5%     |
| Response time | > 2s    | > 5s     |
| LCP           | > 2.5s  | > 4s     |
| CLS           | > 0.1   | > 0.25   |

### Configuration Files

```javascript
// newrelic.js
exports.config = {
  app_name: ["site-name"],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: { level: "info", filepath: "stdout" },
  distributed_tracing: { enabled: true },
  browser_monitoring: { enable: true },
  error_collector: { enabled: true, ignore_status_codes: [404] },
};
```

```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("newrelic");
  }
}
```

### Environment Variables (Vercel)

```bash
NEW_RELIC_LICENSE_KEY=your_license_key
NEW_RELIC_APP_NAME=site-name
NEW_RELIC_LOG=stdout
NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
```

## Git Workflow Commands

```bash
# Push to develop
git push origin develop
gh run watch  # Wait for CI

# Merge to staging (after CI passes)
git checkout staging
git merge develop
git push origin staging
gh run watch  # Wait for E2E tests

# Merge to main (after staging E2E passes)
git checkout main
git merge staging
git push origin main
gh run watch  # Wait for deployment
```

## Vercel Configuration

Each site has its own Vercel project:

```bash
# Link site to Vercel
cd sites/colossus-reference
vercel link

# Deploy preview
vercel

# Deploy production
vercel --prod
```

## What NOT to Do

| Anti-Pattern               | Why It's Wrong       | Correct Approach           |
| -------------------------- | -------------------- | -------------------------- |
| Deploy directly to main    | Skips quality gates  | develop → staging → main   |
| Deploy all sites at once   | High risk            | Phased rollout             |
| Skip pre-deployment checks | May break production | Always run checks          |
| Ignore monitoring alerts   | Miss problems        | Monitor 30 min post-deploy |
| Force push to main         | Bypass protections   | Never force push           |

## Deployment Checklist

Before deploying to production:

- [ ] All unit tests pass
- [ ] E2E smoke tests pass
- [ ] Content validation passes
- [ ] Staging verification complete
- [ ] NewRelic configured and reporting
- [ ] Environment variables set in Vercel
- [ ] Rollback procedure tested
- [ ] Team notified of deployment

## Post-Deployment Verification

- [ ] Site loads successfully
- [ ] NewRelic showing data (within 2 minutes)
- [ ] No error spikes
- [ ] Core Web Vitals within targets
- [ ] All critical paths functional
- [ ] Forms working correctly

## Performance Targets

| Metric                  | Target         |
| ----------------------- | -------------- |
| Single site deploy      | 5-10 min       |
| Batch deploy (50 sites) | ~60 min        |
| Rollback execution      | < 1 min        |
| NewRelic data latency   | 1-2 min        |
| Build time              | < 30s per site |

## Related Guides

- [Deploying a Site](../guides/deploying-site.md)
- [Monitoring Setup](../guides/monitoring-setup.md)
- [GitHub Actions](../guides/github-actions.md)

## Related Standards

- [Testing](./testing.md) - Pre-deployment testing
- [Quality](./quality.md) - Quality gates

---

**Maintained By:** Digital Consulting Services
