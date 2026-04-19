# YOLO Implementation Brief: Header/Footer Config in Composition System

**Branch:** feature/composition-layout-config (created from develop)
**Session spec:** output/sessions/2026-04/2026-04-19_composition-layout-config/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The composition system has no concept of header or footer — both are hard-wired into each site's `app/layout.tsx` as direct theme component imports, making them invisible to the composition model and non-portable across sites. This plan adds `headerConfig`/`footerConfig` top-level blocks to `SiteCompositionConfig`, a `LAYOUT_REGISTRY` + `registerLayoutComponent()` pattern (site-side registration avoids circular deps), and a `renderComposedLayout()` function that resolves them to React elements. The PoC site is wired as proof-of-concept, with its current static header/footer extracted into named registered components.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80 / $4             | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/composition-layout-config
pnpm type-check   # must be clean before starting
```

---

## Phase 1 — Extend Types and Schemas

**Goal:** Add `LayoutBlockConfig`, `LayoutComponentName`, and extend `SiteCompositionConfig` + Zod schemas to include optional `headerConfig` / `footerConfig` fields.
**Model:** sonnet — involves 3 interdependent files that must stay consistent

Read all three files in parallel before editing:

- `packages/component-composition/src/types.ts`
- `packages/component-composition/src/schemas.ts`
- `packages/component-composition/src/index.ts`

### 1a. Changes to `packages/component-composition/src/types.ts`

Add after the existing type definitions:

```typescript
export type LayoutComponentName = "OrionHeader" | "OrionFooter" | string;
// string union allows sites to register custom names; LayoutComponentName
// documents the known built-in names for IDE autocomplete.

export interface LayoutBlockConfig {
  component: LayoutComponentName;
  slots?: Record<string, boolean>;
  dataKey?: string; // key in siteData whose value is spread as props
}
```

Extend `SiteCompositionConfig`:

```typescript
export interface SiteCompositionConfig {
  version: "1";
  siteId: string;
  defaultSlots?: Record<string, Record<string, boolean>>;
  headerConfig?: LayoutBlockConfig; // NEW
  footerConfig?: LayoutBlockConfig; // NEW
  pages: PageComposition[];
}
```

### 1b. Changes to `packages/component-composition/src/schemas.ts`

Add before `SiteCompositionConfigSchema`:

```typescript
export const LayoutBlockConfigSchema = z.object({
  component: z.string(),
  slots: z.record(z.string(), z.boolean()).optional(),
  dataKey: z.string().optional(),
});
```

Extend `SiteCompositionConfigSchema` to include:

```typescript
headerConfig: LayoutBlockConfigSchema.optional(),
footerConfig: LayoutBlockConfigSchema.optional(),
```

### 1c. Changes to `packages/component-composition/src/index.ts`

Export the new types and schema:

```typescript
export type { LayoutBlockConfig, LayoutComponentName } from "./types";
export { LayoutBlockConfigSchema } from "./schemas";
// renderComposedLayout and registerLayoutComponent will be added in Phase 2
```

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/component-composition type-check
```

Commit:

```bash
git add packages/component-composition/src/types.ts \
        packages/component-composition/src/schemas.ts \
        packages/component-composition/src/index.ts
git commit -m "$(cat <<'EOF'
feat(component-composition): add LayoutBlockConfig types and schemas for headerConfig/footerConfig

Extends SiteCompositionConfig with optional headerConfig and footerConfig
blocks, enabling per-site layout component declaration from composition.json.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Layout Registry and Renderer

**Goal:** Create `layout-registry.ts` (registration map + `registerLayoutComponent()`) and `render-layout.tsx` (`renderComposedLayout()`), then export both from the package index.
**Model:** sonnet — new files with non-trivial logic

Read the current `packages/component-composition/src/index.ts` before editing.

### 2a. Create `packages/component-composition/src/layout-registry.ts`

```typescript
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
```

### 2b. Create `packages/component-composition/src/render-layout.tsx`

```typescript
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
```

### 2c. Update `packages/component-composition/src/index.ts`

Add exports:

```typescript
export { registerLayoutComponent, getLayoutComponent } from "./layout-registry";
export type { LayoutComponentDefinition } from "./layout-registry";
export { renderComposedLayout } from "./render-layout";
export type { LayoutRenderResult } from "./render-layout";
```

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/component-composition type-check
```

Commit:

