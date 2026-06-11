# Accessibility Audit Findings

**Reviewer:** cs-frontend-engineer (accessibility mode)
**Scope:** / /about /contact /blog/ /blog/test-post
**Date:** 2026-04-27

---

## Findings

### [Critical] A11Y-001: No `<main>` landmark on any page

- **File:** `sites/test-lyra/app/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- **Issue:** None of the five audited pages wrap their primary content in a `<main>` element (or `role="main"`). The page root renders a React fragment containing header components, sections, and a footer. Screen reader users rely on the `<main>` landmark to skip repeated navigation and jump directly to page content.
- **Impact:** Screen reader users (NVDA, VoiceOver, JAWS) cannot use landmark navigation to skip to page content. Fails WCAG 2.4.1 (Bypass Blocks, Level A).
- **Fix:** Wrap the page body content (everything between the navigation header and footer) in a `<main>` element in each page file. A shared layout wrapper in `app/layout.tsx` could also handle this centrally if the header/footer are moved there.
- **Effort:** small

---

### [Critical] A11Y-002: Contact form has no submit button

- **File:** `packages/themes/lyra/components/contact-form-panel.tsx` (line 52)
- **Issue:** The `<form>` element in `ContactFormPanel` contains six input fields and a file upload but no submit button. The component interface declares a `submitButton` prop but the rendered JSX never outputs `<button type="submit">` or `<input type="submit">`. The form cannot be submitted by keyboard, and form-submission assistive technology announcements will not fire.
- **Impact:** Keyboard-only users and screen reader users on `/contact` cannot submit the form. Fails WCAG 2.1.1 (Keyboard, Level A).
- **Fix:** Add `<button type="submit">` inside the `<form>`, using the `submitButton.label` prop (falling back to "Send Message"). Place it after the file upload field before the closing `</form>`.
- **Effort:** trivial

---

### [High] A11Y-003: File upload `<input>` is unreachable by keyboard

- **File:** `packages/themes/lyra/components/contact-form-panel.tsx` (lines 178–208)
- **Issue:** The file upload input (`id="contact-file"`, `type="file"`) has `className="hidden"`, making it visually and keyboard-inaccessible. The label references the input correctly via `htmlFor="contact-file"`, but the surrounding drop-zone `<div>` has no `tabIndex`, no interactive role, and no `onKeyDown` handler. It is not keyboard operable.
- **Impact:** Keyboard-only users on `/contact` cannot attach files. Fails WCAG 2.1.1 (Keyboard, Level A).
- **Fix:** Replace `className="hidden"` with `className="sr-only"` on the `<input>`. Add `tabIndex={0}`, `role="button"`, and an `onKeyDown` handler (Enter/Space triggers click) to the drop-zone `<div>`, or use a `<label>` wrapping the `<input>` as the sole click target.
- **Effort:** small

---

### [High] A11Y-004: `PrimaryNavigation` `<nav>` has no accessible label

- **File:** `packages/themes/lyra/components/primary-navigation.tsx` (line 21)
- **Issue:** The `<nav>` element on the homepage navigation has no `aria-label` or `aria-labelledby`. Multiple unlabelled landmark regions of the same type (the blog post page also has a `<nav aria-label="Breadcrumb">`) violate the requirement for distinguishable landmarks. Screen readers announce all `<nav>` elements as "navigation" without differentiating them.
- **Impact:** Screen reader users cannot distinguish the site navigation from other navigation regions. Fails WCAG 2.4.6 (Headings and Labels, Level AA).
- **Fix:** Add `aria-label="Primary navigation"` to the `<nav>` at line 21, matching the pattern already used in `navigation-top-bar.tsx` (line 22) and `navigation-sticky-top.tsx`.
- **Effort:** trivial

---

### [High] A11Y-005: Mobile menu buttons have no `aria-expanded` state

- **File:** `packages/themes/lyra/components/primary-navigation.tsx` (line 111), `packages/themes/lyra/components/navigation-top-bar.tsx` (line 109), `packages/themes/lyra/components/navigation-sticky-top.tsx` (line 107)
- **Issue:** The hamburger `<button>` elements carry `aria-label="Open mobile menu"` but no `aria-expanded` attribute. The mobile nav panel is statically in the DOM (always announced by screen readers) rather than conditionally toggled. Screen readers cannot determine whether the menu is open or closed.
- **Impact:** Screen reader users receive incorrect state information. Keyboard users cannot tell whether pressing the button will open or close the nav. Fails WCAG 4.1.2 (Name, Role, Value, Level A).
- **Fix:** Convert the mobile nav toggle to a Client Component that tracks open/closed state, sets `aria-expanded={isOpen}` on the button, and conditionally renders (or applies `hidden`/`aria-hidden`) to the mobile nav panel.
- **Effort:** medium

---

### [High] A11Y-006: `ServicesGrid` card `<h3>` uses `text-surface-background` on `bg-surface-foreground`

- **File:** `packages/themes/lyra/components/services-grid.tsx` (lines 75, 105, 135)
- **Issue:** Service card headings use the class `text-surface-background` (`#FFFFFF` in lyra) against `bg-surface-foreground` (`#000000` in lyra). The token names are semantically inverted for card content — `text-surface-background` means "the page background colour" not "card heading text". If `surface.background` is ever changed to a light grey on theme reconfiguration, these headings immediately fail contrast.
- **Impact:** Latent contrast failure on theme update; current values are 21:1 but the semantic mismatch misleads developers and creates a maintenance hazard.
- **Fix:** Replace `text-surface-background` on service card `<h3>` elements with an explicitly appropriate token. If the card intentionally has a dark background, set the card background via a dark token explicitly and use `text-on-brand-primary` or `text-white` for the heading.
- **Effort:** trivial

