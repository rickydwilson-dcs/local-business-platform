import Anthropic from "@anthropic-ai/sdk";
import { createTrace, flushLangfuse } from "./langfuse-tracer";
import { matchComponents } from "./component-matcher";
import type { SectionBlueprint } from "./reference-analysis-types";
import { COMPOSITION_CATALOG } from "./composition-catalog";
import { SiteCompositionConfigSchema } from "../../packages/component-composition/src/schemas";
import { DesignBriefSchema } from "./design-brief-types";
import type { DesignBrief } from "./design-brief-types";
import type { SiteCompositionConfig } from "../../packages/component-composition/src/types";

export { DesignBriefSchema };
export type { DesignBrief };

export async function generateStructuralComposition(
  brief: DesignBrief,
  options?: { model?: string }
): Promise<SiteCompositionConfig> {
  const client = new Anthropic();
  const model = options?.model ?? "claude-sonnet-4-6";
  const trace = createTrace("composition-structural-pass", { siteRef: brief.reference?.url });

  // Convert design-brief sections to SectionBlueprint shape for the matcher
  const allSections: SectionBlueprint[] = brief.pageBlueprints.flatMap((p) =>
    p.sections.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category as SectionBlueprint["category"],
      purpose: s.purpose,
      layoutPattern: s.layoutPattern,
      contentSlots: s.contentSlots,
      interactionNeeds: s.interactionNeeds,
      tokenUsageHints: s.tokenUsageHints,
      confidence: s.confidence,
      componentFileName: s.componentFileName ?? `${s.id}.tsx`,
      componentExportName: s.componentExportName ?? s.name,
      referenceSection: s.referenceSection ?? s.id,
    }))
  );

  const matchResults = matchComponents(allSections);

  const prefills: Record<string, string> = {};
  for (const [id, match] of matchResults.entries()) {
    if (match && match.matchConfidence === "exact") {
      prefills[id] = match.componentName;
    }
  }

  const systemPrompt = `You are a component composition expert. Given a DesignBrief JSON and a component catalog, produce a SiteCompositionConfig JSON that maps each section blueprint to the best-fit component.

Rules:
- Output ONLY valid JSON matching the SiteCompositionConfig schema
- Only use component names from the catalog: ${COMPOSITION_CATALOG.map((c) => c.name).join(", ")}
- Set slots to disable (false) sub-elements NOT present in the blueprint's contentSlots
- Set layout params to reflect the reference's layoutPattern
- Set condition.type to "data-present" with the relevant data key for sections that appear conditionally
- Most sections should use condition: { type: "always" }
- The prefills object shows suggested component choices for sections where the matcher is confident (score > 0.6) — use these unless you have strong reason not to
- Ignore Navigation and Footer sections — the composition system handles content sections only
- siteId should be derived from the reference URL (domain without TLD)`;

  const userPrompt = `Component catalog:
${JSON.stringify(COMPOSITION_CATALOG, null, 2)}

Suggested prefills (section id → component name, score > 0.6):
${JSON.stringify(prefills, null, 2)}

DesignBrief:
${JSON.stringify(brief, null, 2)}

Produce a SiteCompositionConfig JSON with version "1", siteId derived from brief.reference.url, and pages for each pageBlueprint. Include home page at minimum. Skip Navigation and Footer sections.`;

  async function attempt(repairContext?: string): Promise<SiteCompositionConfig> {
    const userContent = repairContext
      ? `${userPrompt}\n\nPrevious attempt failed validation:\n${repairContext}\n\nFix the errors and return only valid JSON.`
      : userPrompt;

    const response = await client.messages.create({
      model,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }],
    });

    trace.logGeneration({
      name: "structural-composition",
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
    return SiteCompositionConfigSchema.parse(parsed);
  }

  try {
    const result = await attempt();
    trace.end(result);
    await flushLangfuse();
    return result;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    try {
      const result = await attempt(errorMsg);
      trace.end(result);
      await flushLangfuse();
      return result;
    } catch (err2) {
      const finalError = err2 instanceof Error ? err2 : new Error(String(err2));
      trace.end(undefined, finalError);
      await flushLangfuse();
      throw finalError;
    }
  }
}
