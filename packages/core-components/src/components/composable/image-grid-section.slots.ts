import { z } from "zod";

export const ImageGridSectionSlotsSchema = z
  .object({
    showCategoryBadge: z.boolean().default(true),
    showTitle: z.boolean().default(true),
    showArrow: z.boolean().default(true),
  })
  .strict();

export const ImageGridSectionLayoutSchema = z
  .object({
    columns: z.union([z.literal(2), z.literal(3)]).optional(),
    background: z.enum(["surface", "subtle"]).optional(),
  })
  .strict();
