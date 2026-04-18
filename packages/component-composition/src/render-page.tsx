import React from "react";
import { evaluateCondition } from "./conditions";
import { COMPONENT_REGISTRY } from "./registry";
import type { SiteCompositionConfig, ComponentName, RenderDiagnostic, RenderResult } from "./types";

export function renderComposedPage(options: {
  composition: SiteCompositionConfig;
  pageType: string;
  data: Record<string, unknown>;
  flags?: Record<string, unknown>;
}): RenderResult {
  const { composition, pageType, data, flags = {} } = options;
  const page = composition.pages.find((p) => p.pageType === pageType);
  const diagnostics: RenderDiagnostic[] = [];

  if (!page) {
    diagnostics.push({
      sectionIndex: -1,
      component: "",
      error: `No page found for pageType "${pageType}"`,
      severity: "warning",
    });
    return { elements: [], diagnostics };
  }

  const elements: React.ReactElement[] = [];

  page.sections.forEach((section, index) => {
    if (!evaluateCondition(section.condition, { flags, data })) return;

    const definition = COMPONENT_REGISTRY[section.component as ComponentName];
    if (!definition) {
      diagnostics.push({
        sectionIndex: index,
        component: section.component,
        error: `Unknown component "${section.component}"`,
        severity: "error",
      });
      return;
    }

    const configDefaults = composition.defaultSlots?.[section.component] ?? {};
    const slots = {
      ...definition.defaultSlots,
      ...configDefaults,
      ...section.slots,
    };

    try {
      const Component = definition.component;
      elements.push(
        React.createElement(Component, {
          key: section.id ?? `section-${index}`,
          slots,
          layout: section.layout as Record<string, unknown>,
          data,
        })
      );
    } catch (err) {
      diagnostics.push({
        sectionIndex: index,
        component: section.component,
        error: err instanceof Error ? err.message : String(err),
        severity: "error",
      });
    }
  });

  return { elements, diagnostics };
}
