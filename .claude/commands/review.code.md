# Review Code

Run a comprehensive parallel code review of this monorepo using specialized sub-agents across four domains: security, code quality, accessibility/SEO, and architecture. This is a **read-only** review — findings are reported, not auto-fixed.

## Arguments

Parse `$ARGUMENTS` to determine scope:

- **No arguments** → full review (all 4 domains, all files)
- **Domain name** → single domain only: `security`, `code-quality`, `accessibility`, `architecture`
- **Path** → all 4 domains scoped to that directory (e.g., `packages/core-components`, `sites/base-template`)

## Step 1: Setup

Verify you are on the `develop` branch:

```bash
git branch --show-current
```

If not on `develop`, STOP and inform the user.

Create the session directory:

```bash
SESSION_DIR="output/sessions/$(date +%Y-%m-%d)_code-review"
mkdir -p "$SESSION_DIR"
```

Write `session.md`:

```markdown
# Session: Code Review

**Date:** YYYY-MM-DD
**Status:** Active
**Scope:** [full | domain-name | path]
**Domains:** [security, code-quality, accessibility, architecture]

## Agents

| Domain              | Status  | Findings File                 |
| ------------------- | ------- | ----------------------------- |
| Security            | Pending | findings-security.md          |
| Code Quality        | Pending | findings-code-quality.md      |
| Accessibility & SEO | Pending | findings-accessibility-seo.md |
| Architecture        | Pending | findings-architecture.md      |
```

## Step 1.5: Check for Previously Fixed Findings

Look for the most recent `fixes-applied.md` from a previous `/fix.findings` run:

```bash
find output/sessions -name "fixes-applied.md" -type f 2>/dev/null | sort -r | head -1
```

If found, read it and extract the list of finding IDs that were successfully applied (from the "Applied" sections). Build a short summary like:

```
Previously fixed finding IDs: SEC-001, SEC-004, CQ-001, CQ-002, ARCH-001, ARCH-002, ARCH-005, A11Y-001, A11Y-002, SEO-002
```

Also check the most recent `aggregated-report.md` for the previous finding descriptions, so agents understand what was already addressed.

This context will be injected into each agent's prompt below.

## Step 2: Spawn Parallel Review Agents

Use the **Task tool** to spawn the agents below. Launch all applicable agents in a **single message** with `run_in_background: true` so they execute in parallel.

If `$ARGUMENTS` is a domain name, spawn only that domain's agent.
If `$ARGUMENTS` is a path, include `SCOPE: Only examine files under [path]` in each agent's prompt.

**If previously fixed findings were found in Step 1.5**, append the following to **each** agent's prompt:

> **Previously fixed findings (do NOT re-report these):**
> [list of finding IDs and one-line descriptions]
>
> These findings were addressed in a prior fix session. Only re-report a previously fixed finding if the fix was incomplete or introduced a new issue. In that case, use a NEW finding ID and reference the old one (e.g., "SEC-010: Incomplete fix for SEC-001 — ...").

---

### Agent 1: Security Review

```
Task tool parameters:
  description: "Security review audit"
  subagent_type: "cs-security-engineer"
  run_in_background: true
```

**Prompt for the agent:**

> You are reviewing the local-business-platform monorepo for security issues.
>
> **Step 1: Read the project's security standards**
> Read the file `docs/standards/security.md` — this is your review checklist.
>
> **Step 2: Examine the codebase**
> Review these areas for security issues:
>
> - `sites/*/app/api/**/*.ts` — input validation, CSRF protection, rate limiting
> - `sites/*/middleware.ts` — security headers (CSP, HSTS, X-Frame-Options)
> - `sites/*/next.config.ts` — CSP configuration, dangerouslyAllowSVG, image domains
> - `tools/*.ts` — environment variable handling, secrets exposure
> - `**/lib/csrf.ts`, `**/lib/rate-limiter.ts` — implementation correctness
> - `.env*` files checked into git (there should be none with real secrets)
> - Any hardcoded API keys, tokens, or credentials in source files
>
> Also run `pnpm audit` and include any vulnerability findings.
>
> **Scoping rule:** Do NOT flag `.env.local` files that are properly gitignored. Environment file storage location is outside the scope of a code review — only flag secrets that are actually committed to version control or hardcoded in source files.
>
> **Step 3: Write findings**
> Write your findings to `output/sessions/YYYY-MM-DD_code-review/findings-security.md` using this exact format:
>
> ```
> # Security Review Findings
>
> **Reviewer:** cs-security-engineer
> **Scope:** [describe what was reviewed]
> **Date:** YYYY-MM-DD
>
> ## Summary
>
> [2-3 sentence overview]
>
> ## Findings
>
> ### [SEVERITY] SEC-NNN: Short Title
> - **File:** `path/to/file.ts` (lines X-Y)
> - **Issue:** Clear description
> - **Impact:** What could go wrong
> - **Fix:** Specific remediation steps
> - **Effort:** trivial | small | medium | large
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
> Severity levels: CRITICAL (exploitable now), HIGH (significant risk), MEDIUM (should fix), LOW (minor/informational).
> Number findings sequentially: SEC-001, SEC-002, etc.
> If there are no findings for a severity level, omit that section.

---

### Agent 2: Code Quality Review

```
Task tool parameters:
  description: "Code quality review"
  subagent_type: "cs-code-reviewer"
  run_in_background: true
