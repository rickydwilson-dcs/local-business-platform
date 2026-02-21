# DJ Fox R2 Setup - Current Status

**Date:** 2026-02-15
**Bucket:** `local-business-platform` (shared across all platform sites)
**Site Folder:** `djfoxelectrical/`

---

## ✅ Completed

1. **Environment Configuration**
   - Created `.env.local` with R2 URL: `https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev`
   - Configured for development use

2. **Next.js Configuration**
   - Already configured for `**.r2.dev` in `next.config.ts`
   - Image optimization settings ready

---

## 📋 Required: R2 Folder Structure

You need to create this folder structure in the **existing** R2 bucket `local-business-platform`:

```
local-business-platform/              # ← Existing bucket
└── djfoxelectrical/                  # ← CREATE THIS FOLDER
    ├── hero/                         # ← Hero images (1920x1080)
    │   ├── hero-electrician-work.jpg
    │   ├── about-hero.jpg
    │   ├── services-hero.jpg
    │   ├── contact-hero.jpg
    │   └── pricing-hero.jpg
    ├── categories/                   # ← Category images (800x600)
    │   ├── installation-work.jpg
    │   ├── installation-category.jpg
    │   ├── maintenance-work.jpg
    │   ├── maintenance-category.jpg
    │   ├── repair-work.jpg
    │   └── repair-category.jpg
    ├── sections/                     # ← Section images (800x600)
    │   ├── electrician-working.jpg
    │   ├── electrician-portrait.jpg
    │   └── electrical-inspection.jpg
    └── team/                         # ← Team photos (512x512)
        └── daniel-fox.jpg
```

### How to Create in Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2 Object Storage**
3. Click on **`local-business-platform`** bucket
4. Click **"Create folder"**
5. Name: `djfoxelectrical`
6. Inside `djfoxelectrical`, create subfolders: `hero`, `categories`, `sections`, `team`

---

## 🔧 Required: Update Image Paths in Code

The image paths currently use `/images/...` format but need to be `djfoxelectrical/...` format.

### Files to Update

#### 1. Homepage (`app/page.tsx`)

**Current:**

```typescript
imageSrc = "/images/hero-electrician-work.jpg";
imageSrc = "/images/installation-work.jpg";
imageSrc = "/images/maintenance-work.jpg";
imageSrc = "/images/repair-work.jpg";
```

**Should be:**

```typescript
imageSrc = "djfoxelectrical/hero/hero-electrician-work.jpg";
imageSrc = "djfoxelectrical/categories/installation-work.jpg";
imageSrc = "djfoxelectrical/categories/maintenance-work.jpg";
imageSrc = "djfoxelectrical/categories/repair-work.jpg";
```

#### 2. About Page (`app/about/page.tsx`)

**Current:**

```typescript
imageSrc="/images/about-hero.jpg"
src={getImageUrl('/images/electrician-working.jpg')}
src={getImageUrl('/images/team/daniel-fox.jpg')}
```

**Should be:**

```typescript
imageSrc="djfoxelectrical/hero/about-hero.jpg"
src={getImageUrl('djfoxelectrical/sections/electrician-working.jpg')}
src={getImageUrl('djfoxelectrical/team/daniel-fox.jpg')}
```

#### 3. Services Page (`app/services/page.tsx`)

**Current:**

```typescript
imageSrc = "/images/services-hero.jpg";
imageSrc = "/images/installation-category.jpg";
imageSrc = "/images/maintenance-category.jpg";
imageSrc = "/images/repair-category.jpg";
```

**Should be:**

```typescript
imageSrc = "djfoxelectrical/hero/services-hero.jpg";
imageSrc = "djfoxelectrical/categories/installation-category.jpg";
imageSrc = "djfoxelectrical/categories/maintenance-category.jpg";
imageSrc = "djfoxelectrical/categories/repair-category.jpg";
```

#### 4. Contact Page (`app/contact/page.tsx`)

**Current:**

```typescript
imageSrc="/images/contact-hero.jpg"
src={getImageUrl('/images/electrician-portrait.jpg')}
```

**Should be:**

```typescript
imageSrc="djfoxelectrical/hero/contact-hero.jpg"
src={getImageUrl('djfoxelectrical/sections/electrician-portrait.jpg')}
```

#### 5. Pricing Page (`app/pricing/page.tsx`)

**Current:**

```typescript
src={getImageUrl('/images/electrical-inspection.jpg')}
```

**Should be:**

```typescript
src={getImageUrl('djfoxelectrical/sections/electrical-inspection.jpg')}
```

