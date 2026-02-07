# @platform/intake-system

Multi-channel customer intake system for the Local Business Platform. Collects business information, validates it, and produces structured project files that drive automated site generation.

## Why This Exists

Creating a new client site requires collecting a lot of data: business name, phone, services offered, service areas, brand colors, content for each page. Doing this manually is slow and error-prone. The intake system standardizes this process across multiple channels (chat, web form, API) and validates everything against schemas so the site generation tool always gets clean data.

## Architecture

The package has four subsystems, each independently importable:

```
@platform/intake-system
├── /schemas           → Zod schemas for project file validation
├── /chat-intake       → Claude-powered conversational intake
├── /theme-extraction  → Brand color extraction from images/websites
└── (root)             → Re-exports everything + industry templates
```

### Schemas (`@platform/intake-system/schemas`)

Defines the `ProjectFile` structure and validates it with Zod. A project file is the complete data package needed to generate a site.

```typescript
import { validateProjectFile, createProjectFile } from "@platform/intake-system/schemas";

// Validate existing data
const result = validateProjectFile(data);
if (!result.success) {
  console.log(result.error.issues);
}

// Create with defaults applied
const project = createProjectFile({
  metadata: { projectName: "smiths-electrical", businessType: "electrical" },
  business: { name: "Smith's Electrical", phone: "01223 456789" },
  // ...
});
```

Key schemas: `ProjectFileSchema`, `ServiceDefinitionSchema`, `LocationDefinitionSchema`, `ColorPaletteSchema`, `ThemeSchema`, `AddressSchema`, `BusinessHoursSchema`.

### Industry Templates

Pre-built defaults for common business types. Applying a template pre-fills services, FAQs, and content structures appropriate for the industry.

```typescript
import { getIndustryTemplate, industryTemplates } from "@platform/intake-system";

const template = getIndustryTemplate("plumbing");
// Returns: { services: [...], defaultFaqs: [...], contentSuggestions: [...] }

// Available templates:
// scaffolding, plumbing, electrical, cleaning, hvac
```

### Chat Intake (`@platform/intake-system/chat-intake`)

System prompts and tool definitions for a Claude-powered intake conversation. An AI agent uses these to collect business data through natural dialogue, validating in real-time.

```typescript
import { INTAKE_SYSTEM_PROMPT, INTAKE_TOOLS } from "@platform/intake-system/chat-intake";

// INTAKE_SYSTEM_PROMPT: Sets up Claude as an intake agent
// INTAKE_TOOLS: Tool definitions Claude can call:
//   - getIndustryTemplateTool() → suggest services based on business type
//   - validateProjectSectionTool() → validate data quality in real-time
//   - suggestBrandColorsTool() → generate color palette from preferences
//   - formatServicesTool() → structure service definitions for the project file
```

### Theme Extraction (`@platform/intake-system/theme-extraction`)

Analyzes images or websites to extract brand colors and generate theme configurations.

```typescript
import {
  extractColorsFromImage,
  generateThemeFromWebsite,
  checkContrast,
} from "@platform/intake-system/theme-extraction";

// Extract dominant colors from a logo
const colors = await extractColorsFromImage("./logo.png");

// Analyze an existing website's color scheme
const theme = await generateThemeFromWebsite("https://existing-site.com");

// Verify contrast meets WCAG AA
const passes = checkContrast("#ffffff", "#3b82f6"); // true (4.5:1+)
```

## How It Fits in the Pipeline

```
Client contact
    ↓
Intake (chat/form/API) → uses schemas + templates + theme extraction
    ↓
Validated ProjectFile JSON
    ↓
tools/create-site-from-project.ts → consumes project file
    ↓
New site in sites/ directory
```

See [How Site Creation Works](../../docs/architecture/HOW_SITE_CREATION_WORKS.md) for the full pipeline documentation.

## Build

```bash
pnpm build    # Uses tsup → outputs CJS + ESM to dist/
```

The package builds with `tsup` to dual-format (CommonJS + ESM) with TypeScript definitions. `sharp` is kept as an external dependency (native binary for image processing).

## Development

Source is in `src/`. Each subsystem has its own directory with an `index.ts` entry point. The root `src/index.ts` re-exports everything.
