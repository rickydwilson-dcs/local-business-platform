# Public Assets Directory

Static files served directly by Next.js.

## Structure

```
public/
├── static/          # Static images (logo, favicon, etc.)
├── images/          # Content images
└── README.md        # This file
```

## Asset Organization

### Static Assets (`/static`)

Place site-wide assets here:

- Logo files (logo.svg, logo.png)
- Favicon files (favicon.ico, apple-touch-icon.png)
- Social media images (og-image.png)
- Site fonts (if not using CDN)

### Content Images (`/images`)

Place content-specific images here:

- Hero images
- Service images
- Location images
- Team photos
- Testimonial images

## Usage

Reference public files from root:

```tsx
// In components
<Image src="/static/logo.png" alt="Logo" width={200} height={50} />;

// In MDX frontmatter
hero: image: '/images/hero-primary-service.jpg';
```

## Image Optimization

For production:

1. Use WebP format for better compression
2. Provide multiple sizes for responsive images
3. Use Next.js Image component for automatic optimization
4. Consider using a CDN (R2, Cloudflare) for large images

## CDN Integration

For production sites, consider moving images to a CDN:

1. Upload images to Cloudflare R2 or similar CDN
2. Update image paths in MDX files
3. Configure `next.config.ts` with CDN domain
4. Keep only essential static files in `/public`
