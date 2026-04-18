import { z } from "zod";

export const TestimonialGridSlotsSchema = z
  .object({
    showStars: z.boolean(),
    showDate: z.boolean(),
    showAvatar: z.boolean(),
    showAuthorName: z.boolean(),
    showLocation: z.boolean(),
    showTitle: z.boolean(),
  })
  .strict();

export const TestimonialGridLayoutSchema = z
  .object({
    columns: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
  })
  .strict();
