1. **Phase 0 — Scope Reconciliation and Decision Log (must complete before implementation)**
   1.1 Create a short decision log to resolve brief contradictions and lock assumptions.  
   **File created:**
   - `output/sessions/codex-peer-review/2026-04/2026-04-19_component-catalog-and-ui-library/codex-plan.md` (this plan, with explicit assumptions section at top)

     1.2 Record and resolve key scope gaps:

   - Conflict: “Do not modify existing composable components” vs requirement to annotate internal rendered elements with field labels.
   - Conflict: “No default exports” vs Next.js `app/**/page.tsx` requirement.
   - Ambiguity: whether catalog should include implementation-ready schema stubs for future components.
   - Ambiguity: whether Header/Footer should be documented as _future composition model_ vs _current runtime integration_.

     1.3 Lock architecture decisions for this cycle:

   - **No changes** to composition schema or existing 7 components.
   - UI library uses **CSS selector-based annotation overlays** (component wrapper + descendant selectors), not DOM mutation.
   - Header/Footer documented as **future global config blocks** (`headerConfig`, `footerConfig`) outside per-page sections; no runtime implementation now.
   - Animation documented as **global preset + per-section `motionConfig` override**, modeled as future top-level section field (not in `layout`).

   **Verification Gate 0:** Stakeholder sign-off on contradictions and decisions before writing docs/code.  
   **Risks/Trade-offs:**
   - CSS selector labeling is brittle to internal markup changes.
   - Catalog may be ahead of current code schema (intentional, documented as “future contract”).

---

2. **Phase 1 — Build the Master Catalog Document Structure**
   2.1 Author canonical catalog skeleton with machine-parse-friendly repeated section schema.  
   **File created:**
   - `output/sessions/2026-04/2026-04-19_component-catalog-and-ui-library/component-catalog.md`

     2.2 Use a strict per-component template:

   - Purpose
   - Data fields table (name, type, required, default, description, example)
   - Slots table (boolean toggles + controlled element)
   - Layout params table (allowed values + behavior)
   - Motion behavior (global preset behavior + `motionConfig` override fields)
   - Interaction states (hover/focus/active, keyboard/accessibility notes)
   - Content constraints (length, image ratios, max items)
   - Example JSON payload
   - Open implementation notes (if not yet built)

     2.3 Add global sections at top:

   - Naming conventions and typing conventions
   - Shared `layout` glossary
   - Shared slot semantics
   - Global animation model:
     - `motionPreset: "none" | "subtle" | "energetic"` (site/global)
     - `motionConfig` per section override (future):
       - `enter`, `stagger`, `hover`, `parallax`, `reduceMotionBehavior`
   - Interaction model and accessibility baseline (focus-visible, reduced-motion fallback, touch behavior)

   **Verification Gate 1:** Catalog skeleton exists with all required headings and repeatable schema format.  
   **Risks/Trade-offs:**
   - Over-structuring improves machine parsing later but increases authoring overhead now.

---

3. **Phase 2 — Populate Catalog for Existing and Gap Components**
   3.1 Document all 7 existing composable components from current source contracts:
   - HeroSection
   - ServiceCards
   - FeatureGrid
   - TestimonialGrid
   - StatsStrip
   - CTASection
   - ContentSection

     3.2 Document 6 gap components (not implemented):

   - PortfolioGrid
   - ContactFormSection
   - BlogGrid
   - AccordionSection
   - LogoStrip
   - PricingTable

     3.3 Add required non-current catalog entries:

   - HeaderSection (exhaustive variants)
   - FooterSection (variant options)
   - TextSection (policy/about/terms prose-first section)

     3.4 For HeaderSection, explicitly cover:

   - Nav modes: inline / hamburger-only / dropdown / mega menu
   - State modes: sticky / transparent-on-scroll / solid
   - Mobile behavior: overlay / drawer / collapsed
   - Mega menu: single-column / multi-column / with images
   - CTA placement: inline / floating / none
   - Logo position: left / center
   - Recommendation: **future `headerConfig` global block**, not page section

     3.5 Add “future schema stubs” appendix (non-executable):

   - TypeScript interface snippets
   - Zod fragment sketches
   - Marked as proposal-only, no code changes in this task

   **Files modified:**
   - `output/sessions/2026-04/2026-04-19_component-catalog-and-ui-library/component-catalog.md`

   **Verification Gate 2:** Acceptance checklist pass for catalog coverage:
   - 7 existing + 6 gap + Header + Footer + TextSection
   - animation model documented
   - interaction states documented per component  
     **Risks/Trade-offs:**
   - Future schema stubs may drift unless tied to ADR/change control.

---

