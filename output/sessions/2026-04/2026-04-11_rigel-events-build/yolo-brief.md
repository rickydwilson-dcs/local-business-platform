# YOLO Implementation Brief: Build Out \_rigel-Events — Digital Marketing Weekend

**Branch:** feature/rigel-events-build (created from develop)
**Session spec:** output/sessions/2026-04-11_rigel-events-build/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The `_rigel-Events` site was scaffolded as a generic tradesperson template using the Rigel theme (deep purple #292661, yellow accent #F5D121, big Inter headings). We are repurposing it as a real digital marketing event site — "Digital Marketing Weekend" — a weekend conference for small business owners held at the Winter Garden, Eastbourne, 17–18 October 2026. The Rigel theme already ships event-specific components (event stats blocks, speaker bio blocks, sponsors grid) so no new packages are needed. All new pages follow existing patterns from `app/services/[slug]/page.tsx` and the `createContentUtils` factory. The purple/yellow palette and large typography stay exactly as-is.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | /                      | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | /                      | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | /                      | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/rigel-events-build   # create feature branch from develop
cd sites/_rigel-Events && npm run type-check  # must be clean before starting
cd ../..
```

---

## Phase 1: Fix Theme Colors + Rewrite site.config.ts

**Goal:** Restore correct Rigel purple brand colors and replace all tradesperson business config with Digital Marketing Weekend event config.

**Model:** sonnet — config rewrites with structured data

Read both files in parallel before editing:

- `sites/_rigel-Events/theme.config.ts`
- `sites/_rigel-Events/site.config.ts`

### 1a. Fix `sites/_rigel-Events/theme.config.ts`

Replace the placeholder blue overrides with correct Rigel defaults:

- `primary`: `#292661` (deep purple)
- `primaryHover`: `#1e1b4b`
- `secondary`: `#F5D121` (yellow)

The file should only override colors that differ from `rigelDefaultConfig` — keep it minimal.

### 1b. Rewrite `sites/_rigel-Events/site.config.ts`

Full replacement. Key values:

```typescript
business: {
  name: "Digital Marketing Weekend",
  legalName: "Digital Marketing Weekend",
  businessType: "Event",
  phone: "",
  email: "hello@digitalmarketingweekend.co.uk",
  address: {
    street: "Winter Garden, Compton Street",
    city: "Eastbourne",
    county: "East Sussex",
    postcode: "BN21 4BP",
    country: "UK",
  },
  geo: { lat: 50.7676, lng: 0.2858 },
  hours: [],
  social: {
    twitter: "https://twitter.com/dmweekend",
    linkedin: "https://linkedin.com/company/digital-marketing-weekend",
    instagram: "https://instagram.com/dmweekend",
  },
}
```

Navigation:

```typescript
main: [
  { label: "Speakers", href: "/speakers" },
  { label: "Schedule", href: "/schedule" },
  { label: "Venue", href: "/venue" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Contact", href: "/contact" },
];
```

CTA:

```typescript
cta: {
  primary: { label: "Get Tickets", href: "https://www.eventbrite.co.uk/e/digital-marketing-weekend-2026" },
  phone: { enabled: false },
}
```

Stats:

```typescript
stats: [
  { value: "2", label: "Days" },
  { value: "10+", label: "Speakers" },
  { value: "20+", label: "Sessions" },
  { value: "300", label: "Attendees" },
];
```

About:

```typescript
about: {
  badges: ["17–18 Oct 2026", "Eastbourne", "Free to Attend"],
  story: [
    "Digital Marketing Weekend is a free two-day event bringing together digital marketers, small business owners, and freelancers in the heart of Eastbourne.",
    "Across two packed days at the historic Winter Garden, you'll hear from industry experts on everything from SEO and social media to email marketing, paid advertising, and AI-powered tools.",
    "Whether you're just starting your digital journey or looking to sharpen your strategy, there's something for everyone — and it's completely free to attend.",
  ],
}
```

Features:

```typescript
features: {
  analytics: false,
  consentBanner: false,
  contactForm: true,
  rateLimit: true,
  testimonials: true,
  blog: false,
}
```

Preserve the overall shape of `site.config.ts` — only change values, keep all exported field names intact so downstream pages don't break. If a field is required by the schema but not applicable to an event (e.g. `serviceAreas`, `featuredServices`), set it to an empty array `[]` rather than removing it.

### Verification gate

```bash
# Verification gate — STOP if this fails
cd sites/_rigel-Events && npm run type-check
cd ../..
```

### Commit

```bash
git add sites/_rigel-Events/theme.config.ts sites/_rigel-Events/site.config.ts
git commit -m "$(cat <<'EOF'
feat(rigel-events): fix theme colors + rewrite site.config for Digital Marketing Weekend

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Replace MDX Content

**Goal:** Delete all tradesperson placeholder content and create event-specific speakers, blog posts, and testimonials.

**Model:** sonnet — writing substantive MDX content files

### 2a. Delete old content

```bash
rm -f sites/_rigel-Events/content/services/primary-service.mdx \
      sites/_rigel-Events/content/services/secondary-service.mdx \
      sites/_rigel-Events/content/services/service-three.mdx \
      sites/_rigel-Events/content/services/service-four.mdx \
      sites/_rigel-Events/content/services/service-five.mdx

rm -f sites/_rigel-Events/content/locations/main-area.mdx \
      sites/_rigel-Events/content/locations/north-region.mdx \
      sites/_rigel-Events/content/locations/south-region.mdx

rm -f sites/_rigel-Events/content/projects/example-residential-project.mdx

rm -f sites/_rigel-Events/content/blog/example-how-to-guide.mdx \
      sites/_rigel-Events/content/blog/example-industry-tips.mdx
```

### 2b. Create `content/speakers/` directory + 5 MDX files

Create the directory `sites/_rigel-Events/content/speakers/` and write all 5 files. Frontmatter schema:

```yaml
---
name: string
slug: string
title: string
topic: string
description: string # 50–120 chars
day: saturday | sunday
time: "HH:MM"
stage: Main Stage | Workshop Room
featured: true | false
imageAlt: string
social:
  twitter: string
  linkedin: string
  website: string
---
[2–3 paragraph full bio as MDX body]
```

**`content/speakers/ricky-wilson.mdx`**

```yaml
---
name: Ricky Wilson
slug: ricky-wilson
title: Founder, Digital Consulting Services
topic: "The Small Business Marketing Stack: What Actually Works in 2026"
description: "Digital marketing strategist helping local businesses cut through the noise and build online presence that actually converts."
day: saturday
time: "09:30"
stage: Main Stage
featured: true
imageAlt: Ricky Wilson speaking at Digital Marketing Weekend
social:
  twitter: https://twitter.com/rickywilsondcs
  linkedin: https://linkedin.com/in/rickywilson
  website: https://digitalconsultingservices.co.uk
---
```

Body: 3 paragraphs — background founding Digital Consulting Services, focus on practical no-nonsense strategy for local and small businesses, overview of what the Saturday keynote will cover (the minimal marketing stack that delivers results without agency budgets).

**`content/speakers/sarah-chen.mdx`**

```yaml
---
name: Sarah Chen
slug: sarah-chen
title: SEO Director, Verdant Digital
topic: "Local SEO in 2026: What's Changed and What Still Works"
description: "SEO specialist with 10+ years helping local businesses dominate their area in Google search results."
day: saturday
time: "11:00"
stage: Main Stage
featured: true
imageAlt: Sarah Chen presenting local SEO strategies
social:
  twitter: https://twitter.com/sarahchenseo
  linkedin: https://linkedin.com/in/sarahchenseo
  website: https://verdantdigital.co.uk
---
```

Body: 3 paragraphs — specialisation in local business SEO, covers Google Business Profile, citations, AI-driven search changes, and what small businesses can do in 30 minutes a week to stay visible.

**`content/speakers/marcus-okafor.mdx`**

```yaml
---
name: Marcus Okafor
slug: marcus-okafor
title: Paid Media Strategist, Spark Advertising
topic: "Getting ROI from Google & Meta Ads on a Small Budget"
description: "Paid advertising specialist who helps small businesses make every pound count with targeted Google and Meta campaigns."
day: sunday
time: "10:00"
stage: Main Stage
featured: false
imageAlt: Marcus Okafor discussing paid advertising strategy
social:
  twitter: https://twitter.com/marcusokafor
  linkedin: https://linkedin.com/in/marcusokafor
  website: https://sparkadvertising.co.uk
---
```

Body: 3 paragraphs — paid advertising background, specialises in low-budget high-ROI campaigns, covers audience targeting, ad copy, and conversion tracking without needing a big agency.

**`content/speakers/emily-thornton.mdx`**

```yaml
---
name: Emily Thornton
slug: emily-thornton
title: Email Marketing Consultant
topic: "Email Isn't Dead: Building a List That Actually Converts"
description: "Independent email marketing consultant helping service businesses turn subscribers into loyal customers."
day: saturday
time: "14:00"
stage: Workshop Room
featured: false
imageAlt: Emily Thornton leading an email marketing workshop
social:
  twitter: https://twitter.com/emilythorntonuk
  linkedin: https://linkedin.com/in/emilythornton
  website: https://emilythornton.co.uk
---
```

Body: 3 paragraphs — runs interactive workshops on list-building, segmentation, and automation for service businesses; explains why email still outperforms social for conversion; what attendees will walk away with from the Saturday workshop session.

**`content/speakers/james-hartley.mdx`**

```yaml
---
name: James Hartley
slug: james-hartley
title: AI Tools Trainer, Future Marketing Lab
topic: "AI-Powered Marketing: Tools You Can Use Today"
description: "Trainer helping small businesses adopt practical AI tools to save time and improve their marketing without the tech overwhelm."
day: sunday
time: "11:30"
stage: Main Stage
featured: false
imageAlt: James Hartley demonstrating AI marketing tools
social:
  twitter: https://twitter.com/jameshartelyai
  linkedin: https://linkedin.com/in/jameshartley
  website: https://futuremarketinglab.co.uk
---
```

Body: 3 paragraphs — trains small business owners on practical AI tools (ChatGPT, Canva AI, automation platforms), focuses on time-saving applications, and covers when NOT to use AI. Sunday keynote covers the tools attendees can implement immediately.

### 2c. Create 2 new blog posts

**`content/blog/why-small-businesses-need-a-digital-strategy.mdx`**

```yaml
---
title: "Why Every Small Business Needs a Digital Marketing Strategy in 2026"
slug: why-small-businesses-need-a-digital-strategy
description: "Still relying on word of mouth? Here's why a clear digital strategy is no longer optional for small businesses."
date: "2026-03-15"
author: "Ricky Wilson"
category: "Strategy"
tags: ["digital marketing", "small business", "strategy", "SEO"]
featured: true
readingTime: "5 min read"
excerpt: "Word of mouth is powerful — but in 2026, customers check Google before they call. Here's how to build a digital presence that works."
---
```

Body: 5 paragraphs — the shift to online discovery, the core pillars of a digital strategy (SEO, social, email, paid), why consistency beats complexity, and a CTA to attend Digital Marketing Weekend.

**`content/blog/what-to-expect-at-digital-marketing-weekend.mdx`**

```yaml
---
title: "What to Expect at Digital Marketing Weekend 2026"
slug: what-to-expect-at-digital-marketing-weekend
description: "Your complete guide to the two-day event at the Winter Garden, Eastbourne — speakers, sessions, and what to bring."
date: "2026-09-01"
author: "Ricky Wilson"
category: "Event"
tags: ["event", "digital marketing weekend", "eastbourne", "speakers"]
featured: true
readingTime: "4 min read"
excerpt: "From Saturday keynotes to Sunday workshops — here's everything you need to know before you arrive."
---
```

Body: 4 paragraphs — overview of both days, what makes the event different (free, practical, no sales pitches), travel info, get-tickets CTA.

### 2d. Replace testimonials

Delete existing testimonial files and write new ones:

```bash
rm -f sites/_rigel-Events/content/testimonials/example-testimonial-1.mdx \
      sites/_rigel-Events/content/testimonials/example-testimonial-2.mdx \
      sites/_rigel-Events/content/testimonials/example-testimonial-3.mdx
```

**`content/testimonials/testimonial-1.mdx`**

```yaml
---
customerName: "Priya Sharma"
customerRole: "Owner, Bloom Florist"
rating: 5
text: "I came not knowing much about digital marketing and left with a clear action plan. The SEO session alone was worth the trip."
date: "2025-10-20"
featured: true
verified: true
platform: "Google"
---
```

**`content/testimonials/testimonial-2.mdx`**

```yaml
---
customerName: "Tom Bradshaw"
customerRole: "Director, Bradshaw Plumbing"
rating: 5
text: "Genuinely the best free event I've been to. Practical, no-nonsense advice from people who actually know their stuff."
date: "2025-10-20"
featured: true
verified: true
platform: "Google"
---
```

**`content/testimonials/testimonial-3.mdx`**

```yaml
---
customerName: "Chloe Fitzgerald"
customerRole: "Freelance Social Media Manager"
rating: 5
text: "The AI tools workshop on Sunday was a highlight. I've already started using three of the tools James recommended."
date: "2025-10-21"
featured: false
verified: true
platform: "LinkedIn"
---
```

### Verification gate

```bash
# Verification gate — STOP if this fails
cd sites/_rigel-Events && npm run type-check
cd ../..
```

### Commit

```bash
git add sites/_rigel-Events/content/
git commit -m "$(cat <<'EOF'
feat(rigel-events): replace placeholder MDX with Digital Marketing Weekend content

- Delete services, locations, projects placeholder MDX
- Add 5 speaker bios: Ricky Wilson, Sarah Chen, Marcus Okafor, Emily Thornton, James Hartley
- Add 2 event blog posts
- Replace testimonials with past-attendee quotes from fictional 2025 edition

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Add New Pages — Speakers, Schedule, Venue, Sponsors

**Goal:** Create 4 new route pages. Speakers uses dynamic MDX routing; schedule/venue/sponsors are static.

**Model:** sonnet — new Next.js page files with TypeScript

First, read these files in parallel for patterns to reuse (G5):

- `sites/_rigel-Events/app/services/page.tsx`
- `sites/_rigel-Events/app/services/[slug]/page.tsx`
- `sites/_rigel-Events/lib/content.ts`

### 3a. Create `app/speakers/page.tsx`

Speaker listing page. Follow the pattern from `app/services/page.tsx`:

- Load all speaker MDX files with `getAllContent('speakers')` (or equivalent from `lib/content.ts` — check what functions are available and use the correct one)
- Sort: featured speakers first
- Display as a 3-column card grid on desktop, 1-column on mobile
- Each card: speaker name, title, day badge (Saturday/Sunday), topic, "Read Bio →" link to `/speakers/[slug]`
- Page heading: "Meet the Speakers"
- Subtitle: "Hear from practitioners and specialists across digital marketing, SEO, paid ads, email, and AI tools."
- Metadata: `{ title: "Speakers | Digital Marketing Weekend 2026", description: "..." }`

### 3b. Create `app/speakers/[slug]/page.tsx`

Individual speaker bio page. Follow `app/services/[slug]/page.tsx`:

- `generateStaticParams()` using `getAllContent('speakers')` to get all slugs
- Load speaker frontmatter + MDX body via `loadMdx`
- Display: speaker name as h1, title/company, topic, day + time + stage badges, full bio body, social links (Twitter, LinkedIn, Website)
- Breadcrumbs: Home → Speakers → [Name]
- Metadata: derived from speaker frontmatter `name` and `description`
- Back link: "← Back to Speakers"

### 3c. Create `app/schedule/page.tsx`

Static page — embed schedule data directly in the file as typed arrays.

```typescript
interface Session {
  time: string;
  title: string;
  stage: string;
  speaker: string | null;
}

const saturday: Session[] = [
  { time: "09:00", title: "Registration & Welcome Coffee", stage: "Foyer", speaker: null },
  {
    time: "09:30",
    title: "The Small Business Marketing Stack: What Actually Works in 2026",
    stage: "Main Stage",
    speaker: "Ricky Wilson",
  },
  {
    time: "11:00",
    title: "Local SEO in 2026: What's Changed and What Still Works",
    stage: "Main Stage",
    speaker: "Sarah Chen",
  },
  { time: "12:30", title: "Lunch Break", stage: "Terrace", speaker: null },
  {
    time: "14:00",
    title: "Email Isn't Dead: Building a List That Actually Converts",
    stage: "Workshop Room",
    speaker: "Emily Thornton",
  },
  {
    time: "14:00",
    title: "Social Media for Service Businesses",
    stage: "Main Stage",
    speaker: "Guest Speaker TBA",
  },
  {
    time: "15:30",
    title: "Panel: Marketing on a Shoestring Budget",
    stage: "Main Stage",
    speaker: "All Speakers",
  },
  { time: "17:00", title: "Networking Drinks", stage: "Terrace Bar", speaker: null },
];

const sunday: Session[] = [
  { time: "09:30", title: "Doors Open & Coffee", stage: "Foyer", speaker: null },
  {
    time: "10:00",
    title: "Getting ROI from Google & Meta Ads on a Small Budget",
    stage: "Main Stage",
    speaker: "Marcus Okafor",
  },
  {
    time: "11:30",
    title: "AI-Powered Marketing: Tools You Can Use Today",
    stage: "Main Stage",
    speaker: "James Hartley",
  },
  { time: "13:00", title: "Lunch Break", stage: "Terrace", speaker: null },
  {
    time: "14:00",
    title: "Workshop: Build Your 90-Day Marketing Plan",
    stage: "Workshop Room",
    speaker: "Ricky Wilson",
  },
  {
    time: "14:00",
    title: "Video & Reels for Local Businesses",
    stage: "Main Stage",
    speaker: "Guest Speaker TBA",
  },
  {
    time: "15:30",
    title: "Closing Keynote: The Future of Local Marketing",
    stage: "Main Stage",
    speaker: "All Speakers",
  },
  { time: "16:30", title: "Close & Networking", stage: "Foyer", speaker: null },
];
```

Layout:

- Page heading: "Weekend Schedule"
- Two columns: "Saturday 17 October" | "Sunday 18 October" — side-by-side on desktop, stacked on mobile
- Each session row: time chip (left), title (middle), stage badge (right), speaker name below title if present
- Colour the stage badges: Main Stage → `bg-brand-primary text-white`, Workshop Room → `bg-brand-secondary text-black`, Foyer/Terrace → `bg-surface-subtle text-surface-foreground`
- Sessions with no speaker (breaks, networking) display in muted style
- Bottom CTA: "Get Tickets" button

Metadata: `{ title: "Schedule | Digital Marketing Weekend 2026" }`

### 3d. Create `app/venue/page.tsx`

Static page:

- Page heading: "The Winter Garden, Eastbourne"
- Subheading: "Our venue for Digital Marketing Weekend 2026"
- Address block: Winter Garden, Compton Street, Eastbourne, East Sussex, BN21 4BP
- Map placeholder: styled div (`bg-surface-subtle rounded-lg h-64 flex items-center justify-center`) with text "View on Google Maps" linking to `https://maps.google.com/?q=Winter+Garden+Compton+Street+Eastbourne`
- Getting There section (3 items):
  - By Train: Eastbourne station, 10-minute walk along the seafront
  - By Car: Seafront car parks within 5 minutes — Wish Tower or Central car parks
  - By Bus: Regular services from Eastbourne town centre, stop on Grand Parade
- The Venue section: accessible entrance, café and bar, terrace with sea views, flexible seating, capacity 400
- Nearby Hotels section (3 hotels, clearly labelled as suggestions): The Grand Hotel Eastbourne (5 min walk), The Best Western Lansdowne (8 min walk), Hydro Hotel (12 min walk)
- Bottom CTA: "Get Tickets" button

Metadata: `{ title: "Venue | Digital Marketing Weekend 2026" }`

### 3e. Create `app/sponsors/page.tsx`

Static page:

- Page heading: "Our Sponsors & Partners"
- Intro: "Digital Marketing Weekend is completely free to attend thanks to the generous support of our sponsors and community partners."
- Three sponsor tiers with placeholder boxes (no real images):
  - **Gold Sponsors** (2): Verdant Digital, Spark Advertising — large placeholder boxes `bg-surface-subtle border-2 border-brand-primary rounded-lg p-8 flex items-center justify-center font-bold text-brand-primary`
  - **Silver Sponsors** (3): TechEast, Sussex Business Hub, Coastal Web Co — medium placeholder boxes
  - **Community Partners** (3): Eastbourne Chamber of Commerce, East Sussex Growth Hub, Digital Brighton — smaller placeholder boxes
- Become a Sponsor CTA section:
  - Heading: "Interested in Sponsoring?"
  - Copy: "Reach 300+ small business owners and digital marketers. Sponsorship packages from £500."
  - Button: "Enquire About Sponsoring" → `/contact`

Metadata: `{ title: "Sponsors | Digital Marketing Weekend 2026" }`

### Verification gate

```bash
# Verification gate — STOP if this fails
cd sites/_rigel-Events && npm run type-check
cd ../..
```

### Commit

```bash
git add sites/_rigel-Events/app/speakers/ \
        sites/_rigel-Events/app/schedule/ \
        sites/_rigel-Events/app/venue/ \
        sites/_rigel-Events/app/sponsors/
git commit -m "$(cat <<'EOF'
feat(rigel-events): add speakers, schedule, venue, and sponsors pages

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Rewrite Homepage + Update Layout Metadata

**Goal:** Replace the tradesperson homepage with an events homepage; update layout.tsx schema to Event type.

**Model:** sonnet — full page rewrite + metadata update

Read these files in parallel before editing (G7):

- `sites/_rigel-Events/app/page.tsx`
- `sites/_rigel-Events/app/layout.tsx`

### 4a. Rewrite `sites/_rigel-Events/app/page.tsx`

Full rewrite. Use ONLY theme token classes (`bg-brand-primary`, `text-surface-foreground`, `btn-primary`, `.section`, `.container-narrow`, `.card`) — NO hardcoded hex colors.

Sections in order:

**1. Hero** — full-bleed dark purple section

```tsx
// bg-brand-primary or bg-surface-inverse, large padding (py-24 md:py-32)
// Pre-heading badge: "17–18 October 2026 · Eastbourne"
// H1: "Digital Marketing Weekend"
// Subheadline: "Two days of practical marketing sessions, workshops, and networking for small business owners — completely free to attend."
// Two CTA buttons: "Get Tickets" (btn-primary, links to eventbrite placeholder) + "View Schedule" (btn-secondary or outlined, /schedule)
// Three icon badges below CTAs: 🗓 Free to Attend · 👥 10+ Speakers · 🎤 20+ Sessions
```

**2. Event Stats Strip** — 4-column dark-accent strip

```tsx
// 2 Days | 10+ Speakers | 20+ Sessions | 300 Attendees
// bg-surface-inverse or bg-surface-muted, py-8
// Each stat: large number in text-brand-secondary (yellow), label in text-surface-muted-foreground
```

**3. About the Event** — 2-column section

```tsx
// Left: H2 "What is Digital Marketing Weekend?", 2 paragraphs about the event
// Right: "Who Should Attend?" heading + bullet list:
//   - Small business owners
//   - Freelancers and sole traders
//   - Marketing managers at SMEs
//   - Startup founders
//   - Anyone wanting to grow their business online
```

**4. Featured Speakers** — dynamic section

```tsx
// Load speakers where featured: true from content/speakers/*.mdx
// H2: "Featured Speakers"
// 3-column card grid (or however many featured speakers there are)
// Each card: name, title, topic, day badge (Saturday/Sunday), "Read Bio →" link
// Below grid: "See All Speakers →" link to /speakers
```

**5. Schedule Preview** — two-column section

```tsx
// H2: "Weekend at a Glance"
// Two columns: Saturday | Sunday
// Top 4 sessions from each day (from the schedule data — hardcode the preview items)
// Each row: time chip, session title, speaker name
// "View Full Schedule →" link below
```

**6. Venue Teaser** — centred section

```tsx
// bg-surface-subtle
// H2: "The Winter Garden, Eastbourne"
// 1 paragraph: "A stunning art deco seafront venue in the heart of Eastbourne..."
// Address line
// "Plan Your Visit →" link to /venue
```

**7. Past Attendees / Testimonials** — dark section

```tsx
// Load testimonials, display up to 3
// bg-surface-inverse
// H2: "What Past Attendees Say"
// 3 testimonial cards with name, role, quote, star rating
```

**8. Final CTA** — full-width

```tsx
// bg-brand-primary
// H2: "Join Us This October"
// "300 small business owners. 10+ expert speakers. All completely free."
// "Get Tickets" button (white/yellow, prominent)
// Small text: "The Winter Garden, Eastbourne · 17–18 October 2026"
```

### 4b. Update `sites/_rigel-Events/app/layout.tsx`

Read the full file first. Then update:

- `description` metadata → "Digital Marketing Weekend is a free two-day conference for small business owners and marketers, held at the Winter Garden, Eastbourne on 17–18 October 2026."
- `keywords` → ["digital marketing", "small business marketing", "Eastbourne", "marketing conference", "free event", "SEO", "social media", "email marketing"]
- Schema.org structured data: change `@type` from `LocalBusiness` to `Event`, and add:
  ```json
  "startDate": "2026-10-17",
  "endDate": "2026-10-18",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "The Winter Garden",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Compton Street",
      "addressLocality": "Eastbourne",
      "postalCode": "BN21 4BP",
      "addressCountry": "GB"
    }
  },
  "isAccessibleForFree": true,
  "organizer": {
    "@type": "Organization",
    "name": "Digital Consulting Services",
    "url": "https://digitalconsultingservices.co.uk"
  }
  ```
- Keep all other layout code intact (ThemeProvider, RigelHeader, SiteFooter, ConsentManager, Analytics, etc.)

### Verification gate

```bash
# Verification gate — STOP if this fails
cd sites/_rigel-Events && npm run type-check
cd ../..
```

### Commit

```bash
git add sites/_rigel-Events/app/page.tsx sites/_rigel-Events/app/layout.tsx
git commit -m "$(cat <<'EOF'
feat(rigel-events): rewrite homepage for Digital Marketing Weekend, update schema to Event type

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Update Contact Page + Remove Unused Routes

