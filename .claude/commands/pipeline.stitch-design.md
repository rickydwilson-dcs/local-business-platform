# Pipeline Stitch Design

Generate a new theme and test site using Google Stitch as the design source.
No reference URL required — Stitch creates the design from a trade/profession description.

**Usage:**

```
/pipeline.stitch-design --trade "plumber" \
  [--name "Ricky's Plumbing"] \
  [--services "Boiler installation, Emergency repairs, Bathroom fitting"] \
  [--location "East London"] \
  [--tagline "London's most trusted plumber since 1998"] \
  [--phone "020 7946 0321"] \
  [--colors "#1a3a5c"] \
  [--secondary-color "#c47a3a"] \
  [--accent-color "#f5c842"] \
  [--headline-font "newsreader"] \
  [--body-font "work-sans"] \
  [--roundness "default"] \
  [--color-variant "fidelity"] \
  [--logo-desc "A blue shield with a wrench"]
```

**Arguments:**

| Argument            | Required | Default                | Description                                                                |
| ------------------- | -------- | ---------------------- | -------------------------------------------------------------------------- |
| `--trade`           | ✓        | —                      | Business/profession type                                                   |
| `--name`            | —        | `Smith & Sons [Trade]` | Company name used in all content                                           |
| `--services`        | —        | Generic for trade      | Comma-separated list of services                                           |
| `--location`        | —        | `UK`                   | Service area, used in content and contact details                          |
| `--tagline`         | —        | Generic                | Brand tagline for hero and footer                                          |
| `--phone`           | —        | `0800 XXX XXXX`        | Phone number used in contact and footer                                    |
| `--colors`          | —        | Stitch chooses         | Primary brand colour (hex or description)                                  |
| `--secondary-color` | —        | Stitch derives         | Secondary colour hex                                                       |
| `--accent-color`    | —        | Stitch derives         | Accent/highlight colour hex                                                |
| `--headline-font`   | —        | `newsreader`           | Heading font — see font options below                                      |
| `--body-font`       | —        | `work-sans`            | Body/UI font — see font options below                                      |
| `--roundness`       | —        | `default`              | Corner radius: `sharp` `default` `soft` `pill`                             |
| `--color-variant`   | —        | `tonal`                | Palette generation: `tonal` `fidelity` `vibrant` `expressive` `monochrome` |
| `--logo-desc`       | —        | —                      | Description of logo for design system brief                                |

**Font options:**

- Serif: `newsreader` `eb-garamond` `literata` `source-serif` `domine` `libre-caslon` `noto-serif`
- Sans: `work-sans` `inter` `plus-jakarta` `space-grotesk` `montserrat` `dm-sans` `manrope` `rubik` `geist` `sora`

Theme name is auto-assigned from the constellation namespace.

---

## Step 1: Preflight

**1.1 — Branch check**

```bash
git branch --show-current
```

Must output `develop`. If not, STOP: "Switch to develop branch first."

**1.2 — Working tree check**

```bash
git status --porcelain
```

If output is non-empty, WARN: "Working tree has uncommitted changes. Proceeding anyway — stitch-design does not commit." Then continue.

**1.3 — Parse arguments**

Parse `$ARGUMENTS` for all supported flags. Store each as a variable:

| Flag                | Variable           | Default if omitted                                                        |
| ------------------- | ------------------ | ------------------------------------------------------------------------- |
| `--trade`           | `$TRADE`           | — (required)                                                              |
| `--name`            | `$COMPANY_NAME`    | `Smith & Sons [Trade]`                                                    |
| `--services`        | `$SERVICES_LIST`   | _(leave empty — Stitch will generate appropriate services for the trade)_ |
| `--location`        | `$LOCATION`        | `UK`                                                                      |
| `--tagline`         | `$TAGLINE`         | _(leave empty — generate from trade)_                                     |
| `--phone`           | `$PHONE`           | `0800 XXX XXXX`                                                           |
| `--colors`          | `$PRIMARY_COLOR`   | _(leave empty — Stitch chooses)_                                          |
| `--secondary-color` | `$SECONDARY_COLOR` | _(leave empty)_                                                           |
| `--accent-color`    | `$ACCENT_COLOR`    | _(leave empty)_                                                           |
| `--headline-font`   | `$HEADLINE_FONT`   | `newsreader`                                                              |
| `--body-font`       | `$BODY_FONT`       | `work-sans`                                                               |
| `--roundness`       | `$ROUNDNESS`       | `default`                                                                 |
| `--color-variant`   | `$COLOR_VARIANT`   | `tonal`                                                                   |
| `--logo-desc`       | `$LOGO_DESC`       | _(leave empty)_                                                           |

Map font/roundness/color-variant args to Stitch enums:

**Font name → Stitch enum:**
`newsreader`→`NEWSREADER`, `eb-garamond`→`EB_GARAMOND`, `literata`→`LITERATA`, `source-serif`→`SOURCE_SERIF_FOUR`, `domine`→`DOMINE`, `libre-caslon`→`LIBRE_CASLON_TEXT`, `noto-serif`→`NOTO_SERIF`, `work-sans`→`WORK_SANS`, `inter`→`INTER`, `plus-jakarta`→`PLUS_JAKARTA_SANS`, `space-grotesk`→`SPACE_GROTESK`, `montserrat`→`MONTSERRAT`, `dm-sans`→`DM_SANS`, `manrope`→`MANROPE`, `rubik`→`RUBIK`, `geist`→`GEIST`, `sora`→`SORA`

**Roundness → Stitch enum:** `sharp`→`ROUND_FOUR`, `default`→`ROUND_EIGHT`, `soft`→`ROUND_TWELVE`, `pill`→`ROUND_FULL`

**Color variant → Stitch enum:** `tonal`→`TONAL_SPOT`, `fidelity`→`FIDELITY`, `vibrant`→`VIBRANT`, `expressive`→`EXPRESSIVE`, `monochrome`→`MONOCHROME`, `neutral`→`NEUTRAL`

If `--trade` is missing, STOP with:

```
Usage: /pipeline.stitch-design --trade "electrical contractor" [options]

--trade is required. It describes the business type used to prompt Stitch.
Run /pipeline.stitch-design with no arguments to see all options.
```

**1.4 — Verify Stitch MCP reachable**

Attempt a lightweight probe call to the Stitch MCP (e.g. `list_projects` or equivalent low-cost tool). On failure, STOP:

```
Stitch MCP tools not available.
Ensure the Stitch MCP server is configured at user level (~/.claude/).
See the Stitch MCP documentation for setup instructions.
```

