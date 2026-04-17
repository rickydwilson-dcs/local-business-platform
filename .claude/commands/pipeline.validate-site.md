# Pipeline Validate Site

Shared validation skill used by pipeline commands after a test site has been scaffolded.

Runs a full fidelity review cycle: start dev server → screenshot pages → **parallel review fan-out** (visual fidelity + accessibility + performance, all concurrent) → aggregate findings → fix agent (3-attempt retry) → console QA → kill dev server → report.

**Usage:**

```
/pipeline.validate-site \
  --site-dir sites/$THEME_NAME-test \
  --pages "/ /about /contact /services /services/first-service" \
  --review-prompt-file output/ingestion/$THEME_NAME/meta/validate-review-prompt.txt \
  --findings-file output/ingestion/$THEME_NAME/meta/tsx-review-findings.json \
  --fix-log-file output/ingestion/$THEME_NAME/meta/tsx-fix-log.json \
  [--screenshot-dir output/ingestion/$THEME_NAME/meta/dev-screenshots] \
  [--reference-screenshot-dir output/ingestion/$THEME_NAME/reference/screenshots] \
  [--session-dir output/sessions/YYYY-MM/YYYY-MM-DD_validate-sitename]
```

**Arguments:**

| Argument                     | Required | Description                                                                                                                                                                                                       |
| ---------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--site-dir`                 | ✓        | Path to the test site (e.g. `sites/lyra-test`)                                                                                                                                                                    |
| `--pages`                    | ✓        | Space-separated list of URL paths to validate (e.g. `"/ /about /contact"`)                                                                                                                                        |
| `--review-prompt-file`       | ✓        | Path to a file containing the HTML fidelity review criteria (written by the calling pipeline)                                                                                                                     |
| `--findings-file`            | ✓        | Path where the HTML fidelity review agent should write findings JSON                                                                                                                                              |
| `--fix-log-file`             | ✓        | Path where the fix agent should write the fix log JSON                                                                                                                                                            |
| `--screenshot-dir`           | —        | If provided, Playwright screenshots are saved here before the review agents run                                                                                                                                   |
| `--reference-screenshot-dir` | —        | If provided, passed to `cs-visual-fidelity-reviewer` as its reference path. If omitted, VFR runs in code-only mode (VFR-013, VFR-014 only)                                                                        |
| `--session-dir`              | —        | Directory for specialist findings files (`findings-visual-fidelity.md`, `findings-accessibility.md`, `findings-performance.md`, `findings-aggregated.md`). Defaults to the directory containing `--findings-file` |

Parse `$ARGUMENTS` and store each as a variable. If any required argument is missing, STOP:

```
Usage: /pipeline.validate-site --site-dir <path> --pages "<paths>" \
  --review-prompt-file <path> --findings-file <path> --fix-log-file <path>
```

Derive `$SITE_NAME` from `--site-dir` (the basename, e.g. `lyra-test`).
Derive `$SESSION_DIR`: if `--session-dir` is provided, use it; otherwise use the directory portion of `--findings-file`.

---

## Step 1: Start Dev Server

```bash
cd $SITE_DIR && npm install --silent
```

Start the dev server in the background:

```bash
npm run dev > /tmp/$SITE_NAME-dev.log 2>&1 &
DEV_PID=$!
```

Poll until ready (max 30 seconds):

```bash
for i in 2 3 4 5 6 10; do
  sleep $i
  if grep -q "Local:" /tmp/$SITE_NAME-dev.log 2>/dev/null; then break; fi
