# Platform Backlog

Active platform development tasks, technical debt, and feature ideas.

For completed build history, see [docs/project-history.md](../../docs/project-history.md).

---

## Immediate

### End-to-End Workflow

- [ ] Document complete site creation process (intake → generation → deploy → handoff)
- [ ] Create workflow checklist template
- [ ] Test complete workflow with dummy client
- [ ] Time each step and identify bottlenecks

### Industry Libraries

- [ ] Test all 14 industry libraries with AI content generation
- [ ] Validate generated content quality across different trades

### Code Quality

- [ ] Resolve remaining code review findings from 2026-02-08 Codex review
- [ ] Fix pre-existing colossus components referencing missing files (certificate-gallery, certificate-lightbox, content-card)

---

## Short-Term

### Component Variants

- [ ] Implement service card variants (card-elevated, card-compact)
- [ ] Implement contact form variants (form-minimal, form-detailed)
- [ ] Test variant switching across sites

### Image Pipeline

- [ ] Create unified `tools/images-intake.ts` CLI (site slug + source dir params)
- [ ] Set up custom R2 domain (images.yourdomain.com)
- [ ] Remove old images from Git repository
- [ ] AVIF conversion support

### Monitoring

- [ ] Implement monitoring dashboard UI (design doc at `docs/architecture/MONITORING_DASHBOARD.md`)
- [ ] Review platform integration (Google Reviews API, Trustpilot API)

### Technical Documentation

- [ ] Complete all technical documentation
- [ ] Create client-facing "how your website works" guide
- [ ] Document support procedures

---

## Feature Backlog

Prioritised by likely client demand:

- [ ] Booking/scheduling system integration
- [ ] Client self-service portal (content updates, basic analytics)
- [ ] Social media integration (auto-post blog content)
- [ ] Email marketing integration (newsletter signup → Mailchimp/etc)
- [ ] CRM integration
- [ ] Multi-language support
- [ ] E-commerce integration
- [ ] Advanced analytics dashboard for clients
- [ ] Video content generation
- [ ] White-label mobile apps

---

## Maintenance Cadence

- Weekly: dependency updates (`pnpm update`)
- Monthly: security audit (npm audit, dependency review)
- Quarterly: performance review (build times, Lighthouse scores, error rates)
- Ongoing: backup verification, uptime monitoring
