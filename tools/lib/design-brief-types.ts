import { z } from "zod";

const SectionBlueprintSchema = z.object({
  order: z.number().optional(),
  id: z.string(),
  name: z.string(),
  category: z.string(),
  purpose: z.string(),
  layoutPattern: z.string(),
  contentSlots: z.array(z.string()),
  interactionNeeds: z.enum(["none", "minimal", "stateful"]),
  tokenUsageHints: z.array(z.string()),
  confidence: z.enum(["high", "medium", "low"]),
  componentFileName: z.string().optional(),
  componentExportName: z.string().optional(),
  referenceSection: z.string().optional(),
});

export type DesignBriefSection = z.infer<typeof SectionBlueprintSchema>;

const PageBlueprintSchema = z.object({
  pageType: z.string(),
  sections: z.array(SectionBlueprintSchema),
});

export const DesignBriefSchema = z.object({
  meta: z.object({
    briefVersion: z.string(),
    generatedAt: z.string(),
    sourceUrl: z.string(),
    pipelineVersion: z.string().optional(),
  }),
  reference: z.object({
    url: z.string(),
    screenshots: z.record(z.string(), z.string()).optional(),
    capturedAt: z.string(),
  }),
  palette: z
    .object({
      brand: z.record(z.string(), z.string()).optional(),
      surface: z.record(z.string(), z.string()).optional(),
      semantic: z.record(z.string(), z.string()).optional(),
      overlay: z.record(z.string(), z.string()).optional(),
      provenance: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
  typography: z
    .object({
      fontFamily: z
        .object({
          sans: z.array(z.string()).optional(),
          heading: z.array(z.string()).optional(),
          mono: z.array(z.string()).optional(),
        })
        .optional(),
      scale: z.record(z.string(), z.unknown()).optional(),
      headingStyle: z.string().optional(),
      headingWeight: z.string().optional(),
      bodyWeight: z.string().optional(),
      usesInlineColorHighlights: z.boolean().optional(),
    })
    .optional(),
  layout: z
    .object({
      heroPattern: z.unknown().optional(),
      spacingDensity: z.string().optional(),
      containerWidth: z.string().optional(),
      sectionPaddingY: z.string().optional(),
    })
    .optional(),
  componentVariants: z
    .object({
      heroVariant: z.string().optional(),
      headerVariant: z.string().optional(),
      headerStyle: z.string().optional(),
      cardVariant: z.string().optional(),
      sectionVariant: z.string().optional(),
      buttonRadius: z.string().optional(),
      cardRadius: z.string().optional(),
    })
    .optional(),
  pageBlueprints: z.array(PageBlueprintSchema),
  visualTone: z
    .object({
      description: z.string().optional(),
      designSkillHints: z
        .object({
          variance: z.number().optional(),
          density: z.number().optional(),
          motion: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type DesignBrief = z.infer<typeof DesignBriefSchema>;
