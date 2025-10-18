# Cloudflare R2 Setup Guide

Complete guide for setting up Cloudflare R2 image storage for the Local Business Platform.

## Why R2 for Images?

**Problem:** Git doesn't scale with binary files

- Repository would balloon to GB+ sizes with 50 sites
- Slow clones and pulls
- No CDN or optimization

**Solution:** Cloudflare R2

- ✅ Global CDN with edge caching
- ✅ S3-compatible API
- ✅ ~£10/month for 50GB+ (vs £100+ on S3)
- ✅ Automatic image optimization available
- ✅ No egress fees (unlike AWS S3)

---

## Step 1: Create Cloudflare Account & R2 Bucket

### 1.1 Create Account

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sign up or log in
3. Navigate to **R2 Object Storage** in the sidebar

### 1.2 Create Bucket

1. Click **"Create Bucket"**
2. Name: `local-business-platform`
3. Location: **Automatic** (Cloudflare distributes globally)
4. Click **"Create Bucket"**

✅ You now have a bucket ready for image storage!

---

## Step 2: Generate R2 API Tokens

### 2.1 Create API Token

1. In R2 dashboard, click **"Manage R2 API Tokens"**
2. Click **"Create API Token"**
3. Settings:
   - **Name:** `local-business-platform-api`
   - **Permissions:** ✅ Edit (read + write)
   - **TTL:** Never expires (or set expiry as needed)
   - **Bucket restrictions:** Choose `local-business-platform` bucket
4. Click **"Create API Token"**

### 2.2 Save Credentials

⚠️ **IMPORTANT:** Save these immediately! They won't be shown again.

You'll receive:

- **Access Key ID:** `abc123...`
- **Secret Access Key:** `xyz789...`
- **Jurisdiction-specific endpoint:** (shown at bottom)

Also note your **Account ID** from the R2 overview page.

---

## Step 3: Configure Environment Variables

### 3.1 Copy Example File

```bash
cp .env.example .env.local
```

### 3.2 Add R2 Credentials

Edit `.env.local` and add:

```bash
# ===== CLOUDFLARE R2 (IMAGE STORAGE) =====
R2_ACCOUNT_ID=your-cloudflare-account-id-here
R2_ACCESS_KEY_ID=your-access-key-id-here
R2_SECRET_ACCESS_KEY=your-secret-access-key-here
R2_BUCKET_NAME=local-business-platform

# R2 Public URL (optional - see Step 4)
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-YOUR_ACCOUNT_ID.r2.dev
```

⚠️ **Never commit `.env.local`** - it's already in `.gitignore`

---

## Step 4: Configure Public Access (Optional)

To serve images publicly, you have two options:

### Option A: Enable R2.dev Subdomain (Simple)

1. In bucket settings, enable **"R2.dev subdomain"**
2. Your images will be available at:
   ```
   https://pub-YOUR_ACCOUNT_ID.r2.dev/path/to/image.jpg
   ```
3. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-YOUR_ACCOUNT_ID.r2.dev
   ```

**Pros:** Quick and easy
**Cons:** Not brandable, limited customization

### Option B: Custom Domain (Recommended for Production)

1. In R2 bucket settings, click **"Custom Domains"**
2. Add domain: `images.yourdomain.com`
3. Add DNS record in Cloudflare DNS (automatic if domain on Cloudflare)
4. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_R2_PUBLIC_URL=https://images.yourdomain.com
   ```

**Pros:** Professional, brandable, cacheable
**Cons:** Requires domain setup

---

## Step 5: Test R2 Connection

### 5.1 Run Connection Test

```bash
pnpm test:r2
```

This will:

1. ✓ Initialize R2 client
2. ✓ List objects in bucket
3. ✓ Upload test file
4. ✓ Delete test file
5. ✓ Verify all operations successful

### 5.2 Expected Output

```
🧪 Testing R2 Connection

✓ R2 Client initialized
  Bucket: local-business-platform

📋 Listing objects in bucket...
✓ Connection successful!
  Found 0 object(s) in bucket

📤 Testing upload...
✓ Upload successful!
  Key: test/r2-connection-test.txt
  URL: https://pub-abc123.r2.dev/test/r2-connection-test.txt
  Size: 23 bytes

🧹 Cleaning up test file...
✓ Test file deleted

✅ All tests passed! R2 is configured correctly.
```

