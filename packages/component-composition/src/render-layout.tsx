import React from "react";
import type { SiteCompositionConfig, LayoutBlockConfig } from "./types";
import { getLayoutComponent } from "./layout-registry";

export interface LayoutRenderResult {
  headerElement: React.ReactElement | null;
  footerElement: React.ReactElement | null;
}

export function renderComposedLayout(options: {
  composition: SiteCompositionConfig;
  data: Record<string, unknown>;
}): LayoutRenderResult {
  const { composition, data } = options;

  function resolveBlock(config: LayoutBlockConfig | undefined): React.ReactElement | null {
    if (!config) return null;

    const def = getLayoutComponent(config.component);
    if (!def) {
      console.warn(
        `[composition] Layout component "${config.component}" not registered. ` +
          `Call registerLayoutComponent("${config.component}", { component: YourComponent }) ` +
          `in your layout.tsx before renderComposedLayout.`
      );
      return null;
    }

    const baseData =
      config.dataKey && typeof data[config.dataKey] === "object" && data[config.dataKey] !== null
        ? (data[config.dataKey] as Record<string, unknown>)
        : data;

    const props: Record<string, unknown> = {
      ...baseData,
      ...(config.slots ?? {}),
    };

    return React.createElement(def.component, props);
  }

  return {
    headerElement: resolveBlock(composition.headerConfig),
    footerElement: resolveBlock(composition.footerConfig),
  };
}