done
DEV_PORT=$(grep -o "localhost:[0-9]*" /tmp/$SITE_NAME-dev.log | head -1 | cut -d: -f2)
DEV_PORT=${DEV_PORT:-3000}
echo "Dev server on port $DEV_PORT"
```

Health-check:

```bash
curl -s -o /dev/null -w "HTTP %{http_code}" http://localhost:$DEV_PORT
```

If HTTP status is not 200, STOP: "Dev server failed to start for $SITE_NAME. Check /tmp/$SITE_NAME-dev.log"

---

## Step 2: Screenshot Pages

Skip entirely if `--screenshot-dir` was not provided.

If provided:

```bash
mkdir -p $SCREENSHOT_DIR
```

Run the Playwright screenshot script. **Do NOT use `npx playwright screenshot` CLI** — use the tsx script below so `reducedMotion: 'reduce'` can be set. Without it, `RevealOnScroll` and other `prefers-reduced-motion` components hide their content before the IntersectionObserver fires, resulting in blank screenshots.

Parse `$PAGES` into a list of `[path, slug]` pairs by using the path to derive a filename:

- `/` → `home`
- `/about` → `about`
- `/contact` → `contact`
- Any other path → strip leading `/`, replace remaining `/` with `-`, replace `[` and `]` with empty string (e.g. `/services/[slug]` → `services-slug`)

```bash
npx tsx -e "
import { chromium } from 'playwright';
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});
const pages = [
  $(echo "$PAGES" | node -e "
    const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ');
    const pairs = lines.map(p => {
      let name = p === '/' ? 'home' : p.replace(/^\//,'').replace(/\//g,'-').replace(/[\[\]]/g,'');
      return JSON.stringify([p, name]);
    });
    process.stdout.write(pairs.join(',\n  '));
  ")
];
for (const [path, name] of pages) {
  try {
    const page = await context.newPage();
    await page.goto('http://localhost:$DEV_PORT' + path, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: '$SCREENSHOT_DIR/' + name + '.png', fullPage: true });
    await page.close();
    console.log('Captured: ' + name + '.png');
  } catch (e) {
    console.warn('WARN: Could not capture ' + name + '.png:', e.message);
  }
}
await browser.close();
" 2>/dev/null || echo "WARN: Playwright screenshot failed — review agents will use HTML source only"
```

**WARN not STOP** if screenshots fail — the review agents can still use HTML source.

---

## Step 3: Parallel Review Fan-Out

After screenshots are captured (or after the WARN if they failed), spawn **3 specialist review agents in a single Task-tool message** with `run_in_background: true` so they run concurrently. Do NOT spawn them sequentially. Do NOT wait between launches.

### Review Agent 1: Visual Fidelity (`cs-visual-fidelity-reviewer`)

Spawn with model `opus`. Prompt:

> You are `cs-visual-fidelity-reviewer`. Compare rendered test site screenshots against reference screenshots and identify visual drift in colour, typography, layout, and component variants.
>
> **Inputs:**
>
> - Reference screenshots: `$REFERENCE_SCREENSHOT_DIR` (if `--reference-screenshot-dir` was not provided, omit this path — run in code-only mode, checking VFR-013 and VFR-014 only via Grep)
> - Rendered screenshots: `$SCREENSHOT_DIR` (if `--screenshot-dir` was not provided, skip all screenshot-based rules)
> - Session directory: `$SESSION_DIR`
> - Site name: `$SITE_NAME`
> - Scope: full
>
> Follow your agent procedure exactly. Write findings to `$SESSION_DIR/findings-visual-fidelity.md`.

### Review Agent 2: Accessibility (`cs-frontend-engineer`)

Spawn with model `sonnet`. Prompt:

> You are a frontend accessibility specialist. Run an accessibility audit on the rendered test site at `http://localhost:$DEV_PORT`.
>
> **Pages to check:** $PAGES
> **Site source:** `$SITE_DIR`
>
> **Checks to perform:**
>
> 1. **Semantic HTML** — headings in correct order (h1 → h2 → h3), no skipped levels, landmark regions present (header, main, footer, nav)
> 2. **ARIA** — all interactive elements have accessible names, no invalid ARIA roles, aria-labels on icon-only buttons
> 3. **Alt text** — all `<img>` elements have non-empty `alt` attributes; decorative images have `alt=""`
> 4. **Form labels** — all `<input>`, `<textarea>`, `<select>` have associated `<label>` elements or `aria-label`
> 5. **Contrast** — flag any Tailwind classes that visually suggest low contrast (e.g. `text-gray-300` on light backgrounds). Do NOT run Lighthouse — read source only.
> 6. **Keyboard traps** — identify any `tabIndex` patterns that could trap keyboard users
> 7. **Focus indicators** — check that no global `outline: none` override removes focus rings without a custom replacement
>
> Read source files using `Read` and `Grep`. Do NOT start a dev server — the skill already started one. Do NOT modify any files.
>
> Write findings to `$SESSION_DIR/findings-accessibility.md` using this format:
>
> ```markdown
> # Accessibility Audit Findings
>
> **Reviewer:** cs-frontend-engineer (accessibility mode)
> **Scope:** $PAGES
> **Date:** YYYY-MM-DD
>
> ## Findings
>
> ### [SEVERITY] A11Y-NNN: Short title
>
> - **File:** `path/to/file.tsx` (line N)
> - **Issue:** [description]
> - **Impact:** [who is affected and how]
> - **Fix:** [specific change]
> - **Effort:** trivial | small | medium
>
> ## Statistics
>
> - Critical: N
> - High: N
> - Medium: N
> - Low: N
> - Total: N
> ```
>
> If no issues found, write a passing report with zero statistics.

### Review Agent 3: Performance (`cs-frontend-engineer`)

Spawn with model `sonnet`. Prompt:

> You are a frontend performance specialist. Run a performance audit on the test site at `$SITE_DIR`.
>
> **Checks to perform (source-based — do NOT run Lighthouse or build the site):**
>
> 1. **Image optimisation** — check that all `<Image>` elements have a `sizes` prop when `fill` is used; check that images under `public/` are JPEG/WebP, not large PNG bitmaps (warn if any PNG in `public/images/` exceeds 500KB — use `ls -lh` to check)
> 2. **Bundle hints** — check `next.config.*` for `images.formats`, `compress`, and whether `swcMinify` is enabled (or removed in favour of built-in Next.js 15 defaults)
> 3. **Critical CSS** — verify that `app/globals.css` does not import unused font families (font-family declarations for fonts not in `typography.fontFamily` config)
> 4. **Script loading** — check `app/layout.tsx` for third-party `<Script>` tags; flag any without `strategy="lazyOnload"` or `strategy="afterInteractive"`
> 5. **React Server Components** — scan `app/` and `components/` for unnecessary `'use client'` directives on components that have no client-side interactivity (no hooks, no event handlers)
>
> Read source files using `Read`, `Grep`, and `Bash` (`ls -lh`). Do NOT modify any files.
>
> Write findings to `$SESSION_DIR/findings-performance.md` using this format:
>
> ```markdown
> # Performance Audit Findings
>
> **Reviewer:** cs-frontend-engineer (performance mode)
> **Scope:** $SITE_DIR
> **Date:** YYYY-MM-DD
>
> ## Findings
>
> ### [SEVERITY] PERF-NNN: Short title
>
> - **File:** `path/to/file.tsx` (line N)
> - **Issue:** [description]
> - **Impact:** [performance cost]
> - **Fix:** [specific change]
> - **Effort:** trivial | small | medium
>
> ## Statistics
>
> - Critical: N
> - High: N
> - Medium: N
> - Low: N
> - Total: N
> ```
>
> If no issues found, write a passing report with zero statistics.

**All three agents must be spawned in the SAME Task tool message** so Claude Code launches them concurrently. After spawning, use `TaskOutput` to poll for completion of all three before proceeding to Step 4.

---

## Step 4: Aggregate Findings

After all three review agents complete, read each findings file and aggregate into `$SESSION_DIR/findings-aggregated.md`:

```markdown
# Aggregated Review Findings

**Site:** $SITE_NAME
**Date:** YYYY-MM-DD
**Agents:** cs-visual-fidelity-reviewer, cs-frontend-engineer (a11y), cs-frontend-engineer (perf)

## By Domain

### Visual Fidelity

[Paste Critical + High findings from findings-visual-fidelity.md. Include VFR rule IDs.]

### Accessibility

[Paste Critical + High findings from findings-accessibility.md. Include A11Y finding IDs.]

### Performance

[Paste Critical + High findings from findings-performance.md. Include PERF finding IDs.]

## All Medium + Low findings

[Brief summary — full details in individual findings files]

## Aggregated Statistics

| Domain          | Critical | High  | Medium | Low   | Total |
| --------------- | -------- | ----- | ------ | ----- | ----- |
| Visual Fidelity | N        | N     | N      | N     | N     |
| Accessibility   | N        | N     | N      | N     | N     |
| Performance     | N        | N     | N      | N     | N     |
| **Total**       | **N**    | **N** | **N**  | **N** | **N** |

**Gate:** Critical + High total = N
```

The **Gate** line determines whether the fix agent runs. If `Critical + High total == 0`, skip Step 5 and proceed to Step 6.

---

## Step 5: Fix Agent (3-Attempt Retry Loop)

Only runs if `Critical + High total > 0` in `findings-aggregated.md`.

The fix agent reads `$FINDINGS_FILE` (the original HTML fidelity findings JSON for backwards compatibility) **and** `$SESSION_DIR/findings-aggregated.md` for the specialist findings.

Launch a fix agent (model: sonnet) with this task:

> Read `$FINDINGS_FILE` and `$SESSION_DIR/findings-aggregated.md`.
>
> Process findings in severity order: Critical first, then High, then Medium, then Low.
> Within each severity, process in domain order: Visual Fidelity → Accessibility → Performance.
>
> For each finding, attempt to fix it up to **3 times** before giving up:
>
> **Retry loop:**
>
> 1. Read the relevant source file
> 2. Apply the minimal change that addresses the finding
> 3. Run: `cd $SITE_DIR && npx tsc --noEmit 2>&1 | head -20`
> 4. If type-check **passes** → mark as `fixed` with the attempt number, move to the next finding
> 5. If type-check **fails** → revert the change (restore the previous file content), then try a different approach on the next attempt
> 6. After **3 failed attempts** → do not apply any change, mark the finding as `unresolved`
>
> Log entry format:
>
> ```json
> { "id": "VFR-001", "domain": "visual", "status": "fixed", "attempt": 1, "description": "Corrected brand-primary token on hero CTA" }
> { "id": "A11Y-003", "domain": "accessibility", "status": "unresolved", "attempts": 3, "lastError": "...", "reason": "All 3 approaches failed type-check" }
> ```
>
> Write the complete fix log to `$FIX_LOG_FILE`.
>
> Do not commit anything.
>
> At the end, report: total findings, fixed count, unresolved count, and for each unresolved finding: its ID, domain, and the last type-check error.

After the fix agent completes, re-capture screenshots:

```bash
npx tsx -e "
import { chromium } from 'playwright';
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});
// [same screenshot script as Step 2]
await browser.close();
" 2>/dev/null || echo "WARN: Playwright re-screenshot failed"
```

Then re-run the parallel fan-out (Step 3) and re-aggregate (Step 4) with retry count + 1. Continue until:

- Aggregated `Critical + High == 0`, OR
- 3 retry cycles are exhausted

If 3 retry cycles are exhausted with remaining Critical + High findings, proceed to Step 6 with those findings marked as unresolved in the fix log.

---

## Step 6: Console QA

With the dev server still running, run HTTP checks across all pages:

```bash
node - <<'EOF'
const http = require('http');
const pages = process.env.PAGES.split(' ');
const port = process.env.DEV_PORT;
let allClean = true;
(async () => {
  for (const path of pages) {
    await new Promise(r => {
      http.get(`http://localhost:${port}${path}`, res => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
          if (res.statusCode !== 200) {
            console.error(`FAIL ${path} → HTTP ${res.statusCode}`);
            allClean = false;
          } else {
            console.log(`OK   ${path} → 200`);
          }
          r();
        });
      }).on('error', e => {
        console.error(`FAIL ${path} → ${e.message}`);
        allClean = false;
        r();
      });
    });
  }
  process.exit(allClean ? 0 : 1);
})();
EOF
```

Then run a Playwright console/network error scan:

```bash
npx tsx -e "
import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const pages = '$PAGES'.split(' ');
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push({ url: page.url(), text: msg.text() });
  });
  page.on('response', res => {
    if (res.status() >= 400) errors.push({ url: page.url(), resource: res.url(), status: res.status() });
  });
  for (const p of pages) {
    try {
      await page.goto('http://localhost:$DEV_PORT' + p, { waitUntil: 'networkidle', timeout: 15000 });
    } catch (e) {
      errors.push({ url: p, text: e.message });
    }
  }
  await browser.close();
  if (errors.length) {
    console.error('Console/network errors found:');
    errors.forEach(e => console.error(JSON.stringify(e)));
    process.exit(1);
  } else {
    console.log('All pages clean — no console errors or 4xx resources.');
  }
})();
" 2>/dev/null || echo "WARN: Playwright console scan unavailable — skipped"
```

**Interpret and fix before proceeding:**

| Error pattern                                                   | Likely cause                                                          | Fix                                                         |
| --------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------- |
| `400` on `/_next/image?url=...`                                 | `fill` image missing `sizes` prop, or parent not `position: relative` | Add `sizes="..."` and `relative` to parent                  |
| `404` on `/stitch-images/img-NNN.jpg` or `/images/filename.jpg` | Image not copied to `public/`                                         | Copy from ingestion images directory                        |
| `Module not found` in console                                   | Missing import or wrong path                                          | Fix import                                                  |
| `Warning: Each child in a list should have a unique "key"`      | Missing `key` prop on mapped elements                                 | Add `key`                                                   |
| `hydration` error                                               | Server/client HTML mismatch                                           | Remove conditional client-only logic from Server Components |

If any blocker-level errors remain after attempting fixes, record them in `$FIX_LOG_FILE` with `"source": "console-qa"` and `"status": "unresolved"`.

---

## Step 7: Kill Dev Server

```bash
kill $DEV_PID 2>/dev/null || true
rm -f /tmp/$SITE_NAME-dev.log
```

---

## Step 8: Report

Read `$SESSION_DIR/findings-aggregated.md` and `$FIX_LOG_FILE` to compute counts.

Print:

```
=== Site Validation: $SITE_NAME ===

