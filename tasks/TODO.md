# Local Business Platform - Task Tracker & Roadmap

Central task management for all epics, user stories, and development work.

**Last Updated:** 2025-12-06
**Current Sprint:** Sprint 1

---

## Quick Links

| Document                                                                         | Description                                  |
| -------------------------------------------------------------------------------- | -------------------------------------------- |
| [roadmap.md](./roadmap.md)                                                       | 8-Week Implementation Roadmap                |
| [accreditation-gallery-user-stories.md](./accreditation-gallery-user-stories.md) | User stories for certificate gallery feature |
| [accreditation-gallery-epic.json](./accreditation-gallery-epic.json)             | Epic definition JSON                         |

---

## Active Epics

### Epic: Accreditation Gallery Enhancement

**Status:** ✅ Complete
**Total Stories:** 12 | **Points:** 35 | **Completed:** 2025-12-06

Enhance the About page to prominently display Construction Line Gold and CHAS certifications with an interactive certificate gallery.

| ID      | Story                                      | Points | Status      |
| ------- | ------------------------------------------ | ------ | ----------- |
| ACC-001 | Display Construction Line Gold Badge       | 2      | ✅ Complete |
| ACC-002 | Display CHAS Registered Badge              | 2      | ✅ Complete |
| ACC-003 | Create Certificate Gallery Component       | 5      | ✅ Complete |
| ACC-004 | Implement Certificate Lightbox Modal       | 5      | ✅ Complete |
| ACC-005 | Convert PDF Certificates to Web Images     | 3      | ✅ Complete |
| ACC-006 | Upload Certificate Images to Cloudflare R2 | 3      | ✅ Complete |
| ACC-007 | Add Thumbnail Hover Effects                | 2      | ✅ Complete |
| ACC-008 | Responsive Gallery Design                  | 3      | ✅ Complete |
| ACC-009 | Accessibility for Certificate Images       | 3      | ✅ Complete |
| ACC-010 | Update Schema.org Credentials Markup       | 2      | ✅ Complete |
| ACC-011 | Lazy Loading for Certificate Images        | 2      | ✅ Complete |
| ACC-012 | Keyboard Navigation for Lightbox           | 3      | ✅ Complete |

**Certificates Processed:**

- [x] Construction Line Gold (`Colossus Scaffolding UK Limited - Certificate.pdf`)
- [x] CHAS Premium Plus (`Certificate of Membership.pdf`)
- [x] IASME Cyber Essentials (`IASME.pdf`)
- [x] Business Registration (`Registration Certificate - ZC027027.pdf`)
- [x] Scaffolding Contractor (`SC Certificate - 17092025.pdf`)

---

## Sprint Planning

### Sprint 1 (Complete)

**Capacity:** 30 points
**Completed:** 35 points (116.7% - all stretch goals included!)

| Priority | ID      | Story                                      | Points | Status      |
| -------- | ------- | ------------------------------------------ | ------ | ----------- |
| HIGH     | ACC-001 | Display Construction Line Gold Badge       | 2      | ✅ Complete |
| HIGH     | ACC-002 | Display CHAS Registered Badge              | 2      | ✅ Complete |
| HIGH     | ACC-003 | Create Certificate Gallery Component       | 5      | ✅ Complete |
| HIGH     | ACC-004 | Implement Certificate Lightbox Modal       | 5      | ✅ Complete |
| HIGH     | ACC-005 | Convert PDF Certificates to Web Images     | 3      | ✅ Complete |
| HIGH     | ACC-006 | Upload Certificate Images to Cloudflare R2 | 3      | ✅ Complete |
| HIGH     | ACC-008 | Responsive Gallery Design                  | 3      | ✅ Complete |
| HIGH     | ACC-009 | Accessibility for Certificate Images       | 3      | ✅ Complete |
| MEDIUM   | ACC-010 | Update Schema.org Credentials Markup       | 2      | ✅ Complete |
| MEDIUM   | ACC-007 | Add Thumbnail Hover Effects                | 2      | ✅ Complete |
| MEDIUM   | ACC-011 | Lazy Loading for Certificate Images        | 2      | ✅ Complete |
| MEDIUM   | ACC-012 | Keyboard Navigation for Lightbox           | 3      | ✅ Complete |

