# AI Image Generation Pipeline - User Stories

**Epic:** AI Image Generation Pipeline for Card Images
**Branch:** `feature/image-generation-utility`
**Total Points:** 29
**Total Images:** 444 (111 specialist + 333 service cards)

---

## Backlog Summary

| ID      | Story                           | Priority | Points | Status  |
| ------- | ------------------------------- | -------- | ------ | ------- |
| IMG-006 | Component getImageUrl Fix       | Critical | 2      | Pending |
| IMG-002 | Shared TypeScript Types         | High     | 1      | Pending |
| IMG-001 | Image Manifest Generator        | High     | 5      | Pending |
| IMG-003 | Gemini AI Image Generator       | High     | 8      | Pending |
| IMG-004 | R2 Upload Tool                  | High     | 3      | Pending |
| IMG-005 | MDX Image Field Updater         | High     | 5      | Pending |
| IMG-007 | Package Scripts & Documentation | Medium   | 2      | Pending |
| IMG-008 | End-to-End Pipeline Test        | Medium   | 3      | Pending |

---

## USER STORY: IMG-001

### Image Manifest Generator

**Priority:** High | **Points:** 5 | **Type:** Feature

**Story:**
As a developer,
I want to run a CLI tool that scans all MDX files and generates a manifest of required images with AI prompts,
So that I have a complete inventory of images needed and can track generation progress.

**Acceptance Criteria:**

- [ ] Tool scans all 37 location MDX files and extracts specialist cards (3 per file) and service cards (9 per file)
- [ ] Generates unique, descriptive R2 key names following convention: `colossus-reference/cards/{type}/{slug}/{card-slug}.webp`
- [ ] Creates AI-friendly prompts using card title, description, and location context
- [ ] Outputs JSON manifest to `output/image-manifest.json` with status tracking
- [ ] Supports `--dry-run` flag for testing without file writes
- [ ] Logs progress and summary statistics

**Technical Notes:**

- File: `tools/generate-image-manifest.ts`
- Uses `gray-matter` for MDX parsing
- Prompt strategy: card title + description + location + scaffolding keywords + style modifiers

**INVEST Checklist:**

- [x] Independent: Can be developed standalone
- [x] Negotiable: Prompt generation strategy can be refined
- [x] Valuable: Creates foundation for entire pipeline
- [x] Estimable: Clear scope with known MDX structure
- [x] Small: Single tool with defined output
- [x] Testable: Output can be validated against MDX content

---

## USER STORY: IMG-002

### Shared TypeScript Types

**Priority:** High | **Points:** 1 | **Type:** Technical

**Story:**
As a developer,
I want shared TypeScript interfaces for the image manifest schema,
So that all tools have consistent type safety.

**Acceptance Criteria:**

- [ ] Create `tools/lib/manifest-types.ts` with `ImageManifest` and `ImageEntry` interfaces
- [ ] Include all fields: id, type, location, cardTitle, cardDescription, r2Key, dimensions, prompt, status
- [ ] Export types for use across all pipeline tools

**Technical Notes:**

- File: `tools/lib/manifest-types.ts`
- Status enum: `"pending" | "generated" | "uploaded" | "complete" | "error"`

**INVEST Checklist:**

- [x] Independent: Pure type definitions
- [x] Negotiable: Field names can be adjusted
- [x] Valuable: Enables type safety across tools
- [x] Estimable: Small, well-defined scope
- [x] Small: Single file with interfaces
- [x] Testable: TypeScript compilation validates

---

## USER STORY: IMG-003

### Gemini AI Image Generator

**Priority:** High | **Points:** 8 | **Type:** Feature

**Story:**
As a developer,
I want to run a CLI tool that reads the manifest and generates images using Gemini 2.0 Flash API,
So that I can batch-generate professional scaffolding images for all cards.

**Acceptance Criteria:**

