import { z } from "zod";

export const StatsStripSlotsSchema = z
  .object({
    showLabel: z.boolean(),
    showDescription: z.boolean(),
    showDividers: z.boolean(),
  })
  .strict();

export const StatsStripLayoutSchema = z
  .object({
    columns: z.union([z.literal(3), z.literal(4)]).optional(),
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
    paddingY: z.enum(["compact", "standard", "spacious"]).optional(),
  })
  .strict();
