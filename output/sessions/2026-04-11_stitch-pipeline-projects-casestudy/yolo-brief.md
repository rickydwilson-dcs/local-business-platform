# YOLO Implementation Brief: Stitch Pipeline — Add Projects and Case Study Screens

**Branch:** feature/stitch-pipeline-projects-casestudy (created from develop)
**Session spec:** output/sessions/2026-04-11_stitch-pipeline-projects-casestudy/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The `/pipeline.stitch-design` skill generates 7 Stitch screens (home, about, contact, services, service-detail, blog, blog-detail), but the projects listing and project detail pages in test sites are adapted from `services.html` and `service-detail.html` rather than genuine Stitch designs. This brief adds 2 new Stitch screens (`projects` and `case-study`) and updates the pipeline skill to use them, so every future test site gets Stitch-designed projects pages.

The only file changed is `.claude/commands/pipeline.stitch-design.md`. No code changes — only skill file edits.

The plan was reviewed and approved. Implement it exactly as specified below.

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
git checkout -b feature/stitch-pipeline-projects-casestudy
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Read the skill file in full

**Goal:** Understand the exact current state of every section that needs editing before making any changes.
**Model:** haiku — read-only

Read the full skill file:

- `.claude/commands/pipeline.stitch-design.md`

Also read these reference files to understand what current adapted output looks like (for contrast):

- `sites/_castor-plumbing/app/projects/page.tsx`
- `sites/_castor-plumbing/app/projects/victorian-bathroom-renovation/page.tsx`
- `sites/_castor-plumbing/app/blog/how-to-spot-a-hidden-water-leak/page.tsx`

Identify the exact line numbers for every section listed in Phase 2 before editing anything. Record them mentally — do not edit yet.

No commit for this phase (reads only).

---

## Phase 2: Edit the skill file — 10 targeted changes

**Goal:** Apply all 10 changes to `.claude/commands/pipeline.stitch-design.md` in order. Read the full file first (Phase 1), then apply each edit sequentially.
**Model:** sonnet

### Change 1 — Step 2c-ii: Add 2 rows to the screen generation table

**Location:** The table at approximately line 350–358 (between `Blog Detail` row and the paragraph that starts "After each screen submission, confirm via `get_project`").

Add two rows **after** the `Blog Detail` row:

```
| Projects | `projects` | Breadcrumb (Home → Projects), page header with H1 "Our Work" + subheading "A selection of recent projects by $COMPANY_NAME[If $LOCATION: across $LOCATION]", optional category filter tab row (All / Residential / Commercial / Heritage), stats bar (4 stats with icons: total projects completed, years in business, repeat client rate, satisfaction rate — accent numbers on muted background), project card grid 3-col (6 cards: full-bleed top image 60% of card, category badge, project title as H3, one-sentence scope, "View project →" arrow link; card hover: image scale + shadow lift), CTA band (brand-primary background, "Ready to start your project?", subheading, two buttons: primary "Get a Quote", secondary "Contact Us") |
| Case Study | `case-study` | Breadcrumb (Home → Projects → [Project Name]), full-bleed hero with project title as H1 + trade/type badge + location tag + completion date badge + gradient overlay on image, 2-col project overview (left: scope summary paragraph + 4-item stats grid with Material Symbols icons e.g. Duration / Budget range / Project type / Outcome; right: featured project image), Challenge band (dark brand-secondary background, H2 "The Challenge", 2–3 paragraphs describing problem scope), Approach section (light background, H2 "Our Approach", 3-step numbered process each with icon; alternating text/image if space allows), 2×2 gallery grid with hover overlay captions ("Before" / "During" / "After" / "Completed view"), Results section (H2 "The Outcome", 4 result cards each with large accent number + label e.g. "3 weeks / On schedule"), client testimonial pull-quote band (5-star rating row, italic blockquote, avatar with initials, client name + location), CTA panel (H2 "Start your own project", subheading, primary "Get a Quote" button, secondary "View more projects" link) |
```

Generation order in the table must be: About, Contact, Services, Service Detail, Blog, Blog Detail, **Projects**, **Case Study** — this is the order Stitch screens are submitted.

### Change 2 — Step 2 fallbacks: Add 2 fallback blocks

**Location:** After the existing `**Fallback: blog-detail screen fails repeatedly**` block (approximately line 361–363). Add these two blocks immediately after:

