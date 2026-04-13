/**
 * Pipeline Brief Types
 *
 * Zod-validated schema for the JobBrief — the contract that all pipeline
 * entry points and stages depend on.
 */

import { z } from "zod";

export const AddressSchema = z.object({
  city: z.string(),
  postcode: z.string(),
  region: z.string().optional(),
});

export const BrandColorsSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
});

export const StitchConfigSchema = z.object({
  designMd: z.string().optional(),
  tasteSkill: z.string().optional(),
  tasteDials: z
    .object({
      creativity: z.number().min(1).max(10),
      density: z.number().min(1).max(10),
      variance: z.number().min(1).max(10),
      motion: z.number().min(1).max(10),
    })
    .optional(),
});

export const JobBriefSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  cpfVersion: z.literal("0.1"),

  source: z.discriminatedUnion("type", [
    z.object({ type: z.literal("url"), value: z.string().url() }),
    z.object({ type: z.literal("stitch"), stitchConfig: StitchConfigSchema }),
    z.object({
      type: z.literal("design-skill"),
      skill: z.string(),
      outputDir: z.string(),
    }),
  ]),

  business: z.object({
    name: z.string(),
    trade: z.string(),
    tagline: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: AddressSchema.optional(),
    website: z.string().url().optional(),
  }),

  content: z.object({
    services: z.array(z.string()).min(1),
    locations: z.array(z.string()).optional(),
    aboutSummary: z.string().optional(),
    tone: z.enum(["professional", "friendly", "bold", "minimal"]).optional(),
    competitors: z.array(z.string().url()).optional(),
  }),

  theme: z.object({
    name: z.string().optional(),
    brandColors: BrandColorsSchema.optional(),
    preferDark: z.boolean().optional(),
    referenceNotes: z.string().optional(),
  }),

  qa: z.object({
    maxIterations: z.number().int().min(1).max(5).default(3),
    thresholds: z.record(z.string(), z.number()).default({
      home: 0.05,
      about: 0.05,
      default: 0.1,
    }),
  }),

  imageGen: z.object({
    enabled: z.boolean().default(true),
    mode: z.enum(["batch", "realtime"]).default("batch"),
    stylePrompt: z.string().optional(),
  }),

  runMode: z.enum(["interactive", "autonomous"]),
});

export type JobBrief = z.infer<typeof JobBriefSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type BrandColors = z.infer<typeof BrandColorsSchema>;
export type StitchConfig = z.infer<typeof StitchConfigSchema>;
