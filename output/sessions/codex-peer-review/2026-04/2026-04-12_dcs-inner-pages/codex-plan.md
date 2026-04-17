I’ll create `codex-plan.md` in the requested folder with a structured, phased implementation plan, then return the exact synthesise command.

# `codex-plan.md`

## DCS Inner Pages Prototype Implementation Plan (Independent Codex Review)

1. **Foundation + Source Lock (must happen first)**
   - **Read in full:**  
     `output/sessions/2026-04-10_dcs-site-redesign/outputs/2026-04-10_204434/r2-f-bg-variants/bg-b-soft-blue-white.html`
   - **Extract and freeze (verbatim):**
     - `<head>` font import + core tokens (`--ease-out`, radii, palette, typography baseline)
     - shared **header** block
     - shared **footer** block
     - shared animation keyframes (`fadeSlideUp`, `solarisFloatA/B/C/D`)
     - shared reveal JS (Intersection Observer)
   - **Working artifacts (temporary, in session folder):**
     - `_reference-homepage.html` (copied source for local diffing)
     - `_shared-header.html` (verbatim snippet)
     - `_shared-footer.html` (verbatim snippet)
     - `_shared-motion.css` + `_shared-reveal.js` (or equivalent notes)
   - **Verification gate:**
     - Confirm header/footer snippets are byte-identical to source (hash or diff).
     - Confirm Google Fonts URL matches homepage exactly.

2. **Page Archetype Spec (before generating files)**
   - Define 6 archetypes to reduce drift:
     1. **Index grid:** services, locations, blog, projects, reviews
     2. **Detail + sidebar:** service-detail, location-detail, blog-post
     3. **Detail full-width prose + CTA tail:** project-detail
     4. **Narrative/company:** about
     5. **Form + info panel:** contact
     6. **Commercial pricing complex:** pricing
   - For each archetype, define:
     - hero structure (with/without breadcrumb)
     - section order
     - card pattern usage
     - where geometric shapes are allowed (selective only)
   - **Verification gate:**
     - Every required page maps cleanly to one archetype.
     - No page requires header/footer redesign.

3. **Generation Order (risk-first, then batch)**
   - **Wave 1 (highest complexity first):**
     - `pricing.html` (sets commercial UI patterns and interaction style)
   - **Wave 2 (detail layouts):**
     - `service-detail.html`, `location-detail.html`, `blog-post.html`, `project-detail.html`
   - **Wave 3 (index grids + narrative/form):**
     - `services.html`, `locations.html`, `blog.html`, `projects.html`, `reviews.html`, `about.html`, `contact.html`
   - **Why:** de-risk pricing and long-form/detail patterns early; apply learned components to simpler pages.
   - **Verification gate after each wave:**
     - Visual identity check vs homepage
     - Shared shell unchanged
     - No missing required sections

4. **Pricing Page Implementation Strategy (`pricing.html`)**
   - **Interaction approach:** vanilla JS toggle (`Upfront + Monthly` vs `Pay Monthly`) with:
     - semantic buttons (`aria-pressed`)
     - table values swapped via data attributes or dual table bodies toggled by class
     - transform/opacity transitions only
   - **Required sections (in order):**
     1. Hero
     2. Payment toggle
     3. 3-tier comparison table
     4. “What every site gets”
     5. Tier differences
     6. Add-ons (8–10 items)
     7. FAQ accordion (vanilla JS, accessible)
     8. CTA banner
   - **Data fidelity:** use exact pricing numbers and add-ons from brief.
   - **Verification gate:**
     - Toggle switches all displayed tier prices correctly.
     - Year 1 totals match provided tables.
     - FAQ accordion keyboard-usable.

5. **Shared Motion + Reveal Pattern Decision**
   - Because outputs must be self-contained, **each HTML file includes its own copy** of:
     - keyframes
     - `.reveal` styles
     - Intersection Observer script
   - Keep script logic identical across all pages for consistency and lower bug risk.
   - **Verification gate:**
     - All animated sections reveal on scroll.
     - No layout-jank transitions (only `transform` + `opacity`).

6. **Content Depth Rules for Prototypes**
   - Use **representative, realistic content** (not lorem) with moderate depth:
     - Index cards: concise excerpts
     - Detail pages: enough prose to validate rhythm, spacing, sticky sidebars, CTA behavior
     - Blog/project content: plausible headings, paragraphs, lists, pull quotes where useful
   - Include provided domain content:
     - 4 services
     - 8 locations
     - 3 projects (Colossus Scaffolding, DJ Fox Electrical, Painter & Decorator in Brighton)
   - **Verification gate:**
     - Every page communicates real structure and conversion intent, not placeholder skeletons.

7. **File Creation Plan (12 outputs)**
   - Create in:  
     `output/sessions/2026-04-12_dcs-inner-pages/`
   - Files:
     - `services.html`
     - `service-detail.html`
     - `locations.html`
     - `location-detail.html`
     - `blog.html`
     - `blog-post.html`
     - `projects.html`
     - `project-detail.html`
     - `reviews.html`
     - `about.html`
     - `contact.html`
     - `pricing.html`
   - **Verification gate:**
     - Exactly 12 HTML files exist, all open standalone in browser.

8. **Quality Gates (automated + manual)**
   - **Automated checks (lightweight):**
     - Ensure each file contains:
       - Google Fonts import
       - shared header marker
       - shared footer marker
       - `.reveal` class and observer script
     - Grep for forbidden patterns:
       - external icon libs
       - non-CDN dependencies
       - transitions on `top/left/width`
   - **Manual checks:**
     - Compare header/footer byte-for-byte or strict diff against frozen snippets.
     - Spot-check responsive behavior at common widths.
     - Confirm palette/type consistency and card hover accent behavior.
   - **Verification gate:**
     - All checks pass before sign-off.

9. **Risks / Trade-offs**
   - **Risk:** header/footer drift during repeated manual copy.  
     **Mitigation:** frozen verbatim snippets + hash/diff check each file.
   - **Risk:** over-animating inner pages vs homepage tone.  
     **Mitigation:** keep motion intensity moderate, selective geo shapes.
   - **Risk:** pricing toggle complexity introduces fragility.  
     **Mitigation:** simple state model, accessible controls, minimal DOM mutation.
   - **Trade-off:** duplicated CSS/JS across 12 files (self-contained requirement) increases maintenance, but is correct for this prototype stage and Stitch handoff.

10. **Execution Notes (Skill Settings Enforcement)**
    - All page generation prompts must explicitly set:
      - `design-taste-frontend`
      - `DESIGN_VARIANCE: 8`
      - `MOTION_INTENSITY: 6`
      - `VISUAL_DENSITY: 5`
    - Keep these fixed across all 12 files for coherent family resemblance.

---

/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-12_dcs-inner-pages/
