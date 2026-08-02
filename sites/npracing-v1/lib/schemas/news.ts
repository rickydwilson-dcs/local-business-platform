// lib/schemas/news.ts — Zod validation schema for the site-local "news" content type.
//
// `news` is NOT part of the shared ContentDir union in
// `packages/core-components/src/lib/mdx.tsx` (a closed union owned by the shared
// package). This schema is consumed exclusively by the site-local loader in
// `lib/news.ts`, which reimplements the read/parse/render pattern from
// `createMdxLoader` scoped to this one content type — see that file for context.
import { z } from 'zod';

export const newsHeroImageSchema = z.object({
  // R2 key path, e.g. "npracing-v1/news/<slug>.jpg" — NOT a local /public path.
  src: z.string().min(1, 'heroImage.src is required'),
  alt: z.string().min(1, 'heroImage.alt is required'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const newsFrontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  publishedAt: z.string().min(1, 'publishedAt is required'), // ISO date string
  sourceName: z.string().min(1, 'sourceName is required'),
  sourceUrl: z.url('sourceUrl must be a valid URL'),
  // Optional — no curated image exists yet for these records; Phase 4 resolves images.
  heroImage: newsHeroImageSchema.optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean(),
  draft: z.boolean().default(false),
});

export type NewsHeroImage = z.infer<typeof newsHeroImageSchema>;
export type NewsFrontmatter = z.infer<typeof newsFrontmatterSchema>;
export type NewsArticle = NewsFrontmatter & { slug: string };
