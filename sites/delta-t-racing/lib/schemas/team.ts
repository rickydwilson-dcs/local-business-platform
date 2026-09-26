import { z } from 'zod';

/**
 * Team (riders) MDX frontmatter schema
 * Used to validate all files in content/team/
 *
 * Adapted from npracing-v1's crew schema: Delta T's team page is its rider
 * line-up, so each record can carry a race number, bike and personal
 * Instagram. Riders have no individual detail page — this schema backs the
 * rider grid on /team and the homepage, so there is no MDX body to render.
 */

const TeamImageSchema = z.object({
  /** Full R2 URL, e.g. ".../delta-t-racing/riders/gene-goodrum-679.jpg" — NOT a local /public path. */
  src: z
    .string()
    .min(1, 'Image src is required')
    .refine(
      (val) => !val.startsWith('/'),
      'Image src must be an R2 key path or full URL, not a local /public path'
    ),
  alt: z.string().min(1, 'Image alt text is required'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const TeamFrontmatterSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),

    role: z.string().min(1, 'Role is required'),

    /** Displayed, not computed with — e.g. "679". */
    raceNumber: z.string().min(1).optional(),

    /** Only where the rider has confirmed it, e.g. "Kawasaki ER6 650cc". */
    bike: z.string().min(1).optional(),

    description: z.string().min(1).optional(),

    instagramUrl: z.string().url().optional(),
    instagramHandle: z.string().min(1).optional(),

    image: TeamImageSchema,

    sortOrder: z.number().int(),
  })
  .refine((data) => Boolean(data.instagramUrl) === Boolean(data.instagramHandle), {
    message: 'instagramUrl and instagramHandle must both be set or both omitted',
    path: ['instagramHandle'],
  });

export type TeamFrontmatter = z.infer<typeof TeamFrontmatterSchema>;