```
**Fallback: projects screen fails repeatedly**

If `projects` does not appear in `screenInstances` after two attempts (15+ minutes each), skip it. Adapt the projects listing TSX from `services.html` using the existing adaptation rules (3-column image-dominant grid, category badge, scope, "View project →" link). Mark as "adapted-from-services" in `meta/token-mapping-report.json`. This is an acceptable outcome — the pipeline degrades gracefully.

**Fallback: case-study screen fails repeatedly**

If `case-study` does not appear in `screenInstances` after two attempts (15+ minutes each), skip it. Adapt the project case study TSX from `service-detail.html` using the existing adaptation rules (project scope card, testimonial pull-quote, CTA panel). Mark as "adapted-from-service-detail" in `meta/token-mapping-report.json`.
```

### Change 3 — Step 2e: Update heading drift comment

**Location:** Approximately line 377. Find:

```
Run the heading drift report across the 5 downloaded HTML files:
```

Change to:

```
Run the heading drift report across all downloaded HTML files:
```

### Change 4 — Step 3 HTML download: Generalize screen count

**Location:** Approximately line 441. Find:

```
- For each of the 5 screens, call the Stitch HTML export tool → write to `output/ingestion/$THEME_NAME-stitch/html/<slug>.html`
```

Change to:

```
- For each screen (home, about, contact, services, service-detail, blog, blog-detail, projects, case-study — or fewer if any were skipped due to fallback), call the Stitch HTML export tool → write to `output/ingestion/$THEME_NAME-stitch/html/<slug>.html`
```

### Change 5 — Step 3 image parsing: Generalize file count

**Location:** Approximately line 447. Find:

```
1. Parse all 5 HTML files for every unique `https://lh3.googleusercontent.com/` URL
```

Change to:

```
1. Parse all HTML files in `output/ingestion/$THEME_NAME-stitch/html/` for every unique `https://lh3.googleusercontent.com/` URL
```

### Change 6 — Step 3 verification gate: Add 2 new ls lines and update count

**Location:** Approximately lines 454–469. After the line:

```
ls output/ingestion/$THEME_NAME-stitch/html/blog-detail.html
```

Add:

```bash
ls output/ingestion/$THEME_NAME-stitch/html/projects.html
ls output/ingestion/$THEME_NAME-stitch/html/case-study.html
```

Update the comment from:

```
# All 11 files must exist and be non-empty
```

To:

```
# All 13 files must exist and be non-empty (fewer if any screens fell back to adaptation)
```

### Change 7 — Step 5g files list: Replace adapted project entries with Stitch-derived

**Location:** Approximately lines 757–758. Find:

```
- `sites/_$THEME_NAME-$TRADE/app/projects/page.tsx` — projects listing (adapted from services listing HTML)
- `sites/_$THEME_NAME-$TRADE/app/projects/[slug]/page.tsx` — project detail (adapted from service-detail HTML)
```

Replace with:

```
- `sites/_$THEME_NAME-$TRADE/app/projects/page.tsx` — projects listing (from Stitch projects.html)
- `sites/_$THEME_NAME-$TRADE/app/projects/<first-project-slug>/page.tsx` — project case study (from Stitch case-study.html; static named route — see slug derivation in adaptation rules below)
```

Then add this note **after the full files-to-create list** (after the last bullet in that list, before the **Rules:** heading):

```
> **MDX routes must not be overwritten:** `app/blog/[slug]/page.tsx` and `app/projects/[slug]/page.tsx` are MDX-powered dynamic routes copied from base-template. Do NOT replace them with hardcoded Stitch TSX. Only static named example routes (`app/blog/<article-slug>/page.tsx`, `app/projects/<project-slug>/page.tsx`) receive Stitch-designed hardcoded content.
```

### Change 8 — Step 5g adaptation rules: Replace adapted projects text

**Location:** Approximately lines 793–795. Find and replace the two adaptation rule paragraphs for projects:

Find:

```
_Projects listing_ — adapt from `services.html`. Cards are image-dominant (full-bleed top image, matching the services card style). Fields: project title as heading, trade/type badge, one-sentence scope, "View project →" link. 3-column grid.

_Project detail_ — adapt from `service-detail.html`. Lead with a 2-image overview gallery (use stitch images). Replace the benefits card with a "Project scope" list (4 bullet points of what was done). Replace the FAQ accordion with a client testimonial (pull-quote, star rating row, client name). Keep the CTA panel.
```

Replace with:

```
_Projects listing_ — generated directly from `projects.html`. No adaptation needed — follow the standard Stitch HTML → TSX conversion rules exactly.

_Project case study (static named example route)_ — generated directly from `case-study.html`. Follow the standard Stitch HTML → TSX conversion rules exactly.

