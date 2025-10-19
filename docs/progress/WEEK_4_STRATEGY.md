# Week 4: Deployment Pipeline - Strategy Document

**Date Started:** 2025-10-19
**Milestone:** Week 4 - Deployment Automation (CRITICAL)
**Priority:** HIGH - Essential for scaling to 50 sites

---

## 📊 Current State Analysis

### What We Have Today

- ✅ **Git-based deployments**: Vercel automatically deploys on push to branches
- ✅ **Branch strategy**: develop → staging → main
- ✅ **E2E smoke tests**: 7 tests, 100% pass rate
- ✅ **Pre-push quality gates**: TypeScript + Build + Smoke tests
- ✅ **Two sites deployed**: colossus-reference, joes-plumbing-canterbury

### Current Deployment Flow

```
Developer → Git Push → GitHub → Vercel Webhook → Automatic Build & Deploy
```

### Pain Points

1. **No programmatic control**: Can't trigger deployments via CLI/script
2. **No batch deployment**: Can't deploy multiple sites at once
3. **No rollback capability**: Must revert git commits manually
4. **No deployment monitoring**: Can't track deployment status programmatically
5. **No phased rollouts**: All-or-nothing deployments

---

## 🎯 Week 4 Goals

### Primary Objectives

1. **Programmatic Deployment Control** - Deploy sites via CLI/script
2. **Batch Deployment Capability** - Deploy multiple sites in phases
3. **Automated Rollback** - One-command rollback to previous version
4. **Deployment Monitoring** - Real-time status tracking
5. **Error Tracking** - Sentry integration for production errors

### Success Criteria

- [ ] Can deploy single site from command line
- [ ] Can deploy batch of sites with phased rollout
- [ ] Can rollback single site in <1 minute
- [ ] Can monitor deployment status programmatically
- [ ] Sentry catches and reports production errors

---

## 🛠 Implementation Strategy

### Approach: Vercel CLI + Git-based Deployments

**Decision:** Use **Vercel CLI** instead of REST API for simplicity and reliability.

**Rationale:**

- Vercel CLI handles authentication, file uploads, and deployment lifecycle
- More stable than REST API (fewer breaking changes)
- Easier to debug and maintain
- Built-in support for monorepo projects
- Works with existing Git-based workflow

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Deployment Tools                     │
├─────────────────────────────────────────────────────┤
│  tools/deploy-site.ts                               │
│    ├─ Single site deployment                        │
│    ├─ Uses Vercel CLI under the hood               │
│    ├─ Validates pre-conditions (tests pass, etc.)  │
│    └─ Reports deployment status                     │
│                                                      │
│  tools/deploy-batch.ts                              │
│    ├─ Phased deployment strategy                    │
│    ├─ Internal sites first (canary)                │
│    ├─ Then client sites in batches                 │
│    └─ Auto-rollback on failure                     │
│                                                      │
│  tools/rollback.ts                                  │
│    ├─ Revert to previous deployment                │
│    ├─ Git-based: revert commit + force push        │
│    └─ Trigger Vercel redeploy                      │
└─────────────────────────────────────────────────────┘
```

---

## 📝 Detailed Implementation Plan

### Phase 1: Vercel CLI Setup (Day 1)

**Goal:** Install and configure Vercel CLI for programmatic access

**Tasks:**

1. Install Vercel CLI globally: `pnpm add -g vercel`
2. Authenticate with Vercel account: `vercel login`
3. Link monorepo to Vercel projects: `vercel link`
4. Test manual deployment: `vercel deploy --prod`
5. Document CLI configuration

**Success Metrics:**

- Can deploy colossus-reference via CLI
- Can deploy joes-plumbing-canterbury via CLI
- Deployments appear in Vercel dashboard

---

### Phase 2: Single Site Deployment Script (Day 1-2)

**Goal:** Create `tools/deploy-site.ts` for programmatic single-site deployments

**Features:**

```typescript
// Usage: tsx tools/deploy-site.ts colossus-reference --env=production
// Usage: tsx tools/deploy-site.ts joes-plumbing-canterbury --env=staging

