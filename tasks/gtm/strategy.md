# Go-To-Market Strategy

Strategy and actionable checklists for client acquisition and revenue generation.

---

## Positioning

**What we sell:** Professional websites that get local tradespeople found online and generate enquiries. Not "web design" — a complete solution: website, hosting, domain, email, SEO, ongoing support.

**Customer-facing message:** "We build websites that get you more jobs." The copy never mentions the platform, the tech stack, or Next.js. Clients see results: a professional site, their phone ringing, appearing on Google.

**How we're different from cheap builders (£29-49/month DIY platforms):**

- Bespoke design, not a template they configure themselves
- Local SEO built in from day one (service pages, location pages, Schema markup)
- We handle everything — domain, email, hosting, updates, content
- Real portfolio of working businesses (not generic demos)

**How we're different from agencies (£5K-10K+):**

- Fraction of the cost, same professional quality
- Delivered in days, not months
- Fixed pricing, no scope creep

---

## Target Market

**Who:** Independent tradespeople and sole traders who either have no website, have a poor DIY one, or are overpaying for a basic WordPress site.

**Industries covered** (14 industry libraries, ~277 service templates):
Scaffolding, Plumbing, Gardening, Building, Roofing, Electrical, Painting & Decorating, Handyman, Plastering, Fencing & Decking, Flooring, Locksmith, Tiling, Chimney & Stove, Driveway & Patio

**Geography:** Start with South East England (Sussex, Kent, Surrey, Cambridgeshire), expand based on demand.

---

## Demo Sites Strategy

Build a showcase site for each trade using the platform. Each lives as a separate Vercel deployment with its own URL. Prospects can see exactly what their site would look like — for their specific trade.

### Actions

- [ ] Create `sites/dcs-electrical-demo` — example electrical business
- [ ] Create `sites/dcs-plumbing-demo` — example plumbing business
- [ ] Create `sites/dcs-roofing-demo` — example roofing business
- [ ] Create 1-2 more demo sites for other popular trades
- [ ] Deploy each to Vercel with demo URLs (e.g. dcs-electrical.vercel.app or similar)
- [ ] Link all demos from the DCS portfolio page
- [ ] Add "This is a demo site — want one like this? Contact us" banner to each

### Content for demos

- Use AI content generation with industry libraries (already built)
- 5-8 service pages, 3-5 location pages per demo
- Realistic business info (fictional but plausible)

---

## DCS Website Rebuild

Rebuild www.digitalconsultingservices.co.uk using our own platform (eat our own dog food). This is the lead-gen site.

### Messaging (customer-facing, not technical)

- [ ] Homepage: "Websites that get local tradespeople more jobs"
- [ ] What you get: professional design, found on Google, mobile-friendly, contact forms that work, your own domain and email
- [ ] How it works: "Tell us about your business → We build your site → You get more enquiries"
- [ ] Portfolio: Colossus Scaffolding (live), plus previous WordPress/WooCommerce builds
- [ ] Pricing page with clear tiers
- [ ] Testimonials / social proof
- [ ] Blog targeting "tradesperson website" / "get more customers" keywords
- [ ] Simple contact form / "Book a free call" CTA

### Portfolio section

Include ALL previous builds, not just platform sites:

- [ ] Colossus Scaffolding — scaffolding, live, platform build
- [ ] List previous WordPress/WooCommerce client builds with screenshots
- [ ] For each: client name, trade, what we delivered, result/testimonial if available
- [ ] Present as "real businesses we've helped" — trade agnostic

### Actions

- [ ] Create `sites/dcs-website` in the monorepo
- [ ] Write copy for homepage, services, portfolio, about, pricing, contact, blog
- [ ] Design and build
- [ ] Deploy to Vercel with digitalconsultingservices.co.uk domain
- [ ] Set up Google Analytics + Search Console
- [ ] Submit sitemap to Google

---

## Pricing & Packaging

Based on market research (Feb 2026):

- Cheap builders: £29-99/month (DIY, no bespoke design, limited SEO)
- Freelancers: £1,500-3,000 one-off (no ongoing support typically)
- Agencies: £3,000-10,000+ (overkill for most tradespeople)
- Pay-monthly competitors: £49-99/month, no upfront (e.g. webuildstores.co.uk, britishwebsitedesign.co.uk)
- Colossus benchmark: £2,000 setup + £25/month (our mid-tier reference)

Clients choose either **upfront** (lower total cost) or **pay-monthly** (no setup fee, 12-month minimum). Same site, same quality — just different payment structure.

### Our Advantage

