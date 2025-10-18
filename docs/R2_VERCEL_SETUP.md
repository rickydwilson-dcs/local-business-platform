# R2 + Vercel Environment Variables Setup

Guide for configuring Cloudflare R2 environment variables in Vercel for production deployments.

## Overview

For your sites to access R2 images in production, you need to add the R2 credentials as environment variables in Vercel. This guide covers:

1. Adding variables to individual sites
2. Managing variables across multiple sites
3. Environment-specific configurations
4. Security best practices

---

## Method 1: Single Site Setup (Manual)

Use this for your first few sites to understand the process.

### Step 1: Navigate to Project Settings

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (e.g., `colossus-reference` or `joes-plumbing-canterbury`)
3. Click **Settings** tab
4. Click **Environment Variables** in the sidebar

### Step 2: Add R2 Variables

Add these 5 environment variables:

#### Variable 1: R2_ACCOUNT_ID

- **Name:** `R2_ACCOUNT_ID`
- **Value:** Your Cloudflare account ID (e.g., `abc123def456`)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### Variable 2: R2_ACCESS_KEY_ID

- **Name:** `R2_ACCESS_KEY_ID`
- **Value:** Your R2 access key ID
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### Variable 3: R2_SECRET_ACCESS_KEY

- **Name:** `R2_SECRET_ACCESS_KEY`
- **Value:** Your R2 secret access key
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### Variable 4: R2_BUCKET_NAME

- **Name:** `R2_BUCKET_NAME`
- **Value:** `local-business-platform`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### Variable 5: NEXT_PUBLIC_R2_PUBLIC_URL

- **Name:** `NEXT_PUBLIC_R2_PUBLIC_URL`
- **Value:** `https://pub-YOUR_ACCOUNT_ID.r2.dev` (or your custom domain)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

### Step 3: Redeploy Site

After adding variables, you need to redeploy:

1. Go to **Deployments** tab
2. Click **•••** on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

✅ Your site can now access R2 images!

---

## Method 2: Bulk Setup via Vercel CLI (Recommended for Multiple Sites)

For managing 50 sites efficiently, use the Vercel CLI.

### Step 1: Install Vercel CLI

```bash
pnpm add -g vercel

# Login to Vercel
vercel login
```

### Step 2: Link Your Projects

```bash
# Navigate to site directory
cd sites/colossus-reference

# Link to Vercel project
vercel link

# Repeat for each site
cd ../joes-plumbing-canterbury
vercel link
```

### Step 3: Create Environment Variable Script

Create `tools/setup-vercel-env.sh`:

```bash
#!/bin/bash
# Setup R2 environment variables for all Vercel projects

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load R2 credentials from .env.local
source .env.local

# List of all site slugs
SITES=(
  "colossus-reference"
  "joes-plumbing-canterbury"
  # Add more sites here as you create them
)

echo -e "${BLUE}🚀 Setting up R2 environment variables for Vercel projects${NC}\n"

# Loop through each site
for SITE in "${SITES[@]}"; do
  echo -e "${GREEN}📦 Setting up $SITE...${NC}"

  cd "sites/$SITE"

  # Set environment variables (all environments)
  vercel env add R2_ACCOUNT_ID production <<< "$R2_ACCOUNT_ID"
  vercel env add R2_ACCOUNT_ID preview <<< "$R2_ACCOUNT_ID"
  vercel env add R2_ACCOUNT_ID development <<< "$R2_ACCOUNT_ID"

  vercel env add R2_ACCESS_KEY_ID production <<< "$R2_ACCESS_KEY_ID"
  vercel env add R2_ACCESS_KEY_ID preview <<< "$R2_ACCESS_KEY_ID"
  vercel env add R2_ACCESS_KEY_ID development <<< "$R2_ACCESS_KEY_ID"

  vercel env add R2_SECRET_ACCESS_KEY production <<< "$R2_SECRET_ACCESS_KEY"
  vercel env add R2_SECRET_ACCESS_KEY preview <<< "$R2_SECRET_ACCESS_KEY"
  vercel env add R2_SECRET_ACCESS_KEY development <<< "$R2_SECRET_ACCESS_KEY"

  vercel env add R2_BUCKET_NAME production <<< "$R2_BUCKET_NAME"
  vercel env add R2_BUCKET_NAME preview <<< "$R2_BUCKET_NAME"
  vercel env add R2_BUCKET_NAME development <<< "$R2_BUCKET_NAME"

  vercel env add NEXT_PUBLIC_R2_PUBLIC_URL production <<< "$NEXT_PUBLIC_R2_PUBLIC_URL"
  vercel env add NEXT_PUBLIC_R2_PUBLIC_URL preview <<< "$NEXT_PUBLIC_R2_PUBLIC_URL"
  vercel env add NEXT_PUBLIC_R2_PUBLIC_URL development <<< "$NEXT_PUBLIC_R2_PUBLIC_URL"

  echo -e "${GREEN}✅ $SITE configured${NC}\n"

  cd ../..
done

echo -e "${BLUE}🎉 All sites configured!${NC}"
echo -e "${BLUE}💡 Don't forget to redeploy sites for changes to take effect${NC}"
```