**Slug derivation for the named project route:** Read `case-study.html` and extract the first `<h1>` element's text content. Convert to kebab-case: lowercase, spaces → hyphens, strip all non-alphanumeric characters except hyphens, truncate to 50 characters. Examples:
- "Victorian bathroom renovation, Eastbourne" → `victorian-bathroom-renovation-eastbourne`
- "Commercial rewire — 3-storey office block" → `commercial-rewire-3-storey-office-block`
- "Rear garden landscaping and paving project" → `rear-garden-landscaping-and-paving-project`

Fallback if H1 extraction returns empty: `example-[trade-kebab]-project` where `[trade-kebab]` is the `$TRADE` argument converted to kebab-case (e.g. `$TRADE = "electrical contractor"` → `example-electrical-contractor-project`).

**After deriving the slug**, update the first project card's `href` in `projects/page.tsx` to point to `/projects/<derived-slug>`.
```

### Change 9 — Step 5g verification gate: Update to reflect named route

**Location:** Approximately lines 924–944. Find the second verification gate block. Locate the two lines:

```
   sites/_$THEME_NAME-$TRADE/app/projects/page.tsx \
   "sites/_$THEME_NAME-$TRADE/app/projects/[slug]/page.tsx" \
```

Remove those two lines from the `ls` block and replace the count check. The full gate should be restructured so that projects/page.tsx is checked with its own `ls`, and the named project route is checked with a glob:

```bash
ls sites/_$THEME_NAME-$TRADE/app/projects/page.tsx
ls sites/_$THEME_NAME-$TRADE/app/blog/page.tsx \
   sites/_$THEME_NAME-$TRADE/app/locations/page.tsx \
   "sites/_$THEME_NAME-$TRADE/app/locations/[slug]/page.tsx" \
   sites/_$THEME_NAME-$TRADE/app/privacy-policy/page.tsx \
   sites/_$THEME_NAME-$TRADE/app/cookie-policy/page.tsx | wc -l
# Must be 5
ls sites/_$THEME_NAME-$TRADE/app/projects/*/page.tsx 2>/dev/null | grep -v '\[slug\]' | wc -l
# Must be >= 1 (the named project example route exists)
```

Also extend the `grep` no-platform-imports check to include the new projects pages:

```bash
grep -l "@platform/core-components\|siteConfig\|getContentItems" \
  sites/_$THEME_NAME-$TRADE/app/page.tsx \
  sites/_$THEME_NAME-$TRADE/app/about/page.tsx \
  sites/_$THEME_NAME-$TRADE/app/contact/page.tsx \
  sites/_$THEME_NAME-$TRADE/app/services/page.tsx \
  sites/_$THEME_NAME-$TRADE/app/projects/page.tsx \
  $(ls sites/_$THEME_NAME-$TRADE/app/projects/*/page.tsx 2>/dev/null | grep -v '\[slug\]') \
  2>/dev/null | wc -l
# Must be 0
```

### Change 10 — Step 5h fidelity review: Expand pages and Step 7 report counts

**Change 10a — Step 5h review prompt (approximately line 952):**

In the `validate-review-prompt.txt` block, find:

```
**Reference material:**
- **Dev server screenshots** (actual rendered output): `output/ingestion/$THEME_NAME-stitch/meta/dev-screenshots/` — `home.png`, `about.png`, `contact.png`, `services.png`, `service-detail.png`. Run `ls` to confirm which exist. **Read these PNG files directly** as the primary visual reference.
- **Stitch HTML exports**: `output/ingestion/$THEME_NAME-stitch/html/` — `home.html`, `about.html`, `contact.html`, `services.html`, `service-detail.html`. These are the source of truth for sections, layout, and CSS class fidelity.
```

Replace with:

```
**Reference material:**
- **Dev server screenshots** (actual rendered output): `output/ingestion/$THEME_NAME-stitch/meta/dev-screenshots/` — `home.png`, `about.png`, `contact.png`, `services.png`, `service-detail.png`, `blog.png`, `blog-detail.png`, `projects.png`, `case-study.png`. Run `ls` to confirm which exist. **Read these PNG files directly** as the primary visual reference.
- **Stitch HTML exports**: `output/ingestion/$THEME_NAME-stitch/html/` — `home.html`, `about.html`, `contact.html`, `services.html`, `service-detail.html`, `blog.html`, `blog-detail.html`, `projects.html`, `case-study.html`. These are the source of truth for sections, layout, and CSS class fidelity.
```

Find the "Pages to compare" list and add after the existing `service-detail` entry:

```
- `meta/dev-screenshots/blog.png` + Fetch rendered `/blog` → compare against `html/blog.html`
- `meta/dev-screenshots/blog-detail.png` + Fetch rendered `/blog/<first-article-slug>` → compare against `html/blog-detail.html`
- `meta/dev-screenshots/projects.png` + Fetch rendered `/projects` → compare against `html/projects.html`
- `meta/dev-screenshots/case-study.png` + Fetch rendered `/projects/<first-project-slug>` → compare against `html/case-study.html`
```

Also find the `/pipeline.validate-site` call's `--pages` argument and expand it:

Find:

```
--pages "/ /about /contact /services /services/[first-service-slug]"
```

Replace with:

```
--pages "/ /about /contact /services /services/[first-service-slug] /blog /blog/[first-article-slug] /projects /projects/[first-project-slug]"
```

**Change 10b — Step 7 report (approximately lines 1100–1134):**

Find:

```
html/ — 7 page exports
```

Replace with:

```
html/ — 9 page exports (home, about, contact, services, service-detail, blog, blog-detail, projects, case-study)
```

Find any text referring to `7 from Stitch screens + 6 adapted/templated` (or similar breakdown) and update to:

```
9 from Stitch screens + 4 adapted/templated (locations listing, location detail, privacy-policy, cookie-policy)
```

In the dev server URL list, add:

```
http://localhost:3000/projects
http://localhost:3000/projects/<first-project-slug>
```

---

```bash
# Verification gate — STOP if this fails
# Confirm the skill file was updated correctly

