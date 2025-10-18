# Which Vercel Setup Script Should I Use?

Quick guide to choose between the two automation scripts.

## TL;DR

**Just setting up R2?** → Use V1 (simpler, R2-only)
**Setting up everything?** → Use V2 (comprehensive, all variables)

---

## Script Comparison

### V1: setup-vercel-env.ts (R2-Only)

**Purpose:** Configure R2 image storage credentials only

**Variables it handles:**

- R2_ACCOUNT_ID
- R2_ACCESS_KEY_ID
- R2_SECRET_ACCESS_KEY
- R2_BUCKET_NAME
- NEXT_PUBLIC_R2_PUBLIC_URL

**Pros:**

- ✅ Simple and focused
- ✅ Perfect for R2 setup
- ✅ Less configuration needed

**Cons:**

- ❌ Only handles R2 variables
- ❌ Need to manually add other variables

**Use when:**

- First-time R2 setup
- You only need R2 configured
- Other variables already set manually

**Command:**

```bash
pnpm setup:vercel-env
```

---

### V2: setup-vercel-env-v2.ts (Complete)

**Purpose:** Configure ALL environment variables for all sites

**Variables it handles:**

- ✅ R2 (5 variables)
- ✅ Email / Resend (1 variable)
- ✅ Analytics - GA4, Facebook, Google Ads (6 variables)
- ✅ Feature flags (6 variables)
- ✅ Business info - per site (3 variables)
- **Total: ~20 variables per site**

**Pros:**

- ✅ Handles everything in one go
- ✅ Site-specific configuration
- ✅ More options (--r2-only, --skip-existing)
- ✅ Better for scaling to 50 sites

**Cons:**

- ❌ More configuration needed upfront
- ❌ Need to define site configs

**Use when:**

- Setting up new sites from scratch
- Want to manage all variables centrally
- Scaling to many sites
- Need site-specific values (business email, etc.)

**Command:**

```bash
pnpm setup:vercel-env-v2
```

---

## Decision Tree

```
Need to set up Vercel environment variables?
│
├─ Only R2 credentials?
│  │
│  ├─ Yes → Use V1 (setup:vercel-env)
│  │
│  └─ No, I need analytics, email, feature flags too
│     └─ Use V2 (setup:vercel-env-v2)
│
└─ Already have some variables set?
   │
   ├─ Yes → Use V2 with --skip-existing
   │
   └─ No, fresh setup
      └─ Use V2 for complete setup
```

---

## Usage Examples

### Scenario 1: First-time R2 setup only

**Use V1:**

```bash
# Add R2 credentials to .env.local
# Then:
pnpm setup:vercel-env --dry-run
pnpm setup:vercel-env
```

**Result:** R2 configured, you manually add other variables later

---

### Scenario 2: Complete new site setup

**Use V2:**

```bash
# 1. Add all platform variables to .env.local
# 2. Add site to SITE_CONFIGS in tools/setup-vercel-env-v2.ts
# 3. Run:
pnpm setup:vercel-env-v2 --site new-site-slug --dry-run
pnpm setup:vercel-env-v2 --site new-site-slug
```

**Result:** Everything configured (R2, email, analytics, features, business info)

---

### Scenario 3: Bulk setup for all sites

**Use V2:**

```bash
# 1. Define all sites in SITE_CONFIGS
# 2. Add all platform variables to .env.local
# 3. Run:
pnpm setup:vercel-env-v2 --dry-run
pnpm setup:vercel-env-v2
```

**Result:** All 50 sites fully configured in 30 seconds

---

### Scenario 4: Just add R2 to existing sites

**Use V2 with --r2-only:**

```bash
pnpm setup:vercel-env-v2 --r2-only --skip-existing
```

**Result:** R2 added, existing variables untouched

---

## Migration Path

### Currently using V1 → Migrate to V2

**Why migrate?**

- Centralize all variable management
- Easier to add new sites
- Better for long-term maintenance

**How to migrate:**

1. **Create site configs:**
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
     // ... more sites
   ];
   ```

2. **Add all platform variables to .env.local:**

   ```bash
   # R2 (already have from V1)
   R2_ACCOUNT_ID=...
   R2_ACCESS_KEY_ID=...
   # ... etc

   # Add new ones:
   RESEND_API_KEY=...
   FEATURE_ANALYTICS_ENABLED=true
   # ... etc
   ```

3. **Test with dry-run:**

   ```bash
   pnpm setup:vercel-env-v2 --dry-run --skip-existing
   ```

4. **Run for real:**
   ```bash
   pnpm setup:vercel-env-v2 --skip-existing
   ```

**Result:** V2 adds missing variables, skips R2 (already set by V1)

---

## Recommendations

### For Your Current Setup (2 sites)

**Start with V1** for R2:

```bash
pnpm setup:vercel-env
```

**Later, migrate to V2** when adding site #3+:

```bash
# Configure V2
pnpm setup:vercel-env-v2 --skip-existing
```

### For Scaling to 50 Sites

**Use V2 from the start:**

- Spend 30 minutes configuring V2 properly
- Save 4+ hours on manual variable management
- Consistent setup across all sites

---

## Quick Command Reference

### V1 Commands

```bash
# R2 only - all sites
pnpm setup:vercel-env

# R2 only - single site
pnpm setup:vercel-env --site colossus-reference

# Test first
pnpm setup:vercel-env --dry-run
```

### V2 Commands

```bash
# All variables - all sites
pnpm setup:vercel-env-v2

# All variables - single site
pnpm setup:vercel-env-v2 --site colossus-reference

# R2 only mode
pnpm setup:vercel-env-v2 --r2-only

# Skip existing (safe update)
pnpm setup:vercel-env-v2 --skip-existing

# Test first
pnpm setup:vercel-env-v2 --dry-run

# Combine options
pnpm setup:vercel-env-v2 --site joes-plumbing --r2-only --skip-existing --dry-run
```

---

## Files to Configure

### V1 Setup

1. `.env.local` - Add R2 credentials
2. `tools/setup-vercel-env.ts` - Update `SITES` array

### V2 Setup

1. `.env.local` - Add ALL platform credentials
2. `tools/setup-vercel-env-v2.ts` - Update `SITE_CONFIGS` array

---

## Summary

| Aspect            | V1          | V2               |
| ----------------- | ----------- | ---------------- |
| **Variables**     | 5 (R2 only) | ~20 (everything) |
| **Setup time**    | 5 minutes   | 30 minutes       |
| **Per-site time** | 30 seconds  | 30 seconds       |
| **Site-specific** | No          | Yes              |
| **Feature flags** | No          | Yes              |
| **Analytics**     | No          | Yes              |
| **Email**         | No          | Yes              |
| **Best for**      | R2 setup    | Complete setup   |
| **Scaling**       | Good        | Excellent        |

---

**My Recommendation for You:**

1. **Now (2 sites):** Use V1 to quickly set up R2
2. **Site #3-5:** Migrate to V2, add all variables
3. **Site #6-50:** V2 makes it trivial

**Time investment:**

- V1 now: 5 minutes
- V2 migration: 30 minutes
- Future sites: 30 seconds each (with V2)

**Total time saved: 4+ hours** over 50 sites 🎉

---

See detailed guides:

- [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md) - V1 detailed guide
- [docs/VERCEL_ENV_COMPLETE.md](docs/VERCEL_ENV_COMPLETE.md) - V2 detailed guide
