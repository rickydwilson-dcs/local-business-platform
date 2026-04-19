import { z } from "zod";

export const ContactSectionSlotsSchema = z
  .object({
    showHours: z.boolean().default(true),
    showServiceLinks: z.boolean().default(true),
    showSidebarContact: z.boolean().default(true),
  })
  .strict();

export const ContactSectionLayoutSchema = z
  .object({
    background: z.enum(["surface", "subtle", "inverse"]).optional(),
  })
  .strict();
