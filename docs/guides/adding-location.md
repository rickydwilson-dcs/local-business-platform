# How to Add a New Location

**Estimated Time:** 15-20 minutes (manual) | 2-5 minutes (AI-generated)
**Prerequisites:** Access to content/locations/ directory
**Difficulty:** Beginner

---

## Overview

This guide walks you through adding a new location (town, city, or county) to a site. All locations are MDX files with comprehensive frontmatter - no code changes required.

## Quick Start: AI Generation (Recommended)

For faster content creation, use the AI-powered location generator:

```bash
# Generate a single location using AI
pnpm content:generate:locations --site colossus-reference --locations "worthing" --context tools/examples/colossus-context.json

# Preview without writing (dry run)
pnpm content:generate:locations --site colossus-reference --locations "worthing" --dry-run

# Use a specific AI provider (default: Claude)
pnpm content:generate:locations --site colossus-reference --locations "worthing" --provider=gemini
```

The generator creates complete MDX files with:

- Location-specific hero section
- Specialists cards highlighting local expertise
- Service cards with localized descriptions
- 5-20 location-specific FAQs
- Pricing, coverage, and local authority info

After generation, review and customize the content as needed, then continue from [Step 3: Add Hero Image](#step-3-add-hero-image-to-r2).

---

## Manual Method

## Prerequisites

- Access to the repository
- Understanding of MDX/YAML syntax
- Location information (name, region, services offered)

## Steps

### Step 1: Create the MDX File

Create a new file in `content/locations/` with the location slug:

```bash
# Example: Adding Worthing
touch content/locations/worthing.mdx
```

**Naming convention:** lowercase, hyphens for spaces (e.g., `east-sussex.mdx`, `tunbridge-wells.mdx`)

### Step 2: Add Frontmatter

Copy this template and customize for your location:

```yaml
---
title: "Worthing"
seoTitle: "Worthing Scaffolding Services | Colossus Scaffolding"
description: "Professional scaffolding services in Worthing. TG20:21 compliant, CISRS qualified scaffolders. Free quotes available."
keywords:
  - "scaffolding worthing"
  - "worthing scaffolding hire"
  - "scaffolders worthing"
heroImage: "/Worthing-Scaffolding.png"
hero:
  title: "Professional Scaffolding in Worthing"
  description: "Expert scaffolding solutions for Worthing's residential and commercial properties. Our local team understands the unique requirements of coastal properties."
  phone: "01424 466 661"
  trustBadges:
    - "TG20:21 Compliant"
    - "CHAS Accredited"
    - "£5M Public Liability"
  ctaText: "Get Your Free Quote"
  ctaUrl: "/contact"
specialists:
  title: "Worthing Scaffolding Specialists"
  cards:
    - title: "Residential Scaffolding"
      description: "Safe access for home improvements and repairs"
      icon: "home"
    - title: "Commercial Scaffolding"
      description: "Professional solutions for businesses"
      icon: "building"
    - title: "Industrial Scaffolding"
      description: "Heavy-duty systems for large projects"
      icon: "factory"
services:
  cards:
    - title: "Access Scaffolding"
      description: "Safe working platforms at any height"
      href: "/services/access-scaffolding"
    - title: "Temporary Roofs"
      description: "Weather protection during roof work"
      href: "/services/temporary-roofs"
pricing:
  title: "Scaffolding Prices in Worthing"
  packages:
    - name: "Small Residential"
      price: "From £500"
      description: "Single-story projects"
    - name: "Standard Residential"
      price: "From £800"
      description: "Two-story properties"
    - name: "Large Projects"
      price: "Custom Quote"
      description: "Commercial and complex work"
---

## Scaffolding Services in Worthing

Colossus Scaffolding provides comprehensive scaffolding solutions throughout Worthing and the surrounding West Sussex area.

### Why Choose Us for Worthing Scaffolding?

Our team understands the unique challenges of coastal properties, including salt air corrosion considerations and exposed site conditions.

### Areas We Cover Near Worthing

We serve all areas of Worthing and nearby towns including:

- Worthing town centre
- Goring-by-Sea
- Findon
- Durrington
- Broadwater
```

### Step 3: Add Hero Image to R2

Upload the hero image to Cloudflare R2:

1. Name it correctly: `Worthing-Scaffolding.png`
2. Upload to R2 bucket under `hero-images/`
3. Verify the URL matches the `heroImage` path

### Step 4: Validate Content

```bash
# Validate the new location file
npm run validate:locations

# Or validate all content
npm run validate:content
```

**Common validation errors:**

- Description too short (< 50 chars) or too long (> 200 chars)
- Missing required fields
- Invalid YAML syntax

### Step 5: Test Locally

```bash
# Start development server
npm run dev

# Visit the new location page
open http://localhost:3000/locations/worthing
```

**Verify:**

- Page loads without errors
- Hero section displays correctly
- All sections render
- Links work

### Step 6: Commit and Push

```bash
# Stage the new file
git add content/locations/worthing.mdx

# Commit
git commit -m "feat(content): add Worthing location page"

# Push to develop
git push origin develop
```

## Verification

After deployment, verify:

- [ ] Page accessible at `/locations/worthing`
- [ ] No console errors
- [ ] Hero image loads from R2
- [ ] SEO metadata correct (check page source)
- [ ] Schema markup validates (Rich Results Test)
- [ ] Internal links work
- [ ] Mobile responsive

## Adding Counties (With Towns Directory)

For county-level locations, add a `towns` section:

```yaml
towns:
  title: "West Sussex Towns We Serve"
  townsList:
    - name: "Worthing"
      slug: "worthing"
    - name: "Chichester"
      slug: "chichester"
    - name: "Crawley"
      slug: "crawley"
```

The dynamic template automatically renders this as a grid of town links.

## Troubleshooting

### "Page not found" after adding file

- Restart dev server (`npm run dev`)
- Check file is in `content/locations/` (not elsewhere)
- Verify filename matches slug (lowercase, hyphens)

### Validation errors

```bash
# See specific error
npm run validate:locations

# Common fixes:
# - Check YAML indentation (2 spaces)
# - Ensure arrays use proper syntax
# - Verify all required fields present
```

### Hero image not loading

- Check R2 bucket for file
- Verify `heroImage` path matches R2 path
- Check NEXT_PUBLIC_R2_PUBLIC_URL is set

## Related

- [Content Standards](../standards/content.md) - MDX frontmatter requirements
- [SEO Standards](../standards/seo.md) - Location SEO requirements
- [Images Standards](../standards/images.md) - Hero image requirements
- [AI Content Generation](#quick-start-ai-generation-recommended) - Automated location page creation

---

**Last Updated:** 2025-01-25
