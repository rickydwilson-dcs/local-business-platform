# Platform Backlog

Active platform development tasks, technical debt, and feature ideas.

For completed build history, see [docs/project-history.md](../../docs/project-history.md).

---

## Immediate

### Ingestion Pipeline Validation

- [ ] Test complete pipeline.ingest with a real client intake (not test fixtures)
- [ ] Verify registry recommendation (orion vs vega) works end-to-end

### ~~Supabase Registry~~ ✅ Done

~~- [x] Create Supabase project and run schema SQL (`tools/supabase-schema.sql`)~~
~~- [x] Add credentials to `.env.local` and run initial sync (`pnpm registry:sync`)~~

> Completed — real Supabase instance connected, `manage-sites.ts` CLI functional.

### ~~Code Quality~~ ✅ Done

~~- [x] CQ-017 (LOW): Extract `sites/colossus-scaffolding/mdx-components.tsx` component definitions into separate files~~

> Completed — components extracted to `sites/colossus-scaffolding/components/mdx/`.

---

## Short-Term

### GSC Indexing Monitor

Automated daily monitoring of Google Search Console indexing status across all platform sites. Downloads Coverage Report CSV via Playwright, re-submits sitemaps, logs to Supabase, generates monthly markdown reports for client reporting.

- [ ] Navigation spike: verify GSC Coverage report URLs and Playwright selectors against live UI
- [ ] Create GCP service account and configure GSC API access for both properties
- [ ] Run YOLO brief: `output/sessions/2026-04-12_gsc-indexing-monitor/yolo-brief.md`
- [ ] Run Supabase schema SQL (`tools/supabase-schema-gsc.sql`)
- [ ] Verify with `pnpm gsc:login` + `pnpm gsc:verify` + `pnpm gsc:inspect --dry-run`
- [ ] Add GitHub Secrets (`GSC_SESSION_JSON`, `GSC_SERVICE_ACCOUNT_KEY_JSON`) and test workflow_dispatch
- [ ] Enable daily cron schedule

**Synthesis:** `output/sessions/codex-peer-review/2026-04-12_gsc-indexing-monitor/synthesis.md`

### Component Variants

- [ ] Implement service card variants (card-elevated, card-compact)
- [x] ~~Implement contact form variants (form-minimal, form-detailed)~~ — done (standard/detailed variants in core-components)
- [ ] Test variant switching across sites

### Image Pipeline

- [x] ~~Create unified `tools/images-intake.ts` CLI~~ — exists and functional
- [ ] Set up custom R2 domain (currently using default `.r2.dev` subdomain)
- [ ] Remove old images from Git repository
- [ ] AVIF conversion support

### Monitoring

- [ ] Implement monitoring dashboard UI (design doc at `docs/architecture/MONITORING_DASHBOARD.md`)
- [ ] Review platform integration (Google Reviews API, Trustpilot API)

### Technical Documentation

- [x] ~~Complete all technical documentation~~ — 8,000+ lines across guides, architecture, and standards docs
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
