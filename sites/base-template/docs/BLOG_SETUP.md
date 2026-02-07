# Blog Setup Guide

This guide covers setting up and customising the blog system in base-template.

## Directory Structure

```
content/
└── blog/
    ├── example-industry-tips.mdx
    ├── example-how-to-guide.mdx
    └── your-new-post.mdx
```

## Creating a Blog Post

### 1. Create the MDX File

Create a new file in `content/blog/` with a descriptive filename:

- Use lowercase with hyphens
- Make it descriptive: `how-to-choose-a-plumber.mdx`
- The filename becomes the URL slug

### 2. Add Frontmatter

Every blog post requires frontmatter at the top:

```yaml
---
title: 'Your Blog Post Title'
slug: 'optional-custom-slug'
description: 'A compelling meta description for search engines. Aim for 150-160 characters.'
date: '2026-01-15'
author:
  name: 'Author Name'
  role: 'Job Title'
  avatar: '/images/authors/author.webp'
category: 'industry-tips'
tags:
  - 'relevant'
  - 'keywords'
  - 'for-filtering'
heroImage: '/images/blog/post-hero.webp'
excerpt: 'A short excerpt shown in listings. Should hook readers and encourage clicks.'
featured: false
readingTime: 5
relatedServices:
  - 'service-slug'
relatedLocations:
  - 'location-slug'
---
```

### 3. Write Content

After the frontmatter, write your content in MDX:

```mdx
# Your Post Title

Introduction paragraph that hooks the reader...

## First Section

Content with **bold** and _italic_ formatting.

### Subsection

- Bullet points
- For lists

## Second Section

More content here...

## Conclusion

Wrap up and call to action.
```

## Categories

Choose from these predefined categories:

| Category        | Use For                          |
| --------------- | -------------------------------- |
| `industry-tips` | Expert advice and best practices |
| `how-to-guide`  | Step-by-step tutorials           |
| `case-study`    | Success stories and examples     |
| `seasonal`      | Time-sensitive content           |
| `news`          | Company and industry updates     |

### Customising Categories

To add new categories, update the `BlogCategory` enum in `lib/content-schemas.ts`:

```typescript
export const BlogCategory = z.enum([
  'industry-tips',
  'how-to-guide',
  'case-study',
  'seasonal',
  'news',
  'your-new-category', // Add here
]);
```

## Author Configuration

### Single Author

```yaml
author:
  name: 'John Smith'
```

### Full Author Details

```yaml
author:
  name: 'John Smith'
  role: 'Senior Consultant'
  avatar: '/images/authors/john-smith.webp'
```

## Featured Posts

Mark posts as featured to highlight them on the blog listing page:

```yaml
featured: true
```

Featured posts:

- Appear in the "Featured" section at the top
- May have enhanced visual treatment
- Should be your best, most relevant content

## Related Content

Link posts to services and locations for cross-promotion:

```yaml
relatedServices:
  - 'primary-service'
  - 'secondary-service'
relatedLocations:
  - 'main-area'
  - 'north-region'
```

These links:

- Improve internal linking for SEO
- Help readers discover relevant services
- Show related content on the post page

## Reading Time

You can specify reading time manually:

```yaml
readingTime: 5 # minutes
```

If omitted, reading time is calculated automatically based on word count (average 200 words per minute).

## Images

### Hero Image

```yaml
heroImage: '/images/blog/post-hero.webp'
```

### In-Content Images

Use standard Markdown syntax:

```markdown
![Alt text description](/images/blog/inline-image.webp)
```

### Image Best Practices

- Use WebP format for better performance
- Optimise images before upload (max 200KB)
- Always include descriptive alt text
- Use consistent aspect ratios (16:9 recommended for heroes)

## SEO Best Practices

### Title

- 50-60 characters ideal
- Include primary keyword
- Make it compelling and clickable

### Description

- 150-160 characters
- Include primary keyword naturally
- Summarise the value readers will get

### Excerpt

- 100-200 characters
- Hook the reader
- Different from description (shown in listings)

### Keywords in Tags

- Use 3-7 relevant tags
- Include variations of primary keyword
- Think about what users search for

## URL Structure

Posts are accessible at `/blog/[slug]`:

- `/blog/example-industry-tips`
- `/blog/how-to-choose-a-plumber`

The slug is derived from the filename unless overridden in frontmatter.

## Validation

Before publishing, validate your content:

```bash
npm run validate:content
```

Check for:

- Required fields present
- Character limits met
- Valid date format (YYYY-MM-DD)
- Valid category value

## Routes

| Route                         | Description          |
| ----------------------------- | -------------------- |
| `/blog`                       | Blog listing page    |
| `/blog/[slug]`                | Individual blog post |
| `/blog?category=how-to-guide` | Filtered by category |
