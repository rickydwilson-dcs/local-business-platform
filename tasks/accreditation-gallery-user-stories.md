# User Stories: Accreditation Gallery Enhancement

**Epic:** Accreditation Gallery Enhancement
**Generated:** 2025-12-06
**Total Stories:** 12
**Total Points:** 42

---

## USER STORY: ACC-001

### Display Construction Line Gold Badge

| Field        | Value |
| ------------ | ----- |
| **Type**     | Story |
| **Priority** | HIGH  |
| **Points**   | 2     |
| **Sprint**   | 1     |

**Story:**

> As a **potential customer**, I want to **see that Colossus Scaffolding is Construction Line Gold approved** so that **I can trust they meet government supply chain standards and are vetted for quality**.

**Acceptance Criteria:**

1. Given a user visits the About page, When they view the Certifications section, Then they see a prominent Construction Line Gold badge/icon
2. The badge should include the text "Construction Line Gold Approved"
3. The badge should be visually distinct with gold/premium styling
4. Hover state should show tooltip explaining what Construction Line Gold means
5. Must be visible above the fold on desktop views

**INVEST Checklist:**

- ✅ Independent - Can be implemented without other stories
- ✅ Negotiable - Badge design can be refined
- ✅ Valuable - Builds trust with potential customers
- ✅ Estimable - Clear scope, 2 points
- ✅ Small - Single badge addition
- ✅ Testable - Visual verification possible

---

## USER STORY: ACC-002

### Display CHAS Registered Badge

| Field        | Value |
| ------------ | ----- |
| **Type**     | Story |
| **Priority** | HIGH  |
| **Points**   | 2     |
| **Sprint**   | 1     |

**Story:**

> As a **potential customer**, I want to **see that Colossus Scaffolding is CHAS registered** so that **I can be confident in their health and safety compliance**.

**Acceptance Criteria:**

1. Given a user visits the About page, When they view the Certifications section, Then they see a prominent CHAS registered badge
2. The badge should include "CHAS Registered" or "CHAS Premium Plus" text
3. Badge styling should be consistent with Construction Line Gold badge
4. Hover state should explain CHAS certification benefits
5. Should be positioned alongside other key accreditations

**INVEST Checklist:**

- ✅ Independent - Can be implemented without other stories
- ✅ Negotiable - Badge design can be refined
- ✅ Valuable - Health & safety assurance for customers
- ✅ Estimable - Clear scope, 2 points
- ✅ Small - Single badge addition
- ✅ Testable - Visual verification possible

---

## USER STORY: ACC-003

### Create Certificate Gallery Component

| Field        | Value |
| ------------ | ----- |
| **Type**     | Story |
| **Priority** | HIGH  |
| **Points**   | 5     |
| **Sprint**   | 1     |

**Story:**

> As a **potential customer**, I want to **see a gallery of official certification documents** so that **I can verify the company's credentials are legitimate and current**.

**Acceptance Criteria:**

1. Given a user visits the About page, When they scroll to the Certifications section, Then they see a grid of certificate thumbnail images
2. Gallery should display 5 certificates in a responsive grid layout
3. Each thumbnail should show a preview of the actual certificate document
4. Thumbnails should be sized appropriately (e.g., 200x280px) with consistent aspect ratio
5. Each thumbnail should have a label identifying the certificate type
6. Gallery section should have a clear heading like "Our Certificates"
7. Component should be reusable (`components/ui/certificate-gallery.tsx`)

**Technical Notes:**

- Create `CertificateGallery` component with TypeScript interfaces
- Accept array of certificate objects with `name`, `thumbnail`, `fullImage`, `description`
- Use CSS Grid for responsive layout (1 col mobile, 2 col tablet, 5 col desktop)

**INVEST Checklist:**

- ✅ Independent - Core component, no dependencies
- ✅ Negotiable - Layout/styling can be refined
- ✅ Valuable - Provides transparency and trust
- ✅ Estimable - Component development, 5 points
- ✅ Small - Single component
- ✅ Testable - Visual and unit tests possible

---

## USER STORY: ACC-004

### Implement Certificate Lightbox Modal

| Field        | Value |
| ------------ | ----- |
| **Type**     | Story |
| **Priority** | HIGH  |
| **Points**   | 5     |
| **Sprint**   | 1     |

**Story:**

> As a **potential customer**, I want to **click on a certificate thumbnail to view the full document** so that **I can read the details and verify the certification information**.

**Acceptance Criteria:**