```

**Prompt for the agent:**

> You are reviewing the local-business-platform monorepo for code quality issues.
>
> **Step 1: Read the project standards**
> Read these files — they define the project's coding standards:
>
> - `docs/standards/components.md` — component architecture, TypeScript conventions
> - `docs/standards/content.md` — MDX content patterns, frontmatter schemas
> - `docs/standards/styling.md` — Tailwind CSS, theme token usage
>
> **Step 2: Examine the codebase**
> Review for:
>
> - **Named exports only** — the project requires named exports, no default exports
> - **TypeScript prop interfaces** — all component props must have TypeScript interfaces
> - **No `console.log`** in production code (check `sites/*/` and `packages/*/src/`)
> - **Unused imports/variables** — scan for dead code
> - **Content validation schemas** — check `**/lib/content-schemas.ts` or `**/lib/content.ts` for completeness
> - **Code duplication** — identical or near-identical code between `sites/base-template` and `sites/smiths-electrical-cambridge`
> - **TypeScript `any` types** — should be avoided; flag occurrences
>
> Also run `pnpm lint` from the repo root and include any linting violations.
>
> **Scoping rules:**
>
> - Do NOT flag framework-mandated patterns as violations. Next.js requires default exports for `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `mdx-components.tsx`, and route handlers. These are exempt from the "named exports only" rule.
> - Only report problems. Do NOT include positive observations or "correctly implemented" notes as findings.
>
> **Step 3: Write findings**
> Write to `output/sessions/YYYY-MM-DD_code-review/findings-code-quality.md` using this format:
>
> ```
> # Code Quality Review Findings
>
> **Reviewer:** cs-code-reviewer
> **Scope:** [describe what was reviewed]
> **Date:** YYYY-MM-DD
>
> ## Summary
>
> [2-3 sentence overview]
>
> ## Findings
>
> ### [SEVERITY] CQ-NNN: Short Title
> - **File:** `path/to/file.ts` (lines X-Y)
> - **Issue:** Clear description
> - **Impact:** What could go wrong
> - **Fix:** Specific remediation steps
> - **Effort:** trivial | small | medium | large
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
> Severity: CRITICAL (build-breaking or type-unsafe), HIGH (significant quality issue), MEDIUM (should fix), LOW (style/minor).
> Number findings: CQ-001, CQ-002, etc.

---

### Agent 3: Accessibility & SEO Review

```
Task tool parameters:
  description: "Accessibility and SEO review"
  subagent_type: "cs-frontend-engineer"
  run_in_background: true
