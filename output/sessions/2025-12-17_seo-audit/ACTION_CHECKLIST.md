# SEO Implementation Checklist

## Colossus Scaffolding - Priority Action Items

**Date Created:** December 17, 2025
**Last Updated:** December 17, 2025

---

## Week 1: Critical Fixes (URGENT)

### Day 1: Canonical URL Fix (P0 - CRITICAL)

**Issue:** All pages pointing to wrong domain
**Time:** 1 hour
**Owner:** Developer

- [ ] Update environment variable `NEXT_PUBLIC_SITE_URL=https://www.colossus-scaffolding.co.uk`
- [ ] Check metadata generation in `/sites/colossus-reference/app/layout.tsx`
- [ ] Verify canonical URL logic in metadata generators
- [ ] Test on 3-4 sample pages (homepage, service page, location page)
- [ ] Deploy to production
- [ ] Verify canonical tags in live site HTML

**Files to Check:**

- `/sites/colossus-reference/.env.local`
- `/sites/colossus-reference/.env.production`
- `/sites/colossus-reference/lib/metadata.ts` (if exists)
- `/sites/colossus-reference/app/*/page.tsx` (metadata generators)

**Test Command:**

```bash
curl -s https://www.colossus-scaffolding.co.uk | grep canonical
# Should show: https://www.colossus-scaffolding.co.uk (not Vercel URL)
```

---

### Day 1: Robots.txt Sitemap URL Fix (P0)

**Issue:** Sitemap URL doesn't match deployment
**Time:** 30 minutes
**Owner:** Developer

- [ ] Make robots.txt dynamic based on environment
- [ ] Update `/sites/colossus-reference/public/robots.txt`
- [ ] OR: Generate robots.txt via API route for dynamic URLs
- [ ] Test in staging and production
- [ ] Verify sitemap URL resolves correctly

**Current:**

```
Sitemap: https://www.colossus-scaffolding.co.uk/sitemap.xml
```

**Should match:**
Actual deployment URL (production domain)

---

### Day 2-3: Add Meta Descriptions (P0)

**Issue:** Service pages missing meta descriptions
**Time:** 3 hours
**Owner:** Content/Developer

**Priority Service Pages (10):**

- [ ] Residential Scaffolding
- [ ] Commercial Scaffolding
- [ ] Access Scaffolding
- [ ] Facade Scaffolding
- [ ] Industrial Scaffolding
- [ ] Edge Protection
- [ ] Temporary Roof Systems
- [ ] Scaffold Inspections
- [ ] Scaffolding Design
- [ ] Birdcage Scaffolds

**Template:**

```yaml
---
title: "[Service Name] Services"
description: "Professional [service] in Sussex from £[price]. TG20:21 compliant, CISRS teams, fully insured. Perfect for [use cases]. Free quote today!"
---
```

**Character Limit:** 150-160 characters

**Example:**

```yaml
description: "Professional residential scaffolding in Sussex from £800. TG20:21 compliant, CISRS teams, fully insured. Perfect for home extensions, roofing & repairs. Free quote today!"
```

---

### Day 4: Baseline Metrics Collection (P0)

**Issue:** Need baseline to measure improvement
**Time:** 2 hours
**Owner:** Marketing/SEO Lead

**Google Search Console:**

- [ ] Verify property ownership (if not done)
- [ ] Export last 3 months data (CSV)
- [ ] Note top 10 queries by clicks
- [ ] Note top 10 pages by clicks
- [ ] Document average position and CTR

**Google Analytics:**

- [ ] Set up GA4 property (if not done)
- [ ] Note last 3 months organic traffic
- [ ] Note bounce rate and avg session duration
- [ ] Set up conversion goals (contact form, phone clicks)

**Manual Checks:**

- [ ] Check indexed pages: `site:colossus-scaffolding.co.uk`
- [ ] Check top 5 local pack positions (Google Maps)
- [ ] Screenshot current rankings for key terms

**Create Baseline Report:**
Save in: `/output/sessions/2025-12-17_seo-audit/BASELINE_METRICS.md`

---

### Day 5: Title Tag Duplication Fix (P1)

**Issue:** Brand name appears twice in titles
**Time:** 1 hour
**Owner:** Developer

**Current Bug:**

