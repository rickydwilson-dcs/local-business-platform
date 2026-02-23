# Platform Backlog

Active platform development tasks, technical debt, and feature ideas.

For completed build history, see [docs/project-history.md](../../docs/project-history.md).

---

## Immediate

### Ingestion Pipeline Validation

- [ ] Test complete pipeline.ingest with a real client intake (not test fixtures)
- [ ] Verify registry recommendation (orion vs vega) works end-to-end

### Supabase Registry

- [ ] Create Supabase project and run schema SQL (`tools/supabase-schema.sql`)
- [ ] Add credentials to `.env.local` and run initial sync (`pnpm registry:sync`)

### Code Quality

- [ ] CQ-017 (LOW): Extract `sites/colossus-scaffolding/mdx-components.tsx` component definitions into separate files

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
