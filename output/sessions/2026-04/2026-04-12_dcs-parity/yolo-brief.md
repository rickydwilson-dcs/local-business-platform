# YOLO Implementation Brief: Bring sites/dcs to Parity with base-template

**Branch:** feature/dcs-parity (created from develop)
**Session spec:** output/sessions/2026-04-12_dcs-parity/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

`sites/dcs` was created as a leaner scaffold compared to `base-template`. It has real content (21 blog posts, 8 locations, 4 services, 3 projects) but is missing the full platform infrastructure: analytics API routes, legal pages (cookie policy, privacy policy), section-specific sitemaps, E2E test suite, unit tests, monitoring setup (New Relic), and `content/testimonials/`. The goal is to copy all missing infrastructure files verbatim from `base-template` and create DCS-specific testimonial MDX files from data already in `site.config.ts`.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **haiku** for file copies and content creation, **sonnet** for any file requiring adaptation.

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/dcs-parity
cd sites/dcs && npm run type-check   # must be clean before starting
```

---

## Phase 1: Copy Infrastructure Files from base-template

**Goal:** Copy all missing platform infrastructure files verbatim — no modifications needed.
**Model:** haiku — pure mechanical file copies

Read each source file, then write it to the destination. All paths are relative to the repo root.

Copy these files exactly — no edits:

| Source                                                      | Destination                                       |
| ----------------------------------------------------------- | ------------------------------------------------- |
| `sites/base-template/test/setup.ts`                         | `sites/dcs/test/setup.ts`                         |
| `sites/base-template/app/api/analytics/track/route.ts`      | `sites/dcs/app/api/analytics/track/route.ts`      |
| `sites/base-template/app/api/analytics/debug/route.ts`      | `sites/dcs/app/api/analytics/debug/route.ts`      |
| `sites/base-template/app/cookie-policy/page.tsx`            | `sites/dcs/app/cookie-policy/page.tsx`            |
| `sites/base-template/app/privacy-policy/page.tsx`           | `sites/dcs/app/privacy-policy/page.tsx`           |
| `sites/base-template/app/blog/sitemap.ts`                   | `sites/dcs/app/blog/sitemap.ts`                   |
| `sites/base-template/app/locations/sitemap.ts`              | `sites/dcs/app/locations/sitemap.ts`              |
| `sites/base-template/app/projects/sitemap.ts`               | `sites/dcs/app/projects/sitemap.ts`               |
| `sites/base-template/app/services/sitemap.ts`               | `sites/dcs/app/services/sitemap.ts`               |
| `sites/base-template/app/sitemap-index.xml/route.ts`        | `sites/dcs/app/sitemap-index.xml/route.ts`        |
| `sites/base-template/playwright.config.ts`                  | `sites/dcs/playwright.config.ts`                  |
| `sites/base-template/.prettierrc`                           | `sites/dcs/.prettierrc`                           |
| `sites/base-template/lib/performance-tracker.ts`            | `sites/dcs/lib/performance-tracker.ts`            |
| `sites/base-template/instrumentation.ts`                    | `sites/dcs/instrumentation.ts`                    |
| `sites/base-template/newrelic.js`                           | `sites/dcs/newrelic.js`                           |
| `sites/base-template/types/newrelic.d.ts`                   | `sites/dcs/types/newrelic.d.ts`                   |
| `sites/base-template/proxy.ts`                              | `sites/dcs/proxy.ts`                              |
| `sites/base-template/scripts/validate-content.ts`           | `sites/dcs/scripts/validate-content.ts`           |
| `sites/base-template/scripts/validate-quality.ts`           | `sites/dcs/scripts/validate-quality.ts`           |
| `sites/base-template/e2e/smoke.spec.ts`                     | `sites/dcs/e2e/smoke.spec.ts`                     |
| `sites/base-template/e2e/navigation.spec.ts`                | `sites/dcs/e2e/navigation.spec.ts`                |
| `sites/base-template/e2e/service-pages.spec.ts`             | `sites/dcs/e2e/service-pages.spec.ts`             |
| `sites/base-template/e2e/location-pages.spec.ts`            | `sites/dcs/e2e/location-pages.spec.ts`            |
| `sites/base-template/e2e/accessibility.full.spec.ts`        | `sites/dcs/e2e/accessibility.full.spec.ts`        |
| `sites/base-template/e2e/performance.full.spec.ts`          | `sites/dcs/e2e/performance.full.spec.ts`          |
| `sites/base-template/e2e/visual-regression.full.spec.ts`    | `sites/dcs/e2e/visual-regression.full.spec.ts`    |
| `sites/base-template/lib/__tests__/content-schemas.test.ts` | `sites/dcs/lib/__tests__/content-schemas.test.ts` |
| `sites/base-template/lib/__tests__/schema.test.ts`          | `sites/dcs/lib/__tests__/schema.test.ts`          |
| `sites/base-template/lib/__tests__/site.test.ts`            | `sites/dcs/lib/__tests__/site.test.ts`            |
| `sites/base-template/components/README.md`                  | `sites/dcs/components/README.md`                  |
| `sites/base-template/public/README.md`                      | `sites/dcs/public/README.md`                      |

**Before writing each file:** use `mkdir -p` (via Bash) to ensure parent directories exist.

```bash
# Verification gate — STOP if this fails
cd sites/dcs && npm run type-check
```

**Commit:**

```bash
git add sites/dcs/
git commit -m "$(cat <<'EOF'
feat(dcs): add missing platform infrastructure files from base-template