### 5.3 Troubleshooting

**❌ Missing R2_ACCOUNT_ID**

- Add `R2_ACCOUNT_ID` to `.env.local`
- Find it in Cloudflare Dashboard → R2 (top right)

**❌ AccessDenied / Forbidden**

- Check API token has "Edit" permissions
- Verify token is for correct bucket
- Regenerate token if needed

**❌ NoSuchBucket**

- Verify bucket name is `local-business-platform`
- Check bucket exists in R2 dashboard

---

## Step 6: Upload Images

### 6.1 Image Intake Tool

The platform includes an automated image intake tool:

```bash
pnpm images:intake <site-slug> <source-directory> [options]
```

### 6.2 Example Usage

```bash
# Process Joe's Plumbing images
pnpm images:intake joes-plumbing-canterbury ~/client-images/joe/

# Dry run (test without uploading)
pnpm images:intake joes-plumbing-canterbury ~/client-images/joe/ --dry-run

# Custom quality (1-100, default: 85)
pnpm images:intake joes-plumbing-canterbury ~/client-images/joe/ --quality 90
```

### 6.3 What It Does

The tool automatically:

1. ✅ Validates images (format, size, dimensions)
2. ✅ Optimizes images (resize, compress)
3. ✅ Generates WebP versions (better compression)
4. ✅ Generates responsive sizes (640px, 1280px, 1920px)
5. ✅ Renames to standard convention
6. ✅ Uploads to R2 with metadata
7. ✅ Reports savings (typically 70-90% reduction!)

### 6.4 Image Naming Convention

Images are organized in R2 like this:

```
{site-slug}/{component}/{page-type}/{page-slug}_{variant}{size}.{ext}

Examples:
joes-plumbing-canterbury/hero/service/emergency-plumbing_01.jpg
joes-plumbing-canterbury/hero/service/emergency-plumbing_01.webp
joes-plumbing-canterbury/hero/service/emergency-plumbing_01-640w.webp
joes-plumbing-canterbury/gallery/project/bathroom-renovation_01.jpg
```

**Benefits:**

- Clear organization by site → component → page
- Easy to find and manage images
- Automatic responsive size suffixes
- WebP versions for modern browsers

---

## Step 7: Use Images in Sites

### 7.1 In Next.js Components

```tsx
import Image from "next/image";

export function Hero() {
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  const siteslug = "joes-plumbing-canterbury";

  return (
    <Image
      src={`${baseUrl}/${siteslug}/hero/service/emergency-plumbing_01.webp`}
      alt="Emergency Plumbing Service"
      width={1920}
      height={1080}
      priority
    />
  );
}
```

### 7.2 Responsive Images with srcSet

```tsx
<Image
  src={`${baseUrl}/${siteslug}/hero/service/emergency-plumbing_01.webp`}
  srcSet={`
    ${baseUrl}/${siteslug}/hero/service/emergency-plumbing_01-640w.webp 640w,
    ${baseUrl}/${siteslug}/hero/service/emergency-plumbing_01-1280w.webp 1280w,
    ${baseUrl}/${siteslug}/hero/service/emergency-plumbing_01.webp 1920w
  `}
  sizes="(max-width: 640px) 640px, (max-width: 1280px) 1280px, 1920px"
  alt="Emergency Plumbing"
  width={1920}
  height={1080}
/>
```

### 7.3 In MDX Content

```mdx
---
title: Emergency Plumbing
hero: hero/service/emergency-plumbing_01.webp
---

![Plumbing work](gallery/project/bathroom-renovation_01.webp)
```

---

## Step 8: Set Up Vercel Environment Variables

For deployed sites to access R2:

### 8.1 Add to Vercel Dashboard