1. Given a user clicks on a certificate thumbnail, When the click is registered, Then a lightbox/modal opens showing the full certificate image
2. The lightbox should overlay the page with a semi-transparent backdrop
3. The full certificate should be displayed at maximum readable size
4. A close button (X) should be prominently displayed
5. Clicking outside the modal or pressing Escape should close it
6. Certificate name/title should be shown in the lightbox header
7. Animation should be smooth (fade in/out)

**Technical Notes:**

- Create `CertificateLightbox` component
- Use React state for open/closed status
- Implement click-outside detection
- Add keyboard event listeners for Escape key
- Consider using existing modal pattern if available

**INVEST Checklist:**

- ✅ Independent - Can use mock images initially
- ✅ Negotiable - Animation/styling flexible
- ✅ Valuable - Enables document verification
- ✅ Estimable - Modal development, 5 points
- ✅ Small - Single modal component
- ✅ Testable - Interaction testing possible

---

## USER STORY: ACC-005

### Convert PDF Certificates to Web Images

| Field        | Value     |
| ------------ | --------- |
| **Type**     | Technical |
| **Priority** | HIGH      |
| **Points**   | 3         |
| **Sprint**   | 1         |

**Story:**

> As a **developer**, I want to **convert the PDF certificates to optimized web images** so that **they can be displayed in the gallery and lightbox components**.

**Acceptance Criteria:**

1. All 5 PDF certificates converted to high-quality PNG or WebP format
2. Create thumbnail versions (400px width) for gallery display
3. Create full-size versions (1200px width) for lightbox display
4. Images should be optimized for web (compressed without visible quality loss)
5. File naming convention: `{certificate-slug}-thumb.webp` and `{certificate-slug}-full.webp`
6. Document the conversion process for future certificates

**Certificates to Convert:**

- Certificate of Membership.pdf → chas-membership
- Colossus Scaffolding UK Limited - Certificate.pdf → construction-line-gold
- IASME.pdf → iasme-cyber-essentials
- Registration Certificate - ZC027027.pdf → business-registration
- SC Certificate - 17092025.pdf → scaffolding-contractor

**INVEST Checklist:**

- ✅ Independent - Can be done in parallel with component development
- ✅ Negotiable - Image format/size can be adjusted
- ✅ Valuable - Required for gallery functionality
- ✅ Estimable - Known conversion task, 3 points
- ✅ Small - One-time conversion task
- ✅ Testable - Image quality verification

---

## USER STORY: ACC-006

### Upload Certificate Images to Cloudflare R2

| Field        | Value     |
| ------------ | --------- |
| **Type**     | Technical |
| **Priority** | HIGH      |
| **Points**   | 3         |
| **Sprint**   | 1         |

**Story:**

> As a **developer**, I want to **upload the certificate images to Cloudflare R2 storage** so that **they are served efficiently via CDN with proper caching**.

**Acceptance Criteria:**

1. All certificate images (thumbnails and full-size) uploaded to R2 bucket
2. Images organized in folder structure: `/certificates/thumbs/` and `/certificates/full/`
3. Public URLs configured and accessible
4. URLs documented in site configuration or constants file
5. Verify images load correctly from R2 URLs
6. Set appropriate cache headers for long-term caching

**Technical Notes:**

- Use existing R2 bucket or create new one if needed
- Configure CORS if required
- Add image URLs to site config for easy management

**INVEST Checklist:**

- ✅ Independent - Requires only converted images
- ✅ Negotiable - Folder structure can be adjusted
- ✅ Valuable - Enables production deployment
- ✅ Estimable - Known R2 workflow, 3 points
- ✅ Small - Upload and configure task
- ✅ Testable - URL accessibility verification

---

## USER STORY: ACC-007

### Add Thumbnail Hover Effects

| Field        | Value  |
| ------------ | ------ |
| **Type**     | Story  |
| **Priority** | MEDIUM |
| **Points**   | 2      |
| **Sprint**   | 1      |

**Story:**

> As a **potential customer**, I want to **see visual feedback when hovering over certificate thumbnails** so that **I know they are interactive and clickable**.

**Acceptance Criteria:**

1. Given a user hovers over a certificate thumbnail, When hover is detected, Then visual feedback is displayed
2. Hover effect should include subtle scale transform (e.g., 1.02x)
3. Add subtle shadow elevation on hover
4. Cursor should change to pointer
5. Transition should be smooth (200-300ms)
6. Optional: Show "View Certificate" text overlay on hover

