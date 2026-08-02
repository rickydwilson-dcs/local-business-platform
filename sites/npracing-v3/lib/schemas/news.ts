import { z } from 'zod';

/**
 * News hero image schema — optional because no curated hero images exist yet
 * for news articles; a later image-pipeline phase can add them per-article.
 */
const NewsHeroImageSchema = z.object({
  src: z.string().min(1, 'Image src is required'),
  alt: z.string().min(3, 'Image alt text must be at least 3 characters'),
  width: z.number().int().positive('Image width must be a positive integer'),
  height: z.number().int().positive('Image height must be a positive integer'),
});

/**
 * News MDX frontmatter schema
 * Used to validate all files in content/news/
 *
 * News articles are either original NP Racing team posts, or attributed
 * summaries of third-party race reporting (e.g. britishsuperbike.com). For
 * the latter, `sourceName`/`sourceUrl` credit and link to the original
 * report rather than reproducing it wholesale — set both, or omit both for
 * an original post (the UI falls back to the site name).
 */
export const NewsFrontmatterSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(150, 'Title must be less than 150 characters'),

    excerpt: z
      .string()
      .min(10, 'Excerpt must be at least 10 characters')
      .max(300, 'Excerpt must be less than 300 characters'),

    /** ISO date (YYYY-MM-DD) the article was published. */
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'publishedAt must be YYYY-MM-DD format'),

    sourceName: z.string().min(1, 'sourceName is required').optional(),

    sourceUrl: z.url('sourceUrl must be a valid URL').optional(),

    heroImage: NewsHeroImageSchema.optional(),

    tags: z.array(z.string()).optional(),

    featured: z.boolean(),

    draft: z.boolean().default(false),
  })
  .refine((data) => Boolean(data.sourceName) === Boolean(data.sourceUrl), {
    message:
      'sourceName and sourceUrl must both be set (external story) or both omitted (original post)',
    path: ['sourceUrl'],
  });

export type NewsFrontmatter = z.infer<typeof NewsFrontmatterSchema>;
