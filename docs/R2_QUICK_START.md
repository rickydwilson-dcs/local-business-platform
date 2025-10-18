# R2 Quick Start Guide

Ultra-quick setup guide for Cloudflare R2. See [R2_SETUP.md](./R2_SETUP.md) for detailed instructions.

## 1. Get R2 Credentials (5 min)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **R2**
2. Create bucket: `local-business-platform`
3. Click **"Manage R2 API Tokens"** → **"Create API Token"**
4. Set permissions to **"Edit"**, select bucket
5. Save these credentials:
   - Account ID (from R2 overview)
   - Access Key ID
   - Secret Access Key

## 2. Configure Environment (2 min)

Create/edit `.env.local`:

```bash
R2_ACCOUNT_ID=your-account-id-here
R2_ACCESS_KEY_ID=your-access-key-id-here
R2_SECRET_ACCESS_KEY=your-secret-access-key-here
R2_BUCKET_NAME=local-business-platform
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-YOUR_ACCOUNT_ID.r2.dev
```

## 3. Enable Public Access (1 min)

In R2 bucket settings:

- Enable **"R2.dev subdomain"**
- Or set up **custom domain** for production

## 4. Test Connection (1 min)

```bash
pnpm test:r2
```

Expected: ✅ All tests passed!

## 5. Upload Images (Ongoing)

```bash
pnpm images:intake joes-plumbing-canterbury ~/client-images/joe/
```

**Done! 🎉**

---

## Common Commands

```bash
# Test R2 connection
pnpm test:r2

# Upload images
pnpm images:intake <site-slug> <source-dir>

# Dry run (test without uploading)
pnpm images:intake <site-slug> <source-dir> --dry-run

# Custom quality
pnpm images:intake <site-slug> <source-dir> --quality 90
```

---

## Troubleshooting

**Connection fails:**

- Check credentials in `.env.local`
- Verify API token has "Edit" permissions
- Confirm bucket name is `local-business-platform`

**Images don't load:**

- Enable R2.dev subdomain in bucket settings
- Set `NEXT_PUBLIC_R2_PUBLIC_URL` in Vercel
- Check CORS settings if custom domain

---

**Need help?** See [R2_SETUP.md](./R2_SETUP.md) for detailed guide.
