# YOLO Implementation Brief: Expand Stitch Pipeline Page Coverage

**Branch:** feature/stitch-pipeline-page-coverage (created from develop)
**Session spec:** output/sessions/2026-04-06_stitch-pipeline-page-coverage/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The `/pipeline.stitch-design` skill generates 5 Stitch screens (home, about, contact, services, service-detail) and produces 5 TSX pages in the test site. Real client sites have 14+ routes: blog listing/detail, locations listing/detail, projects/portfolio listing/detail, and policy pages (privacy, cookie). The pipeline test site can't validate these page patterns because they don't exist.

This brief adds:

- 2 new Stitch screens: blog listing + blog detail (prose-heavy, warrants distinct design)
- 6 new TSX pages in Step 5g: locations listing+detail and projects listing+detail (adapted from existing screens), plus privacy-policy and cookie-policy (typography-only templates, no Stitch screen)
- Updated verification gates, file counts, and report URLs throughout the skill

Locations detail and projects detail reuse/adapt the service-detail HTML rather than generating new Stitch screens — they share enough structure. Policy pages need no Stitch design input.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80 / $4             | Mechanical tasks: find-replace, count updates, string substitutions                                 |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
# Verification gate — STOP if this fails
git checkout develop && git pull
git checkout -b feature/stitch-pipeline-page-coverage
pnpm type-check   # must be clean before starting
```

Read `.claude/commands/pipeline.stitch-design.md` in full before beginning. It is 996 lines — read it completely. This is the only file being modified.

---

## Phase 1: Add Blog Listing + Blog Detail Screens to Step 2c-ii

**Goal:** The pipeline requests 7 Stitch screens instead of 5. Add blog listing and blog detail to the generation table in Step 2c-ii.
**Model:** sonnet — precise prose insertion into a markdown instruction file

Read `.claude/commands/pipeline.stitch-design.md` and locate the table in `2c-ii` (around line 326–331) that lists the 4 remaining screens (About, Contact, Services, Service Detail).

**Add two rows** to that table:

| Screen      | Slug          | Page-specific sections                                                                                                                                                                                                  |
| ----------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blog        | `blog`        | Breadcrumb, page header, article card grid (6 cards: featured image, category tag, title, excerpt, read-time, author avatar + name, "Read more" link), pagination controls, sidebar with categories + recent posts      |
| Blog Detail | `blog-detail` | Breadcrumb, full-bleed hero with title + author + date + read-time, article body (rich prose: dropcap first paragraph, pull-quote block, body text, subheadings), author bio card, related articles (3 cards), CTA band |

**Also update** the verification gate comment immediately after the table. Change:

```
# Confirm list_screens returns exactly 5 screens for $PROJECT_ID
```

to:

```
# Confirm list_screens returns exactly 7 screens for $PROJECT_ID
```

```bash
# Verification gate — STOP if this fails
grep -c "blog\|blog-detail" .claude/commands/pipeline.stitch-design.md
# Must be > 0 (confirms new rows inserted)

grep "exactly 7 screens" .claude/commands/pipeline.stitch-design.md
# Must return a match
```

**Commit:**

```bash
git add .claude/commands/pipeline.stitch-design.md
git commit -m "$(cat <<'EOF'
feat(pipeline): add blog listing and blog detail Stitch screens

Expands Step 2c-ii from 4 to 6 additional screens (7 total including home).
Blog listing: article card grid with sidebar. Blog detail: prose-heavy
article layout with author bio, related articles, and CTA band.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Update Step 3 Download Verification Gates

**Goal:** Step 3 verification gates reference 7 HTML files, not 5.
**Model:** haiku — string substitutions

In `.claude/commands/pipeline.stitch-design.md`, locate the Step 3 verification `ls` block (around line 428–440). It currently lists 5 HTML files:

```
ls output/ingestion/$THEME_NAME-stitch/html/home.html
ls output/ingestion/$THEME_NAME-stitch/html/about.html
ls output/ingestion/$THEME_NAME-stitch/html/contact.html
ls output/ingestion/$THEME_NAME-stitch/html/services.html
ls output/ingestion/$THEME_NAME-stitch/html/service-detail.html
```

