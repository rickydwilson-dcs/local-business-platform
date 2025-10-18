# Complete Vercel Environment Variable Management

Comprehensive guide for managing **all** environment variables across all sites.

## Overview

The enhanced setup script (`setup-vercel-env-v2.ts`) handles:

1. ✅ **Platform-wide variables** - Same for all sites (R2, analytics, feature flags)
2. ✅ **Site-specific variables** - Different per site (business email, site URL)
3. ✅ **Selective updates** - R2-only mode, skip existing, single site
4. ✅ **Dry-run testing** - Test safely before applying changes

---

## Variable Categories

### 1. R2 Image Storage (Platform-wide)

**Same credentials for all sites:**

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `NEXT_PUBLIC_R2_PUBLIC_URL`

### 2. Email Service (Platform-wide or Site-specific)

**Option A - Shared key for all sites:**

- `RESEND_API_KEY` (one key, all sites share)

**Option B - Per-site keys:**

- Define `resendApiKey` in each site's config

### 3. Analytics (Platform-wide or Site-specific)

**Typically site-specific:**

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (different per site)
- `GA4_API_SECRET` (different per site)
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` (different per site)
- `FACEBOOK_ACCESS_TOKEN` (different per site)
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` (different per site)

**Currently configured as platform-wide** (you can override per site if needed)

### 4. Feature Flags (Platform-wide)

**Same for all sites (usually):**

- `FEATURE_ANALYTICS_ENABLED` (true/false)
- `FEATURE_SERVER_TRACKING` (true/false)
- `FEATURE_CONSENT_BANNER` (true/false)
- `FEATURE_GA4_ENABLED` (true/false)
- `FEATURE_FACEBOOK_PIXEL` (true/false)
- `FEATURE_GOOGLE_ADS` (true/false)

### 5. Business Info (Site-specific)

**Different for each site:**

- `BUSINESS_EMAIL` (e.g., joe@joesplumbing.com)
- `BUSINESS_NAME` (e.g., "Joe's Plumbing Canterbury")
- `NEXT_PUBLIC_SITE_URL` (e.g., https://joes-plumbing-canterbury.vercel.app)

---

## Configuration

### Step 1: Add Platform-wide Variables to .env.local

```bash
# .env.local - Add ALL these variables

# ===== VERCEL API =====
VERCEL_TOKEN=your_vercel_api_token

# ===== R2 (Required) =====
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=local-business-platform
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-abc123.r2.dev

# ===== EMAIL (Optional - if using shared key) =====
RESEND_API_KEY=re_xxxxxxxxxxxxx

# ===== ANALYTICS (Optional - if shared across sites) =====
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=xxxxxxxxxxxxx
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=123456789012345
FACEBOOK_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxx
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-123456789/AbCdEfGhIj

# ===== FEATURE FLAGS (Optional) =====
FEATURE_ANALYTICS_ENABLED=true
FEATURE_SERVER_TRACKING=true
FEATURE_CONSENT_BANNER=true
FEATURE_GA4_ENABLED=true
FEATURE_FACEBOOK_PIXEL=false
FEATURE_GOOGLE_ADS=false
```

### Step 2: Configure Site-Specific Values

Edit [tools/setup-vercel-env-v2.ts](../tools/setup-vercel-env-v2.ts):

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
  // Add site #3
  {
    slug: "bright-gardening-maidstone",
    vercelProjectName: "bright-gardening-maidstone",
    businessEmail: "info@brightgardening.co.uk",
    businessName: "Bright Gardening Services",
    siteUrl: "https://bright-gardening-maidstone.vercel.app",
    // Optional: Override shared Resend key
    resendApiKey: "site_specific_resend_key",
  },
  // ... add all 50 sites
];
```

---

## Usage

### Basic Commands

```bash
# Dry run (safe, shows what would happen)
pnpm setup:vercel-env-v2 --dry-run

# Configure all sites with all variables
pnpm setup:vercel-env-v2

# Configure only R2 variables (skip analytics, features, etc.)
pnpm setup:vercel-env-v2 --r2-only

# Configure single site
pnpm setup:vercel-env-v2 --site colossus-reference

# Skip variables that already exist (safe update)
pnpm setup:vercel-env-v2 --skip-existing

# Combine options
pnpm setup:vercel-env-v2 --site joes-plumbing-canterbury --r2-only --dry-run
```

### Common Scenarios

#### Scenario 1: First-time setup (all variables, all sites)

```bash
# Test first
pnpm setup:vercel-env-v2 --dry-run

# Apply
pnpm setup:vercel-env-v2
```

#### Scenario 2: Just add R2 to all sites

```bash
pnpm setup:vercel-env-v2 --r2-only
```

#### Scenario 3: Add new site

1. Add site config to `SITE_CONFIGS` array
2. Run:

```bash
pnpm setup:vercel-env-v2 --site new-site-slug
```

#### Scenario 4: Update existing sites (don't duplicate)

```bash
pnpm setup:vercel-env-v2 --skip-existing
```

#### Scenario 5: Update feature flags only

1. Update flags in `.env.local`
2. Run:

```bash
# This will fail on existing vars, but that's expected
# Only new/changed flags will be added
pnpm setup:vercel-env-v2 --skip-existing
```

---

## Output Example

```bash
$ pnpm setup:vercel-env-v2 --dry-run

