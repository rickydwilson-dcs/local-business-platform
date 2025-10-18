# Your Action Plan - R2 + Vercel Setup

Step-by-step checklist to get everything working.

## 🎯 Overview

You need to:

1. ✅ Set up R2 locally (10 min)
2. ✅ Configure Vercel environment variables (5 min)
3. ✅ Test everything works

**Total time:** ~15-20 minutes

---

## Phase 1: Local R2 Setup (10 minutes)

### ☐ Step 1: Get R2 Credentials from Cloudflare

1. Go to https://dash.cloudflare.com/ → **R2**
2. You have bucket `local-business-platform` ✅
3. Click **"Manage R2 API Tokens"**
4. Click **"Create API Token"**
   - Name: `local-business-platform-api`
   - Permissions: **Edit**
   - Apply to bucket: `local-business-platform`
5. Click **Create**
6. **SAVE THESE IMMEDIATELY:**
   - Access Key ID: `___________________________`
   - Secret Access Key: `___________________________`
7. Note your **Account ID** from R2 overview (top right): `___________________________`

### ☐ Step 2: Enable Public Access

1. In R2 bucket settings (`local-business-platform`)
2. Find **Public Access** or **R2.dev subdomain**
3. Click **Enable** or **Allow Access**
4. You'll get URL like: `https://pub-abc123xyz.r2.dev`
5. Save this URL: `___________________________`

### ☐ Step 3: Add to .env.local

```bash
# Add these NEW lines to .env.local:

# ===== CLOUDFLARE R2 (NEW) =====
R2_ACCOUNT_ID=your-account-id-here
R2_ACCESS_KEY_ID=your-access-key-here
R2_SECRET_ACCESS_KEY=your-secret-key-here
R2_BUCKET_NAME=local-business-platform
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-your-account-id.r2.dev
```

### ☐ Step 4: Test R2 Connection

```bash
pnpm test:r2
```

**Expected:**

```
✅ All tests passed! R2 is configured correctly.
```

**If it fails:** Check error message, fix credentials, try again.

---

## Phase 2: Vercel Setup (5 minutes)

You have two options. **Choose one:**

### Option A: Simple (R2 Only) - Recommended for now

Add just R2 variables to Vercel:

```bash
# 1. Get Vercel API token
#    Go to: https://vercel.com/account/tokens
#    Create token: "local-business-platform-api"
#    Copy token

# 2. Add to .env.local
VERCEL_TOKEN=your_vercel_token_here

# 3. Test
pnpm setup:vercel-env-v2 --r2-only --dry-run

# 4. Apply
pnpm setup:vercel-env-v2 --r2-only
```

**Result:** R2 added to both sites, existing variables untouched.

### Option B: Complete (All Variables)

Replicate entire variable setup to all sites:

```bash
# 1. Copy ALL existing values from colossus-scaffolding to .env.local:
RESEND_API_KEY=re_xxxxxxxxxxxxx
GA4_API_SECRET=xxxxxxxxxxxxx
FACEBOOK_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxx
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=123456789012345
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-123456789/AbCdEfGhIj
FEATURE_GA4_ENABLED=true
FEATURE_FACEBOOK_PIXEL=false
FEATURE_GOOGLE_ADS=false

# 2. Add R2 (from Phase 1)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=local-business-platform
NEXT_PUBLIC_R2_PUBLIC_URL=...

# 3. Get Vercel token (if not already done)
VERCEL_TOKEN=...

# 4. Configure sites in tools/setup-vercel-env-v2.ts
#    (Already done for your 2 sites!)

# 5. Test
pnpm setup:vercel-env-v2 --skip-existing --dry-run

# 6. Apply
pnpm setup:vercel-env-v2 --skip-existing
```

**Result:** All 16 variables on all sites, ready for scaling.

---

## Phase 3: Verification (5 minutes)

### ☐ Step 1: Check Variables Are Set

```bash
cd sites/colossus-reference
vercel env ls
```

**Expected:** See R2 variables listed (plus your existing 11)

### ☐ Step 2: Redeploy Sites

Variables only take effect on new deployments.

**Option 1: Wait for next push** (automatic)

**Option 2: Trigger manually**

1. Go to Vercel Dashboard
2. Select project
3. Go to Deployments
4. Click **•••** on latest
5. Click **Redeploy**
6. Repeat for other site

### ☐ Step 3: Test (Optional)

Once redeployed, create a test API route:

```typescript
// sites/colossus-reference/app/api/test-r2/route.ts
export async function GET() {
  return Response.json({
    hasR2: !!process.env.R2_ACCOUNT_ID,
    bucketName: process.env.R2_BUCKET_NAME,
    publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
  });
}
```

Visit: `https://colossus-scaffolding.vercel.app/api/test-r2`

**Expected:**

```json
{
  "hasR2": true,
  "bucketName": "local-business-platform",
  "publicUrl": "https://pub-abc123.r2.dev"
}
```

**Delete test route after verification!**

---

## Phase 4: First Image Upload (Optional - 5 minutes)

### ☐ Step 1: Prepare Test Images

