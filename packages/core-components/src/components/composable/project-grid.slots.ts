import { z } from "zod";

export const ProjectGridSlotsSchema = z
  .object({
    showSectionHeading: z.boolean(),
    showStats: z.boolean(),
    showTags: z.boolean(),
    showDate: z.boolean(),
    showDescription: z.boolean(),
    showCta: z.boolean(),
  })
  .strict();

export const ProjectGridLayoutSchema = z
  .object({
    columns: z.union([z.literal(2), z.literal(3)]).optional(),
    background: z.enum(["surface", "subtle", "inverse"]).optional(),
  })
  .strict();
