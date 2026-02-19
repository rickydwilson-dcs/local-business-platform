# DJ Fox Electrical - R2 Configuration Guide

**Date:** 2026-02-15
**Purpose:** Configure Cloudflare R2 for DJ Fox Electrical image hosting
**Status:** Reference guide — R2 bucket setup is a manual task performed in Cloudflare dashboard

---

## Overview

The DJ Fox site currently uses placeholder images. This guide will configure Cloudflare R2 to serve real images from a CDN.

**Current State:**

- ✅ Next.js config ready (`remotePatterns` configured for `**.r2.dev`)
- ✅ Image utility functions ready (`getImageUrl()`, `getImageSizes()`)
- ✅ Components use proper Next.js Image component
- ⚠️ Missing: `NEXT_PUBLIC_R2_PUBLIC_URL` environment variable
- ⚠️ Missing: Actual images uploaded to R2

---

## Step 1: Create/Access R2 Bucket

### Option A: Existing Bucket

If you already have an R2 bucket for the platform:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2 Object Storage**
3. Select your existing bucket (e.g., `local-business-platform-images`)
4. Continue to Step 2

### Option B: Create New Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2 Object Storage**
3. Click **"Create bucket"**
4. Bucket name: `local-business-platform-images` (or your preferred name)
5. Location: **Automatic** (Cloudflare will optimize)
6. Click **"Create bucket"**

---

## Step 2: Enable Public Access

1. In your R2 bucket, go to **Settings** tab
2. Scroll to **Public access**
3. Click **"Connect domain"** or **"Allow public access"**
4. Choose option:
   - **Custom domain:** Use your own domain (e.g., `cdn.djfoxelectrical.co.uk`)
   - **R2.dev subdomain:** Use Cloudflare's subdomain (e.g., `pub-abc123.r2.dev`)

**Recommended:** Use R2.dev subdomain for simplicity (free, instant setup)

