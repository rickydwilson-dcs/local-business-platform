import { z } from "zod";

export const LocationPillsSectionSlotsSchema = z
  .object({
    showEyebrow: z.boolean(),
    showCta: z.boolean(),
    showArrow: z.boolean(),
  })
  .strict();

export const LocationPillsSectionLayoutSchema = z
  .object({
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted", "image"]).optional(),
  })
  .strict();