interface DeploymentOptions {
  siteName: string;
  environment: "development" | "staging" | "production";
  skipTests?: boolean;
  dryRun?: boolean;
}
```

**Pre-deployment Checks:**

- ✅ Verify site exists in sites/ directory
- ✅ Run TypeScript validation
- ✅ Run production build
- ✅ Run E2E smoke tests
- ✅ Check git status (no uncommitted changes)
- ✅ Verify correct branch for environment

**Deployment Flow:**

1. Run pre-deployment checks
2. Execute `vercel deploy` with appropriate flags
3. Monitor deployment status
4. Report success/failure
5. Log deployment details

**Error Handling:**

- Abort on failed pre-checks
- Retry on transient network errors
- Report detailed error messages
- Save deployment logs

---

### Phase 3: Batch Deployment Script (Day 2-3)

**Goal:** Create `tools/deploy-batch.ts` for phased multi-site deployments

**Phased Rollout Strategy:**

```
Phase 1: Internal Site (Canary)
  ├─ Deploy colossus-reference first
  ├─ Run smoke tests on production
  ├─ Wait 5 minutes for error monitoring
  └─ If successful, proceed to Phase 2

Phase 2: First Batch (Small)
  ├─ Deploy 5 client sites
  ├─ Run smoke tests on each
  ├─ Wait 10 minutes for error monitoring
  └─ If successful, proceed to Phase 3

Phase 3: Second Batch (Medium)
  ├─ Deploy 10 client sites
  ├─ Run smoke tests on each
  ├─ Wait 10 minutes for error monitoring
  └─ If successful, proceed to Phase 4

Phase 4: Remaining Sites (All)
  ├─ Deploy all remaining sites
  ├─ Run smoke tests on each
  └─ Monitor for errors
```

**Features:**

- Parallel deployment within each phase (up to 5 concurrent)
- Automatic rollback on failure in any phase
- Progress reporting (e.g., "Phase 2: 3/5 sites deployed")
- Detailed logging of each deployment
- Summary report at end

**Configuration:**

```typescript
interface BatchDeploymentConfig {
  phases: {
    name: string;
    sites: string[];
    waitTimeMinutes: number;
    maxConcurrent: number;
  }[];
  rollbackOnFailure: boolean;
  notifyOnComplete: boolean;
}
```

---

### Phase 4: Rollback Script (Day 3)

**Goal:** Create `tools/rollback.ts` for quick rollback capability

**Rollback Strategies:**

**Option A: Git Revert (Recommended)**

```bash
# Revert to previous commit
git revert HEAD --no-edit
git push origin main

# Vercel auto-deploys reverted code
```

**Option B: Vercel Previous Deployment**

```bash
# Redeploy previous successful deployment
vercel rollback [deployment-url]
```

**Script Features:**

- List recent deployments with timestamps
- Select deployment to rollback to
- Confirm rollback action (with preview of changes)
- Execute rollback
- Verify rollback success
- Run smoke tests on rolled-back version

---

### Phase 5: Sentry Integration (Day 4)

**Goal:** Set up error monitoring for production deployments

**Setup:**

1. Create Sentry account (free tier)
2. Create Sentry projects:
   - `colossus-reference-production`
   - `joes-plumbing-canterbury-production`
3. Install Sentry SDK: `pnpm add @sentry/nextjs`
4. Configure Sentry in each site
5. Test error reporting

**Implementation:**

```typescript
// sites/*/sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV || "development",
  tracesSampleRate: 0.1, // 10% of transactions
  enabled: process.env.NODE_ENV === "production",
});
```

**Error Tracking:**

- JavaScript errors
- API errors
- Performance issues
- Deployment errors
- Custom error boundaries

**Alerting:**

- Email alerts on critical errors
- Slack integration (optional)
- Weekly error reports

---

### Phase 6: CI/CD Integration (Day 4-5)

**Goal:** Integrate smoke tests into GitHub Actions for automatic quality checks

**GitHub Actions Workflow:**

```yaml
# .github/workflows/deployment-checks.yml
name: Deployment Quality Checks

on:
  push:
    branches: [main, staging, develop]

jobs:
  smoke-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node and pnpm
        uses: pnpm/action-setup@v4

      - name: Install dependencies
        run: pnpm install

      - name: Run smoke tests
        run: pnpm --filter colossus-reference run test:e2e:smoke

      - name: Report results
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "❌ Smoke tests failed on ${{ github.ref }}"
            }
