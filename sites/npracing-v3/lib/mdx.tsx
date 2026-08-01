import { createMdxLoader } from '@platform/core-components/lib/mdx';
import mdxComponents from '@/mdx-components';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { ReactElement } from 'react';
import type { MdxFrontmatter } from '@platform/core-components/lib/mdx';

const loader = createMdxLoader(mdxComponents, {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
});

export const { getMdxFiles, getMdxContent, getAllServices, getAllLocations } = loader;

/**
 * npracing-v3's content types. The shared `createMdxLoader` factory types
 * listSlugs/loadMdx/getPageImage against a closed ContentDir union
 * (services/locations/blog/projects/testimonials/speakers) that predates
 * this site's merch/news/brand content — none of those apply here. The
 * factory's runtime behavior is a plain path join with no validation
 * against that union, so re-typing the exported functions locally (without
 * editing the shared package, which would affect every site) is safe.
 *
 * 'services' | 'locations' | 'blog' | 'projects' are leftover base-template
 * content types still referenced by not-yet-removed routes — a later cleanup
 * phase removes those routes and this union narrows to just the three
 * NPRacing-specific types at that point.
 */
export type ContentType =
  | 'merch'
  | 'news'
  | 'brand'
  | 'services'
  | 'locations'
  | 'blog'
  | 'projects';

export const listSlugs = loader.listSlugs as unknown as (baseDir: ContentType) => Promise<string[]>;

export const loadMdx = loader.loadMdx as unknown as (opts: {
  baseDir: ContentType;
  slug: string;
}) => Promise<{ frontmatter: MdxFrontmatter; content: ReactElement }>;

export const getPageImage = loader.getPageImage as unknown as (
  baseDir: ContentType,
  slug: string
) => Promise<string | null>;

export type { MdxFrontmatter } from '@platform/core-components/lib/mdx';