**Add two lines** after `service-detail.html`:

```
ls output/ingestion/$THEME_NAME-stitch/html/blog.html
ls output/ingestion/$THEME_NAME-stitch/html/blog-detail.html
```

**Update the count comment** from `# All 9 files must exist and be non-empty` to `# All 11 files must exist and be non-empty`.

Also locate the Step 7 final report section where it lists `html/` asset contents. Update the comment from:

```
html/           — 5 page exports (home, about, contact, services, service-detail)
```

to:

```
html/           — 7 page exports (home, about, contact, services, service-detail, blog, blog-detail)
```

```bash
# Verification gate — STOP if this fails
grep "All 11 files must exist" .claude/commands/pipeline.stitch-design.md
# Must return a match

grep "7 page exports" .claude/commands/pipeline.stitch-design.md
# Must return a match
```

**Commit:**

```bash
git add .claude/commands/pipeline.stitch-design.md
git commit -m "$(cat <<'EOF'
feat(pipeline): update Step 3 verification gates for 7 HTML files

Updates ls verification block and file count comments to account for
the new blog.html and blog-detail.html exports.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Extend Step 5g — 8 New TSX Pages

**Goal:** Step 5g instructs the pipeline to generate 8 additional TSX pages (blog listing+detail from Stitch HTML, locations listing+detail adapted from services/service-detail HTML, projects listing+detail adapted similarly, plus two policy page templates).
**Model:** sonnet — significant prose additions to the skill file

Locate Step 5g in `.claude/commands/pipeline.stitch-design.md`. It currently lists 5 files to create/replace (around line 696–703):

```
sites/$THEME_NAME-test/app/layout.tsx
sites/$THEME_NAME-test/app/globals.css
sites/$THEME_NAME-test/app/page.tsx
sites/$THEME_NAME-test/app/about/page.tsx
sites/$THEME_NAME-test/app/contact/page.tsx
sites/$THEME_NAME-test/app/services/page.tsx
sites/$THEME_NAME-test/app/services/[first-service-slug]/page.tsx
```

**Add the following 8 entries** to that list:

```
sites/$THEME_NAME-test/app/blog/page.tsx                         — blog listing (from Stitch blog.html)
sites/$THEME_NAME-test/app/blog/[slug]/page.tsx                  — blog detail (from Stitch blog-detail.html; use first article title as static slug)
sites/$THEME_NAME-test/app/locations/page.tsx                    — locations listing (adapted from services listing HTML)
sites/$THEME_NAME-test/app/locations/[slug]/page.tsx             — location detail (adapted from service-detail HTML)
sites/$THEME_NAME-test/app/projects/page.tsx                     — projects listing (adapted from services listing HTML)
sites/$THEME_NAME-test/app/projects/[slug]/page.tsx              — project detail (adapted from service-detail HTML)
sites/$THEME_NAME-test/app/privacy-policy/page.tsx               — static prose template (no Stitch source)
sites/$THEME_NAME-test/app/cookie-policy/page.tsx                — static prose template (no Stitch source)
```

**After the existing Rules section in 5g**, add a new subsection titled `**Adaptation rules for non-Stitch pages:**`

Insert this content:

```
**Adaptation rules for non-Stitch pages:**

*Locations listing* — adapt from `services.html`. Swap service icon cards for location cards: use Material Symbols `location_on` icon instead of service icons. Card content: town/area name as heading, county or tagline as subheading, "View services →" link. No image required. Keep the same card-grid section structure and CTA band.

*Location detail* — adapt from `service-detail.html`. Replace the benefits card with a "Services in [area]" card (list of 4–5 service names with links). Replace the FAQ accordion with a "Local info" section (travel time placeholder, service radius, nearby landmark note). Keep the gallery placeholder and CTA panel.

