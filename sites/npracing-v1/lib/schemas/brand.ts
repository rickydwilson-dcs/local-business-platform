import { z } from 'zod';

/**
 * Brand MDX frontmatter schema
 * Validates the single singleton file content/brand/npracing.mdx.
 *
 * This is the one source of team/brand copy — homepage and contact page pull
 * from it via lib/brand.ts. It is a required singleton, not optional content:
 * lib/brand.ts throws if the file is missing.
 */

const BrandLogoSchema = z.object({
  /** R2 key path, e.g. "npracing-v1/brand/logo.png" — NOT a local /public path. */
  src: z
    .string()
    .min(1, 'Logo src is required')
    .refine(
      (val) => !val.startsWith('/'),
      'Logo src must be an R2 key path (site-name/...), not a local /public path'
    ),
  alt: z.string().min(1, 'Logo alt text is required'),
});

export const BrandFrontmatterSchema = z.object({
  teamName: z.string().min(1, 'teamName is required'),

  tagline: z.string().min(1, 'tagline is required'),

  championship: z.string().min(1, 'championship is required'),

  /** Displayed, not computed with — e.g. "51". */
  raceNumber: z.string().min(1, 'raceNumber is required'),

  riderName: z.string().min(1, 'riderName is required'),

  email: z.string().email('email must be a valid email address'),

  /** e.g. "@npracingbsb" */
  instagramHandle: z.string().min(1, 'instagramHandle is required'),

  instagramUrl: z.string().url('instagramUrl must be a valid URL'),

  logo: BrandLogoSchema,

  foundedYear: z.number().int().optional(),
});

export type BrandContent = z.infer<typeof BrandFrontmatterSchema>;
