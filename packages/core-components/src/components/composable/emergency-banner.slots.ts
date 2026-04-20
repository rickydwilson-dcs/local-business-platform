import { z } from "zod";

export const EMERGENCY_BANNER_DEFAULT_SLOTS = {
  showHeading: true,
  showPoints: true,
  showDescription: true,
  showCta: true,
};

export const EmergencyBannerSlotsSchema = z
  .object({
    showHeading: z.boolean(),
    showPoints: z.boolean(),
    showDescription: z.boolean(),
    showCta: z.boolean(),
  })
  .strict();

export const EmergencyBannerLayoutSchema = z
  .object({
    background: z.literal("inverse").optional(),
  })
  .strict();
