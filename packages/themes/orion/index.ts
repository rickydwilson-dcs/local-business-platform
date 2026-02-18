/**
 * Orion Theme
 *
 * Dark-header, full-bleed hero, circular icon style.
 * Designed for industrial/trade service businesses (e.g. electrical contractors).
 *
 * Sites using Orion: dj-fox-electrical
 *
 * Component registry — consumed by tooling, not at runtime.
 * Actual component selection uses static imports from @platform/core-components.
 */

import type { ComponentRegistry } from "@platform/theme-system";

export const orionRegistry: ComponentRegistry = {
  theme: "orion",
  heroVariant: "image-overlay",
  headerVariant: "dark",
  cardVariant: "icon-circle",
  sectionVariant: "dark-accent",
};
