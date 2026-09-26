import { z } from 'zod';

/**
 * Race calendar MDX frontmatter schema
 * Used to validate all files in content/races/ — one file per championship
 * round. Frontmatter is the data (no body); the calendar renders on the
 * homepage. Dates are ISO `YYYY-MM-DD` strings, transcribed from the
 * organiser's published calendar.
 */
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Dates must be YYYY-MM-DD');

export const RaceFrontmatterSchema = z
  .object({
    round: z.number().int().positive(),
    circuit: z.string().min(1, 'circuit is required'),
    /** Circuit layout, only where the organiser's calendar names one (e.g. "Indy", "GP", "300"). */
    layout: z.string().min(1).optional(),
    startDate: isoDate,
    endDate: isoDate,
    /** Slug of the content/news race report for this round, once one exists. */
    report: z.string().min(1).optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'endDate must be on or after startDate',
    path: ['endDate'],
  });

export type RaceFrontmatter = z.infer<typeof RaceFrontmatterSchema>;
export type Race = RaceFrontmatter & { slug: string };