4. **Phase 3 — Implement `/ui-library` Route (Server page + single Client wrapper)**
   4.1 Create server route file that renders all 7 existing components with realistic local-service sample data and variant examples (single-scroll layout with section anchors).  
   **File created:**
   - `sites/poc-composition-test/app/ui-library/page.tsx`

     4.2 Create one client wrapper component containing:

   - “Show field labels” toggle state
   - wrapper `data-show-field-labels` attribute
   - optional legend panel for color coding  
     **File created:**
   - `sites/poc-composition-test/app/ui-library/ui-library-toggle.tsx`

     4.3 Create field annotation stylesheet:

   - CSS-only outlines/labels via pseudo-elements
   - selectors scoped to `[data-show-field-labels="true"]`
   - component wrappers with `data-component="HeroSection"` etc.
   - descendant selectors for key rendered elements (e.g., heading, subheading, CTA, card title) mapped to field names  
     **File created:**
   - `sites/poc-composition-test/app/ui-library/field-labels.css`

     4.4 (Optional but recommended for maintainability) Extract sample payloads and selector maps:

   - `ui-library-sample-data.ts` (typed sample data per component)
   - `ui-library-field-map.ts` (documentation object matching CSS labels)  
     **Files created:**
   - `sites/poc-composition-test/app/ui-library/ui-library-sample-data.ts`
   - `sites/poc-composition-test/app/ui-library/ui-library-field-map.ts`

     4.5 Ensure route remains self-contained:

   - No changes to `composition.json`
   - No changes to existing pages
   - No `use client` added to composable components

   **Verification Gate 3:**
   - `/ui-library` renders all 7 components
   - toggle visibly turns labels on/off
   - no runtime errors in dev server  
     **Risks/Trade-offs:**
   - Selector-based labels can break when component DOM structure changes.
   - Precision of field-to-element mapping depends on stable semantic markup.

---

5. **Phase 4 — Type Safety, Lint, and Constraint Compliance**
   5.1 Enforce strict typing in UI library helpers/components:
   - no `any`
   - explicit interfaces for sample data shapes used by page/wrapper

     5.2 Validate styling constraints:

   - no hardcoded hex values in CSS
   - use token variables/classes only (`var(--token-...)` or token utility classes)
   - no Tailwind `theme()` function in CSS

     5.3 Confirm architectural constraints:

   - single client component wrapper only
   - existing composable components remain server components
   - scoped file-local additions only

   **Files modified (as needed):**
   - `sites/poc-composition-test/app/ui-library/page.tsx`
   - `sites/poc-composition-test/app/ui-library/ui-library-toggle.tsx`
   - `sites/poc-composition-test/app/ui-library/field-labels.css`
   - `sites/poc-composition-test/app/ui-library/ui-library-sample-data.ts`
   - `sites/poc-composition-test/app/ui-library/ui-library-field-map.ts`

   **Verification Gate 4:**
   - Run `npm run type-check` from `sites/poc-composition-test/` (must pass)
   - Run lint (if configured) and fix violations  
     **Risks/Trade-offs:**
   - Strict typing may require lightweight local interfaces duplicating component contracts.

---

6. **Phase 5 — Final QA and Handoff**
   6.1 Validate acceptance criteria one-by-one:
   - Catalog file exists at exact required path
   - `/ui-library/page.tsx` exists and works
   - All 7 components shown with realistic data
   - Field label toggle present and functional
   - Type-check passes

     6.2 Add explicit “Known limitations” section to catalog or plan notes:

   - Field labels implemented through CSS selector mapping, not intrinsic component metadata
   - Header/Footer/TextSection are documented contracts, not implemented sections
   - Future schema updates required to operationalize animation/header/footer contracts

     6.3 Prepare synthesis-ready output in peer-review folder.  
     **File confirmed:**

   - `output/sessions/codex-peer-review/2026-04/2026-04-19_component-catalog-and-ui-library/codex-plan.md`

   **Verification Gate 5:** Final manual review and path validation complete.

---

7. **Primary Risks and Trade-offs Summary**
   7.1 **Biggest risk:** field-label fidelity without modifying components.  
   **Mitigation:** keep mappings to prominent elements only; add legend; document brittleness.

   7.2 **Schema drift risk:** catalog defines future fields not in runtime schema.  
   **Mitigation:** clearly mark “proposed/future” sections and append stubs as non-binding.

   7.3 **Header/Footer architecture risk:** global layout concern conflicts with per-page composer.  
   **Mitigation:** recommend `headerConfig/footerConfig` root blocks for future; do not force per-page duplication.

   7.4 **Scope creep risk:** UI library turning into component playground/editor.  
   **Mitigation:** static examples + simple toggle only; no editor controls.

`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04/2026-04-19_component-catalog-and-ui-library/`
