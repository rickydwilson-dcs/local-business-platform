import { z } from 'zod';

/**
 * Sponsors MDX frontmatter schema
 * Used to validate all files in content/sponsors/
 *
 * Sponsors have no individual detail page — this schema only backs the
 * spotlight list on /sponsors, so there is no MDX body to compile/render
 * here (mirrors the team/merch pattern).
 */

const SponsorLogoSchema = z.object({
  /** R2 key path or full R2 URL, e.g. "npracing-v1/sponsors/gbracing-white.png" — NOT a local /public path. */
  src: z
    .string()
    .min(1, 'Logo src is required')
    .refine(
      (val) => !val.startsWith('/'),
      'Logo src must be an R2 key path or full URL, not a local /public path'
    ),
  alt: z.string().min(1, 'Logo alt text is required'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const SponsorFrontmatterSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  /** Short closing line, e.g. "World-class protection. Engineered for racing." */
  tagline: z.string().min(1, 'Tagline is required'),

  /** Bio, one paragraph per array entry. */
  bio: z.array(z.string().min(1)).min(1, 'At least one bio paragraph is required'),

  websiteUrl: z.string().url(),

  logo: SponsorLogoSchema,

  sortOrder: z.number().int(),
});

export type SponsorFrontmatter = z.infer<typeof SponsorFrontmatterSchema>;
