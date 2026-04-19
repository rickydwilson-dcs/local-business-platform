import { z } from "zod";

export const WhyChooseUsSectionSlotsSchema = z
  .object({
    showEyebrow: z.boolean(),
    showHeadingHighlight: z.boolean(),
    showStat: z.boolean(),
  })
  .strict();

export const WhyChooseUsSectionLayoutSchema = z
  .object({
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted", "image"]).optional(),
  })
  .strict();
