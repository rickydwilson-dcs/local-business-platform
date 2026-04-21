import { z } from "zod";

export const PricingPackagesSectionSlotsSchema = z
  .object({
    showSectionHeading: z.boolean(),
    showIntro: z.boolean(),
    showFeatures: z.boolean(),
    showHighlightedBadge: z.boolean(),
  })
  .strict();

export const PricingPackagesSectionLayoutSchema = z
  .object({
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
  })
  .strict();
