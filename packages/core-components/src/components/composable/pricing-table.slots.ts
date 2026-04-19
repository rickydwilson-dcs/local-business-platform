import { z } from "zod";

export const PricingTableSlotsSchema = z
  .object({
    showSectionHeading: z.boolean(),
    showDisclaimer: z.boolean(),
    showIcons: z.boolean(),
  })
  .strict();

export const PricingTableLayoutSchema = z
  .object({
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
    background: z.enum(["surface", "subtle", "muted"]).optional(),
  })
  .strict();
