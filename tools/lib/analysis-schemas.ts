/**
 * Analysis Schemas
 *
 * Zod runtime validation schemas for AI-generated analysis responses.
 * Replaces unsafe `as Record<string, unknown>` casts with structured validation.
 */

import { z } from "zod";

// ── Visual Language sub-schemas ──────────────────────────────────────────────

const PaletteSchema = z.object({
  background: z.string(),
  foreground: z.string(),
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  additional: z.array(z.string()).default([]),
  confidence: z.enum(["high", "medium", "low"]),
});

const TypographySchema = z.object({
  headingWeight: z.string(),
  bodyWeight: z.string(),
  headingStyle: z.string(),
  usesInlineColourHighlights: z.boolean(),
});

const HeroPatternSchema = z.object({
  type: z.string(),
  hasBackgroundImage: z.boolean(),
  headerDark: z.boolean(),
});

export const VisualLanguageSchema = z.object({
  palette: PaletteSchema,
  typography: TypographySchema,
  heroPattern: HeroPatternSchema,
  spacingDensity: z.string(),
});

export type VisualLanguageData = z.infer<typeof VisualLanguageSchema>;

// ── Per-page vision response ─────────────────────────────────────────────────

const VisionSectionSchema = z.object({
  order: z.number(),
  blueprintId: z.string(),
  name: z.string(),
  category: z.string(),
  purpose: z.string(),
  layoutPattern: z.string(),
  contentSlots: z.array(z.string()),
  interactionNeeds: z.enum(["none", "minimal", "stateful"]),
  tokenUsageHints: z.array(z.string()),
  confidence: z.enum(["high", "medium", "low"]),
  isShared: z.boolean(),
});

export const PageVisionResponseSchema = z.object({
  pageType: z.string(),
  path: z.string(),
  title: z.string(),
  sections: z.array(VisionSectionSchema),
  visualLanguage: VisualLanguageSchema,
  confidence: z.enum(["high", "medium", "low"]),
});

export type PageVisionResponse = z.infer<typeof PageVisionResponseSchema>;

// ── Site synthesis response ──────────────────────────────────────────────────

const SynthesisBlueprintSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  purpose: z.string(),
  layoutPattern: z.string(),
  contentSlots: z.array(z.string()),
  interactionNeeds: z.enum(["none", "minimal", "stateful"]),
  componentFileName: z.string(),
  componentExportName: z.string(),
  tokenUsageHints: z.array(z.string()),
  confidence: z.enum(["high", "medium", "low"]),
  referenceSection: z.string(),
});

const TypographyScaleEntrySchema = z.object({
  size: z.string().optional(),
  lineHeight: z.string().optional(),
  letterSpacing: z.string().optional(),
  weight: z.number().optional(),
});

const ThemeTokensSchema = z.object({
  brand: z.object({
    primary: z.string(),
    primaryHover: z.string(),
    secondary: z.string(),
    accent: z.string(),
  }),
  surface: z.object({
    background: z.string(),
    foreground: z.string(),
    muted: z.string(),
    card: z.string().optional(),
    cardBorder: z.string().optional(),
    secondaryForeground: z.string().optional(),
    mutedForeground: z.string().optional(),
    subtle: z.string().optional(),
    inverse: z.string().optional(),
  }),
  typography: z.object({
    fontFamilySans: z.array(z.string()),
    fontFamilyHeading: z.array(z.string()),
    scale: z.record(z.enum(["hero", "h1", "h2", "h3", "h4", "body"]), TypographyScaleEntrySchema).optional(),
  }),
  components: z.object({
    button: z.object({
      borderRadius: z.string().optional(),
      paddingX: z.string().optional(),
      paddingY: z.string().optional(),
      fontWeight: z.number().optional(),
    }).optional(),
    card: z.object({
      borderRadius: z.string().optional(),
      padding: z.string().optional(),
      shadow: z.enum(["none", "sm", "md", "lg"]).optional(),
    }).optional(),
    navigation: z.object({
      height: z.string().optional(),
      appearance: z.enum(["dark", "light"]).optional(),
    }).optional(),
    section: z.object({
      paddingY: z.string().optional(),
    }).optional(),
  }).optional(),
});

const RegistryRecommendationSchema = z.object({
  themeName: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
  reasoning: z.string(),
});

export const SiteSynthesisResponseSchema = z.object({
  sharedSections: z.array(z.string()),
  deduplicatedBlueprints: z.array(SynthesisBlueprintSchema),
  visualLanguage: VisualLanguageSchema,
  themeTokenRecommendations: ThemeTokensSchema,
  registryRecommendation: RegistryRecommendationSchema,
});

export type SiteSynthesisResponse = z.infer<typeof SiteSynthesisResponseSchema>;