**1.5 — Auto-pick theme name**

```bash
npx tsx tools/lib/theme-name-picker.ts
```

Store the output as `$THEME_NAME`. This reads `THEME_NAMES` from `packages/theme-system/src/types.ts` and returns the first unused name from `CONSTELLATION_NAMES`.

**1.6 — Defensive collision check**

```bash
ls -d packages/themes/$THEME_NAME/ 2>/dev/null
```

If the directory exists, STOP:

```
Theme $THEME_NAME already exists in packages/themes/ but is not in THEME_NAMES —
THEME_NAMES may be out of sync. Investigate before proceeding.
```

---

## Step 2: Create Stitch Project, Design System, and Generate Pages

**2a — Create project**

Call Stitch MCP `create_project` with human-readable name:

```
<ThemeNameTitleCase> <Trade> Website
```

Examples:

- theme `lyra` + trade `electrical contractor` → `Lyra Electrical Contractor Website`
- theme `nova` + trade `plumber` → `Nova Plumber Website`

Store the returned project ID as `$PROJECT_ID`.

**2b — Create design system**

Call Stitch MCP `create_design_system` with `projectId: $PROJECT_ID` and these fields:

```
displayName: "$THEME_NAME Design System"
theme:
  headlineFont: <$HEADLINE_FONT enum>       # e.g. NEWSREADER
  bodyFont: <$BODY_FONT enum>               # e.g. WORK_SANS
  customColor: <primary hex>                # from $PRIMARY_COLOR if provided, else omit
  overrideSecondaryColor: <hex>             # from $SECONDARY_COLOR if provided, else omit
  overrideTertiaryColor: <hex>              # from $ACCENT_COLOR if provided, else omit
  colorMode: LIGHT
  colorVariant: <$COLOR_VARIANT enum>       # e.g. TONAL_SPOT
  roundness: <$ROUNDNESS enum>              # e.g. ROUND_EIGHT
  designMd: <constructed below>
```

**Construct `designMd`** using three parts:

**Part A — Brand Identity** (same variables as before):

```markdown
# Brand Identity

Company: $COMPANY_NAME
Trade: $TRADE
[If $LOCATION provided:] Location: $LOCATION
[If $TAGLINE provided:] Tagline: $TAGLINE
[If $LOGO_DESC provided:] Logo: $LOGO_DESC

# Content

[If $SERVICES_LIST provided:] Services offered: $SERVICES_LIST
[If $PHONE provided:] Phone: $PHONE
```

**Part B — Taste-informed design system (primary path):**

Before calling `create_design_system`, invoke the `stitch-design-taste` skill with the following parameters to generate a design system brief calibrated for this project:

- Project: $COMPANY_NAME — a $TRADE business
- Primary colour: $PRIMARY_COLOR (if provided)
- **Local business Dial overrides (use these — do not use the skill's defaults):**
  - Creativity: 4
  - Density: 5
  - Variance: 3
  - Motion Intent: 2
- Request only sections: 2 (Color Palette), 3 (Typography Rules), 4 (Component Stylings), 6 (Layout Principles), and 9 (Anti-Patterns)
- Omit: Hero inline image technique, motion philosophy section, dashboard constraints — these are SaaS patterns inappropriate for local service businesses

Store the taste skill output as `$TASTE_DESIGN_BLOCK`.

**Part C — Static fallback typography contract:**

If `$TASTE_DESIGN_BLOCK` is empty or the skill invocation was not successful, use this embedded block instead:

```markdown
## Typography System

**Display/Headlines:** Track-tight (-0.025em), weight-driven hierarchy (700–900), leading 1.1. Not screaming — hierarchy through weight, not excessive size.
**Body:** Weight 400, leading 1.65, max 65 characters per line.
**Scale:** H1 at clamp(2.5rem, 5vw, 4rem). H2 at clamp(1.5rem, 3vw, 2.25rem). Body at 1rem.

**H1 rules:** font-weight 800–900, sentence case, tracking -0.025em, leading 1.1. NEVER uppercase.
**H2 rules:** font-weight 700, sentence case, tracking -0.015em, leading 1.2. NEVER uppercase.
**Eyebrow labels only** may use uppercase — never H1 or H2.

**Banned:**

- Inter font (use Geist, Work Sans, Space Grotesk, or the specified $HEADLINE_FONT)
- ALL CAPS on headings
- Gradient text on headings
- Decorative outline or shadow treatments on headings
- Different heading weights or casings across pages

## Anti-Patterns

- No generic 3-column equal card layouts — use 2-column zig-zag or asymmetric grids
- No overlapping elements — every element in its own spatial zone
- No AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen"
- No pure black (#000000) — use off-black or dark grays
- No neon/oversaturated accents
- No fake round numbers (99.99%, 50%) — use organic data
- No emojis anywhere
```

**Final `designMd`** = Part A + (Part B `$TASTE_DESIGN_BLOCK` if non-empty, else Part C)

Before calling `create_design_system`, log the full `designMd` string to the terminal so it can be reviewed.

Store the returned design system asset ID as `$DESIGN_SYSTEM_ID`.

**2c — Generate exactly 5 screens**

Generate the home page first, then use it as the explicit visual reference for all subsequent pages.

**2c-i — Generate home screen**

Submit the home generation request, substituting all `$VARIABLES` with their parsed values:

```
Home page for "$COMPANY_NAME" — a professional $LOCATION $TRADE business.
[If $TAGLINE:] Brand tagline: "$TAGLINE"
[If $SERVICES_LIST:] Services: $SERVICES_LIST
[If $PHONE:] Phone: $PHONE

Sections:
- Fixed navigation bar: company name in headline font (brand primary colour), nav links (Services / About / Contact), prominent "Get a Quote" CTA button
- Hero: full-bleed image with gradient overlay, large serif heading, subheading, two CTA buttons, optional floating review/stats card
- Stats bar: 3 stats with Material Symbols icons, brand-primary accent numbers
- Services overview: 3–4 cards with image, icon, heading, description, "Details" link
  [If $SERVICES_LIST:] Use these services: $SERVICES_LIST
- Testimonials: 2-column card grid, quote icon, star rating, italic blockquote, avatar with initials
- CTA band: full-bleed brand-primary background, decorative icon, heading, body, two buttons
- Footer: 3-column grid — brand+tagline, navigation links, contact details (phone, address)
  [If $TAGLINE:] Use "$TAGLINE" as the brand description in the footer
  [If $PHONE:] Use $PHONE in the footer contact column
```

Store the returned screen ID as `$HOME_SCREEN_ID`.

**2c-i-confirm — Confirm home screen exists**

After the `generate_screen_from_text` call returns (whether it returned a screen ID or timed out), call `get_project` for `$PROJECT_ID`. Check `screenInstances` in the response for a new entry. If found, confirm `$HOME_SCREEN_ID` and **wait 10 minutes** before proceeding to the heading extraction and next screen. If **not** found, STOP:

```
Home screen did not appear in screenInstances after submission.
Do not retry the generation call — retrying creates duplicates.
Check Stitch directly, retrieve the screen ID, and resume from 2c-i-extract.
```

**2c-i-extract — Extract heading classes from home screen**

After storing `$HOME_SCREEN_ID`, call `get_screen` for `$HOME_SCREEN_ID` to retrieve the home page HTML.

Parse the returned HTML:

- Find the first `<h1>` element and extract its full `class` attribute value → store as `$H1_CLASSES`
- Find all `<h2>` elements, extract their `class` attribute values, pick the most frequently occurring class string (by exact string match) → store as `$H2_CLASSES`

Example of what to extract and store:

```
$H1_CLASSES = "font-headline text-5xl md:text-7xl font-extrabold tracking-tight leading-none"
$H2_CLASSES = "font-headline text-3xl md:text-4xl font-bold tracking-tight leading-snug"
```

If `get_screen` fails, or the HTML contains no `<h1>` or `<h2>` elements, set both `$H1_CLASSES` and `$H2_CLASSES` to empty strings and continue — the static constraints in the per-page prompts below still apply.

Log the extracted values:

```
H1 classes extracted: $H1_CLASSES
H2 classes extracted: $H2_CLASSES
```

**2c-ii — Generate remaining 4 screens (one at a time)**

Generate each screen individually. **Confirm each screen exists in `get_project` before submitting the next.** Do not submit screens in parallel or in batch. **Wait 10 minutes between screens** — submitting faster causes timeouts even when the previous screen completed successfully.

For each screen, prepend the following consistency instruction (substituting variables):

```
This is a page for the same website as the home page (screen ID: $HOME_SCREEN_ID).

Company: "$COMPANY_NAME" — a $TRADE business[If $LOCATION:] in $LOCATION]
[If $PHONE:] Phone: $PHONE

MATCH THE HOME PAGE EXACTLY for:
- Navigation bar: identical component — same font, same layout, same button style
- Footer: identical component — same 3-column structure, same content areas
- Typography: same heading font and body font as the home page — do not change font choices
- Hero section style: if this page has a hero, use the same font weight, overlay treatment, and badge style as the home page hero
- Button styles: same border-radius, same padding, same font weight as home page buttons
- Colour usage: same semantic colour assignments as the home page

Typography hard constraints — use these exact Tailwind classes on all heading elements:
[If $H1_CLASSES is non-empty:] - All <h1> elements MUST use exactly these classes: $H1_CLASSES
[If $H2_CLASSES is non-empty:] - All <h2> elements MUST use exactly these classes: $H2_CLASSES
[If $H1_CLASSES is empty:] - All <h1> elements: font-extrabold tracking-tight leading-tight, size equivalent to clamp(2.5rem,5vw,4rem). Sentence case. NEVER uppercase.
[If $H2_CLASSES is empty:] - All <h2> elements: font-bold tracking-tight leading-snug, size equivalent to clamp(1.5rem,3vw,2.25rem). Sentence case. NEVER uppercase.

Do not add, remove, or substitute any of these classes. Do not use uppercase, font-black, or any heading modifier not present in the constraints above.

Page-specific content:
```

Then append the page-specific sections. For each screen: submit it, then immediately call `get_project` for `$PROJECT_ID` and check `screenInstances` for the new entry. If found, store the screen ID and proceed. If **not** found, STOP — do not retry.

| Screen         | Slug             | Page-specific sections                                                                                                                                                                                                                          |
| -------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| About          | `about`          | Company story with founding year[If $LOCATION: and $LOCATION roots], pull-quote, team grid (4 members with hover reveal), values cards (3, icon + hover colour change), trust/accreditations bar (4 items, grayscale→colour on hover), CTA band |
| Contact        | `contact`        | Page header with hero image, contact form (name/email/phone/message), contact info sidebar ([If $PHONE: $PHONE /] address / hours), map image placeholder, landscape image break                                                                |
| Services       | `services`       | Breadcrumb, page header, 6-card service grid (icon + image + description + "Learn more" link)[If $SERVICES_LIST: using these services: $SERVICES_LIST], CTA band with decorative icon                                                           |
| Service Detail | `service-detail` | Breadcrumb, hero for [first service from $SERVICES_LIST or "primary service"], description + benefits card (4 benefits with icons), 3-image staggered gallery with hover captions, FAQ accordion (3 questions), CTA panel                       |
| Blog           | `blog`           | Breadcrumb, page header, article card grid (6 cards: featured image, category tag, title, excerpt, read-time, author avatar + name, "Read more" link), pagination controls, sidebar with categories + recent posts                              |
| Blog Detail    | `blog-detail`    | Breadcrumb, full-bleed hero with title + author + date + read-time, article body (rich prose: dropcap first paragraph, pull-quote block, body text, subheadings), author bio card, related articles (3 cards), CTA band                         |

After each screen submission, confirm via `get_project` `screenInstances` before sending the next. If any screen does not appear in `screenInstances`, STOP and report which screen failed. Do not call `list_screens` — it is broken. Do not retry a timed-out generation call — the generation completed silently.

**Fallback: blog-detail screen fails repeatedly**

If `blog-detail` does not appear in `screenInstances` after two attempts (15+ minutes each), skip it. The TSX page for `blog-detail` can be adapted directly from the `blog.html` source using the same pipeline adaptation rules. Mark the screen as "adapted-from-blog" in `meta/token-mapping-report.json`. This is an acceptable outcome — blog-detail is the most complex screen and Stitch occasionally rejects it with "service unavailable".

**2d — Apply design system to all screens**

Call `get_project` for `$PROJECT_ID` to retrieve screen instance IDs. Then call `apply_design_system` with:

- `projectId: $PROJECT_ID`
- `assetId: $DESIGN_SYSTEM_ID`
- `selectedScreenInstances`: all screen instances from the project

This enforces fonts, colours, and roundness across any screens that drifted during generation.

**2e — Heading drift report**

Run the heading drift report across the 5 downloaded HTML files:

```bash
npx tsx tools/stitch-normalize-headings.mjs \
  --dir output/ingestion/$THEME_NAME-stitch/html \
  --h1 "$H1_CLASSES" \
  --h2 "$H2_CLASSES"
```

Review the output table. If the script exits 0 (no drift), proceed to Step 3.

If the script exits 1 (drift detected), show the drift table to the user and ask:

```
Headings drifted on [N] page(s). Choose:
1. Proceed anyway — accept the drift and continue to Step 3
2. Auto-normalise — rewrite drifted classes to match home page, then continue
3. Stop — I will re-generate the drifted pages manually

Enter 1, 2, or 3:
```

If the user chooses 2, re-run with `--enforce`:

```bash
npx tsx tools/stitch-normalize-headings.mjs \
  --dir output/ingestion/$THEME_NAME-stitch/html \
  --h1 "$H1_CLASSES" \
  --h2 "$H2_CLASSES" \
  --enforce
```

Then continue to Step 3.

If the user chooses 3, STOP with instructions to re-generate the specific pages and then resume from Step 3.

---

## Step 3: Download Design Assets

Create output folders:

```bash
mkdir -p output/ingestion/$THEME_NAME-stitch/design-system
mkdir -p output/ingestion/$THEME_NAME-stitch/html
mkdir -p output/ingestion/$THEME_NAME-stitch/images
mkdir -p output/ingestion/$THEME_NAME-stitch/meta
```

Download in parallel where possible:

- Call `get_design_system` for `$PROJECT_ID` → write `output/ingestion/$THEME_NAME-stitch/design-system/tokens.json`
- Call `get_project` for `$PROJECT_ID` → extract `screenInstances` → write to `output/ingestion/$THEME_NAME-stitch/meta/screens.json`
- Write `output/ingestion/$THEME_NAME-stitch/meta/project.json`:
  ```json
  {
    "projectId": "$PROJECT_ID",
    "projectName": "<ThemeNameTitleCase> <Trade> Website",
    "themeName": "$THEME_NAME",
    "trade": "<trade arg>",
    "colors": "<colors arg or null>",
    "generatedAt": "<ISO timestamp>"
  }
  ```
- For each of the 5 screens, call the Stitch HTML export tool → write to `output/ingestion/$THEME_NAME-stitch/html/<slug>.html`

**3b — Download images**

After all HTML files are written, extract and download all AI-generated images:

1. Parse all 5 HTML files for every unique `https://lh3.googleusercontent.com/` URL in `src="..."` attributes
2. Download each to `output/ingestion/$THEME_NAME-stitch/images/img-NNN.jpg` (sequential, zero-padded to 3 digits)
3. Write `output/ingestion/$THEME_NAME-stitch/meta/image-manifest.json`:
   ```json
   { "img-001.jpg": "<original-url>", "img-002.jpg": "<original-url>" }
   ```

```bash
# Verification gate — STOP if this fails
ls output/ingestion/$THEME_NAME-stitch/design-system/tokens.json
ls output/ingestion/$THEME_NAME-stitch/html/home.html
ls output/ingestion/$THEME_NAME-stitch/html/about.html
ls output/ingestion/$THEME_NAME-stitch/html/contact.html
ls output/ingestion/$THEME_NAME-stitch/html/services.html
ls output/ingestion/$THEME_NAME-stitch/html/service-detail.html
ls output/ingestion/$THEME_NAME-stitch/html/blog.html
ls output/ingestion/$THEME_NAME-stitch/html/blog-detail.html
ls output/ingestion/$THEME_NAME-stitch/meta/project.json
ls output/ingestion/$THEME_NAME-stitch/meta/screens.json
ls output/ingestion/$THEME_NAME-stitch/meta/image-manifest.json
# All 11 files must exist and be non-empty
ls output/ingestion/$THEME_NAME-stitch/images/ | grep -c img
# Must be > 0
```

---

## Step 4: Create Theme Package

**4a — Extract colours from tokens.json**

Read `output/ingestion/$THEME_NAME-stitch/design-system/tokens.json`.

Resolve each ThemeConfig field using the alias resolution order below (first match wins):

| ThemeConfig field           | Stitch token aliases to try (in order)                                     | Fallback                                             |
| --------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------- |
| `colors.brand.primary`      | `primaryColor`, `primary`, `colors.primary`, `brand.primary`, `brandColor` | `#2563eb`                                            |
| `colors.brand.primaryHover` | `primaryHover`, `primary-hover`                                            | Darken primary ~12%                                  |
| `colors.brand.secondary`    | `secondaryColor`, `secondary`, `colors.secondary`                          | `#1e3a5f`                                            |
| `colors.brand.accent`       | `accentColor`, `accent`, `tertiary`, `highlight`                           | `#06b6d4`                                            |
| `colors.brand.onPrimary`    | `onPrimary`, `primaryForeground`, `primaryText`                            | `#ffffff` if primary luminance < 0.5, else `#111827` |
| `colors.surface.background` | `backgroundColor`, `background`, `surface`, `bgColor`                      | `#ffffff`                                            |
| `colors.surface.foreground` | `onBackground`, `textColor`, `foreground`, `text`                          | `#111827`                                            |
| `colors.surface.card`       | `surfaceColor`, `cardBackground`, `card`, `surfaceContainer`               | `#ffffff`                                            |
| `colors.surface.cardBorder` | `outlineColor`, `border`, `outline`, `divider`                             | `#e2e8f0`                                            |
| `colors.surface.muted`      | `neutralColor`, `muted`, `surfaceVariant`, `neutral`                       | `#f8fafc`                                            |
| `colors.semantic.success`   | `success`, `successColor`                                                  | `#10b981`                                            |
| `colors.semantic.warning`   | `warning`, `warningColor`                                                  | `#f59e0b`                                            |
| `colors.semantic.error`     | `error`, `errorColor`                                                      | `#ef4444`                                            |
| `colors.semantic.info`      | `info`, `infoColor`                                                        | `#3b82f6`                                            |
| `colors.overlay.dark`       | `overlayDark`, `scrim`                                                     | `rgba(0,0,0,0.8)`                                    |
| `colors.overlay.light`      | `overlayLight`                                                             | `rgba(255,255,255,0.8)`                              |
| `colors.overlay.primary`    | `overlayPrimary`                                                           | `rgba(<primary-rgb>,0.8)`                            |

**4b — Record provenance**

Write `output/ingestion/$THEME_NAME-stitch/meta/token-mapping-report.json`:

```json
{
  "colors.brand.primary": { "source": "direct", "stitchKey": "primaryColor", "value": "#dc2626" },
  "colors.brand.primaryHover": {
    "source": "derived",
    "from": "colors.brand.primary",
    "value": "#b91c1c"
  },
  "colors.surface.muted": { "source": "fallback", "value": "#f8fafc" }
}
```

Each key maps to one of: `"source": "direct"` (found via alias), `"source": "derived"` (computed from another value), or `"source": "fallback"` (no match, used default).

**4c — Infer ComponentRegistry variants from html/home.html**

Read `output/ingestion/$THEME_NAME-stitch/html/home.html` and apply these heuristics:

| Field            | Heuristic                                                                                                                                      | Values                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `heroVariant`    | Full-width background image or `background-image` CSS → `"image-overlay"`; two-column split layout → `"split"`                                 | `"image-overlay"` \| `"split"`                                |
| `headerVariant`  | Header/nav background luminance < 0.3 → `"dark"`                                                                                               | `"dark"` \| `"light"`                                         |
| `cardVariant`    | Circular icon containers (`border-radius:50%` or `rounded-full`) → `"icon-circle"`; image overlay cards → `"overlay"`; else → `"standard"`     | `"icon-circle"` \| `"overlay"` \| `"standard"`                |
| `sectionVariant` | Alternating dark brand block → `"dark-accent"`; recurring gradients → `"gradient"`; alternating tinted bands → `"banded"`; else → `"standard"` | `"dark-accent"` \| `"gradient"` \| `"banded"` \| `"standard"` |

**4d — Write packages/themes/$THEME_NAME/index.ts**

Follow the orion/vega export pattern exactly:

```typescript
/**
 * <ThemeNameTitleCase> Theme
 *
 * Generated by /pipeline.stitch-design
 * Stitch project: <project-name> (id: <project-id>)
 * Trade type: <trade>
 *
 * Sites using <ThemeNameTitleCase>: (none yet)
 */
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const <camelCaseThemeName>Registry: ComponentRegistry = {
  theme: "<theme-name>",
  heroVariant: "<inferred>",
  headerVariant: "<inferred>",
  cardVariant: "<inferred>",
  sectionVariant: "<inferred>",
};

export const <camelCaseThemeName>DefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: '<extracted>',
      primaryHover: '<extracted or derived>',
      secondary: '<extracted>',
      accent: '<extracted>',
      onPrimary: '<extracted or inferred>',
    },
    surface: {
      background: '<extracted>',
      foreground: '<extracted>',
      card: '<extracted>',
      cardBorder: '<extracted>',
      muted: '<extracted>',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    overlay: {
      dark: '<extracted or fallback>',
      light: '<extracted or fallback>',
      primary: '<extracted or derived>',
    },
  },
};

registerTheme({ name: '<theme-name>', label: '<ThemeNameTitleCase>', config: <camelCaseThemeName>DefaultConfig });
```

Replace all `<...>` placeholders with the extracted/inferred values from steps 4a–4c.

**4e — Write packages/themes/$THEME_NAME/globals.css**

Copy `packages/themes/vega/globals.css` verbatim (it uses only `@apply` with theme tokens — entirely colour-agnostic). Replace the file header comment to identify the new theme:

```css
/* Shared animation keyframes — do not move below theme-specific CSS */
@import "../../core-components/src/styles/animations.css";

/*
 * <ThemeNameTitleCase> Theme — Global CSS Utilities
 *
 * Theme-level utility classes shared by all <ThemeNameTitleCase> sites.
 * Import this file at the top of your site's app/globals.css:
 *
 *   @import "../../packages/themes/<theme-name>/globals.css";
 *   @tailwind base;
 *   @tailwind components;
 *   @tailwind utilities;
 *
 * Generated by /pipeline.stitch-design from Stitch project: <project-name>
 */
```

The remainder of the file (buttons, cards, sections, containers, etc.) is copied unchanged.

**4f — Update THEME_NAMES in packages/theme-system/src/types.ts**

Append `"$THEME_NAME"` to the `THEME_NAMES` array. This is MANDATORY. Without it, the next run of `pickNextThemeName()` will try to create the same name again.

Example — before:

```typescript
export const THEME_NAMES = ["orion", "vega"] as const;
```

After (for theme `lyra`):

```typescript
export const THEME_NAMES = ["orion", "vega", "lyra"] as const;
```

**Verification gate — STOP if this fails:**

```bash
npx tsx -e "import { pickNextThemeName } from './tools/lib/theme-name-picker.ts'; console.log(pickNextThemeName());"
# Output must be the constellation name AFTER $THEME_NAME, not $THEME_NAME itself
```

---

## Step 5: Scaffold and Wire Test Site

**5a — Copy base-template**

```bash
cp -r sites/base-template sites/$THEME_NAME-test
rm -rf sites/$THEME_NAME-test/node_modules sites/$THEME_NAME-test/.next sites/$THEME_NAME-test/.turbo
```

**5b — Write marker file**

Write `sites/$THEME_NAME-test/.pipeline-test-site.json`:

```json
{
  "createdAt": "<ISO timestamp>",
  "themeName": "$THEME_NAME",
  "sourceUrl": "stitch:<PROJECT_ID>",
  "pipelineOutput": "output/ingestion/$THEME_NAME-stitch/"
}
```

**5c — Rewrite theme.config.ts**

```typescript
import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { <camelCaseThemeName>Registry, <camelCaseThemeName>DefaultConfig } from '@platform/themes/<theme-name>';

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: <camelCaseThemeName>Registry,
  ...<camelCaseThemeName>DefaultConfig,
};
```

**5d — Rewrite app/globals.css**

```css
@import "../../../packages/themes/$THEME_NAME/globals.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

/**
 * Pipeline Test Site — $THEME_NAME theme (Stitch)
 * Generated by /pipeline.stitch-design
 */

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-surface-background text-surface-foreground;
    font-feature-settings:
      "rlig" 1,
      "calt" 1;
  }
}
```

**5e — Generate CI-inert package.json**

1. Read `sites/base-template/package.json`
2. Call `generateTestSitePackageJson('$THEME_NAME-test', basePackageJson)` from `tools/lib/test-site-package.ts`
3. Write the result to `sites/$THEME_NAME-test/package.json`

**Verification gate — STOP if this fails:**

```bash
node -e "
  const p = require('./sites/$THEME_NAME-test/package.json');
  const bad = ['build','type-check','lint','test'].filter(s => p.scripts?.[s]);
  if (bad.length) { console.error('FAIL: CI scripts present:', bad); process.exit(1); }
  if (!p.pipelineTestSite) { console.error('FAIL: missing pipelineTestSite marker'); process.exit(1); }
  console.log('PASS: test site is CI-inert');
"
```

**5f — Update site.config.ts tagline**

Update the `tagline` field to:

```
Pipeline Test Site — $THEME_NAME theme (Stitch)
```

**5g — Generate Stitch TSX Pages**

Produce five self-contained TSX server component pages that replicate the Stitch HTML designs section-by-section. These replace the base-template placeholder pages and form the visual comparison basis of the test site.

**Pre-conditions:** Images must already be downloaded to `output/ingestion/$THEME_NAME-stitch/images/` and copied to `sites/$THEME_NAME-test/public/stitch-images/`.

**First — copy images to test site:**

```bash
mkdir -p sites/$THEME_NAME-test/public/stitch-images
cp output/ingestion/$THEME_NAME-stitch/images/img-*.jpg sites/$THEME_NAME-test/public/stitch-images/
ls sites/$THEME_NAME-test/public/stitch-images/ | wc -l
# Must match image count from output/ingestion/$THEME_NAME-stitch/images/
```

**Files to create/replace:**

- `sites/$THEME_NAME-test/app/layout.tsx` — keep ThemeProvider structure; no `<head>` font tags (fonts load via globals.css @import)
- `sites/$THEME_NAME-test/app/globals.css` — rewrite to add Google Fonts `@import` at the top before `@tailwind` directives
- `sites/$THEME_NAME-test/app/page.tsx` — home
- `sites/$THEME_NAME-test/app/about/page.tsx` — about
- `sites/$THEME_NAME-test/app/contact/page.tsx` — contact
- `sites/$THEME_NAME-test/app/services/page.tsx` — services listing
- `sites/$THEME_NAME-test/app/services/[first-service-slug]/page.tsx` — service detail (static route, not dynamic)
- `sites/$THEME_NAME-test/app/blog/page.tsx` — blog listing (from Stitch blog.html)
- `sites/$THEME_NAME-test/app/blog/[slug]/page.tsx` — blog detail (from Stitch blog-detail.html; use first article title as static slug)
- `sites/$THEME_NAME-test/app/locations/page.tsx` — locations listing (adapted from services listing HTML)
- `sites/$THEME_NAME-test/app/locations/[slug]/page.tsx` — location detail (adapted from service-detail HTML)
- `sites/$THEME_NAME-test/app/projects/page.tsx` — projects listing (adapted from services listing HTML)
- `sites/$THEME_NAME-test/app/projects/[slug]/page.tsx` — project detail (adapted from service-detail HTML)
- `sites/$THEME_NAME-test/app/privacy-policy/page.tsx` — static prose template (no Stitch source)
- `sites/$THEME_NAME-test/app/cookie-policy/page.tsx` — static prose template (no Stitch source)

**Rules:**

- Read each Stitch HTML file in full before writing its TSX counterpart — the HTML is source of truth for sections, content, and layout
- No `'use client'`, no platform imports (`@platform/core-components`, `siteConfig`, etc.)
- All content hardcoded from the Stitch HTML — do not use MDX or siteConfig
- `<img src="/stitch-images/img-NNN.jpg" alt="..." />` — not `next/image`
- `<a href="...">` — not `<Link>`
- Material Symbols: `<span className="material-symbols-outlined">icon_name</span>`. Filled: add `style={{ fontVariationSettings: "'FILL' 1" }}`
- FAQ accordions: `<details>`/`<summary>` with `group-open:rotate-180` on chevron — no JS state
- Nav and footer are inlined per page (no shared import)
- **Opacity modifiers on theme tokens don't work:** Tailwind's `/opacity` modifier (e.g. `bg-surface-background/80`) renders transparent when the color comes from a CSS custom property. Always use hardcoded hex with opacity instead: `bg-[#fbf9f5]/80`, `bg-[#163526]/30` etc. This applies everywhere — navs, overlays, decorative elements.
- **CSS fidelity:** Copy ALL CSS classes from each Stitch HTML element faithfully. Do not omit or simplify hover effects, transition durations (`duration-500`, `duration-700`), grayscale filters (`grayscale-[20%]`), scale transforms (`scale-105`), opacity values, or micro-interactions. If the Stitch HTML has it, the TSX must have it.
- Translate all Stitch MD3 color tokens to theme token classes using the canonical color map:

| Stitch token             | Theme token                         |
| ------------------------ | ----------------------------------- |
| `primary`                | `brand-primary`                     |
| `secondary`              | `brand-secondary`                   |
| `tertiary-fixed-dim`     | `brand-accent`                      |
| `surface` / `background` | `surface-background`                |
| `surface-container-low`  | `surface-muted`                     |
| `on-surface`             | `surface-foreground`                |
| `outline-variant`        | `surface-border`                    |
| Unmapped colors          | Tailwind arbitrary `bg-[#hexvalue]` |

**Adaptation rules for non-Stitch pages:**

_Locations listing_ — adapt from `services.html`. Swap service icon cards for location cards: use Material Symbols `location_on` icon instead of service icons. Card content: town/area name as heading, county or tagline as subheading, "View services →" link. No image required. Keep the same card-grid section structure and CTA band.

_Location detail_ — adapt from `service-detail.html`. Replace the benefits card with a "Services in [area]" card (list of 4–5 service names with links). Replace the FAQ accordion with a "Local info" section (travel time placeholder, service radius, nearby landmark note). Keep the gallery placeholder and CTA panel.

_Projects listing_ — adapt from `services.html`. Cards are image-dominant (full-bleed top image, matching the services card style). Fields: project title as heading, trade/type badge, one-sentence scope, "View project →" link. 3-column grid.

_Project detail_ — adapt from `service-detail.html`. Lead with a 2-image overview gallery (use stitch images). Replace the benefits card with a "Project scope" list (4 bullet points of what was done). Replace the FAQ accordion with a client testimonial (pull-quote, star rating row, client name). Keep the CTA panel.

_Blog listing and blog detail_ — generated directly from `blog.html` and `blog-detail.html` respectively (same approach as services and service-detail). No adaptation needed — follow the standard Stitch HTML → TSX conversion rules.

_Policy pages (privacy-policy, cookie-policy)_ — no Stitch source. Generate a clean two-column prose layout using theme tokens only:

- Left column (sticky on desktop): nav sidebar with anchor links to H2 sections — "Data we collect", "How we use it", "Cookies", "Your rights", "Contact us"
- Right column: prose content — placeholder paragraphs under each H2 heading
- On mobile: sidebar collapses to a `<details>` / `<summary>` "Jump to section" toggle
- Typography only — use `text-surface-foreground`, `text-h2`, `text-h3` tokens; no hardcoded hex
- No images, no CTA band — minimal typographic layout

**layout.tsx pattern** — Newsreader and Work Sans via `next/font/google` (Turbopack-native). Material Symbols via `<link>` in `<head>` (server-rendered, not processed by Turbopack CSS bundler — `Material_Symbols_Outlined` is not available in next/font/google):

```tsx
import type { Metadata, Viewport } from 'next';
import { Newsreader, Work_Sans } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/site.config';
import { ThemeProvider } from '@platform/core-components';
import { [camelCaseThemeName]Registry } from '@platform/themes/$THEME_NAME';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.tagline,
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${newsreader.variable} ${workSans.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider theme="$THEME_NAME" registry={[camelCaseThemeName]Registry}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**globals.css pattern** — uses CSS variables from next/font, no `@import url()`:

```css
@import "../../../packages/themes/$THEME_NAME/globals.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

/**
 * Pipeline Test Site — $THEME_NAME theme (Stitch)
 * Generated by /pipeline.stitch-design
 */

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    font-family: var(--font-work-sans), sans-serif;
    @apply bg-surface-background text-surface-foreground;
    font-feature-settings:
      "rlig" 1,
      "calt" 1;
  }
  h1,
  h2,
  h3,
  h4 {
    font-family: var(--font-newsreader), serif;
  }
  .material-symbols-outlined {
    font-family: "Material Symbols Outlined";
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    direction: ltr;
    font-feature-settings: "liga";
    font-variation-settings:
      "FILL" 0,
      "wght" 400,
      "GRAD" 0,
      "opsz" 24;
    vertical-align: middle;
  }
}
```

**Patch next.config.ts CSP** — the base-template CSP blocks Google Fonts. Update `sites/$THEME_NAME-test/next.config.ts`:

Find the `Content-Security-Policy` value and change:

```
style-src 'self' 'unsafe-inline'; font-src 'self';
```

To:

```
style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com;
```

**Verification gate:**

```bash
ls sites/$THEME_NAME-test/app/{page.tsx,about/page.tsx,contact/page.tsx,services/page.tsx} | wc -l
# Must be 4 (core Stitch pages)
ls sites/$THEME_NAME-test/app/blog/page.tsx \
   "sites/$THEME_NAME-test/app/blog/[slug]/page.tsx" \
   sites/$THEME_NAME-test/app/locations/page.tsx \
   "sites/$THEME_NAME-test/app/locations/[slug]/page.tsx" \
   sites/$THEME_NAME-test/app/projects/page.tsx \
   "sites/$THEME_NAME-test/app/projects/[slug]/page.tsx" \
   sites/$THEME_NAME-test/app/privacy-policy/page.tsx \
   sites/$THEME_NAME-test/app/cookie-policy/page.tsx | wc -l
