import { z } from "zod";

export const TextSectionSlotsSchema = z
  .object({
    showToc: z.boolean(),
    showLastUpdated: z.boolean(),
  })
  .strict();

export const TextSectionLayoutSchema = z
  .object({
    background: z.enum(["surface", "subtle"]).optional(),
    maxWidth: z.enum(["prose", "wide"]).optional(),
  })
  .strict();