```bash
git add packages/component-composition/src/layout-registry.ts \
        packages/component-composition/src/render-layout.tsx \
        packages/component-composition/src/index.ts
git commit -m "$(cat <<'EOF'
feat(component-composition): add layout registry and renderComposedLayout()

Sites register their Header/Footer components via registerLayoutComponent(),
then call renderComposedLayout() in layout.tsx to get data-driven header and
footer elements from composition.json config. Avoids circular deps between
this package and theme packages.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Wire the PoC Site

**Goal:** Extract the PoC site's static header/footer into named registered components, update `composition.json` and `lib/page-data.ts`, and rewrite `layout.tsx` to use `renderComposedLayout`.
**Model:** sonnet — multiple interdependent files, need to read before editing

Read all these files in parallel before making any edits:

- `sites/poc-composition-test/app/layout.tsx`
- `sites/poc-composition-test/composition.json`
- `sites/poc-composition-test/lib/page-data.ts`

Also check whether `sites/poc-composition-test/components/` directory exists.

### 3a. Create `sites/poc-composition-test/components/designlab-header.tsx`

Extract the current static header JSX from `layout.tsx` into this named Server Component. The component should accept typed props matching whatever data you'll put in `page-data.ts` under the `header` key. Minimum required props:

```typescript
interface DesignlabHeaderProps {
  siteName: string;
  navigation: Array<{ label: string; href: string }>;
  primaryCta?: { label: string; href: string };
}

export function DesignlabHeader({ siteName, navigation, primaryCta }: DesignlabHeaderProps) {
  // JSX extracted verbatim from current layout.tsx header section
  // Keep all existing Tailwind classes exactly as-is — no visual changes
}
```

### 3b. Create `sites/poc-composition-test/components/designlab-footer.tsx`

Same pattern — extract the current static footer JSX from `layout.tsx`:

```typescript
interface DesignlabFooterProps {
  siteName: string;
  tagline?: string;
  email?: string;
  services?: Array<{ label: string; href: string }>;
  copyright?: string;
}

export function DesignlabFooter({
  siteName,
  tagline,
  email,
  services,
  copyright,
}: DesignlabFooterProps) {
  // JSX extracted verbatim from current layout.tsx footer section
}
```

### 3c. Create `sites/poc-composition-test/components/index.ts`

```typescript
export { DesignlabHeader } from "./designlab-header";
export { DesignlabFooter } from "./designlab-footer";
```

### 3d. Update `sites/poc-composition-test/composition.json`

Add `headerConfig` and `footerConfig` at the top level, before `pages`:

```json
{
  "version": "1",
  "siteId": "designlab-eastbourne",
  "headerConfig": {
    "component": "DesignlabHeader",
    "dataKey": "header"
  },
  "footerConfig": {
    "component": "DesignlabFooter",
    "dataKey": "footer"
  },
  "pages": [ ... existing pages unchanged ... ]
}
```

### 3e. Update `sites/poc-composition-test/lib/page-data.ts`

Add `header` and `footer` keys to the exported `siteData` object. Values must match the prop interfaces defined in 3a/3b:

```typescript
header: {
  siteName: "Designlab",
  navigation: [
    { label: "Signs", href: "/services" },
    { label: "Vehicles", href: "/services/vehicle-graphics" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
  ],
  primaryCta: { label: "Get a Quote", href: "/contact" },
},
footer: {
  siteName: "Designlab",
  tagline: "Eastbourne's leading sign makers",
  email: "hello@designlab.co.uk",
  services: [
    { label: "Shop Signs", href: "/services/shop-signs" },
    { label: "Vehicle Graphics", href: "/services/vehicle-graphics" },
    { label: "Banners & Displays", href: "/services/banners" },
    { label: "Window Graphics", href: "/services/window-graphics" },
  ],
  copyright: `© ${new Date().getFullYear()} Designlab. All rights reserved.`,
},
```

### 3f. Rewrite `sites/poc-composition-test/app/layout.tsx`

Replace the current hard-coded static header/footer with the registry pattern:

```typescript
import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import compositionConfig from "../composition.json";
import {
  SiteCompositionConfigSchema,
  renderComposedLayout,
  registerLayoutComponent,
} from "@platform/component-composition";
import { DesignlabHeader } from "@/components/designlab-header";
import { DesignlabFooter } from "@/components/designlab-footer";
import { siteData } from "@/lib/page-data";

// Register layout components for this site.
// Names must match the "component" values in composition.json headerConfig/footerConfig.
registerLayoutComponent("DesignlabHeader", {
  component: DesignlabHeader as React.ComponentType<Record<string, unknown>>,
});
registerLayoutComponent("DesignlabFooter", {
  component: DesignlabFooter as React.ComponentType<Record<string, unknown>>,
});

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: "Designlab — Sign Makers Eastbourne",
  description: "Professional sign making and vehicle graphics in Eastbourne.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { headerElement, footerElement } = renderComposedLayout({
    composition: config,
    data: siteData as Record<string, unknown>,
  });

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {headerElement}
        <div className="flex-1">{children}</div>
        {footerElement}
      </body>
    </html>
  );
}
```

**Important:** Keep any existing ThemeProvider, font imports, or other layout-level wrappers that were in the original layout.tsx — only replace the static header/footer JSX blocks with the registry pattern above.

```bash
# Verification gate — STOP if this fails
cd sites/poc-composition-test
npm run type-check
npm run build
```

Commit:

```bash
git add sites/poc-composition-test/
git commit -m "$(cat <<'EOF'
feat(poc-composition-test): wire header/footer via composition layout registry