```

**Prompt for the agent:**

> You are reviewing the local-business-platform monorepo for accessibility and SEO issues.
>
> **Step 1: Read the project standards**
> Read these files — they are your review checklists:
>
> - `docs/standards/seo.md` — SEO requirements (meta tags, keywords, structured data, sitemaps)
> - `docs/standards/images.md` — image optimization, alt text, naming conventions
> - `docs/standards/schema.md` — JSON-LD structured data requirements
>
> **Step 2: Examine the codebase**
>
> _Accessibility:_
>
> - Semantic HTML: heading hierarchy (one h1 per page, h2 → h3 nesting) in layout and page components
> - ARIA attributes on interactive elements: mobile navigation, dropdowns, modals, forms
> - Form components: labels linked to inputs, error announcements, required field indicators
> - Focus management: skip links, focus traps in modals, visible focus indicators
> - Image alt text: check all `<Image>` and `<img>` components for meaningful alt attributes
> - Color contrast: verify theme tokens in `sites/*/theme.config.ts` reference accessible color pairs
>
> _SEO:_
>
> - Meta tags: every page should generate title and description (check `generateMetadata` functions)
> - Title format: 50-60 characters, description: 120-160 characters
> - OpenGraph and Twitter card meta tags
> - Schema.org structured data: LocalBusiness, BreadcrumbList, FAQPage, Service schemas
> - `robots.ts` configuration — correct allow/disallow rules
> - `sitemap.ts` — includes all content types (services, locations, blog posts, projects)
> - MDX frontmatter: check that `description` (50-200 chars) and SEO-relevant fields are present
> - Internal linking structure between services and locations
>
> **Step 3: Write findings**
> Write to `output/sessions/YYYY-MM-DD_code-review/findings-accessibility-seo.md` using this format:
>
> ```
> # Accessibility & SEO Review Findings
>
> **Reviewer:** cs-frontend-engineer
> **Scope:** [describe what was reviewed]
> **Date:** YYYY-MM-DD
>
> ## Summary
>
> [2-3 sentence overview]
>
> ## Findings
>
> ### [SEVERITY] A11Y-NNN: Short Title
> - **File:** `path/to/file.ts` (lines X-Y)
> - **Issue:** Clear description
> - **Impact:** What could go wrong
> - **Fix:** Specific remediation steps
> - **Effort:** trivial | small | medium | large
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
> Severity: CRITICAL (completely inaccessible or missing critical SEO), HIGH (significant a11y/SEO gap), MEDIUM (should improve), LOW (enhancement).
> Number findings: A11Y-001, A11Y-002, etc.

---

### Agent 4: Architecture Review

```
Task tool parameters:
  description: "Architecture review"
  subagent_type: "cs-architect"
  run_in_background: true
```

**Prompt for the agent:**

> You are reviewing the local-business-platform monorepo for architecture violations and structural issues.
>
> **Step 1: Read the project architecture docs**
> Read these files — they describe how the system is designed to work:
>
> - `docs/architecture/architecture.md` — high-level system overview
> - `docs/architecture/how-dynamic-routing-works.md` — MDX → static pages via [slug] routes
> - `docs/architecture/how-theme-system-works.md` — config → CSS variables → Tailwind classes
> - `docs/architecture/how-build-pipeline-works.md` — Turborepo, packages, workspace linking
>
> Also read the project root `CLAUDE.md` for the key architecture rules.
>
> **Step 2: Examine the codebase**
> Review for:
>
> - **MDX-only content rule**: No hardcoded TypeScript data files for content (like `lib/locations.ts` or `lib/services.ts`). All content must be MDX files with frontmatter.
> - **Dynamic routing compliance**: No static page files for content types (e.g., `app/services/plumbing/page.tsx`). Content types must use `[slug]/page.tsx` dynamic routes.
> - **Theme token usage**: No hardcoded hex colors (`bg-[#005A9E]`) in components. Must use theme tokens (`bg-brand-primary`, `text-surface-foreground`).
> - **Package boundaries**: Sites must NOT import from other sites. Shared code goes in `packages/`.
> - **Component placement**: Code used by multiple sites should be in `packages/core-components`, not duplicated in `sites/*/components/`.
> - **Build config**: Check `turbo.json` for correct dependency ordering (packages build before sites).
> - **Code that should be shared**: Identical utilities or components in multiple sites that should be extracted to a package.
>
> **Step 3: Write findings**
> Write to `output/sessions/YYYY-MM-DD_code-review/findings-architecture.md` using this format:
>
> ```
> # Architecture Review Findings
>
> **Reviewer:** cs-architect
> **Scope:** [describe what was reviewed]
> **Date:** YYYY-MM-DD
>
> ## Summary
>
> [2-3 sentence overview]
>
> ## Findings
>
> ### [SEVERITY] ARCH-NNN: Short Title
> - **File:** `path/to/file.ts` (lines X-Y)
> - **Issue:** Clear description
> - **Impact:** What could go wrong
> - **Fix:** Specific remediation steps
> - **Effort:** trivial | small | medium | large
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
> Severity: CRITICAL (breaks the architecture model), HIGH (significant violation), MEDIUM (should refactor), LOW (minor improvement).
> Number findings: ARCH-001, ARCH-002, etc.
> Only report problems. Do NOT include positive observations or "correctly implemented" notes as findings.

