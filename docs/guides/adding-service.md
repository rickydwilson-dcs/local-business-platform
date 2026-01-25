# How to Add a New Service

**Estimated Time:** 15-20 minutes (manual) | 2-5 minutes (AI-generated)
**Prerequisites:** Access to content/services/ directory
**Difficulty:** Beginner

---

## Overview

This guide walks you through adding a new service type to a site. All services are MDX files with comprehensive frontmatter including FAQs - no code changes required.

## Quick Start: AI Generation (Recommended)

For faster content creation, use the AI-powered service generator:

```bash
# Generate a single service using AI
pnpm content:generate:services --site colossus-reference --services "staircase-towers" --context tools/examples/colossus-context.json

# Preview without writing (dry run)
pnpm content:generate:services --site colossus-reference --services "staircase-towers" --dry-run

# Use a specific AI provider (default: Claude)
pnpm content:generate:services --site colossus-reference --services "staircase-towers" --provider=gemini
```

The generator creates complete MDX files with:

- SEO-optimized descriptions
- About sections (whatIs, whenNeeded, whatAchieve, keyPoints)
- 8-12 relevant FAQs
- Body content

After generation, review and customize the content as needed, then continue from [Step 4: Add Hero Image](#step-4-add-hero-image-to-r2).

---

## Manual Method

## Prerequisites

- Access to the repository
- Understanding of MDX/YAML syntax
- Service information (name, description, FAQs)

## Steps

### Step 1: Create the MDX File

Create a new file in `content/services/` with the service slug:

```bash
# Example: Adding Staircase Towers
touch content/services/staircase-towers.mdx
```

**Naming convention:** lowercase, hyphens for spaces (e.g., `access-scaffolding.mdx`, `temporary-roofs.mdx`)

### Step 2: Add Frontmatter

Copy this template and customize for your service:

```yaml
---
title: "Staircase Towers"
seoTitle: "Staircase Tower Scaffolding | Colossus Scaffolding"
description: "Professional staircase tower scaffolding for safe internal access. Ideal for high ceilings, atriums, and stairwells. Free quotes available."
keywords:
  - "staircase tower scaffolding"
  - "internal scaffolding"
  - "stair tower hire"
heroImage: "/Staircase-Towers.png"
hero:
  title: "Professional Staircase Tower Solutions"
  description: "Safe, stable access for internal high-level work. Perfect for painting, decorating, and maintenance in stairwells and atriums."
  phone: "01424 466 661"
  trustBadges:
    - "TG20:21 Compliant"
    - "CISRS Qualified"
    - "Fully Insured"
  ctaText: "Get Your Free Quote"
  ctaUrl: "/contact"
about:
  whatIs: "Staircase tower scaffolding provides safe working platforms that follow the contours of internal staircases. These specialized systems allow painters, decorators, and maintenance workers to safely access high ceilings, landings, and hard-to-reach areas within stairwells."
  whenNeeded:
    - "Painting and decorating internal stairwells"
    - "Light fixture installation or replacement"
    - "Ceiling repairs in high spaces"
    - "Atrium maintenance and cleaning"
    - "Fire alarm and safety system installation"
  whatAchieve:
    - "Safe working platforms at multiple levels"
    - "Full coverage of complex stairwell shapes"
    - "Protection for stairs and flooring below"
    - "Minimal disruption to building access"
  keyPoints:
    - "Custom-designed for each stairwell configuration"
    - "CISRS qualified installers ensure safety compliance"
    - "Protective covering included for stairs and landings"
    - "Quick installation and removal"
specialists:
  title: "Staircase Tower Specialists"
  cards:
    - title: "Residential Staircase Towers"
      description: "Safe access for home stairwell work"
      icon: "home"
    - title: "Commercial Staircase Towers"
      description: "Office and retail stairwell solutions"
      icon: "building"
    - title: "Heritage Staircase Towers"
      description: "Specialist systems for listed buildings"
      icon: "landmark"
benefits:
  - "Safe working platforms on staircases"
  - "TG20:21 compliant design"
  - "Custom fit for any stairwell"
  - "Quick installation"
  - "Floor and stair protection included"
  - "CISRS qualified teams"
faqs:
  - question: "How long does staircase tower installation take?"
    answer: "Installation typically takes 2-4 hours depending on the stairwell complexity. Our teams work efficiently to minimize disruption."
  - question: "Will the staircase still be usable?"
    answer: "In most cases, we can design the tower to maintain access through the stairwell, though this depends on the specific layout and work being carried out."
  - question: "What protection do you provide for the stairs?"
    answer: "We use protective boarding and sheeting to prevent damage to stairs, landings, and flooring. All coverings are included in our quote."
  - question: "Can you work in listed buildings?"
    answer: "Yes, we have experience working in heritage properties and can adapt our systems to meet conservation requirements."
  - question: "How much weight can the tower support?"
    answer: "Our staircase towers are designed to safely support workers, tools, and materials as required by TG20:21 standards. We'll assess your specific needs during the quote."
---

## Staircase Tower Scaffolding Services

Colossus Scaffolding provides professional staircase tower solutions for safe internal access throughout South East England.

### Why Choose Our Staircase Towers?

Our experienced team designs custom solutions for each unique stairwell configuration, ensuring safe, stable platforms at every level.

### Applications

Staircase towers are ideal for:

- **Residential:** Home decoration, light fitting, ceiling repairs
- **Commercial:** Office maintenance, retail refits, cleaning
- **Heritage:** Listed building work, conservation projects
```

### Step 3: Requirements for FAQs

Every service MUST have 3-15 FAQs. This is validated by Zod schema:

```yaml
faqs:
  - question: "Question 1?"
    answer: "Answer 1..."
  - question: "Question 2?"
    answer: "Answer 2..."
  - question: "Question 3?"
    answer: "Answer 3..."
  # Add more as needed (max 15)
```

**Good FAQ topics:**

- Installation time/process
- Pricing/quoting
- Safety certifications
- Specific use cases
- Maintenance/support

### Step 4: Add Hero Image to R2

Upload the hero image to Cloudflare R2:

1. Name it correctly: `Staircase-Towers.png`
2. Upload to R2 bucket under `hero-images/`
3. Verify the URL matches the `heroImage` path

### Step 5: Validate Content

```bash
# Validate the new service file
npm run validate:services

# Or validate all content
npm run validate:content
```

**Common validation errors:**

- Less than 3 FAQs (minimum required)
- Description too short (< 50 chars) or too long (> 200 chars)
- Missing required fields

### Step 6: Test Locally

```bash
# Start development server
npm run dev

# Visit the new service page
open http://localhost:3000/services/staircase-towers
```

**Verify:**

- Page loads without errors
- Hero section displays correctly
- About section renders
- FAQs display properly
- Links work

### Step 7: Commit and Push

```bash
# Stage the new file
git add content/services/staircase-towers.mdx

# Commit
git commit -m "feat(content): add Staircase Towers service page"

# Push to develop
git push origin develop
```

## Verification

After deployment, verify:

- [ ] Page accessible at `/services/staircase-towers`
- [ ] No console errors
- [ ] Hero image loads from R2
- [ ] About section renders correctly
- [ ] All FAQs display
- [ ] SEO metadata correct
- [ ] FAQ schema validates (Rich Results Test)
- [ ] Internal links work
- [ ] Mobile responsive

## Troubleshooting

### "Page not found" after adding file

- Restart dev server (`npm run dev`)
- Check file is in `content/services/` (not elsewhere)
- Verify filename matches slug (lowercase, hyphens)

### Validation errors: "faqs must have at least 3 items"

Add more FAQ entries. Each service needs 3-15 FAQs for SEO.

### About section not rendering

Check the `about` structure:

```yaml
about:
  whatIs: "String..."
  whenNeeded:
    - "Item 1"
    - "Item 2"
  whatAchieve:
    - "Item 1"
    - "Item 2"
  keyPoints:
    - "Item 1"
    - "Item 2"
```

### YAML syntax errors

- Use 2 spaces for indentation (not tabs)
- Wrap strings with colons in quotes: `"Question: What is this?"`
- Ensure arrays have proper format

## Related

- [Content Standards](../standards/content.md) - MDX frontmatter requirements
- [SEO Standards](../standards/seo.md) - Service SEO requirements
- [Schema Standards](../standards/schema.md) - FAQ schema markup
- [AI Content Generation](#quick-start-ai-generation-recommended) - Automated service page creation

---

**Last Updated:** 2025-01-25
