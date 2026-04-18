import { z } from "zod";
import { COMPONENT_NAMES } from "./types";

export const ConditionConfigSchema = z.object({
  type: z.enum(["always", "flag", "data-present"]),
  key: z.string().optional(),
  equals: z.union([z.string(), z.boolean(), z.number()]).optional(),
});

export const LayoutParamsSchema = z.object({
  columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  background: z.enum(["surface", "subtle", "inverse", "brand", "muted"]).optional(),
  paddingY: z.enum(["compact", "standard", "spacious"]).optional(),
  align: z.enum(["left", "center", "right", "split"]).optional(),
  maxItems: z.number().int().positive().optional(),
  fullBleed: z.boolean().optional(),
  mediaPosition: z.enum(["left", "right", "top", "bottom"]).optional(),
});

// Stub SectionSchema — replaced with discriminated union in Phase 3
export const SectionSchema = z.object({
  id: z.string().optional(),
  component: z.enum(COMPONENT_NAMES),
  slots: z.record(z.string(), z.boolean()).optional(),
  layout: LayoutParamsSchema.optional(),
  condition: ConditionConfigSchema.optional(),
});

export const PageCompositionSchema = z.object({
  pageType: z.string(),
  sections: z.array(SectionSchema),
});

export const SiteCompositionConfigSchema = z.object({
  version: z.literal("1"),
  siteId: z.string(),
  defaultSlots: z.record(z.string(), z.record(z.string(), z.boolean())).optional(),
  pages: z.array(PageCompositionSchema),
});
