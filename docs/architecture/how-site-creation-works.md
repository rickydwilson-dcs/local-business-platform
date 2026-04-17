# How Site Creation Works

This document explains the full journey from "new business client" to "deployed website." It covers the intake system, project files, site generation tools, and what gets customized.

## The Big Picture

```
New business client
    ↓
Intake (chat, form, or manual) → collects business info, services, locations, brand colors
    ↓
Project file (validated JSON) → structured data describing the entire site
    ↓
create-site-from-project.ts → copies base-template, applies customizations
    ↓
New site in sites/ → theme.config.ts, site.config.ts, content/ MDX files
    ↓
Build & deploy → independent Vercel project
```

## The Base Template

`sites/base-template` is the gold-standard template that all new sites are derived from. It contains:

- **App structure** — Next.js app directory with all route handlers (`[slug]` routes for services, locations, blog, projects)
- **Components** — site-level UI components (hero, navigation, footer, service cards, etc.)
- **Content examples** — sample MDX files for each content type
- **Config files** — `site.config.ts` (business info), `theme.config.ts` (brand colors), `tailwind.config.ts`
- **Lib shims** — thin wrappers (5-10 lines each) that import factory functions from `@platform/core-components` and re-export configured utilities (`lib/content.ts`, `lib/schema.ts`, `lib/mdx.tsx`, `lib/site.ts`, `lib/contact-info.ts`)

When creating a new site, the tool copies base-template and replaces the config values. The dynamic routing, components, and lib shims carry over unchanged. The shims preserve `@/lib/*` import paths so page files don't need modification.

## The Intake System

`packages/intake-system` automates the data collection step. It has four subsystems:

### Schemas

Zod schemas that define the structure of a project file — business info, addresses, services, locations, theme colors, and metadata.

```typescript
import { ProjectFileSchema, validateProjectFile } from "@platform/intake-system/schemas";

const result = validateProjectFile(projectData);
if (!result.success) {
  console.log(result.error.issues); // Validation errors
}
```

### Industry Templates

Pre-built defaults for common business types. When a plumber signs up, the plumbing template pre-fills typical services (emergency repair, boiler installation, drain clearing), common FAQs, and industry-standard content structures.

Available templates: scaffolding, plumbing, electrical, cleaning, and more.

```typescript
import { getIndustryTemplate } from "@platform/intake-system";

const template = getIndustryTemplate("plumbing");
// Returns pre-filled services, FAQs, content suggestions
```

### Chat Intake

A Claude-powered conversational intake system. Provides system prompts and tool definitions so an AI agent can collect business info through natural conversation:

```typescript
import { INTAKE_SYSTEM_PROMPT, INTAKE_TOOLS } from "@platform/intake-system/chat-intake";

// Tools available to Claude during intake:
// - getIndustryTemplateTool() → suggest services based on business type
// - validateProjectSectionTool() → validate data quality in real-time
// - suggestBrandColorsTool() → generate color palette
// - formatServicesTool() → structure service definitions
```

### Theme Extraction

Analyzes existing websites or logo images to extract brand colors:

```typescript
import {
  extractColorsFromImage,
  generateThemeFromWebsite,
} from "@platform/intake-system/theme-extraction";

// From a logo image
const colors = await extractColorsFromImage("./logo.png");

// From an existing website
const theme = await generateThemeFromWebsite("https://existing-site.com");
// Returns ThemeConfig-compatible color palette
```

## The Project File

The intake process produces a project file — a validated JSON structure containing everything needed to generate a site:

```json
{
  "metadata": {
    "projectName": "smiths-electrical-cambridge",
    "businessType": "electrical",
    "intakeChannel": "chat",
    "status": "ready"
  },
  "business": {
    "name": "Smith's Electrical",
    "phone": "01223 456789",
    "email": "info@smithselectrical.co.uk",
    "address": { "street": "...", "city": "Cambridge", "postcode": "CB1 2AB" },
    "hours": { "weekdays": "8am-6pm", "saturday": "9am-4pm" }
  },
  "services": [
    { "slug": "rewiring", "title": "Full House Rewiring", "description": "..." },
    { "slug": "fuse-board-upgrade", "title": "Fuse Board Upgrades", "description": "..." }
  ],
  "locations": [
    { "slug": "cambridge", "title": "Cambridge", "description": "..." },
    { "slug": "ely", "title": "Ely", "description": "..." }
  ],
  "theme": {
    "colors": {
      "brand": { "primary": "#2563eb", "secondary": "#1e40af", "accent": "#f59e0b" }
    }
  }
}
```

## The Site Generation Tool

