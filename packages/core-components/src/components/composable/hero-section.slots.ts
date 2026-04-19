import { z } from "zod";

export const HeroSectionSlotsSchema = z
  .object({
    showEyebrow: z.boolean(),
    showSubheading: z.boolean(),
    showPrimaryCta: z.boolean(),
    showSecondaryCta: z.boolean(),
    showHeroImage: z.boolean(),
    showTrustBadges: z.boolean(),
    showBreadcrumbs: z.boolean(),
  })
  .strict();

export const HeroSectionLayoutSchema = z
  .object({
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted", "image"]).optional(),
    align: z.enum(["left", "center", "right", "split"]).optional(),
    fullBleed: z.boolean().optional(),
  })
  .strict();
