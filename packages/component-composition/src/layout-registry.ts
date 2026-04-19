import type React from "react";

export interface LayoutComponentDefinition {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
}

const LAYOUT_REGISTRY: Record<string, LayoutComponentDefinition> = {};

/**
 * Register a layout component (Header, Footer) for use by renderComposedLayout.
 *
 * Call this in your site's layout.tsx BEFORE renderComposedLayout is invoked.
 * This pattern avoids circular dependencies between component-composition and
 * theme packages — the package declares the contract, sites supply the binding.
 *
 * @example
 * import { OrionHeader } from "@platform/themes/orion/components";
 * registerLayoutComponent("OrionHeader", { component: OrionHeader });
 */
export function registerLayoutComponent(name: string, definition: LayoutComponentDefinition): void {
  LAYOUT_REGISTRY[name] = definition;
}

export function getLayoutComponent(name: string): LayoutComponentDefinition | undefined {
  return LAYOUT_REGISTRY[name];
}