Copies test setup, analytics API routes, legal pages, section sitemaps,
E2E specs, unit tests, monitoring config, and scripts to bring dcs to
structural parity with base-template.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Create Testimonial MDX Files

**Goal:** Create `content/testimonials/` with 3 MDX files using data from `sites/dcs/site.config.ts`.
**Model:** haiku — content creation from known data

The testimonial data from `sites/dcs/site.config.ts` (lines 394–413):

- Mark H. | Electrician, Brighton | "My phone started ringing within two weeks of the site going live. Ricky handled everything — I didn't have to do a thing."
- Sarah T. | Plumber, Eastbourne | "I was spending £80 a month on a website that wasn't getting me anything. Now I pay less and actually get enquiries."
- Dave C. | Scaffolding Contractor, Lewes | "The site looks exactly how I wanted. Professional, clear, and it shows up on Google when people search for scaffolding near me."

Use the `TestimonialFrontmatterSchema` format (read `sites/base-template/content/testimonials/example-testimonial-1.mdx` for the exact frontmatter fields).

Create these 3 files:

**`sites/dcs/content/testimonials/mark-h-electrician.mdx`:**

```mdx
---
customerName: "Mark H."
customerRole: "Electrician, Brighton"
rating: 5
text: "My phone started ringing within two weeks of the site going live. Ricky handled everything — I didn't have to do a thing."
excerpt: "My phone started ringing within two weeks of the site going live."
date: "2026-01-15"
service: "Web Design"
serviceSlug: "web-design"
location: "Brighton"
locationSlug: "brighton"
projectType: "residential"
featured: true
verified: true
platform: "internal"
---

Mark runs an electrical business in Brighton and came to DCS after struggling to get enquiries online. Within two weeks of his new site launching, he was already receiving calls from local customers.
```

**`sites/dcs/content/testimonials/sarah-t-plumber.mdx`:**

```mdx
---
customerName: "Sarah T."
customerRole: "Plumber, Eastbourne"
rating: 5
text: "I was spending £80 a month on a website that wasn't getting me anything. Now I pay less and actually get enquiries."
excerpt: "Now I pay less and actually get enquiries."
date: "2026-02-10"
service: "Monthly Management"
serviceSlug: "monthly-management"
location: "Eastbourne"
locationSlug: "eastbourne"
projectType: "residential"
featured: true
verified: true
platform: "internal"
---

Sarah came to DCS frustrated with her previous website provider. She was paying more for less. After switching to DCS, she's paying less and finally getting real enquiries through her site.
```

**`sites/dcs/content/testimonials/dave-c-scaffolding.mdx`:**

```mdx
---
customerName: "Dave C."
customerRole: "Scaffolding Contractor, Lewes"
rating: 5
text: "The site looks exactly how I wanted. Professional, clear, and it shows up on Google when people search for scaffolding near me."
excerpt: "Professional, clear, and it shows up on Google."
date: "2026-03-05"
service: "Local SEO"
serviceSlug: "local-seo"
location: "Lewes"
locationSlug: "lewes"
projectType: "commercial"
featured: true
verified: true
platform: "internal"
---

Dave needed a scaffolding site that looked professional and ranked locally. DCS delivered exactly what he asked for — a clean site that shows up when people nearby search for scaffolding services.
```

```bash
# Verification gate — STOP if this fails
cd sites/dcs && npm run validate:content
```

**Commit:**

