# End-to-End Site Creation Workflow

**Estimated Time:** 2-3 hours (excluding DNS propagation)
**Prerequisites:** Completed platform setup, all API keys configured
**Difficulty:** Intermediate

---

## Overview

This guide provides a complete, step-by-step workflow for onboarding a new client and launching their website on the Local Business Platform. It covers everything from initial client intake to post-launch verification.

## Prerequisites

Before starting a new site, ensure you have:

### Platform Infrastructure

- [ ] Supabase registry configured ([Registry Setup Guide](./registry-setup.md))
- [ ] Vercel team account with API token
- [ ] Cloudflare R2 bucket for images
- [ ] NewRelic account for monitoring
- [ ] Resend account for email

### API Keys (in `.env.local`)

- [ ] `ANTHROPIC_API_KEY` or `GOOGLE_AI_API_KEY` for content generation
- [ ] `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` for images
- [ ] `VERCEL_TOKEN` and `VERCEL_TEAM_ID` for deployments
- [ ] `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` for registry
- [ ] `NEW_RELIC_API_KEY` for monitoring
- [ ] `RESEND_API_KEY` for contact forms

### Local Environment

- [ ] Node.js 18+ installed
- [ ] pnpm 8+ installed
- [ ] Repository cloned and dependencies installed
- [ ] Domain registrar access (for DNS configuration)

---

## Workflow Overview

