import React from "react";
import { evaluateCondition } from "./conditions";
import { COMPONENT_REGISTRY } from "./registry";
import type { SiteCompositionConfig, ComponentName, RenderDiagnostic, RenderResult } from "./types";

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined,
      obj
    );
}

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
      const resolved = section.dataKey ? getByPath(data, section.dataKey) : undefined;
      const sectionData =
        section.dataKey && typeof resolved === "object" && resolved !== null
          ? { ...data, ...(resolved as Record<string, unknown>) }
          : data;
      elements.push(
        React.createElement(Component, {
          key: section.id ?? `section-${index}`,
          slots,
          layout: section.layout as Record<string, unknown>,
          data: sectionData,
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
