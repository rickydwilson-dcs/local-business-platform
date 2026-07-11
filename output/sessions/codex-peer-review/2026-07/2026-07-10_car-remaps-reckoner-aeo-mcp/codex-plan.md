# Implementation Plan — Replace Viezu iframe with DCH-owned ready reckoner, make pages, JSON API, and MCP endpoint

## 1) Delivery setup, scope lock, and architecture decisions

1. **Create working branch from `develop`** (non-negotiable git flow).
2. **Lock scope for vehicle categories before coding**:
   - Proposed default for this pass: **include Car + Van**, exclude HGV/agri/marine/bike/tools/accessories unless explicitly approved.
   - Reason: balances SEO relevance with avoiding noisy/thin inventory, while still supporting the fleet angle via vans.
   - Add a single config switch so HGV can be included later without refactor.
3. **Decide schema placement**:
   - Use **site-local schema helper** for this feature (`dch-automotive` only) rather than adding a shared `Product` generator now.
   - Reason: this is a very domain-specific “vehicle tuning result” schema not yet reused anywhere else; avoid premature shared abstraction in `core-components`.
   - Revisit and upstream only when a second site/use-case appears.

**Files**

- Create: `sites/dch-automotive/docs/car-remaps-implementation-notes.md` (scope/config/rationale)
- No shared package changes yet.

**Verification gate**

- Stakeholder confirmation on Car+Van default.
- Team sign-off on site-local schema approach.

---

## 2) Real-data-first validation harness (mandatory before feature build)

Build the parser against **recorded real Viezu payloads**, not synthetic mocks.

1. Capture fixtures:
   - A few raw Store API pages (including category noise and valid automotive products).
   - A few real product HTML pages containing `data-product_variations="..."`.
   - Include at least one example with pipe-delimited values.
2. Build fixture-backed parser tests:
   - Validate extraction of:
     - make/category
     - model identity
     - fuel type
     - variant
     - price
     - `original_bhp`, `power_bhp`, `original_torque`, `torque_nm`, `economy_gain_bhp`, `economy_gain_nm`, `fuel_saving`
3. Add breakage detection:
   - If `data-product_variations` missing or unparsable, fail with explicit error and collect URL in a sync report.

**Files**

- Create: `sites/dch-automotive/tests/fixtures/viezu/store-api-page-*.json`
- Create: `sites/dch-automotive/tests/fixtures/viezu/product-*.html`
- Create: `sites/dch-automotive/lib/car-remaps/parsers.ts`
- Create: `sites/dch-automotive/lib/car-remaps/parsers.test.ts`

**Verification gate**

- Parser tests pass using real fixtures.
- At least one “expected failure” test confirms markup-change detection path works.

---

## 3) Sync pipeline (Pass A catalog → Pass B product-page enrichment → normalization)

Implement as modular scripts with a single orchestration command.

1. **Pass A: catalog crawl**
   - Fetch paginated Store API (`page`, `per_page=100`) with polite delay and custom UA.
   - Build raw catalog cache.
   - Filter to in-scope categories (config-driven; Car+Van default).
2. **Pass B: product enrichment**
   - For each retained product permalink, GET HTML.
   - Extract and decode `data-product_variations`.
   - Parse numeric/string fields safely.
3. **Normalization**
   - Convert into DCH-owned canonical records.
   - Keep raw source fragments (for audit/debug) and normalized fields (for UI/API/MCP).
   - Resolve pipe-delimited fields as:
     - `raw` preserved always.
     - `parsedValues: string[]`.
     - `primaryValue` = first token for current UI parity.
     - `secondaryValue` retained where present for future stage interpretation.
   - Emit sync report: totals, filtered categories, parse failures, changed-record count.

**Files**

- Create: `sites/dch-automotive/scripts/car-remaps/sync.ts` (orchestrator)
- Create: `sites/dch-automotive/scripts/car-remaps/fetch-store-api.ts`
- Create: `sites/dch-automotive/scripts/car-remaps/fetch-product-html.ts`
- Create: `sites/dch-automotive/scripts/car-remaps/normalize.ts`
- Create: `sites/dch-automotive/scripts/car-remaps/config.ts`
- Create: `sites/dch-automotive/data/car-remaps/` (generated outputs)
  - `manifest.json` (generatedAt, source URL, counts, errors)
  - `makes.json`
  - `vehicles.json` (canonical flattened records)
  - optional `makes/<make-slug>.json` for page/API perf
