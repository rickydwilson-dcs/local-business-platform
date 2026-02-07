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
- **Lib utilities** — content readers, MDX loader, schema definitions

When creating a new site, the tool copies base-template and replaces the config values. The dynamic routing, components, and utilities carry over unchanged.

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
4. **Generates MDX content files** — one `.mdx` per service and location, with frontmatter populated from the project file
5. **Updates `package.json`** with the new site name
6. **Runs validation** to ensure all generated content passes schema checks

```bash
npx tsx tools/create-site-from-project.ts --project tools/examples/sample-project.json
```

## What Gets Customized vs What's Shared

| Customized per site                             | Shared across all sites                      |
| ----------------------------------------------- | -------------------------------------------- |
| `site.config.ts` (business info, nav, features) | `packages/core-components` (UI components)   |
| `theme.config.ts` (brand colors, typography)    | `packages/theme-system` (theming engine)     |
| `content/` (all MDX files)                      | Dynamic route handlers (`[slug]/page.tsx`)   |
| `public/` (favicon, images)                     | Content reading utilities (`lib/content.ts`) |
| Vercel project config                           | MDX rendering (`lib/mdx.tsx`)                |
| Domain/DNS                                      | Zod validation schemas                       |

## After Creation

Once a new site exists in `sites/`:

1. **Run `pnpm install`** from root — registers the new workspace
2. **Run `pnpm build`** — Turborepo includes the new site
3. **Create Vercel project** — `vercel link` in the site directory
4. **Configure domain** — in Vercel dashboard
5. **Deploy** via the standard git workflow (develop → staging → main)

## Updating Base Template

When base-template improves (new component, better routing, bug fix), existing sites don't automatically get the change. Options:

- **Manual cherry-pick** — copy the specific improvement into the existing site
- **Full re-generation** — re-run create-site with the existing project file (preserves content, gets new structure)
- **Shared packages** — improvements to `core-components` or `theme-system` apply to all sites automatically on next build

The long-term goal is to minimize site-specific code so most improvements flow through shared packages.
