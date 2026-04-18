import { z } from "zod";

export const CTASectionSlotsSchema = z
  .object({
    showSubheading: z.boolean(),
    showPrimaryCta: z.boolean(),
    showSecondaryCta: z.boolean(),
    showTrustLine: z.boolean(),
  })
  .strict();

export const CTASectionLayoutSchema = z
  .object({
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
    align: z.enum(["left", "center", "right", "split"]).optional(),
  })
  .strict();
