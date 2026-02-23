# Claude Plan: Fix Three Ingestion Pipeline Issues

**Date:** 2026-02-21
**Author:** Claude (independent plan — written before seeing Codex output)

---

## Phase 1: Fix Synthesis JSON Truncation

**Files modified:** `tools/lib/multi-page-analyzer.ts`

### Step 1.1: Introduce a separate synthesis token constant

The current `VISION_MAX_TOKENS = 4096` is shared by both per-page vision calls and the synthesis call. The per-page calls produce ~200-400 lines of JSON (sections + visual language for one page). The synthesis call produces much more — it deduplicates blueprints across all pages, generates visual language, token recommendations, and registry recommendation. For the atlas test (10 pages, 16+ blueprints), 4096 tokens was insufficient.

**Change:**
```typescript
const VISION_MAX_TOKENS = 4096;           // Per-page calls (unchanged)
const SYNTHESIS_MAX_TOKENS = 16384;       // Synthesis call (4x increase)
```

**Rationale for 16384:** The atlas truncation happened at ~386 lines / ~3800 tokens. The response was ~75% complete (missing `themeTokenRecommendations` and `registryRecommendation`). 4x the original limit gives ample headroom for sites with up to 20+ pages without being wasteful. Claude Sonnet supports up to 8192 output tokens by default and higher with extended thinking, but 16384 is safe for the standard API.

**Update the synthesis call** at line 567:
```typescript
max_tokens: SYNTHESIS_MAX_TOKENS,  // was: VISION_MAX_TOKENS
```

### Step 1.2: Add stop_reason truncation detection

After the synthesis API call returns, check `response.stop_reason`. If it's `"max_tokens"` instead of `"end_turn"`, log a warning so truncation is immediately visible in pipeline output:

```typescript
if (response.stop_reason === "max_tokens") {
  console.warn("  [Warning] Synthesis response was truncated (hit max_tokens limit)");
  // Write debug file regardless
  if (outputDir) {
    const debugPath = path.join(outputDir, "debug-synthesis-response.txt");
    fs.writeFileSync(debugPath, textBlock.text, "utf8");
    console.warn(`  [Debug] Truncated response written to ${debugPath}`);
  }
}
```

This doesn't retry (to keep API costs predictable) but makes the failure mode obvious.

### Verification Gate

1. Run `/pipeline.ingest --url https://colorcode.events/ --name atlas2`
2. Check that `debug-synthesis-response.txt` is NOT written (synthesis completed without truncation)
3. Check that `site-analysis.json` contains a `registryRecommendation` with non-default values
4. Check pipeline log output for `TOKEN_SOURCE: synthesis+computed` or at minimum `TOKEN_SOURCE: synthesis`

---

## Phase 2: Fix Computed Styles `__name is not defined`

**Files modified:** `tools/lib/computed-style-extractor.ts`

### Step 2.1: Analyse the esbuild `__name` trigger

The `__name` variable is injected by esbuild's `keepNames` transform. It applies to:
- Named function declarations: `function foo() {}`
- Named function expressions: `const foo = function foo() {}`
- Class declarations: `class Foo {}`

It does NOT apply to:
- Arrow functions: `const foo = () => {}`
- Anonymous function expressions: `const foo = function() {}`
- Object methods in shorthand: `{ foo() {} }` — **this CAN trigger it**

Looking at the `page.evaluate()` callback (lines 122-207), the current code uses:
- Arrow function for `rgbToHex` (line 127) — safe ✓
- `for...of` loops — safe (no function declaration) ✓
- `try...catch` — safe ✓
- No named functions — **but the callback itself is an anonymous arrow, which should be safe**

**The likely trigger:** esbuild may be injecting `__name` for the outer module scope, and the serialisation of the arrow function captures a reference to it. Or there's a property accessor pattern triggering it.

### Step 2.2: Convert to string-based evaluate

The most robust fix is to use `page.evaluate()` with a string argument instead of a function. String-based evaluate bypasses serialisation entirely — esbuild never touches the string content:

```typescript
const result = await page.evaluate(`
  (function(strategies) {
    // ... entire callback as a string literal ...
  })(${JSON.stringify(serialisedStrategies)})
`);
```

**However**, this loses TypeScript type checking inside the evaluate. A better approach:

### Step 2.3: Use `page.evaluate()` with explicit function serialisation

