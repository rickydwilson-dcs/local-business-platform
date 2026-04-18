import type React from "react";
import type { z } from "zod";
import {
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

export const COMPONENT_REGISTRY: Record<ComponentName, ComponentDefinition> = {
  HeroSection: {
    component: ComposableHeroSection as ComponentDefinition["component"],
    defaultSlots: HERO_SECTION_DEFAULT_SLOTS,
    slotsSchema: HeroSectionSlotsSchema,
    layoutSchema: HeroSectionLayoutSchema,
  },
  ServiceCards: {
    component: ServiceCards as ComponentDefinition["component"],
    defaultSlots: SERVICE_CARDS_DEFAULT_SLOTS,
    slotsSchema: ServiceCardsSlotsSchema,
    layoutSchema: ServiceCardsLayoutSchema,
  },
  FeatureGrid: {
    component: FeatureGrid as ComponentDefinition["component"],
    defaultSlots: FEATURE_GRID_DEFAULT_SLOTS,
    slotsSchema: FeatureGridSlotsSchema,
    layoutSchema: FeatureGridLayoutSchema,
  },
  TestimonialGrid: {
    component: TestimonialGrid as ComponentDefinition["component"],
    defaultSlots: TESTIMONIAL_GRID_DEFAULT_SLOTS,
    slotsSchema: TestimonialGridSlotsSchema,
    layoutSchema: TestimonialGridLayoutSchema,
  },
  StatsStrip: {
    component: StatsStrip as ComponentDefinition["component"],
    defaultSlots: STATS_STRIP_DEFAULT_SLOTS,
    slotsSchema: StatsStripSlotsSchema,
    layoutSchema: StatsStripLayoutSchema,
  },
  CTASection: {
    component: ComposableCTASection as ComponentDefinition["component"],
    defaultSlots: CTA_SECTION_DEFAULT_SLOTS,
    slotsSchema: CTASectionSlotsSchema,
    layoutSchema: CTASectionLayoutSchema,
  },
  ContentSection: {
    component: ContentSection as ComponentDefinition["component"],
    defaultSlots: CONTENT_SECTION_DEFAULT_SLOTS,
    slotsSchema: ContentSectionSlotsSchema,
    layoutSchema: ContentSectionLayoutSchema,
  },
};