```
+-----------------------------------------------------------------------+
|                    END-TO-END SITE CREATION                           |
+-----------------------------------------------------------------------+
|                                                                       |
|  Step 1          Step 2          Step 3          Step 4               |
|  +---------+     +---------+     +---------+     +---------+          |
|  | Client  | --> | Site    | --> | Content | --> | Image   |          |
|  | Intake  |     | Generate|     | Generate|     | Pipeline|          |
|  | 30 min  |     | 5 min   |     | 20 min  |     | 30 min  |          |
|  +---------+     +---------+     +---------+     +---------+          |
|                                                                       |
|  Step 5          Step 6          Step 7          Step 8               |
|  +---------+     +---------+     +---------+     +---------+          |
|  | Registry| --> | Review  | --> | Deploy  | --> | Domain  |          |
|  | Sync    |     | & QA    |     |         |     | Config  |          |
|  | 2 min   |     | 20 min  |     | 10 min  |     | 15 min  |          |
|  +---------+     +---------+     +---------+     +---------+          |
|                                                                       |
|  Step 9                                                               |
|  +---------+                                                          |
|  | Client  |     Total: ~2.5 hours                                    |
|  | Handoff |     (+ DNS propagation)                                  |
|  | 30 min  |                                                          |
|  +---------+                                                          |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## Step 1: Client Intake (30 min)

### Information to Collect

Create a checklist to gather all required information from the client:

#### Business Information

- [ ] Business name (legal and trading name)
- [ ] Industry/service type
- [ ] Phone number
- [ ] Email address
- [ ] Physical address (if applicable)
- [ ] Business hours

#### Service Details

- [ ] List of services offered
- [ ] Service descriptions (brief)
- [ ] Unique selling points
- [ ] Certifications/qualifications

#### Service Area

- [ ] Primary location
- [ ] Additional service areas
- [ ] Geographic coverage radius

#### Branding

- [ ] Logo (PNG/SVG preferred)
- [ ] Brand colors (primary, secondary, accent)
- [ ] Existing fonts (if any)
- [ ] Brand guidelines (if available)

#### Competitive Context

- [ ] Competitor websites (2-3 examples)
- [ ] What they like about competitors
- [ ] What makes them different

#### Content Assets

- [ ] Existing photos (team, work samples, equipment)
- [ ] Testimonials
- [ ] Case studies
- [ ] Certifications/badges to display

### Create Business Context File

Create a `business-context.json` file in the `output/` directory:

```json
{
  "business": {
    "name": "Acme Plumbing Services",
    "legalName": "Acme Plumbing Services Ltd",
    "type": "Plumber",
    "phone": "+44 1234 567890",
    "email": "info@acme-plumbing.co.uk",
    "address": {
      "street": "123 High Street",
      "city": "Canterbury",
      "region": "Kent",
      "postalCode": "CT1 2XX",
      "country": "United Kingdom"
    },
    "hours": {
      "monday": "8:00 AM - 6:00 PM",
      "tuesday": "8:00 AM - 6:00 PM",
      "wednesday": "8:00 AM - 6:00 PM",
      "thursday": "8:00 AM - 6:00 PM",
      "friday": "8:00 AM - 6:00 PM",
      "saturday": "9:00 AM - 2:00 PM",
      "sunday": "Emergency Only"
    }
  },
  "branding": {
    "primaryColor": "#0066cc",
    "primaryHoverColor": "#0052a3",
    "secondaryColor": "#004080",
    "accentColor": "#f59e0b"
  },
  "services": [
    {
      "slug": "emergency-plumbing",
      "title": "Emergency Plumbing",
      "description": "24/7 emergency plumbing services for burst pipes, leaks, and flooding"
    },
    {
      "slug": "boiler-installation",
      "title": "Boiler Installation",
      "description": "Professional gas boiler installation with warranty"
    },
    {
      "slug": "bathroom-installation",
      "title": "Bathroom Installation",
      "description": "Complete bathroom design and installation services"
    }
  ],
  "locations": [
    {
      "slug": "canterbury",
      "name": "Canterbury",
      "county": "Kent"
    },
    {
      "slug": "whitstable",
      "name": "Whitstable",
      "county": "Kent"
    },
    {
      "slug": "herne-bay",
      "name": "Herne Bay",
      "county": "Kent"
    }
  ],
  "competitors": ["https://competitor1.co.uk", "https://competitor2.co.uk"],
  "uniqueSellingPoints": [
    "24/7 emergency callouts",
    "Gas Safe registered",
    "Free quotes",
    "10-year warranty on installations"
  ]
}
```

Save this file for use in content generation steps.

---

## Step 2: Site Generation (5 min)

### Create Site Structure

Run the site creation tool from the repository root:

```bash
# Create site from base-template
pnpm create:site acme-plumbing-canterbury
```

The tool will prompt for:

- Business name
- Phone number
- Email address
- Primary color (hex)
- Primary hover color (hex)
- Secondary color (hex)

### Verify Generated Files

Check that the site was created correctly:

```bash
ls -la sites/acme-plumbing-canterbury/
```

Expected structure:

```
sites/acme-plumbing-canterbury/
├── app/                  # Next.js app directory
├── components/           # Site-specific components
├── content/              # MDX content files
│   ├── services/         # Service pages (empty initially)
│   └── locations/        # Location pages (empty initially)
├── lib/                  # Utilities and helpers
├── public/               # Static assets
├── package.json          # Dependencies
├── site.config.ts        # Business information
├── theme.config.ts       # Brand colors
├── tailwind.config.ts    # Tailwind with theme plugin
└── README.md             # Site-specific docs
```

### Update Site Configuration

Edit `sites/acme-plumbing-canterbury/site.config.ts` with complete business information from the client intake:

```typescript
export const siteConfig: SiteConfig = {
  name: "Acme Plumbing Canterbury",
  tagline: "Professional Plumbing Services in Canterbury & Kent",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  business: {
    name: "Acme Plumbing Services",
    legalName: "Acme Plumbing Services Ltd",
    type: "Plumber",
    phone: "+44 1234 567890",
    email: "info@acme-plumbing.co.uk",
    address: {
      street: "123 High Street",
      city: "Canterbury",
      region: "Kent",
      postalCode: "CT1 2XX",
      country: "United Kingdom",
    },
    hours: {
      monday: "8:00 AM - 6:00 PM",
      // ... complete hours
    },
    socialMedia: {
      facebook: "https://facebook.com/acmeplumbingcanterbury",
    },
  },

  serviceAreas: ["Canterbury", "Whitstable", "Herne Bay"],

  services: [
    {
      title: "Emergency Plumbing",
      slug: "emergency-plumbing",
      description: "24/7 emergency plumbing services",
    },
    // ... more services
  ],

  features: {
    analytics: true,
    consentBanner: true,
    contactForm: true,
    rateLimit: true,
    testimonials: true,
    blog: false,
  },
};
```

### Update Theme Configuration

Edit `sites/acme-plumbing-canterbury/theme.config.ts` with brand colors:

```typescript
import type { ThemeConfig } from "@platform/theme-system";