*Projects listing* — adapt from `services.html`. Cards are image-dominant (full-bleed top image, matching the services card style). Fields: project title as heading, trade/type badge, one-sentence scope, "View project →" link. 3-column grid.

*Project detail* — adapt from `service-detail.html`. Lead with a 2-image overview gallery (use stitch images). Replace the benefits card with a "Project scope" list (4 bullet points of what was done). Replace the FAQ accordion with a client testimonial (pull-quote, star rating row, client name). Keep the CTA panel.

*Blog listing and blog detail* — generated directly from `blog.html` and `blog-detail.html` respectively (same approach as services and service-detail). No adaptation needed — follow the standard Stitch HTML → TSX conversion rules.

*Policy pages (privacy-policy, cookie-policy)* — no Stitch source. Generate a clean two-column prose layout using theme tokens only:
- Left column (sticky on desktop): nav sidebar with anchor links to H2 sections — "Data we collect", "How we use it", "Cookies", "Your rights", "Contact us"
- Right column: prose content — placeholder paragraphs under each H2 heading
- On mobile: sidebar collapses to a `<details>` / `<summary>` "Jump to section" toggle
- Typography only — use `text-surface-foreground`, `text-h2`, `text-h3` tokens; no hardcoded hex
- No images, no CTA band — minimal typographic layout
```

```bash
# Verification gate — STOP if this fails
grep "blog/page.tsx" .claude/commands/pipeline.stitch-design.md
# Must return a match

grep "privacy-policy/page.tsx" .claude/commands/pipeline.stitch-design.md
# Must return a match

grep "Adaptation rules for non-Stitch pages" .claude/commands/pipeline.stitch-design.md
# Must return a match
```

**Commit:**

```bash
git add .claude/commands/pipeline.stitch-design.md
git commit -m "$(cat <<'EOF'
feat(pipeline): add 8 new TSX pages to Step 5g

Adds blog listing+detail (from Stitch HTML), locations listing+detail
and projects listing+detail (adapted from services/service-detail HTML),
and privacy/cookie policy pages (typography-only templates, no Stitch source).
Includes adaptation rules for each non-Stitch page type.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Update Step 5g Verification Gates

**Goal:** The 5g verification gates check for all 13 TSX pages, not just the original 4.
**Model:** haiku — targeted string replacements

Locate the Step 5g verification gate bash block (around line 830–840). It currently reads:

```bash
ls sites/$THEME_NAME-test/app/{page.tsx,about/page.tsx,contact/page.tsx,services/page.tsx} | wc -l
# Must be 4
```

**Change the comment** from `# Must be 4` to `# Must be 4 (core Stitch pages)`.

**Add a second check** immediately after:

```bash
ls sites/$THEME_NAME-test/app/blog/page.tsx \
   "sites/$THEME_NAME-test/app/blog/[slug]/page.tsx" \
   sites/$THEME_NAME-test/app/locations/page.tsx \
   "sites/$THEME_NAME-test/app/locations/[slug]/page.tsx" \
   sites/$THEME_NAME-test/app/projects/page.tsx \
   "sites/$THEME_NAME-test/app/projects/[slug]/page.tsx" \
   sites/$THEME_NAME-test/app/privacy-policy/page.tsx \
   sites/$THEME_NAME-test/app/cookie-policy/page.tsx | wc -l
# Must be 8
```

```bash
# Verification gate — STOP if this fails
grep "Must be 4 (core Stitch pages)" .claude/commands/pipeline.stitch-design.md
# Must return a match

grep "Must be 8" .claude/commands/pipeline.stitch-design.md
# Must return a match
```

**Commit:**