🚀 Vercel Environment Variable Setup

⚠️  DRY RUN MODE - No changes will be made

✓ Loaded platform-wide credentials from .env.local
✓ Found 16 platform-wide variable(s)

📦 Configuring 2 site(s):


📦 colossus-reference
────────────────────────────────────────────────────────────
  ✓ Project ID: prj_abc123
  ✓ Existing variables: 0
  → Processing 19 variable(s)

  → R2_ACCOUNT_ID (would add to production, preview, development)
  → R2_ACCESS_KEY_ID (would add to production, preview, development)
  → R2_SECRET_ACCESS_KEY (would add to production, preview, development)
  → R2_BUCKET_NAME (would add to production, preview, development)
  → NEXT_PUBLIC_R2_PUBLIC_URL (would add to production, preview, development)
  → RESEND_API_KEY (would add to production, preview, development)
  → FEATURE_ANALYTICS_ENABLED (would add to production, preview, development)
  → FEATURE_SERVER_TRACKING (would add to production, preview, development)
  → FEATURE_CONSENT_BANNER (would add to production, preview, development)
  → FEATURE_GA4_ENABLED (would add to production, preview, development)
  ⊘ FEATURE_FACEBOOK_PIXEL (no value, skipping)
  ⊘ FEATURE_GOOGLE_ADS (no value, skipping)
  → BUSINESS_EMAIL (would add to production, preview, development)
  → BUSINESS_NAME (would add to production, preview, development)
  → NEXT_PUBLIC_SITE_URL (would add to production, preview, development)

  ✅ colossus-reference configured successfully


📦 joes-plumbing-canterbury
────────────────────────────────────────────────────────────
  ✓ Project ID: prj_xyz789
  ✓ Existing variables: 0
  → Processing 19 variable(s)

  → R2_ACCOUNT_ID (would add to production, preview, development)
  → R2_ACCESS_KEY_ID (would add to production, preview, development)
  → R2_SECRET_ACCESS_KEY (would add to production, preview, development)
  → R2_BUCKET_NAME (would add to production, preview, development)
  → NEXT_PUBLIC_R2_PUBLIC_URL (would add to production, preview, development)
  → RESEND_API_KEY (would add to production, preview, development)
  → FEATURE_ANALYTICS_ENABLED (would add to production, preview, development)
  → FEATURE_SERVER_TRACKING (would add to production, preview, development)
  → FEATURE_CONSENT_BANNER (would add to production, preview, development)
  → FEATURE_GA4_ENABLED (would add to production, preview, development)
  ⊘ FEATURE_FACEBOOK_PIXEL (no value, skipping)
  ⊘ FEATURE_GOOGLE_ADS (no value, skipping)
  → BUSINESS_EMAIL (would add to production, preview, development)
  → BUSINESS_NAME (would add to production, preview, development)
  → NEXT_PUBLIC_SITE_URL (would add to production, preview, development)

  ✅ joes-plumbing-canterbury configured successfully


══════════════════════════════════════════════════════════════════════
📊 SUMMARY
══════════════════════════════════════════════════════════════════════
Total sites:      2
Successful:       2
Failed:           0

Variables added:  0
Variables skipped: 0
Variables failed:  0

✓ Dry run complete - no changes made
  Run without --dry-run to apply changes
```

---

## Per-Site Analytics (Advanced)

If each site needs **different** analytics IDs:

### Option 1: Remove from Platform-wide

Edit `tools/setup-vercel-env-v2.ts`, comment out analytics in `PLATFORM_ENV_VARS`:

```typescript
// Comment these out if you need per-site analytics
// {
//   key: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
//   ...
// },
```

### Option 2: Add to Site Config

```typescript
interface SiteConfig {
  slug: string;
  vercelProjectName: string;
  businessEmail: string;
  businessName: string;
  siteUrl: string;

  // Add analytics fields
  gaMeasurementId?: string;
  ga4ApiSecret?: string;
  facebookPixelId?: string;
  facebookAccessToken?: string;
}