export const themeConfig: Partial<ThemeConfig> = {
  colors: {
    brand: {
      primary: "#0066cc",
      primaryHover: "#0052a3",
      secondary: "#004080",
      accent: "#f59e0b",
    },
  },
  components: {
    button: { borderRadius: "0.5rem", fontWeight: 600 },
    card: { borderRadius: "1rem", shadow: "sm" },
    hero: { variant: "centered" },
    navigation: { style: "solid" },
  },
};
```

### Validate Theme Contrast

```bash
# From packages/theme-system
cd packages/theme-system
pnpm validate --config ../../sites/acme-plumbing-canterbury/theme.config.ts
```

Ensure all color combinations pass WCAG AA contrast requirements.

---

## Step 3: Content Generation (20 min)

### Generate Service Pages

Use AI to generate service MDX files:

```bash
# Generate all services from context file
pnpm content:generate:services --site acme-plumbing-canterbury \
  --context output/business-context.json

# Or generate specific services
pnpm content:generate:services --site acme-plumbing-canterbury \
  --services "emergency-plumbing,boiler-installation" \
  --context output/business-context.json

# Preview without writing files
pnpm content:generate:services --site acme-plumbing-canterbury \
  --context output/business-context.json \
  --dry-run
```

Options:

- `--provider=claude` (default) or `--provider=gemini`
- `--force` to overwrite existing files
- `--limit 3` to generate only N services

### Generate Location Pages

```bash
# Generate all locations from context file
pnpm content:generate:locations --site acme-plumbing-canterbury \
  --context output/business-context.json

# Or generate specific locations
pnpm content:generate:locations --site acme-plumbing-canterbury \
  --locations "canterbury,whitstable" \
  --context output/business-context.json
```

### Validate Generated Content

```bash
cd sites/acme-plumbing-canterbury

# Validate all content
npm run validate:content

# Validate services only
npm run validate:services

# Validate locations only
npm run validate:locations
```

All content must pass:

- Description length: 50-200 characters
- FAQ count: 3-15 items per page
- Required frontmatter fields present
- Valid YAML syntax

### Review Generated Content

Manually review a sample of generated pages:

- Check descriptions are accurate
- Verify FAQs are relevant
- Ensure tone matches brand
- Fix any AI hallucinations

---

## Step 4: Image Generation/Upload (30 min)

### Option A: Client-Provided Images

If the client has provided photos:

```bash
# Process and upload client images
pnpm images:intake --site acme-plumbing-canterbury \
  --source /path/to/client/images/

# This will:
# - Resize images to optimal dimensions
# - Convert to WebP format
# - Upload to R2
# - Generate manifest
```

### Option B: AI-Generated Images

If images need to be generated:

```bash
# Step 1: Generate image manifest from MDX content
pnpm images:manifest --site acme-plumbing-canterbury

# Step 2: Generate images using AI
pnpm images:generate --site acme-plumbing-canterbury

# Step 3: Upload to R2
pnpm images:upload --site acme-plumbing-canterbury

# Step 4: Update MDX files with R2 URLs
pnpm images:update-mdx --site acme-plumbing-canterbury
```

Or use the combined pipeline:

```bash
# Run all image steps in sequence
pnpm images:pipeline --site acme-plumbing-canterbury
```

### Verify Images

```bash
# Check all images uploaded to R2
pnpm test:r2 --site acme-plumbing-canterbury

# Check service images specifically
tsx tools/check-service-images.ts acme-plumbing-canterbury
```

---

## Step 5: Registry Sync (2 min)

### Sync Site to Registry

Add the new site to the Supabase registry:

```bash
# Sync single site
pnpm sites:sync acme-plumbing-canterbury

# Verify sync
pnpm sites:show acme-plumbing-canterbury
```

Expected output:

```
Site: acme-plumbing-canterbury
Status: active
Services: 3
Locations: 3
Domain: (pending)
Created: 2026-01-27
```

### Alternative: Interactive Mode

```bash
# Use interactive CLI for more options
pnpm sites:interactive
```

---

## Step 6: Review & QA (20 min)

### Local Testing

```bash
cd sites/acme-plumbing-canterbury

# Install dependencies
pnpm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Manual Checklist

Verify all pages and functionality:

#### Pages

- [ ] Homepage loads correctly
- [ ] All service pages accessible
- [ ] All location pages accessible
- [ ] Contact page works
- [ ] 404 page displays correctly

#### Branding

- [ ] Brand colors applied correctly
- [ ] Logo displays (if uploaded)
- [ ] Typography looks correct
- [ ] Consistent styling throughout

#### Content

- [ ] Service descriptions accurate
- [ ] Location content relevant
- [ ] FAQs are helpful
- [ ] No placeholder text remaining