### Step 4: Make Script Executable and Run

```bash
chmod +x tools/setup-vercel-env.sh
./tools/setup-vercel-env.sh
```

---

## Method 3: Vercel API (Most Scalable)

For automated management of many sites, use the Vercel API.

### Step 1: Get Vercel API Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click **Create Token**
3. Name: `local-business-platform-api`
4. Scope: Full Account
5. Save token to `.env.local`:
   ```bash
   VERCEL_TOKEN=your_vercel_token_here
   ```

### Step 2: Create Node.js Script

Create `tools/setup-vercel-env.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * Setup R2 environment variables for all Vercel projects
 * Uses Vercel API for bulk configuration
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

interface VercelEnvVar {
  key: string;
  value: string;
  type: "encrypted" | "plain";
  target: ("production" | "preview" | "development")[];
}

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional for team accounts

// Sites to configure
const SITES = [
  "colossus-reference",
  "joes-plumbing-canterbury",
  // Add more sites here
];

// R2 environment variables to add
const R2_ENV_VARS: Omit<VercelEnvVar, "value">[] = [
  { key: "R2_ACCOUNT_ID", type: "encrypted", target: ["production", "preview", "development"] },
  { key: "R2_ACCESS_KEY_ID", type: "encrypted", target: ["production", "preview", "development"] },
  {
    key: "R2_SECRET_ACCESS_KEY",
    type: "encrypted",
    target: ["production", "preview", "development"],
  },
  { key: "R2_BUCKET_NAME", type: "plain", target: ["production", "preview", "development"] },
  {
    key: "NEXT_PUBLIC_R2_PUBLIC_URL",
    type: "plain",
    target: ["production", "preview", "development"],
  },
];

async function getProjectId(projectName: string): Promise<string | null> {
  const url = VERCEL_TEAM_ID
    ? `https://api.vercel.com/v9/projects/${projectName}?teamId=${VERCEL_TEAM_ID}`
    : `https://api.vercel.com/v9/projects/${projectName}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.id;
}

async function addEnvVar(projectId: string, envVar: VercelEnvVar): Promise<boolean> {
  const url = VERCEL_TEAM_ID
    ? `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${VERCEL_TEAM_ID}`
    : `https://api.vercel.com/v10/projects/${projectId}/env`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(envVar),
  });

  return response.ok;
}

