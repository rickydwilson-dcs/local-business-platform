# Vercel Variables Mapping

Exact mapping of your current Vercel variables to the automation script.

## ✅ Your Current Variables (from colossus-scaffolding)

Based on what you showed me:

| Variable                               | Environments         | Type      | In Script?             |
| -------------------------------------- | -------------------- | --------- | ---------------------- |
| `FEATURE_GA4_ENABLED`                  | All                  | Plain     | ✅ Yes                 |
| `GA4_API_SECRET`                       | Production + Preview | Sensitive | ✅ Yes                 |
| `BUSINESS_EMAIL`                       | All                  | Plain     | ✅ Yes (site-specific) |
| `BUSINESS_NAME`                        | All                  | Plain     | ✅ Yes (site-specific) |
| `RESEND_API_KEY`                       | All                  | Sensitive | ✅ Yes                 |
| `FACEBOOK_ACCESS_TOKEN`                | Production + Preview | Sensitive | ✅ Yes                 |
| `FEATURE_FACEBOOK_PIXEL`               | All                  | Plain     | ✅ Yes                 |
| `FEATURE_GOOGLE_ADS`                   | All                  | Plain     | ✅ Yes                 |
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`        | All                  | Plain     | ✅ Yes                 |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` | All                  | Plain     | ✅ Yes                 |
| `NEXT_PUBLIC_SITE_URL`                 | Production           | Plain     | ✅ Yes (site-specific) |

**Total: 11 existing variables** ✅ All covered by V2 script!

## 🆕 New Variables (R2)

The script will ADD these for R2:

| Variable                    | Environments | Type      | Purpose               |
| --------------------------- | ------------ | --------- | --------------------- |
| `R2_ACCOUNT_ID`             | All          | Sensitive | Cloudflare account ID |
| `R2_ACCESS_KEY_ID`          | All          | Sensitive | R2 API access key     |
| `R2_SECRET_ACCESS_KEY`      | All          | Sensitive | R2 API secret         |
| `R2_BUCKET_NAME`            | All          | Plain     | Bucket name           |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | All          | Plain     | Public image URL      |

**Total: 5 new R2 variables**

---

## 📊 Complete Variable List Per Site

After running the script, each site will have **16 variables**:

### Platform-wide (11 variables) - Same for all sites

1. `R2_ACCOUNT_ID` (All envs)
2. `R2_ACCESS_KEY_ID` (All envs)
3. `R2_SECRET_ACCESS_KEY` (All envs)
4. `R2_BUCKET_NAME` (All envs)
5. `NEXT_PUBLIC_R2_PUBLIC_URL` (All envs)
6. `RESEND_API_KEY` (All envs)
7. `GA4_API_SECRET` (Prod + Preview only)
8. `FACEBOOK_ACCESS_TOKEN` (Prod + Preview only)
9. `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` (All envs)
10. `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` (All envs)
11. `FEATURE_GA4_ENABLED` (All envs)
12. `FEATURE_FACEBOOK_PIXEL` (All envs)
13. `FEATURE_GOOGLE_ADS` (All envs)

### Site-specific (3 variables) - Different per site

14. `BUSINESS_EMAIL` (All envs) - e.g., `joe@joesplumbing.com`
15. `BUSINESS_NAME` (All envs) - e.g., `"Joe's Plumbing Canterbury"`
16. `NEXT_PUBLIC_SITE_URL` (All envs) - e.g., `https://joes-plumbing-canterbury.vercel.app`

---

## 🔧 How to Configure

### Step 1: Add Platform Variables to .env.local

```bash
# ===== VERCEL API =====
VERCEL_TOKEN=your_vercel_token_here

# ===== R2 (NEW - you need to add these) =====
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=local-business-platform
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-abc123.r2.dev

# ===== EMAIL (Already have) =====
RESEND_API_KEY=re_xxxxxxxxxxxxx

# ===== ANALYTICS (Already have) =====
GA4_API_SECRET=xxxxxxxxxxxxx
FACEBOOK_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxx
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=123456789012345
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-123456789/AbCdEfGhIj

# ===== FEATURE FLAGS (Already have) =====
FEATURE_GA4_ENABLED=true
FEATURE_FACEBOOK_PIXEL=false
FEATURE_GOOGLE_ADS=false
```

### Step 2: Configure Sites in Script

Edit `tools/setup-vercel-env-v2.ts`:

```typescript
const SITE_CONFIGS: SiteConfig[] = [
  {
    slug: "colossus-reference",
    vercelProjectName: "colossus-reference",
    businessEmail: "enquiries@colossus-scaffolding.co.uk",
    businessName: "Colossus Scaffolding",
    siteUrl: "https://colossus-scaffolding.vercel.app",
  },
  {
    slug: "joes-plumbing-canterbury",
    vercelProjectName: "joes-plumbing-canterbury",
    businessEmail: "joe@joesplumbing.com",
    businessName: "Joe's Plumbing Canterbury",
    siteUrl: "https://joes-plumbing-canterbury.vercel.app",
  },
  // Add more sites...
];
```

### Step 3: Run Script

```bash
# Test first (safe)
pnpm setup:vercel-env-v2 --dry-run

# Add R2 only (since other vars already exist)
pnpm setup:vercel-env-v2 --r2-only

# OR: Add everything with --skip-existing (won't duplicate)
pnpm setup:vercel-env-v2 --skip-existing
```

