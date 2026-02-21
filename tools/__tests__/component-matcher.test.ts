import { describe, it, expect } from "vitest";
import { matchComponents } from "../lib/component-matcher";
import type { SectionBlueprint } from "../lib/reference-analysis-types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Create a minimal SectionBlueprint for testing.
 */
function makeBlueprint(
  overrides: Partial<SectionBlueprint> & Pick<SectionBlueprint, "id" | "category" | "layoutPattern" | "contentSlots">,
): SectionBlueprint {
  return {
    name: overrides.name ?? overrides.id,
    purpose: "test purpose",
    interactionNeeds: "none",
    componentFileName: `${overrides.id}.tsx`,
    componentExportName: overrides.name ?? overrides.id,
    tokenUsageHints: [],
    confidence: "high",
    referenceSection: "test-section",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("matchComponents", () => {
  it("matches a Hero blueprint with full-bleed/overlay/background-image to HeroWithImage", () => {
    const blueprint = makeBlueprint({
      id: "hero-full-bleed",
      category: "Hero",
      layoutPattern: "full-bleed, overlay, background-image",
      contentSlots: ["heading", "imageSrc", "subheading", "ctaButtons"],
    });

    const results = matchComponents([blueprint]);
    const match = results.get("hero-full-bleed");

    expect(match).not.toBeNull();
    expect(match!.componentName).toBe("HeroWithImage");
    expect(["exact", "close"]).toContain(match!.matchConfidence);
  });

  it("matches a Cards blueprint with icon-circle layout to CircularIconCard", () => {
    const blueprint = makeBlueprint({
      id: "cards-icon-circle",
      category: "Cards",
      layoutPattern: "icon-circle, centered, service-card",
      contentSlots: ["icon", "title", "description"],
    });

    const results = matchComponents([blueprint]);
    const match = results.get("cards-icon-circle");

    expect(match).not.toBeNull();
    expect(match!.componentName).toBe("CircularIconCard");
  });

  it("matches a Stats blueprint with stat-card layout to InfoCard", () => {
    const blueprint = makeBlueprint({
      id: "stats-info",
      category: "Stats",
      layoutPattern: "stat-card, icon, compact",
      contentSlots: ["icon", "heading", "text"],
    });

    const results = matchComponents([blueprint]);
    const match = results.get("stats-info");

    expect(match).not.toBeNull();
    expect(match!.componentName).toBe("InfoCard");
  });

  it("returns null for a completely unmatched blueprint", () => {
    const blueprint = makeBlueprint({
      id: "custom-unknown-widget",
      category: "Custom",
      layoutPattern: "quantum-flux, dimensional-rift",
      contentSlots: ["warpCore", "dilithiumCrystal", "shieldFrequency"],
    });

    const results = matchComponents([blueprint]);
    const match = results.get("custom-unknown-widget");

    expect(match).toBeNull();
  });

  it("assigns 'exact' confidence when score exceeds 0.7", () => {
    // HeroWithImage requires ["heading", "imageSrc", "subheading", "ctaButtons"]
    // and has layoutCues ["full-bleed", "overlay", "background-image", "dark-full-bleed"]
    // Providing all required slots and all layout cues should yield a high score.
    const blueprint = makeBlueprint({
      id: "hero-exact",
      category: "Hero",
      layoutPattern: "full-bleed, overlay, background-image, dark-full-bleed",
      contentSlots: ["heading", "imageSrc", "subheading", "ctaButtons"],
    });

    const results = matchComponents([blueprint]);
    const match = results.get("hero-exact");

    expect(match).not.toBeNull();
    expect(match!.matchConfidence).toBe("exact");
  });

  it("assigns 'close' confidence when score is between 0.4 and 0.7", () => {
    // We need a partial match that scores between 0.4 and 0.7.
    // PageHero requires slots ["heading", "subheading"] and cues ["centered", "minimal", "page-header"].
    // Providing ["heading", "subheading", "extraSlot"] gives Jaccard = 2/3 = 0.67
    // Providing layout "page-header" gives 1/max(1,3) = 0.33
    // Composite: 0.67*0.6 + 0.33*0.4 = 0.40 + 0.13 = 0.53 -> "close"
    const blueprint = makeBlueprint({
      id: "hero-partial",
      category: "Hero",
      layoutPattern: "page-header",
      contentSlots: ["heading", "subheading", "extraSlot"],
    });

    const results = matchComponents([blueprint]);
    const match = results.get("hero-partial");

    expect(match).not.toBeNull();
    expect(match!.matchConfidence).toBe("close");
  });

  it("returns null when category does not match any catalog entry", () => {
    // "Custom" is not a category of any catalog entry
    const blueprint = makeBlueprint({
      id: "no-category-match",
      category: "Custom",
      layoutPattern: "card, grid",
      contentSlots: ["heading", "description"],
    });

    const results = matchComponents([blueprint]);
    const match = results.get("no-category-match");

    expect(match).toBeNull();
  });

  it("handles multiple blueprints in a single call", () => {
    const heroBlueprint = makeBlueprint({
      id: "hero-1",
      category: "Hero",
      layoutPattern: "full-bleed, overlay, background-image",
      contentSlots: ["heading", "imageSrc", "subheading", "ctaButtons"],
    });

    const customBlueprint = makeBlueprint({
      id: "custom-1",
      category: "Custom",
      layoutPattern: "unknown",
      contentSlots: ["mystery"],
    });

    const ctaBlueprint = makeBlueprint({
      id: "cta-1",
      category: "CTA",
      layoutPattern: "full-bleed, dark-band, centered, brand-background",
      contentSlots: ["heading", "description", "ctaButton"],
    });

    const results = matchComponents([heroBlueprint, customBlueprint, ctaBlueprint]);

    expect(results.size).toBe(3);
    expect(results.get("hero-1")).not.toBeNull();
    expect(results.get("custom-1")).toBeNull();
    expect(results.get("cta-1")).not.toBeNull();
    expect(results.get("cta-1")!.componentName).toBe("CTASection");
  });

  it("handles an empty blueprints array", () => {
    const results = matchComponents([]);
    expect(results.size).toBe(0);
  });
});