- [ ] Reads `output/image-manifest.json` and filters for `status: "pending"`
- [ ] Calls Gemini 2.0 Flash image generation API with prompts
- [ ] Saves generated images to `output/generated-images/{r2Key}` at 800×600px
- [ ] Updates manifest status to `"generated"` after each successful generation
- [ ] Supports `--limit N` for batch processing to manage API costs
- [ ] Supports `--dry-run` to preview API calls without execution
- [ ] Handles API rate limits with exponential backoff
- [ ] Logs progress, success, and errors clearly

**Technical Notes:**

- File: `tools/generate-images-ai.ts`
- Dependency: `@google/generative-ai`
- Environment: `GOOGLE_AI_API_KEY`
- Image dimensions: 800×600px (4:3 aspect ratio)
- Format: WebP

**INVEST Checklist:**

- [x] Independent: Requires only manifest file
- [x] Negotiable: API provider could change
- [x] Valuable: Core image generation capability
- [x] Estimable: API integration is well-defined
- [x] Small: Single responsibility - generate images
- [x] Testable: Can verify with --dry-run mode

---

## USER STORY: IMG-004

### R2 Upload Tool

**Priority:** High | **Points:** 3 | **Type:** Feature

**Story:**
As a developer,
I want to upload generated images to Cloudflare R2,
So that images are served from CDN with optimal performance.

**Acceptance Criteria:**

- [ ] Reads manifest for `status: "generated"` images
- [ ] Uses existing `R2Client` to upload images with correct content-type and cache headers
- [ ] Updates manifest status to `"uploaded"` after successful upload
- [ ] Verifies upload by checking file exists in R2
- [ ] Supports `--dry-run` flag
- [ ] Reports upload progress and final statistics

**Technical Notes:**

- File: `tools/upload-generated-images.ts`
- Reuses: `tools/lib/r2-client.ts`
- Content-Type: `image/webp`
- Cache-Control: `public, max-age=31536000, immutable`

**INVEST Checklist:**

- [x] Independent: Only depends on generated images
- [x] Negotiable: Upload strategy can be batched
- [x] Valuable: Makes images publicly accessible
- [x] Estimable: R2Client already exists
- [x] Small: Single upload operation
- [x] Testable: Can verify uploads in R2 console

---

## USER STORY: IMG-005

### MDX Image Field Updater

**Priority:** High | **Points:** 5 | **Type:** Feature

**Story:**
As a developer,
I want to automatically update MDX files with image references,
So that cards display the newly generated images without manual editing.

**Acceptance Criteria:**

- [ ] Reads manifest for `status: "uploaded"` images
- [ ] Parses MDX frontmatter using `gray-matter`
- [ ] Adds `image: "{r2Key}"` field to corresponding card in specialists.cards or services.cards
- [ ] Preserves all other MDX content and formatting
- [ ] Updates manifest status to `"complete"`
- [ ] Supports `--dry-run` to preview changes
- [ ] Creates backup of original MDX files before modification

**Technical Notes:**

- File: `tools/update-mdx-images.ts`
- Must match cards by title to insert correct image
- Backup files to `output/mdx-backups/` before modification

**INVEST Checklist:**

- [x] Independent: Only depends on uploaded images
- [x] Negotiable: Could be manual or automatic
- [x] Valuable: Eliminates 444 manual edits
- [x] Estimable: gray-matter parsing is straightforward
- [x] Small: Single file modification operation
- [x] Testable: Diff can verify changes

---

## USER STORY: IMG-006

### Component getImageUrl Fix

**Priority:** Critical | **Points:** 2 | **Type:** Bug Fix

**Story:**
As a user,
I want card images to load correctly from R2 CDN,
So that I see professional images on location pages.

**Acceptance Criteria:**

- [ ] Update `large-feature-cards.tsx` line 67 to use `getImageUrl(card.image)`
- [ ] Update `service-showcase.tsx` lines 77 and 207 to use `getImageUrl(service.image)`
- [ ] Import `getImageUrl` from `@/lib/image` in both files
- [ ] Verify images render correctly in development
- [ ] Ensure fallback to gradient/icon still works when no image provided