Actually, the cleanest approach is to keep the current structure but ensure NO constructs that trigger `__name` exist. Let me re-examine:

The callback at line 122 is:
```typescript
const result = await page.evaluate((strategies) => {
```

This is an arrow function — esbuild should NOT inject `__name` here. The `rgbToHex` inside is also an arrow function.

**Alternative hypothesis:** The `__name` is being injected at the MODULE level by esbuild (for the `extractComputedStyles` named export), and the closure captures it somehow. This is a known tsx/esbuild quirk.

**Fix: Use `page.evaluate()` with a string + `addScriptTag` pattern** — but that's over-engineered.

**Simplest robust fix:** Wrap the entire evaluate callback in a new Function() or use the string variant:

```typescript
const evaluateCode = `(strategies) => {
  const rgbToHex = (rgb) => {
    const match = rgb.match(/rgba?\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)/);
    if (!match) return null;
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase();
  };
  // ... rest of the logic
}`;

const fn = new Function('return ' + evaluateCode)();
const result = await page.evaluate(fn, serialisedStrategies);
```

**Actually, the cleanest approach:** Add esbuild configuration to disable `keepNames`. But we don't control esbuild config when using `tsx`.

**Recommended approach:** Use Playwright's `page.addScriptTag()` to inject the extraction code as a script, then call it via `page.evaluate()`. This completely isolates the code from esbuild transforms:

```typescript
// Define the extraction logic as a plain string (esbuild won't transform it)
const EXTRACTION_SCRIPT = `
  window.__extractStyles = function(strategies) {
    // ... self-contained extraction logic ...
  };
`;

// In extractComputedStyles():
await page.addScriptTag({ content: EXTRACTION_SCRIPT });
const result = await page.evaluate(
  (strategies) => (window as any).__extractStyles(strategies),
  serialisedStrategies
);
```

**Wait — this still has the arrow function in the evaluate call.** Let me simplify:

### Final approach for Phase 2

Use `page.evaluate()` with a **string argument**:

```typescript
const result = await page.evaluate(
  `(${JSON.stringify(serialisedStrategies)}).reduce ? (function() {
    var strategies = ${JSON.stringify(serialisedStrategies)};
    // ... all logic as a string ...
    return { elements, allColours, extractMs };
  })() : null`
);
```

This is ugly. Better: extract the evaluate body into a separate `.js` file that esbuild doesn't process, and read it at runtime. But that adds a file.

**Simplest pragmatic fix:**

```typescript
const extractionFn = `(strategies) => {
  const startTime = performance.now();
  const rgbToHex = (rgb) => { /* ... */ };
  // ... rest ...
  return { elements, allColours: Array.from(colourSet), extractMs: Math.round(endTime - startTime) };
}`;

const result = await page.evaluate(
  new Function('return ' + extractionFn)() as any,
  serialisedStrategies
);
```

**No — `new Function` has the same issue if esbuild transforms the string template.**

**Final answer:** The simplest fix that definitely works is passing the function body as a string literal to `page.evaluate()`:

```typescript
const result = await page.evaluate(`
  (function(strategies) {
    // ... all logic, verbatim as a string ...
  })(${JSON.stringify(serialisedStrategies)})
`);
```

When `page.evaluate()` receives a string, Playwright sends it directly to the browser as-is. esbuild never sees the contents of a runtime string literal — it only transforms code structure. This is the only guaranteed-safe approach.

**Trade-off:** We lose TypeScript type checking inside the evaluate. This is acceptable because:
- The evaluate body is ~80 lines of simple DOM querying
- It's tested indirectly by the pipeline's end-to-end run
- The types of `strategies` and the return value are well-defined

### Verification Gate

