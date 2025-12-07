# Image Standards

**Version:** 1.2.0
**Last Updated:** 2025-12-07
**Scope:** All sites in local-business-platform

---

## Overview

Images are stored in Cloudflare R2 (not in the Git repository) for performance and scalability. All images use Next.js Image component with optimized quality settings.

## Core Principles

### 1. Cloudflare R2 Storage

- ✅ All production images in Cloudflare R2
- ✅ Public read access via CDN
- ❌ NO images in Git repository (except placeholders)
- ❌ NO `/public` directory bloat

### 2. Next.js Image Component Only

- ✅ Always use `next/image` for all images
- ✅ Set explicit width/height to prevent layout shift
- ❌ NO direct `<img>` tags
- ❌ NO missing alt text

### 3. Quality Settings

Use centralized quality settings from `/lib/image-config.ts`:

```typescript
export const DEFAULT_IMAGE_QUALITY = 65; // Content images
export const HIGH_QUALITY = 80; // Hero images
export const LOW_QUALITY = 50; // Thumbnails
```

## R2 Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxxxxxxxxxx.r2.dev
```

### Next.js Config

```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**.r2.dev",  // Allow all R2 subdomain buckets
    },
    {
      protocol: "https",
      hostname: "placehold.co",  // Fallback for development
    },
  ],
}
```

## Image Usage

### Hero Images (High Quality)

```tsx
import Image from "next/image";

const r2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

<Image
  src={`${r2BaseUrl}/hero-images/Brighton-Scaffolding.png`}
  alt="Professional scaffolding services in Brighton"
  width={1920}
  height={1080}
  quality={80}
  priority={true}
  sizes="100vw"
/>;
```

### Content Images (Default Quality)

```tsx
<Image
  src={`${r2BaseUrl}/service-images/residential-scaffolding.jpg`}
  alt="Residential scaffolding installation"
  width={800}
  height={600}
  quality={65}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Thumbnails (Low Quality)

```tsx
<Image
  src={`${r2BaseUrl}/thumbnails/service-thumb.jpg`}
  alt="Access scaffolding service thumbnail"
  width={300}
  height={200}
  quality={50}
  sizes="300px"
/>
```

## Naming Conventions

### Location Hero Images

```bash
# Format: {Location}-Scaffolding.png
Brighton-Scaffolding.png
East-Sussex-Scaffolding.png
West-Sussex-Scaffolding.png
Canterbury-Scaffolding.png
```

### Service Images

```bash
# Format: {service-name}.jpg (kebab-case)
residential-scaffolding.jpg
commercial-scaffolding.jpg
industrial-scaffolding.jpg
access-scaffolding.jpg
```

### Card Images (AI-Generated)

```bash
# Format: {site}/cards/{content-type}/{slug}/{card-type}-{card-slug}.webp

# Specialist cards (3 per location)
colossus-reference/cards/locations/battle/specialist-battle-abbey-heritage.webp
colossus-reference/cards/locations/brighton/specialist-regency-heritage.webp

# Service cards (9 per location)
colossus-reference/cards/locations/battle/service-commercial-scaffolding.webp
colossus-reference/cards/locations/battle/service-residential-scaffolding.webp
```

### Project Gallery

```bash
# Format: project-{number}-{type}-{location}.jpg
project-001-residential-brighton.jpg
project-002-commercial-eastbourne.jpg
project-003-industrial-canterbury.jpg
```

## R2 Bucket Structure

**IMPORTANT:** All images in R2 must be organized within site-specific folders. This ensures clear separation between sites and prevents naming conflicts.

```
R2 Bucket/
├── colossus-reference/           # Site-specific folder (REQUIRED)
│   ├── hero/
│   │   ├── location/            # Location hero images
│   │   │   ├── Brighton-Scaffolding.webp
│   │   │   ├── Canterbury-Scaffolding.webp
│   │   │   └── ...
│   │   └── service/             # Service hero images
│   │       └── ...
│   ├── cards/                   # AI-generated card images (800x600)
│   │   └── locations/
│   │       ├── battle/
│   │       │   ├── specialist-battle-abbey-heritage.webp
│   │       │   ├── service-commercial-scaffolding.webp
│   │       │   └── ...
│   │       ├── brighton/
│   │       │   └── ...
│   │       └── ...
│   ├── certificates/            # Accreditation certificates
│   │   ├── thumbs/
│   │   │   ├── construction-line-gold-thumb.webp
│   │   │   └── ...
│   │   └── full/
│   │       ├── construction-line-gold-full.webp
│   │       └── ...
│   ├── services/
│   │   ├── residential-scaffolding.webp
│   │   └── ...
│   └── gallery/
│       ├── project-001.webp
│       └── ...
├── another-site/                 # Another site's images
│   ├── hero/
│   └── ...
└── shared/                       # Only for truly shared assets
    └── platform-logo.webp
```

### Site Folder Naming

Site folders should match the directory name in `sites/`:

| Site Directory              | R2 Folder             |
| --------------------------- | --------------------- |
| `sites/colossus-reference/` | `colossus-reference/` |
| `sites/example-plumber/`    | `example-plumber/`    |

### Why Site-Specific Folders?

1. **Prevents naming conflicts** - Each site can have `/hero/Brighton.webp` without collision
2. **Clear ownership** - Easy to identify which images belong to which site
3. **Simpler cleanup** - Delete a site's entire folder when decommissioning
4. **Better caching** - Site-specific cache invalidation possible

## Development vs Production