- Modify: `sites/dch-automotive/package.json` scripts
  - e.g. `car-remaps:sync`, `car-remaps:validate`

**Verification gate**

- Dry run succeeds end-to-end.
- Sync report shows sane counts and no silent parse drops.
- Manual spot-check 5+ vehicles against live Viezu pages.

---

## 4) Shared read layer (single source for UI + pages + API + MCP)

Create one repository/lookup module so all consumers return consistent answers.

1. Build data access module:
   - load dataset
   - query hierarchy: make → model → fuel type → variant
   - get final tuning rows and canonical citation URL
2. Expose deterministic sorting and slug handling.
3. Add unit tests for lookup correctness and edge cases (unknown make/model etc.).

**Files**

- Create: `sites/dch-automotive/lib/car-remaps/types.ts`
- Create: `sites/dch-automotive/lib/car-remaps/repository.ts`
- Create: `sites/dch-automotive/lib/car-remaps/repository.test.ts`
- Create: `sites/dch-automotive/lib/car-remaps/url.ts` (canonical make/result URL helpers)

**Verification gate**

- Repository tests pass.
- Same query returns identical result object across test contexts.

---

## 5) Replace iframe on `/car-remaps` with branded interactive selector

1. Remove iframe block from bespoke page.
2. Add a client component for selector UX (Make → Model → Fuel Type → Variant).
3. Feed options/results from DCH dataset via server-provided props or server action-free local JSON import.
4. Render stage-by-stage results matching current widget output fields.
5. Keep existing `#fleet-enquiry` section unchanged.

**Files**

- Modify: `sites/dch-automotive/app/car-remaps/page.tsx`
- Create: `sites/dch-automotive/components/car-remaps-ready-reckoner.tsx`
- Create: `sites/dch-automotive/components/car-remaps-results-table.tsx`
- Create: `sites/dch-automotive/components/car-remaps-selectors.tsx`

**Verification gate**

- `/car-remaps` renders without iframe.
- Selection flow works fully and matches known Viezu figures for sample vehicles.
- No regressions to existing page sections/styles.

---

## 6) Make-level AEO/SEO pages (`/car-remaps/[make]`) with semantic tables + JSON-LD

1. Add statically generated make pages (`generateStaticParams` from dataset).
2. Render crawlable HTML tables server-side (no JS-required rendering).
3. Add page metadata and internal linking from `/car-remaps`.
4. Add site-local JSON-LD generator for tuning data (`Product`/`Service`-style with offers), plus breadcrumb.

**Files**

- Create: `sites/dch-automotive/app/car-remaps/[make]/page.tsx`
- Create: `sites/dch-automotive/app/car-remaps/[make]/loading.tsx` (optional)
- Create: `sites/dch-automotive/lib/car-remaps/schema.ts` (site-local generator)
- Modify: `sites/dch-automotive/lib/schema.ts` only if needed for composition
- Modify: `sites/dch-automotive/app/car-remaps/page.tsx` (links to make pages)

**Verification gate**

- Build outputs one page per in-scope make.
- View-source includes full tables and valid JSON-LD blocks.
- Rich-result/schema validation passes for sample pages.

---

## 7) Public JSON API (curl-able, same lookup as UI)

Create a public endpoint backed by the same repository module.

**Proposed endpoint**

- `GET /api/car-remaps/lookup`
  - Query params:
    - `make` (slug, required)
    - `model` (slug, optional)
    - `fuelType` (optional)
    - `variant` (optional)
  - Returns:
    - available next-level options
    - matched tuning rows when fully specified
    - `canonicalUrl` for citation
    - `sourceUpdatedAt`

Follow site API convention (`runtime='nodejs'`, `dynamic='force-dynamic'`, delegate handler).

**Files**

- Create: `sites/dch-automotive/app/api/car-remaps/lookup/route.ts`
- Create: `sites/dch-automotive/lib/api/car-remaps-lookup-route.ts`