```bash
# Create test directory
mkdir -p ~/test-images/colossus

# Copy 1-2 images there
cp /path/to/test/image.jpg ~/test-images/colossus/
```

### ☐ Step 2: Upload with Dry Run

```bash
pnpm images:intake colossus-reference ~/test-images/colossus/ --dry-run
```

**Check:** Should show what it would do without actually uploading.

### ☐ Step 3: Upload for Real

```bash
pnpm images:intake colossus-reference ~/test-images/colossus/
```

**Expected:**

```
✅ Image intake complete!
Total savings: 85.2%
```

### ☐ Step 4: Verify in R2

1. Go to Cloudflare Dashboard → R2 → `local-business-platform`
2. Browse → Should see: `colossus-reference/...`
3. Click through to verify images are there

### ☐ Step 5: Use Image in Site

```tsx
// Test component
const imageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/colossus-reference/test/image_01.webp`;

<Image src={imageUrl} alt="Test" width={800} height={600} />;
```

---

## 🎉 Success Criteria

You're done when:

- ✅ `pnpm test:r2` passes locally
- ✅ Vercel shows R2 variables for both sites
- ✅ Sites redeployed successfully
- ✅ Test images uploaded to R2
- ✅ Images visible in Cloudflare dashboard
- ✅ (Optional) Images load on deployed site

---

## 🐛 Troubleshooting

### Local test fails

**"Missing R2_ACCOUNT_ID"**
→ Add to `.env.local` (see Phase 1, Step 3)

**"AccessDenied"**
→ Check API token has "Edit" permissions
→ Regenerate token if needed

**"NoSuchBucket"**
→ Verify bucket name is `local-business-platform`

### Vercel script fails

**"VERCEL_TOKEN not found"**
→ Add to `.env.local`: `VERCEL_TOKEN=...`

**"Project not found"**
→ Site must be deployed to Vercel first

**"Variable already exists"**
→ Use `--skip-existing` flag
→ Or use `--r2-only` to skip existing variables

### Images not loading

**404 on image URL**
→ Check public access enabled in R2 bucket
→ Verify `NEXT_PUBLIC_R2_PUBLIC_URL` is correct
→ Check image was actually uploaded

**Images work locally but not on Vercel**
→ Verify variables set in Vercel Dashboard
→ Redeploy site (variables need new deployment)

---

## 📚 Documentation Quick Links

**Start here:**

- [VERCEL_VARIABLES_MAPPING.md](VERCEL_VARIABLES_MAPPING.md) - Your exact setup

**Setup guides:**

- [R2_NEXT_STEPS.md](R2_NEXT_STEPS.md) - Local R2 setup
- [VERCEL_SETUP_CHOOSE.md](VERCEL_SETUP_CHOOSE.md) - Which script to use
- [R2_COMPLETE_SETUP.md](R2_COMPLETE_SETUP.md) - Everything in one place

**Detailed guides:**

- [docs/R2_SETUP.md](docs/R2_SETUP.md) - Complete R2 guide
- [docs/VERCEL_ENV_COMPLETE.md](docs/VERCEL_ENV_COMPLETE.md) - Complete Vercel guide

**Tools:**

- [tools/README.md](tools/README.md) - Tool documentation

---

## ⏱️ Time Breakdown

| Task                 | Time        | Done? |
| -------------------- | ----------- | ----- |
| Get R2 credentials   | 5 min       | ☐     |
| Enable public access | 1 min       | ☐     |
| Add to .env.local    | 2 min       | ☐     |
| Test R2 connection   | 1 min       | ☐     |
| Get Vercel token     | 2 min       | ☐     |
| Run Vercel script    | 1 min       | ☐     |
| Redeploy sites       | 2 min       | ☐     |
| Verification         | 5 min       | ☐     |
| **Total**            | **~20 min** |       |

---

## 🎯 Next Steps After Setup

Once everything is working:

1. **Upload real images** for both sites
2. **Update components** to use R2 URLs
3. **Remove images from Git** (if any)
4. **Add site #3** using same process
5. **Document** your team workflow

For site #3 onwards:

```bash
# 1. Add to SITE_CONFIGS in tools/setup-vercel-env-v2.ts
# 2. Run:
pnpm setup:vercel-env-v2 --site new-site-slug
# 3. Done!
```

---

## ✅ Final Checklist

### Local Setup

- [ ] R2 account ID obtained
- [ ] R2 API token created
- [ ] Public access enabled
- [ ] Credentials in `.env.local`
- [ ] `pnpm test:r2` passes

### Vercel Setup

- [ ] Vercel API token obtained
- [ ] Token in `.env.local`
- [ ] Script executed successfully
- [ ] Variables visible in Vercel Dashboard
- [ ] Sites redeployed

### Production Ready

- [ ] Test images uploaded
- [ ] Images in R2 bucket
- [ ] Images load in browser
- [ ] No console errors
- [ ] Existing functionality still works

---

**Status:** Ready to start! Begin with Phase 1. 🚀

**Estimated completion:** 15-20 minutes from now.

**Need help?** Check troubleshooting section or documentation links above.