async function main() {
  console.log("🚀 Setting up R2 environment variables for Vercel projects\n");

  if (!VERCEL_TOKEN) {
    console.error("❌ VERCEL_TOKEN not found in .env.local");
    console.error("   Get token from: https://vercel.com/account/tokens");
    process.exit(1);
  }

  // Get R2 credentials from environment
  const r2Credentials: Record<string, string> = {
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID || "",
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || "",
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || "",
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME || "local-business-platform",
    NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "",
  };

  // Validate credentials
  for (const [key, value] of Object.entries(r2Credentials)) {
    if (!value) {
      console.error(`❌ ${key} not found in .env.local`);
      process.exit(1);
    }
  }

  // Process each site
  for (const site of SITES) {
    console.log(`📦 Configuring ${site}...`);

    // Get project ID
    const projectId = await getProjectId(site);
    if (!projectId) {
      console.error(`  ❌ Project not found: ${site}`);
      continue;
    }

    // Add each environment variable
    let success = true;
    for (const envVarTemplate of R2_ENV_VARS) {
      const envVar: VercelEnvVar = {
        ...envVarTemplate,
        value: r2Credentials[envVarTemplate.key],
      };

      const added = await addEnvVar(projectId, envVar);
      if (!added) {
        console.error(`  ❌ Failed to add ${envVar.key}`);
        success = false;
      }
    }

    if (success) {
      console.log(`  ✅ ${site} configured\n`);
    }
  }

  console.log("🎉 All sites configured!");
  console.log("💡 Redeploy sites for changes to take effect");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
```

### Step 3: Add Script to package.json

```json
{
  "scripts": {
    "setup:vercel-env": "tsx tools/setup-vercel-env.ts"
  }
}
```

### Step 4: Run Script

```bash
pnpm setup:vercel-env
```

---

## Environment-Specific Configurations

### Production vs Preview vs Development

You can set different values per environment:

**Production:** Live sites

- Use production R2 bucket
- Or use production prefix: `prod/`

**Preview:** Pull request deployments

- Same bucket is fine (images are read-only)
- Or use preview prefix: `preview/`

**Development:** Local Vercel dev

- Same bucket is fine
- Or use dev prefix: `dev/`

### Recommended: Single Bucket with Prefixes

Most cost-effective approach:

```bash
# Production images
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-abc123.r2.dev

# Preview images (optional, can use same as prod)
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-abc123.r2.dev/preview

# Development images (optional)
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-abc123.r2.dev/dev
```

For now, **use the same bucket and URL for all environments** - it's simpler and images are read-only anyway.

---

## Verifying Variables Are Set

### Via Vercel Dashboard

1. Go to Project → Settings → Environment Variables
2. Check all 5 variables are listed
3. Verify they're enabled for correct environments

### Via Vercel CLI

```bash
cd sites/colossus-reference
vercel env ls
```

Expected output:

```
Environment Variables
┌─────────────────────────────┬───────────┬─────────────┬─────────┐
│ Name                        │ Value     │ Environments│ Created │
├─────────────────────────────┼───────────┼─────────────┼─────────┤
│ R2_ACCOUNT_ID               │ [hidden]  │ Production  │ 1d ago  │
│ R2_ACCESS_KEY_ID            │ [hidden]  │ Production  │ 1d ago  │
│ R2_SECRET_ACCESS_KEY        │ [hidden]  │ Production  │ 1d ago  │
│ R2_BUCKET_NAME              │ local-... │ Production  │ 1d ago  │
│ NEXT_PUBLIC_R2_PUBLIC_URL   │ https://..│ Production  │ 1d ago  │
└─────────────────────────────┴───────────┴─────────────┴─────────┘
```

### Via Runtime (Test in Production)

Add a test API route to verify environment variables are loaded:

```typescript
// app/api/test-env/route.ts
export async function GET() {
  return Response.json({
    hasR2AccountId: !!process.env.R2_ACCOUNT_ID,
    hasR2AccessKey: !!process.env.R2_ACCESS_KEY_ID,
    hasR2SecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
    publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
  });
}
```

Visit: `https://your-site.vercel.app/api/test-env`

Expected response:

```json
{
  "hasR2AccountId": true,
  "hasR2AccessKey": true,
  "hasR2SecretKey": true,
  "bucketName": "local-business-platform",
  "publicUrl": "https://pub-abc123.r2.dev"
}
```

**Delete this test route after verification!**

---

## Security Best Practices

### ✅ Do's

- ✅ **Use encrypted type** for secrets (R2_SECRET_ACCESS_KEY, etc.)
- ✅ **Rotate API tokens** every 90 days
- ✅ **Use separate tokens** for production vs development
- ✅ **Limit token permissions** to specific buckets
- ✅ **Enable Vercel's secret redaction** (automatic for encrypted vars)
- ✅ **Set token expiry** if supported by your workflow

### ❌ Don'ts

- ❌ **Never commit** `.env.local` or real credentials
- ❌ **Don't use plain text** for secret values
- ❌ **Don't share tokens** in Slack, email, etc.
- ❌ **Don't use same token** across all environments (if possible)
- ❌ **Don't expose `NEXT_PUBLIC_*`** for server-side secrets

### Variable Types

| Variable                    | Type      | Reason                         |
| --------------------------- | --------- | ------------------------------ |
| `R2_ACCOUNT_ID`             | Encrypted | Sensitive (account identifier) |
| `R2_ACCESS_KEY_ID`          | Encrypted | Secret (API credential)        |
| `R2_SECRET_ACCESS_KEY`      | Encrypted | Secret (API credential)        |
| `R2_BUCKET_NAME`            | Plain     | Not sensitive                  |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | Plain     | Public (exposed to browser)    |

---

## Updating Variables Across All Sites

### When you need to rotate credentials:

#### Option 1: Manual (Vercel Dashboard)

1. Update variable in each project
2. Redeploy all affected sites

#### Option 2: CLI Script (Recommended)

```bash
# Update value in .env.local first
# Then run:
./tools/setup-vercel-env.sh
```

#### Option 3: Vercel API

```bash
pnpm setup:vercel-env
```

---

## Troubleshooting

### Images not loading in production

**Check 1: Environment variables are set**

```bash
vercel env ls
```

**Check 2: Variables are correct**

- Copy from `.env.local` (working locally)
- Verify no typos in variable names

**Check 3: Redeploy after adding variables**
Variables only take effect on new deployments.

**Check 4: Public access enabled**

- R2 bucket must have public access enabled
- Or custom domain configured

### Deployment fails with R2 errors

**Check 1: Server-side usage only**
Never import R2 client in client components:

```typescript
// ❌ Don't do this in 'use client' components
import { getR2Client } from "@/lib/r2-client";

// ✅ Use in Server Components or API routes only
```

**Check 2: Credentials are encrypted**
Sensitive variables should be type "encrypted" in Vercel.

---

## Automation for 50 Sites

### Recommended Workflow

1. **Add sites to array** in `tools/setup-vercel-env.ts`
2. **Run setup script** once for all sites:
   ```bash
   pnpm setup:vercel-env
   ```
3. **Verify** with `vercel env ls` on sample sites
4. **Trigger redeployments** (automatic on next push)

### Template for New Sites

When creating site #51:

1. Add `"new-site-slug"` to `SITES` array in script
2. Run `pnpm setup:vercel-env`
3. Done! No manual Vercel dashboard work needed.

---

## Cost Implications

### Vercel Pricing

Environment variables are **free on all Vercel plans**. No additional cost for adding R2 credentials to 50 sites.

### R2 Pricing

Variables don't affect R2 costs. Costs are based on:

- Storage used (~£0.30/month for 25GB)
- API calls (~£1/month for typical usage)
- Egress: **FREE** (Cloudflare's benefit)

---

## Checklist

### Initial Setup (One-Time)

- [ ] R2 credentials in `.env.local`
- [ ] Test locally: `pnpm test:r2`
- [ ] Vercel API token obtained
- [ ] Vercel CLI installed: `pnpm add -g vercel`

### Per-Site Setup

- [ ] Site deployed to Vercel
- [ ] Environment variables added (5 total)
- [ ] Site redeployed after adding variables
- [ ] Images loading correctly in production
- [ ] Test URL verified: `/api/test-env` (then delete)

### For All 50 Sites

- [ ] Create `tools/setup-vercel-env.ts` script
- [ ] Add all site slugs to script
- [ ] Run `pnpm setup:vercel-env`
- [ ] Verify sample sites
- [ ] Trigger redeployments

---

## Next Steps

1. **Manual Setup** (for first 1-2 sites):
   - Use Vercel Dashboard method
   - Understand the process

2. **Automated Setup** (for remaining sites):
   - Create TypeScript script
   - Bulk configure all sites

3. **Verification**:
   - Test image loading in production
   - Verify no console errors

4. **Document**:
   - Update team docs with process
   - Add credentials to password manager

---

**Status:** Ready to configure Vercel! 🚀

See also:

- [R2_SETUP.md](./R2_SETUP.md) - Complete R2 guide
- [R2_QUICK_START.md](./R2_QUICK_START.md) - Quick reference
- [../tools/README.md](../tools/README.md) - Tool documentation