1. Go to Vercel Dashboard → Project Settings
2. Navigate to **Environment Variables**
3. Add (for all environments):
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME`
   - `NEXT_PUBLIC_R2_PUBLIC_URL`

4. Redeploy affected sites

⚠️ **Security:** Server-side variables (without `NEXT_PUBLIC_`) are never exposed to the browser

---

## Pricing & Cost Estimates

### R2 Pricing (Pay-as-you-go)

- **Storage:** £0.012/GB/month
- **Class A Operations** (writes): £3.60 per million
- **Class B Operations** (reads): £0.29 per million
- **Egress:** **FREE** (this is the big savings vs S3!)

### Cost Estimate for 50 Sites

**Storage:**

- 50 sites × 100 images × 2MB average = **10GB**
- With WebP + responsive sizes: ~**25GB** total
- Cost: 25GB × £0.012 = **£0.30/month**

**Operations:**

- Initial uploads: 50 sites × 500 images = 25,000 writes = **£0.09**
- Monthly reads: 50 sites × 10k views × 5 images = 2.5M reads = **£0.73/month**

**Total: ~£1-2/month** initially, growing to **~£10/month** at scale

Compare to AWS S3:

- Same storage + reads + egress fees = **£50-100/month** 💰

---

## Image Optimization Best Practices

### 1. Source Image Quality

**Do:**

- ✅ Provide high-quality originals (1920px+ width)
- ✅ Use sRGB color space
- ✅ Save as JPEG (photos) or PNG (graphics/logos)

**Don't:**

- ❌ Pre-compress or resize (tool does this)
- ❌ Use proprietary formats (HEIC, etc.)
- ❌ Include images smaller than 640px

### 2. Recommended Settings

```bash
# Default (recommended for most)
pnpm images:intake site-slug ~/images/

# Higher quality for professional photos
pnpm images:intake site-slug ~/images/ --quality 90

# Skip WebP if compatibility issues
pnpm images:intake site-slug ~/images/ --skip-webp
```

### 3. File Size Targets

After processing:

- **Hero images:** 100-300KB (WebP), 200-500KB (JPEG)
- **Gallery images:** 50-150KB (WebP), 100-250KB (JPEG)
- **Thumbnails:** 10-30KB (WebP), 20-50KB (JPEG)

The tool typically achieves **70-90% size reduction** while maintaining visual quality.

---

## Maintenance & Monitoring

### View Bucket Contents

```bash
# List all files in bucket
pnpm test:r2
```

### Delete Site Images

```bash
# TODO: Create cleanup tool
pnpm images:delete site-slug
```

### Bucket Analytics

View in Cloudflare Dashboard:

- Total storage used
- Number of objects
- Request count (reads/writes)
- Bandwidth usage

---

## FAQ

### Q: Can I use a different bucket name?

Yes! Update `R2_BUCKET_NAME` in `.env.local` and `.env.example`

### Q: Should I commit images to Git for development?

No. Use R2 URLs everywhere. For local development, the R2.dev subdomain works fine.

### Q: What if I want to migrate to a different CDN later?

The naming convention and directory structure are provider-agnostic. You can rsync/copy the entire bucket to another service with minimal code changes.

### Q: Can I manually upload images to R2?

Yes, but use the intake tool for consistency. Manual uploads should follow the naming convention.

### Q: Do I need separate buckets for dev/staging/production?

Optional. You can use:

- One bucket with prefixes: `prod/`, `staging/`, `dev/`
- Or separate buckets: `platform-prod`, `platform-staging`

Current setup uses one bucket for simplicity.

---

## Troubleshooting

### Images not loading on site

1. Check `NEXT_PUBLIC_R2_PUBLIC_URL` is set in Vercel
2. Verify public access enabled (R2.dev subdomain or custom domain)
3. Check browser console for 404s or CORS errors
4. Test URL directly in browser

### Uploads failing

1. Verify credentials in `.env.local`
2. Check API token permissions (needs "Edit")
3. Ensure bucket name matches (`local-business-platform`)
4. Check bucket quota (unlikely with R2's high limits)

### High costs

1. Check bucket analytics for usage spikes
2. Verify caching is enabled (default: 1 year)
3. Review CDN settings for cache hits
4. Consider custom domain for better caching

---

## Next Steps

✅ **R2 Setup Complete!** You can now:

1. Upload images: `pnpm images:intake <site> <directory>`
2. Use images in components via `NEXT_PUBLIC_R2_PUBLIC_URL`
3. Deploy sites with image URLs
4. Monitor usage in Cloudflare Dashboard

**Recommended Reading:**

- [Week 3 Roadmap](../TODO.md#week-3-image-storage)
- [Image Management Strategy](../assets/README.md)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

**Last Updated:** 2025-10-18
**Status:** ✅ R2 Infrastructure Complete
