# Pipeline Validate Site

Shared validation skill used by pipeline commands after a test site has been scaffolded.

Runs a full fidelity review cycle: start dev server → screenshot pages → review agent → fix agent (3-attempt retry) → console QA → kill dev server → report.

**Usage:**
```
/pipeline.validate-site \
  --site-dir sites/$THEME_NAME-test \
  --pages "/ /about /contact /services /services/first-service" \
  --review-prompt-file output/ingestion/$THEME_NAME/meta/validate-review-prompt.txt \
  --findings-file output/ingestion/$THEME_NAME/meta/tsx-review-findings.json \
  --fix-log-file output/ingestion/$THEME_NAME/meta/tsx-fix-log.json \
  [--screenshot-dir output/ingestion/$THEME_NAME/meta/dev-screenshots]
```

**Arguments:**

| Argument | Required | Description |
|---|---|---|
| `--site-dir` | ✓ | Path to the test site (e.g. `sites/lyra-test`) |
| `--pages` | ✓ | Space-separated list of URL paths to validate (e.g. `"/ /about /contact"`) |
| `--review-prompt-file` | ✓ | Path to a file containing the review agent criteria (written by the calling pipeline) |
| `--findings-file` | ✓ | Path where the review agent should write findings JSON |
| `--fix-log-file` | ✓ | Path where the fix agent should write the fix log JSON |
| `--screenshot-dir` | — | If provided, Playwright screenshots are saved here before the review agent runs |

Parse `$ARGUMENTS` and store each as a variable. If any required argument is missing, STOP:
```
Usage: /pipeline.validate-site --site-dir <path> --pages "<paths>" \
  --review-prompt-file <path> --findings-file <path> --fix-log-file <path>
```

Derive `$SITE_NAME` from `--site-dir` (the basename, e.g. `lyra-test`).

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
" 2>/dev/null || echo "WARN: Playwright screenshot failed — review agent will use HTML source only"
```

**WARN not STOP** if screenshots fail — the review agent can still use HTML source.

---

## Step 3: Review Agent

Read `$REVIEW_PROMPT_FILE` to get the comparison criteria for this specific pipeline run.

Launch a review agent (model: sonnet) with this task:

> You are reviewing a test site for fidelity against a reference.
>
> **Dev server:** http://localhost:$DEV_PORT
> **Pages to review:** $PAGES
>
> [INSERT FULL CONTENTS OF $REVIEW_PROMPT_FILE HERE]
>
> For each issue found, produce one finding. Write all findings to `$FINDINGS_FILE`:
> ```json
> [
>   {
>     "id": "V001",
>     "page": "home",
>     "section": "hero",
>     "type": "blocker|visual|minor",
>     "description": "Human-readable description of the difference",
>     "reference_value": "What the reference shows or specifies",
>     "tsx_value": "What the test site currently renders (or 'missing')",
>     "fix_file": "$SITE_DIR/app/page.tsx"
>   }
> ]
> ```
>
> Severity definitions:
> - `blocker` — visible breakage: font not loading, missing whole section, broken layout, JS exception
> - `visual` — CSS detail absent: hover effect, transition duration, wrong colour token, missing animation
> - `minor` — copy difference, icon variant, minor structural deviation
>
> Do NOT flag as findings:
> - Form fields being `readOnly` (static visual comparison — intentional)
> - `<a>` instead of `<Link>` (intentional per pipeline rules)
> - Local image paths instead of remote URLs (images are localised intentionally)

After the review agent completes, verify `$FINDINGS_FILE` exists and is valid JSON. If missing or empty array, WARN and continue with zero findings (the fix and report steps will still run cleanly).

---

## Step 4: Fix Agent (3-Attempt Retry Loop)

Launch a fix agent (model: sonnet) with this task:

> Read `$FINDINGS_FILE`.
>
> Process findings in severity order: `blocker` first, then `visual`, then `minor`.
>
> For each finding, attempt to fix it up to **3 times** before giving up:
>
> **Retry loop:**
> 1. Read the `fix_file`
> 2. Apply the minimal change that addresses the finding
> 3. Run: `cd $SITE_DIR && npx tsc --noEmit 2>&1 | head -20`
> 4. If type-check **passes** → mark as `fixed` with the attempt number, move to the next finding
> 5. If type-check **fails** → revert the change (restore the previous file content), then try a different approach on the next attempt
> 6. After **3 failed attempts** → do not apply any change, mark the finding as `unresolved`
>
> Log entry format:
> ```json
> { "id": "V001", "status": "fixed", "attempt": 1, "description": "Applied correct brand-primary background to hero section" }
> { "id": "V002", "status": "unresolved", "attempts": 3, "lastError": "Type error: cannot assign...", "reason": "All 3 approaches failed type-check" }
> ```
>
> Write the complete fix log to `$FIX_LOG_FILE`.
>
> Do not commit anything.
>
> At the end, report: total findings, fixed count, unresolved count, and for each unresolved finding: its ID, page, section, type, and the last type-check error.

---

## Step 5: Console QA

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

| Error pattern | Likely cause | Fix |
|---|---|---|
| `400` on `/_next/image?url=...` | `fill` image missing `sizes` prop, or parent not `position: relative` | Add `sizes="..."` and `relative` to parent |
| `404` on `/stitch-images/img-NNN.jpg` or `/images/filename.jpg` | Image not copied to `public/` | Copy from ingestion images directory |
| `Module not found` in console | Missing import or wrong path | Fix import |
| `Warning: Each child in a list should have a unique "key"` | Missing `key` prop on mapped elements | Add `key` |
| `hydration` error | Server/client HTML mismatch | Remove conditional client-only logic from Server Components |

If any blocker-level errors remain after attempting fixes, record them in `$FIX_LOG_FILE` with `"source": "console-qa"` and `"status": "unresolved"`.

---

## Step 6: Kill Dev Server

```bash
kill $DEV_PID 2>/dev/null || true
rm -f /tmp/$SITE_NAME-dev.log
```

---

## Step 7: Report

Read `$FINDINGS_FILE` and `$FIX_LOG_FILE` to compute counts.

Print:

```
=== Site Validation: $SITE_NAME ===

Fidelity review:  <N> findings — <N_blockers> blockers, <N_visual> visual, <N_minor> minor
Fix pass:         <N_fixed> fixed (<N_attempt1> on attempt 1, <N_attempt2> on attempt 2, <N_attempt3> on attempt 3)
                  <N_unresolved> unresolved
Console QA:       <PASS | N errors found and fixed | N unresolved errors>
```

If any `unresolved` entries exist (from fix agent or console QA), print a prominent warning block:

```
⚠ Unresolved findings requiring manual attention:
  V002  home       hero           blocker  — Font variable not applied: last error: "Type error: ..."
  V007  services   service-cards  visual   — Missing hover:scale-105 class: last error: "..."
  ...
```

---

## Rules

- This skill does NOT commit or push anything
- WARN not STOP on Playwright unavailability — HTTP checks are the fallback
- The dev server is always killed in Step 6, even if earlier steps failed
- Fix log entries always include `"attempt"` count so callers can see how hard the agent tried