#### Images

- [ ] Hero images display
- [ ] Service images load
- [ ] Images optimized (WebP)
- [ ] Alt text present

#### Functionality

- [ ] Contact form submits
- [ ] Phone links work (mobile)
- [ ] Email links work
- [ ] Navigation works on mobile
- [ ] Footer links correct

#### Technical

- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Page load speed acceptable
- [ ] SEO meta tags present

### Automated Testing

```bash
# Run unit tests
npm test

# Run E2E smoke tests
npm run test:e2e:smoke

# Build production version
npm run build
```

All tests must pass before deployment.

---

## Step 7: Deployment (10 min)

### Create Vercel Project

#### Option A: Via CLI

```bash
# Link to Vercel (from site directory)
cd sites/acme-plumbing-canterbury
vercel link

# Set environment variables
pnpm setup:vercel-env --site acme-plumbing-canterbury
```

#### Option B: Via Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import from Git repository
4. Configure project:
   - **Root Directory:** `sites/acme-plumbing-canterbury`
   - **Framework Preset:** Next.js
   - **Build Command:** `pnpm build`
   - **Output Directory:** `.next`

### Set Environment Variables

In Vercel project settings, add:

```bash
# Required
NEXT_PUBLIC_SITE_URL=https://acme-plumbing-canterbury.vercel.app
RESEND_API_KEY=re_xxx
BUSINESS_EMAIL=info@acme-plumbing.co.uk

# Rate Limiting (Vercel KV)
KV_REST_API_URL=https://xxx.upstash.io
KV_REST_API_TOKEN=xxx

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Feature Flags
FEATURE_CONSENT_BANNER=true
FEATURE_ANALYTICS_ENABLED=true

# Monitoring
NEW_RELIC_LICENSE_KEY=xxx
NEW_RELIC_APP_NAME=Acme Plumbing Canterbury - Production
```

### Deploy via Git Workflow

Follow the standard git workflow:

```bash
# Ensure on develop branch
git checkout develop

# Stage and commit all changes
git add sites/acme-plumbing-canterbury/
git commit -m "feat(site): add acme-plumbing-canterbury site"

# Push to develop
git push origin develop

# Wait for CI to pass
gh run watch
```

Once CI passes:

```bash
# Merge to staging
git checkout staging
git merge develop
git push origin staging

# Wait for CI + E2E tests
gh run watch

# Verify on staging URL
# https://acme-plumbing-canterbury-staging.vercel.app
```

After staging verification:

```bash
# Merge to production
git checkout main
git merge staging
git push origin main

# Monitor production deployment
gh run watch
```

### Verify Deployment

Check production URL:

- `https://acme-plumbing-canterbury.vercel.app`

---

## Step 8: Domain Configuration (15 min)

### Add Custom Domain in Vercel

1. Go to Vercel Project Settings > Domains
2. Add custom domain: `www.acme-plumbing.co.uk`
3. Note the DNS records required

### Configure DNS Records

In your domain registrar (or Cloudflare):

```
Type    Name    Value                           TTL
A       @       76.76.21.21                     Auto
CNAME   www     cname.vercel-dns.com            Auto
```

Or for Cloudflare proxy:

```
Type    Name    Value                           TTL     Proxy
A       @       76.76.21.21                     Auto    Proxied
CNAME   www     cname.vercel-dns.com            Auto    Proxied
```

### Configure Redirects

Ensure proper redirects in Vercel:

- `acme-plumbing.co.uk` → `www.acme-plumbing.co.uk`
- `acme-plumbing-canterbury.vercel.app` → `www.acme-plumbing.co.uk`

### Verify SSL

1. Wait for SSL certificate provisioning (usually < 5 minutes)
2. Test both HTTP and HTTPS access
3. Verify certificate is valid

### Update Registry

```bash
# Update site domain in registry
pnpm sites:show acme-plumbing-canterbury

# Or use interactive mode
pnpm sites:interactive
# Select "Update site" > Enter domain
```

### Update Site Config

Update `NEXT_PUBLIC_SITE_URL` in Vercel:

```bash
NEXT_PUBLIC_SITE_URL=https://www.acme-plumbing.co.uk
```

Trigger redeployment for URL update to take effect.

---

## Step 9: Client Handoff (30 min)

### Deliverables Checklist

Prepare the following for the client:

#### Access & URLs

