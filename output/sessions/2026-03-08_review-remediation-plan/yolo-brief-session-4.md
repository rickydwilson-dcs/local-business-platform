# YOLO Brief: Session 4 -- Accessibility Improvements

**Findings:** A11Y-005, A11Y-006, A11Y-007, A11Y-009
**Branch:** Create `fix/a11y-session-4` from `develop`

---

## Pre-Flight

```bash
cd /Users/rickywilson/Sites/local-business-platform
git checkout develop && git pull origin develop
git checkout -b fix/a11y-session-4
```

---

## A11Y-005: LocationsDropdown keyboard navigation and ARIA roles

**File:** `packages/core-components/src/components/ui/locations-dropdown.tsx`

**Problem:** The dropdown container lacks `role="menu"` and items lack `role="menuitem"`. There is no arrow key navigation between items. Escape key handling already exists but focus management on open is missing.

**Current state:** The component already has `aria-expanded`, `aria-haspopup="true"`, `aria-controls`, and Escape key handling. It is missing ARIA menu roles and arrow key navigation.

**Changes required:**

### 1. Add `role="menu"` to both dropdown containers

In `SimpleDropdown`, add `role="menu"` to the outer `<div id={id} ...>`.

In `MegaMenuDropdown`, add `role="menu"` to the outer `<div id={id} ...>`.

### 2. Add `role="menuitem"` to each clickable link inside the dropdowns

In `SimpleDropdown`:
- Each `<Link>` inside the locations grid should get `role="menuitem"` and `tabIndex={0}`.

In `MegaMenuDropdown`:
- Each county `<Link>` and each town `<Link>` should get `role="menuitem"` and `tabIndex={0}`.

### 3. Arrow key navigation

Add a `useEffect` (or a `keydown` handler on the menu container) that listens for ArrowDown, ArrowUp, Home, and End keys:

```typescript
useEffect(() => {
  if (!isOpen) return;

  const menu = document.getElementById('locations-dropdown-menu');
  if (!menu) return;

  const handleKeyDown = (e: KeyboardEvent) => {
    const items = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        items[(currentIndex + 1) % items.length]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        items[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
    }
  };

  menu.addEventListener('keydown', handleKeyDown);
  return () => menu.removeEventListener('keydown', handleKeyDown);
}, [isOpen]);
```

### 4. Focus first item on open

Add a `useEffect` that focuses the first `[role="menuitem"]` when `isOpen` becomes true:

```typescript
useEffect(() => {
  if (!isOpen) return;
  // Wait for DOM to render
  requestAnimationFrame(() => {
    const menu = document.getElementById('locations-dropdown-menu');
    const firstItem = menu?.querySelector<HTMLElement>('[role="menuitem"]');
    firstItem?.focus();
  });
}, [isOpen]);
```

This can be combined with the arrow key handler effect above. Put both in a single `useEffect` in the main `LocationsDropdown` component (not in the sub-components).

---

## A11Y-006: FAQ section accordion expand/collapse

**File:** `packages/core-components/src/components/ui/faq-section.tsx`

**Problem:** All FAQ answers are rendered statically and always visible. The component should use an accordion pattern with expand/collapse behavior, proper ARIA attributes, and keyboard accessibility.

**Current state:** The component is a Server Component (no `"use client"` directive). To add interactive accordion behavior, you need to either:
- Add `"use client"` to the file, OR
- Extract the accordion item into a separate client component

**Recommended approach:** Extract a small `FAQAccordionItem` client component, keeping the outer `FAQSection` as a server component.

### 1. Create a new file: `packages/core-components/src/components/ui/faq-accordion-item.tsx`

```tsx
"use client";

import { useState } from "react";

interface FAQAccordionItemProps {
  question: string;
  answer: string;
  index: number;
  isLocationVariant: boolean;
}

export function FAQAccordionItem({ question, answer, index, isLocationVariant }: FAQAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `faq-answer-${index}`;
  const buttonId = `faq-question-${index}`;

  return (
    <div
      className={`${isLocationVariant ? "bg-surface-subtle" : "bg-surface-background"} border border-surface-border rounded-2xl shadow-sm hover:shadow-md transition-shadow`}
    >
      <button
        id={buttonId}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full text-left p-6 flex items-start gap-3 cursor-pointer"
      >
        <span className="flex-shrink-0 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center text-brand-on-primary text-sm font-bold">
          Q
        </span>
        <span className="text-lg font-semibold text-surface-foreground flex-1">{question}</span>
        <svg
          className={`w-5 h-5 text-surface-muted-foreground flex-shrink-0 mt-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-6 pb-6 ml-9">
          <p className="text-surface-foreground leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
