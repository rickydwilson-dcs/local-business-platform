# YOLO Implementation Brief: Pipeline Prompt Fixes — Inline Styles, Placeholders, Font Loading, Section Markers

**Branch:** feature/design-brief-pipeline (already exists — continue on it)
**Session spec:** output/sessions/2026-04/2026-04-17_pipeline-prompt-fixes/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

After the first real navagarden.hu pipeline run with the impeccable skill, three prompt engineering gaps were identified in the generated components: (1) Claude outputs `style={{ fontFamily, fontSize, letterSpacing }}` on nearly every text element despite being told to use Tailwind; (2) default prop values use external Unsplash URLs that will fail behind the platform's CSP; (3) the scaffolded test site has no font `<link>` so custom fonts fall back to system fonts, making visual comparison meaningless. A fourth issue — Claude sometimes emits `// SECTION: id` line comments instead of `{/* SECTION: id */}` JSX comments — is handled by the normalizer but should be fixed at the source.

All fixes are targeted prompt-string and scaffolding changes. No schema, compiler, or type architecture changes.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | /                      | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | /                      | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | /                      | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git branch --show-current   # must be feature/design-brief-pipeline
pnpm type-check             # must be clean before starting
```

STOP if branch is wrong or type-check fails.

---

## Phase 1: Read all target files in parallel

**Goal:** Read all 4 files that will be edited before making any changes.
**Model:** n/a (reads only)

Read these files in parallel (single message, multiple Read calls):

- `tools/lib/design-skills/shared-constraints.ts`
- `tools/lib/design-brief-generator.ts`
- `tools/lib/design-skills/adapters/impeccable-adapter.ts`
- `tools/lib/design-skills/adapters/generic-adapter.ts`

No edits in this phase. Just read and understand before proceeding.

---

## Phase 2: Fix prompt constraints — typography rule, placeholder src, section markers

**Goal:** Add Typography Rule (ban inline `style={{}}`), ban external placeholder URLs, and strengthen section marker instruction in `shared-constraints.ts`. Update the inline generation instruction in both adapters.
**Model:** sonnet

### 2a. Edit `tools/lib/design-skills/shared-constraints.ts`

**Change 1 — Add Typography Rule block** in `buildConstraintsBlock()`, immediately after the existing `### Color Rule` block (which ends with "Every color decision must map to a token class above"):

Add this new block:

```
### Typography Rule
NEVER use inline \`style={{}}\` for typography. Use token classes only:
- Font sizes: \`text-h1\`, \`text-h2\`, \`text-h3\`, \`text-h4\`, \`text-hero\`, \`text-body\`, \`text-small\`, \`text-caption\`
- Font families: use \`font-sans\` / \`font-heading\` Tailwind classes — NEVER \`style={{ fontFamily: "..." }}\`
- Letter spacing / line height: use Tailwind utilities (\`tracking-widest\`, \`leading-snug\`) — NEVER inline style
- Acceptable \`style={{}}\` uses ONLY: geometry (\`clipPath\`), CSS custom property injection (\`style={{ '--var': val }}\`)
```

**Change 2 — Update `buildTypographyBlock()`**: append one sentence to the string it returns, after the type scale block:

```
Apply all of the above as \`className\` token classes (e.g. \`text-h1\`, \`text-body\`, \`font-heading\`) — never as inline \`style={{ fontSize, fontFamily, letterSpacing }}\`.
```

**Change 3 — Add placeholder src ban** in `buildLayoutConstraintsBlock()`, append to the image containers bullet (after the closing backtick of the `<div>` example):

```
  For placeholder \`src\` values, always use \`/images/placeholder.jpg\` — NEVER external URLs (Unsplash, picsum.photos, or any CDN). Default prop values must use the local path.
```

**Change 4 — Strengthen section markers block** in `buildConstraintsBlock()`. Replace the current `### Section Markers` block with:

```
### Section Markers (REQUIRED — exact format)
Wrap each section in JSX comment markers for extraction. The format is non-negotiable:
\`\`\`tsx
{/* SECTION: section-id */}
export function SectionName(...) { ... }
{/* SECTION: next-section-id */}
\`\`\`
REQUIRED: Use JSX block comments \`{/* ... */}\` — NOT JS line comments (\`// SECTION: id\`).
Do NOT use \`// ====\` separators or any variant. Only \`{/* SECTION: slug */}\` is valid.
Slug must be lowercase-kebab-case matching the blueprint section ID.
```

