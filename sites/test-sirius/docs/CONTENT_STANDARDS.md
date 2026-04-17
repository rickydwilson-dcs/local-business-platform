# Content Standards

This guide covers the MDX-only content architecture used in base-template, including frontmatter requirements, validation rules, and best practices for each content type.

## Overview

All site content is managed through MDX files located in the `content/` directory. This architecture ensures:

- **Type Safety**: Zod schemas validate all frontmatter at build time
- **SEO Optimization**: Required fields enforce SEO best practices
- **Consistency**: Standardized structure across all content
- **Flexibility**: MDX allows rich content with React components

## Content Types

| Type         | Directory               | Purpose                      |
| ------------ | ----------------------- | ---------------------------- |
| Services     | `content/services/`     | Business service offerings   |
| Locations    | `content/locations/`    | Geographic service areas     |
| Blog         | `content/blog/`         | Articles, guides, and news   |
| Projects     | `content/projects/`     | Portfolio/case studies       |
| Testimonials | `content/testimonials/` | Customer reviews and ratings |

---

## Services

Services represent the core offerings of your business.

### Required Fields

```yaml
title: 'Service Name' # 5-100 characters
faqs: # 3-15 FAQ items required
  - question: '...' # Minimum 10 characters
    answer: '...' # Minimum 20 characters
```

### Optional Fields

```yaml
seoTitle: 'SEO Title | Business' # 10-60 characters
description: 'Meta description...' # 50-200 characters
keywords: ['keyword1', 'keyword2'] # 3-10 keywords
hero:
  heading: 'Hero Heading'
  subheading: 'Supporting text'
  image: '/images/service.webp'
  cta:
    label: 'Get Quote'
    href: '/contact'
benefits: ['Benefit 1', 'Benefit 2']
about:
  whatIs: 'Service description...'
  whenNeeded: ['Situation 1', 'Situation 2']
  whatAchieve: ['Outcome 1', 'Outcome 2']
  keyPoints: ['Point 1', 'Point 2']
heroImage: '/images/hero.webp'
```

### Example Service File

```mdx
---
title: 'Emergency Plumbing'
seoTitle: '24/7 Emergency Plumbing Services | Your Business'
description: 'Fast, reliable emergency plumbing services available 24/7. Professional response within 60 minutes.'
keywords: ['emergency plumber', '24 hour plumber', 'urgent plumbing']
hero:
  heading: 'Emergency Plumbing When You Need It'
  subheading: 'Available 24/7, 365 days a year'
  image: '/images/emergency-plumbing.webp'
  cta:
    label: 'Call Now'
    href: '/contact'
faqs:
  - question: 'How quickly can you respond to emergencies?'
    answer: 'We aim to arrive within 60 minutes for all emergency calls.'
  - question: 'What emergencies do you handle?'
    answer: 'We handle burst pipes, blocked drains, boiler failures, and all urgent plumbing issues.'
  - question: 'Is there an extra charge for emergency calls?'
    answer: 'Emergency rates apply outside standard hours. We always quote before starting work.'
---

# Emergency Plumbing Services

Content about your emergency plumbing services goes here...
```

---

## Locations

Locations represent geographic service areas for local SEO.

### Required Fields

```yaml
title: 'Location Name' # 2-50 characters
seoTitle: 'SEO Title | Business' # 10-80 characters
description: 'Meta description...' # 50-200 characters
```

### Optional Fields

```yaml
keywords: ['local keyword', 'area service'] # 3+ keywords
heroImage: '/images/location.webp'
hero:
  heading: 'Services in Location'
  subheading: 'Supporting value proposition'
  image: 'placeholder/hero.webp'
  cta:
    label: 'Get Quote'
    href: '/contact'
  phone: '01234 567890'
  trustBadges: ['Licensed', 'Insured']
specialists:
  title: 'Local Team'
  description: 'Meet our local experts...'
  cards:
    - title: 'Specialist Name'
      description: 'Bio...'
services:
  title: 'Available Services'
  description: 'Services we offer...'
  items:
    - title: 'Service Name'
      description: 'Service description'
      link: '/services/service-slug'
faqs: # 5-20 FAQs when provided
  - question: '...'
    answer: '...'
```

### Example Location File

```mdx
---
title: 'Canterbury'
seoTitle: 'Professional Services in Canterbury | Your Business'
description: 'Trusted local services in Canterbury and surrounding areas. Expert team with 20+ years experience.'
keywords: ['canterbury services', 'local provider canterbury']
hero:
  heading: 'Your Trusted Canterbury Experts'
  subheading: 'Serving Canterbury and Kent for over 20 years'
  image: 'placeholder/hero-canterbury.webp'
  cta:
    label: 'Get Your Canterbury Quote'
    href: '/contact'
faqs:
  - question: 'Do you serve all of Canterbury?'
    answer: 'Yes, we cover all Canterbury postcodes and surrounding villages.'
  # ... more FAQs
---

# Canterbury Services

Content about your Canterbury services goes here...
```

