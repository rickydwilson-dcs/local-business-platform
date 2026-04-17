# Digital Consulting Services — Page & Component Specification

## Overview

This document defines every page in the DCS site and the components that appear on each.

Component slot definitions (fields, types, conditional behaviour) live in the canonical registry: [docs/architecture/component-registry.md](../../docs/architecture/component-registry.md). This document records which slots appear on which pages and in what order — not what each slot contains.

---

## How "Shared" Works

Every component in this document is defined at two levels:

**Level 1 — Content contract (universal)**
The fields a component accepts: what data it needs to render. This is the same across every site on the platform. A `HeroSection` always has a headline, subheading, CTA, and optional image — on a plumber's site, on a scaffolder's site, on the DCS site. The slot exists everywhere. Whether it's populated, and what goes in it, is a content decision.

**Level 2 — Visual implementation (per-theme)**
How a component looks is entirely owned by the theme. Two sites can share the same `HeroSection` content contract and render it completely differently — one dark and full-bleed, one split-layout with a form. Same slot, different rendering.

**Optional population is not a reason to exclude a component from the contract.**
An `AuthorCard` that a tradesperson doesn't use still exists as a slot — they just leave the author fields blank and it doesn't render. A `PricingTable` that shows job estimate ranges on a plumber's site and fixed packages on DCS uses the same structure — the content differs, not the component.

**The only genuine exceptions** — components whose content contract is structurally unique to DCS and has no analogue on a client site:

- `ExampleCard` / `ExamplesGrid` — "browse our themes" is unique to an agency selling websites; no client site has this concept
- `CaseStudyHero` with `siteUrl` + `screenshotImages` fields — a project where the deliverable _is a website_ has different fields than a project where the deliverable is a physical job

Everything else is a universal slot.

---

## Component Library (Global)

All components below are **universal content contracts**. Visual implementation is per-theme.

| Component             | Content contract (fields)                                      | Optional?                  |
| --------------------- | -------------------------------------------------------------- | -------------------------- |
| **SiteHeader**        | Logo, nav links, primary CTA label + href                      | No                         |
| **SiteFooter**        | Logo, nav links, contact details, social links, legal links    | No                         |
| **HeroSection**       | Headline, subheading, primary CTA, secondary CTA, image/visual | Image optional             |
| **SectionHeading**    | Eyebrow label, heading, subtext                                | Eyebrow + subtext optional |
| **CTABanner**         | Heading, subtext, CTA label + href                             | Subtext optional           |
| **ReviewsStrip**      | Array of: rating, short quote, reviewer name                   |                            |
| **TestimonialCard**   | Quote, name, business name, optional photo                     | Photo optional             |
| **TestimonialGrid**   | Array of TestimonialCard data                                  |                            |
| **FAQAccordion**      | Array of: question, answer                                     |                            |
| **PricingCard**       | Tier name, price, billing period, features list, CTA           |                            |
| **PricingTable**      | Array of PricingCards, optional payment toggle                 |                            |
| **ContactForm**       | Fields config, submission endpoint                             |                            |
| **ContactDetails**    | Phone, email, address, social links                            | Address optional           |
| **ProcessStep**       | Step number, icon, title, description                          |                            |
| **ProcessTimeline**   | Array of ProcessSteps, orientation (horizontal/vertical)       |                            |
| **StatBlock**         | Number/value, label                                            |                            |
| **StatsRow**          | Array of StatBlocks                                            |                            |
| **LogoStrip**         | Array of: logo image, alt text, optional link                  |                            |
| **TagList**           | Array of tag strings                                           |                            |
| **BreadcrumbNav**     | Array of: label, href                                          |                            |
| **RichText**          | MDX/HTML content body                                          |                            |
| **FeatureGrid**       | Array of: icon, title, description                             |                            |
| **ServiceCard**       | Icon, title, description, link href                            |                            |
| **ServiceCardGrid**   | Array of ServiceCard data                                      |                            |
| **PortfolioCard**     | Image, title, description, category tags, optional link        |                            |
| **PortfolioGrid**     | Array of PortfolioCard data, optional filter config            | Filter optional            |
| **FilterBar**         | Array of filter options (label, value), active state           |                            |
| **PostCard**          | Image, title, date, category, excerpt, slug                    |                            |
| **PostGrid**          | Array of PostCard data                                         |                            |
| **FeaturedPost**      | Same as PostCard                                               |                            |
| **Pagination**        | Current page, total pages, base href                           |                            |
| **ArticleHeader**     | Title, date, category, read time estimate                      | Read time optional         |
| **AuthorCard**        | Name, bio, photo, social links                                 | Photo + social optional    |
| **RelatedPosts**      | Array of PostCard data (2–3)                                   |                            |
| **RelatedWork**       | Array of PortfolioCard data (2–3)                              |                            |
| **ScreenshotGallery** | Array of images with alt text, lightbox enabled                |                            |

