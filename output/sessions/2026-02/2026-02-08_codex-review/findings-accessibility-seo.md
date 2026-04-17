# Accessibility & SEO Review Findings

**Reviewer:** OpenAI Codex (external)
**Scope:** Full monorepo — accessibility focus
**Date:** 2026-02-08

## Summary

External review identified a duplicate alert pattern in contact forms that causes double announcements for screen readers.

## Findings

### [LOW] A11Y-001: ContactForm renders duplicate success/error alerts

- **File:** `sites/colossus-reference/components/ui/ContactForm.tsx` (lines 175-189, 373-389)
- **Issue:** The form renders two identical sets of success/error alert blocks — one before the form fields (lines 175-189) and one after the submit button (lines 373-389). Both use `role="alert"`, so screen readers announce the status message twice on submission. The text content is nearly identical between the two blocks.
- **Impact:** Screen reader users hear duplicate announcements. Sighted users see redundant status messages if both are visible. Extra DOM nodes after submission.
- **Fix:** Remove the second set of alert blocks (lines 373-389) and keep only the first set (lines 175-189) which appears at the top of the form where users expect feedback. Ensure the remaining alert has `aria-live="polite"` for proper screen reader announcement. Apply the same fix to `sites/base-template/components/ui/ContactForm.tsx` and `sites/smiths-electrical-cambridge/components/ui/ContactForm.tsx` which have the same pattern.
- **Effort:** trivial

## Statistics

- Critical: 0
- High: 0
- Medium: 0
- Low: 1
- Total: 1
