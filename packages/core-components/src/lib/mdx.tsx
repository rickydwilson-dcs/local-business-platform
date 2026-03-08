// /lib/mdx.tsx — factory for MDX loading utilities
// Excluded from core-components standalone type-check (tsconfig.build.json).
//
// remark-gfm, rehype-slug, rehype-autolink-headings are NOT in core-components deps.
// Accept them via options so sites import them from their own node_modules.
// MDXComponents type is similarly not resolvable from this file's path — use ElementType alias.
import fsSync from 'fs';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ReactElement, ElementType } from 'react';

// Permissive type for the components map — MDXComponents from mdx/types includes nested
// objects for component namespacing, so we accept Record<string, unknown> and cast at use.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MDXComponentsMap = Record<string, any>;

type ContentDir = 'services' | 'locations' | 'blog' | 'projects' | 'testimonials';

type LoadOpts = {
  baseDir: ContentDir;
  slug: string;
};

export type MdxFrontmatter = {
  title?: string;
  description?: string;
  date?: string;
  [key: string]: unknown;
};

interface MdxLoaderOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remarkPlugins?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rehypePlugins?: any[];
}

export function createMdxLoader(
  components: MDXComponentsMap,
  options: MdxLoaderOptions = {}
) {
  const contentDirectory = path.join(process.cwd(), 'content');

  function getMdxFiles(dir: string): string[] {
    const fullPath = path.join(contentDirectory, dir);
    if (!fsSync.existsSync(fullPath)) {
      return [];
    }
    const files = fsSync.readdirSync(fullPath, { recursive: true });
    return files
      .filter((file): file is string => typeof file === 'string' && file.endsWith('.mdx'))
      .map((file) => file.replace(/\.mdx$/, ''));
  }

  function getMdxContent(dir: string, slug: string) {
    const filePath = path.join(contentDirectory, dir, `${slug}.mdx`);
    if (!fsSync.existsSync(filePath)) {
      return null;
    }
    const fileContents = fsSync.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    return { frontmatter: data, content };
  }

  function getAllServices(): string[] {
    return getMdxFiles('services');
  }

  function getAllLocations(): string[] {
    return getMdxFiles('locations');
  }

  async function listSlugs(baseDir: ContentDir): Promise<string[]> {
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

  async function loadMdx({
    baseDir,
    slug,
  }: LoadOpts): Promise<{ frontmatter: MdxFrontmatter; content: ReactElement }> {
    const filePath = path.join(process.cwd(), 'content', baseDir, `${slug}.mdx`);
    const raw = await fs.readFile(filePath, 'utf8');
    const { content, data } = matter(raw);

    const el = (
      <MDXRemote
        source={content}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        components={components as any}
        options={{
          mdxOptions: {
            remarkPlugins: options.remarkPlugins ?? [],
            rehypePlugins: options.rehypePlugins ?? [],
          },
        }}
      />
    );

    return { frontmatter: (data as MdxFrontmatter) || {}, content: el };
  }

  async function getPageImage(baseDir: ContentDir, slug: string): Promise<string | null> {
    try {
      const filePath = path.join(process.cwd(), 'content', baseDir, `${slug}.mdx`);
      const raw = await fs.readFile(filePath, 'utf8');
      const { data } = matter(raw);

      if (baseDir === 'services') {
        const heroData = data?.hero as { image?: string } | undefined;
        return heroData?.image || null;
      }
      return (data?.heroImage as string) || null;
    } catch {
      return null;
    }
  }

  return { getMdxFiles, getMdxContent, getAllServices, getAllLocations, listSlugs, loadMdx, getPageImage };
}
