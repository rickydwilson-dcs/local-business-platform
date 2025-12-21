# How to Add a New Site

**Estimated Time:** 30-60 minutes
**Prerequisites:** Repository access, Vercel account, domain configured
**Difficulty:** Intermediate

---

## Overview

This guide walks you through creating a new client site in the Local Business Platform monorepo. Each site is an independent Next.js application that shares components from `@platform/core-components` and theming from `@platform/theme-system`.

## Prerequisites

- Access to the repository
- Vercel account with deployment access
- pnpm installed globally
- Domain or subdomain for the new site
- Client business information (name, services, locations, brand colors)

## Steps

### Step 1: Create Site Using the CLI Tool

The platform includes a site creation tool that copies from `base-template` and customizes configuration:

```bash
# From repository root
npx ts-node tools/create-site.ts <site-name>

# Example: Joe's Plumbing in Canterbury
npx ts-node tools/create-site.ts joes-plumbing-canterbury
```

The tool will prompt you for:

- Business name
- Phone number
- Email address
- Primary brand color (hex)
- Primary hover color (hex)
- Secondary color (hex)

**Naming convention:** `[business-name]-[primary-location]` in lowercase with hyphens.

### Step 2: Review Generated Files

The tool creates these files in `sites/[client-slug]/`:

```
sites/[client-slug]/
├── app/                  # Next.js app directory
├── components/           # Site-specific components
├── content/              # MDX content files
│   ├── services/         # Service pages
│   └── locations/        # Location pages
├── lib/                  # Utilities and helpers
├── public/               # Static assets
├── package.json          # Dependencies (name updated)
├── site.config.ts        # Business information
├── theme.config.ts       # Brand colors and styling
├── tailwind.config.ts    # Tailwind with theme plugin
└── README.md             # Site-specific docs
```

### Step 3: Customize Theme Configuration

Edit `sites/[client-slug]/theme.config.ts` to fine-tune brand styling:

```typescript
import type { ThemeConfig } from "@platform/theme-system";

export const themeConfig: Partial<ThemeConfig> = {
  colors: {
    brand: {
      primary: "#your-primary-color",
      primaryHover: "#your-hover-color",
      secondary: "#your-secondary-color",
      accent: "#f59e0b", // Usually amber for highlights
    },
    // Surface and semantic colors use sensible defaults
  },

  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      heading: ["Inter", "system-ui", "sans-serif"],
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

See the [Theming Guide](./theming.md) for full documentation on theme tokens.

### Step 4: Update Site Configuration

Edit `sites/[client-slug]/site.config.ts` with complete business information:

```typescript
export const siteConfig: SiteConfig = {
  name: "Joe's Plumbing Canterbury",
  tagline: "Professional Plumbing Services",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  business: {
    name: "Joe's Plumbing",
    legalName: "Joe's Plumbing Ltd",
    type: "HomeAndConstructionBusiness",
    phone: "+44 1227 XXX XXX",
    email: "info@joesplumbing.co.uk",
    address: {
      street: "123 High Street",
      city: "Canterbury",
      region: "Kent",
      postalCode: "CT1 2XX",
      country: "United Kingdom",
    },
    hours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      // ... other days
    },
    socialMedia: {
      facebook: "https://facebook.com/joesplumbingcanterbury",
    },
  },

  serviceAreas: ["Canterbury", "Whitstable", "Herne Bay"],

  services: [
    { title: "Emergency Plumbing", slug: "emergency-plumbing", description: "..." },
    { title: "Boiler Installation", slug: "boiler-installation", description: "..." },
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

### Step 5: Create Service MDX Files

Create service files in `sites/[client-slug]/content/services/`:

```bash
# Example services for a plumber
touch sites/[client-slug]/content/services/emergency-plumbing.mdx
touch sites/[client-slug]/content/services/boiler-installation.mdx
touch sites/[client-slug]/content/services/bathroom-installation.mdx
```

See [Adding a Service](./adding-service.md) for MDX frontmatter template.

### Step 6: Create Location MDX Files

Create location files in `sites/[client-slug]/content/locations/`:

```bash
# Example locations
touch sites/[client-slug]/content/locations/canterbury.mdx
touch sites/[client-slug]/content/locations/whitstable.mdx
touch sites/[client-slug]/content/locations/herne-bay.mdx
```

See [Adding a Location](./adding-location.md) for MDX frontmatter template.

### Step 7: Install Dependencies

```bash
# From repository root
pnpm install
```

### Step 8: Test Local Development

```bash
# Start the new site
cd sites/[client-slug]
pnpm dev

# Visit http://localhost:3000
```

**Verify:**

- Homepage loads with correct brand colors
- Services page works
- Locations page works
- Contact form displays
- Theme colors apply correctly

### Step 9: Validate Content

```bash
# From site directory
npm run validate:content
```

### Step 10: Configure Vercel Project

1. Go to Vercel Dashboard
2. Add New Project
3. Import from Git repository
4. Configure:
   - **Root Directory:** `sites/[client-slug]`
   - **Framework Preset:** Next.js
   - **Build Command:** `pnpm build`
   - **Output Directory:** `.next`

### Step 11: Set Environment Variables

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

### Step 12: Configure Domain

1. In Vercel, go to Project Settings > Domains
2. Add custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### Step 13: Deploy

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
- [ ] Brand colors display correctly
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
- [ ] Site configuration complete

### Theme

- [ ] Brand colors set in theme.config.ts
- [ ] Colors meet WCAG AA contrast (run `pnpm validate` in theme-system)
- [ ] Typography configured if custom fonts needed

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

## Manual Site Creation (Alternative)

If you prefer to create sites manually instead of using the CLI tool:

```bash
# Copy from base-template
cp -r sites/base-template sites/[client-slug]

# Update package.json name
# Edit site.config.ts
# Edit theme.config.ts
```

## Troubleshooting

### Build fails with "workspace:\* not found"

Run `pnpm install` from repository root to link workspaces.

### Theme colors not applying

1. Verify `theme.config.ts` exports correctly
2. Check `tailwind.config.ts` uses `createThemePlugin(themeConfig)`
3. Restart dev server
4. Check browser devtools for CSS variable values

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

- [Theming Guide](./theming.md) - Complete theming documentation
- [Adding a Service](./adding-service.md) - Service MDX creation
- [Adding a Location](./adding-location.md) - Location MDX creation
- [Deploying a Site](./deploying-site.md) - Deployment procedures
- [Content Standards](../standards/content.md) - MDX architecture

---

**Last Updated:** 2025-12-21
