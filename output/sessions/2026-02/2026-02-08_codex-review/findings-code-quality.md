# Code Quality Review Findings

**Reviewer:** OpenAI Codex (external)
**Scope:** Full monorepo — code quality focus
**Date:** 2026-02-08

## Summary

External review identified that MDX external links are rendered without rel="noopener noreferrer", creating a potential reverse-tabnabbing risk.

## Findings

### [MEDIUM] CQ-001: MDX external links missing rel="noopener noreferrer"

- **File:** `sites/colossus-reference/mdx-components.tsx` (lines 845-863)
- **Issue:** The MDX `a` component correctly distinguishes internal links (using Next.js `<Link>`) from external links (using native `<a>`), but external links are rendered with only `{...props}` spread — no explicit `rel="noopener noreferrer"` or `target="_blank"` is added. Any MDX content using `target="_blank"` on external links is vulnerable to reverse-tabnabbing via `window.opener`.
- **Impact:** External links opened in new tabs could access `window.opener` and redirect the original page. Missing `rel` attributes also affect referrer control.
- **Fix:** In the external link branch of the `a` component, add `rel="noopener noreferrer"` and optionally `target="_blank"` as defaults. Change the external `<a>` to: `<a {...props} rel="noopener noreferrer" target="_blank" className="..." />`. Apply to all three sites: `sites/colossus-reference/mdx-components.tsx`, `sites/base-template/mdx-components.tsx`, `sites/smiths-electrical-cambridge/mdx-components.tsx`.
- **Effort:** trivial

## Statistics

- Critical: 0
- High: 0
- Medium: 1
- Low: 0
- Total: 1
