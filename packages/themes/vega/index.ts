/**
 * Vega Theme
 *
 * Light-header, split hero, card-grid style.
 * Designed for professional service businesses (e.g. scaffolding, construction).
 *
 * Sites using Vega: colossus-reference, base-template
 *
 * Component registry — consumed by tooling, not at runtime.
 * Actual component selection uses static imports from @platform/core-components.
 */

import type { ComponentRegistry } from "@platform/theme-system";

export const vegaRegistry: ComponentRegistry = {
  theme: "vega",
  heroVariant: "split",
  headerVariant: "light",
  cardVariant: "standard",
  sectionVariant: "standard",
};
