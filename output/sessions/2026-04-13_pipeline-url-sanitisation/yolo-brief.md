# YOLO Implementation Brief: Pipeline URL Sanitisation & Mobile Nav Extraction

**Branch:** feature/pipeline-url-sanitisation (created from develop)
**Session spec:** output/sessions/2026-04-13_pipeline-url-sanitisation/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The extract-theme pipeline's componentize pass preserves clone JSX markup faithfully, but doesn't sanitise external URLs. The result: every generated theme page contains hardcoded links to the original site's domain (e.g. `https://colorcode.events/about/`), third-party attributions (`luminus.agency`), and social media profiles. The content-stripper handles text (business names, phone numbers, headings, paragraphs, images) but has no URL processing at all.

Additionally, the `extractHeaderFooter()` regex only matches `<header>` and `<footer>` tags, but Breakdance's mobile navigation lives inside a `<div class="bde-popup-*">` / `<nav class="breakdance-menu">` section at the bottom of each page. This nav drawer is duplicated across all page components with absolute external URLs.

Three pipeline fixes needed:

1. **Content stripper** — add URL sanitisation: convert clone domain URLs to relative paths, neutralise third-party URLs (social media, agency credits)
2. **Extract-theme componentize pass** — extract the mobile nav/popup section from page bodies (like header/footer extraction)
3. **CSS preprocessor** — strip clone domain URLs from CSS (font `@font-face src` pointing to the clone's wp-content)

The source domain is available at runtime from `output/clones/{name}/meta.json` → `sourceRef`.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/pipeline-url-sanitisation
pnpm type-check   # must be clean before starting
```

**Verify clone exists:**

```bash
test -f output/clones/corvus/meta.json && echo "Clone meta ready" || echo "STOP: No clone meta"
cat output/clones/corvus/meta.json | grep sourceRef
# Should show: "sourceRef": "https://colorcode.events"
```

---

## Phase 1: Add URL sanitisation to content-stripper

**Goal:** Add a new processing step to `stripContent()` that converts clone-domain absolute URLs to relative paths and neutralises third-party URLs.
**Model:** sonnet

### Step 1.1: Read the file

Read `tools/lib/content-stripper.ts` in full.

### Step 1.2: Extend ContentStrippingConfig

Add a `sourceDomain` field to the config interface:

```typescript
export interface ContentStrippingConfig {
  businessName: string;
  phone?: string;
  email?: string;
  address?: { city: string; postcode: string };
  sourceDomain?: string; // e.g. "https://colorcode.events" — clone origin domain
}
```

### Step 1.3: Add URL sanitisation steps to stripContent()

Add these steps AFTER the existing step 7 (image src) and BEFORE the dedup/interface generation:

**Step 8: Convert clone domain URLs to relative paths.**

If `config.sourceDomain` is set, find all `href="https://colorcode.events/..."` and replace with `href="/..."`. This makes navigation links work locally. Handle both with and without trailing slash on the domain. Also handle `src=` attributes pointing to the clone domain (e.g. font files, scripts).

```typescript
// 8. Clone domain URLs → relative paths
if (config.sourceDomain) {
  const domain = config.sourceDomain.replace(/\/$/, ""); // strip trailing slash
  // href="https://colorcode.events/about/" → href="/about/"
  // href="https://colorcode.events" → href="/"
  const domainUrlRe = new RegExp(`(href|src|action)="${escapeRegex(domain)}(/[^"]*)?(")`, "gi");
  result = result.replace(domainUrlRe, (_match, attr, pathPart, close) => {
    return `${attr}="${pathPart || "/"}"`;
  });
}
```

**Step 9: Neutralise social media URLs.**

Replace social media profile URLs with `#` placeholders and convert to props. These are business-specific (each client has their own social profiles).

```typescript
// 9. Social media URLs → props
const socialPatterns = [
  { re: /href="https?:\/\/(www\.)?facebook\.com\/[^"]+"/gi, prop: "facebookUrl" },
  { re: /href="https?:\/\/(www\.)?instagram\.com\/[^"]+"/gi, prop: "instagramUrl" },
  { re: /href="https?:\/\/(www\.)?twitter\.com\/[^"]+"/gi, prop: "twitterUrl" },
  { re: /href="https?:\/\/(www\.)?x\.com\/[^"]+"/gi, prop: "xUrl" },
  { re: /href="https?:\/\/(www\.)?linkedin\.com\/[^"]+"/gi, prop: "linkedinUrl" },
  { re: /href="https?:\/\/(www\.)?youtube\.com\/[^"]+"/gi, prop: "youtubeUrl" },
  { re: /href="https?:\/\/(www\.)?tiktok\.com\/[^"]+"/gi, prop: "tiktokUrl" },
];

for (const { re, prop } of socialPatterns) {
  if (re.test(result)) {
    re.lastIndex = 0; // reset after test
    result = result.replace(re, () => {
      props[prop] = "string";
      return `href={props.${prop} ?? "#"}`;
    });
  }
}
```

**Step 10: Neutralise remaining third-party external URLs.**

Any remaining `href="https://..."` or `href="http://..."` that wasn't caught by steps 8-9 gets replaced with `href="#"`. These are typically agency credits, partner links, etc. that don't belong in the template.

```typescript
// 10. Remaining external URLs → "#" (agency credits, partner links, etc.)
result = result.replace(/href="https?:\/\/[^"]+"/gi, 'href="#"');
```

**Important ordering:** Steps 8 → 9 → 10 must run in this order. Step 8 converts clone domain URLs to relative (keeping them functional). Step 9 converts social media to props. Step 10 catches any remaining external URLs.

### Step 1.4: Verification gate

```bash
# Verification gate — STOP if this fails
npx tsx -e "
  import { stripContent } from './tools/lib/content-stripper.js';
  const result = stripContent(
    '<a href=\"https://colorcode.events/about/\">About</a> <a href=\"https://facebook.com/test\">FB</a> <a href=\"https://luminus.agency\">Luminus</a> <a href=\"/local/\">Local</a>',
    { businessName: 'Test', sourceDomain: 'https://colorcode.events' }
  );
  console.log('Result:', result.tsx);
  console.log('Props:', result.propCount);
  // Should show: href=\"/about/\" for colorcode link (relative)
  // Should show: href={props.facebookUrl ?? \"#\"} for social
  // Should show: href=\"#\" for luminus (external)
  // Should show: href=\"/local/\" unchanged (already relative)
  const hasAbsoluteColorcode = result.tsx.includes('colorcode.events');
  const hasRelativeAbout = result.tsx.includes('href=\"/about/\"');
  const hasFacebookProp = result.tsx.includes('props.facebookUrl');
  const hasNeutralised = result.tsx.includes('href=\"#\"');
  if (hasAbsoluteColorcode) { console.error('FAIL: still has colorcode.events URL'); process.exit(1); }
  if (!hasRelativeAbout) { console.error('FAIL: clone domain URL not converted to relative'); process.exit(1); }
  if (!hasFacebookProp) { console.error('FAIL: social URL not converted to prop'); process.exit(1); }
  if (!hasNeutralised) { console.error('FAIL: external URL not neutralised'); process.exit(1); }
  console.log('Phase 1 PASSED');
"
```

**Commit:**

```bash
git add tools/lib/content-stripper.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): add URL sanitisation to content-stripper

- Convert clone domain absolute URLs to relative paths (step 8)
- Replace social media profile URLs with component props (step 9)
- Neutralise remaining third-party external URLs (step 10)

Source domain read from ContentStrippingConfig.sourceDomain,
populated from clone meta.json sourceRef at runtime.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Wire source domain into extract-theme pipeline

**Goal:** Read the clone's source domain from `meta.json` and pass it to the content stripper. Also add URL sanitisation to the CSS preprocessor.
**Model:** sonnet

### Step 2.1: Read current files

Read these files in parallel:

- `tools/extract-theme.ts` (full)
- `tools/lib/clone-css-preprocessor.ts` (full)
- `output/clones/corvus/meta.json` (to confirm format)

### Step 2.2: Read source domain from meta.json

In `extract-theme.ts`, in the `main()` function, after resolving `cloneDir`, read `meta.json`:

```typescript
// Read clone source domain from meta.json
const metaPath = path.join(cloneDir, "meta.json");
let sourceDomain: string | undefined;
if (fs.existsSync(metaPath)) {
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as { sourceRef?: string };
    if (meta.sourceRef) {
      sourceDomain = meta.sourceRef.replace(/\/$/, ""); // strip trailing slash
      console.log(`[extract] Source domain: ${sourceDomain}`);
    }
  } catch {
    console.log("[extract] Could not read meta.json — URL sanitisation will be limited");
  }
}
```

### Step 2.3: Pass sourceDomain to strip pass

In the strip pass section, add `sourceDomain` to the stripping config:

```typescript
const strippingConfig = {
  businessName: brief?.business.name ?? "",
  phone: brief?.business.phone,
  email: brief?.business.email,
  address: brief?.business.address
    ? { city: brief.business.address.city, postcode: brief.business.address.postcode }
    : undefined,
  sourceDomain, // <-- add this
};
```

### Step 2.4: Add source domain stripping to CSS preprocessor

In `tools/lib/clone-css-preprocessor.ts`, update `PreprocessorConfig`:

```typescript
export interface PreprocessorConfig {
  cloneDir: string;
  themeName: string;
  customProperties?: string;
  inlineCss?: string;
  excludePatterns?: string[];
  sourceDomain?: string; // <-- add this
}
```

In the `sanitiseFile()` function (or in the `preprocessCloneCss()` main function after assembly), add a step that replaces `url(https://colorcode.events/wp-content/...)` references with either:

- The rewritten local path if the file exists in clone assets, OR
- `url(data:,)` if the file doesn't exist locally

Add this as a new step in `sanitiseFile()`, after the existing URL rewriting (step 3), but only for URLs matching the source domain:

```typescript
// 3b. Strip clone-domain remote URLs (e.g. fonts loaded from WP uploads)
if (sourceDomain) {
  const domainRe = new RegExp(
    `url\\(\\s*['"]?(${escapeRegexStr(sourceDomain)}[^)'"]*)['"]?\\s*\\)`,
    "gi"
  );
  content = content.replace(domainRe, (_full, urlValue) => {
    rewrittenUrls++;
    warnings.push(`[${filename}] Stripped clone-domain URL: ${urlValue}`);
    return "url(data:,)";
  });
}
```

Also pass `sourceDomain` through from the config to `sanitiseFile()`.

### Step 2.5: Pass sourceDomain to preprocessor in extract-theme.ts

In the componentize pass where `preprocessCloneCss()` is called, add `sourceDomain`:

```typescript
const preprocessResult = await preprocessCloneCss({
  cloneDir,
  themeName,
  customProperties: customPropsBlock || undefined,
  inlineCss: dedupedInlineCss || undefined,
  sourceDomain, // <-- add this
});
```

### Step 2.6: Verification gate

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -10
echo "Phase 2 PASSED"
```

**Commit:**

```bash
git add tools/extract-theme.ts tools/lib/clone-css-preprocessor.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): wire source domain into extract-theme and CSS preprocessor

