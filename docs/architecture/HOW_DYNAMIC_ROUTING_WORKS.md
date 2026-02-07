# How Dynamic Routing Works

This document explains how MDX content files become web pages. This is the core mechanism that makes the MDX-only architecture work.

## The Big Picture

When you drop an MDX file into `content/services/`, it automatically becomes a page at `/services/[filename]`. No code changes needed. This works because Next.js dynamic routes (`[slug]`) scan the content directory at build time and generate a static page for every MDX file found.

## The Flow

```
content/services/emergency-repair.mdx
        ↓
app/services/[slug]/page.tsx calls generateStaticParams()
        ↓
generateStaticParams() reads all filenames from content/services/
        ↓
Returns [{ slug: 'emergency-repair' }, { slug: 'kitchen-remodel' }, ...]
        ↓
Next.js renders each page at build time (static generation)
        ↓
/services/emergency-repair → fully rendered HTML
```

This all happens at **build time**. At runtime, the server just returns pre-built HTML. No MDX files are read when a user visits the page.

## How Each Piece Works

### 1. The Dynamic Route File

Every content type has a route handler at `app/[type]/[slug]/page.tsx`. They all follow the same pattern:

```typescript
// app/services/[slug]/page.tsx

export const dynamic = 'force-static';    // Always static generation
export const dynamicParams = false;        // 404 for unknown slugs (no on-demand rendering)

// Step 1: Tell Next.js which pages to generate
export async function generateStaticParams() {
  const services = await getServices();           // Read all MDX files
  return services.map(({ slug }) => ({ slug }));  // Return array of slugs
}

// Step 2: Generate SEO metadata for each page
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const result = await getService(slug);          // Read this specific MDX file
  const fm = result.frontmatter;
  return {
    title: fm.seoTitle || `${fm.title} | ${siteConfig.business.name}`,
    description: fm.description,
    // ... OpenGraph, Twitter cards, canonical URL
  };
}

// Step 3: Render the page
export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const result = await getService(slug);          // Read MDX file
  const { content: mdxContent } = await loadMdx({ baseDir: 'services', slug }); // Render MDX to JSX

  return (
    <>
      <ServiceHero {...fm} />
      <section>{mdxContent}</section>           {/* Rendered MDX body */}
      <FAQSection items={fm.faqs} />
      <CTASection />
      <Schema org={...} />                      {/* JSON-LD structured data */}
    </>
  );
}
```

### 2. The Content Reading Layer

`lib/content.ts` provides functions that read MDX files from disk and parse their frontmatter:

```typescript
// lib/content.ts — generic content reader for all types

export async function getContentItems(contentType: ContentType): Promise<ContentItem[]> {
  const dir = path.join(process.cwd(), "content", contentType);
  const files = await fs.readdir(dir);

  const items = [];
  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;

    const slug = file.replace(/\.mdx$/i, "");
    const raw = await fs.readFile(path.join(dir, file), "utf8");
    const { data } = matter(raw); // gray-matter parses YAML frontmatter

    items.push({ slug, title: data.title, ...data });
  }
  return items.sort((a, b) => a.title.localeCompare(b.title));
}

// Convenience wrappers per content type
export const getServices = () => getContentItems("services");
export const getLocations = () => getContentItems("locations");
```

**Key detail:** `gray-matter` splits the MDX file into frontmatter (the YAML between `---` markers) and content (the markdown body). Frontmatter becomes a JavaScript object; content stays as a string until MDX renders it.

### 3. MDX Rendering

`lib/mdx.tsx` handles turning the markdown body into React components:

```typescript
// lib/mdx.tsx

import { MDXRemote } from 'next-mdx-remote/rsc';

export async function loadMdx({ baseDir, slug }) {
  const raw = await fs.readFile(filePath, 'utf8');
  const { content, data } = matter(raw);

  // MDXRemote compiles markdown to React elements on the server
  const el = (
    <MDXRemote
      source={content}
      components={mdxComponents}           // Custom component overrides (see below)
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],      // GitHub Flavored Markdown (tables, strikethrough)
          rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings], // Heading anchors
        },
      }}
    />
  );

  return { frontmatter: data, content: el };
}
```

### 4. Custom MDX Components

`mdx-components.tsx` defines how standard HTML elements render inside MDX content, plus custom components authors can use:

```typescript
// mdx-components.tsx

const mdxComponents = {
  // Standard elements get themed styling
  a: (props) => <Link href={props.href} className="text-brand-primary hover:text-brand-primary-hover" />,
  h2: (p) => <h2 className="text-2xl font-bold text-surface-foreground mt-12 mb-6">{p.children}</h2>,
  p: (p) => <p className="text-surface-muted-foreground leading-relaxed my-4">{p.children}</p>,
  img: (p) => <Image src={p.src} alt={p.alt} width={1200} height={800} className="rounded-xl" />,

  // Custom components available in MDX files
  InfoBox,           // <InfoBox type="warning">...</InfoBox>
  QuoteBlock,        // <QuoteBlock author="John">...</QuoteBlock>
  ImageWithCaption,  // <ImageWithCaption src="..." caption="..." />
};
```

### 5. Content Validation

MDX frontmatter is validated against Zod schemas (`lib/content-schemas.ts`):

```typescript
export const ServiceFrontmatterSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(50).max(200),
  keywords: z.array(z.string()).min(3).max(10),
  faqs: z.array(FaqSchema).min(3).max(15), // 3-15 FAQs required
  hero: z.object({ heading: z.string(), image: ImagePathSchema }),
  // ...
});
```

Run `npm run validate:content` to check all MDX files against their schemas.

## Content Types

The platform supports five content types, all using this same dynamic routing pattern:

| Content Type | Directory               | Route                       | Schema                         |
| ------------ | ----------------------- | --------------------------- | ------------------------------ |
| Services     | `content/services/`     | `/services/[slug]`          | `ServiceFrontmatterSchema`     |
| Locations    | `content/locations/`    | `/locations/[slug]`         | `LocationFrontmatterSchema`    |
| Blog         | `content/blog/`         | `/blog/[slug]`              | `BlogFrontmatterSchema`        |
| Projects     | `content/projects/`     | `/projects/[slug]`          | `ProjectFrontmatterSchema`     |
| Testimonials | `content/testimonials/` | `/reviews` (aggregate page) | `TestimonialFrontmatterSchema` |

## Adding New Content

1. Create an MDX file in the appropriate `content/` subdirectory
2. Add YAML frontmatter matching the content type's schema
3. Write markdown body content below the frontmatter
4. Run `npm run validate:content` to check for errors
5. Run `npm run build` — the new page appears automatically

No code changes. No new route files. No configuration updates.

## Why This Architecture

- **Content editors don't touch code** — they create/edit MDX files
- **No per-page boilerplate** — one `[slug]/page.tsx` handles all pages of that type
- **Validation catches errors early** — Zod schemas enforce frontmatter structure
- **SEO is automatic** — `generateMetadata()` creates meta tags from frontmatter
- **Static generation = fast** — pages are pre-built HTML, not server-rendered on each request