Visual Fidelity:  <N> findings — <N_critical> critical, <N_high> high, <N_medium> medium, <N_low> low
Accessibility:    <N> findings — <N_critical> critical, <N_high> high, <N_medium> medium, <N_low> low
Performance:      <N> findings — <N_critical> critical, <N_high> high, <N_medium> medium, <N_low> low
─────────────────────────────────────────────────────────────────────
Total:            <N> findings — <N_critical> critical, <N_high> high (gate threshold)

Fix pass:         <N_fixed> fixed (<N_attempt1> on attempt 1, <N_attempt2> on attempt 2, <N_attempt3> on attempt 3)
                  <N_unresolved> unresolved
Console QA:       <PASS | N errors found and fixed | N unresolved errors>
```

If any `unresolved` entries exist (from fix agent or console QA), print a prominent warning block:

```
⚠ Unresolved findings requiring manual attention:
  VFR-002  visual        home           high     — Hero layout mismatch: rendered split vs reference image-overlay
  A11Y-003 accessibility services       medium   — Missing alt text on service card images
  ...
```

---

## Rules

- This skill does NOT commit or push anything
- WARN not STOP on Playwright unavailability — HTTP checks are the fallback
- The dev server is always killed in Step 7, even if earlier steps failed
- Fix log entries always include `"domain"` and `"attempt"` count so callers can see how hard the agent tried
- **The 3 review agents in Step 3 MUST be spawned in a single Task-tool message** — spawning them sequentially defeats the parallelisation
- If `--reference-screenshot-dir` is not provided, `cs-visual-fidelity-reviewer` runs in code-only mode (VFR-013 and VFR-014 only) — this is acceptable and produces a partial findings report