### 2b. Edit `tools/lib/design-skills/adapters/impeccable-adapter.ts`

Find the line:

```typescript
generationInstructions.push("Wrap each section with {/* SECTION: section-id */} markers.");
```

Replace with:

```typescript
generationInstructions.push(
  "REQUIRED: Wrap each section with {/* SECTION: section-id */} JSX comment markers (not JS line comments // SECTION: id)."
);
```

### 2c. Edit `tools/lib/design-skills/adapters/generic-adapter.ts`

Find the line:

```typescript
generationLines.push("Wrap each section with {/* SECTION: section-id */} markers.");
```

Replace with:

```typescript
generationLines.push(
  "REQUIRED: Wrap each section with {/* SECTION: section-id */} JSX comment markers (not JS line comments // SECTION: id)."
);
```

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

Commit:

```bash
git commit -m "$(cat <<'EOF'
fix(pipeline): ban inline styles/external images, strengthen section markers

- Add Typography Rule to buildConstraintsBlock() banning style={{fontFamily,fontSize}}
- Update buildTypographyBlock() to instruct use of className token classes only
- Add placeholder src ban to buildLayoutConstraintsBlock() — /images/placeholder.jpg only
- Strengthen Section Markers instruction to require JSX {/* */} not JS // comments
- Update generation instruction in impeccable-adapter.ts and generic-adapter.ts

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Add font loading to generated test site layout.tsx

**Goal:** After generation, the pipeline writes a `layout.tsx` to the test site that includes Google Fonts `<link>` tags for any font present in `brief.typography.fontFamily` that is on Google Fonts. Commercial/unknown fonts get an HTML comment noting they are not loaded.
**Model:** sonnet

### 3a. Read `tools/lib/design-brief-generator.ts` in full before editing (already done in Phase 1).

### 3b. Add a private helper function and call site in `tools/lib/design-brief-generator.ts`

Add the following private helper function near the top of the file (after imports, before `generateFromBrief`):

```typescript
// Fonts known to be available on Google Fonts (extend as needed)
const GOOGLE_FONTS = new Set([
  "Work Sans",
  "Inter",
  "Outfit",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Playfair Display",
  "Raleway",
  "Source Sans 3",
  "Nunito",
  "Poppins",
  "DM Sans",
  "DM Serif Display",
  "Josefin Sans",
  "Cormorant Garamond",
]);