---

## 🎯 Recommended Approach

Since you **already have 11 variables set** in Vercel:

### Option A: R2-Only Mode (Safest)

```bash
# Only adds the 5 new R2 variables
pnpm setup:vercel-env-v2 --r2-only --dry-run
pnpm setup:vercel-env-v2 --r2-only
```

**Result:**

- Adds: R2 variables (5 new)
- Skips: Existing variables (11 existing)
- Total: 16 variables per site

### Option B: Skip-Existing Mode (Complete)

```bash
# Attempts to add all 16, but skips any that exist
pnpm setup:vercel-env-v2 --skip-existing --dry-run
pnpm setup:vercel-env-v2 --skip-existing
```

**Result:**

- Adds: R2 variables (5 new)
- Skips: Existing variables (11 existing)
- Total: 16 variables per site

**Both options achieve the same result!** Option A is clearer in intent.

---

## ⚠️ Important Notes

### 1. NEXT_PUBLIC_SITE_URL Target

Your current setup:

- `NEXT_PUBLIC_SITE_URL` → **Production only**

Script default:

- `NEXT_PUBLIC_SITE_URL` → **All environments**

**Recommendation:** Keep script default (all environments). Preview/dev deployments need the correct URL too.

If you want Production-only, edit the script:

```typescript
{
  key: 'NEXT_PUBLIC_SITE_URL',
  type: 'plain',
  target: ['production'], // ← Change this
  required: true,
  category: 'business',
  description: 'Public site URL',
},
```

### 2. Missing from Your List

I noticed you don't have these in your current Vercel setup:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics measurement ID

**Did you mean to have this?** If yes, add to `.env.local`:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

If not needed, the script will skip it (not required).

### 3. Variable Types Match

The script correctly sets:

- **Sensitive:** `GA4_API_SECRET`, `FACEBOOK_ACCESS_TOKEN`, `R2_SECRET_ACCESS_KEY`, etc.
- **Plain:** Feature flags, public IDs, business info

Vercel encrypts "sensitive" variables automatically.

---

## 🧪 Testing

### Before Running

```bash
# Copy current colossus-reference values to .env.local
RESEND_API_KEY=<copy from Vercel>
GA4_API_SECRET=<copy from Vercel>
FACEBOOK_ACCESS_TOKEN=<copy from Vercel>
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=<copy from Vercel>
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=<copy from Vercel>
FEATURE_GA4_ENABLED=true
FEATURE_FACEBOOK_PIXEL=false
FEATURE_GOOGLE_ADS=false

# Add NEW R2 credentials
R2_ACCOUNT_ID=<from Cloudflare>
R2_ACCESS_KEY_ID=<from Cloudflare>
R2_SECRET_ACCESS_KEY=<from Cloudflare>
R2_BUCKET_NAME=local-business-platform
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-abc123.r2.dev
```

### Dry Run Test

```bash
pnpm setup:vercel-env-v2 --r2-only --dry-run
```

**Expected output:**

```
📦 colossus-reference
────────────────────────────────────────────────────────────
  ✓ Project ID: prj_abc123
  ✓ Existing variables: 11
  → Processing 5 variable(s)

  → R2_ACCOUNT_ID (would add to production, preview, development)
  → R2_ACCESS_KEY_ID (would add to production, preview, development)
  → R2_SECRET_ACCESS_KEY (would add to production, preview, development)
  → R2_BUCKET_NAME (would add to production, preview, development)
  → NEXT_PUBLIC_R2_PUBLIC_URL (would add to production, preview, development)

  ✅ colossus-reference configured successfully
```

### Apply for Real

```bash
pnpm setup:vercel-env-v2 --r2-only
```

### Verify

```bash
cd sites/colossus-reference
vercel env ls
```

**Expected:** 16 variables listed (11 existing + 5 new R2)

---

## 📋 Checklist

**Before Running Script:**

- [ ] Vercel API token in `.env.local`
- [ ] R2 credentials in `.env.local`
- [ ] All existing platform variables copied to `.env.local`
- [ ] Site configs defined in script (`SITE_CONFIGS`)
- [ ] Dry run tested successfully

**After Running Script:**

- [ ] Script completed without errors
- [ ] Verify with `vercel env ls` on sample site
- [ ] R2 variables present (5 new)
- [ ] Existing variables unchanged (11 existing)
- [ ] Redeploy sites
- [ ] Test images load from R2
- [ ] Test existing functionality (email, analytics) still works

---

## 🎉 Summary

**Your situation:**

- ✅ Already have 11/16 variables in Vercel
- ✅ Script covers all 11 existing variables
- ✅ Script adds 5 new R2 variables
- ✅ No duplication or conflicts

**Action:**

```bash
# 1. Copy existing values to .env.local
# 2. Add R2 credentials to .env.local
# 3. Configure sites in script
# 4. Run:
pnpm setup:vercel-env-v2 --r2-only
```

**Result:** All sites have complete set of 16 variables in ~30 seconds! 🚀

---

**Questions?** See:

- [VERCEL_SETUP_CHOOSE.md](VERCEL_SETUP_CHOOSE.md) - Which script to use
- [docs/VERCEL_ENV_COMPLETE.md](docs/VERCEL_ENV_COMPLETE.md) - Complete V2 guide