```bash
git add .claude/commands/pipeline.stitch-design.md
git commit -m "$(cat <<'EOF'
feat(pipeline): extend Step 5g verification gates for 13 TSX pages

Updates the post-generation ls check to verify all 8 additional pages
(blog, locations, projects, policy pages) exist in the test site.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Update Step 7 Final Report URLs and Counts

**Goal:** The final report summary reflects 13 TSX pages and lists all dev server URLs.
**Model:** haiku — string substitutions in the report section

Locate the Step 7 final report section. It currently has:

- A "Stitch comparison" URL block listing 5 routes
- The text "5 Stitch-derived TSX pages" in the next steps list

**Add to the Stitch comparison URL block:**

```
http://localhost:3000/blog
http://localhost:3000/blog/[first-article-slug]
http://localhost:3000/locations
http://localhost:3000/locations/[first-location-slug]
http://localhost:3000/projects
http://localhost:3000/projects/[first-project-slug]
http://localhost:3000/privacy-policy
http://localhost:3000/cookie-policy
```

**Update** "5 Stitch-derived TSX pages" → "13 TSX pages (7 from Stitch screens + 6 adapted/templated)"

```bash
# Verification gate — STOP if this fails
grep "13 TSX pages" .claude/commands/pipeline.stitch-design.md
# Must return a match

grep "privacy-policy" .claude/commands/pipeline.stitch-design.md | wc -l
# Must be > 1 (appears in both 5g file list and report URLs)
```

**Commit:**

```bash
git add .claude/commands/pipeline.stitch-design.md
git commit -m "$(cat <<'EOF'
feat(pipeline): update Step 7 report to reflect 13 TSX pages

Adds 8 new dev server comparison URLs to the final report and updates
the next-steps page count from 5 to 13.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Cost Estimate

| Phase                               | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ----------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: add blog screens           | sonnet | ~8k               | ~1k                | ~$0.04     |
| Phase 2: Step 3 gate updates        | haiku  | ~6k               | ~0.5k              | ~$0.007    |
| Phase 3: Step 5g 8 new pages        | sonnet | ~10k              | ~2k                | ~$0.06     |
| Phase 4: Step 5g verification gates | haiku  | ~6k               | ~0.5k              | ~$0.007    |
| Phase 5: Step 7 report URLs         | haiku  | ~6k               | ~0.3k              | ~$0.005    |
| **Total**                           |        | **~36k**          | **~4.3k**          | **~$0.12** |

Rates: Sonnet $3/$15, Haiku $0.80/$4 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Confirm `.claude/commands/pipeline.stitch-design.md` final line count (should be ~1,100+)
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    |                   |                    | $X.XX     |
   | haiku     |                   |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-06_stitch-pipeline-page-coverage/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was changed in the skill file, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read `.claude/commands/pipeline.stitch-design.md` in full before any edit
- Never push — leave all changes on the feature branch
- Minimal changes only — edit only what the plan specifies; do not reformat or restructure surrounding content
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for prose additions
- The Co-Authored-By line in commits must say `Claude Sonnet 4.6`

---

## Completed

**Date:** 2026-04-06
**Status:** All phases executed successfully

All 5 phases modified `.claude/commands/pipeline.stitch-design.md` (996 → 1044 lines). Phase 1 added blog listing and blog detail rows to the Step 2c-ii screen generation table and updated the verification gate from 5 to 7 screens. Phase 2 added blog.html and blog-detail.html to the Step 3 download ls block and updated the file count comment from 9 to 11. Phase 3 added 8 new TSX page entries to the Step 5g file list (blog listing+detail, locations listing+detail, projects listing+detail, privacy-policy, cookie-policy) plus a full "Adaptation rules for non-Stitch pages" subsection. Phase 4 updated the 5g verification gate to check for 4 core Stitch pages and 8 additional adapted/templated pages separately. Phase 5 added 8 new dev server URLs to the Step 7 comparison block and updated the next-steps count from "5 Stitch-derived TSX pages" to "13 TSX pages (7 from Stitch screens + 6 adapted/templated)". All verification gates passed.

### Commits

- `7171e88` feat(pipeline): add blog listing and blog detail Stitch screens
- `5e6547c` feat(pipeline): update Step 3 verification gates for 7 HTML files
- `d314732` feat(pipeline): add 8 new TSX pages to Step 5g
- `2569685` feat(pipeline): extend Step 5g verification gates for 13 TSX pages
- `70e4f68` feat(pipeline): update Step 7 report to reflect 13 TSX pages