`tools/create-site-from-project.ts` consumes the project file and creates a new site:

1. **Copies base-template** to `sites/[project-name]/`
2. **Generates `site.config.ts`** with business name, phone, email, address, hours
3. **Generates `theme.config.ts`** with brand colors from the project file
4. **Updates `package.json`** with the new site name
5. **Runs validation** to ensure all generated config passes schema checks

> **Note:** `create-site-from-project.ts` generates config files (`site.config.ts`, `theme.config.ts`) only — it does not create MDX content files. Content generation is a separate step done by `tools/generate-services.ts` and `tools/generate-locations.ts` after the site is scaffolded.

```bash
npx tsx tools/create-site-from-project.ts --project tools/examples/sample-project.json
```

## What Gets Customized vs What's Shared

| Customized per site                             | Shared across all sites (via core-components factories) |
| ----------------------------------------------- | ------------------------------------------------------- |
| `site.config.ts` (business info, nav, features) | `createContentUtils()` — content reading, filtering     |
| `theme.config.ts` (brand colors, typography)    | `createSchemaGenerators()` — JSON-LD structured data    |
| `content/` (all MDX files)                      | `createMdxLoader()` — MDX rendering pipeline            |
| `public/` (favicon, images)                     | `createSiteUtils()` — URL helpers, phone formatters     |
| Vercel project config                           | `createContactInfo()` — business contact constants      |
| Domain/DNS                                      | `createContactHandler()` — contact form API route       |
|                                                 | UI components, theme system, Zod schemas                |

Each site's `lib/` directory contains thin shims that call these factories with site-specific config (from `site.config.ts`) and re-export the results. For example, a site needing custom service sorting passes a `serviceSortFn` to `createContentUtils()`.

## Theme-First Visual Scaffolding

New sites get two layers of scaffolding:

1. **Base-template (capability layer)** — provides the full app infrastructure: API routes, lib shims, config structure, analytics, consent management, `[slug]` dynamic routes, TypeScript setup. Every site gets this layer regardless of theme.

2. **Theme reference site (visual layer)** — provides canonical visual implementations of the site shell and key pages. The following files are copied from the theme's reference site and overwrite the generic base-template versions:
   - `app/layout.tsx` — wires the theme's `Header` and `Footer` components (e.g. `CygnusHeader`, `CygnusFooter`) so new sites get the correct navigation and footer automatically
   - `app/page.tsx`, `app/services/page.tsx`, `app/about/page.tsx`, `app/locations/page.tsx` — page layouts using the theme's visual language

### Reference Sites

| Theme   | Reference Site            | Provides                                     |
| ------- | ------------------------- | -------------------------------------------- |
| `orion` | `sites/dj-fox-electrical` | Dark header, full-bleed hero, circular icons |
| `vega`  | `sites/base-template`     | Light header, split hero, standard card grid |

Other active themes (cygnus, solaris, castor) fall back to `base-template` pages until a dedicated reference site is configured.

### Graceful Fallback

If no reference site is configured for the requested theme, or if the reference site directory doesn't exist on disk, the pipeline logs a warning and falls back to base-template pages. This means adding new themes doesn't require reference sites to exist immediately.

### Pipeline Flow

```
create-site-from-project.ts --project project.json --theme castor

1. Copy base-template → sites/new-site/   (capability infrastructure)
2. applyThemePageOverrides()              (overlay visual pages from reference site, if configured)
3. Generate site.config.ts                (business data)
4. Generate theme.config.ts              (brand colors + castorRegistry)
```

### Adding a New Theme Reference

To wire a new theme to a reference site:

1. Add an entry to `THEME_REFERENCE_SITE_MAP` in `tools/create-site-from-project.ts`
2. Add the theme package to `THEME_REGISTRY_MAP` in the same file
3. Ensure the reference site's visual pages don't import site-specific data directly

## After Creation

Once a new site exists in `sites/`:

1. **Run `pnpm install`** from root — registers the new workspace
2. **Run `pnpm build`** — Turborepo includes the new site
3. **Create Vercel project** — `vercel link` in the site directory
4. **Configure domain** — in Vercel dashboard
5. **Deploy** via the standard git workflow (develop → staging → main)

## Updating Base Template

When base-template improves (new component, better routing, bug fix), most improvements flow automatically because shared logic lives in `packages/core-components` via factory functions. Sites only contain thin shims and config — the actual implementations are shared.

For site-specific files (page layouts, custom components), options are:

- **Manual cherry-pick** — copy the specific improvement into the existing site
- **Full re-generation** — re-run create-site with the existing project file (preserves content, gets new structure)