**Technical Notes:**

- Files:
  - `sites/colossus-reference/components/ui/large-feature-cards.tsx`
  - `sites/colossus-reference/components/ui/service-showcase.tsx`
- Import: `import { getImageUrl } from "@/lib/image"`
- Must handle undefined/null image gracefully

**INVEST Checklist:**

- [x] Independent: No dependencies on other stories
- [x] Negotiable: Implementation is straightforward
- [x] Valuable: Enables images to display
- [x] Estimable: Simple code change
- [x] Small: Two files, few lines each
- [x] Testable: Visual verification in browser

---

## USER STORY: IMG-007

### Package Scripts & Documentation

**Priority:** Medium | **Points:** 2 | **Type:** Documentation

**Story:**
As a developer,
I want npm scripts and documentation for the image pipeline,
So that I can easily run the tools and understand the workflow.

**Acceptance Criteria:**

- [ ] Add scripts to root `package.json`: `images:manifest`, `images:generate`, `images:upload`, `images:update-mdx`, `images:pipeline`
- [ ] Add `GOOGLE_AI_API_KEY` to `.env.example`
- [ ] Update `tools/README.md` with documentation for all new tools
- [ ] Include usage examples and troubleshooting tips

**Technical Notes:**

- Scripts use `tsx` for TypeScript execution
- Pipeline script chains all steps with `&&`

**INVEST Checklist:**

- [x] Independent: Can be done after tools exist
- [x] Negotiable: Script names can vary
- [x] Valuable: Enables easy tool usage
- [x] Estimable: Documentation scope is clear
- [x] Small: Configuration and docs only
- [x] Testable: Scripts can be executed

---

## USER STORY: IMG-008

### End-to-End Pipeline Test

**Priority:** Medium | **Points:** 3 | **Type:** Testing

**Story:**
As a developer,
I want to run the full pipeline with dry-run mode,
So that I can verify the entire workflow before generating real images.

**Acceptance Criteria:**

- [ ] Run `pnpm images:manifest` and verify manifest contains 444 images
- [ ] Run `pnpm images:generate --dry-run --limit 5` and verify API call simulation
- [ ] Run `pnpm images:upload --dry-run` and verify R2 upload simulation
- [ ] Run `pnpm images:update-mdx --dry-run` and verify MDX changes preview
- [ ] Document any issues found and create follow-up tasks

**Technical Notes:**

- All tools must support `--dry-run` flag
- Test with small batch before full run

**INVEST Checklist:**

- [x] Independent: Requires all tools complete
- [x] Negotiable: Test scope can vary
- [x] Valuable: Validates entire pipeline
- [x] Estimable: Testing steps are defined
- [x] Small: Verification only
- [x] Testable: Pass/fail criteria clear

---

## Sprint Planning Recommendation

**Capacity:** 30 points
**Committed:** 29 points (96.7% utilization)

### Execution Order

1. **IMG-006** (Critical, 2pts) - Unblocks image display, no dependencies
2. **IMG-002** (High, 1pt) - Foundation for all tools
3. **IMG-001** (High, 5pts) - Creates manifest for pipeline
4. **IMG-003** (High, 8pts) - Core AI generation
5. **IMG-004** (High, 3pts) - Deploy to CDN
6. **IMG-005** (High, 5pts) - Complete automation
7. **IMG-007** (Medium, 2pts) - Enable team usage
8. **IMG-008** (Medium, 3pts) - Validate everything

### Dependencies

```
IMG-002 (Types) ─┬─> IMG-001 (Manifest) ─> IMG-003 (Generate) ─> IMG-004 (Upload) ─> IMG-005 (MDX)
                 │
IMG-006 (Fix) ───┴─> IMG-007 (Docs) ─> IMG-008 (Test)
```

---

_Generated: 2024-12-06_
_Epic File: [image-generation-epic.json](./image-generation-epic.json)_
