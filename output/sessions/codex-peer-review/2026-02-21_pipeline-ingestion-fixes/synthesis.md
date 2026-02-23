# Implementation Plan: Fix Three Ingestion Pipeline Issues

**Date:** 2026-02-21
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

## Key Differences Between Plans

| Aspect | Claude | Codex | Synthesised Decision |
|--------|--------|-------|----------------------|
| Synthesis token limit | 16384 (4x) | 8192 with single retry on truncation | **8192 with retry to 16384** — start conservative, retry gives a safety net without wasting tokens on simple sites |
| `__name` fix approach | String-based `page.evaluate()` | Keep arrow functions + move complex logic to Node-side post-processing | **Node-side post-processing** — keeps TypeScript checking, arrow functions are sufficient if we move `rgbToHex` out of evaluate |
| Fallback tightening | Not addressed | Add `synthesisStatus` field; treat incomplete synthesis as recoverable error | **Adopt Codex's suggestion** — log synthesis status explicitly in output JSON so failures are traceable |
| Warning text accuracy | Not addressed | Fix misleading "auto-fixed" text for unfixed violations | **Adopt** — small change, high DX value |
| Testing | Skip dedicated tests | Fixture-driven tests for synthesis + computed extraction | **Add unit tests for allowlist only** — synthesis and computed style tests need API/Playwright mocks that are complex to set up; defer to E2E pipeline run for those |

## Blind Spots Caught

- **Codex caught:** The fallback chain in `analyse-site.ts` silently defaults to vega when synthesis is _partially_ available (some fields present, key fields missing). Claude's plan only increased the token limit but didn't address what happens when truncation still occurs despite the increase.
- **Codex caught:** The warning message "Non-standard colour classes auto-fixed" is misleading when no replacement exists — classes are flagged but NOT actually fixed. This could lead to confusion.
- **Claude caught:** The `text-*` non-color utilities (`text-left`, `text-center`, etc.) are already handled by `STANDARD_TAILWIND_PREFIXES`. Codex suggested verifying this but didn't confirm it.
- **Claude caught:** esbuild's `__name` transform targets named function declarations specifically, not arrow functions. The existing code already uses arrow functions throughout the evaluate callback. The `__name` reference likely leaks from the **module-level** `extractComputedStyles` export, not from constructs inside the callback. This means Codex's "keep arrow functions" approach may not be sufficient alone.

---

## Implementation Plan

### Phase 1: Fix Synthesis JSON Truncation

**File:** `tools/lib/multi-page-analyzer.ts`

**Step 1.1: Split token constants**

```typescript
const VISION_MAX_TOKENS = 4096;        // Per-page vision calls (unchanged)
const SYNTHESIS_MAX_TOKENS = 8192;     // Synthesis call — 2x per-page budget
```

Update the synthesis call (line 567) to use `SYNTHESIS_MAX_TOKENS`.

**Step 1.2: Add truncation detection with single retry**

After the synthesis API call, check `response.stop_reason`:

```typescript
// After line 580 (response received)
if (response.stop_reason === "max_tokens") {
  console.warn("  [Warning] Synthesis truncated at 8192 tokens — retrying with 16384");
  if (outputDir) {
    fs.writeFileSync(path.join(outputDir, "debug-synthesis-response-attempt1.txt"), textBlock.text, "utf8");
  }
  // Single retry with doubled budget
  const retryResponse = await client.messages.create({
    model: VISION_MODEL,
    max_tokens: SYNTHESIS_MAX_TOKENS * 2,
    temperature: VISION_TEMPERATURE,
    messages: [/* same messages */],
  });
  // Use retry response; if still truncated, warn and continue with partial data
  if (retryResponse.stop_reason === "max_tokens") {
    console.warn("  [Warning] Synthesis still truncated after retry — proceeding with partial data");
  }
  // Continue with retryResponse
}
```

**Step 1.3: Persist debug output on any parse failure**

Already exists (lines 588-594), but also write the raw response when `stop_reason` is `max_tokens` even if JSON extraction succeeds (partial JSON may parse but fail validation).

### Verification Gate
- `pnpm type-check` passes
- Manually verify: the atlas debug-synthesis-response.txt shows the response was truncated at line 387. With 8192 tokens, this should complete.

---

### Phase 2: Improve Fallback Chain Visibility

**File:** `tools/analyse-site.ts`

**Step 2.1: Add synthesis status logging**

After the Zod validation at line 355-358, log the synthesis validation status explicitly:

