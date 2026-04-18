import { z } from "zod";

export const ServiceCardsSlotsSchema = z
  .object({
    showIcon: z.boolean(),
    showImage: z.boolean(),
    showDescription: z.boolean(),
    showCta: z.boolean(),
    showBadge: z.boolean(),
  })
  .strict();

export const ServiceCardsLayoutSchema = z
  .object({
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
  })
  .strict();