---

## Backlog

### Ready for Sprint

_Stories that are groomed and ready to be pulled into a sprint_

| Epic | ID  | Story | Points | Priority |
| ---- | --- | ----- | ------ | -------- |
| -    | -   | -     | -      | -        |

### Needs Grooming

_Stories that need further refinement before sprint_

| Epic | Story Idea | Notes |
| ---- | ---------- | ----- |
| -    | -          | -     |

---

## Completed

### Completed Epics

| Date       | Epic                              | Stories | Points |
| ---------- | --------------------------------- | ------- | ------ |
| 2025-12-06 | Accreditation Gallery Enhancement | 12      | 35     |

### Recently Completed Stories

| Date       | ID      | Story                                      | Points |
| ---------- | ------- | ------------------------------------------ | ------ |
| 2025-12-06 | ACC-001 | Display Construction Line Gold Badge       | 2      |
| 2025-12-06 | ACC-002 | Display CHAS Registered Badge              | 2      |
| 2025-12-06 | ACC-003 | Create Certificate Gallery Component       | 5      |
| 2025-12-06 | ACC-004 | Implement Certificate Lightbox Modal       | 5      |
| 2025-12-06 | ACC-005 | Convert PDF Certificates to Web Images     | 3      |
| 2025-12-06 | ACC-006 | Upload Certificate Images to Cloudflare R2 | 3      |
| 2025-12-06 | ACC-007 | Add Thumbnail Hover Effects                | 2      |
| 2025-12-06 | ACC-008 | Responsive Gallery Design                  | 3      |
| 2025-12-06 | ACC-009 | Accessibility for Certificate Images       | 3      |
| 2025-12-06 | ACC-010 | Update Schema.org Credentials Markup       | 2      |
| 2025-12-06 | ACC-011 | Lazy Loading for Certificate Images        | 2      |
| 2025-12-06 | ACC-012 | Keyboard Navigation for Lightbox           | 3      |

---

## Velocity Tracking

| Sprint   | Committed | Completed | Velocity |
| -------- | --------- | --------- | -------- |
| Sprint 1 | 28        | 35        | 35       |

**Average Velocity:** 35 points

---

## Notes

### Definition of Done

- [x] Code reviewed and approved
- [x] Accessibility tested with screen reader
- [x] Responsive design verified on mobile, tablet, desktop
- [x] Images optimized and loading from Cloudflare R2
- [x] Schema.org markup validated
- [x] Documentation updated
- [ ] Deployed to staging for QA

### Deliverables

**New Components:**

- `components/ui/certificate-gallery.tsx` - Responsive thumbnail gallery
- `components/ui/certificate-lightbox.tsx` - Modal with keyboard navigation
- `components/ui/accreditation-section.tsx` - Integration wrapper

**R2 Assets:**

- `certificates/thumbs/` - 5 thumbnail images (400px)
- `certificates/full/` - 5 full-size images (1200px)

**Updated Files:**

- `app/about/page.tsx` - New accreditation section with gallery
- `app/globals.css` - Lightbox styles

### Decisions Made

- Certificate images hosted on Cloudflare R2
- Gallery uses lightbox modal pattern for full-size viewing
- Construction Line Gold and CHAS featured prominently with gold/green badges
- All 5 certificates displayed in responsive grid

---

## How to Use This File

1. **Add New Epics:** Create epic JSON and user stories in `/tasks/`, then add summary to Active Epics section
2. **Sprint Planning:** Move stories from Backlog to current Sprint
3. **Track Progress:** Update status (⬜ Pending → 🟡 In Progress → ✅ Complete)
4. **Complete Stories:** Move to Completed section with date

**Status Legend:**

- ⬜ Pending - Not started
- 🟡 In Progress - Currently being worked on
- ✅ Complete - Done and verified
- 🔴 Blocked - Cannot proceed
