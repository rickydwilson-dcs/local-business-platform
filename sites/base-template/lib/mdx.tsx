/**
 * MDX Utilities
 * =============
 *
 * Functions for loading and rendering MDX content with custom components.
 */

import fsSync from 'fs';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Get all MDX files from a directory (sync)
 */
export function getMdxFiles(dir: string): string[] {
  const fullPath = path.join(contentDirectory, dir);

  if (!fsSync.existsSync(fullPath)) {
    return [];
  }

  const files = fsSync.readdirSync(fullPath, { recursive: true });
  return files
    .filter((file): file is string => typeof file === 'string' && file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Get MDX content and frontmatter (sync)
 */
export function getMdxContent(dir: string, slug: string) {
  const filePath = path.join(contentDirectory, dir, `${slug}.mdx`);

  if (!fsSync.existsSync(filePath)) {
    return null;
  }

  const fileContents = fsSync.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data,
    content,
  };
}

/**
 * Get all service slugs
 */
export function getAllServices(): string[] {
  return getMdxFiles('services');
}

/**
 * Get all location slugs
 */
export function getAllLocations(): string[] {
  return getMdxFiles('locations');
}
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { ReactElement } from 'react';
import mdxComponents from '@/mdx-components';

/**
 * Content directory types
 */
type ContentDir = 'services' | 'locations' | 'blog' | 'projects' | 'testimonials';

/**
 * Options for loading MDX content
 */
type LoadOpts = {
  /** Content directory */
  baseDir: ContentDir;
  /** Content slug (filename without extension) */
  slug: string;
};

/**
 * Generic MDX frontmatter type
 */
export type MdxFrontmatter = {
  title?: string;
  description?: string;
  date?: string;
  [key: string]: unknown;
};

/**
 * List all content slugs in a directory
 *
 * @param baseDir - The content directory to list
 * @returns Array of slugs (filenames without extension)
 *
 * @example
 * const blogSlugs = await listSlugs('blog');
 */
export async function listSlugs(baseDir: ContentDir): Promise<string[]> {
  const dir = path.join(process.cwd(), 'content', baseDir);

  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  return files
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx?$/, ''));
}

/**
 * Load MDX content with rendered React elements
 *
 * @param opts - Load options including baseDir and slug
 * @returns Object with frontmatter and rendered content element
 *
 * @example
 * const { frontmatter, content } = await loadMdx({ baseDir: 'blog', slug: 'my-post' });
 * return <article>{content}</article>;
 */
export async function loadMdx({
  baseDir,
  slug,
}: LoadOpts): Promise<{ frontmatter: MdxFrontmatter; content: ReactElement }> {
  const filePath = path.join(process.cwd(), 'content', baseDir, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, 'utf8');
  const { content, data } = matter(raw);

  const el = (
    <MDXRemote
      source={content}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
        },
      }}
    />
  );

  return { frontmatter: (data as MdxFrontmatter) || {}, content: el };
}

/**
 * Get the hero image path from content frontmatter
 *
 * Used for sitemap image generation
 *
 * @param baseDir - The content directory
 * @param slug - The content slug
 * @returns The hero image path or null if not found
 */
export async function getPageImage(baseDir: ContentDir, slug: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), 'content', baseDir, `${slug}.mdx`);
    const raw = await fs.readFile(filePath, 'utf8');
    const { data } = matter(raw);

    // Services store hero images in hero.image
    if (baseDir === 'services') {
      const heroData = data?.hero as { image?: string } | undefined;
      return heroData?.image || null;
    }

    // Other content types use heroImage
    return (data?.heroImage as string) || null;
  } catch {
    return null;
  }
}
