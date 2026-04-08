# Stitch Design Prompt: Digital Consulting Services

## How to Use

This prompt can be used in two ways:

### Option A: Manual Stitch Screen Generation

Paste the **Design Brief** section below directly into Google Stitch's design system creator, then generate screens for each page listed in the **Pages** section.

### Option B: Run the Pipeline

Run this command from the monorepo root (on the `develop` branch):

```
/pipeline.stitch-design --trade "digital consulting and web development agency" --name "Digital Consulting Services" --services "Platform Websites, AI Automation, eCommerce Solutions, Web Design, SEO & Analytics, Maintenance & Support" --location "United Kingdom" --tagline "Websites as intelligent as your business" --roundness "sharp" --color-variant "monochrome"
```

**Note:** The pipeline's default taste dials are tuned for local trade businesses (conservative). For this agency site, the dials should be overridden to:

- Creativity: 7 (bold, experimental -- this is our own site)
- Density: 3 (editorial whitespace, not information-dense)
- Variance: 6 (asymmetric layouts, grid breaks)
- Motion Intent: 4 (subtle terminal effects, staggered reveals)

---

## Design Brief (for Stitch Design System)

### Brand Identity

**Company:** Digital Consulting Services
**Trade:** Digital consulting agency specializing in web platform development and AI automation
**Location:** United Kingdom
**Tagline:** Websites as intelligent as your business
**Phone:** [existing DCS phone]

**Services:**

1. Platform Websites -- custom sites on proprietary platform, themed, SEO-optimized
2. AI Automation -- AI-powered workflows, chatbots, content generation, business process automation
3. eCommerce Solutions -- online shops with payment processing and inventory management
4. Web Design -- brand identity, UI/UX design, responsive layouts
5. SEO & Analytics -- search optimization, GA4 setup, performance tracking
6. Maintenance & Support -- ongoing updates, monitoring, security patches

### Visual Direction

**Aesthetic:** Industrial Brutalist / Tactical Telemetry. Dark terminal interface with massive typographic contrast. Think: mission control meets tech agency. Raw, mechanical, utilitarian.

**Color Palette:**

- Background: Near-black (#0A0A0A) -- CRT terminal canvas
- Text: White phosphor (#EAEAEA) -- primary foreground
- Accent: Aviation Red (#FF2A2A) -- CTAs, dividers, alerts. The ONLY color accent.
- Muted: Dark grey (#161616) for elevated surfaces, (#777777) for secondary text
- Status green (#4AF626) -- used sparingly for "online" indicators only

**Typography:**

- Headlines: Space Grotesk Bold -- massive scale, tight tracking, uppercase for H1
- Body: Geist -- clean, modern, excellent readability on dark backgrounds
- Data/metadata: Geist Mono -- uppercase, generous tracking, small scale (12-14px)
- NO Inter, Roboto, Arial, Open Sans, or Helvetica

**Layout Rules:**

- Zero border-radius everywhere -- no rounded corners on anything
- 1px solid borders (#2A2A2A) for compartmentalization, not shadows
- No gradients, no glassmorphism, no translucent panels
- No hero images -- typography IS the hero
- Asymmetric grid with visible dividing lines
- Vast whitespace around headings, dense data clusters elsewhere

**Component Style:**

- Buttons: zero radius, uppercase monospace labels, ASCII brackets (e.g., `[ ENQUIRE ]`)
- Cards: 1px borders, no shadows, no radius, monospace metadata headers
- Navigation: monospace labels with system IDs (SYS.001, SYS.002)
- Forms: dark inputs with 1px borders, labels above (never floating)

**Decorative Elements:**

- ASCII framing: `[ TITLE ]`, `< ACTION >`, `/// SECTION`
- System IDs: SYS.001, UNIT.001, REV 2.6
- Status readouts: STATUS: ONLINE, UPTIME: 99.9%
- CRT scanline overlay (subtle repeating gradient)
- Cursor blink animation on hero text

---

## Pages to Generate

### 1. Home Page

- **Hero:** Massive "DIGITAL* CONSULTING* SERVICES > \_" with cursor blink, subtitle below, status data bar (EST. 2015 / STATUS: ONLINE / UNIT: UK-001), single red CTA
- **Services grid:** 2x3 grid of service cards with system IDs, status indicators, monospace metadata
- **Stats bar:** deployment count, uptime, client count in monospace data readout format
- **Portfolio preview:** 3 recent deployments with screenshots and metadata
- **CTA band:** full-width dark section with red border rules, "READY TO DEPLOY?" + button
- **Footer:** 3-column grid with visible dividers, monospace throughout

### 2. Services Page

- **Breadcrumb:** monospace, `HOME > SERVICES`
- **Page title:** "SERVICES" in H1 scale with section marker `/// SERVICES`
- **Service cards:** 6 cards in 2-column grid, each with system ID, title, description, action link
- **CTA section:** bottom of page

### 3. About Page

- **Hero:** "ABOUT* DCS > *" with cursor blink
- **Story section:** agency narrative in body text, asymmetric layout with data sidebar
- **Stats/credentials:** monospace data readouts (years active, sites deployed, platform version)
- **Values grid:** 3-4 values in compartmentalized cards
- **CTA band**

### 4. Contact Page

- **Hero:** "INITIATE* CONTACT > *"
- **Form:** dark inputs, 1px borders, monospace labels, red submit button
- **Contact data:** address, phone, email as monospace data fields alongside form
- **Operating hours** as data readout

### 5. Service Detail (template)

- **Breadcrumb:** `HOME > SERVICES > [SERVICE NAME]`
- **Hero:** service name in H1, system ID, status
- **Content area:** prose styling for MDX content
- **Features/benefits:** in compartmentalized grid
- **FAQ section:** accordion with monospace numbering
- **CTA band**

---

## Stitch Configuration Summary

| Setting       | Value         | Rationale                                     |
| ------------- | ------------- | --------------------------------------------- |
| Roundness     | Sharp         | Zero border-radius is core brutalist tenet    |
| Color variant | Monochrome    | Dark base with single red accent              |
| Headline font | Space Grotesk | Geometric, technical, brutalist-aligned       |
| Body font     | Geist         | Clean, modern, Vercel-ecosystem               |
| Creativity    | 7             | Bold -- this is the platform owner's own site |
| Density       | 3             | Editorial whitespace, agency sophistication   |
| Variance      | 6             | Asymmetric, anti-template                     |
| Motion        | 4             | Terminal effects, staggered reveals           |
