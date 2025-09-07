
# TSX Index Pages + MDX Setup

## Included
- `app/page.tsx` (Home)
- `app/services/page.tsx` (Services index)
- `app/locations/page.tsx` (Locations index)
- `app/contact/page.tsx` (Contact as TSX with a basic form)

## MDX in Next.js (App Router) — Setup
1) Install MDX:
```bash
npm i @next/mdx @mdx-js/react
# or
yarn add @next/mdx @mdx-js/react
```

2) Wrap your Next.js config with the MDX plugin.

**next.config.mjs** (ESM)
```js
import createMDX from '@next/mdx';

const withMDX = createMDX({
  // Optional: provide remark/rehype plugins here
  // remarkPlugins: [],
  // rehypePlugins: [],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Any other config
  pageExtensions: ['ts','tsx','md','mdx'], // allow MD/MDX as pages
};

export default withMDX(nextConfig);
```

3) (Optional) Provide an MDX provider for shortcodes/components.

**app/providers.tsx**
```tsx
'use client';
import * as React from 'react';
import {{ MDXProvider }} from '@mdx-js/react';

const components = {{
  // Map markdown elements to custom components if you like
}};

export default function Providers({{ children }}: {{ children: React.ReactNode }}) {{
  return <MDXProvider components={components}>{'{'}children{'}'}</MDXProvider>;
}}
```

Then include `<Providers>` in your `app/layout.tsx` (client side only if needed).

4) Keep MDX content under `/app/.../*.mdx` or a `/content` folder and render via route files.
   - For content-heavy pages, prefer MDX.
   - For index pages and app logic, prefer TSX.

## Wiring TSX routes to MDX
If you want `/services/[slug]` to render MDX by slug:
- Put MDX files in `content/services/*.mdx` (slug = filename).
- In `app/services/[slug]/page.tsx`, load the MDX via your loader (Contentlayer or a custom FS import).

Contentlayer example (rough sketch):
```ts
// contentlayer.config.ts
import {{ defineDocumentType, makeSource }} from 'contentlayer/source-files';

export const Service = defineDocumentType(() => ({
  name: 'Service',
  filePathPattern: 'services/*.mdx',
  contentType: 'mdx',
  fields: {{
    title: {{ type: 'string', required: true }},
    description: {{ type: 'string', required: false }},
    // etc...
  }},
  computedFields: {{
    slug: {{ type: 'string', resolve: (doc) => doc._raw.flattenedPath.replace('services/','') }},
  }},
}));

export default makeSource({{
  contentDirPath: 'content',
  documentTypes: [Service],
}});
```

```tsx
// app/services/[slug]/page.tsx
import {{ allServices }} from 'contentlayer/generated';
import {{ notFound }} from 'next/navigation';
import {{ Mdx }} from '@/components/mdx'; // your MDX renderer

export async function generateStaticParams() {{
  return allServices.map((s) => ({{ slug: s.slug }}));
}}

export default function ServicePage({{ params }}: {{ params: {{ slug: string }} }}) {{
  const service = allServices.find((s) => s.slug === params.slug);
  if (!service) return notFound();
  return <Mdx code={{service.body.code}} frontmatter={{service}} />;
}}
```

You're set. Drop your MDX into `content/services` and `content/locations`, and use these TSX index pages for navigation.