```html
<title>Residential Scaffolding | Colossus Scaffolding | Colossus Scaffolding</title>
```

**Should be:**

```html
<title>Residential Scaffolding | Colossus Scaffolding</title>
```

- [ ] Find title generation logic
- [ ] Check if bug is in template or metadata generator
- [ ] Fix duplication logic
- [ ] Test on 5 sample pages
- [ ] Deploy and verify

**Likely File:**

- `/sites/colossus-reference/app/layout.tsx` or
- `/sites/colossus-reference/lib/metadata.ts` or
- Individual page metadata generators

---

## Week 2: Quick Win Schema (P1)

### Implement FAQ Schema (P1 - HIGH IMPACT)

**Impact:** Featured snippet opportunities
**Time:** 4 hours
**Owner:** Developer

**Pages to Add (Priority):**

- [ ] Residential Scaffolding (9 FAQs)
- [ ] Commercial Scaffolding (if has FAQs)
- [ ] Access Scaffolding (if has FAQs)
- [ ] Facade Scaffolding (if has FAQs)
- [ ] Industrial Scaffolding (if has FAQs)

**Implementation:**

Create FAQ schema component: `/sites/colossus-reference/components/Schema/FAQSchema.tsx`

```tsx
export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Add to Service Pages:**

```tsx
// In /sites/colossus-reference/app/services/[slug]/page.tsx
import { FAQSchema } from "@/components/Schema/FAQSchema";

export default function ServicePage({ params }) {
  // ... existing code

  return (
    <>
      <FAQSchema faqs={service.faqs} />
      {/* existing page content */}
    </>
  );
}
```

**Test:**

- [ ] Validate schema with Google Rich Results Test
- [ ] Check rendering in browser
- [ ] Verify no errors in Search Console

---

## Week 3: Breadcrumbs (P1)

### Add Breadcrumb Navigation (P1)

**Impact:** UX + SEO + search result enhancement
**Time:** 6 hours
**Owner:** Developer

**Implementation:**

1. Create Breadcrumb component: `/sites/colossus-reference/components/ui/Breadcrumbs.tsx`

```tsx
interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `https://www.colossus-scaffolding.co.uk${item.href}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="...">
        {/* Visual breadcrumb markup */}
      </nav>
    </>
  );
}
```

2. Add to Pages:

**Service Pages:**

```tsx
<Breadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.title },
  ]}
/>
```

**Location Pages:**

```tsx
<Breadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: location.title },
  ]}
/>
```

**Checklist:**

- [ ] Create Breadcrumb component
- [ ] Add to service page template
- [ ] Add to location page template
- [ ] Add BreadcrumbList schema
- [ ] Style breadcrumbs (mobile responsive)
- [ ] Test on 5 sample pages
- [ ] Validate schema

---

## Week 4: Footer Sitemap (P1)

### Add Footer Sitemap Section (P1)

**Impact:** Internal linking, crawlability
**Time:** 4 hours
**Owner:** Developer

**Implementation:**

Update `/sites/colossus-reference/components/Footer.tsx`:

