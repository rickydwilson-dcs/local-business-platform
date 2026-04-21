import { z } from "zod";

export const CountyGatewayCardsSlotsSchema = z
  .object({
    showSectionHeading: z.boolean(),
    showDescription: z.boolean(),
    showHighlights: z.boolean(),
    showTownCount: z.boolean(),
  })
  .strict();

export const CountyGatewayCardsLayoutSchema = z
  .object({
    columns: z.union([z.literal(2), z.literal(3)]).optional(),
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
  })
  .strict();
