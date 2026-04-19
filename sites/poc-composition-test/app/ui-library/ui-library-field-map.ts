export interface FieldMapEntry {
  slot: string;
  field: string;
  description: string;
  colorVar: string;
}

export const FIELD_MAP: Record<string, FieldMapEntry[]> = {
  HeroSection: [
    {
      slot: "eyebrow",
      field: "eyebrow",
      description: "Eyebrow label above heading",
      colorVar: "--label-green",
    },
    {
      slot: "heading",
      field: "heading",
      description: "Main hero heading",
      colorVar: "--label-blue",
    },
    {
      slot: "subheading",
      field: "subheading",
      description: "Intro text below heading",
      colorVar: "--label-purple",
    },
    {
      slot: "primaryCta",
      field: "primaryCtaText",
      description: "Primary CTA button text + href",
      colorVar: "--label-orange",
    },
  ],
  ServiceCards: [
    { slot: "heading", field: "heading", description: "Section heading", colorVar: "--label-blue" },
    {
      slot: "serviceTitle",
      field: "services[].title",
      description: "Individual service card title",
      colorVar: "--label-green",
    },
  ],
  FeatureGrid: [
    { slot: "heading", field: "heading", description: "Section heading", colorVar: "--label-blue" },
    {
      slot: "intro",
      field: "intro",
      description: "Section intro paragraph (note: field is `intro`, not `subheading`)",
      colorVar: "--label-purple",
    },
    {
      slot: "featureTitle",
      field: "features[].title",
      description: "Individual feature title",
      colorVar: "--label-green",
    },
  ],
  TestimonialGrid: [
    { slot: "heading", field: "heading", description: "Section heading", colorVar: "--label-blue" },
    {
      slot: "quote",
      field: "testimonials[].text",
      description: "Review quote text",
      colorVar: "--label-purple",
    },
    {
      slot: "authorName",
      field: "testimonials[].name",
      description: "Reviewer name",
      colorVar: "--label-green",
    },
  ],
  StatsStrip: [
    {
      slot: "statValue",
      field: "stats[].value",
      description: "Stat headline number or metric",
      colorVar: "--label-blue",
    },
    {
      slot: "statLabel",
      field: "stats[].label",
      description: "Stat label below value",
      colorVar: "--label-green",
    },
  ],
  CTASection: [
    { slot: "heading", field: "heading", description: "CTA heading", colorVar: "--label-blue" },
    {
      slot: "subheading",
      field: "subheading",
      description: "Supporting text below heading",
      colorVar: "--label-purple",
    },
    {
      slot: "primaryCta",
      field: "primaryCtaText",
      description: "Primary CTA button text + href",
      colorVar: "--label-orange",
    },
  ],
  ContentSection: [
    {
      slot: "subheading",
      field: "subheading",
      description: "Eyebrow label above heading",
      colorVar: "--label-green",
    },
    { slot: "heading", field: "heading", description: "Section heading", colorVar: "--label-blue" },
    {
      slot: "body",
      field: "body",
      description: "Main prose paragraph",
      colorVar: "--label-purple",
    },
    {
      slot: "cta",
      field: "ctaText",
      description: "CTA button text + href",
      colorVar: "--label-orange",
    },
  ],
};
