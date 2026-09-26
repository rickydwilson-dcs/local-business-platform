import { z } from 'zod';

/**
 * Brand MDX frontmatter schema
 * Validates the single singleton file content/brand/delta-t-racing.mdx.
 *
 * This is the one source of team/brand copy — layout, homepage, about and
 * contact pages pull from it via lib/brand.ts. It is a required singleton, not
 * optional content: lib/brand.ts throws if the file is missing.
 *
 * Adapted from npracing-v1: Delta T runs four riders rather than one, so the
 * single `raceNumber`/`riderName` fields are gone (riders live in
 * content/team/), and the team has no confirmed social accounts yet, so every
 * social field is optional and the UI omits the link when it's absent.
 */

const BrandLogoSchema = z.object({
  /** Full R2 URL, e.g. ".../delta-t-racing/logo/delta-t-racing-logo.png" — NOT a local /public path. */
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

export const BrandFrontmatterSchema = z.object({
  teamName: z.string().min(1, 'teamName is required'),

  tagline: z.string().min(1, 'tagline is required'),

  /** Championship / organising club, e.g. "Bemsee (BMCRC)". */
  championship: z.string().min(1, 'championship is required'),

  /** Season the site currently describes, e.g. 2026. */
  season: z.number().int(),

  /** Classes the team's riders contest this season. */
  classes: z.array(z.string().min(1)).min(1),

  email: z.string().email('email must be a valid email address'),

  /** e.g. "@deltatracing" — optional until the team confirms an account. */
  instagramHandle: z.string().min(1).optional(),
  instagramUrl: z.string().url('instagramUrl must be a valid URL').optional(),
  facebookUrl: z.string().url('facebookUrl must be a valid URL').optional(),

  logo: BrandLogoSchema,

  /** 1200×630 social-share image. */
  ogImage: z.string().url(),

  foundedYear: z.number().int().optional(),
});

export type BrandContent = z.infer<typeof BrandFrontmatterSchema>;