```typescript
const synthValidation = SiteSynthesisResponseSchema.safeParse(synthesis);
const validatedSynthesis: SiteSynthesisResponse | null = synthValidation.success
  ? synthValidation.data
  : null;

if (!synthValidation.success) {
  console.warn(`  [Warning] Synthesis validation failed — falling back to lower-fidelity token sources`);
  console.warn(`  Missing/invalid fields: ${synthValidation.error.issues.map(i => i.path.join('.')).join(', ')}`);
}
```

This makes it obvious when the fallback chain is degrading and WHY. No change to the actual fallback logic — just visibility.

### Verification Gate
- Run pipeline with a known-good URL — should show no validation warnings
- Run pipeline with deliberately small `SYNTHESIS_MAX_TOKENS` (temporarily set to 1024) — should show explicit warning about missing fields

---

### Phase 3: Fix Computed Styles `__name is not defined`

**File:** `tools/lib/computed-style-extractor.ts`

**Step 3.1: Move `rgbToHex` to Node-side post-processing**

The `rgbToHex` conversion doesn't need to happen in the browser. The evaluate callback can return raw `rgb()` strings, and we convert to hex in Node after the evaluate returns. This simplifies the browser-side code and eliminates one potential esbuild transform target:

```typescript
// Browser side: just collect raw CSS values (no rgbToHex)
// Node side: convert rgb strings to hex after page.evaluate() returns
```

**Step 3.2: Use string-based evaluate as the primary approach**

Despite Step 3.1, the `__name` error likely originates from module-level scope leaking into the closure, not from any specific construct inside the callback. The only guaranteed fix is string-based evaluate:

```typescript
const result = await page.evaluate(`
  (function(strategies) {
    var startTime = performance.now();
    var colourSet = new Set();
    var elements = [];
    // ... all logic using var declarations and arrow-free syntax ...
    return { elements: elements, allColours: Array.from(colourSet), extractMs: Math.round(performance.now() - startTime) };
  })(${JSON.stringify(serialisedStrategies)})
`);
```

Key details:
- Use `var` instead of `const`/`let` inside the string (avoid any ES6 constructs that might interact with transforms)
- Move `rgbToHex` to Node-side post-processing (Step 3.1) — simplifies the browser string
- Keep the TypeScript return type annotation on the outer function to maintain type safety at the boundary

**Step 3.3: Add per-role try/catch inside evaluate (Codex suggestion)**

Wrap each selector strategy iteration in try/catch so one failing selector doesn't abort the entire extraction:

```javascript
for (var i = 0; i < strategies.length; i++) {
  try {
    // ... extraction for this strategy
  } catch (e) {
    elements.push({ selector: strategies[i].selectors[0], role: strategies[i].role, found: false, styles: {} });
  }
}
```

### Verification Gate
- `pnpm type-check` passes
- Run pipeline — no `[computed-styles] Extraction failed` warning
- Verify `TOKEN_SOURCE` includes `computed` (either `synthesis+computed` or `computed`)

---

### Phase 4: Fix Token Class Allowlist False Positives

**File:** `tools/lib/token-class-allowlist.ts`

**Step 4.1: Add `NON_COLOR_UTILITIES` set**

```typescript
/** Standard Tailwind utilities that share prefixes with colour classes but aren't colours. */
const NON_COLOR_UTILITIES = new Set([
  // Background size / position / repeat / attachment / clip / origin
  "bg-cover", "bg-contain", "bg-auto",
  "bg-center", "bg-top", "bg-bottom", "bg-left", "bg-right",
  "bg-left-top", "bg-left-bottom", "bg-right-top", "bg-right-bottom",
  "bg-repeat", "bg-no-repeat", "bg-repeat-x", "bg-repeat-y", "bg-repeat-round", "bg-repeat-space",
  "bg-fixed", "bg-scroll", "bg-local",
  "bg-clip-border", "bg-clip-padding", "bg-clip-content", "bg-clip-text",
  "bg-origin-border", "bg-origin-padding", "bg-origin-content",
  // Text decoration style
  "decoration-solid", "decoration-double", "decoration-dotted", "decoration-dashed", "decoration-wavy",
  "decoration-auto", "decoration-from-font",
  // Border style
  "border-solid", "border-dashed", "border-dotted", "border-double", "border-hidden", "border-none",
  // Outline style
  "outline-none", "outline-dashed", "outline-dotted", "outline-double",
  // Ring
  "ring-inset",
  // Shadow
  "shadow-inner", "shadow-none",
  // Stroke width
  "stroke-0", "stroke-1", "stroke-2",
  // Fill
  "fill-none",
]);
```

