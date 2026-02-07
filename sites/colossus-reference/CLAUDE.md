# Colossus Reference Site

Site-specific context for the scaffolding reference implementation.

## Content Structure

- `content/services/` - 25 service MDX files (scaffolding types)
- `content/locations/` - 37 location MDX files (South East England)
- Dynamic routing via `app/services/[slug]/page.tsx` and `app/locations/[slug]/page.tsx`
- Location-specific services filtered dynamically via `lib/locations-config.ts`

## MDX Frontmatter Requirements

**Required fields for all content:**

```yaml
title: "Page Title"
seoTitle: "SEO-optimized Title | Colossus Scaffolding"
description: "50-200 characters"
heroImage: "/path-to-image.png"
keywords: ["keyword1", "keyword2"]
```

**Services additionally require:**

```yaml
hero:
  title: "Hero Title"
  description: "Hero description"
  phone: "01424 466 661"
  trustBadges: ["TG20:21 Compliant", "CHAS Accredited"]
benefits: ["Benefit 1", "Benefit 2"]
faqs: # 3-15 items required
  - question: "Question?"
    answer: "Answer..."
about:
  whatIs: "Detailed description"
  whenNeeded: ["Use case 1", "Use case 2"]
```

## Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run type-check       # TypeScript validation

# Testing
npm test                 # 141 unit tests (~2s)
npm run test:e2e:smoke   # Fast E2E smoke tests (~30s)
npm run test:e2e         # Standard E2E tests (~3min)

# Content Validation
npm run validate:content   # Validate all 62 MDX files
npm run validate:services  # Validate 25 service files
npm run validate:locations # Validate 37 location files
```

## Environment Variables

Required in `.env.local` (see `.env.example`):

```bash
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your-secret

# Feature Flags
FEATURE_CONSENT_BANNER=true
FEATURE_ANALYTICS_ENABLED=true

# Rate Limiting (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Email (Resend)
RESEND_API_KEY=re_your_api_key
BUSINESS_EMAIL=info@colossusscaffolding.co.uk
NEXT_PUBLIC_SITE_URL=https://colossusscaffolding.co.uk
```

## Analytics System

- `ConsentManager` component in `app/layout.tsx` handles GDPR consent
- GA4 tracking via `lib/analytics/ga4.ts` (server-side Measurement Protocol)
- Feature flags control all tracking functionality
- Debug panel available in development mode

## Key Files

| File                       | Purpose                         |
| -------------------------- | ------------------------------- |
| `lib/content.ts`           | MDX reading utilities           |
| `lib/locations-config.ts`  | Dynamic location discovery      |
| `lib/content-schemas.ts`   | Zod validation schemas          |
| `lib/rate-limiter.ts`      | Upstash Redis rate limiting     |
| `app/api/contact/route.ts` | Contact form with rate limiting |
