# Platform Tools

Automation tools for managing the Local Business Platform.

## Available Tools

### 🖼️ Image Management

#### `images-intake.ts`

Process and upload client images to Cloudflare R2.

```bash
pnpm images:intake <site-slug> <source-directory> [options]
```

**What it does:**

- Validates images (format, size, dimensions)
- Optimizes images (resize, compress)
- Generates WebP versions
- Creates responsive sizes (640px, 1280px, 1920px)
- Uploads to R2 with proper naming convention
- Reports file size savings (typically 70-90%)

**Options:**

- `--dry-run` - Test without uploading
- `--skip-webp` - Skip WebP generation
- `--quality <1-100>` - JPEG/WebP quality (default: 85)
- `--interactive` - Prompt for metadata

**Example:**

```bash
# Process Joe's Plumbing images
pnpm images:intake joes-plumbing-canterbury ~/client-images/joe/

# Dry run
pnpm images:intake joes-plumbing-canterbury ~/client-images/joe/ --dry-run

# Higher quality
pnpm images:intake joes-plumbing-canterbury ~/client-images/joe/ --quality 90
```

---

#### `test-r2-connection.ts`

Test Cloudflare R2 connection and credentials.

```bash
pnpm test:r2
```

**What it does:**

- Verifies R2 credentials
- Lists objects in bucket
- Tests upload/delete operations
- Provides troubleshooting guidance

---

### 🚀 Deployment (Week 4)

#### `deploy-site.ts` (Coming Soon)

Deploy a single site to Vercel.

```bash
pnpm deploy:site <site-slug>
```

#### `deploy-batch.ts` (Coming Soon)

Phased deployment of multiple sites.

```bash
pnpm deploy:batch [--canary]
```

---

### 🏗️ Site Management (Week 2+)

#### `create-site.ts` (Coming Soon)

Interactive site generator.

```bash
pnpm create:site
```

---

### 🤖 Content Generation (Week 5)

#### `generate-services.ts` (Coming Soon)

Generate service pages with AI.

```bash
pnpm generate:content <site-slug> --type services
```

#### `generate-locations.ts` (Coming Soon)

Generate location pages with AI.

```bash
pnpm generate:content <site-slug> --type locations
```

---

## Utility Libraries

### `lib/r2-client.ts`

Cloudflare R2 client wrapper (S3-compatible).

**Features:**

- Upload files or buffers
- Check file existence
- Delete files
- List files with prefix
- Generate public URLs
- Automatic content type detection

**Usage:**

```typescript
import { getR2Client } from "./lib/r2-client";

const client = getR2Client();

// Upload file
const result = await client.uploadFile("/path/to/image.jpg", "site-slug/hero/service/page_01.jpg", {
  contentType: "image/jpeg",
});

// Check if file exists
const exists = await client.fileExists("site-slug/hero/service/page_01.jpg");

// Get public URL
const url = client.getPublicUrl("site-slug/hero/service/page_01.jpg");
```

---

### `lib/image-processor.ts`

Image optimization with Sharp.

**Features:**

- Validate images
- Optimize and compress
- Generate WebP/AVIF versions
- Create responsive sizes
- Maintain aspect ratios
- Report compression savings

**Usage:**

```typescript
import { getImageProcessor } from "./lib/image-processor";

const processor = getImageProcessor();

// Process image
const result = await processor.processImage("/path/to/image.jpg", {
  generateWebP: true,
  quality: 85,
  maxWidth: 1920,
  responsive: true,
  responsiveSizes: [640, 1280, 1920],
});

// Validate image
const validation = await processor.validateImage("/path/to/image.jpg");
if (!validation.valid) {
  console.error(validation.error);
}
```

---

## Development

### Running Tools Locally

All tools use `tsx` for TypeScript execution:

```bash
# Run any tool directly
tsx tools/images-intake.ts --help

# Or use package.json scripts
pnpm images:intake --help
```

### Environment Variables

Tools load environment variables from `.env.local`:

```bash
# Required for R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=local-business-platform
NEXT_PUBLIC_R2_PUBLIC_URL=...

# Required for deployment (Week 4)
VERCEL_TOKEN=...
VERCEL_ORG_ID=...

# Required for AI content (Week 5)
ANTHROPIC_API_KEY=...
```

### Adding New Tools

1. Create tool in `tools/`:

   ```typescript
   #!/usr/bin/env tsx
   // Your tool code here

   async function main() {
     // Tool logic
   }

   if (require.main === module) {
     main().catch((error) => {
       console.error(error);
       process.exit(1);
     });
   }
   ```

2. Add script to `package.json`:

   ```json
   {
     "scripts": {
       "your-tool": "tsx tools/your-tool.ts"
     }
   }
   ```

3. Test locally:

   ```bash
   pnpm your-tool
   ```

4. Document in this README

---

## Tool Guidelines

When building tools:

1. **Use TypeScript** - All tools should be `.ts` files
2. **Accept CLI args** - Use `process.argv` or a library like `commander`
3. **Validate inputs** - Check required parameters and environment variables
4. **Provide feedback** - Log progress, warnings, and errors clearly
5. **Handle errors** - Catch and report errors gracefully
6. **Support dry-run** - Allow testing without side effects
7. **Be idempotent** - Safe to run multiple times
8. **Document usage** - Include `--help` flag and examples

---

## Testing Tools

### Manual Testing

```bash
# Test with dry-run flag
pnpm images:intake test-site ~/test-images/ --dry-run

# Test with verbose output
DEBUG=* pnpm images:intake test-site ~/test-images/
```

### Unit Tests (Future)

```bash
# Run tool tests
pnpm test:tools
```

---

## Troubleshooting

### Tool fails to load environment variables

Ensure `.env.local` exists and has correct values:

```bash
cat .env.local
```

### TypeScript errors

Check TypeScript version and dependencies:

```bash
pnpm type-check
```

### R2 connection issues

Test R2 connection:

```bash
pnpm test:r2
```

See [R2_SETUP.md](../docs/R2_SETUP.md) for detailed R2 troubleshooting.

---

## Roadmap

### ✅ Week 3 (Current)

- [x] Image intake tool
- [x] R2 client wrapper
- [x] Image processor
- [x] R2 connection test

### Week 4

- [ ] Deployment scripts
- [ ] Smoke test runner
- [ ] Rollback utility

### Week 5

- [ ] AI content generators
- [ ] Service page generator
- [ ] Location page generator

### Week 6

- [ ] Blog post generator
- [ ] Project generator

### Week 7

- [ ] Site registry management
- [ ] Monitoring dashboard CLI

---

**Last Updated:** 2025-10-18
**Tools Count:** 2 (+ 2 utility libraries)