Our AI-native creation process means we generate service pages, location pages, and SEO copy at near-zero marginal cost. Themes can be custom-built or picked from our library — the library just makes it faster and helps clients visualise what they'll get. Tiers differ on **site size** (total pages) and **ongoing service level**, not on bespoke-ness.

### What Every Site Gets (all tiers)

- Contact form with email notifications
- Mobile-responsive, fast-loading design
- Custom theme — built from scratch or adapted from our library (colours, typography, layout)
- Full local SEO (Schema markup, meta tags, sitemap, service + location targeting)
- Custom domain setup + management (domain cost included — no extra charge on any tier)
- Google Workspace email setup (billed separately via Google, ~£5/month)
- SSL certificate (included)
- Hosting, security updates, uptime monitoring
- Unlimited rounds of revisions during build

### What Differentiates the Tiers

The core differences are **page count** (service pages + location pages) and **ongoing service level**.

#### Starter — up to 20 pages

**For:** Tradespeople who want a professional site and to be found on Google

- Up to 20 pages total (service + location pages combined)
- **Monthly:** 1 content update/month

#### Professional — up to 50 pages

**For:** Businesses who want active growth support alongside their site

- Everything in Starter, plus:
- Up to 50 pages total (broader service coverage + more location pages)
- Blog (we write 1 post/month for the first 3 months)
- Project portfolio / case studies section
- Customer reviews / testimonials page
- Google My Business guidance
- Google Analytics + consent management (GDPR compliant)
- **Monthly:** 2 content updates/month

> **Colossus was this tier** — sold at £2,000 + £25/month.

#### Growth — up to 100 pages

**For:** Businesses ready to invest seriously in online lead generation

- Everything in Professional, plus:
- Up to 100 pages total (maximum service + location coverage)
- Blog with 2 posts/month (first 3 months, then optional add-on)
- Monthly performance report
- Google My Business setup and optimisation
- Quarterly SEO review (keyword tracking, content gap analysis, recommendations)
- Priority support (same-day response)
- **Monthly:** 4 content updates/month, monthly analytics report, blog management

### Pricing Options

Clients pick their tier, then choose how to pay:

#### Option A: Upfront + Monthly

| Tier         | Setup Fee | Monthly | Year 1 Total | Year 2+ (per year) |
| ------------ | --------- | ------- | ------------ | ------------------ |
| Starter      | £995      | £15/mo  | £1,175       | £180               |
| Professional | £1,995    | £25/mo  | £2,295       | £300               |
| Growth       | £3,495    | £50/mo  | £4,095       | £600               |

Best for clients who want the lowest total cost. No minimum term on monthly.

#### Option B: Pay Monthly (no setup fee)

| Tier         | Setup Fee | Monthly | Min Term  | Year 1 Total | Year 2+ (per year) |
| ------------ | --------- | ------- | --------- | ------------ | ------------------ |
| Starter      | £0        | £45/mo  | 12 months | £540         | £540               |
| Professional | £0        | £75/mo  | 12 months | £900         | £900               |
| Growth       | £0        | £125/mo | 12 months | £1,500       | £1,500             |

Best for clients who don't want a big upfront cost. 12-month minimum contract. After 12 months, rolls monthly — cancel anytime with 30 days notice. Service model: we own and maintain the site. If they stop paying, the site comes down. (Same as leasing — they're paying for an ongoing service, not buying an asset.)

#### Revenue comparison at scale

| Scenario (50 clients)              | Upfront Revenue | Monthly Recurring | Year 1 Total |
| ---------------------------------- | --------------- | ----------------- | ------------ |
| All upfront (avg Professional)     | £99,750         | £15,000/yr        | £114,750     |
| All pay-monthly (avg Professional) | £0              | £45,000/yr        | £45,000      |
| 50/50 mix                          | £49,875         | £30,000/yr        | £79,875      |

Pay-monthly generates less in year 1 but builds stronger recurring revenue. By year 2 the monthly clients are pure profit. The 50/50 mix is realistic and still hits six figures by year 2.

### Add-Ons (same for both payment options)

Add-ons are designed to stay automatable or one-off — they shouldn't create ongoing manual work that breaks the business model.

**Content & SEO (high-automation):**

- Extra pages beyond tier cap: £20/page one-off (service or location page)
- Blog post writing: £75/post (AI-drafted, human-edited)
- Quarterly SEO review upgrade for Professional: £50/quarter
- FAQ expansion pack: £100 one-off (20 AI-generated Q&As on their trade)

**Automated growth tools:**