**DCS-specific (no client site equivalent):**

| Component           | Why DCS-only                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **ExampleCard**     | Theme thumbnail, label (trade + tier), "View example" link — concept of browsing someone else's themes only exists on a meta-site like DCS |
| **ExamplesGrid**    | Filterable grid of ExampleCards                                                                                                            |
| **ExamplesPreview** | 3-card preview strip linking to Examples page                                                                                              |

---

## Pages

---

### 1. Home (`/`)

**Purpose:** First impression. Communicate the core value prop immediately, build trust, route to key areas.

| #   | Component                                | Content                                                                                                                                                                                      |
| --- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | HeroSection                              | Headline: "Websites as professional as you are." Subtext: "You tell us about your business. We handle design, copy, hosting, and everything else." CTA: "See how it works" + "View our work" |
| 2   | SectionHeading + ProcessTimeline         | "How it works" — 4 steps: Tell us about your business / We write and design it / We build and launch / We look after it                                                                      |
| 3   | SectionHeading + FeatureGrid             | "What's included" — 6 items: Design, Copy, Build, Hosting, Security, Support                                                                                                                 |
| 4   | PricingTable                             | 3 tiers with payment toggle (upfront vs monthly)                                                                                                                                             |
| 5   | SectionHeading + PortfolioGrid (3 items) | "Recent work" — 3 featured projects, link to full portfolio                                                                                                                                  |
| 6   | TestimonialGrid                          | 3 client testimonials                                                                                                                                                                        |
| 7   | SectionHeading + ExamplesPreview         | "See what your site could look like" — 3 example theme tiles, link to Examples                                                                                                               |
| 8   | CTABanner                                | "Ready to get started? It takes 15 minutes."                                                                                                                                                 |
| 9   | FAQAccordion (4 questions)               | Most common pre-sale questions                                                                                                                                                               |

---

### 2. Services (`/services`)

**Purpose:** Overview of what DCS offers. Routes to individual service pages.

| #   | Component                        | Content                                                                            |
| --- | -------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | HeroSection (compact)            | "Everything you need to get online"                                                |
| 2   | SectionHeading + ServiceCardGrid | Website Design / Website Build / Ongoing Management / Content Writing / SEO Basics |
| 3   | ProcessTimeline                  | "Our process" — same 4-step flow                                                   |
| 4   | PricingTable                     | Full pricing with toggle                                                           |
| 5   | FAQAccordion                     | Service-specific FAQs (6–8 questions)                                              |
| 6   | CTABanner                        | "Not sure which package fits? Just ask."                                           |

---

### 3. Service Page (`/services/[slug]`)

**Purpose:** Deep-dive on a single service. Dynamic MDX template.