**Goal:** Update contact copy for an events context; delete unused services/locations/projects route directories.

**Model:** haiku — copy-only edits + file deletions

### 5a. Update `sites/_rigel-Events/app/contact/page.tsx`

Read the file first. Then make copy-only changes (no structural changes):

- Page title: "Get in Touch"
- Metadata description: "Speaking enquiries, sponsorship opportunities, or general questions about Digital Marketing Weekend — we'd love to hear from you."
- Remove any references to "Get a Free Quote" or "quote"
- Remove `siteConfig.serviceAreas` references from the description — replace with "Digital Marketing Weekend, Eastbourne"
- Update info sidebar:
  - Instead of phone number (disabled), show: Event date "17–18 October 2026"
  - Instead of opening hours, show venue: "The Winter Garden, Eastbourne"
  - Email: `hello@digitalmarketingweekend.co.uk`
- Keep ContactForm component and all form logic completely intact
- Keep Breadcrumbs component intact

### 5b. Delete unused route directories

```bash
rm -rf sites/_rigel-Events/app/services
rm -rf sites/_rigel-Events/app/locations
rm -rf sites/_rigel-Events/app/projects
```

> Leave `app/reviews/` in place. If the page has a hardcoded "Reviews" heading, update it to "What Attendees Say" — but only if it's a simple string change in the file.

