import { z } from "zod";

export const CoverageMapSectionSlotsSchema = z
  .object({
    showSectionHeading: z.boolean(),
    showIntro: z.boolean(),
    showMarkerList: z.boolean(),
  })
  .strict();

export const CoverageMapSectionLayoutSchema = z
  .object({
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
  })
  .strict();