```

### 2. Update `faq-section.tsx`

Import the new component and replace the FAQ items rendering:

```tsx
import { FAQAccordionItem } from "./faq-accordion-item";
```

Replace the existing FAQ items block (the `<div className="space-y-6">` with `.map()` inside it). Change from:

```tsx
<div className="space-y-6">
  {items.map((item, i) => (
    <div key={i} className={`...`}>
      <h3 ...>...</h3>
      <div className="ml-9">
        <p ...>{item.answer}</p>
      </div>
    </div>
  ))}
</div>
```

To:

```tsx
<div className="space-y-6">
  {items.map((item, i) => (
    <FAQAccordionItem
      key={i}
      question={item.question}
      answer={item.answer}
      index={i}
      isLocationVariant={isLocationVariant}
    />
  ))}
</div>
```

### 3. Export the new component from `packages/core-components/src/index.ts`

Add: `export { FAQAccordionItem } from "./components/ui/faq-accordion-item";`

---

## A11Y-007: Viewport userScalable setting

**Files:**
- `sites/base-template/app/layout.tsx`
- `sites/dj-fox-electrical/app/layout.tsx`

**Problem:** `userScalable` is not explicitly set in the viewport export. While Next.js defaults to allowing zoom, explicitly setting it ensures no future change blocks pinch-to-zoom (WCAG 1.4.4).

**Current state (both files):**

```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};
```

`maximumScale: 5` is already good (allows zoom). Just add `userScalable: true` explicitly.

**Change in both files:**

```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};
```

---

## A11Y-009: DJ Fox brand red contrast ratio

**File:** `sites/dj-fox-electrical/theme.config.ts`

**Problem:** The brand primary color `#db0b0b` has a contrast ratio of approximately 4.58:1 against white (`#ffffff`). WCAG AA requires 4.5:1 for normal text and 3:1 for large text. It passes AA but is borderline.

**What to do:**

1. Calculate the contrast ratio of `#db0b0b` against `#ffffff`. The ratio is approximately 4.58:1.
2. Since it passes WCAG AA (4.5:1 threshold), do NOT change the color. The brand color should stay as-is.
3. Add a comment in `theme.config.ts` noting the contrast ratio:

```typescript
colors: {
  brand: {
    // Contrast ratio vs white (#fff): ~4.58:1 — passes WCAG AA (4.5:1) but not AAA (7:1).
    // If a darker variant is needed for small text on white, use primaryHover (#ba0909, ~5.73:1).
    primary: '#db0b0b',
    primaryHover: '#ba0909',
```

4. Also verify the `primaryHover` value `#ba0909` has better contrast. It should be around 5.7:1 -- note this in the comment as shown above.

---

## Verification

Run all three checks from the monorepo root:

```bash
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
pnpm lint
pnpm build
```

All three must pass. Fix any issues before committing.

---

## Commit

```bash
git add -A
git commit -m "fix(a11y): keyboard nav for LocationsDropdown, FAQ accordion, viewport userScalable, contrast docs (A11Y-005/006/007/009)"
```

Do NOT push to `staging` or `main`. Leave the branch as `fix/a11y-session-4`.

---

## UPDATE AGGREGATED REPORT

After all fixes and verification, update `output/sessions/2026-03-07_code-review/aggregated-report.md`:

1. In the **MEDIUM** findings table, add a note or strikethrough for **A11Y-005** and **A11Y-006** indicating they are fixed.
2. In the **LOW** findings table, add a note or strikethrough for **A11Y-007** and **A11Y-009** indicating they are fixed.
3. At the bottom of the file, add or update a **"Fixed in Session 4"** section:

```markdown
### Fixed in Session 4 (fix/a11y-session-4)

| ID | Fix Summary |
|---|---|
| A11Y-005 | Added `role="menu"`, `role="menuitem"`, arrow key navigation, and focus-on-open to `LocationsDropdown` |
| A11Y-006 | Extracted `FAQAccordionItem` client component with accordion expand/collapse, `aria-expanded`, `aria-controls` |
| A11Y-007 | Added `userScalable: true` to viewport config in base-template and dj-fox-electrical layouts |
| A11Y-009 | Verified `#db0b0b` passes WCAG AA (4.58:1); added contrast ratio documentation comment to theme.config.ts |
```

4. Update the Executive Summary total counts to reflect 4 fewer open findings.

Confirm this update was done in your final report.