# Must be 8
grep -l "@platform/core-components\|siteConfig\|getContentItems" \
  sites/$THEME_NAME-test/app/page.tsx \
  sites/$THEME_NAME-test/app/about/page.tsx \
  sites/$THEME_NAME-test/app/contact/page.tsx \
  sites/$THEME_NAME-test/app/services/page.tsx 2>/dev/null | wc -l
# Must be 0
```

---

## Step 5h: Fidelity Review + Fix

Write the review criteria to `output/ingestion/$THEME_NAME-stitch/meta/validate-review-prompt.txt`:

```
Compare each of the 5 rendered pages against its Stitch HTML source. For each difference, write a structured finding.

**Reference material:**
- **Dev server screenshots** (actual rendered output): `output/ingestion/$THEME_NAME-stitch/meta/dev-screenshots/` — `home.png`, `about.png`, `contact.png`, `services.png`, `service-detail.png`. Run `ls` to confirm which exist. **Read these PNG files directly** as the primary visual reference.
- **Stitch HTML exports**: `output/ingestion/$THEME_NAME-stitch/html/` — `home.html`, `about.html`, `contact.html`, `services.html`, `service-detail.html`. These are the source of truth for sections, layout, and CSS class fidelity.

**Pages to compare:**
- `meta/dev-screenshots/home.png` + Fetch rendered `/` → compare against `html/home.html`
- `meta/dev-screenshots/about.png` + Fetch rendered `/about` → compare against `html/about.html`
- `meta/dev-screenshots/contact.png` + Fetch rendered `/contact` → compare against `html/contact.html`
- `meta/dev-screenshots/services.png` + Fetch rendered `/services` → compare against `html/services.html`
- `meta/dev-screenshots/service-detail.png` + Fetch rendered `/services/[first-service-slug]` → compare against `html/service-detail.html`

