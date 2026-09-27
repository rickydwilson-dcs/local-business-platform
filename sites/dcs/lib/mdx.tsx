/**
 * NOTE (2026-09-27): only `listSlugs` and `getPageImage` are still used, by
 * the four per-section `sitemap.ts` files under `app/(site)`. `loadMdx` and
 * `getMdxContent` are NO LONGER USED TO RENDER ANY ROUTE, and should not be
 * reintroduced for that.
 *
 * This factory is bound to `mdx-components.tsx`'s Tailwind/solaris component
 * map, which styles `h2`/`p`/`ul`/`li`/`a` with its own utilities while
 * `inner-pages.css` §31 styles the same bare tags — so the two stack rather
 * than one winning. Combined with the `rehype-autolink-headings`
 * `behavior:"wrap"` below, it rendered every `<h2>` as a magenta underlined
 * link carrying `target="_blank"` on a same-page fragment, and every `<li>`
 * with three bullets at once (the kit's square, the map's dot `<div>`, and a
 * `bg-surface-subtle` pill). Each of the four MDX-rendering routes now has
 * its own bare-tag renderer instead:
 *
 *   /blog/[slug]       components/blog/blog-prose.tsx
 *   /projects/[slug]   components/projects/project-prose.tsx
 *   /services/[slug]   components/services/service-prose.tsx
 *   /locations/[slug]  components/locations/location-prose.tsx
 *
 * The plugin config below is left intact because `listSlugs`/`getPageImage`
 * come from the same factory call and do not touch it.
 */
import { createMdxLoader } from '@platform/core-components/lib/mdx';
import mdxComponents from '@/mdx-components';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export const {
  getMdxFiles,
  getMdxContent,
  getAllServices,
  getAllLocations,
  listSlugs,
  loadMdx,
  getPageImage,
} = createMdxLoader(mdxComponents, {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
});

export type { MdxFrontmatter } from '@platform/core-components/lib/mdx';