### Final verification gate

```bash
# Verification gate — STOP if this fails
cd sites/_rigel-Events && npm run type-check && npm run build
cd ../..
```

This is the full build gate — must pass before final commit.

### Commit

```bash
git add -A sites/_rigel-Events/
git commit -m "$(cat <<'EOF'
feat(rigel-events): update contact copy for events, remove unused services/locations/projects routes

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                                                                                      | File overlap      | Model  | Rationale                              |
| ----- | ------- | ---------------------------------------------------------------------------------------------------------- | ----------------- | ------ | -------------------------------------- |
| G1    | Phase 1 | Read `theme.config.ts`, Read `site.config.ts`                                                              | none (reads only) | n/a    | Independent reads                      |
| G2    | Phase 2 | Write `ricky-wilson.mdx`, `sarah-chen.mdx`, `marcus-okafor.mdx`, `emily-thornton.mdx`, `james-hartley.mdx` | none              | sonnet | 5 independent new MDX files            |
| G3    | Phase 2 | Write `blog/why-small-businesses.mdx`, Write `blog/what-to-expect.mdx`                                     | none              | sonnet | 2 independent blog files               |
| G4    | Phase 2 | Write `testimonial-1.mdx`, `testimonial-2.mdx`, `testimonial-3.mdx`                                        | none              | sonnet | 3 independent testimonial files        |
| G5    | Phase 3 | Read `app/services/page.tsx`, Read `app/services/[slug]/page.tsx`, Read `lib/content.ts`                   | none (reads only) | n/a    | Independent reads before writing pages |
| G6    | Phase 3 | Create `app/schedule/page.tsx`, Create `app/venue/page.tsx`, Create `app/sponsors/page.tsx`                | none              | sonnet | 3 independent static pages             |
| G7    | Phase 4 | Read `app/page.tsx`, Read `app/layout.tsx`                                                                 | none (reads only) | n/a    | Independent reads before editing       |
| G8    | Phase 5 | Delete `app/services/`, Delete `app/locations/`, Delete `app/projects/`                                    | none              | n/a    | Independent deletions                  |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                                          | Reason                                                           |
| ------------------------------------------------------------- | ---------------------------------------------------------------- |
| Verification gates between phases                             | Each gate's output determines whether to proceed                 |
| Git commits                                                   | One commit per phase, in order                                   |
| G5 reads must complete before writing `app/speakers/` pages   | Need to understand `getAllContent` API signature before using it |
| `app/speakers/page.tsx` before `app/speakers/[slug]/page.tsx` | Consistent slug handling — write listing page first              |

---

## Cost Estimate

| Phase                         | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ----------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Config rewrites      | sonnet | ~8k               | ~3k                | ~$0.05     |
| Phase 2: MDX content creation | sonnet | ~10k              | ~8k                | ~$0.12     |
| Phase 3: New pages (5 files)  | sonnet | ~15k              | ~7k                | ~$0.16     |
| Phase 4: Homepage + layout    | sonnet | ~12k              | ~6k                | ~$0.13     |
| Phase 5: Contact + deletions  | haiku  | ~6k               | ~2k                | ~$0.01     |
| **Total**                     |        | **~51k**          | **~26k**           | **~$0.47** |

Rates: Sonnet $3/$15 per MTok, Haiku $0.80/$4 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `npm run type-check && npm run build` passes in `sites/_rigel-Events/`
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-11_rigel-events-build/yolo-brief.md`:

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
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Items NOT listed in any group run sequentially.**
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.**
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits
- The Co-Authored-By line in commits must reflect the orchestrator model used (`Claude Sonnet 4.6`)
- Always use theme token classes (`bg-brand-primary`, `text-surface-foreground`, etc.) — NEVER hardcode hex colors