**Step 4.2: Insert check before color-class rejection**

In `isAllowedClass()`, add before line 184:

```typescript
// Allow non-colour utilities that share prefixes with colour classes
if (NON_COLOR_UTILITIES.has(stripped)) return true;
```

**Step 4.3: Add unit tests**

Add test cases to the existing test file (or create `tools/__tests__/token-class-allowlist.test.ts`):

```typescript
// Should allow standard Tailwind utilities
expect(isAllowedClass("bg-cover")).toBe(true);
expect(isAllowedClass("bg-center")).toBe(true);
expect(isAllowedClass("bg-no-repeat")).toBe(true);
expect(isAllowedClass("bg-clip-text")).toBe(true);
expect(isAllowedClass("decoration-wavy")).toBe(true);

// Should still reject invented colour classes
expect(isAllowedClass("bg-brand-dark-purple")).toBe(false);
expect(isAllowedClass("bg-custom-blue")).toBe(false);
expect(isAllowedClass("text-fancy-red")).toBe(false);

// Should still allow theme tokens
expect(isAllowedClass("bg-brand-primary")).toBe(true);
expect(isAllowedClass("text-surface-foreground")).toBe(true);
```

### Verification Gate
- Unit tests pass
- `pnpm type-check` passes

---

### Phase 5: Fix Misleading Warning Text

**File:** `tools/lib/theme-component-generator.ts`

**Step 5.1: Distinguish auto-fixed vs flagged-only**

At line 254-255, change the warning to accurately reflect what happened:

```typescript
const fixedClasses = violations.filter(v => CLASS_REPLACEMENTS[v.replace(/^(?:sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|dark:)+/, "")]);
const unfixedClasses = violations.filter(v => !CLASS_REPLACEMENTS[v.replace(/^(?:sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|dark:)+/, "")]);

if (fixedClasses.length > 0) {
  warnings.push(`${blueprint.name}: Non-standard colour classes replaced: ${fixedClasses.join(", ")}`);
}
if (unfixedClasses.length > 0) {
  warnings.push(`${blueprint.name}: Unknown colour classes (not in token allowlist): ${unfixedClasses.join(", ")}`);
}
```

This is a small change but prevents future confusion when reading pipeline output.

### Verification Gate
- Pipeline output shows accurate warning categories

---

### Phase 6: Verification and Commit

**Step 6.1: Type check**
```bash
pnpm type-check
```

**Step 6.2: Run unit tests**
```bash
pnpm test
```

**Step 6.3: Full pipeline E2E test**
```bash
# Run pipeline against the same URL that revealed the bugs
/pipeline.ingest --url https://colorcode.events/ --name atlas2
```

Verify:
- No synthesis truncation warning (or successful retry if 8192 wasn't enough)
- No `[computed-styles] Extraction failed` errors
- No false-positive allowlist warnings for `bg-cover`, `bg-center`, `bg-no-repeat`
- `TOKEN_SOURCE: synthesis+computed`
- Warning text accurately distinguishes replaced vs flagged classes

**Step 6.4: Clean up test artifacts**
```bash
/pipeline.kill-site test-atlas2
/pipeline.kill-theme atlas2
```

**Step 6.5: Commit on develop**
```bash
git add tools/lib/multi-page-analyzer.ts tools/lib/computed-style-extractor.ts \
       tools/lib/token-class-allowlist.ts tools/lib/theme-component-generator.ts \
       tools/analyse-site.ts
git commit -m "fix: resolve ingestion pipeline issues (synthesis truncation, __name, allowlist false positives)"
```

---

## Risks and Trade-offs

| Risk | Mitigation |
|------|-----------|
| 8192 tokens may still truncate for very large sites | Single retry with 16384 provides safety net; `stop_reason` check makes failures visible |
| String-based `page.evaluate()` loses TypeScript checking | Moving `rgbToHex` to Node-side reduces browser code to simple DOM queries; E2E test validates correctness |
| `NON_COLOR_UTILITIES` set requires manual updates if Tailwind adds new `bg-*` utilities | Tailwind's structural background utilities are stable across v3/v4; set is comprehensive |
| Retry increases latency for complex sites by one extra API call | Only triggers on truncation, which is already a failure mode; one retry is bounded and predictable |
