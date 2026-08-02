import { z } from 'zod';

/**
 * Brand/team frontmatter schema — a singleton content type holding
 * NPRacing's team/brand facts. Both the homepage and contact page pull
 * team copy from this one MDX-backed source instead of hardcoded prose.
 *
 * Singleton: only one record is expected under content/brand/ (currently
 * content/brand/npracing.mdx).
 */
export const BrandFrontmatterSchema = z.object({
  teamName: z.string(),
  tagline: z.string(),
  championship: z.string(),
  // Race number is kept as a string (not a number) so leading context like
  // "#51" or non-numeric race numbers can't break at the schema boundary.
  raceNumber: z.string(),
  riderName: z.string(),
  email: z.email(),
  instagramHandle: z.string(),
  instagramUrl: z.url(),
  facebookUrl: z.url(),
  logo: z.object({
    src: z.string(),
    alt: z.string(),
  }),
  foundedYear: z.number().int().optional(),

  /**
   * Homepage poster copy. Optional so the record stays valid without them and
   * so adding them doesn't change the singleton's validation contract — but
   * they exist so the homepage hero pulls its team copy from this MDX record
   * rather than hardcoding prose in a component. Components fall back to
   * composing a headline from the structured fields above when absent.
   */
  heroHeadline: z.string().optional(),
  /** Second headline line, rendered with the red highlight treatment. */
  heroHeadlineAccent: z.string().optional(),
  heroIntro: z.string().optional(),
  /** Headline for the team/about block on the homepage. */
  teamHeadline: z.string().optional(),
});

export type BrandFrontmatter = z.infer<typeof BrandFrontmatterSchema>;