| #   | Component                | Content                                                        |
| --- | ------------------------ | -------------------------------------------------------------- |
| 1   | BreadcrumbNav            | Services > [Service name]                                      |
| 2   | HeroSection (compact)    | Service headline + short description                           |
| 3   | RichText                 | Full description — what's included, how it works, who it's for |
| 4   | FeatureGrid              | Key deliverables                                               |
| 5   | ProcessTimeline          | Service-specific steps (if applicable)                         |
| 6   | PortfolioGrid (filtered) | Examples of work in this area                                  |
| 7   | TestimonialGrid          | Relevant testimonials                                          |
| 8   | PricingCard (single)     | Relevant package                                               |
| 9   | FAQAccordion             | Service FAQs                                                   |
| 10  | CTABanner                |                                                                |

**Initial service pages:** Website Design, Website Build & Launch, Ongoing Management & Hosting, Content Writing, SEO Basics

---

### 4. Portfolio (`/work`)

**Purpose:** Full showcase of past projects.

| #   | Component            | Content                                              |
| --- | -------------------- | ---------------------------------------------------- |
| 1   | SectionHeading       | "Our work" + short intro                             |
| 2   | FilterBar            | All / eCommerce / Service Business / Booking / Trade |
| 3   | PortfolioGrid (full) | All 13+ projects                                     |
| 4   | StatsRow             | Sites built / Years / Retention                      |
| 5   | CTABanner            |                                                      |

---

### 5. Portfolio Case Study (`/work/[slug]`)

**Purpose:** Deep-dive on one project.

The content contract for portfolio case studies has two variants:

- **Website project** (DCS portfolio): fields include `siteUrl`, `screenshotImages` (desktop + mobile)
- **Physical job project** (client portfolio): fields include `location`, `jobType`, `duration`, `projectImages`

Both use the same page template and the same components — only the frontmatter fields differ.

| #   | Component             | Content                                    |
| --- | --------------------- | ------------------------------------------ |
| 1   | BreadcrumbNav         | Our Work > [Client name]                   |
| 2   | HeroSection (compact) | Client name, industry tag, large image     |
| 3   | RichText              | Brief + what we did + outcome              |
| 4   | ScreenshotGallery     | Project images (screenshots or job photos) |
| 5   | TagList               | Services/skills used                       |
| 6   | TestimonialCard       | Client quote (if available)                |
| 7   | RelatedWork           | 2–3 similar projects                       |
| 8   | CTABanner             |                                            |

---

### 6. Examples (`/examples`)

**Purpose:** Browse pre-built theme examples. Lets prospects self-select a style before committing. Key DCS differentiator.

| #   | Component                 | Content                                                                   |
| --- | ------------------------- | ------------------------------------------------------------------------- |
| 1   | SectionHeading            | "See what's possible"                                                     |
| 2   | FilterBar                 | All / by trade / by tier                                                  |
| 3   | ExamplesGrid              | All theme examples                                                        |
| 4   | SectionHeading + RichText | "Want something tailored? We can adapt any of these to match your brand." |
| 5   | CTABanner                 |                                                                           |

---

### 7. Blog Index (`/blog`)

**Purpose:** Educational content to build trust and SEO.

| #   | Component      | Content                              |
| --- | -------------- | ------------------------------------ |
| 1   | SectionHeading | "Tips & guides for small businesses" |
| 2   | FeaturedPost   | Latest or pinned post                |
| 3   | PostGrid       | Remaining posts                      |
| 4   | Pagination     |                                      |

---

### 8. Blog Post (`/blog/[slug]`)

**Purpose:** Article reading experience.

| #   | Component     | Content                                      |
| --- | ------------- | -------------------------------------------- |
| 1   | BreadcrumbNav | Blog > [Post title]                          |
| 2   | ArticleHeader | Title, date, category, read time             |
| 3   | RichText      | Full MDX content                             |
| 4   | AuthorCard    | Ricky Wilson, bio, link to rickywilson.co.uk |
| 5   | RelatedPosts  | 2–3 related posts                            |
| 6   | CTABanner     | "Ready to get your business online?"         |

---

### 9. About (`/about`)

**Purpose:** Build personal trust. This is Ricky, not a company.

