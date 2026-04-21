import { z } from "zod";

export const LocalAuthorityExpertiseSlotsSchema = z
  .object({
    showExpertiseBullets: z.boolean(),
    showFastTrackClaims: z.boolean(),
    showCoverageNeighbourhoods: z.boolean(),
  })
  .strict();

export const LocalAuthorityExpertiseLayoutSchema = z
  .object({
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
  })
  .strict();