- [ ] Live website URL: `https://www.acme-plumbing.co.uk`
- [ ] Vercel dashboard access (if requested)
- [ ] GitHub repository access (if requested)

#### Analytics Setup

- [ ] Google Analytics property created
- [ ] Google Search Console verified
- [ ] Sitemap submitted to Google
- [ ] Facebook Pixel configured (if applicable)

#### Documentation

- [ ] Site overview document
- [ ] How to request content changes
- [ ] Contact form notification setup
- [ ] Analytics access instructions

### Post-Launch Tasks

#### Monitoring Setup

```bash
# Sync NewRelic metrics
pnpm sync:newrelic acme-plumbing-canterbury

# Verify monitoring active
pnpm alerts:check --site acme-plumbing-canterbury
```

#### Search Engine Submission

1. Submit sitemap: `https://www.acme-plumbing.co.uk/sitemap.xml`
2. Request indexing in Google Search Console
3. Submit to Bing Webmaster Tools (optional)

#### Social Media

- Update business profiles with website URL
- Share launch announcement
- Request reviews linking to website

### Schedule Follow-ups

- [ ] 1-week check-in: Initial performance review
- [ ] 1-month review: SEO progress, content updates
- [ ] Quarterly reviews: Ongoing optimization

---

## Troubleshooting

### Site Creation Fails

**Problem:** `base-template directory not found`

**Solution:**

```bash
# Verify base-template exists
ls sites/base-template/

# If missing, check branch
git checkout main
git pull origin main
```

### Content Generation Fails

**Problem:** AI API errors

**Solution:**

```bash
# Test AI connection
pnpm test:ai:claude
# or
pnpm test:ai:gemini

# Check API key in .env.local
cat .env.local | grep ANTHROPIC_API_KEY
```

### Image Upload Fails

**Problem:** R2 upload errors

**Solution:**

```bash
# Test R2 connection
pnpm test:r2

# Check R2 credentials in .env.local
cat .env.local | grep R2_
```

### Build Fails

**Problem:** TypeScript or build errors

**Solution:**

```bash
cd sites/acme-plumbing-canterbury

# Check for TypeScript errors
npm run type-check

# Check for lint errors
npm run lint

# Try building locally
npm run build
```

### Domain Not Working

**Problem:** DNS not resolving

**Solution:**

1. Verify DNS records are correct
2. Wait for propagation (can take 24-48 hours)
3. Check with `dig www.acme-plumbing.co.uk`
4. Verify Vercel domain configuration

---

## Time Estimate Summary

| Step      | Task                 | Time           |
| --------- | -------------------- | -------------- |
| 1         | Client Intake        | 30 min         |
| 2         | Site Generation      | 5 min          |
| 3         | Content Generation   | 20 min         |
| 4         | Image Pipeline       | 30 min         |
| 5         | Registry Sync        | 2 min          |
| 6         | Review & QA          | 20 min         |
| 7         | Deployment           | 10 min         |
| 8         | Domain Configuration | 15 min         |
| 9         | Client Handoff       | 30 min         |
| **Total** |                      | **~2.5 hours** |

**Note:** DNS propagation can take up to 48 hours but typically completes within 1-4 hours.

---

## Quick Reference Commands

```bash
# Site creation
pnpm create:site [site-slug]

# Content generation
pnpm content:generate:services --site [site-slug] --context [context.json]
pnpm content:generate:locations --site [site-slug] --context [context.json]

# Image pipeline
pnpm images:pipeline --site [site-slug]

# Registry management
pnpm sites:sync [site-slug]
pnpm sites:show [site-slug]
pnpm sites:list

# Deployment
pnpm setup:vercel-env --site [site-slug]

# Testing
npm run validate:content
npm test
npm run test:e2e:smoke

# Monitoring
pnpm sync:newrelic [site-slug]
pnpm alerts:check --site [site-slug]
```

---

## Related Guides

- [Adding a New Site](./adding-new-site.md) - Detailed site creation guide
- [Theming Guide](./theming.md) - Brand customization
- [Deploying a Site](./deploying-site.md) - Deployment procedures
- [Registry Setup](./registry-setup.md) - Supabase registry setup
- [Monitoring Setup](./monitoring-setup.md) - NewRelic configuration
- [Git Workflow](./git-workflow.md) - Branch workflow details
- [Adding a Service](./adding-service.md) - Service MDX creation
- [Adding a Location](./adding-location.md) - Location MDX creation

---

**Last Updated:** 2026-01-27
