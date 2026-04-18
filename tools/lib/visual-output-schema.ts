import { z } from "zod";

export const VisualPassOutputSchema = z.object({
  themeConfig: z.record(z.string(), z.unknown()),
  cssOverrides: z.string(),
  fontLinks: z.array(z.string()),
  provenance: z.record(
    z.string(),
    z.object({
      source: z.enum(["computed", "vision", "derived", "fallback"]),
    })
  ),
});

export type VisualPassOutput = z.infer<typeof VisualPassOutputSchema>;