---

## 📸 Still Required: Actual Images

**Status:** NO images have been created/uploaded yet.

You need **14 images total:**

### Hero Images (5 files - 1920x1080px)

1. `hero-electrician-work.jpg` - Homepage hero
2. `about-hero.jpg` - About page hero
3. `services-hero.jpg` - Services page hero
4. `contact-hero.jpg` - Contact page hero
5. `pricing-hero.jpg` - Pricing page hero

### Category Images (6 files - 800x600px)

6. `installation-work.jpg` - Installation card (homepage)
7. `installation-category.jpg` - Installation card (services page)
8. `maintenance-work.jpg` - Maintenance card (homepage)
9. `maintenance-category.jpg` - Maintenance card (services page)
10. `repair-work.jpg` - Repair card (homepage)
11. `repair-category.jpg` - Repair card (services page)

### Section Images (3 files - 800x600px)

12. `electrician-working.jpg` - About page 50/50 section
13. `electrician-portrait.jpg` - Contact page form section
14. `electrical-inspection.jpg` - Pricing page checklist

### Team Photo (1 file - 512x512px)

15. `daniel-fox.jpg` - Team section circular portrait

---

## 🎨 Image Options

### Option 1: AI Generation (Fastest)

The platform has AI image generation tools using Google Gemini.

**Pros:**

- Fast (generate all 14 in ~30 minutes)
- Consistent style
- Cost-effective (~$1-2 for all images)

**Cons:**

- AI-generated (not real photos)
- May look generic
- Requires Google AI API key

**To set up:**

```bash
# Would need Google AI API key in .env.local
GOOGLE_AI_API_KEY=your-key-here

# Then run generation pipeline
pnpm images:manifest
pnpm images:generate --limit 14
pnpm images:upload
```

### Option 2: Professional Photography (Best)

Hire photographer for authentic electrical work photos.

**Pros:**

- Authentic, real work photos
- Builds trust
- SEO-friendly (unique content)
- Perfect for brand building

**Cons:**

- Expensive (£500-1000)
- Takes time (1-2 weeks to schedule/shoot/edit)
- Requires coordination

**Requirements:**

- Action shots of electricians at work
- Daniel Fox professional portrait
- Various electrical installations/panels
- Van/branding shots

### Option 3: Stock Photography (Quick Start)

Purchase from Shutterstock, Adobe Stock, Unsplash, Pexels.

**Pros:**

- Immediate availability
- Professional quality
- Affordable (£5-20 per image)

**Cons:**

- Generic (other sites may use same images)
- May not perfectly match brand
- Licensing restrictions

**Recommended sites:**

- Unsplash Pro (curated, high quality)
- Adobe Stock (extensive library)
- Shutterstock (largest selection)

---

## 🚀 Quick Start Commands

Once R2 folder structure is created and images are uploaded:

### 1. Restart dev server (load new .env.local)

```bash
lsof -ti:3000 | xargs kill -9
cd sites/dj-fox-electrical && npm run dev
```

### 2. Verify R2 connection

- Open http://localhost:3000
- Check browser console
- Should NOT see "R2 URL Not Configured" warning

### 3. Check image loading

- Open DevTools → Network tab
- Filter by "img"
- Images should load from `pub-a159d5c51e44442897e06986a53dda1d.r2.dev`
- Status should be 200 (once images uploaded)

---

## 📝 Next Steps

1. **Create R2 folders** (via Cloudflare dashboard)
   - `djfoxelectrical/hero/`
   - `djfoxelectrical/categories/`
   - `djfoxelectrical/sections/`
   - `djfoxelectrical/team/`

2. **Update image paths in code** (replace `/images/` with `djfoxelectrical/`)
   - Update 5 page files
   - Remove leading slashes
   - Add proper subfolder paths

3. **Source images** (choose one option)
   - AI generation (fastest)
   - Professional photography (best quality)
   - Stock photography (quick start)

4. **Upload to R2**
   - Via Cloudflare dashboard (drag & drop)
   - Or via Wrangler CLI

5. **Test**
   - Restart dev server
   - Verify images load
   - Check all pages

---

## 🔗 Related Documents

- Configuration Guide: `output/sessions/2026-02-15_dj-fox-r2-configuration-guide.md`
- Design Implementation: `output/sessions/2026-02-15_dj-fox-design-implementation-complete.md`
- Platform Images Standard: `docs/standards/images.md`

---

**Current Status:** R2 configured, awaiting folder creation & image paths update