```tsx
export function Footer() {
  const featuredServices = getServices().slice(0, 10);
  const featuredLocations = getLocations().slice(0, 12);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-standard py-12 grid md:grid-cols-4 gap-8">
        {/* Column 1: About */}
        <div>
          <h3 className="font-bold mb-4">About</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Services */}
        <div>
          <h3 className="font-bold mb-4">Our Services</h3>
          <ul className="space-y-2">
            {featuredServices.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`}>{service.title}</Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="font-semibold">
                View All →
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Locations */}
        <div>
          <h3 className="font-bold mb-4">Service Areas</h3>
          <ul className="space-y-2">
            {featuredLocations.map((location) => (
              <li key={location.slug}>
                <Link href={`/locations/${location.slug}`}>{location.title}</Link>
              </li>
            ))}
            <li>
              <Link href="/locations" className="font-semibold">
                View All →
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h3 className="font-bold mb-4">Get In Touch</h3>
          {/* Contact info */}
        </div>
      </div>
    </footer>
  );
}
```

**Checklist:**

- [ ] Update Footer component
- [ ] Add service links (top 10)
- [ ] Add location links (top 12)
- [ ] Style footer sections
- [ ] Test responsiveness
- [ ] Deploy

---

## Weeks 5-8: Content Enhancement (P1)

> **NOTE (Updated Dec 2025):** Client has no project portfolio, testimonials, or case study material.
> Strategy adjusted to focus on evergreen authority content that doesn't require social proof.
> When client collects testimonials/photos, these can be added incrementally.

### Enhance Service Pages - Phase 1 (Priority 5)

**Time:** 15 hours total (3 hours per page)
**Owner:** Content Writer + SEO Lead

**Priority Pages:**

1. [x] Residential Scaffolding
2. [x] Commercial Scaffolding
3. [x] Access Scaffolding
4. [x] Facade Scaffolding
5. [x] Industrial Scaffolding

**Content Strategy (No Portfolio Required):**

Instead of project examples and testimonials, focus on:

1. **Expanded "How It Works" Process Sections**
   - Step-by-step scaffolding process for each service type
   - What customers can expect at each stage
   - Timeline expectations

2. **"Service Available In" Location Grids**
   - Internal linking to all 37 location pages
   - Geographic coverage emphasis with clickable links
   - Improves internal link structure significantly

3. **"Related Services" Cross-Links**
   - 3-5 related service links per page
   - Builds internal link authority
   - Helps users discover relevant services

4. **Industry Standards & Compliance Content**
   - TG20:21 compliance explanations
   - CISRS qualification details
   - Safety standards and processes
   - Positions client as industry expert

5. **Common Scenarios/Use Cases**
   - "Perfect for: loft conversions, roof repairs, chimney work..."
   - Generic but specific enough to be useful

6. **Expanded FAQ Sections**
   - Target 8-12 FAQs per service page
   - Answer common customer questions
   - Improves featured snippet opportunities

**Content Template for Each:**

```markdown
# [Service] Services Across Sussex & South East England

[Existing hero content]

## [Service] Services in Sussex

We provide [service] throughout East Sussex, West Sussex, Kent, and Surrey. Whether you're planning [use case] in Brighton, [use case] in Eastbourne, or [use case] in Hastings, our CISRS-qualified teams deliver safe, compliant scaffolding solutions.

## How Our [Service] Process Works

1. **Free Consultation** - Discuss your project requirements
2. **Site Survey** - Assess access, ground conditions, and challenges
3. **Design & Quote** - TG20:21 compliant design with transparent pricing
4. **Installation** - CISRS teams install to specification
5. **Inspection** - 7-day safety inspections throughout hire
6. **Dismantling** - Safe removal and site cleanup

## Why Choose Our [Service]

- ✓ TG20:21 compliant designs
- ✓ CISRS qualified scaffolders
- ✓ £10M public liability insurance
- ✓ CHAS accredited contractor
- ✓ 7-day inspections included
- ✓ Free quotes within 24 hours

## [Service] Available Across Sussex & South East

We provide [service] in all our service areas:

**East Sussex:** [Brighton](/locations/brighton) | [Eastbourne](/locations/eastbourne) | [Hastings](/locations/hastings) | [Lewes](/locations/lewes) | [Seaford](/locations/seaford) | [Crowborough](/locations/crowborough)

**West Sussex:** [Worthing](/locations/worthing) | [Chichester](/locations/chichester) | [Crawley](/locations/crawley) | [Horsham](/locations/horsham) | [Bognor Regis](/locations/bognor-regis)

**Kent:** [Canterbury](/locations/canterbury) | [Maidstone](/locations/maidstone) | [Tunbridge Wells](/locations/tunbridge-wells) | [Folkestone](/locations/folkestone) | [Margate](/locations/margate)

**Surrey:** [Guildford](/locations/guildford) | [Woking](/locations/woking) | [Epsom](/locations/epsom) | [Reigate](/locations/reigate)

[View all 37 service locations →](/locations)

## Related Services

Looking for other scaffolding solutions?

- **[Access Scaffolding](/services/access-scaffolding)** - Standard access platforms
- **[Edge Protection](/services/edge-protection)** - Safety systems
- **[Scaffold Inspections](/services/scaffolding-inspections-maintenance)** - Maintenance & compliance

