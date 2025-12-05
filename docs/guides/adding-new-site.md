# How to Add a New Site

**Estimated Time:** 30-60 minutes
**Prerequisites:** Repository access, Vercel account, domain configured
**Difficulty:** Intermediate

---

## Overview

This guide walks you through creating a new client site in the Local Business Platform monorepo. Each site is an independent Next.js application that shares components from `@platform/core-components`.

## Prerequisites

- Access to the repository
- Vercel account with deployment access
- pnpm installed globally
- Domain or subdomain for the new site
- Client business information (name, services, locations)

## Steps

### Step 1: Create Site Directory

```bash
# From repository root
mkdir -p sites/[client-slug]

# Example: Joe's Plumbing in Canterbury
mkdir -p sites/joes-plumbing-canterbury
```

**Naming convention:** `[business-name]-[primary-location]` in lowercase with hyphens.

### Step 2: Copy Reference Site Structure

```bash
# Copy from colossus-reference (the template site)
cp -r sites/colossus-reference/app sites/[client-slug]/
cp -r sites/colossus-reference/components sites/[client-slug]/
cp -r sites/colossus-reference/lib sites/[client-slug]/
cp sites/colossus-reference/package.json sites/[client-slug]/
cp sites/colossus-reference/tsconfig.json sites/[client-slug]/
cp sites/colossus-reference/next.config.ts sites/[client-slug]/
cp sites/colossus-reference/tailwind.config.ts sites/[client-slug]/
cp sites/colossus-reference/postcss.config.js sites/[client-slug]/
```

### Step 3: Create Content Directory

```bash
mkdir -p sites/[client-slug]/content/services
mkdir -p sites/[client-slug]/content/locations
```

### Step 4: Update package.json

Edit `sites/[client-slug]/package.json`:

```json
{
  "name": "[client-slug]",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@platform/core-components": "workspace:*",
    "next": "16.0.7",
    "react": "^19.1.2",
    "react-dom": "^19.1.2"
    // ... other dependencies
  }
}
```

### Step 5: Update Site Configuration

Edit `sites/[client-slug]/lib/site.ts`:

```typescript
export const siteConfig = {
  name: "Joe's Plumbing Canterbury",
  description: "Professional plumbing services in Canterbury and surrounding areas",
  phone: "01227 XXX XXX",
  email: "info@joesplumbing.co.uk",
  address: "123 High Street, Canterbury, Kent CT1 2XX",
  serviceArea: ["Canterbury", "Whitstable", "Herne Bay"],
  socialLinks: {
    facebook: "https://facebook.com/joesplumbingcanterbury",
    // ... other social links
  },
};
```

### Step 6: Create Service MDX Files

Create service files in `sites/[client-slug]/content/services/`:

```bash
# Example services for a plumber
touch sites/[client-slug]/content/services/emergency-plumbing.mdx
touch sites/[client-slug]/content/services/boiler-installation.mdx
touch sites/[client-slug]/content/services/bathroom-installation.mdx
```

See [Adding a Service](./adding-service.md) for MDX frontmatter template.

### Step 7: Create Location MDX Files

Create location files in `sites/[client-slug]/content/locations/`:

```bash
# Example locations
touch sites/[client-slug]/content/locations/canterbury.mdx
touch sites/[client-slug]/content/locations/whitstable.mdx
touch sites/[client-slug]/content/locations/herne-bay.mdx
```

See [Adding a Location](./adding-location.md) for MDX frontmatter template.

### Step 8: Update Turborepo Configuration

The root `turbo.json` automatically includes all sites in `sites/` directory. Verify it's configured:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

### Step 9: Install Dependencies

```bash
# From repository root
pnpm install
```

### Step 10: Test Local Development

```bash
# Start the new site
cd sites/[client-slug]
pnpm dev

# Visit http://localhost:3000
```

**Verify:**

- Homepage loads
- Services page works
- Locations page works
- Contact form displays

### Step 11: Configure Vercel Project

1. Go to Vercel Dashboard
2. Add New Project
3. Import from Git repository
4. Configure:
   - **Root Directory:** `sites/[client-slug]`
   - **Framework Preset:** Next.js
   - **Build Command:** `pnpm build`
   - **Output Directory:** `.next`

### Step 12: Set Environment Variables

In Vercel project settings, add:

```bash
# Required
NEXT_PUBLIC_SITE_URL=https://[domain].com
RESEND_API_KEY=re_xxx
BUSINESS_EMAIL=client@email.com

# Rate Limiting
KV_REST_API_URL=https://xxx.upstash.io
KV_REST_API_TOKEN=xxx

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Feature Flags
FEATURE_CONSENT_BANNER=true
FEATURE_ANALYTICS_ENABLED=true
```

### Step 13: Configure Domain

1. In Vercel, go to Project Settings → Domains
2. Add custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### Step 14: Deploy

```bash
# Commit changes
git add .
git commit -m "feat(site): add [client-slug] site"

# Push to develop
git push origin develop

# After CI passes, promote to staging then main
```

## Verification

After deployment, verify:

- [ ] Homepage loads at custom domain
- [ ] All service pages accessible
- [ ] All location pages accessible
- [ ] Contact form submits successfully
- [ ] Rate limiting works
- [ ] Analytics tracking (if enabled)
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] No console errors

## Site Checklist

Before considering a site complete:

### Content

- [ ] All services have MDX files with 3-15 FAQs
- [ ] All locations have MDX files
- [ ] Hero images uploaded to R2
- [ ] Site configuration updated

### Technical

- [ ] TypeScript compiles without errors
- [ ] Build succeeds locally
- [ ] Content validation passes
- [ ] E2E smoke tests pass

### Deployment

- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL active

### Quality

- [ ] Mobile responsive tested
- [ ] Forms functional
- [ ] No console errors
- [ ] Lighthouse scores acceptable

## Troubleshooting

### Build fails with "workspace:\* not found"

Run `pnpm install` from repository root to link workspaces.

### Content not appearing

- Verify MDX files are in correct directory
- Check frontmatter YAML syntax
- Run `npm run validate:content`

### Vercel deployment fails

- Check Root Directory is set correctly
- Verify all environment variables are set
- Check build logs for specific errors

### Domain not working

- Verify DNS propagation (can take 24-48 hours)
- Check Vercel domain configuration
- Ensure SSL certificate is provisioned

## Related

- [Adding a Service](./adding-service.md) - Service MDX creation
- [Adding a Location](./adding-location.md) - Location MDX creation
- [Deploying a Site](./deploying-site.md) - Deployment procedures
- [Content Standards](../standards/content.md) - MDX architecture

---

**Last Updated:** 2025-12-05
