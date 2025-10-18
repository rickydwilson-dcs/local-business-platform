# Quick Guide: R2 + Vercel Environment Variables

This is the TL;DR version. For complete details, see [docs/R2_VERCEL_SETUP.md](docs/R2_VERCEL_SETUP.md).

## What You Need

5 environment variables for each site deployed to Vercel:

1. `R2_ACCOUNT_ID` - Your Cloudflare account ID
2. `R2_ACCESS_KEY_ID` - R2 API access key
3. `R2_SECRET_ACCESS_KEY` - R2 API secret key
4. `R2_BUCKET_NAME` - `local-business-platform`
5. `NEXT_PUBLIC_R2_PUBLIC_URL` - Your R2 public URL

---

## Option 1: Manual Setup (1-2 sites)

### Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project → **Settings** → **Environment Variables**
3. Add each of the 5 variables above
4. Select **all environments** (Production, Preview, Development)
5. Click **Save**
6. Redeploy site

**Time:** ~5 minutes per site

---

## Option 2: Automated Setup (All sites) ⭐ Recommended

### Prerequisites

1. **Vercel API Token:**
   - Go to https://vercel.com/account/tokens
   - Create token: "local-business-platform-api"
   - Add to `.env.local`:
     ```bash
     VERCEL_TOKEN=your_token_here
     ```

2. **R2 Credentials in .env.local:**
   ```bash
   R2_ACCOUNT_ID=...
   R2_ACCESS_KEY_ID=...
   R2_SECRET_ACCESS_KEY=...
   R2_BUCKET_NAME=local-business-platform
   NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-abc123.r2.dev
   ```

### Run Setup Script

```bash
# Test first (dry run)
pnpm setup:vercel-env --dry-run

# Apply to all sites
pnpm setup:vercel-env

# Apply to single site
pnpm setup:vercel-env --site colossus-reference
```

**Expected output:**

```
✅ Environment variables configured!

💡 Next steps:
   1. Redeploy affected sites for changes to take effect
   2. Verify images load correctly in production
```

**Time:** ~30 seconds for all sites

---

## Adding New Sites

When you create site #3, #4, #5... #50:

1. Edit `tools/setup-vercel-env.ts`
2. Add site slug to `SITES` array:
   ```typescript
   const SITES = [
     "colossus-reference",
     "joes-plumbing-canterbury",
     "your-new-site-slug", // Add here
   ];
   ```
3. Run `pnpm setup:vercel-env`
4. Done!

---

## Verify Setup

### Check variables are set:

```bash
# Via Vercel CLI
cd sites/colossus-reference
vercel env ls
```

### Test in production:

Create temporary API route [app/api/test-env/route.ts](app/api/test-env/route.ts):

```typescript
export async function GET() {
  return Response.json({
    hasR2: !!process.env.R2_ACCOUNT_ID,
    bucketName: process.env.R2_BUCKET_NAME,
    publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
  });
}
```

Visit: `https://your-site.vercel.app/api/test-env`

Expected: `{"hasR2": true, "bucketName": "local-business-platform", ...}`

**Delete test route after verification!**

---

## Troubleshooting

### Script fails with "VERCEL_TOKEN not found"

Add Vercel API token to `.env.local`:

```bash
VERCEL_TOKEN=your_token_here
```

Get from: https://vercel.com/account/tokens

### Script fails with "Project not found"

Make sure site is deployed to Vercel first:

```bash
cd sites/your-site
vercel
```

### Images not loading in production

1. Check env vars are set: `vercel env ls`
2. Redeploy site (variables only take effect on new deploys)
3. Enable R2 public access in Cloudflare
4. Check browser console for errors

---

## Security Notes

- `R2_SECRET_ACCESS_KEY` is **encrypted** automatically by Vercel
- Never commit `.env.local` to Git
- Rotate API tokens every 90 days
- Use separate tokens for dev/prod if possible

---

## Cost

**Vercel:** Environment variables are FREE on all plans

**R2:** No extra cost for API calls from Vercel

- Storage: ~£0.30/month for 25GB
- Reads: ~£1/month typical usage
- Egress: **FREE**

---

## Quick Commands

```bash
# Test R2 locally
pnpm test:r2

# Setup Vercel env vars (all sites)
pnpm setup:vercel-env

# Setup single site
pnpm setup:vercel-env --site colossus-reference

# Dry run (test only)
pnpm setup:vercel-env --dry-run

# List env vars for a site
cd sites/colossus-reference && vercel env ls
```

---

## Checklist

**One-Time Setup:**

- [ ] Get Vercel API token
- [ ] Add `VERCEL_TOKEN` to `.env.local`
- [ ] R2 credentials in `.env.local`
- [ ] Test locally: `pnpm test:r2`

**Per-Site Setup:**

- [ ] Site deployed to Vercel
- [ ] Add site to `SITES` array in `tools/setup-vercel-env.ts`
- [ ] Run `pnpm setup:vercel-env`
- [ ] Verify: `vercel env ls`
- [ ] Redeploy site
- [ ] Test images load

**For All 50 Sites:**

- [ ] All sites in `SITES` array
- [ ] Run `pnpm setup:vercel-env` once
- [ ] Trigger redeployments
- [ ] Spot-check 3-4 sites

---

## Next Steps

1. **Right now:** Add Vercel API token to `.env.local`
2. **Manual method:** Set up first site via Vercel Dashboard
3. **Automated method:** Use script for remaining sites

See [docs/R2_VERCEL_SETUP.md](docs/R2_VERCEL_SETUP.md) for complete guide with examples, API usage, and advanced scenarios.

---

**Quick Start:**

```bash
# 1. Get Vercel token → add to .env.local
# 2. Run setup
pnpm setup:vercel-env --dry-run
pnpm setup:vercel-env
# 3. Redeploy sites
# 4. Done! 🎉
```