| #   | Component             | Content                                                                 |
| --- | --------------------- | ----------------------------------------------------------------------- |
| 1   | HeroSection (compact) | "I'm Ricky. I build websites for small businesses."                     |
| 2   | RichText + image      | Story, philosophy, why DCS exists                                       |
| 3   | StatsRow              | Years in business / Sites built / Retention                             |
| 4   | FeatureGrid           | Values: Plain speaking / Fair pricing / No lock-in / Long relationships |
| 5   | LogoStrip             | Client logos                                                            |
| 6   | CTABanner             |                                                                         |

**Note:** AuthorCard (with link to rickywilson.co.uk) should appear here or be embedded in the RichText section. The link establishes Ricky's broader credentials — senior industry experience in online and eCommerce — without making the About page feel like a CV.

---

### 10. Contact (`/contact`)

**Purpose:** Low-friction first step.

| #   | Component                  | Content                                                                            |
| --- | -------------------------- | ---------------------------------------------------------------------------------- |
| 1   | SectionHeading             | "Let's talk" — "No commitment, no hard sell. Just a quick chat."                   |
| 2   | ContactForm                | Name, email, phone (optional), message, service interest                           |
| 3   | ContactDetails             | Phone, email, social                                                               |
| 4   | FAQAccordion (3 questions) | "How long does it take?" / "Do I need to prepare anything?" / "What happens next?" |

---

### 11. FAQ (`/faq`)

**Purpose:** Handle objections, reduce friction, pre-qualify.

| #   | Component           | Content                                                                                 |
| --- | ------------------- | --------------------------------------------------------------------------------------- |
| 1   | SectionHeading      | "Common questions"                                                                      |
| 2   | FAQAccordion (full) | 15–20 questions: Getting Started / Pricing / What's Included / Ongoing Care / Technical |
| 3   | CTABanner           | "Still have questions? Just ask."                                                       |

---

### 12. Text / Policy Pages (`/privacy`, `/terms`, `/cookies`)

| #   | Component     | Content                        |
| --- | ------------- | ------------------------------ |
| 1   | ArticleHeader | Page title + last updated date |
| 2   | RichText      | Full legal text                |

---

## Component Reuse Summary

**Universal — every small business site on the platform needs these:**
SiteHeader, SiteFooter, HeroSection, CTABanner, ContactForm, ContactDetails, FAQAccordion, PricingCard, PricingTable, TestimonialCard, TestimonialGrid, RichText, FeatureGrid, ServiceCard, ServiceCardGrid, ProcessTimeline, BreadcrumbNav, SectionHeading, TagList

**Common — most service business sites will use these:**
PortfolioGrid, PortfolioCard, FilterBar, StatsRow, LogoStrip, ReviewsStrip, ArticleHeader, AuthorCard, PostCard, PostGrid, FeaturedPost, Pagination, RelatedPosts, RelatedWork, ScreenshotGallery

**DCS-only — no equivalent on client sites:**
ExampleCard, ExamplesGrid, ExamplesPreview

---

## Page Count Summary

| Page           | Route              | Template type |
| -------------- | ------------------ | ------------- |
| Home           | `/`                | Static        |
| Services       | `/services`        | Static        |
| Service Page   | `/services/[slug]` | Dynamic MDX   |
| Portfolio      | `/work`            | Static        |
| Case Study     | `/work/[slug]`     | Dynamic MDX   |
| Examples       | `/examples`        | Static        |
| Blog Index     | `/blog`            | Static        |
| Blog Post      | `/blog/[slug]`     | Dynamic MDX   |
| About          | `/about`           | Static        |
| Contact        | `/contact`         | Static        |
| FAQ            | `/faq`             | Static        |
| Privacy Policy | `/privacy`         | Static MDX    |
| Terms          | `/terms`           | Static MDX    |
| Cookies        | `/cookies`         | Static MDX    |

**Total: 14 routes (11 unique page templates)**
