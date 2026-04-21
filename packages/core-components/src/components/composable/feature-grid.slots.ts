import { z } from "zod";

export const FeatureGridSlotsSchema = z
  .object({
    showSectionHeading: z.boolean(),
    showSectionIntro: z.boolean(),
    showIcons: z.boolean(),
    showDescriptions: z.boolean(),
  })
  .strict();

export const FeatureGridLayoutSchema = z
  .object({
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
    variant: z.enum(["card", "list", "large-feature"]).optional(),
  })
  .strict();