**Verification gate**

- `curl` responses stable and typed.
- Returned records match UI for same selection.
- Error responses for invalid params are explicit and consistent.

---

## 8) MCP server endpoint (remote, testable, tool-based)

Implement MCP with compatibility check first.

1. **Compatibility decision gate (before package install)**
   - Verify current MCP hosting options for Next.js App Router + Node runtime.
   - Verify zod peer compatibility with existing `zod@^4.1.11`.
   - If package requires zod v3 only, choose one:
     - route-local adapter that avoids zod coupling, or
     - alternate MCP library with zod v4 support, or
     - minimal protocol implementation for required tool.
2. Implement MCP endpoint with at least one tool:
   - Tool name: `lookup_vehicle_tuning`
   - Input: `{ make, model?, fuelType?, variant? }`
   - Output:
     - tuning rows (same core fields as JSON API)
     - `canonicalUrl` (make/result citation URL)
     - `lastSyncedAt`
3. Keep MCP tool logic calling same repository (no duplicated business logic).

**Files**

- Create: `sites/dch-automotive/app/api/mcp/route.ts`
- Create: `sites/dch-automotive/lib/api/mcp-route.ts`
- Create: `sites/dch-automotive/lib/car-remaps/mcp-tools.ts`
- Modify: `sites/dch-automotive/package.json` (MCP deps once compatibility is confirmed)

**Verification gate**

- MCP endpoint responds to inspector (`npx @modelcontextprotocol/inspector`).
- Tool call returns correct result + canonical URL.
- No zod dependency conflict in install/type-check/build.

---

## 9) Pipe-delimited field interpretation and confidence controls

Because field semantics are uncertain, codify conservative handling now.

1. Keep raw + parsed token arrays in data model.
2. UI/API default to first token (`primary`) for parity unless a validated mapping exists.
3. Add sync-time warning when token counts differ across related fields.
4. Add manual validation checklist against known live examples (including DAF/HGV screenshot pattern if included in scope).

**Files**

- Modify: `sites/dch-automotive/lib/car-remaps/types.ts`
- Modify: `sites/dch-automotive/scripts/car-remaps/normalize.ts`
- Create: `sites/dch-automotive/docs/car-remaps-data-semantics.md`

**Verification gate**

- Warnings surfaced in sync report, not hidden.
- No parser crashes from mixed single/pipe values.

---

## 10) QA, performance, and release readiness

1. Run full checks:
   - `pnpm type-check`
   - `pnpm --filter dch-automotive run lint`
2. Build and smoke test:
   - `/car-remaps`
   - `/car-remaps/[make]`
   - `/api/car-remaps/lookup`
   - `/api/mcp`
3. Confirm dataset freshness workflow:
   - manual re-sync command documented and run before deploy.
4. Document operational runbook:
   - how to re-sync
   - how to spot parser drift
   - how to validate against live pages quickly.

**Files**

- Create: `sites/dch-automotive/docs/car-remaps-runbook.md`
- Optionally create: `sites/dch-automotive/docs/car-remaps-test-matrix.md`

**Verification gate**

- All acceptance criteria checked off.
- PR targets `develop` only; no direct `staging`/`main`.

---

## Key risks and trade-offs

1. **Viezu markup/plugin changes** may break extraction
   - Mitigation: fixture tests + explicit parse-failure reporting + sync abort thresholds.

2. **Category scope drift (Car/Van/HGV)** can inflate page count / thin content risk
   - Mitigation: config-based inclusion + explicit stakeholder sign-off before broadening.

3. **MCP ecosystem churn / dependency mismatch (zod v3 vs v4)**
   - Mitigation: compatibility gate before implementation, fallback path not tied to conflicting package.

4. **Ambiguous pipe-delimited semantics**
   - Mitigation: preserve raw values, use conservative primary token, document uncertainty, add warnings.

5. **Data staleness (manual sync only in this pass)**
   - Mitigation: pre-deploy sync checklist and manifest timestamp surfaced in API/MCP output.

/plan.with.codex synthesise output/sessions/codex-peer-review/2026-07/2026-07-10_car-remaps-reckoner-aeo-mcp/