Also read each corresponding TSX file so you can identify where to apply fixes.

**What to check (Stitch HTML fidelity — exact CSS replication):**
1. **Font loading** — Are heading and body fonts loading correctly? Check for font variable CSS classes on `<html>`.
2. **Section completeness** — Is every section from the Stitch HTML present in the rendered page?
3. **CSS class fidelity** — Are hover effects, transition durations (`duration-500`, `duration-700`), grayscale filters (`grayscale-[20%]`), scale transforms (`scale-105`), and opacity values present?
4. **Stitch MD3 colour token mapping** — Are Stitch tokens correctly mapped to theme tokens?
   - `primary` → `brand-primary`
   - `secondary` → `brand-secondary`
   - `tertiary-fixed-dim` → `brand-accent`
   - `surface` / `background` → `surface-background`
   - `surface-container-low` → `surface-muted`
   - `on-surface` → `surface-foreground`
   - `outline-variant` → `surface-border`
5. **Image rendering** — Are Stitch AI-generated images rendering (from `/stitch-images/img-NNN.jpg`) or showing as placeholders?
6. **Nav and footer** — Present and inlined on every page?
7. **FAQ accordions** — Using `<details>`/`<summary>` pattern (not JS state)?
8. **Material Symbols** — `<span className="material-symbols-outlined">icon_name</span>` pattern used correctly?

