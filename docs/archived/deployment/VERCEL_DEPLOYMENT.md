# Vercel Deployment Guide

## Overview

This monorepo deploys individual sites to Vercel. Each site in `sites/*` can be deployed as a separate Vercel project.

---

## Configuration

### Root Directory

Each Vercel project should be configured with:

- **Root Directory:** `sites/{site-name}` (e.g., `sites/colossus-reference`)
- **Framework:** Next.js (auto-detected)
- **Build Command:** Configured via `vercel.json` in each site
- **Install Command:** Runs from monorepo root via `vercel.json`

### Build Configuration

Each site has a `vercel.json` that configures:

```json
{
  "buildCommand": "cd ../.. && pnpm turbo run build --filter={site-name}",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile"
}
```

This ensures:

- ✅ Turborepo leverages caching
- ✅ All workspace dependencies are installed
- ✅ Only the target site is built

---

## Known Warnings

### pnpm Build Scripts Warning (Informational Only)

You may see this warning during deployment:

```
╭ Warning ─────────────────────────────────────────────────────────────────────╮
│   Ignored build scripts: esbuild, sharp, unrs-resolver.                      │
│   Run "pnpm approve-builds" to pick which dependencies should be allowed     │
│   to run scripts.                                                            │
╰──────────────────────────────────────────────────────────────────────────────╯
```

**This is informational only and does not affect your deployment.**

#### Why This Appears

pnpm v9+ introduced a security feature that warns about packages with install scripts. The packages listed (esbuild, sharp, unrs-resolver) are:

- ✅ Legitimate packages from npm
- ✅ Required by Next.js for builds and image optimization
- ✅ Automatically approved in CI/CD environments

#### What It Means

- The scripts **are running correctly** despite the warning
- Your deployment **will succeed**
- This is pnpm being security-conscious, not an error

#### How to Suppress (Optional)

If you want to suppress this warning completely, you can:

1. **Locally:** Run `pnpm config set enable-pre-post-scripts true`
2. **In Vercel:** Add environment variable `PNPM_ENABLE_PRE_POST_SCRIPTS=true`

However, **this is not necessary** - the warning is purely informational.

---

## Deployment Workflow

### First Deployment

1. **Create Vercel Project:**

   ```bash
   # In Vercel dashboard:
   # - Import from GitHub: local-business-platform
   # - Set Root Directory: sites/colossus-reference
   ```

2. **Automatic Deployments:**
   - Push to `main` triggers production deployment
   - Pull requests create preview deployments

### Adding New Sites

For each new site:

1. Create site directory: `sites/new-site-name/`
2. Add `vercel.json` with build configuration
3. Create new Vercel project pointing to `sites/new-site-name/`
4. Connect to same GitHub repository

This allows:

- 50 sites in one monorepo
- £20/month total (Vercel Pro team)
- Independent deployments
- Shared component library

---

## Troubleshooting

### Build Fails: "routes-manifest.json not found"

**Cause:** Vercel is trying to build the wrong directory (e.g., `packages/core-components`)

**Fix:** Set the **Root Directory** in Vercel project settings to `sites/{site-name}`

### Build Fails: "No package.json found"

**Cause:** Root directory not set correctly

**Fix:** Ensure Root Directory is `sites/{site-name}` (not just `sites/`)

### Build Slow / No Caching

**Cause:** Not using Turborepo filtering

**Fix:** Check `vercel.json` has: `--filter={site-name}` in buildCommand

---

## Performance

Expected build times:

- **First build:** ~30-40s (no cache)
- **Cached build:** ~10-15s (with Turborepo cache)
- **Per site:** 77 static pages in ~27s

---

## Cost

**Vercel Pro Team:** £20/month

- Unlimited deployments
- 50 projects (sites)
- Automatic preview deployments
- Zero-downtime deployments

**Total infrastructure cost:** ~£50-75/month for 50 sites

- Vercel: £20/month
- Cloudflare R2: £10/month (Week 3)
- Sentry: £0-25/month (optional)
- Claude API: £20/month (Week 5)

---

## References

- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Turborepo with Vercel](https://turbo.build/repo/docs/handbook/deploying-with-docker)
- [pnpm Workspaces](https://pnpm.io/workspaces)