**INVEST Checklist:**

- ✅ Independent - Enhancement to gallery component
- ✅ Negotiable - Effect style can be refined
- ✅ Valuable - Improves UX and discoverability
- ✅ Estimable - CSS enhancement, 2 points
- ✅ Small - Styling addition only
- ✅ Testable - Visual verification

---

## USER STORY: ACC-008

### Responsive Gallery Design

| Field        | Value |
| ------------ | ----- |
| **Type**     | Story |
| **Priority** | HIGH  |
| **Points**   | 3     |
| **Sprint**   | 1     |

**Story:**

> As a **mobile user**, I want to **view the certificate gallery on my phone or tablet** so that **I can verify credentials regardless of my device**.

**Acceptance Criteria:**

1. Mobile (< 640px): Single column layout, thumbnails stack vertically
2. Tablet (640px - 1024px): 2-3 column grid layout
3. Desktop (> 1024px): 5 column grid showing all certificates
4. Lightbox should be full-screen on mobile with swipe-to-close
5. Touch targets should be at least 44x44px for accessibility
6. Gallery section should maintain visual hierarchy on all breakpoints
7. Images should scale appropriately without distortion

**INVEST Checklist:**

- ✅ Independent - Built into gallery component
- ✅ Negotiable - Breakpoints can be adjusted
- ✅ Valuable - Ensures mobile usability
- ✅ Estimable - Responsive CSS, 3 points
- ✅ Small - CSS breakpoint additions
- ✅ Testable - Device testing possible

---

## USER STORY: ACC-009

### Accessibility for Certificate Images

| Field        | Value |
| ------------ | ----- |
| **Type**     | Story |
| **Priority** | HIGH  |
| **Points**   | 3     |
| **Sprint**   | 1     |

**Story:**

> As a **user with visual impairments**, I want to **understand what certificates are displayed using screen reader** so that **I can access the same trust information as sighted users**.

**Acceptance Criteria:**

1. All certificate images have descriptive alt text (e.g., "Construction Line Gold Certificate for Colossus Scaffolding UK Limited")
2. Gallery section has appropriate ARIA labels
3. Lightbox has focus trap for keyboard navigation
4. Lightbox can be closed with Escape key
5. Focus returns to triggering thumbnail when lightbox closes
6. Gallery items are navigable with Tab key
7. Screen reader announces "View [Certificate Name] certificate" on thumbnail focus

**INVEST Checklist:**

- ✅ Independent - Can be added to existing components
- ✅ Negotiable - ARIA labels can be refined
- ✅ Valuable - Legal compliance and inclusivity
- ✅ Estimable - Accessibility additions, 3 points
- ✅ Small - Attribute and focus management
- ✅ Testable - Screen reader testing

---

## USER STORY: ACC-010

### Update Schema.org Credentials Markup

| Field        | Value     |
| ------------ | --------- |
| **Type**     | Technical |
| **Priority** | MEDIUM    |
| **Points**   | 2         |
| **Sprint**   | 1         |

**Story:**

> As a **search engine**, I want to **understand the company's official credentials** so that **I can display trust signals in search results**.

**Acceptance Criteria:**

1. Add Construction Line Gold to `hasCredential` array in organization schema
2. Ensure CHAS credential is accurate (update to "CHAS Premium Plus" if applicable)
3. Add IASME Cyber Essentials credential
4. Verify schema validates with Google's Rich Results Test
5. Include credential dates/validity if available

**Schema Addition Example:**

```json
{
  "@type": "EducationalOccupationalCredential",
  "credentialCategory": "certification",
  "name": "Construction Line Gold",
  "description": "Government-backed certification for supply chain assurance in construction"
}
```

**INVEST Checklist:**

- ✅ Independent - Schema updates only
- ✅ Negotiable - Description wording flexible
- ✅ Valuable - SEO and trust signals
- ✅ Estimable - JSON updates, 2 points
- ✅ Small - Data additions only
- ✅ Testable - Schema validation tools

---

## USER STORY: ACC-011

### Lazy Loading for Certificate Images

| Field        | Value     |
| ------------ | --------- |
| **Type**     | Technical |
| **Priority** | MEDIUM    |
| **Points**   | 2         |
| **Sprint**   | 2         |

**Story:**

> As a **user on slow connection**, I want to **have certificate images load only when visible** so that **the page loads quickly without waiting for all images**.

**Acceptance Criteria:**