**Stitch token colour map** (use for fixing colour token findings):
| Stitch token | Theme token class |
|---|---|
| `primary` | `brand-primary` |
| `secondary` | `brand-secondary` |
| `tertiary-fixed-dim` | `brand-accent` |
| `surface` / `background` | `surface-background` |
| `surface-container-low` | `surface-muted` |
| `on-surface` | `surface-foreground` |
| `outline-variant` | `surface-border` |
| Unmapped colors | Tailwind arbitrary `bg-[#hexvalue]` |

**Do NOT flag as findings:**
- Form fields being `readOnly` (static visual comparison — intentional)
- Local `/stitch-images/` paths instead of Google URLs (intentional — images are localised)
- Simplified footers on contact and service-detail pages (brief-specified minimal footer)
- `<a>` instead of `<Link>` (intentional per TSX generation rules)
- Opacity modifier differences where hardcoded hex was used instead of theme token (intentional — opacity on CSS custom properties does not work in Tailwind)
```

Then run the shared validation skill:

```
/pipeline.validate-site \
  --site-dir sites/$THEME_NAME-test \
  --pages "/ /about /contact /services /services/[first-service-slug]" \
  --review-prompt-file output/ingestion/$THEME_NAME-stitch/meta/validate-review-prompt.txt \
  --findings-file output/ingestion/$THEME_NAME-stitch/meta/tsx-review-findings.json \
  --fix-log-file output/ingestion/$THEME_NAME-stitch/meta/tsx-fix-log.json \
  --screenshot-dir output/ingestion/$THEME_NAME-stitch/meta/dev-screenshots
