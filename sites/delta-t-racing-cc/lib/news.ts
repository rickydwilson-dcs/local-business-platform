// lib/news.ts — site-local MDX loader for the "news" content type.
//
// `news` is intentionally NOT added to `lib/mdx.tsx` — that file is a thin
// re-export of `createMdxLoader` from `@platform/core-components/lib/mdx`, and the
// `ContentDir` type it's typed against is a closed union defined inside the shared
// package (not editable from this site-scoped worktree). Rather than touch shared
// code, this module reimplements the same read → parse frontmatter → validate →
// render pattern used internally by `createMdxLoader`
// (see `packages/core-components/src/lib/mdx.tsx`), scoped locally to `news` only.
//
// Uses `createElement` instead of JSX so this file can stay a plain `.ts` module.
import fs from 'fs/promises';
import path from 'path';
import { createElement } from 'react';
import type { ReactElement } from 'react';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import mdxComponents from '@/mdx-components';
import { newsFrontmatterSchema, type NewsArticle } from '@/lib/schemas/news';

const NEWS_DIR = path.join(process.cwd(), 'content', 'news');

/**
 * Lists all news article slugs found in content/news/*.mdx (unsorted, includes drafts).
 */
export async function listNewsSlugs(): Promise<string[]> {
  let files: string[];
  try {
    files = await fs.readdir(NEWS_DIR);
  } catch {
    return [];
  }
  return files.filter((file) => file.endsWith('.mdx')).map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Loads and validates frontmatter for every published news article, sorted by
 * `publishedAt` descending. Articles with `draft: true` are excluded.
 */
export async function getAllNewsArticles(): Promise<NewsArticle[]> {
  const slugs = await listNewsSlugs();

  const articles = await Promise.all(
    slugs.map(async (slug): Promise<NewsArticle> => {
      const filePath = path.join(NEWS_DIR, `${slug}.mdx`);
      const raw = await fs.readFile(filePath, 'utf8');
      const { data } = matter(raw);
      const frontmatter = newsFrontmatterSchema.parse(data);
      return { ...frontmatter, slug };
    })
  );

  return articles
    .filter((article) => !article.draft)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/**
 * Loads a single news article by slug, including its rendered MDX body.
 * Returns `null` for unknown slugs so routes can call `notFound()`.
 */
export async function loadNewsArticle(
  slug: string
): Promise<{ frontmatter: NewsArticle; content: ReactElement } | null> {
  const filePath = path.join(NEWS_DIR, `${slug}.mdx`);

  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  const frontmatter: NewsArticle = { ...newsFrontmatterSchema.parse(data), slug };

  const element = createElement(MDXRemote, {
    source: content,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components: mdxComponents as any,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
      },
    },
  });

  return { frontmatter, content: element };
}
