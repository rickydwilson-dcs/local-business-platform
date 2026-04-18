import { z } from "zod";

export const ContentSectionSlotsSchema = z
  .object({
    showImage: z.boolean(),
    showSubheading: z.boolean(),
    showCta: z.boolean(),
    showList: z.boolean(),
  })
  .strict();

export const ContentSectionLayoutSchema = z
  .object({
    align: z.enum(["left", "center", "right", "split"]).optional(),
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
    fullBleed: z.boolean().optional(),
  })
  .strict();
