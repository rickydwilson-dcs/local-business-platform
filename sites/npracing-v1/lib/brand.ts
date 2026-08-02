// lib/brand.ts — site-local loader for the singleton brand content file.
//
// This intentionally does NOT go through @platform/core-components/lib/mdx's
// createMdxLoader: that factory is typed against a closed ContentDir union
// ("services"|"locations"|"blog"|"projects"|"testimonials"|"speakers") defined
// inside packages/core-components, which is not editable from this site-scoped
// worktree. "brand" isn't part of that union, so this file reimplements the
// same read/parse/render pattern (fs + gray-matter + next-mdx-remote/rsc),
// scoped locally to the one file content/brand/npracing.mdx.
//
// content/brand.md (legacy, at the site root) is a different file used only
// as raw planning input — nothing should hand-read it at runtime. This module
// is the one source both the homepage and contact page pull team copy from.
import fs from 'fs/promises';
import path from 'path';
import { createElement } from 'react';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ReactElement } from 'react';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import mdxComponents from '@/mdx-components';
import { BrandFrontmatterSchema, type BrandContent } from '@/lib/schemas/brand';

const BRAND_FILE_PATH = path.join(process.cwd(), 'content', 'brand', 'npracing.mdx');

export async function getBrandContent(): Promise<{
  frontmatter: BrandContent;
  content: ReactElement;
}> {
  let raw: string;
  try {
    raw = await fs.readFile(BRAND_FILE_PATH, 'utf8');
  } catch {
    throw new Error(
      `Brand content file not found at ${BRAND_FILE_PATH}. content/brand/npracing.mdx is a ` +
        'required singleton, not optional content — the site cannot render team copy without it.'
    );
  }

  const { content, data } = matter(raw);

  const parsed = BrandFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Brand content frontmatter failed validation (${BRAND_FILE_PATH}): ${parsed.error.message}`
    );
  }

  const element = createElement(MDXRemote, {
    source: content,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components: mdxComponents as any,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' as const }]],
      },
    },
  });

  return { frontmatter: parsed.data, content: element };
}
