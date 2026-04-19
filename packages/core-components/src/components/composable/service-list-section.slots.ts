import { z } from "zod";

export const ServiceListSectionSlotsSchema = z
  .object({
    showEyebrow: z.boolean(),
    showDescription: z.boolean(),
    showCta: z.boolean(),
    showItemDescription: z.boolean(),
    showArrow: z.boolean(),
  })
  .strict();

export const ServiceListSectionLayoutSchema = z
  .object({
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted", "image"]).optional(),
  })
  .strict();
