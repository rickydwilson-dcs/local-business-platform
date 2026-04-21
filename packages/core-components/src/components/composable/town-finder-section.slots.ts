import { z } from "zod";

export const TownFinderSectionSlotsSchema = z
  .object({
    showSectionHeading: z.boolean(),
    showIntro: z.boolean(),
    showCountyBadge: z.boolean(),
  })
  .strict();

export const TownFinderSectionLayoutSchema = z
  .object({
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
  })
  .strict();