- Read clone source domain from meta.json sourceRef
- Pass sourceDomain to content-stripper config (for URL sanitisation)
- Pass sourceDomain to CSS preprocessor (strips clone-domain font URLs)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Extract mobile nav/popup from page bodies

**Goal:** The Breakdance mobile navigation drawer lives in a `<div class="breakdance">` wrapper containing a `<div class="bde-popup-*">` at the bottom of each page component. Extract it during componentize (like header/footer extraction) so it's not duplicated across every page.
**Model:** sonnet

### Step 3.1: Understand the pattern

Read `packages/themes/corvus/pages/HomePage.tsx` from line 800 to end to see the mobile nav structure. The pattern is:

```jsx
{/* ... main page content above ... */}
      </section>
      <div className="breakdance">
        <div className="bde-popup-85-100 bde-popup">
          <div className="breakdance-popup" data-breakdance-popup-id="85">
            <div className="breakdance-popup-content">
              {/* ... popup/nav content ... */}
            </div>
            <div className="breakdance-popup-close-button ...">
              {/* ... close button ... */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

This section is repeated in every page component.

### Step 3.2: Add popup/nav extraction to extractHeaderFooter()

In `tools/extract-theme.ts`, update `extractHeaderFooter()` to also find and strip the mobile nav popup section. The reliable marker is a `<div>` with class containing `bde-popup` nested inside a `<div className="breakdance">`.

Add a new extraction step — find the `<div className="breakdance">` block that contains `bde-popup` and remove it from the page body. This block is typically the last major element before the closing `</>`.

A regex approach for this (since the existing code uses regex for header/footer):

```typescript
// Find the Breakdance popup/mobile-nav wrapper: <div className="breakdance">..bde-popup..</div>
// This is typically at the end of the page, containing the mobile navigation drawer.
// We strip it because it contains external URLs and is duplicated across all pages.
const popupRe =
  /<div\s+className="breakdance">\s*<div\s+className="[^"]*bde-popup[^"]*[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
```

Actually, matching nested divs with regex is fragile. A better approach: scan backwards from the end of the JSX for the `<div className="breakdance">` that contains `bde-popup`, then use brace/tag counting to find the matching close. However, since this is JSX and the pattern is consistent across Breakdance clones, a simpler approach works:

Find the last occurrence of `<div className="breakdance">` in the page body. Everything from that point to the matching `</div>` (tracking depth) is the popup section. Remove it.

```typescript
function stripPopupNav(jsx: string): string {
  // Find the last <div className="breakdance"> that contains bde-popup
  const marker = 'className="breakdance">';
  let lastIdx = jsx.lastIndexOf(marker);
  if (lastIdx === -1) return jsx;

  // Walk back to the opening < of this div
  while (lastIdx > 0 && jsx[lastIdx] !== "<") lastIdx--;

  // Check that this block contains bde-popup (not just any "breakdance" class div)
  const preview = jsx.slice(lastIdx, Math.min(lastIdx + 500, jsx.length));
  if (!preview.includes("bde-popup")) return jsx;

  // Walk forward tracking div depth to find the matching </div>
  let depth = 0;
  let pos = lastIdx;
  let endPos = -1;

  while (pos < jsx.length) {
    if (jsx.startsWith("<div", pos) && (jsx[pos + 4] === " " || jsx[pos + 4] === ">")) {
      depth++;
      pos += 4;
    } else if (jsx.startsWith("</div>", pos)) {
      depth--;
      if (depth === 0) {
        endPos = pos + 6; // past </div>
        break;
      }
      pos += 6;
    } else {
      pos++;
    }
  }

  if (endPos === -1) return jsx; // couldn't match — leave unchanged

  // Remove the popup block
  return jsx.slice(0, lastIdx) + jsx.slice(endPos);
}
```

### Step 3.3: Call stripPopupNav in the componentize pass

In the componentize pass, after `extractHeaderFooter()` strips header/footer from all pages, add a call to strip the popup nav:

```typescript
// Strip mobile nav popup from ALL pages (duplicated Breakdance widget)
for (const [pageName, page] of Object.entries(clonePages)) {
  const stripped = stripPopupNav(page.jsxBody);
  clonePages[pageName] = { css: page.css, jsxBody: stripped };
}
```

This goes AFTER the existing header/footer extraction loop (around line 591-594).

### Step 3.4: Also strip the embedded footer from page bodies

Looking at the HomePage, lines 660-800 contain a full site footer (with nav columns, logo, copyright, social icons) embedded in the page body — separate from the `<footer>` tag. This is because Breakdance builds the footer as a `<section>` inside the page, not as a `<footer>` element.

The existing `extractHeaderFooter()` only matches `<footer>` tags, missing this Breakdance pattern. The embedded footer section typically has unique identifiers like class names containing section IDs (e.g. `bde-section-40-100`) and contains copyright text (`©`), social icons (`bde-social-icons`), and "Website by" credits.

Rather than trying to regex-extract this (fragile), leave it for the strip pass — the content stripper's new URL sanitisation (Phase 1) will convert the colorcode.events links to relative paths and neutralise the social media + agency links. This is good enough — the footer section becomes a template-ready block with parameterised URLs.

### Step 3.5: Verification gate

```bash
# Verification gate — STOP if this fails

# Regenerate corvus theme to test the extraction
npx tsx tools/extract-theme.ts --clone corvus --pass componentize 2>&1 | tail -20

# Check that bde-popup is NOT in the page components
POPUP_COUNT=$(grep -r "bde-popup" packages/themes/corvus/pages/ | wc -l)
echo "bde-popup occurrences in pages: $POPUP_COUNT"
[ "$POPUP_COUNT" -eq 0 ] && echo "Popup stripped — OK" || echo "WARN: popup still in pages ($POPUP_COUNT lines)"

# Check HomePage line count decreased (popup section is ~200 lines)
LINES=$(wc -l < packages/themes/corvus/pages/HomePage.tsx)
echo "HomePage.tsx: $LINES lines"
[ "$LINES" -lt 1000 ] && echo "Reduced — OK" || echo "WARN: still large ($LINES lines)"

pnpm type-check 2>&1 | tail -5
echo "Phase 3 PASSED"
```

**Commit:**

```bash
git add tools/extract-theme.ts packages/themes/corvus/
git commit -m "$(cat <<'EOF'
feat(pipeline): strip Breakdance popup/mobile-nav from page bodies

The Breakdance mobile navigation drawer (<div class="breakdance">
containing bde-popup) was duplicated in every page component with
hardcoded external URLs. Now stripped during componentize pass,
similar to header/footer extraction.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: End-to-end pipeline test with strip pass

**Goal:** Run the full pipeline (componentize + strip) on corvus to verify URL sanitisation works end-to-end.
**Model:** sonnet

### Step 4.1: Clean and regenerate

```bash
# Clean corvus theme (keep test site structure)
rm -rf packages/themes/corvus/

# Run full pipeline: componentize then strip
npx tsx tools/extract-theme.ts --clone corvus --pass both 2>&1 | tail -30
```

### Step 4.2: Verify URL sanitisation

```bash
# Check for external colorcode.events URLs in generated pages
CC_COUNT=$(grep -r "colorcode\.events" packages/themes/corvus/pages/ | wc -l)
echo "colorcode.events URLs in pages: $CC_COUNT"
[ "$CC_COUNT" -eq 0 ] && echo "Domain URLs stripped — OK" || echo "FAIL: still has colorcode.events URLs"

# Check for social media URL props
grep -c "props\.facebookUrl\|props\.instagramUrl\|props\.xUrl\|props\.linkedinUrl" packages/themes/corvus/pages/HomePage.tsx || echo "0 social props"

# Check for neutralised external URLs (luminus.agency etc.)
EXTERNAL_COUNT=$(grep -r 'href="https\?://' packages/themes/corvus/pages/ | grep -v 'xmlns' | wc -l)
echo "Remaining external href URLs in pages: $EXTERNAL_COUNT"
[ "$EXTERNAL_COUNT" -eq 0 ] && echo "All external URLs neutralised — OK" || echo "WARN: $EXTERNAL_COUNT external URLs remain"

# Check clone-domain URLs in CSS
CSS_DOMAIN=$(grep -c "colorcode\.events" packages/themes/corvus/clone-styles.css || echo "0")
echo "colorcode.events in CSS: $CSS_DOMAIN"

# Check popup nav stripped
POPUP_COUNT=$(grep -r "bde-popup" packages/themes/corvus/pages/ | wc -l)
echo "bde-popup in pages: $POPUP_COUNT"
```

### Step 4.3: Redeploy to test site

```bash
# Re-run componentize to deploy updated assets to test site
npx tsx tools/extract-theme.ts --clone corvus --pass componentize 2>&1 | tail -10
# Then strip
npx tsx tools/extract-theme.ts --clone corvus --pass strip 2>&1 | tail -10
```

Wait — the `both` pass in step 4.1 should have done both. But the test site deploy only happens in the componentize pass. Since we ran `--pass both` which does componentize then strip in sequence, the test site should have the stripped versions. Verify:

```bash
# Check test site pages for external URLs
CC_SITE=$(grep -r "colorcode\.events" sites/_corvus-digital-marketing-events/ --include="*.tsx" | grep -v node_modules | grep -v .next | wc -l)
echo "colorcode.events in test site: $CC_SITE"
```

Actually, the strip pass modifies `packages/themes/corvus/pages/*.tsx` in place but the site imports from the theme package directly via `@platform/themes/corvus/pages`, so the site gets the stripped versions automatically. No need to redeploy.

### Step 4.4: Dev server smoke test

```bash
# Kill any existing dev servers
lsof -ti :3000 | xargs kill -9 2>/dev/null || true

cd sites/_corvus-digital-marketing-events && npx next dev &
DEV_PID=$!
sleep 20

# Check page renders
curl -s http://localhost:3000 > /tmp/corvus-check.html 2>/dev/null

# Check no colorcode.events in rendered HTML
CC_RENDERED=$(grep -c "colorcode\.events" /tmp/corvus-check.html || echo "0")
echo "colorcode.events in rendered HTML: $CC_RENDERED"

# Check clone CSS still loads
CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/clone-assets/corvus/styles/clone.css 2>/dev/null || echo "000")
echo "Clone CSS HTTP status: $CSS_STATUS"

kill $DEV_PID 2>/dev/null
cd /Users/rickywilson/Sites/local-business-platform
```

### Step 4.5: Verification gate

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -5
echo "Phase 4 PASSED"
```

**Commit:**

```bash
git add packages/themes/corvus/ sites/_corvus-digital-marketing-events/
git commit -m "$(cat <<'EOF'
chore(corvus): regenerate theme with URL sanitisation

Re-ran full pipeline (componentize + strip) with URL sanitisation:
- Clone domain URLs converted to relative paths
- Social media URLs replaced with component props
- Third-party external URLs neutralised
- Mobile nav popup section stripped from pages
- Clone-domain font URLs stripped from CSS

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Final verification

**Goal:** Full type-check and commit log.
**Model:** haiku — mechanical verification

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -10
echo "==="
echo "Commits on this branch:"
git log --oneline develop..HEAD
echo "==="
echo "External URLs remaining in corvus theme:"
grep -r "https\?://" packages/themes/corvus/pages/ --include="*.tsx" | grep -v xmlns | grep -v "props\." | head -5 || echo "None — clean"
echo "==="
echo "Phase 5 PASSED"
```

No commit needed.

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                                                                                  | File overlap      | Model  | Rationale                                |
| ----- | ------- | ------------------------------------------------------------------------------------------------------ | ----------------- | ------ | ---------------------------------------- |
| G1    | Phase 2 | Read `tools/extract-theme.ts`, `tools/lib/clone-css-preprocessor.ts`, `output/clones/corvus/meta.json` | none (reads only) | n/a    | Independent reads before editing         |
| —     | Phase 1 | — no parallel work in this phase —                                                                     |                   | sonnet | Single file modification                 |
| —     | Phase 2 | — no parallel work in this phase (after reads) —                                                       |                   | sonnet | Two files but edits depend on each other |
| —     | Phase 3 | — no parallel work in this phase —                                                                     |                   | sonnet | Single file + regeneration               |
| —     | Phase 4 | — no parallel work in this phase —                                                                     |                   | sonnet | Sequential: regenerate → verify → test   |
| —     | Phase 5 | — no parallel work in this phase —                                                                     |                   | haiku  | Single verification                      |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                              | Reason                                                               |
| --------------------------------- | -------------------------------------------------------------------- |
| Verification gates between phases | Each phase's output gates the next                                   |
| Git commits                       | One per phase, in order                                              |
| Phase 2 depends on Phase 1        | Content stripper must have URL support before extract-theme wires it |
| Phase 3 depends on Phase 2        | Source domain wiring needed before popup extraction test             |
| Phase 4 depends on Phases 1-3     | End-to-end test requires all pipeline fixes in place                 |

---

## Cost Estimate

| Phase                       | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| --------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: URL sanitisation   | sonnet | ~10k              | ~3k                | $0.08      |
| Phase 2: Wire source domain | sonnet | ~20k              | ~3k                | $0.11      |
| Phase 3: Popup extraction   | sonnet | ~18k              | ~4k                | $0.11      |
| Phase 4: End-to-end test    | sonnet | ~12k              | ~2k                | $0.07      |
| Phase 5: Final verification | haiku  | ~5k               | ~0.5k              | $0.002     |
| **Total**                   |        | **~65k**          | **~12.5k**         | **~$0.37** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. URL sanitisation results — how many external URLs were removed/converted
4. Any exceptions or intentional deviations from the plan
5. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-13_pipeline-url-sanitisation/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
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
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6` not `Opus 4.6`)
- **DO NOT touch** clone-site.ts, scaffold-client-site.ts, visual-qa-loop.ts, or cpf-validator.ts — those are working correctly
- **DO NOT modify live site themes** (orion, vega, cygnus, solaris, lyra, nova, sirius, atlas, castor, polaris) — only corvus
- The URL sanitisation in content-stripper must be generic — works for any source domain, not just colorcode.events
- `xmlns` URLs in SVG elements (`xmlns="http://www.w3.org/2000/svg"`) must NOT be touched — they are XML namespace declarations, not hyperlinks
- `viewBox` and other SVG attributes with URL-like values must NOT be touched
- Only process `href=`, `src=`, and `action=` attributes for URL sanitisation