function buildGoogleFontsUrl(fontNames: string[]): string | null {
  const googleFontNames = fontNames.filter((f) => GOOGLE_FONTS.has(f));
  if (googleFontNames.length === 0) return null;
  const families = googleFontNames
    .map((f) => `family=${f.replace(/ /g, "+")}:ital,wght@0,300;0,400;0,500;0,600;0,700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

function writeTestSiteLayout(
  themeName: string,
  typography: DesignBrief["typography"],
  repoRoot: string
): void {
  const testSiteDir = path.join(repoRoot, "sites", `${themeName}-test`);
  if (!fs.existsSync(testSiteDir)) return; // no test site scaffolded yet — skip

  const layoutPath = path.join(testSiteDir, "app", "layout.tsx");

  // Derive registry export name: navagarden → navagardenRegistry, dj-fox → djFoxRegistry
  const camelName = themeName.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
  const registryName = `${camelName}Registry`;

  // Collect all font names from the brief
  const allFonts = [
    ...(typography.fontFamily.sans ?? []),
    ...(typography.fontFamily.heading ?? []),
  ];
  const uniqueFonts = [...new Set(allFonts.filter(Boolean))];

  const googleFontsUrl = buildGoogleFontsUrl(uniqueFonts);
  const nonGoogleFonts = uniqueFonts.filter((f) => !GOOGLE_FONTS.has(f));

  const headLinks: string[] = [];
  if (googleFontsUrl) {
    headLinks.push(`    <link rel="preconnect" href="https://fonts.googleapis.com" />`);
    headLinks.push(
      `    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />`
    );
    headLinks.push(`    <link href="${googleFontsUrl}" rel="stylesheet" />`);
  }
  for (const font of nonGoogleFonts) {
    headLinks.push(`    {/* NOTE: ${font} is a commercial font — system fallback active */}`);
  }

  const hasHead = headLinks.length > 0;

  const layoutContent = `import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/site.config';
import { ThemeProvider } from '@platform/core-components';
import { ${registryName} } from '@platform/themes/${themeName}';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: \`%s | \${siteConfig.name}\`,
  },
  description: siteConfig.tagline,
  metadataBase: new URL(siteConfig.url),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
${hasHead ? `      <head>\n${headLinks.join("\n")}\n      </head>\n` : ""}\
      <body className="min-h-screen bg-surface-background text-surface-foreground">
        <ThemeProvider theme="${themeName}" registry={${registryName}}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
`;

  fs.writeFileSync(layoutPath, layoutContent, "utf-8");
  console.log(`[font-loader] Wrote layout.tsx with fonts: ${uniqueFonts.join(", ")}`);
}
```

Then, at the end of `generateFromBrief()` (after `scaffoldThemePackage()` succeeds, before `return results`), add:

```typescript
// Write test site layout with font loading if a test site exists
const repoRoot = path.resolve(__dirname, "../..");
writeTestSiteLayout(options.themeName, options.brief.typography, repoRoot);
```

**Important:** The `DesignBrief` type import should already be at the top of the file. Verify `DesignBrief` is imported from `"./design-brief-types"` — if not, add it.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

Commit:

```bash
git commit -m "$(cat <<'EOF'
fix(pipeline): write test site layout.tsx with Google Fonts link after generation

Add writeTestSiteLayout() helper to design-brief-generator.ts:
- Checks brief.typography.fontFamily against a Google Fonts allowlist
- Builds a Google Fonts CSS URL for known fonts
- Adds HTML comment for commercial/unknown fonts (no link tag)
- Writes sites/{name}-test/app/layout.tsx if the test site directory exists
- Called automatically at end of generateFromBrief() after scaffoldThemePackage()

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Final verification

**Goal:** Confirm type-check is clean and prompt changes appear correctly.
**Model:** haiku

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

Also verify the new rules appear in the built prompt:

```bash
npx tsx -e "
async function main() {
  const { getAdapter } = await import('./tools/lib/design-skills/adapter-registry.js');
  const adapter = getAdapter('impeccable');
  // Build a minimal mock brief just to get the system prompt
  const mockBrief = {
    constraints: { tokenOnlyStyling: true, rscByDefault: true, noThemeFunctionInCss: true, imagePlaceholderStrategy: 'aspect-ratio-with-muted-bg', minTextContainerWidth: 'max-w-sm', flexChildMinWidth: true, testimonialMinWidth: '60%' },
    palette: { brand: { primary: '#000', primaryHover: '#000', secondary: '#000', accent: '#000', onPrimary: '#fff' }, surface: { background: '#fff', foreground: '#000', muted: '#eee', card: '#fff', cardBorder: '#ccc', secondaryForeground: '#000', mutedForeground: '#666', tertiaryForeground: '#666', subtle: '#f5f5f5', subtleBorder: '#ddd', inverse: '#000', inverseMutedForeground: '#999' }, semantic: { success: '#0f0', warning: '#ff0', error: '#f00', info: '#00f' }, overlay: { dark: 'rgba(0,0,0,0.7)', light: 'rgba(255,255,255,0.8)', primary: 'rgba(0,0,0,0.8)' } },
    typography: { fontFamily: { sans: ['Work Sans'], heading: ['Audrey'] }, headingWeight: 400, headingStyle: 'normal', bodyWeight: 300, scale: {} },
    layout: { heroPattern: { type: 'split', hasBackgroundImage: false, headerDark: false }, spacingDensity: 'standard', containerWidth: '1280px', sectionPaddingY: '80px' },
    componentVariants: { heroVariant: 'split', headerVariant: 'light', headerStyle: 'minimal', cardVariant: 'standard', sectionVariant: 'standard', buttonRadius: 'none', cardRadius: 'none', cardShadow: 'none' },
    visualTone: { description: 'test', antiPatterns: [], designSkillHints: { variance: 5, density: 5, motion: 5 }, referenceDescription: 'test' },
    pageBlueprints: [],
    reference: { url: 'https://example.com', screenshots: {}, capturedAt: new Date().toISOString() },
    meta: { version: '1', themeName: 'test', generatedAt: new Date().toISOString(), sourceUrl: 'https://example.com' }
  };
  const page = { pageType: 'home', sections: [] };
  const { systemPrompt, userPrompt } = adapter.buildPagePrompt(mockBrief as never, page as never, { includeHeader: false, includeFooter: false });
  console.log('Typography Rule present:', systemPrompt.includes('Typography Rule') ? 'PASS' : 'FAIL');
  console.log('placeholder.jpg present:', userPrompt.includes('placeholder.jpg') ? 'PASS' : 'FAIL');
  console.log('JSX marker instruction:', userPrompt.includes('JSX comment markers') ? 'PASS' : 'FAIL');
}
main().catch(console.error);
" 2>&1
```

All three must print PASS. STOP if any print FAIL.

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                   | File overlap      | Model | Rationale                                            |
| ----- | ------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------- | ----- | ---------------------------------------------------- |
| G1    | Phase 1 | Read `shared-constraints.ts`, Read `design-brief-generator.ts`, Read `impeccable-adapter.ts`, Read `generic-adapter.ts` | none (reads only) | n/a   | Independent reads — batch in one message             |
| G2    | Phase 2 | Edit `impeccable-adapter.ts` (2b), Edit `generic-adapter.ts` (2c)                                                       | none              | haiku | Both are single-line find-replace, independent files |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                   | Reason                                                        |
| -------------------------------------- | ------------------------------------------------------------- |
| Phase 2a before 2b/2c                  | Adapters import from shared-constraints — edit source first   |
| Verification gates (`pnpm type-check`) | Each phase's output gates the next                            |
| Git commits                            | One commit per phase, in order                                |
| Phase 3 after Phase 2                  | Font loader references `DesignBrief` type — needs clean build |

---

## Cost Estimate

| Phase                        | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Read files          | n/a    | ~6k               | 0                  | $0.00      |
| Phase 2: Prompt constraints  | sonnet | ~8k               | ~1.5k              | ~$0.05     |
| Phase 3: Font loading helper | sonnet | ~10k              | ~2k                | ~$0.06     |
| Phase 4: Verification        | haiku  | ~4k               | ~0.5k              | ~$0.01     |
| **Total**                    |        | **~28k**          | **~4k**            | **~$0.12** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Type-check status — confirm `pnpm type-check` passes
3. Prompt verification results — all three PASS lines from Phase 4
4. Any exceptions or deviations from the plan
5. Token usage estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    |                   |                    | $X.XX     |
   | haiku     |                   |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-17_pipeline-prompt-fixes/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-04-17
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

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
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Items NOT listed in any group run sequentially.**
- **Never parallelise across phase boundaries.**
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits
- The Co-Authored-By line in commits must reflect the orchestrator model: `Claude Sonnet 4.6`

## Completed

**Date:** 2026-04-17
**Status:** All phases executed successfully

All four prompt-engineering fixes were applied to the pipeline. Phase 2 added a Typography Rule block (banning inline `style={{}}`) to `buildConstraintsBlock()`, updated `buildTypographyBlock()` to instruct token-class usage, added a `/images/placeholder.jpg` ban on external placeholder URLs in `buildLayoutConstraintsBlock()`, and strengthened the Section Markers instruction to require JSX `{/* */}` comments. Phase 2b/2c updated both adapters' generation instructions. Phase 3 added a `writeTestSiteLayout()` helper to `design-brief-generator.ts` that writes a `layout.tsx` with Google Fonts `<link>` tags derived from `brief.typography.fontFamily`. One deviation: a parallel Python write race condition lost the Typography Rule block from the Phase 2 commit; it was caught and re-applied in a follow-up commit before the session ended.

### Commits

- `f655074` — fix(pipeline): ban inline styles/external images, strengthen section markers
- `fe853c8` — fix(pipeline): write test site layout.tsx with Google Fonts link after generation
- `f2cbb26` — fix(pipeline): add missing Typography Rule block to buildConstraintsBlock