Extracts static header/footer into DesignlabHeader/DesignlabFooter components,
registers them in layout.tsx, and drives them from headerConfig/footerConfig
blocks in composition.json. Proves the layout registry pattern end-to-end.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Final Monorepo Verification

**Goal:** Confirm the entire monorepo type-checks clean with the new types and the PoC site changes.
**Model:** haiku — read-only verification commands only

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
```

If any errors appear in packages other than those touched in this brief, investigate before continuing — the new `LayoutBlockConfig` type export may require updates to consuming packages.

No commit needed for this phase — it's a verification-only step.

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed.

### Intra-phase groups

| Group | Phase   | Items                                                           | File overlap      | Model  | Rationale                                |
| ----- | ------- | --------------------------------------------------------------- | ----------------- | ------ | ---------------------------------------- |
| G1    | Phase 1 | Read `types.ts`, Read `schemas.ts`, Read `index.ts`             | none (reads only) | n/a    | Independent reads — batch in one message |
| G2    | Phase 3 | Read `layout.tsx`, Read `composition.json`, Read `page-data.ts` | none (reads only) | n/a    | Independent reads before any edits       |
| G3    | Phase 3 | Create `designlab-header.tsx`, Create `designlab-footer.tsx`    | none              | sonnet | Independent new files, no shared content |

### Cross-phase groups

| Group  | Phases | Items | Rationale                                                                                                       |
| ------ | ------ | ----- | --------------------------------------------------------------------------------------------------------------- |
| (none) |        |       | Phase 1 types must exist before Phase 2 can import them; Phase 2 registry must exist before Phase 3 can call it |

### Sequential points — MUST NOT parallelise

| Item                                      | Reason                                                                                             |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Phase 1 → Phase 2                         | Phase 2 imports types defined in Phase 1. Must be sequential.                                      |
| Phase 2 → Phase 3                         | Phase 3 calls `registerLayoutComponent` / `renderComposedLayout` from Phase 2. Must be sequential. |
| Verification gates between phases         | Each gate confirms the previous phase's output before the next begins.                             |
| Git commits                               | One commit per phase, in order. Never batch.                                                       |
| `npm run build` in Phase 3 gate           | Writes to `.next/` — must run alone.                                                               |
| Edits to `index.ts` (Phase 1 and Phase 2) | Both phases modify this file. Phase 2 edit must happen after Phase 1 is committed.                 |

---

## Cost Estimate

| Phase                           | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Extend types + schemas | sonnet | ~8k               | ~1.5k              | ~$0.05     |
| Phase 2: Registry + renderer    | sonnet | ~7k               | ~2k                | ~$0.05     |
| Phase 3: Wire PoC site          | sonnet | ~12k              | ~3k                | ~$0.08     |
| Phase 4: Final type-check       | haiku  | ~3k               | ~0.2k              | ~$0.003    |
| **Total**                       |        | **~30k**          | **~6.7k**          | **~$0.18** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~3k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes monorepo-wide and `npm run build` passes in `sites/poc-composition-test`
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines × 5) and written (lines × 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-19_composition-layout-config/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-04-19
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.** The groups block is the authoritative execution plan.
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (`Claude Sonnet 4.6`)
- Never push — leave all changes on `feature/composition-layout-config`

## Completed

**Date:** 2026-04-19
**Status:** All phases executed successfully

Added `LayoutBlockConfig`/`LayoutComponentName` types and `LayoutBlockConfigSchema` to `@platform/component-composition`, then created `layout-registry.ts` (LAYOUT_REGISTRY map + `registerLayoutComponent`/`getLayoutComponent`) and `render-layout.tsx` (`renderComposedLayout`) to resolve registered components from composition.json config. The PoC site (`poc-composition-test`) had its hard-coded header/footer extracted into `DesignlabHeader` and `DesignlabFooter` Server Components, registered via `registerLayoutComponent` in `layout.tsx`, and driven by new `headerConfig`/`footerConfig` blocks in `composition.json`. The one adaptation from plan: the double cast `as unknown as React.ComponentType<Record<string, unknown>>` was required (TypeScript requires the intermediate `unknown` cast when types don't overlap — the brief showed a single-cast which TypeScript rejected). All verification gates passed; monorepo type-check and PoC site build both clean.

### Commits

- `c56207c` feat(component-composition): add LayoutBlockConfig types and schemas for headerConfig/footerConfig
- `c76d956` feat(component-composition): add layout registry and renderComposedLayout()
- `98bcbed` feat(poc-composition-test): wire header/footer via composition layout registry