## Completed

**Date:** 2026-04-13
**Status:** All phases executed successfully

Implemented three pipeline URL sanitisation fixes across four commits. Phase 1 added steps 8–10 to `content-stripper.ts`: clone-domain absolute URLs → relative paths, social media URLs → component props, remaining external URLs → `"#"`. Phase 2 wired `sourceDomain` (read from `meta.json`) into both the content-stripper config and the CSS preprocessor (step 3b strips clone-domain `url()` references from font-face declarations). Phase 3 added `stripPopupNav()` to `extract-theme.ts` to remove all Breakdance popup/mobile-nav `<div className="breakdance">` blocks from page JSX — a bug was found and fixed during the phase: pages contain multiple popup blocks (2+), so the initial single-pass removal was insufficient and was converted to a loop. Phase 4 ran `--pass both` on corvus and verified zero external URLs in generated pages, zero `colorcode.events` in CSS, zero `bde-popup` in theme pages, and clone CSS serving at HTTP 200. One `colorcode.events` remains in the rendered HTML but is in the test site's `site.config.ts` JSON-LD schema (email field) — not pipeline output.

### Commits

- `fe238f4` feat(pipeline): add URL sanitisation to content-stripper
- `140b781` feat(pipeline): wire source domain into extract-theme and CSS preprocessor
- `6edb3e7` feat(pipeline): strip Breakdance popup/mobile-nav from page bodies
- `2a39e83` chore(corvus): regenerate theme with URL sanitisation
