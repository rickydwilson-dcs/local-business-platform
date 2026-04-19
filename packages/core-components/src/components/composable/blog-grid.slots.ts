import { z } from "zod";

export const BlogGridSlotsSchema = z
  .object({
    showSectionHeading: z.boolean(),
    showCategory: z.boolean(),
    showDate: z.boolean(),
    showAuthor: z.boolean(),
    showExcerpt: z.boolean(),
    showReadingTime: z.boolean(),
    showCta: z.boolean(),
  })
  .strict();

export const BlogGridLayoutSchema = z
  .object({
    columns: z.union([z.literal(2), z.literal(3)]).optional(),
    background: z.enum(["surface", "subtle", "inverse"]).optional(),
  })
  .strict();
