import type React from "react";
import { z } from "zod";
import {
  CategoryCardsSection,
  ComposableHeroSection,
  HERO_SECTION_DEFAULT_SLOTS,
  HeroSectionSlotsSchema,
  HeroSectionLayoutSchema,
  ServiceCards,
  SERVICE_CARDS_DEFAULT_SLOTS,
  ServiceCardsSlotsSchema,
  ServiceCardsLayoutSchema,
  FeatureGrid,
  FEATURE_GRID_DEFAULT_SLOTS,
  FeatureGridSlotsSchema,
  FeatureGridLayoutSchema,
  TestimonialGrid,
  TESTIMONIAL_GRID_DEFAULT_SLOTS,
  TestimonialGridSlotsSchema,
  TestimonialGridLayoutSchema,
  StatsStrip,
  STATS_STRIP_DEFAULT_SLOTS,
  StatsStripSlotsSchema,
  StatsStripLayoutSchema,
  ComposableCTASection,
  CTA_SECTION_DEFAULT_SLOTS,
  CTASectionSlotsSchema,
  CTASectionLayoutSchema,
  ContentSection,
  CONTENT_SECTION_DEFAULT_SLOTS,
  ContentSectionSlotsSchema,
  ContentSectionLayoutSchema,
  FAQSection,
  FAQ_SECTION_DEFAULT_SLOTS,
  FAQSectionSlotsSchema,
  FAQSectionLayoutSchema,
  ContactSection,
  CONTACT_SECTION_DEFAULT_SLOTS,
  ContactSectionSlotsSchema,
  ContactSectionLayoutSchema,
  ImageGridSection,
  IMAGE_GRID_SECTION_DEFAULT_SLOTS,
  ImageGridSectionSlotsSchema,
  ImageGridSectionLayoutSchema,
  BlogGrid,
  BLOG_GRID_DEFAULT_SLOTS,
  BlogGridSlotsSchema,
  BlogGridLayoutSchema,
  ProjectGrid,
  PROJECT_GRID_DEFAULT_SLOTS,
  ProjectGridSlotsSchema,
  ProjectGridLayoutSchema,
  PricingTable,
  PRICING_TABLE_DEFAULT_SLOTS,
  PricingTableSlotsSchema,
  PricingTableLayoutSchema,
  TextSection,
  TEXT_SECTION_DEFAULT_SLOTS,
  TextSectionSlotsSchema,
  TextSectionLayoutSchema,
} from "@platform/core-components/components/composable";
import type { ComponentName } from "./types";

export interface ComponentDefinition {
  component: React.ComponentType<{
    slots?: Record<string, boolean>;
    layout?: Record<string, unknown>;
    data: Record<string, unknown>;
    className?: string;
  }>;
  defaultSlots: Record<string, boolean>;
  slotsSchema: z.ZodObject<z.ZodRawShape>;
  layoutSchema: z.ZodObject<z.ZodRawShape>;
}

const s = (slots: unknown) => slots as Record<string, boolean>;

export const COMPONENT_REGISTRY: Record<ComponentName, ComponentDefinition> = {
  HeroSection: {
    component: ComposableHeroSection as ComponentDefinition["component"],
    defaultSlots: s(HERO_SECTION_DEFAULT_SLOTS),
    slotsSchema: HeroSectionSlotsSchema,
    layoutSchema: HeroSectionLayoutSchema,
  },
  ServiceCards: {
    component: ServiceCards as ComponentDefinition["component"],
    defaultSlots: s(SERVICE_CARDS_DEFAULT_SLOTS),
    slotsSchema: ServiceCardsSlotsSchema,
    layoutSchema: ServiceCardsLayoutSchema,
  },
  FeatureGrid: {
    component: FeatureGrid as ComponentDefinition["component"],
    defaultSlots: s(FEATURE_GRID_DEFAULT_SLOTS),
    slotsSchema: FeatureGridSlotsSchema,
    layoutSchema: FeatureGridLayoutSchema,
  },
  TestimonialGrid: {
    component: TestimonialGrid as ComponentDefinition["component"],
    defaultSlots: s(TESTIMONIAL_GRID_DEFAULT_SLOTS),
    slotsSchema: TestimonialGridSlotsSchema,
    layoutSchema: TestimonialGridLayoutSchema,
  },
  StatsStrip: {
    component: StatsStrip as ComponentDefinition["component"],
    defaultSlots: s(STATS_STRIP_DEFAULT_SLOTS),
    slotsSchema: StatsStripSlotsSchema,
    layoutSchema: StatsStripLayoutSchema,
  },
  CTASection: {
    component: ComposableCTASection as ComponentDefinition["component"],
    defaultSlots: s(CTA_SECTION_DEFAULT_SLOTS),
    slotsSchema: CTASectionSlotsSchema,
    layoutSchema: CTASectionLayoutSchema,
  },
  ContentSection: {
    component: ContentSection as ComponentDefinition["component"],
    defaultSlots: s(CONTENT_SECTION_DEFAULT_SLOTS),
    slotsSchema: ContentSectionSlotsSchema,
    layoutSchema: ContentSectionLayoutSchema,
  },
  FAQSection: {
    component: FAQSection as ComponentDefinition["component"],
    defaultSlots: s(FAQ_SECTION_DEFAULT_SLOTS),
    slotsSchema: FAQSectionSlotsSchema,
    layoutSchema: FAQSectionLayoutSchema,
  },
  ContactSection: {
    component: ContactSection as ComponentDefinition["component"],
    defaultSlots: s(CONTACT_SECTION_DEFAULT_SLOTS),
    slotsSchema: ContactSectionSlotsSchema,
    layoutSchema: ContactSectionLayoutSchema,
  },
  ImageGridSection: {
    component: ImageGridSection as ComponentDefinition["component"],
    defaultSlots: s(IMAGE_GRID_SECTION_DEFAULT_SLOTS),
    slotsSchema: ImageGridSectionSlotsSchema,
    layoutSchema: ImageGridSectionLayoutSchema,
  },
  BlogGrid: {
    component: BlogGrid as ComponentDefinition["component"],
    defaultSlots: s(BLOG_GRID_DEFAULT_SLOTS),
    slotsSchema: BlogGridSlotsSchema,
    layoutSchema: BlogGridLayoutSchema,
  },
  ProjectGrid: {
    component: ProjectGrid as ComponentDefinition["component"],
    defaultSlots: s(PROJECT_GRID_DEFAULT_SLOTS),
    slotsSchema: ProjectGridSlotsSchema,
    layoutSchema: ProjectGridLayoutSchema,
  },
  PricingTable: {
    component: PricingTable as ComponentDefinition["component"],
    defaultSlots: s(PRICING_TABLE_DEFAULT_SLOTS),
    slotsSchema: PricingTableSlotsSchema,
    layoutSchema: PricingTableLayoutSchema,
  },
  TextSection: {
    component: TextSection as ComponentDefinition["component"],
    defaultSlots: s(TEXT_SECTION_DEFAULT_SLOTS),
    slotsSchema: TextSectionSlotsSchema,
    layoutSchema: TextSectionLayoutSchema,
  },
  CategoryCardsSection: {
    component: CategoryCardsSection as ComponentDefinition["component"],
    defaultSlots: {},
    slotsSchema: z.object({}),
    layoutSchema: z.object({}),
  },
};
