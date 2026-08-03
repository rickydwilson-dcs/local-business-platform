import { z } from 'zod';

/**
 * Team member image schema.
 * `src` is an R2 key path (e.g. "npracing-v3/team/neil-pearson.jpg") resolved
 * via `getImageUrl()` — must not start with `/`, which `getImageUrl` would
 * otherwise silently resolve into a working-but-fragile URL (see
 * lib/schemas/brand.ts's un-guarded `logo.src` for the existing footgun this
 * avoids).
 */
const TeamImageSchema = z.object({
  src: z
    .string()
    .min(1, 'Image src is required')
    .refine(
      (val) => !val.startsWith('/'),
      'Image src must be an R2 key path, not a local /public path'
    ),
  alt: z.string().min(3, 'Image alt text must be at least 3 characters'),
  width: z.number().int().positive('Image width must be a positive integer'),
  height: z.number().int().positive('Image height must be a positive integer'),
});

/**
 * Team MDX frontmatter schema
 * Used to validate all files in content/team/
 *
 * Team members have no individual detail page — this schema only backs the
 * card grid on /team, so there is no MDX body to compile/render here.
 */
export const TeamFrontmatterSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  role: z.string().min(1, 'Role is required'),

  image: TeamImageSchema,

  sortOrder: z.number().int('sortOrder must be an integer'),
});

export type TeamFrontmatter = z.infer<typeof TeamFrontmatterSchema>;