const SITE_CONFIGS: SiteConfig[] = [
  {
    slug: "colossus-reference",
    businessEmail: "enquiries@colossus-scaffolding.co.uk",
    businessName: "Colossus Scaffolding",
    siteUrl: "https://colossus-scaffolding.vercel.app",
    gaMeasurementId: "G-ABC123",
    ga4ApiSecret: "secret123",
  },
  // ... more sites
];
```

Then update `getSiteSpecificValue()` function to handle these fields.

---

## Maintenance

### Adding New Platform-wide Variables

1. Add to `.env.local`:

   ```bash
   NEW_PLATFORM_VAR=value
   ```

2. Add to `PLATFORM_ENV_VARS` array in script:

   ```typescript
   {
     key: 'NEW_PLATFORM_VAR',
     type: 'sensitive', // or 'plain'
     target: ['production', 'preview', 'development'],
     required: false,
     category: 'features', // or appropriate category
     description: 'Description here',
   },
   ```

3. Run update:
   ```bash
   pnpm setup:vercel-env-v2 --skip-existing
   ```

### Updating Variable Values

**Important:** This script only **adds** variables, it doesn't update existing ones.

To update a value:

**Option 1: Via Vercel Dashboard**

- Go to project → Settings → Environment Variables
- Edit the variable
- Redeploy

**Option 2: Delete and re-add**

- Delete variable in Vercel Dashboard
- Run script again (without --skip-existing)

**Option 3: Vercel CLI**

```bash
cd sites/colossus-reference
vercel env rm R2_ACCOUNT_ID production
vercel env add R2_ACCOUNT_ID production
```

### Removing Variables

Variables are **never automatically removed** by this script.

To remove:

- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Click trash icon next to variable

---

## Comparison: V1 vs V2

| Feature             | V1 (setup-vercel-env.ts) | V2 (setup-vercel-env-v2.ts) |
| ------------------- | ------------------------ | --------------------------- |
| R2 variables        | ✅                       | ✅                          |
| Email variables     | ❌                       | ✅                          |
| Analytics variables | ❌                       | ✅                          |
| Feature flags       | ❌                       | ✅                          |
| Site-specific vars  | ❌                       | ✅                          |
| R2-only mode        | ❌                       | ✅                          |
| Skip existing       | ❌                       | ✅                          |
| Dry run             | ✅                       | ✅                          |
| Single site         | ✅                       | ✅                          |

**Recommendation:** Use V2 for new setups. V1 is kept for R2-only scenarios.

---

## Troubleshooting

### "Variable already exists" errors

Use `--skip-existing`:

```bash
pnpm setup:vercel-env-v2 --skip-existing
```

### Wrong value was set

1. Delete in Vercel Dashboard
2. Fix value in `.env.local` or `SITE_CONFIGS`
3. Run script again

### Some sites succeeded, some failed

Check error messages for failed sites:

- "Project not found" → Site not deployed to Vercel yet
- "AccessDenied" → Check `VERCEL_TOKEN` has correct permissions

Re-run for failed sites only:

```bash
pnpm setup:vercel-env-v2 --site failed-site-slug
```

### Feature flag not working

1. Verify variable is set in Vercel
2. Check spelling matches code
3. Redeploy site (variables need new deployment)

---

## Security Notes

**Sensitive Variables:**

- `R2_SECRET_ACCESS_KEY` → type: 'sensitive'
- `RESEND_API_KEY` → type: 'sensitive'
- `GA4_API_SECRET` → type: 'sensitive'
- `FACEBOOK_ACCESS_TOKEN` → type: 'sensitive'

These are **encrypted** by Vercel and never visible in Dashboard.

**Public Variables:**

- `NEXT_PUBLIC_*` → Exposed to browser (intentional)
- `FEATURE_*` → Plain text (safe, just true/false)
- `BUSINESS_*` → Plain text (public info anyway)

**Never Commit:**

- `.env.local` → Already in `.gitignore`
- Real credentials anywhere in code

---

## Checklist

### Initial Setup

- [ ] All platform variables in `.env.local`
- [ ] `VERCEL_TOKEN` obtained and added
- [ ] All sites added to `SITE_CONFIGS`
- [ ] Business emails, names, URLs correct
- [ ] Dry run tested: `pnpm setup:vercel-env-v2 --dry-run`
- [ ] Script executed: `pnpm setup:vercel-env-v2`
- [ ] Sites redeployed
- [ ] Spot-check 2-3 sites in production

### Per New Site

- [ ] Site deployed to Vercel
- [ ] Site added to `SITE_CONFIGS`
- [ ] Run: `pnpm setup:vercel-env-v2 --site new-site-slug`
- [ ] Verify: `cd sites/new-site && vercel env ls`
- [ ] Redeploy site

### Maintenance

- [ ] Review variables every 90 days
- [ ] Rotate API tokens
- [ ] Update feature flags as needed
- [ ] Document changes in team wiki

---

## Quick Commands Reference

```bash
# Full setup (all sites, all variables)
pnpm setup:vercel-env-v2

# R2 only (all sites)
pnpm setup:vercel-env-v2 --r2-only

# Single site (all variables)
pnpm setup:vercel-env-v2 --site colossus-reference

# Update without duplicates
pnpm setup:vercel-env-v2 --skip-existing

# Test safely
pnpm setup:vercel-env-v2 --dry-run

# Combine flags
pnpm setup:vercel-env-v2 --site joes-plumbing --r2-only --dry-run
```

---

**Status:** Enhanced script ready! Configure all variables for all sites in one command.

**Time savings:** 4+ hours of manual work → 30 seconds automated 🎉
