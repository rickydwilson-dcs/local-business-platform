import { z } from 'zod';

/**
 * Team MDX frontmatter schema
 * Used to validate all files in content/team/
 *
 * Team members have no individual detail page — this schema only backs the
 * card grid on /team, so there is no MDX body to compile/render here.
 */

const TeamImageSchema = z.object({
  /** R2 key path or full R2 URL, e.g. "npracing-v1/team/neil-pearson.jpg" — NOT a local /public path. */
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

export const TeamFrontmatterSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  role: z.string().min(1, 'Role is required'),

  /** Optional job description — most crew only have a role on file so far. */
  description: z.string().min(1).optional(),

  image: TeamImageSchema,

  sortOrder: z.number().int(),
});

export type TeamFrontmatter = z.infer<typeof TeamFrontmatterSchema>;
