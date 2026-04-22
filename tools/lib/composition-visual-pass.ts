import Anthropic from "@anthropic-ai/sdk";
import { VisualPassOutputSchema } from "./visual-output-schema";
import type { DesignBrief } from "./design-brief-types";
import type { VisualPassOutput } from "./visual-output-schema";
import { createTrace, flushLangfuse } from "./langfuse-tracer";

const HEX_PATTERN = /#[0-9a-fA-F]{6}/g;

export async function generateVisualConfig(
  brief: DesignBrief,
  options?: { model?: string }
): Promise<VisualPassOutput> {
  const client = new Anthropic();
  const model = options?.model ?? "claude-sonnet-4-6";
  const trace = createTrace("composition-visual-pass", { siteRef: brief.reference?.url });

  const systemPrompt = `You are a design token expert. Given a DesignBrief JSON, produce a visual configuration object for a white-label website.

Rules:
- Output ONLY valid JSON matching the VisualPassOutput schema
- themeConfig must conform to DeepPartialThemeConfig shape (colors, typography, components)
- Prefer tokens with provenance "computed" over "vision" over "derived"
- cssOverrides ABSOLUTE RULE: use ONLY CSS custom properties like var(--color-brand-primary). NEVER write any hex value (#xxxxxx) anywhere in cssOverrides. If you cannot express something without hex, use an empty string "" for cssOverrides instead.
- fontLinks must be valid Google Fonts <link> href URLs
- Express button/card tweaks in themeConfig.components
- If a font is from the brief's typography.fontFamily, include its Google Fonts URL`;

  const userPrompt = `DesignBrief:
${JSON.stringify(brief, null, 2)}

Produce a VisualPassOutput JSON with:
- themeConfig: colors (brand, surface, semantic, overlay), typography (fontFamily, headingStyle, headingWeight), components (button fontWeight, card borderRadius)
- cssOverrides: any site-specific CSS using only var(--...) custom properties — empty string if none needed
- fontLinks: Google Fonts <link> href values for the fonts in typography.fontFamily
- provenance: for each top-level token group (brand, surface, typography), record the source

Output schema:
{
  "themeConfig": { "colors": { "brand": {...}, "surface": {...} }, "typography": {...}, "components": {...} },
  "cssOverrides": "/* CSS string using only var(--...) */",
  "fontLinks": ["https://fonts.googleapis.com/css2?family=...&display=swap"],
  "provenance": { "brand.primary": { "source": "computed" }, ... }
}`;

  async function attempt(repairContext?: string): Promise<VisualPassOutput> {
    const userContent = repairContext
      ? `${userPrompt}\n\nPrevious attempt failed:\n${repairContext}\n\nFix the errors and return only valid JSON. cssOverrides must use ONLY var(--...) custom properties — no hex values.`
      : userPrompt;

    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }],
    });

    trace.logGeneration({
      name: "visual-config",
      model,
      input: userContent,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const jsonMatch =
      content.text.match(/```json\n?([\s\S]+?)\n?```/) ?? content.text.match(/(\{[\s\S]+\})/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const parsed = JSON.parse(jsonMatch[1]);
    const output = VisualPassOutputSchema.parse(parsed);

    const hexMatches = output.cssOverrides.match(HEX_PATTERN);
    if (hexMatches) {
      throw new Error(
        `cssOverrides contains hardcoded hex values: ${hexMatches.join(", ")}. Replace all with var(--...) custom properties.`
      );
    }

    return output;
  }

  let lastError = "";
  for (let i = 0; i < 3; i++) {
    try {
      const result = await attempt(i > 0 ? lastError : undefined);
      trace.end(result);
      await flushLangfuse();
      return result;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }
  const finalError = new Error(`Visual pass failed after 3 attempts. Last error: ${lastError}`);
  trace.end(undefined, finalError);
  await flushLangfuse();
  throw finalError;
}