---

### [Medium] A11Y-007: `ClientLogoStrip` images have identical, non-specific alt text

- **File:** `packages/themes/lyra/components/client-logo-strip.tsx` (lines 33, 42, 51, 60, 69, 78)
- **Issue:** All six client logo `<img>` elements use `alt="Client logo"`. Identical alt text across multiple images provides no useful differentiation; screen readers announce "Client logo image" six times in succession with no distinguishing information.
- **Impact:** Screen reader users on `/` receive no meaningful information about the companies featured. Minor usability degradation.
- **Fix:** Either pass the client name via props (e.g., `alt={props.clientName1 ?? "Client logo"}`), or treat these as decorative by setting `alt=""` and `role="presentation"` if the names are not meaningful to the page.
- **Effort:** small

---

### [Medium] A11Y-008: `BlogArticleGrid` filter buttons missing `aria-pressed` state and potential empty accessible name

- **File:** `packages/themes/lyra/components/blog-cards-grid-filtered.tsx` (lines 39–49)
- **Issue:** Category filter `<button>` elements render `{filter?.label ?? ''}`. If `label` is absent the button has no accessible name. Additionally `aria-pressed` is only set on `index === 0` (statically `true`); all other filter buttons lack `aria-pressed` entirely, so their active/inactive state is never communicated.
- **Impact:** Screen reader users cannot identify unlabelled filter buttons, or determine which filter is active. Fails WCAG 4.1.2 when labels are missing.
- **Fix:** Guard against empty labels with a fallback `aria-label`. Add `aria-pressed={index === activeIndex}` to each button (requires a Client Component to track active index).
- **Effort:** small

---

### [Medium] A11Y-009: `ContactFormPanel` `<form>` is not associated with its heading

- **File:** `packages/themes/lyra/components/contact-form-panel.tsx` (line 40)
- **Issue:** The `<h2>` form title ("Send us a message" / `formTitle` prop) is rendered in a sibling `<div>` above the `<form>`, not associated with it. The `<form>` has no `aria-labelledby` pointing to the heading, so screen readers cannot announce the form's purpose when a user enters it by navigating form elements directly.
- **Impact:** Screen reader users who navigate directly to form fields do not hear the form's title. Minor friction.
- **Fix:** Add `id="contact-form-title"` to the `<h2>` and `aria-labelledby="contact-form-title"` to the `<form>` element.
- **Effort:** trivial

---

### [Medium] A11Y-010: Breadcrumb current item missing `aria-current="page"`

- **File:** `sites/test-lyra/app/blog/[slug]/page.tsx` (line 32)
- **Issue:** The final breadcrumb item (the current page title) is a plain `<li>` with no `aria-current` attribute. ARIA best practice (and WCAG 2.4.8) requires the current page in breadcrumb navigation to be marked with `aria-current="page"`. The `<nav aria-label="Breadcrumb">` is present and correct but the state marker is absent.
- **Impact:** Screen reader users navigating breadcrumbs on `/blog/test-post` do not receive a "current page" announcement. Minor usability gap.
- **Fix:** Add `aria-current="page"` to the `<li>` element at line 32 (or to a `<span>` wrapping the title text inside it).
- **Effort:** trivial

---

### [Low] A11Y-011: Emoji in default `AnnouncementBar` text read aloud by screen readers

- **File:** `packages/themes/lyra/components/announcement-bar.tsx` (line 22)
- **Issue:** The default `announcementText` value contains `🏆`. Screen readers announce this as "trophy" or "trophy emoji" mid-sentence, breaking natural reading flow. Affects `/` and `/contact`.
- **Impact:** Minor auditory disruption for screen reader users. Not a WCAG failure but degrades user experience.
- **Fix:** Wrap the emoji in `<span aria-hidden="true">🏆</span>`, or remove it from the default string.
- **Effort:** trivial

---

### [Low] A11Y-012: `FeaturedBlogPost` "Read Full Article" link has `href="#"`

- **File:** `packages/themes/lyra/components/featured-blog-post.tsx` (line 98)
- **Issue:** The "Read Full Article" `<a>` links to `href="#"`. Activating it scrolls to the top of the page rather than navigating to the article. The `aria-label="Read full blog post"` is present but the destination is a non-destination.
- **Impact:** Keyboard users activating this link experience unexpected scroll-to-top behaviour. Minor keyboard usability regression.
- **Fix:** Pass the post URL via a `postHref` prop and use it as the `href`, or conditionally omit the link until a real destination is provided.
- **Effort:** small

---

### [Low] A11Y-013: `SiteFooter` social icon links may have `aria-label={undefined}`

- **File:** `packages/themes/lyra/components/site-footer.tsx` (line 248)
- **Issue:** Social icon `<a>` elements set `aria-label={icon.label}`. If `icon.label` is `undefined`, the aria-label attribute resolves to `undefined` (omitted from the DOM), leaving an icon-only link with no accessible name.
- **Impact:** Screen reader users encounter unlabelled social links if `label` is not supplied. Fails WCAG 4.1.2 when label is absent.
- **Fix:** Add a fallback: `aria-label={icon.label ?? 'Social media link'}`, or make `label` a required field in the `SocialIconItem` interface.
- **Effort:** trivial

---

## Statistics

- Critical: 2
- High: 4
- Medium: 4
- Low: 3
- Total: 13
