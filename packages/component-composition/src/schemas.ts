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
  FAQSectionSlotsSchema,
  FAQSectionLayoutSchema,
  ContactSectionSlotsSchema,
  ContactSectionLayoutSchema,
  ImageGridSectionSlotsSchema,
  ImageGridSectionLayoutSchema,
  BlogGridSlotsSchema,
  BlogGridLayoutSchema,
  ProjectGridSlotsSchema,
  ProjectGridLayoutSchema,
  PricingTableSlotsSchema,
  PricingTableLayoutSchema,
  TextSectionSlotsSchema,
  TextSectionLayoutSchema,
} from "@platform/core-components/components/composable";

export const ConditionConfigSchema = z.object({
  type: z.enum(["always", "flag", "data-present"]),
  key: z.string().optional(),
  equals: z.union([z.string(), z.boolean(), z.number()]).optional(),
});

const BaseSectionFields = {
  id: z.string().optional(),
  condition: ConditionConfigSchema.optional(),
  dataKey: z.string().optional(),
};

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
  ...BaseSectionFields,
  component: z.literal("HeroSection"),
  slots: HeroSectionSlotsSchema.partial().optional(),
  layout: HeroSectionLayoutSchema.partial().optional(),
});

const ServiceCardsSectionSchema = z.object({
  ...BaseSectionFields,
  component: z.literal("ServiceCards"),
  slots: ServiceCardsSlotsSchema.partial().optional(),
  layout: ServiceCardsLayoutSchema.partial().optional(),
});

const FeatureGridSectionSchema = z.object({
  ...BaseSectionFields,
  component: z.literal("FeatureGrid"),
  slots: FeatureGridSlotsSchema.partial().optional(),
  layout: FeatureGridLayoutSchema.partial().optional(),
});

const TestimonialGridSectionSchema = z.object({
  ...BaseSectionFields,
  component: z.literal("TestimonialGrid"),
  slots: TestimonialGridSlotsSchema.partial().optional(),
  layout: TestimonialGridLayoutSchema.partial().optional(),
});

const StatsStripSectionSchema = z.object({
  ...BaseSectionFields,
  component: z.literal("StatsStrip"),
  slots: StatsStripSlotsSchema.partial().optional(),
  layout: StatsStripLayoutSchema.partial().optional(),
});

const CTASectionSectionSchema = z.object({
  ...BaseSectionFields,
  component: z.literal("CTASection"),
  slots: CTASectionSlotsSchema.partial().optional(),
  layout: CTASectionLayoutSchema.partial().optional(),
});

const ContentSectionSectionSchema = z.object({
  ...BaseSectionFields,
  component: z.literal("ContentSection"),
  slots: ContentSectionSlotsSchema.partial().optional(),
  layout: ContentSectionLayoutSchema.partial().optional(),
});

const FAQSectionSectionSchema = z.object({
  ...BaseSectionFields,
  component: z.literal("FAQSection"),
  slots: FAQSectionSlotsSchema.partial().optional(),
  layout: FAQSectionLayoutSchema.partial().optional(),
});

const ContactSectionSectionSchema = z.object({
  ...BaseSectionFields,
  component: z.literal("ContactSection"),
  slots: ContactSectionSlotsSchema.partial().optional(),
  layout: ContactSectionLayoutSchema.partial().optional(),
});

const ImageGridSectionSectionSchema = z.object({
  ...BaseSectionFields,
  component: z.literal("ImageGridSection"),
  slots: ImageGridSectionSlotsSchema.partial().optional(),
  layout: ImageGridSectionLayoutSchema.partial().optional(),
});

const BlogGridSectionSchema = z.object({
  ...BaseSectionFields,
  component: z.literal("BlogGrid"),
  slots: BlogGridSlotsSchema.partial().optional(),
  layout: BlogGridLayoutSchema.partial().optional(),
});

const ProjectGridSectionSchema = z.object({
  ...BaseSectionFields,
  component: z.literal("ProjectGrid"),
  slots: ProjectGridSlotsSchema.partial().optional(),
  layout: ProjectGridLayoutSchema.partial().optional(),
});

const PricingTableSectionSchema = z.object({
  ...BaseSectionFields,
  component: z.literal("PricingTable"),
  slots: PricingTableSlotsSchema.partial().optional(),
  layout: PricingTableLayoutSchema.partial().optional(),
});

const TextSectionSectionSchema = z.object({
  ...BaseSectionFields,
  component: z.literal("TextSection"),
  slots: TextSectionSlotsSchema.partial().optional(),
  layout: TextSectionLayoutSchema.partial().optional(),
});

export const SectionSchema = z.discriminatedUnion("component", [
  HeroSectionSectionSchema,
  ServiceCardsSectionSchema,
  FeatureGridSectionSchema,
  TestimonialGridSectionSchema,
  StatsStripSectionSchema,
  CTASectionSectionSchema,
  ContentSectionSectionSchema,
  FAQSectionSectionSchema,
  ContactSectionSectionSchema,
  ImageGridSectionSectionSchema,
  BlogGridSectionSchema,
  ProjectGridSectionSchema,
  PricingTableSectionSchema,
  TextSectionSectionSchema,
]);

export const LayoutBlockConfigSchema = z.object({
  component: z.string(),
  slots: z.record(z.string(), z.boolean()).optional(),
  dataKey: z.string().optional(),
});

export const SiteCompositionConfigSchema = z.object({
  version: z.literal("1"),
  siteId: z.string(),
  defaultSlots: z.record(z.string(), z.record(z.string(), z.boolean())).optional(),
  headerConfig: LayoutBlockConfigSchema.optional(),
  footerConfig: LayoutBlockConfigSchema.optional(),
  pages: z.array(
    z.object({
      pageType: z.string(),
      sections: z.array(SectionSchema),
    })
  ),
});
