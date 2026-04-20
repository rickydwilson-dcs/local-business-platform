import { z } from "zod";

export const RATE_CARDS_SECTION_DEFAULT_SLOTS = {
  showHeading: true,
};

export const RateCardsSectionSlotsSchema = z
  .object({
    showHeading: z.boolean(),
  })
  .strict();

export const RateCardsSectionLayoutSchema = z
  .object({
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted", "image"]).optional(),
  })
  .strict();
