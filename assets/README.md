# Assets Directory

This directory is for **temporary local development** only.

## Production Image Storage

All production images are stored in **Cloudflare R2**, not in Git.

### Why R2 Instead of Git?

- Git doesn't scale well with binary files
- Repository would balloon to GB+ sizes
- Clone times would be extremely slow
- R2 provides CDN and automatic optimization
- Cost: ~£10/month for 50GB

### Image Naming Convention

```
{site-slug}_{component}_{page-type}_{page-slug}_{variant}.{ext}

Examples:
joes-plumbing-canterbury_hero_service_emergency-plumbing_01.jpg
joes-plumbing-canterbury_gallery_service_emergency-plumbing_01.jpg
bright-plumbing-canterbury_hero_service_boiler-repair_01.jpg
```

### Image Processing Workflow

```bash
# 1. Client provides images in ~/client-images/business-name/

# 2. Run intake tool
npm run images:intake joes-plumbing-canterbury ~/client-images/joe-plumbing/

# This automatically:
# - Validates images (size, format, dimensions)
# - Optimizes (resize, compress - typically 90%+ savings)
# - Generates WebP versions
# - Renames to standard convention
# - Uploads to Cloudflare R2
# - Updates site manifest
```

## Directory Structure

```
assets/
├── README.md (this file)
├── .gitkeep
└── [local dev images only]
```

**Production images live in Cloudflare R2, not here!**