```bash
git add sites/dcs/content/testimonials/
git commit -m "$(cat <<'EOF'
feat(dcs): add testimonial MDX files from site config data

Creates content/testimonials/ with 3 verified customer testimonials
based on data already defined in site.config.ts.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Verify package.json Scripts

**Goal:** Confirm DCS package.json already has all required scripts; add any that are missing.
**Model:** haiku — read and compare only

Read `sites/dcs/package.json`. The following scripts should already exist (confirmed during planning):

- `test:e2e`, `test:e2e:smoke`, `test:e2e:full`, `validate:content`, `validate:quality`

If any are missing, add them matching base-template's values. Do NOT modify scripts that already exist.

No commit needed if no changes were required. If changes were made:

```bash
git add sites/dcs/package.json
git commit -m "$(cat <<'EOF'
chore(dcs): add missing npm scripts to match base-template

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Final Verification

**Goal:** Confirm the site builds cleanly and all new tests and content pass.
**Model:** sonnet

```bash
# Verification gate — STOP if any of these fail
cd sites/dcs && npm run type-check
cd sites/dcs && npm run validate:content
cd sites/dcs && npm test
cd sites/dcs && npm run build
```

Run type-check and validate:content in parallel (they are read-only and independent). Run `npm test` after. Run `npm run build` last (writes to .next/).

If the build passes: all done, proceed to Final Report.

If `npm test` fails due to test files referencing base-template-specific slugs or config values, adapt the failing test assertions to use DCS values (e.g. correct service slugs from `sites/dcs/content/services/`). This is the only permitted adaptation — do not restructure tests.

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                   | File overlap      | Model | Rationale                                     |
| ----- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----- | --------------------------------------------- |
| G1    | Phase 1 | Read all 31 source files from base-template                                                                                                             | none (reads only) | n/a   | All reads independent — batch in one message  |
| G2    | Phase 1 | Write each destination file (can write in parallel groups of files targeting different directories: `app/`, `lib/`, `e2e/`, `scripts/`, `types/`, root) | none              | haiku | Independent writes to independent directories |
| G3    | Phase 2 | Write all 3 testimonial MDX files simultaneously                                                                                                        | none              | haiku | No shared state                               |
| G4    | Phase 4 | `npm run type-check` + `npm run validate:content`                                                                                                       | none (read-only)  | n/a   | Independent checks — run in parallel          |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                                   | Reason                                                    |
| ------------------------------------------------------ | --------------------------------------------------------- |
| `npm run build` (Phase 4)                              | Writes to `.next/` — must run alone after all checks pass |
| `npm test` (Phase 4)                                   | Must run after type-check passes                          |
| Git commits                                            | One per phase, in order                                   |
| Phase 4 verification gate after Phase 1 and 2 complete | Phase 4 gates depend on all files being written first     |

---

## Cost Estimate

| Phase                        | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Copy 31 infra files | haiku  | ~40k              | ~20k               | ~$0.04     |
| Phase 2: 3 testimonial MDX   | haiku  | ~5k               | ~2k                | ~$0.003    |
| Phase 3: package.json check  | haiku  | ~2k               | ~0.5k              | ~$0.001    |
| Phase 4: Final verification  | sonnet | ~10k              | ~1k                | ~$0.05     |
| **Total**                    |        | **~57k**          | **~23.5k**         | **~$0.09** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `npm run type-check && npm run build` passes in `sites/dcs`
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-12_dcs-parity/yolo-brief.md`:

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
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.**
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (file copies, content creation); `model: sonnet` for standard edits and verification phases
- The Co-Authored-By line in commits must reflect the orchestrator model used: `Claude Sonnet 4.6`

---

## Completed

**Date:** 2026-04-12
**Status:** All phases executed successfully

All 31 infrastructure files were copied from base-template to sites/dcs (Phase 1), and 3 testimonial MDX files were created from site.config.ts data (Phase 2). Package.json already had all required scripts — no changes needed (Phase 3). Final verification passed: type-check clean, validate:content clean, 57/57 unit tests pass, production build generates 57 static pages. One test adaptation was required: the `hasCredential` schema test was updated since DCS has `certifications: []` and the factory correctly omits that field. One git hygiene fix was also needed: the Phase 1 commit accidentally landed on `staging` rather than `feature/dcs-parity` — this was corrected by resetting staging to origin/staging and cherry-picking the commit to the correct branch.

### Commits

- `f1cd1c3` feat(dcs): add missing platform infrastructure files from base-template
- `cc678c1` feat(dcs): add testimonial MDX files from site config data
- `c58ec74` test(dcs): adapt schema test for DCS config (no certifications)