- Review capture widget: £10/month (automated SMS/email asks customers for Google reviews after job completion)
- Lead notification upgrade: £5/month (SMS alerts on form submission, not just email)
- Call tracking number: £15/month (track which enquiries came from the website)
- Chatbot with AI FAQ (trained on their service content): £20/month
- Live availability / booking calendar integration: £15/month (Calendly/Cal.com)

**One-off / low-touch:**

- Custom theme design: £350 one-off (bespoke colours, typography, layout to match exact brand guidelines — joins our theme library for future reuse)
- Logo design: £250 one-off (AI-assisted, 3 concepts)
- Branded stationery pack (business cards, email signature, invoice template): £150 one-off
- Google My Business setup: £150 one-off (for Starter tier, who don't get it bundled)
- Multi-location expansion: £200 per additional trading area (unlocks 20 extra location pages)

**Ecosystem / referral revenue (zero delivery work):**

- Google Workspace setup via DCS as reseller (small margin per seat)
- Domain registration via our registrar (small margin per domain)
- Stripe payment integration (if they want to take deposits online): £100 setup, then client pays Stripe fees direct

**Higher-touch (explicit premium — flagged because they break pure automation):**

- Google Ads setup + management: £200/month + ad spend (manual oversight — price accordingly)
- Monthly SEO retainer: £200/month (keyword tracking, backlink building, content strategy)
- Photography session coordination: at cost

### Domain & Email (managed service)

We buy and manage domains on behalf of clients. We set up Google Workspace for their business email. Domain cost is included on every tier.

- Domain: included on all tiers (we cover ~£15/year)
- Google Workspace: billed to client via Google (~£5.50/user/month), we handle setup and DNS

### Actions

- [ ] Finalise pricing (review these numbers, adjust based on gut feel)
- [x] Site ownership for pay-monthly: service model — we own the site, stops if they stop paying
- [ ] Draft pricing page copy (benefits-led, not feature-led)
- [ ] Set up Stripe for one-off payments + monthly subscriptions
- [ ] Create contract/terms template (separate versions for upfront vs pay-monthly)
- [ ] Create invoice template

---

## Outbound Plan

### Research Phase

- [ ] Identify 50 target businesses (tradespeople without websites or with poor ones)
- [ ] Research each: business name, trade, location, current web presence, contact info
- [ ] Prioritise by: no existing website > outdated website > decent website
- [ ] Track in Google Sheets CRM (see operations/google-workspace.md)

### Email Outreach

- [ ] Draft cold email template (personalised, link to their trade's demo site)
- [ ] Draft follow-up sequence (3 emails over 2 weeks)
- [ ] Set up sending from ricky@digitalconsultingservices.co.uk
- [ ] Choose email automation tool (Brevo free tier or Gmail + Apps Script)
- [ ] Send first batch (10 emails)
- [ ] Track open rates, replies, conversions

### Other Channels

- [ ] Google My Business listing for Digital Consulting Services
- [ ] Facebook business page + join local trade groups
- [ ] Local business networking (Federation of Small Businesses, local chambers)
- [ ] LinkedIn outreach to business owners
- [ ] Checkatrade / MyBuilder forums where tradespeople hang out

---

## Sales Materials

- [ ] One-page PDF per trade: "Here's what your website could look like" (link to demo)
- [ ] Colossus case study: what we built, results, testimonial
- [ ] Portfolio page on DCS website (all builds including WordPress/WooCommerce)
- [ ] 60-second video walkthrough of a demo site
- [ ] FAQ document for common objections ("I get all my work from word of mouth")

---

## Pipeline Targets

| Milestone             | Target   | Status      |
| --------------------- | -------- | ----------- |
| DCS website live      | Feb 2026 | Not started |
| 3 demo sites deployed | Feb 2026 | Not started |
| First paying client   | Mar 2026 | Not started |
| 10 sites deployed     | Month 3  | -           |
| 25 sites deployed     | Month 6  | -           |
| 50 sites deployed     | Year 1   | -           |

### Revenue Projections (illustrative)

| Clients | Setup Revenue | Monthly Recurring (avg £25/mo) | Annual Revenue |
| ------- | ------------- | ------------------------------ | -------------- |
| 10      | £19,950       | £3,000                         | £22,950        |
| 25      | £49,875       | £7,500                         | £57,375        |
| 50      | £99,750       | £15,000                        | £114,750       |

### Financial

- [ ] Set up monthly revenue tracking
- [ ] Track client acquisition cost per channel
- [ ] Monitor hosting costs vs revenue per client (Vercel Pro = £20/month for all sites)
- [ ] Profit margin analysis
