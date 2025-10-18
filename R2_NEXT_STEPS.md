# R2 Setup - Next Steps

The R2 infrastructure code is complete! Here's what you need to do next to get it working.

## 🎯 You Need To Do This

### 1. Get Your R2 Credentials (5 minutes)

You mentioned you have a bucket called `local-business-platform` - great! Now you need the API credentials:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2 Object Storage**
3. Click **"Manage R2 API Tokens"**
4. Click **"Create API Token"**
5. Settings:
   - Name: `local-business-platform-api`
   - Permissions: **Edit** (read + write)
   - Apply to specific buckets: `local-business-platform`
6. Click **"Create API Token"**
7. **SAVE THESE IMMEDIATELY** (they won't be shown again):
   - Access Key ID
   - Secret Access Key

Also note your **Account ID** - it's shown in the R2 overview page (top right area).

---

### 2. Add Credentials to .env.local (2 minutes)

Create or edit `.env.local` in the project root:

```bash
# Copy from example
cp .env.example .env.local

# Then edit .env.local and add:
R2_ACCOUNT_ID=your-account-id-here
R2_ACCESS_KEY_ID=your-access-key-id-here
R2_SECRET_ACCESS_KEY=your-secret-access-key-here
R2_BUCKET_NAME=local-business-platform
```

---

### 3. Enable Public Access (1 minute)

For images to be publicly accessible:

1. In Cloudflare Dashboard → R2 → `local-business-platform` bucket
2. Go to **Settings** tab
3. Under **Public Access**, enable **"Allow Access"** or **"R2.dev subdomain"**
4. You'll get a URL like: `https://pub-abc123xyz.r2.dev`
5. Add this to `.env.local`:
   ```bash
   NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-YOUR_ACTUAL_ID.r2.dev
   ```

---

### 4. Test the Connection (1 minute)

Run the test script:

```bash
pnpm test:r2
```

**Expected output:**

```
✅ All tests passed! R2 is configured correctly.
```

If it fails, the script will tell you exactly what's wrong and how to fix it.

---

### 5. Upload Your First Images (Optional)

Once the test passes, you can try uploading images:

```bash
# Dry run first (safe, won't actually upload)
pnpm images:intake joes-plumbing-canterbury ~/path/to/images/ --dry-run

# Then for real
pnpm images:intake joes-plumbing-canterbury ~/path/to/images/
```

---

## 🎉 What's Been Built For You

✅ **R2 Client** ([tools/lib/r2-client.ts](tools/lib/r2-client.ts))

- Upload files/buffers to R2
- Check file existence
- Delete files
- List files
- Generate public URLs
- Full TypeScript types

✅ **Image Processor** ([tools/lib/image-processor.ts](tools/lib/image-processor.ts))

- Validate images
- Optimize & compress (typically 70-90% reduction!)
- Generate WebP versions
- Create responsive sizes (640px, 1280px, 1920px)
- Maintains aspect ratios

✅ **Image Intake Tool** ([tools/images-intake.ts](tools/images-intake.ts))

- Process entire directories
- Automatic naming convention
- Progress reporting
- Dry-run mode for safety
- Batch processing

✅ **Connection Test** ([tools/test-r2-connection.ts](tools/test-r2-connection.ts))

- Verifies credentials
- Tests upload/delete
- Helpful error messages

✅ **Documentation**

- [R2_SETUP.md](docs/R2_SETUP.md) - Complete guide (30+ pages)
- [R2_QUICK_START.md](docs/R2_QUICK_START.md) - Quick reference
- [tools/README.md](tools/README.md) - Tool documentation

---

## 📚 What You Can Do After Setup

### Upload Images

```bash
pnpm images:intake <site-slug> <source-directory>
```

### Use Images in Components

```tsx
const imageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/joes-plumbing-canterbury/hero/service/emergency-plumbing_01.webp`;

<Image src={imageUrl} alt="..." width={1920} height={1080} />;
```

### Add to Vercel

Set these environment variables in Vercel Dashboard for each site:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `NEXT_PUBLIC_R2_PUBLIC_URL`

---

## 🐛 If Something Goes Wrong

### Test fails with "Missing R2_ACCOUNT_ID"

- Add credentials to `.env.local` (see Step 2)

### Test fails with "AccessDenied"

- Check API token has "Edit" permissions
- Verify token is for correct bucket

### Test fails with "NoSuchBucket"

- Confirm bucket name is `local-business-platform`
- Check bucket exists in Cloudflare dashboard

### Images don't load on website

- Enable public access (Step 3)
- Verify `NEXT_PUBLIC_R2_PUBLIC_URL` is set
- Check URL in browser directly

---

## 💰 Cost Estimate

With your setup (50 sites):

- **Storage:** 25GB = £0.30/month
- **Reads:** 2.5M/month = £0.73/month
- **Writes:** One-time uploads = £0.09
- **Egress:** FREE (this is huge!)

**Total: ~£1-2/month** initially, scaling to **~£10/month** with heavy traffic.

Compare to AWS S3: Would be **£50-100/month** 💸

---

## 📖 Need More Help?

- **Quick Start:** [docs/R2_QUICK_START.md](docs/R2_QUICK_START.md)
- **Full Guide:** [docs/R2_SETUP.md](docs/R2_SETUP.md)
- **Tool Docs:** [tools/README.md](tools/README.md)

---

## ✅ Checklist

- [ ] Get R2 Account ID from Cloudflare
- [ ] Create R2 API token with Edit permissions
- [ ] Add credentials to `.env.local`
- [ ] Enable public access / R2.dev subdomain
- [ ] Add public URL to `.env.local`
- [ ] Run `pnpm test:r2` and verify it passes
- [ ] (Optional) Test image upload with `--dry-run`
- [ ] (Optional) Upload real images
- [ ] Add credentials to Vercel (when deploying)

---

**You're ready to go! Just need those credentials from Cloudflare.** 🚀

Let me know once you've got the credentials and run the test - I can help debug if anything doesn't work!