---

## Blog

Blog posts are articles, guides, and news content.

### Required Fields

```yaml
title: 'Article Title' # 10-100 characters
date: '2026-01-15' # YYYY-MM-DD format
author:
  name: 'Author Name' # 2+ characters
description: 'Meta description...' # 50-200 characters
category: 'industry-tips' # See categories below
tags: ['tag1', 'tag2'] # 1-10 tags
excerpt: 'Short excerpt...' # 50-300 characters
```

### Categories

- `industry-tips` - Expert advice and best practices
- `how-to-guide` - Step-by-step tutorials
- `case-study` - Real-world examples and success stories
- `seasonal` - Time-sensitive or seasonal content
- `news` - Company news and industry updates

### Optional Fields

```yaml
slug: 'custom-url-slug'
seoTitle: 'SEO Title' # 10-60 characters
keywords: ['keyword1', 'keyword2']
author:
  role: 'Job Title'
  avatar: '/images/author.webp'
heroImage: '/images/blog-hero.webp'
readingTime: 5 # Minutes (auto-calculated if omitted)
featured: true
relatedServices: ['service-slug']
relatedLocations: ['location-slug']
```

---

## Projects

Projects are portfolio items showcasing completed work.

### Required Fields

```yaml
title: 'Project Title' # 10-100 characters
description: 'Project summary...' # 50-200 characters
projectType: 'residential' # residential|commercial|industrial|heritage
category: 'renovation' # heritage|new-build|renovation|maintenance|emergency
location: 'location-slug'
locationName: 'Location Name'
completionDate: '2025-11-15' # YYYY-MM-DD format
year: 2025
services: ['service-slug'] # At least 1 service
heroImage: '/images/project.webp'
```

### Optional Fields

```yaml
slug: 'custom-url-slug'
seoTitle: 'SEO Title'
keywords: ['keyword1', 'keyword2']
status: 'completed' # completed|in-progress|featured
region: 'Region Name'
duration: '6 weeks'
client:
  type: 'Private Homeowner' # Private Homeowner|Property Developer|Local Authority|Business
  industry: 'Industry name'
  testimonial: 'Client quote...'
  rating: 5 # 1-5 stars
scope:
  buildingType: 'Detached House'
  storeys: 2
  squareMetres: 180
  challenges: ['Challenge 1', 'Challenge 2']
images:
  - path: '/images/project-1.webp'
    caption: 'Image description'
    order: 1
results: ['Result 1', 'Result 2']
faqs:
  - question: '...'
    answer: '...'
```

---

## Testimonials

Testimonials are customer reviews and ratings.

### Required Fields

```yaml
customerName: 'Customer Name' # 2-100 characters
rating: 5 # 1-5 stars
text: 'Review text...' # 20-1000 characters
date: '2025-12-15' # YYYY-MM-DD format
```

### Optional Fields

```yaml
customerRole: 'Homeowner'
customerCompany: 'Company Name'
excerpt: 'Short excerpt' # Max 200 characters
photo: '/images/customer.webp'
service: 'Service Name'
serviceSlug: 'service-slug'
location: 'Location Name'
locationSlug: 'location-slug'
projectType: 'residential' # residential|commercial|industrial
featured: true # Default: false
verified: true # Default: true
platform: 'google' # internal|google|trustpilot|reviews.io
```

---

## Validation Rules

### SEO Constraints

| Field       | Min | Max   | Ideal   |
| ----------- | --- | ----- | ------- |
| Title       | 5   | 100   | 50-60   |
| SEO Title   | 10  | 60-80 | 50-60   |
| Description | 50  | 200   | 150-160 |
| Keywords    | 3   | 10    | 5-7     |

### Content Requirements

| Content Type | FAQs Required        |
| ------------ | -------------------- |
| Services     | 3-15                 |
| Locations    | 5-20 (when provided) |
| Projects     | Optional             |

### Running Validation

```bash
# Validate all content
npm run validate:content

# Validate specific types
npm run validate:services
npm run validate:locations
```

---

## Image Path Conventions

Images can be referenced two ways:

### Local Images

```yaml
heroImage: '/images/services/plumbing-hero.webp'
```

### R2 CDN Images

```yaml
heroImage: 'my-site/hero/services/plumbing.webp'
```

---

## Common Mistakes

### 1. Description Too Short

```yaml
# Wrong - under 50 characters
description: "We offer plumbing services."

# Right - 50+ characters with value proposition
description: "Professional plumbing services with 24/7 emergency response and free quotes."
```

### 2. Missing FAQs

Services require 3-15 FAQs. Each FAQ needs:

- Question: minimum 10 characters
- Answer: minimum 20 characters

### 3. Invalid Date Format

```yaml
# Wrong
date: "January 15, 2026"
date: "15/01/2026"

# Right
date: "2026-01-15"
```

### 4. Missing Required Fields

Always check the schema requirements before creating content. The build will fail if required fields are missing.
