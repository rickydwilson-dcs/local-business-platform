import { z } from "zod";
import {
  HeroSectionSlotsSchema,
  HeroSectionLayoutSchema,
  ServiceCardsSlotsSchema,
  ServiceCardsLayoutSchema,
  FeatureGridSlotsSchema,
  FeatureGridLayoutSchema,
  TestimonialGridSlotsSchema,
  TestimonialGridLayoutSchema,
  StatsStripSlotsSchema,
  StatsStripLayoutSchema,
  CTASectionSlotsSchema,
  CTASectionLayoutSchema,
  ContentSectionSlotsSchema,
  ContentSectionLayoutSchema,
} from "@platform/core-components/components/composable";

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

const HeroSectionSectionSchema = z.object({
  id: z.string().optional(),
  component: z.literal("HeroSection"),
  slots: HeroSectionSlotsSchema.partial().optional(),
  layout: HeroSectionLayoutSchema.partial().optional(),
  condition: ConditionConfigSchema.optional(),
});

const ServiceCardsSectionSchema = z.object({
  id: z.string().optional(),
  component: z.literal("ServiceCards"),
  slots: ServiceCardsSlotsSchema.partial().optional(),
  layout: ServiceCardsLayoutSchema.partial().optional(),
  condition: ConditionConfigSchema.optional(),
});

const FeatureGridSectionSchema = z.object({
  id: z.string().optional(),
  component: z.literal("FeatureGrid"),
  slots: FeatureGridSlotsSchema.partial().optional(),
  layout: FeatureGridLayoutSchema.partial().optional(),
  condition: ConditionConfigSchema.optional(),
});

const TestimonialGridSectionSchema = z.object({
  id: z.string().optional(),
  component: z.literal("TestimonialGrid"),
  slots: TestimonialGridSlotsSchema.partial().optional(),
  layout: TestimonialGridLayoutSchema.partial().optional(),
  condition: ConditionConfigSchema.optional(),
});

const StatsStripSectionSchema = z.object({
  id: z.string().optional(),
  component: z.literal("StatsStrip"),
  slots: StatsStripSlotsSchema.partial().optional(),
  layout: StatsStripLayoutSchema.partial().optional(),
  condition: ConditionConfigSchema.optional(),
});

const CTASectionSectionSchema = z.object({
  id: z.string().optional(),
  component: z.literal("CTASection"),
  slots: CTASectionSlotsSchema.partial().optional(),
  layout: CTASectionLayoutSchema.partial().optional(),
  condition: ConditionConfigSchema.optional(),
});

const ContentSectionSectionSchema = z.object({
  id: z.string().optional(),
  component: z.literal("ContentSection"),
  slots: ContentSectionSlotsSchema.partial().optional(),
  layout: ContentSectionLayoutSchema.partial().optional(),
  condition: ConditionConfigSchema.optional(),
});

export const SectionSchema = z.discriminatedUnion("component", [
  HeroSectionSectionSchema,
  ServiceCardsSectionSchema,
  FeatureGridSectionSchema,
  TestimonialGridSectionSchema,
  StatsStripSectionSchema,
  CTASectionSectionSchema,
  ContentSectionSectionSchema,
]);

export const SiteCompositionConfigSchema = z.object({
  version: z.literal("1"),
  siteId: z.string(),
  defaultSlots: z.record(z.string(), z.record(z.string(), z.boolean())).optional(),
  pages: z.array(
    z.object({
      pageType: z.string(),
      sections: z.array(SectionSchema),
    })
  ),
});