[Existing/Expanded FAQ section - 8-12 questions]
```

**Checklist per Page:**

- [ ] Expand "How It Works" section with service-specific details
- [ ] Add "Service Available In" location grid with 20+ internal links
- [ ] Add "Related Services" section with 3-5 cross-links
- [ ] Add "Why Choose Us" benefits section
- [ ] Expand FAQ section to 8-12 questions
- [ ] Ensure total word count 1,200+ words
- [ ] Verify all internal links work
- [ ] Review and publish

**Content Collection for Client (Future):**
When available, add:

- [ ] Customer testimonials (request after each job)
- [ ] Project photos (phone photos from jobs)
- [ ] Brief project notes for case studies

---

## Weeks 7-8: Blog Infrastructure Setup (P2)

> **NOTE:** Moved up from weeks 9-12. Focus on educational content that doesn't require portfolio.

### Launch Blog/Resource Center

**Time:** 20 hours setup + 20 hours initial content
**Owner:** Content Writer + Developer

#### Setup Blog Infrastructure (Week 7)

- [ ] Create `/sites/colossus-reference/app/blog` directory
- [ ] Create blog listing page: `/blog/page.tsx`
- [ ] Create blog post template: `/blog/[slug]/page.tsx`
- [ ] Create blog content directory: `/content/blog/`
- [ ] Define blog post schema (MDX frontmatter)
- [ ] Create blog card component
- [ ] Create blog categories (Guides, Costs, Compliance)
- [ ] Add blog link to header navigation
- [ ] Style blog pages

#### Initial Educational Content (Week 8)

**Content That Works Without Portfolio:**

**Post 1: How Much Does Scaffolding Cost in 2026? (1,800 words)**

- [ ] Research pricing data (industry averages)
- [ ] Create cost breakdown table by service type
- [ ] Write content with pricing factors
- [ ] Add internal links to service pages
- [ ] Optimize for "scaffolding cost" keywords
- [ ] Publish

**Post 2: Understanding TG20:21 Compliance (1,500 words)**

- [ ] Research TG20:21 requirements
- [ ] Create compliance checklist
- [ ] Explain why it matters for customers
- [ ] Link to relevant service pages
- [ ] Optimize for "TG20:21 compliance"
- [ ] Publish

**Post 3: Do I Need Planning Permission for Scaffolding? (1,200 words)**

- [ ] Research UK planning permission rules
- [ ] Cover common scenarios (public pavement, etc.)
- [ ] Link to location pages
- [ ] Optimize for FAQ-style searches
- [ ] Publish

**Post 4: Scaffolding for Loft Conversions: Complete Guide (1,500 words)**

- [ ] Cover scaffolding requirements for loft work
- [ ] Explain access considerations
- [ ] Timeline expectations
- [ ] Link to residential scaffolding page
- [ ] Publish

**Posts to AVOID (Require Portfolio):**

- ~~"Recent Projects in Brighton"~~ - No project photos
- ~~"Case Study: Commercial Scaffolding"~~ - No case studies
- ~~"Customer Testimonials"~~ - No testimonials yet

---

## Weeks 9-12: Content Expansion (P2)

---

## Months 4-6: Advanced Optimization (P2)

### Month 4: Schema & Technical

- [ ] Implement location-specific Service schema
- [ ] Add opening hours display to footer
- [ ] Optimize image alt text (all pages)
- [ ] Add Review schema for testimonials
- [ ] Create video schema (if videos exist)

### Month 5: Testimonials & Social Proof

- [ ] Collect 20 customer testimonials
- [ ] Add testimonial section to homepage
- [ ] Add testimonials to service pages
- [ ] Add testimonials to location pages
- [ ] Create case study template
- [ ] Publish 1 detailed case study

### Month 6: Link Building & Content Expansion

- [ ] Publish 8 more blog posts
- [ ] Submit to 10 local directories
- [ ] Outreach to 5 local business partners
- [ ] Guest post on 2 local blogs
- [ ] Monitor and respond to all reviews
- [ ] Create 2 more case studies

---

## Ongoing: Monthly Maintenance

### Monthly Tasks (Starting Month 2)

**Monitoring (5 hours/month):**

- [ ] Review Google Search Console performance
- [ ] Check keyword rankings (top 20 targets)
- [ ] Monitor local pack positions
- [ ] Review Google Analytics traffic
- [ ] Check for indexation issues
- [ ] Review Core Web Vitals
- [ ] Check for broken links

**Content (15 hours/month):**

- [ ] Publish 2-4 blog posts
- [ ] Update 2 existing service pages
- [ ] Add new testimonials as collected
- [ ] Respond to blog comments (if any)

**Link Building (5 hours/month):**

- [ ] Submit to 2 new directories
- [ ] Reach out to 3 potential link partners
- [ ] Monitor backlink profile
- [ ] Disavow toxic links (if any)

**Reporting (5 hours/month):**

- [ ] Create monthly SEO report
- [ ] Update KPI dashboard
- [ ] Document wins and learnings
- [ ] Plan next month priorities

---

## Tools Setup Checklist

### Essential (Free) Tools

- [ ] Google Search Console
  - [ ] Verify property ownership
  - [ ] Submit sitemap
  - [ ] Set up email alerts

- [ ] Google Analytics 4
  - [ ] Create property
  - [ ] Install tracking code (check existing)
  - [ ] Set up conversions (contact form, phone)
  - [ ] Create custom dashboard

- [ ] Google Business Profile
  - [ ] Claim/verify listing
  - [ ] Complete profile 100%
  - [ ] Upload photos (20+)
  - [ ] Set up weekly posting schedule

- [ ] Bing Webmaster Tools
  - [ ] Verify property
  - [ ] Submit sitemap

### Paid Tools (Optional but Recommended)

- [ ] SEMrush or Ahrefs (£99-199/month)
  - [ ] Set up account
  - [ ] Add domain
  - [ ] Configure rank tracking
  - [ ] Set up competitive analysis

- [ ] BrightLocal (£29/month)
  - [ ] Set up account
  - [ ] Configure local rank tracking
  - [ ] Set up citation tracking

---

## Progress Tracking

### Week 1 Completion

- [ ] All critical fixes deployed
- [ ] Baseline metrics collected
- [ ] Week 1 report created

### Month 1 Completion

- [ ] Technical SEO score: 85+/100
- [ ] 5 service pages enhanced
- [ ] FAQ schema on 5 pages
- [ ] Breadcrumbs on all pages
- [ ] Footer sitemap live

### Month 3 Completion

- [ ] 10 service pages enhanced
- [ ] Blog launched with 8+ posts
- [ ] Organic traffic +25%
- [ ] 3+ featured snippets

### Month 6 Completion

- [ ] All 25 service pages optimized
- [ ] 20+ blog posts published
- [ ] Organic traffic +150%
- [ ] 10+ featured snippets
- [ ] Top 3 local pack in 10+ cities

---

## Quick Reference: Priority Matrix

### P0 - CRITICAL (Do This Week)

1. Fix canonical URLs
2. Fix robots.txt
3. Add meta descriptions
4. Collect baseline metrics

### P1 - HIGH IMPACT (Do This Month)

5. Fix title tag duplication
6. Implement FAQ schema
7. Add breadcrumbs
8. Add footer sitemap
9. Enhance 5 service pages

### P2 - MEDIUM IMPACT (Months 2-3)

10. Launch blog
11. Publish cornerstone content
12. Location-specific schema
13. Testimonial collection
14. Internal linking optimization

### P3 - LONG-TERM (Months 4-6)

15. Video content
16. Interactive tools
17. Advanced link building
18. Competitive analysis
19. A/B testing
20. Conversion optimization

---

## Success Criteria

### Week 1 Success

✓ No canonical URL errors
✓ All pages have meta descriptions
✓ Baseline metrics documented

### Month 1 Success

✓ Technical SEO score 85+
✓ 5 pages with enhanced content
✓ FAQ schema live on 5 pages
✓ Organic traffic stable or +10%

### Month 3 Success

✓ Blog live with 8+ posts
✓ Organic traffic +25-50%
✓ 2-3 featured snippets
✓ 10+ new top 10 rankings

### Month 6 Success

✓ Organic traffic +100-150%
✓ 20+ blog posts
✓ 5-10 featured snippets
✓ Top 3 local pack in 10+ cities
✓ 50+ keywords in top 10

---

**Document Maintained By:** SEO Team
**Last Updated:** December 17, 2025
**Next Review:** January 17, 2026