5. Copy the **Public URL** (you'll need this for Step 3)
   - Format: `https://pub-xxxxxxxxxxxx.r2.dev`

---

## Step 3: Configure Environment Variable

Create `.env.local` file in the DJ Fox site directory:

```bash
cd /Users/rickywilson/Library/CloudStorage/GoogleDrive-rickydwilson@gmail.com/My\ Drive/Websites/GitHub/local-business-platform/sites/dj-fox-electrical

# Create .env.local file
cat > .env.local << 'EOF'
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="D J Fox Electrical"

# Cloudflare R2 Image CDN
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxxxxxxxxxx.r2.dev

# Contact Form
CONTACT_EMAIL_TO=info@djfoxelectrical.co.uk
CONTACT_EMAIL_FROM=noreply@djfoxelectrical.co.uk

# Rate Limiting - Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key-here
EOF
```

**Important:** Replace `https://pub-xxxxxxxxxxxx.r2.dev` with your actual R2 public URL from Step 2.

---

## Step 4: Create Folder Structure in R2

Images must be organized in site-specific folders. Create this structure in your R2 bucket:

```
R2 Bucket/
└── dj-fox-electrical/           # Site-specific folder (REQUIRED)
    ├── hero/                    # Hero images (1920x1080)
    │   ├── hero-electrician-work.jpg
    │   ├── about-hero.jpg
    │   ├── services-hero.jpg
    │   ├── contact-hero.jpg
    │   └── pricing-hero.jpg
    ├── categories/              # Category grid images (800x600)
    │   ├── installation-work.jpg
    │   ├── maintenance-work.jpg
    │   └── repair-work.jpg
    ├── sections/                # Section images (800x600)
    │   ├── electrician-working.jpg
    │   ├── electrician-portrait.jpg
    │   └── electrical-inspection.jpg
    └── team/                    # Team photos (512x512)
        └── daniel-fox.jpg
```

### Upload via Cloudflare Dashboard

1. Go to your R2 bucket
2. Click **"Create folder"** → Enter `dj-fox-electrical`
3. Open `dj-fox-electrical` folder
4. Create subfolders: `hero`, `categories`, `sections`, `team`
5. Upload images to respective folders

### Upload via Wrangler CLI (Advanced)

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Upload a single image
wrangler r2 object put local-business-platform-images/dj-fox-electrical/hero/hero-electrician-work.jpg \
  --file=./hero-electrician-work.jpg \
  --content-type=image/jpeg

# Upload multiple images (loop)
for file in ./images/*.jpg; do
  filename=$(basename "$file")
  wrangler r2 object put local-business-platform-images/dj-fox-electrical/hero/$filename \
    --file="$file" \
    --content-type=image/jpeg
done
```

---

## Step 5: Image Requirements

### Hero Images (High Priority)

| Image Path                       | Dimensions | Description                              | Location      |
| -------------------------------- | ---------- | ---------------------------------------- | ------------- |
| `hero/hero-electrician-work.jpg` | 1920x1080  | Electrician working on electrical panel  | Homepage      |
| `hero/about-hero.jpg`            | 1920x1080  | Team photo or professional portrait      | About page    |
| `hero/services-hero.jpg`         | 1920x1080  | Electrical services in action            | Services page |
| `hero/contact-hero.jpg`          | 1920x1080  | Professional setting or office           | Contact page  |
| `hero/pricing-hero.jpg`          | 1920x1080  | Electrical inspection or pricing context | Pricing page  |

### Category Grid Images

| Image Path                         | Dimensions | Description                  |
| ---------------------------------- | ---------- | ---------------------------- |
| `categories/installation-work.jpg` | 800x600    | New electrical installations |
| `categories/maintenance-work.jpg`  | 800x600    | Regular maintenance services |
| `categories/repair-work.jpg`       | 800x600    | Emergency repairs            |

### Section Images

| Image Path                           | Dimensions | Description           | Used In          |
| ------------------------------------ | ---------- | --------------------- | ---------------- |
| `sections/electrician-working.jpg`   | 800x600    | Electrician at work   | About page 50/50 |
| `sections/electrician-portrait.jpg`  | 800x600    | Professional portrait | Contact page     |
| `sections/electrical-inspection.jpg` | 800x600    | Safety inspection     | Pricing page     |

### Team Photos

| Image Path            | Dimensions | Description                              |
| --------------------- | ---------- | ---------------------------------------- |
| `team/daniel-fox.jpg` | 512x512    | Daniel Fox - Director & Lead Electrician |

---

## Step 6: Update Image References

Once images are uploaded, the site will automatically use them. The `getImageUrl()` function constructs the full path:

```typescript
// Current code (already implemented):
import { getImageUrl } from "@platform/core-components/lib/image";

// Constructs: https://pub-xxx.r2.dev/dj-fox-electrical/hero/hero-electrician-work.jpg
const heroImage = getImageUrl("dj-fox-electrical/hero/hero-electrician-work.jpg");
```

**Note:** All components already use `getImageUrl()`, so no code changes needed!

---

## Step 7: Verify Configuration

### Local Development

1. Restart the dev server:

```bash
# Kill existing server
lsof -ti:3000 | xargs kill -9

# Start fresh (will load new .env.local)
cd sites/dj-fox-electrical && npm run dev
```

2. Open http://localhost:3000
3. Check browser console for warnings:
   - ❌ "NEXT_PUBLIC_R2_PUBLIC_URL is not set" → Fix .env.local
   - ✅ No warnings → Configuration successful

### Image Loading

1. Open browser DevTools → Network tab
2. Filter by "img"
3. Verify images load from R2:
   - ✅ Status 200 from `pub-xxx.r2.dev`
   - ❌ Status 404 → Image not uploaded or path wrong
   - ❌ Loading from `placehold.co` → R2 URL not configured

---

## Step 8: Production Deployment

### Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select DJ Fox Electrical project
3. Go to **Settings** → **Environment Variables**
4. Add variables for all environments (Production, Preview, Development):

```
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxxxxxxxxxx.r2.dev
NEXT_PUBLIC_SITE_URL=https://djfoxelectrical.co.uk
CONTACT_EMAIL_TO=info@djfoxelectrical.co.uk
CONTACT_EMAIL_FROM=noreply@djfoxelectrical.co.uk
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

5. Redeploy the site to apply changes

### Verify Production

1. Visit production URL
2. Check images load from R2 (not placeholders)
3. Test on mobile devices
4. Run Lighthouse audit (images should score 90+)

---

## Troubleshooting

### Images Not Loading (404)

**Problem:** Browser shows 404 for R2 images

**Solutions:**

1. Verify R2 public access enabled
2. Check folder structure matches: `dj-fox-electrical/hero/...`
3. Verify file extensions match (.jpg vs .jpeg)
4. Check R2 bucket CORS settings (allow `*` origin for images)

### Placeholder Images Still Showing

**Problem:** Site shows "R2 URL Not Configured" placeholders

**Solutions:**

1. Verify `.env.local` exists and has correct URL
2. Restart dev server after creating `.env.local`
3. Check browser console for configuration warnings
4. Ensure variable name is `NEXT_PUBLIC_R2_PUBLIC_URL` (case-sensitive)

### Next.js Image Optimization Error

**Problem:** "Hostname not configured in images.remotePatterns"

**Solutions:**

1. Verify `next.config.ts` has `**.r2.dev` pattern
2. Check R2 URL format matches `https://pub-xxx.r2.dev`
3. Restart dev server after config changes

### CORS Errors

**Problem:** Browser blocks R2 images due to CORS

**Solutions:**

1. In R2 bucket settings, go to **CORS policy**
2. Add CORS rule:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## Cost Estimate

### R2 Pricing (as of 2026)

```
Storage: 15 images × 500 KB = 7.5 MB
Cost: 7.5 MB × $0.015/GB = ~$0.0001/month (effectively free)

Bandwidth: First 10 TB/month free
Typical usage: ~50 GB/month for small business site
Cost: $0/month (within free tier)

Class A Operations (writes): ~15 uploads = $0.0001
Class B Operations (reads): ~10,000/month = $0.001

Total: ~$0.001/month (less than 1 cent)
```

**Verdict:** R2 is essentially free for a single business website.

---

## Image Optimization Tips

### Use WebP/AVIF Format

- 25-50% smaller than JPEG
- Supported by all modern browsers
- Next.js auto-converts if source is WebP

### Set Appropriate Quality

- Hero images: `quality={80}` (high detail)
- Content images: `quality={65}` (balanced)
- Thumbnails: `quality={50}` (small file size)

### Enable Priority Loading

```tsx
// Only for above-the-fold images (homepage hero)
<Image
  src={heroImage}
  priority={true}
  ...
/>
```

### Use Correct Sizes

```tsx
// Full-width hero
sizes = "100vw";

// 50% width on desktop
sizes = "(max-width: 768px) 100vw, 50vw";

// Card in 3-column grid
sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
```

---

## Quick Setup Checklist

- [ ] Create or access R2 bucket
- [ ] Enable public access (get public URL)
- [ ] Create `.env.local` with `NEXT_PUBLIC_R2_PUBLIC_URL`
- [ ] Create folder structure: `dj-fox-electrical/hero/`, `/categories/`, `/sections/`, `/team/`
- [ ] Upload 12 required images (5 heroes + 3 categories + 3 sections + 1 team)
- [ ] Restart dev server
- [ ] Verify images load (check Network tab)
- [ ] Add Vercel environment variables
- [ ] Deploy to production
- [ ] Test on production URL

---

## Next Steps After R2 Setup

1. **Professional Photography**
   - Hire photographer for authentic electrical work photos
   - Get high-resolution images (minimum 1920x1080)
   - Include team photos of Daniel Fox

2. **Image SEO**
   - All images already have proper alt text (implemented)
   - Images auto-included in sitemap
   - Use descriptive file names

3. **Performance**
   - Run Lighthouse audit
   - Target: 90+ Performance score
   - Images should show as optimized

4. **Content**
   - Add more project gallery images
   - Create service-specific images
   - Add location-specific photos for top areas

---

## Related Documents

- Platform Standards: `docs/standards/images.md`
- Next.js Config: `sites/dj-fox-electrical/next.config.ts`
- Image Utility: `packages/core-components/src/lib/image.ts`
- Design Implementation: `output/sessions/2026-02-15_dj-fox-design-implementation-complete.md`

---

**Status:** Ready for R2 setup
**Estimated Time:** 30-60 minutes (depending on image preparation)
