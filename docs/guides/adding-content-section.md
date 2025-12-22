# How to Add a New Content Section

**Estimated Time:** 30-45 minutes
**Prerequisites:** Understanding of Next.js App Router, MDX, TypeScript
**Difficulty:** Intermediate

---

## Overview

This guide walks you through adding a new top-level content section to a site (e.g., `/blog`, `/products`, `/projects`, `/case-studies`). This involves creating the route structure, MDX content type, validation schema, and sitemap.

## When to Use This Guide

Use this when adding a completely new content type, such as:

- Blog posts (`/blog`)
- Products (`/products`)
- Case studies (`/case-studies`)
- Projects (`/projects`)
- Team members (`/team`)
- Resources (`/resources`)

**Do NOT use this for:**

- Adding a new service → See [Adding a Service](./adding-service.md)
- Adding a new location → See [Adding a Location](./adding-location.md)

## Prerequisites

- Access to the repository
- Understanding of Next.js App Router
- Familiarity with MDX and Zod schemas
- Basic TypeScript knowledge

## Architecture Overview

Each content section requires:

```
app/
├── [section]/
│   ├── page.tsx           # Index page listing all items
│   ├── [slug]/
│   │   └── page.tsx       # Dynamic detail page
│   └── sitemap.ts         # Section-specific sitemap
content/
└── [section]/
    ├── item-one.mdx
    └── item-two.mdx
lib/
└── schemas/
    └── [section].ts       # Zod validation schema
```

## Steps

### Step 1: Create the Content Directory

```bash
# Example: Adding a blog section
mkdir -p content/blog
```

### Step 2: Create the Zod Validation Schema

Create a schema file in `lib/schemas/`:

```typescript
// lib/schemas/blog.ts
import { z } from "zod";

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(50).max(200),
  seoTitle: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  author: z.string().optional(),
  publishedAt: z.string(), // ISO date string
  updatedAt: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  heroImage: z.string().optional(),
  featured: z.boolean().optional().default(false),
});

export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;
```

### Step 3: Add MDX Loader Support

Update `lib/mdx.ts` to support the new content type:

```typescript
// In lib/mdx.ts - add to the ContentType union
export type ContentType = "services" | "locations" | "blog";

// The existing listSlugs and loadMdx functions should work automatically
// if they use the ContentType parameter correctly
```

### Step 4: Create the Index Page

```typescript
// app/blog/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { listSlugs, loadMdx } from '@/lib/mdx'
import type { BlogFrontmatter } from '@/lib/schemas/blog'

export const metadata: Metadata = {
  title: 'Blog | Company Name',
  description: 'Latest news, insights, and updates from our team.',
}

export default async function BlogIndexPage() {
  const slugs = await listSlugs('blog')

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await loadMdx<BlogFrontmatter>('blog', slug)
      return { slug, ...frontmatter }
    })
  )

  // Sort by date, newest first
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return (
    <main>
      <h1>Blog</h1>
      <div className="grid gap-6">
        {sortedPosts.map((post) => (
          <article key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}
```

### Step 5: Create the Dynamic Detail Page

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { listSlugs, loadMdx } from '@/lib/mdx'
import type { BlogFrontmatter } from '@/lib/schemas/blog'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await listSlugs('blog')
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const { frontmatter } = await loadMdx<BlogFrontmatter>('blog', slug)
    return {
      title: frontmatter.seoTitle || `${frontmatter.title} | Company Name`,
      description: frontmatter.description,
      keywords: frontmatter.keywords,
    }
  } catch {
    return { title: 'Not Found' }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  try {
    const { frontmatter, content } = await loadMdx<BlogFrontmatter>('blog', slug)

    return (
      <article>
        <header>
          <h1>{frontmatter.title}</h1>
          <time>{new Date(frontmatter.publishedAt).toLocaleDateString()}</time>
        </header>
        <div className="prose">
          {content}
        </div>
      </article>
    )
  } catch {
    notFound()
  }
}
```

### Step 6: Create the Section Sitemap

```typescript
// app/blog/sitemap.ts
import type { MetadataRoute } from "next";
import { listSlugs } from "@/lib/mdx";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogSlugs = await listSlugs("blog");

  // Blog index page
  const indexEntry = {
    url: `${BASE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  };

  // Individual blog posts
  const postEntries = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [indexEntry, ...postEntries];
}
```

### Step 7: Register in Sitemap Index

Update `app/sitemap-index.xml/route.ts`:

```typescript
const SITEMAP_PATHS = [
  "/sitemap.xml",
  "/services/sitemap.xml",
  "/locations/sitemap.xml",
  "/blog/sitemap.xml", // Add new section
];
```

### Step 8: Add Content Validation Script (Optional)

Add a validation script in `package.json`:

```json
{
  "scripts": {
    "validate:blog": "tsx scripts/validate-content.ts blog"
  }
}
```

Or extend the existing validation script to include the new type.

### Step 9: Create Sample Content

```yaml
# content/blog/welcome-post.mdx
---
title: "Welcome to Our Blog"
description: "Introducing our new blog where we'll share industry insights, company news, and helpful tips for our customers."
publishedAt: "2025-01-15"
author: "Team"
category: "News"
tags:
  - "announcement"
  - "company news"
heroImage: "/blog/welcome-post.png"
---
## Welcome!

We're excited to launch our new blog...
```

### Step 10: Test and Verify

```bash
# Run validation
npm run validate:content

# Start dev server
npm run dev

# Test pages
open http://localhost:3000/blog
open http://localhost:3000/blog/welcome-post

# Test sitemap
open http://localhost:3000/blog/sitemap.xml
open http://localhost:3000/sitemap-index.xml

# Run build
npm run build
```

## Verification Checklist

After completing all steps, verify:

- [ ] Index page lists all content items
- [ ] Detail pages render correctly
- [ ] Sitemap generates at `/[section]/sitemap.xml`
- [ ] Sitemap index includes the new section
- [ ] Content validation passes
- [ ] Build completes without errors
- [ ] SEO metadata is correct
- [ ] Mobile responsive

## Common Patterns

### Adding Navigation Links

Update your header/navigation component:

```typescript
const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Locations" },
  { href: "/blog", label: "Blog" }, // Add new section
  { href: "/contact", label: "Contact" },
];
```

### Adding to Footer

Update footer with section link and any relevant quick links.

### Schema Markup

Add appropriate JSON-LD schema for the content type:

- Blog posts: `BlogPosting` or `Article`
- Products: `Product`
- Case studies: `Article` with `about`
- Team members: `Person`

See [Schema Standards](../standards/schema.md) for implementation details.

## Troubleshooting

### "Module not found" for schema

Ensure you've exported the schema from `lib/schemas/index.ts` if using barrel exports.

### Pages not generating

- Check `generateStaticParams` returns all slugs
- Verify content files are in correct directory
- Restart dev server after adding new content type

### Sitemap not appearing

- Verify `sitemap.ts` is in the correct directory
- Check sitemap index includes the new path
- Run build to see actual sitemap output

### Content validation failing

- Check Zod schema matches frontmatter structure
- Verify all required fields are present
- Check date formats match expected patterns

## Related

- [Adding a Service](./adding-service.md) - Add service content
- [Adding a Location](./adding-location.md) - Add location content
- [Content Standards](../standards/content.md) - MDX requirements
- [SEO Standards](../standards/seo.md) - SEO and sitemap requirements
- [Schema Standards](../standards/schema.md) - Structured data

---

**Last Updated:** 2025-12-21