---

## Step 3: Wait for Agents and Aggregate

After launching agents, check on each background agent using the TaskOutput tool. Wait for all to complete.

If any agent fails, log it in `session.md` and continue with the others.

Once all agents are done, read all findings files:

- `findings-security.md`
- `findings-code-quality.md`
- `findings-accessibility-seo.md`
- `findings-architecture.md`

Aggregate into `aggregated-report.md` using this template:

```markdown
# Aggregated Code Review Report

**Date:** YYYY-MM-DD
**Branch:** develop
**Scope:** [full | domain-name | path]

---

## Executive Summary

| Severity  | Security | Code Quality | A11y/SEO | Architecture | **Total** |
| --------- | -------- | ------------ | -------- | ------------ | --------- |
| Critical  | N        | N            | N        | N            | **N**     |
| High      | N        | N            | N        | N            | **N**     |
| Medium    | N        | N            | N        | N            | **N**     |
| Low       | N        | N            | N        | N            | **N**     |
| **Total** | **N**    | **N**        | **N**    | **N**        | **N**     |

**Immediate attention required:** [summary of critical findings]

---

## Cross-Domain Issues

Findings flagged by 2+ agents targeting the same file (within 5 lines), merged under the highest severity.

### 1. Issue Title (Domain A + Domain B)

**Severity:** [highest] | **Files:** `path/to/file.ts`

- **Finding IDs:** [list]
- **Summary:** [description]
- **Effort:** [estimate]

---

## All Findings by Severity

### CRITICAL (N)

| ID  | Domain | File | Issue |
| --- | ------ | ---- | ----- |
| ... | ...    | ...  | ...   |

### HIGH (N)

| ID  | Domain | File | Issue |
| --- | ------ | ---- | ----- |
| ... | ...    | ...  | ...   |

### MEDIUM (N)

| ID  | Domain | Issue Summary |
| --- | ------ | ------------- |
| ... | ...    | ...           |

### LOW (N)

| ID  | Domain | Issue Summary |
| --- | ------ | ------------- |
| ... | ...    | ...           |

---

## Per-Domain Breakdown

### [Domain] (N findings)

**Key themes:** [summary]

**Quick wins:**

- [trivial/small effort findings]

**Priority fixes:**

- [high-impact findings]

---

## Recommended Remediation Order

### Immediate (Blocking CI/Production Issues)

1. [finding] — _reason_

### This Sprint (High Impact)

2. [finding] — _reason_

### Next Sprint (Technical Debt)

3. [finding] — _reason_

---

## Previously Fixed (Excluded from Counts)

[If Step 1.5 found previously fixed findings, list them here. Otherwise omit this section.]

| ID      | Original Issue                             | Status                 |
| ------- | ------------------------------------------ | ---------------------- |
| SEC-001 | IP extraction prioritizes spoofable header | Fixed in prior session |
| ...     | ...                                        | ...                    |

---

## Files

- `findings-security.md` - Full security review details
- `findings-code-quality.md` - Full code quality review details
- `findings-accessibility-seo.md` - Full accessibility and SEO review details
- `findings-architecture.md` - Full architecture review details

---

_Generated by parallel code review agents on YYYY-MM-DD_
```

Write the report to `output/sessions/YYYY-MM-DD_code-review/aggregated-report.md`.

## Step 4: Present Results

Report to the user:

- Total findings count per severity level
- Top 5 most critical/high findings with file paths
- Path to the session directory for full details
- Any domains that were skipped due to agent failures
- Recommendation: whether immediate attention is needed (any CRITICAL findings)

## Rules

- **READ-ONLY** — do NOT modify any source files. This is a review, not a fix.
- Do NOT auto-commit anything.
- If a sub-agent fails, continue with the others and note the failure in the report.
- **Findings format is non-negotiable** — future skills (`/fix.findings`) will parse the output.
- Always include the session directory path in the final output.
- Replace `YYYY-MM-DD` with the actual date in all file paths and content.
- Follow the project's change philosophy: never remove features, prefer minimal targeted changes.