1. Run `/pipeline.ingest --url https://colorcode.events/ --name atlas2`
2. Confirm NO `[computed-styles] Extraction failed` warning in output
3. Confirm `TOKEN_SOURCE` is `synthesis+computed` (both sources available)
4. `pnpm type-check` passes (the string evaluate doesn't break any types)

---

## Phase 3: Fix Token Class Allowlist False Positives

**Files modified:** `tools/lib/token-class-allowlist.ts`

### Step 3.1: Add non-color background utilities to allowlist

The issue is that `bg-cover`, `bg-center` etc. match `COLOR_CLASS_REGEX` (starts with `bg-`) but aren't in the standard Tailwind prefixes. The cleanest fix is to add a set of known non-color utility classes that happen to start with color-related prefixes:

```typescript
/** Standard Tailwind utilities that start with colour-related prefixes but aren't colours. */
const NON_COLOR_UTILITIES = new Set([
  // Background size
  "bg-cover", "bg-contain", "bg-auto",
  // Background position
  "bg-center", "bg-top", "bg-bottom", "bg-left", "bg-right",
  "bg-left-top", "bg-left-bottom", "bg-right-top", "bg-right-bottom",
  // Background repeat
  "bg-repeat", "bg-no-repeat", "bg-repeat-x", "bg-repeat-y", "bg-repeat-round", "bg-repeat-space",
  // Background attachment
  "bg-fixed", "bg-scroll", "bg-local",
  // Background clip
  "bg-clip-border", "bg-clip-padding", "bg-clip-content", "bg-clip-text",
  // Background origin
  "bg-origin-border", "bg-origin-padding", "bg-origin-content",
  // Text decoration
  "decoration-solid", "decoration-double", "decoration-dotted", "decoration-dashed", "decoration-wavy",
  "decoration-auto", "decoration-from-font",
  // Text overflow / alignment already handled by STANDARD_TAILWIND_PREFIXES for `text-*`
  // Border style (already partially handled via "border" prefix)
  "border-solid", "border-dashed", "border-dotted", "border-double", "border-hidden", "border-none",
  // Outline style
  "outline-none", "outline-dashed", "outline-dotted", "outline-double",
  // Ring
  "ring-inset",
  // Shadow
  "shadow-inner", "shadow-none",
  // Stroke
  "stroke-0", "stroke-1", "stroke-2",
  // Fill
  "fill-none",
]);
```

### Step 3.2: Add check in `isAllowedClass()`

Insert a check for `NON_COLOR_UTILITIES` **before** the color-class rejection on line 184:

```typescript
// Check non-colour utilities that start with colour-related prefixes
if (NON_COLOR_UTILITIES.has(stripped)) return true;

// If it looks like a colour class but isn't in our allowlist, reject it
if (looksLikeColorClass(stripped)) return false;
```

### Step 3.3: Verify text-* classes are already handled

The `text-left`, `text-center`, `text-right`, `text-justify` are already in `STANDARD_TAILWIND_PREFIXES` (line 90). The `text-wrap`, `text-nowrap`, `text-balance`, `text-pretty` are also there (line 116). So no additional work needed for `text-*` non-color utilities.

### Verification Gate

1. Write a quick unit test or inline check:
   - `isAllowedClass("bg-cover")` → `true`
   - `isAllowedClass("bg-center")` → `true`
   - `isAllowedClass("bg-no-repeat")` → `true`
   - `isAllowedClass("bg-brand-dark-purple")` → `false` (still rejected)
   - `isAllowedClass("bg-brand-primary")` → `true` (still accepted)
2. `pnpm type-check` passes
3. Run `/pipeline.ingest` — no "non-standard colour classes" warnings for `bg-cover` etc.

---

## Phase 4: Verification and Commit

### Step 4.1: Full pipeline test

Run `/pipeline.ingest --url https://colorcode.events/ --name atlas2` and verify:
- Synthesis JSON is complete (no truncation warning)
- Computed styles extract successfully
- No false-positive allowlist warnings for standard Tailwind classes
- Generated components use correct theme tokens
- `pnpm type-check` passes

### Step 4.2: Clean up test artifacts

```bash
/pipeline.kill-site test-atlas2
/pipeline.kill-theme atlas2
```

### Step 4.3: Commit on develop

```bash
git add tools/lib/multi-page-analyzer.ts tools/lib/computed-style-extractor.ts tools/lib/token-class-allowlist.ts
git commit -m "fix: resolve three ingestion pipeline issues (truncation, __name, allowlist)"
```

---

## Risks and Trade-offs

| Risk | Mitigation |
|------|-----------|
| 16384 tokens may still truncate for extremely large sites (30+ pages) | `stop_reason` check will catch it; can increase further if needed |
| String-based `page.evaluate()` loses TypeScript checking | The extraction logic is simple DOM querying; tested by E2E pipeline run |
| `NON_COLOR_UTILITIES` set needs manual maintenance as Tailwind adds utilities | Tailwind's `bg-*` non-color utilities are stable; last major addition was v3.0 |
| Increasing synthesis token limit increases API cost per run | For 16384 tokens the cost increase is marginal (~$0.01-0.02 per synthesis call) |
