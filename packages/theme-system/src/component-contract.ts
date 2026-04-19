/**
 * Theme Component Contract
 *
 * Every theme's globals.css MUST define these CSS classes.
 * Composable section components in @platform/core-components rely on
 * them and will render broken on any theme that does not implement them.
 *
 * Classes are identified by NAME only — each theme implements them with
 * its own visual identity (colours, radii, shadows). Contract compliance
 * is validated in CI by tools/validate-theme-globals.ts.
 */

export type ContractGroup = "button" | "section" | "overlay" | "utility";

export interface ContractClass {
  name: string;
  group: ContractGroup;
  purpose: string;
  consumers: readonly string[];
}

export const THEME_COMPONENT_CONTRACT: readonly ContractClass[] = [
  // Buttons
  {
    name: "btn-primary",
    group: "button",
    purpose: "Primary action button on any section background.",
    consumers: ["hero-section.tsx", "cta-section.tsx"],
  },
  {
    name: "btn-secondary",
    group: "button",
    purpose: "Secondary action button on any section background.",
    consumers: [
      "hero-section.tsx",
      "cta-section.tsx",
      "service-list-section.tsx",
      "location-pills-section.tsx",
    ],
  },
  {
    name: "btn-tertiary",
    group: "button",
    purpose: "Action button on a dark section-dark-accent section.",
    consumers: ["cta-section.tsx"],
  },
  {
    name: "btn-on-brand-primary",
    group: "button",
    purpose: "Primary action button when the surrounding section background is bg-brand-primary.",
    consumers: ["cta-section.tsx"],
  },
  {
    name: "btn-on-brand-primary-outline",
    group: "button",
    purpose:
      "Outline/secondary action button when the surrounding section background is bg-brand-primary.",
    consumers: ["cta-section.tsx"],
  },
  // Sections
  {
    name: "section-dark-accent",
    group: "section",
    purpose:
      "Theme's signature dark CTA/callout section background with auto-styled h2/h3/p descendants.",
    consumers: ["cta-section.tsx"],
  },
  // Overlays
  {
    name: "noise-overlay",
    group: "overlay",
    purpose: "Subtle grain/texture overlay for depth on flat sections.",
    consumers: [
      "cta-section.tsx",
      "hero-section.tsx",
      "feature-grid.tsx",
      "stats-strip.tsx",
      "why-choose-us-section.tsx",
    ],
  },
  // Component utilities
  {
    name: "stat-value",
    group: "utility",
    purpose: "Stat number typography with tabular-nums.",
    consumers: ["stats-strip.tsx", "why-choose-us-section.tsx"],
  },
  {
    name: "location-pill",
    group: "utility",
    purpose: "Interactive pill-style link used in location lists.",
    consumers: ["location-pills-section.tsx"],
  },
  {
    name: "location-pill-arrow",
    group: "utility",
    purpose: "Arrow icon inside a location-pill; animates on hover.",
    consumers: ["location-pills-section.tsx"],
  },
] as const;

export const CONTRACT_CLASS_NAMES: readonly string[] = THEME_COMPONENT_CONTRACT.map((c) => c.name);