# 1. Confirm 'projects' and 'case-study' appear in the screen table
grep -c "projects\|case-study" .claude/commands/pipeline.stitch-design.md
# Must be > 2

# 2. Confirm projects.html and case-study.html appear in the Step 3 verification gate
grep "projects.html" .claude/commands/pipeline.stitch-design.md | wc -l
grep "case-study.html" .claude/commands/pipeline.stitch-design.md | wc -l
# Both must be > 0

# 3. Confirm old adapted text is gone
grep "adapted from services listing HTML" .claude/commands/pipeline.stitch-design.md | wc -l
# Must be 0

# 4. Confirm new Stitch-direct text is present
grep "generated directly from \`projects.html\`" .claude/commands/pipeline.stitch-design.md | wc -l
# Must be 1

# 5. Confirm MDX preservation note is present
grep "MDX routes must not be overwritten" .claude/commands/pipeline.stitch-design.md | wc -l
# Must be 1

# 6. Confirm slug derivation rule is present
grep "Slug derivation for the named project route" .claude/commands/pipeline.stitch-design.md | wc -l
# Must be 1
```

**Commit:**

```bash
git add .claude/commands/pipeline.stitch-design.md
git commit -m "$(cat <<'EOF'
feat(pipeline): add projects and case-study Stitch screens

Adds two new Stitch screen generation steps (projects, case-study) to
/pipeline.stitch-design, replacing the previous adaptation of these
pages from services.html and service-detail.html.

Projects listing and project case study pages in future test sites will
now be genuine Stitch designs rather than adapted approximations.

Also extends fidelity review to cover blog, blog-detail, projects, and
case-study pages; updates all verification gates and counts accordingly.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                                                                                                                                      | File overlap      | Model  | Rationale                                  |
| ----- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------ | ------------------------------------------ |
| G1    | Phase 1 | Read `.claude/commands/pipeline.stitch-design.md`, Read `sites/_castor-plumbing/app/projects/page.tsx`, Read `sites/_castor-plumbing/app/projects/victorian-bathroom-renovation/page.tsx`, Read `sites/_castor-plumbing/app/blog/how-to-spot-a-hidden-water-leak/page.tsx` | none (reads only) | haiku  | 4 independent reads — batch in one message |
| G2    | Phase 2 | — no parallel work in this phase — all 10 changes are to a single file and must be sequential                                                                                                                                                                              | same file         | sonnet | Single-file edits must serialise           |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                               | Reason                                            |
| ---------------------------------- | ------------------------------------------------- |
| All 10 changes within Phase 2      | All edit the same file — must be applied in order |
| Verification gate before commit    | Gate must pass before committing                  |
| Phase 1 reads before Phase 2 edits | Must understand file before editing               |

---

## Cost Estimate

| Phase                                     | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ----------------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: reads (4 files ~200 lines avg)   | haiku  | ~7k               | ~0.1k              | ~$0.002    |
| Phase 2: 10 edits to 1142-line skill file | sonnet | ~25k              | ~8k                | ~$0.20     |
| **Total**                                 |        | **~32k**          | **~8k**            | **~$0.20** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Verification gate results — paste the output of each grep check
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-11_stitch-pipeline-projects-casestudy/yolo-brief.md`:

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
- The Co-Authored-By line in commits must reflect the orchestrator model used: `Claude Sonnet 4.6 <noreply@anthropic.com>`
- The only file being modified is `.claude/commands/pipeline.stitch-design.md` — do not touch any other file
