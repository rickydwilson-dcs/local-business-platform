import { z } from "zod";

export const FAQSectionSlotsSchema = z
  .object({
    showSectionHeading: z.boolean(),
    showPhonePrompt: z.boolean(),
  })
  .strict();

export const FAQSectionLayoutSchema = z
  .object({
    background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
  })
  .strict();