```typescript
// lib/image-url.ts - Helper for image URLs
export function getImageUrl(path: string): string {
  const r2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

  // Production: Use R2
  if (r2BaseUrl && process.env.NODE_ENV === "production") {
    return `${r2BaseUrl}${path}`;
  }

  // Development: Use placeholder
  return `https://placehold.co/1920x1080/3b82f6/ffffff?text=Development+Image`;
}
```

## Image Optimization Benefits

| Feature                   | Impact                  |
| ------------------------- | ----------------------- |
| WebP/AVIF auto-conversion | 25-50% smaller files    |
| Responsive sizes          | Correct size per device |
| Lazy loading              | Faster initial load     |
| 1-year caching            | Faster repeat visits    |
| Quality settings          | Balance quality/size    |

## What NOT to Do

| Anti-Pattern         | Why It's Wrong    | Correct Approach           |
| -------------------- | ----------------- | -------------------------- |
| `<img>` tags         | No optimization   | Use `next/image`           |
| Missing width/height | Layout shift      | Always set dimensions      |
| Hardcoded R2 URLs    | Not portable      | Use environment variable   |
| Images in Git        | Repository bloat  | Store in R2                |
| Missing alt text     | Accessibility/SEO | Always add descriptive alt |
| Hardcoded quality    | Inconsistent      | Use centralized config     |

## Uploading to R2

### Via Cloudflare Dashboard

1. Go to Cloudflare Dashboard → R2 → Your Bucket
2. Click "Upload" and select files
3. Organize into folders

### Via Wrangler CLI

```bash
npm install -g wrangler
wrangler login
wrangler r2 object put colossus-images/hero-images/Brighton-Scaffolding.png \
  --file=./Brighton-Scaffolding.png
```

## Cost Analysis

```
Storage: 50 sites × 50 images × 500KB = 1.25 GB
Cost: 1.25 GB × $0.015/GB = ~$0.02/month

Bandwidth: First 10 TB free
Total: ~$0-1/month (effectively free)
```

## Verification Checklist

Before completing any image work:

- [ ] Image stored in R2 (not Git)
- [ ] Using `next/image` component
- [ ] Width and height set explicitly
- [ ] Quality from centralized config
- [ ] Descriptive alt text included
- [ ] Responsive sizes configured
- [ ] Naming convention followed
- [ ] Priority set for above-fold images only

## AI Image Generation Pipeline

The platform includes tools for AI-generated card images using Google's Gemini 3 Pro Image Preview model.

### Image Types & Dimensions

| Image Type   | Dimensions | Use Case                       |
| ------------ | ---------- | ------------------------------ |
| Hero images  | 1920×1080  | Page headers, banners          |
| Card images  | 800×600    | Specialist & service cards     |
| Thumbnails   | 300×200    | Gallery previews               |
| Certificates | Various    | Full-size + thumbnail variants |

### Pipeline Commands

```bash
# Full pipeline (manifest → generate → upload → update MDX)
pnpm images:pipeline

# Individual steps
pnpm images:manifest       # Scan MDX, create image manifest with AI prompts
pnpm images:generate       # Generate images via real-time Gemini API
pnpm images:generate --limit 50  # Generate in batches (rate limit friendly)

# Batch API (for high-volume generation)
pnpm images:batch:create   # Create batch job (bypasses daily limits)
pnpm images:batch:status   # Check batch progress
pnpm images:batch:download # Download completed batch results

# Upload and finalize
pnpm images:upload         # Upload generated images to R2
pnpm images:update-mdx     # Add image references to MDX frontmatter
```

### Pipeline Tools

| Tool                         | Purpose                                     |
| ---------------------------- | ------------------------------------------- |
| `generate-image-manifest.ts` | Scans MDX, creates manifest with AI prompts |
| `generate-images-ai.ts`      | Real-time Gemini API generation             |
| `generate-images-batch.ts`   | Batch API for high-volume (2M token quota)  |
| `upload-generated-images.ts` | Uploads to R2 with proper headers           |
| `update-mdx-images.ts`       | Updates MDX frontmatter with image refs     |
| `download-batch-images.sh`   | Shell script for large batch extraction     |

### Image Manifest

The manifest (`output/image-manifest.json`) tracks all images with status:

```json
{
  "generated": "2025-12-07T10:00:00Z",
  "totalImages": 444,
  "images": [
    {
      "id": "loc-battle-specialist-battle-abbey-heritage",
      "type": "specialist-card",
      "location": "Battle",
      "cardTitle": "Battle Abbey Heritage",
      "r2Key": "colossus-reference/cards/locations/battle/specialist-battle-abbey-heritage.webp",
      "dimensions": { "width": 800, "height": 600 },
      "prompt": "Professional scaffolding around historic Battle Abbey ruins...",
      "status": "complete"
    }
  ]
}
```

**Status values:** `pending` → `generated` → `uploaded` → `complete`

### Environment Variables

```bash
# .env.local
GOOGLE_AI_API_KEY=your-gemini-api-key  # Required for AI generation
```

### Current Image Inventory

| Category         | Per Location | Total (37 locations) |
| ---------------- | ------------ | -------------------- |
| Hero images      | 1            | 37                   |
| Specialist cards | 3            | 111                  |
| Service cards    | 9            | 333                  |
| **Total**        | 13           | **481**              |

## Related Standards

- [SEO](./seo.md) - Alt text and image SEO
- [Components](./components.md) - Image component patterns

---

**Maintained By:** Digital Consulting Services
