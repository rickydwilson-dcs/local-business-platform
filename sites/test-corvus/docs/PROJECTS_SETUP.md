# Projects Setup Guide

This guide covers setting up the portfolio/projects system in base-template for showcasing completed work.

## Directory Structure

```
content/
└── projects/
    ├── example-residential-project.mdx
    └── your-new-project.mdx
```

## Creating a Project

### 1. Create the MDX File

Create a new file in `content/projects/`:

- Use descriptive, SEO-friendly filenames
- Include location if relevant: `victorian-renovation-canterbury.mdx`
- The filename becomes the URL slug

### 2. Required Frontmatter

```yaml
---
title: 'Victorian Home Renovation - Canterbury'
description: 'Complete renovation of a 4-bedroom Victorian property in Canterbury with period-appropriate details.'
projectType: 'residential'
category: 'renovation'
location: 'canterbury'
locationName: 'Canterbury'
completionDate: '2025-11-15'
year: 2025
services:
  - 'primary-service'
heroImage: '/images/projects/canterbury-victorian.webp'
---
```

### 3. Optional Fields

```yaml
slug: 'custom-url-slug'
seoTitle: 'Victorian Renovation Canterbury | Your Business'
keywords: ['victorian renovation', 'canterbury builder']
status: 'completed'
region: 'Kent'
address: '123 High Street'
duration: '12 weeks'

client:
  type: 'Private Homeowner'
  industry: 'N/A'
  testimonial: 'Excellent work throughout the project...'
  rating: 5

scope:
  buildingType: 'Victorian Terraced House'
  storeys: 3
  squareMetres: 220
  challenges:
    - 'Listed building restrictions'
    - 'Period feature restoration'
    - 'Hidden structural issues'

images:
  - path: '/images/projects/canterbury-1.webp'
    caption: 'Before: Original kitchen condition'
    order: 1
  - path: '/images/projects/canterbury-2.webp'
    caption: 'During: Structural work in progress'
    order: 2
  - path: '/images/projects/canterbury-3.webp'
    caption: 'After: Completed renovation'
    order: 3

results:
  - 'Completed 1 week ahead of schedule'
  - 'Increased property value by 25%'
  - 'Featured in local magazine'

faqs:
  - question: 'How long did this project take?'
    answer: 'The complete renovation took 12 weeks from start to finish.'
```

## Project Types

Choose from these project types:

| Type          | Use For                              |
| ------------- | ------------------------------------ |
| `residential` | Homes, flats, private properties     |
| `commercial`  | Offices, retail, business premises   |
| `industrial`  | Factories, warehouses, workshops     |
| `heritage`    | Listed buildings, conservation areas |

## Project Categories

Choose from these categories:

| Category      | Description                 |
| ------------- | --------------------------- |
| `heritage`    | Period property restoration |
| `new-build`   | New construction projects   |
| `renovation`  | Full property renovations   |
| `maintenance` | Ongoing maintenance work    |
| `emergency`   | Emergency response projects |

### Customising Categories

Update `ProjectCategory` in `lib/content-schemas.ts` to add categories:

```typescript
export const ProjectCategory = z.enum([
  'heritage',
  'new-build',
  'renovation',
  'maintenance',
  'emergency',
  'your-category', // Add here
]);
```

## Client Information

### Client Types

```yaml
client:
  type: 'Private Homeowner' # or Property Developer, Local Authority, Business
```

### With Testimonial

```yaml
client:
  type: 'Private Homeowner'
  testimonial: 'The team exceeded our expectations in every way...'
  rating: 5
```

### Commercial Client

```yaml
client:
  type: 'Business'
  industry: 'Hospitality'
  testimonial: 'Professional service throughout...'
  rating: 5
```

## Project Scope

Document the scope for credibility:

```yaml
scope:
  buildingType: 'Detached House'
  storeys: 2
  squareMetres: 180
  challenges:
    - 'Asbestos removal required'
    - 'Limited site access'
    - 'Occupied building'
```

## Image Gallery

### Gallery Structure

```yaml
images:
  - path: '/images/projects/project-before.webp'
    caption: 'Before: Initial state'
    order: 1
  - path: '/images/projects/project-during.webp'
    caption: 'During: Work in progress'
    order: 2
  - path: '/images/projects/project-after.webp'
    caption: 'After: Completed work'
    order: 3
```

### Image Best Practices

- Use consistent aspect ratios
- Include before/during/after shots
- Write descriptive captions
- Order images logically (1, 2, 3...)

## Results & Outcomes

Document measurable results:

```yaml
results:
  - 'Completed 2 weeks ahead of schedule'
  - 'Delivered £5,000 under budget'
  - 'Zero defects at final inspection'
  - 'Client awarded 5-star review'
  - 'Energy efficiency improved by 40%'
```

Results should be:

- Specific and measurable
- Relevant to potential clients
- Honest and verifiable

## Linking to Services

Link projects to services for cross-referencing:

```yaml
services:
  - 'primary-service'
  - 'secondary-service'
```

This creates links to service pages and improves internal linking.

## Status Options

```yaml
status: "completed"   # Default
status: "in-progress" # For ongoing projects
status: "featured"    # For highlighted projects
```

## Content Structure

After frontmatter, write the project content:

```mdx
# Project Title

## Project Overview

Introduction and context for the project...

## The Challenge

What problems needed solving...

## Our Approach

How we tackled the project...

## The Results

What we achieved...

## Client Testimonial

> "Quote from the client..."
> — Client Name, Client Type

## Gallery

[Images render automatically from frontmatter]

## Conclusion

Call to action for similar projects...
```

## Routes

| Route                           | Description               |
| ------------------------------- | ------------------------- |
| `/projects`                     | Projects listing page     |
| `/projects/[slug]`              | Individual project detail |
| `/projects?type=residential`    | Filtered by type          |
| `/projects?category=renovation` | Filtered by category      |

## SEO Best Practices

### Title

- Include project type and location
- Example: "Victorian Kitchen Renovation - Canterbury"

### Description

- 150-160 characters
- Mention key achievements
- Include location for local SEO

### Hero Image

- Use best "after" photo
- High quality, well-lit
- Shows the completed work

## Validation

```bash
npm run validate:content
```

Check for:

- Required fields present
- Valid projectType and category
- Valid date format
- At least one service linked