```

---

## Step 5i: Post-Generation Visual Fidelity Check

After `/pipeline.validate-site` completes, spawn `cs-visual-fidelity-reviewer` to compare the Stitch reference screenshots against the rendered test site screenshots.

The Stitch reference screenshots are the AI-generated page designs downloaded from the Stitch MCP in Step 3 (stored in `output/ingestion/$THEME_NAME-stitch/stitch-screens/`). The rendered screenshots were captured during `/pipeline.validate-site` Step 2 (stored in `output/ingestion/$THEME_NAME-stitch/meta/dev-screenshots/`).

Spawn `cs-visual-fidelity-reviewer` with model `opus`:

> You are `cs-visual-fidelity-reviewer`. Compare the Stitch reference screenshots against the rendered test site screenshots and identify visual drift in colour, typography, layout, and component variants.
>
> **Inputs:**
>
> - Reference screenshots (Stitch originals): `output/ingestion/$THEME_NAME-stitch/stitch-screens/`
> - Rendered screenshots (dev server): `output/ingestion/$THEME_NAME-stitch/meta/dev-screenshots/`
> - Session directory: `output/ingestion/$THEME_NAME-stitch/meta/`
> - Theme name: `$THEME_NAME`
> - Scope: full
>
> Follow your agent procedure exactly. Pair screenshots by filename where possible; the Stitch screens may use different filenames (`screen-home.png`, `screen-about.png`) — use your best judgement to match them to rendered equivalents (`home.png`, `about.png`).
>
> Write findings to `output/ingestion/$THEME_NAME-stitch/meta/findings-visual-fidelity.md`.

Wait for the agent to complete. Then read `output/ingestion/$THEME_NAME-stitch/meta/findings-visual-fidelity.md` and check the Statistics block.

**If `Critical + High > 0`:** STOP and print the findings file to the user. Do not proceed to Step 6 until the user reviews the findings and either:

1. Instructs you to fix the Critical/High issues (hand off to `cs-frontend-engineer` for remediation), or
2. Explicitly accepts the findings and instructs you to continue anyway.

**If `Critical + High == 0`:** proceed to Step 6 normally.

---

## Step 6: Lockfile and Type-check

**6a — Update lockfile**

```bash
pnpm install --lockfile-only
```

If that fails:

```bash
pnpm install
```

**6b — Verify lockfile is valid**

```bash
pnpm install --frozen-lockfile
```

**6c — Type-check test site** (report errors but do not block)

```bash
cd sites/$THEME_NAME-test && npx tsc --noEmit
```

Report any errors to the user without stopping.

**6d — Stage all changes**

```bash
git add sites/$THEME_NAME-test/ packages/themes/$THEME_NAME/ packages/theme-system/src/types.ts pnpm-lock.yaml
```

---

## Step 7: Report

Output this summary to the user:

```
✓ Theme assigned:   $THEME_NAME  (constellation namespace)
✓ Stitch project:   <project-name>  (id: $PROJECT_ID)
✓ Design system:    $DESIGN_SYSTEM_ID
    headline font:  $HEADLINE_FONT  |  body font: $BODY_FONT
    primary colour: $PRIMARY_COLOR  |  roundness: $ROUNDNESS  |  variant: $COLOR_VARIANT