1. Certificate thumbnails use native lazy loading (`loading="lazy"`)
2. Full-size images in lightbox load on-demand when opened
3. Placeholder or skeleton shown while images load
4. Images should use Next.js Image component for optimization
5. No layout shift when images load (explicit width/height or aspect-ratio)

**INVEST Checklist:**

- ✅ Independent - Performance enhancement
- ✅ Negotiable - Loading strategy can be adjusted
- ✅ Valuable - Improves page performance
- ✅ Estimable - Next.js Image integration, 2 points
- ✅ Small - Image component updates
- ✅ Testable - Lighthouse performance testing

---

## USER STORY: ACC-012

### Keyboard Navigation for Lightbox

| Field        | Value  |
| ------------ | ------ |
| **Type**     | Story  |
| **Priority** | MEDIUM |
| **Points**   | 3      |
| **Sprint**   | 2      |

**Story:**

> As a **keyboard user**, I want to **navigate between certificates using arrow keys** so that **I can view all certificates without using a mouse**.

**Acceptance Criteria:**

1. Left/Right arrow keys navigate between certificates in lightbox
2. Escape key closes lightbox
3. Visual indicator shows current certificate position (e.g., "2 of 5")
4. Next/Previous buttons visible in lightbox for mouse users
5. Wrap-around navigation (after last certificate, go to first)
6. Focus management maintains keyboard accessibility

**INVEST Checklist:**

- ✅ Independent - Enhancement to lightbox
- ✅ Negotiable - Navigation behavior can be refined
- ✅ Valuable - Improves keyboard accessibility
- ✅ Estimable - Keyboard handlers, 3 points
- ✅ Small - Event listeners and state
- ✅ Testable - Keyboard interaction testing

---

## Backlog Summary

| Priority   | Stories | Points |
| ---------- | ------- | ------ |
| **HIGH**   | 8       | 26     |
| **MEDIUM** | 4       | 9      |
| **LOW**    | 0       | 0      |
| **Total**  | 12      | 35     |

### Sprint 1 Recommendation (Capacity: 30 points)

**Committed Stories (28 points):**

| ID      | Story                                      | Points | Priority |
| ------- | ------------------------------------------ | ------ | -------- |
| ACC-001 | Display Construction Line Gold Badge       | 2      | HIGH     |
| ACC-002 | Display CHAS Registered Badge              | 2      | HIGH     |
| ACC-003 | Create Certificate Gallery Component       | 5      | HIGH     |
| ACC-004 | Implement Certificate Lightbox Modal       | 5      | HIGH     |
| ACC-005 | Convert PDF Certificates to Web Images     | 3      | HIGH     |
| ACC-006 | Upload Certificate Images to Cloudflare R2 | 3      | HIGH     |
| ACC-008 | Responsive Gallery Design                  | 3      | HIGH     |
| ACC-009 | Accessibility for Certificate Images       | 3      | HIGH     |
| ACC-010 | Update Schema.org Credentials Markup       | 2      | MEDIUM   |

**Stretch Goals (7 points):**

| ID      | Story                               | Points | Priority |
| ------- | ----------------------------------- | ------ | -------- |
| ACC-007 | Add Thumbnail Hover Effects         | 2      | MEDIUM   |
| ACC-011 | Lazy Loading for Certificate Images | 2      | MEDIUM   |
| ACC-012 | Keyboard Navigation for Lightbox    | 3      | MEDIUM   |

### Sprint Utilization

- **Committed:** 28 points (93.3% of 30)
- **With Stretch:** 35 points (116.7% of 30)

---

## Dependencies Graph

```
ACC-005 (Convert PDFs)
    ↓
ACC-006 (Upload to R2)
    ↓
ACC-003 (Gallery Component) ←── ACC-007 (Hover Effects)
    ↓                           ACC-008 (Responsive)
    ↓                           ACC-009 (Accessibility)
    ↓                           ACC-011 (Lazy Loading)
ACC-004 (Lightbox Modal) ←───── ACC-012 (Keyboard Nav)

ACC-001 (Construction Line Badge) ──┐
ACC-002 (CHAS Badge) ───────────────┼── Independent
ACC-010 (Schema.org) ───────────────┘
```

---

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Unit tests written (where applicable)
- [ ] Accessibility tested with screen reader
- [ ] Responsive design verified on mobile, tablet, desktop
- [ ] Images optimized and loading from Cloudflare R2
- [ ] Schema.org markup validated
- [ ] Documentation updated
- [ ] Deployed to staging for QA
