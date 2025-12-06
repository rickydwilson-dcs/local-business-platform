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

**Status:** 🟡 In Progress
**Total Stories:** 12 | **Points:** 35

Enhance the About page to prominently display Construction Line Gold and CHAS certifications with an interactive certificate gallery.

| ID      | Story                                      | Points | Status     |
| ------- | ------------------------------------------ | ------ | ---------- |
| ACC-001 | Display Construction Line Gold Badge       | 2      | ⬜ Pending |
| ACC-002 | Display CHAS Registered Badge              | 2      | ⬜ Pending |
| ACC-003 | Create Certificate Gallery Component       | 5      | ⬜ Pending |
| ACC-004 | Implement Certificate Lightbox Modal       | 5      | ⬜ Pending |
| ACC-005 | Convert PDF Certificates to Web Images     | 3      | ⬜ Pending |
| ACC-006 | Upload Certificate Images to Cloudflare R2 | 3      | ⬜ Pending |
| ACC-007 | Add Thumbnail Hover Effects                | 2      | ⬜ Pending |
| ACC-008 | Responsive Gallery Design                  | 3      | ⬜ Pending |
| ACC-009 | Accessibility for Certificate Images       | 3      | ⬜ Pending |
| ACC-010 | Update Schema.org Credentials Markup       | 2      | ⬜ Pending |
| ACC-011 | Lazy Loading for Certificate Images        | 2      | ⬜ Pending |
| ACC-012 | Keyboard Navigation for Lightbox           | 3      | ⬜ Pending |

**Certificates to Process:**

- [ ] Construction Line Gold (`Colossus Scaffolding UK Limited - Certificate.pdf`)
- [ ] CHAS Premium Plus (`Certificate of Membership.pdf`)
- [ ] IASME Cyber Essentials (`IASME.pdf`)
- [ ] Business Registration (`Registration Certificate - ZC027027.pdf`)
- [ ] Scaffolding Contractor (`SC Certificate - 17092025.pdf`)

---

## Sprint Planning

### Sprint 1 (Current)

**Capacity:** 30 points
**Committed:** 28 points (93.3%)

| Priority | ID      | Story                                      | Points | Assignee |
| -------- | ------- | ------------------------------------------ | ------ | -------- |
| HIGH     | ACC-001 | Display Construction Line Gold Badge       | 2      | -        |
| HIGH     | ACC-002 | Display CHAS Registered Badge              | 2      | -        |
| HIGH     | ACC-003 | Create Certificate Gallery Component       | 5      | -        |
| HIGH     | ACC-004 | Implement Certificate Lightbox Modal       | 5      | -        |
| HIGH     | ACC-005 | Convert PDF Certificates to Web Images     | 3      | -        |
| HIGH     | ACC-006 | Upload Certificate Images to Cloudflare R2 | 3      | -        |
| HIGH     | ACC-008 | Responsive Gallery Design                  | 3      | -        |
| HIGH     | ACC-009 | Accessibility for Certificate Images       | 3      | -        |
| MEDIUM   | ACC-010 | Update Schema.org Credentials Markup       | 2      | -        |

**Stretch Goals:**
| ID | Story | Points |
|----|-------|--------|
| ACC-007 | Add Thumbnail Hover Effects | 2 |
| ACC-011 | Lazy Loading for Certificate Images | 2 |
| ACC-012 | Keyboard Navigation for Lightbox | 3 |

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

_None yet_

### Recently Completed Stories

| Date | ID  | Story | Points |
| ---- | --- | ----- | ------ |
| -    | -   | -     | -      |

---

## Velocity Tracking

| Sprint   | Committed | Completed | Velocity |
| -------- | --------- | --------- | -------- |
| Sprint 1 | 28        | -         | -        |

**Average Velocity:** TBD

---

## Task Dependencies

```
Accreditation Gallery:

ACC-005 (Convert PDFs) ───────────────────┐
                                          ↓
ACC-006 (Upload to R2) ───────────────────┤
                                          ↓
ACC-001 (Construction Line Badge) ────────┤
ACC-002 (CHAS Badge) ─────────────────────┼──→ ACC-003 (Gallery Component)
                                          │         ↓
                                          │    ACC-007 (Hover Effects)
                                          │    ACC-008 (Responsive)
                                          │    ACC-009 (Accessibility)
                                          │    ACC-011 (Lazy Loading)
                                          │         ↓
                                          └──→ ACC-004 (Lightbox Modal)
                                                    ↓
                                               ACC-012 (Keyboard Nav)

ACC-010 (Schema.org) ──────────────────── Independent
```

---

## Notes

### Definition of Done

- [ ] Code reviewed and approved
- [ ] Unit tests written (where applicable)
- [ ] Accessibility tested with screen reader
- [ ] Responsive design verified on mobile, tablet, desktop
- [ ] Images optimized and loading from Cloudflare R2
- [ ] Schema.org markup validated
- [ ] Documentation updated
- [ ] Deployed to staging for QA

### Blockers

_None currently_

### Decisions Made

- Certificate images to be hosted on Cloudflare R2
- Gallery uses lightbox modal pattern for full-size viewing
- Construction Line Gold and CHAS to be featured prominently

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