✓ Company:          $COMPANY_NAME ($TRADE[, $LOCATION if set])
✓ Design assets:    output/ingestion/$THEME_NAME-stitch/
    html/           — 7 page exports (home, about, contact, services, service-detail, blog, blog-detail)
    design-system/  — tokens.json
    meta/           — project.json, screens.json, token-mapping-report.json, image-manifest.json,
                      tsx-review-findings.json, tsx-fix-log.json
    images/         — downloaded AI-generated images
✓ Theme package:    packages/themes/$THEME_NAME/
✓ Test site:        sites/$THEME_NAME-test/
✓ THEME_NAMES:      updated in packages/theme-system/src/types.ts

Dev server:   cd sites/$THEME_NAME-test && npm run dev
              Visit http://localhost:3000 to see Stitch-derived TSX pages

Stitch comparison: http://localhost:3000        (home)
                   http://localhost:3000/about
                   http://localhost:3000/contact
                   http://localhost:3000/services
                   http://localhost:3000/services/[first-service-slug]
                   http://localhost:3000/blog
                   http://localhost:3000/blog/[first-article-slug]
                   http://localhost:3000/locations
                   http://localhost:3000/locations/[first-location-slug]
                   http://localhost:3000/projects
                   http://localhost:3000/projects/[first-project-slug]
                   http://localhost:3000/privacy-policy
                   http://localhost:3000/cookie-policy
Cleanup:      /pipeline.kill-site $THEME_NAME-test   (removes test site)
              /pipeline.kill-theme $THEME_NAME        (removes theme package)

Next steps:
  1. Open Stitch project to review and iterate designs visually
  2. Inspect meta/token-mapping-report.json — verify colour extraction looks correct
  3. Review tsx-review-findings.json and tsx-fix-log.json to see what the fidelity pass caught
  4. Start dev server (npm run dev) and visit the 13 TSX pages (7 from Stitch screens + 6 adapted/templated) above
  5. When satisfied: /deploy.changes
```

---

## Rules

- This command does NOT commit or push anything
- Never modifies `sites/base-template/` — only the copy
- If any step fails, STOP and report — do not create a partial theme or test site