```

**Integration Points:**

- Run smoke tests on every push
- Block deployment if tests fail
- Report test results to Slack (optional)
- Track test history over time

---

## 📊 Metrics to Track

### Deployment Metrics

- **Deployment frequency**: How often we deploy
- **Deployment duration**: How long deployments take
- **Deployment success rate**: % of successful deployments
- **Rollback frequency**: How often we need to rollback
- **Time to rollback**: How long rollbacks take

### Quality Metrics

- **Smoke test pass rate**: % of passing smoke tests
- **Error rate**: Errors per deployment
- **Downtime**: Time sites are unavailable
- **Performance**: Build times, deployment times

### Target SLAs

- Deployment duration: <5 minutes per site
- Smoke test duration: <15 seconds per site
- Rollback time: <2 minutes
- Error detection: <5 minutes after deployment
- Uptime: 99.9%

---

## 🚨 Risk Mitigation

### Risk 1: Failed Deployment

**Impact:** Site goes down or has errors
**Mitigation:**

- Pre-deployment smoke tests
- Phased rollout (canary first)
- Automatic rollback on failure
- Error monitoring with Sentry

### Risk 2: Broken Rollback

**Impact:** Can't recover from bad deployment
**Mitigation:**

- Test rollback procedure weekly
- Maintain backup of last 10 deployments
- Document manual rollback procedure
- Keep git history clean

### Risk 3: Environment Configuration Issues

**Impact:** Wrong environment variables in production
**Mitigation:**

- Separate Vercel projects per environment
- Environment-specific validation
- Dry-run mode for testing
- Manual verification checklist

### Risk 4: Rate Limiting

**Impact:** Deployments fail due to API limits
**Mitigation:**

- Batch deployments with delays between phases
- Monitor rate limit headers
- Implement exponential backoff
- Cache deployment status

---

## 📚 Documentation to Create

1. **DEPLOYMENT_GUIDE.md**
   - How to deploy single site
   - How to deploy batch of sites
   - How to rollback
   - Troubleshooting common issues

2. **DEPLOYMENT_PLAYBOOK.md**
   - Step-by-step deployment procedures
   - Pre-deployment checklist
   - Post-deployment verification
   - Incident response procedures

3. **SENTRY_SETUP.md**
   - Sentry configuration
   - Error monitoring best practices
   - Alert configuration
   - Error triage workflow

4. **CI_CD_GUIDE.md**
   - GitHub Actions workflows
   - Quality gates
   - Integration testing
   - Deployment automation

---

## 🎉 Week 4 Success Indicators

### Technical Success

- ✅ Can deploy any site with single command
- ✅ Can deploy 10+ sites in <30 minutes
- ✅ Can rollback in <2 minutes
- ✅ Smoke tests integrated into CI/CD
- ✅ Sentry catching production errors

### Process Success

- ✅ Documented deployment procedures
- ✅ Tested rollback procedures
- ✅ Team trained on deployment tools
- ✅ Error monitoring dashboard operational

### Business Success

- ✅ Zero-downtime deployments
- ✅ Fast recovery from incidents
- ✅ Confidence to deploy frequently
- ✅ Ready to scale to 50 sites

---

## 📅 Timeline

**Day 1 (Today):**

- ✅ Research Vercel API capabilities
- ⏳ Install and configure Vercel CLI
- ⏳ Create strategy document (this file)
- ⏳ Start tools/deploy-site.ts

**Day 2:**

- Complete tools/deploy-site.ts
- Test single site deployment
- Start tools/deploy-batch.ts

**Day 3:**

- Complete tools/deploy-batch.ts
- Create tools/rollback.ts
- Test batch deployment + rollback

**Day 4:**

- Set up Sentry
- Integrate error monitoring
- Start CI/CD integration

**Day 5:**

- Complete CI/CD integration
- Create documentation
- Final testing

---

## 🔗 Resources

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Vercel API Reference](https://vercel.com/docs/rest-api)
- [Sentry Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright Documentation](https://playwright.dev/docs/intro)

---

**Status:** 📝 Planning Complete - Ready to Implement
**Next Action:** Install Vercel CLI and begin Phase 1
