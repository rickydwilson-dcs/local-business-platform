# Error Monitoring Comparison: Sentry vs NewRelic

**For:** Local Business Platform (Multi-Site Next.js Monorepo)
**Date:** 2025-10-19

---

## 🎯 TL;DR Recommendation

**For our needs: NewRelic Free Tier is the better choice**

**Why:**

1. ✅ **100 GB/month free** (vs Sentry's 5,000 errors/month)
2. ✅ **Full-stack observability** (APM + errors + infrastructure)
3. ✅ **Better for scaling to 50+ sites**
4. ✅ **No per-site costs** (Sentry charges per event)
5. ✅ **Includes performance monitoring** (crucial for client sites)
6. ✅ **AI-powered insights** for proactive issue detection

---

## 📊 Detailed Comparison

### NewRelic Free Tier

**What You Get (Forever Free):**

- 100 GB data ingest per month
- 1 full platform user
- Unlimited basic users
- Full platform access (no feature restrictions)
- Email alerts
- Dashboards and logs
- **No credit card required**

**Key Features:**

- ✅ Application Performance Monitoring (APM)
- ✅ Error tracking (Errors Inbox)
- ✅ Infrastructure monitoring
- ✅ Browser monitoring (Core Web Vitals)
- ✅ Synthetic monitoring
- ✅ Log management
- ✅ AI-powered insights (anomaly detection)
- ✅ Session replay capabilities
- ✅ Distributed tracing

**Limits:**

- 100 GB data/month (very generous)
- 1 full platform user (you)
- Basic users can view but not configure

**Pricing Beyond Free:**

- $0.30-0.60 per GB beyond 100 GB
- Additional full users: $99/month each

---

### Sentry Free Tier

**What You Get (Developer Plan):**

- 5,000 errors per month
- 10,000 performance units per month
- 1 project
- 7-day data retention
- Email alerts
- **No credit card required**

**Key Features:**

- ✅ Excellent error tracking and grouping
- ✅ Session replay
- ✅ Source maps support
- ✅ Release tracking
- ✅ User feedback integration
- ✅ Issue assignment and workflow
- ✅ Stack trace analysis
- ❌ No APM (performance monitoring limited)
- ❌ No infrastructure monitoring
- ❌ No AI insights

**Limits:**

- 5,000 errors/month (can run out quickly)
- 10,000 performance units/month
- 7-day retention (paid plans get 30-90 days)
- 1 project only (need multiple for 50 sites)

**Pricing Beyond Free:**

- Team: $26/month (50,000 errors, 100K performance units)
- Business: $80/month (500K errors, 1M performance units)

---

## 💰 Cost Comparison for Our Platform

### Scenario: 50 Sites in Production

**Estimated Monthly Traffic:**

- 50 sites × 1,000 errors/month avg = 50,000 errors
- 50 sites × 10,000 page views/month = 500,000 pageviews

### NewRelic Costs:

**Free Tier Coverage:**

- 100 GB/month data ingest
- Typical Next.js app: ~50 MB per 10,000 requests
- **Estimated:** 50 sites = ~2.5 GB/month = **FREE** ✅

**If You Exceed 100 GB:**

- Unlikely with 50 small business sites
- Cost: $0.30-0.60/GB (only ~$30-60/month if you 2x the limit)

**Additional Users:**

- You (admin): Free
- Team members (view-only): Free (unlimited basic users)
- Additional admins: $99/month each (probably don't need)

**Total Cost:** $0/month for foreseeable future

---

### Sentry Costs:

**Free Tier Coverage:**

- 5,000 errors/month
- 50 sites = 100 errors/site/month limit
- **Will exceed free tier within 1 week** ❌

**Required Paid Plan:**

- Team Plan: $26/month (50K errors)
- Business Plan: $80/month (500K errors)
- **Need Business plan for 50 sites** = $80/month minimum

**Additional Costs:**

- Multiple projects needed (1 per site or grouped)
- Session replay adds to event count
- Performance monitoring limited

**Total Cost:** $80-160/month minimum

---

## 🏗️ Our Platform Specifics

### Current Architecture

- Monorepo with 2 sites (growing to 50)
- Next.js 15 (App Router)
- Deployed on Vercel
- Turbopack builds
- E2E tests with Playwright

### Our Needs (Priority Order)

1. **Error Tracking** ⭐⭐⭐⭐⭐
   - Track runtime errors across all sites
   - Get notified when sites break
   - **Winner:** Both handle this well, slight edge to Sentry

2. **Performance Monitoring** ⭐⭐⭐⭐⭐
   - Core Web Vitals tracking
   - Slow page detection
   - API performance
   - **Winner:** NewRelic (built-in APM, Sentry charges extra)

3. **Scalability to 50+ Sites** ⭐⭐⭐⭐⭐
   - Cost-effective at scale
   - Easy to add new sites
   - **Winner:** NewRelic (no per-site costs)

4. **Budget** ⭐⭐⭐⭐
   - Keep costs low during growth phase
   - Predictable pricing
   - **Winner:** NewRelic ($0 vs $80-160/month)

5. **Integration Ease** ⭐⭐⭐⭐
   - Next.js integration
   - Vercel deployment
   - **Winner:** Sentry (wizard is excellent, but NewRelic also good)

6. **Developer Experience** ⭐⭐⭐
   - Easy to use interface
   - Good documentation
   - **Winner:** Tie (both excellent)

---

## ✅ NewRelic Advantages

1. **Cost-Effective at Scale**
   - 100 GB free = supports 50+ sites easily
   - No per-error pricing
   - Predictable costs

2. **Full-Stack Observability**
   - APM + errors + infrastructure in one tool
   - Don't need multiple tools
   - See full picture (frontend + backend + database)

3. **Performance Monitoring Included**
   - Core Web Vitals tracking (critical for SEO)
   - Slow query detection
   - API performance metrics
   - Synthetic monitoring

4. **Better for Multi-Site Management**
   - One dashboard for all sites
   - Cross-site comparisons
   - No per-project limits

5. **AI-Powered Insights**
   - Proactive anomaly detection
   - Automatic pattern recognition
   - Predictive alerts

6. **Infrastructure Monitoring**
   - Vercel function performance
   - Database queries (when we add DB)
   - Third-party API tracking

---

## ✅ Sentry Advantages

1. **Superior Error Tracking**
   - Better error grouping
   - More detailed stack traces
   - Excellent source maps support

2. **Developer-Focused**
   - Built for developers
   - Better UI for debugging
   - Issue assignment workflow

3. **Better Next.js Integration**
   - Official @sentry/nextjs package
   - One-command setup wizard
   - Automatic instrumentation

4. **Session Replay**
   - See exactly what user did before error
   - Visual debugging
   - (NewRelic also has this, but Sentry's is better)

5. **Release Tracking**
   - Track errors by deployment
   - Compare releases
   - (NewRelic has this too)

---

## ❌ NewRelic Disadvantages

1. **Steeper Learning Curve**
   - More complex UI (powerful but overwhelming)
   - Requires more configuration

2. **Overkill for Error-Only Tracking**
   - If you only want errors, Sentry is simpler

3. **Agent Installation Required**
   - Need to install NewRelic agent
   - More setup than Sentry wizard

---

## ❌ Sentry Disadvantages

1. **Expensive at Scale**
   - $80-160/month for 50 sites
   - Per-event pricing = unpredictable costs
   - Can spike if site has issues

2. **Limited Free Tier**
   - 5,000 errors/month = ~100 per site
   - Will exceed in first week with 50 sites

3. **No APM**
   - Performance monitoring costs extra
   - No infrastructure monitoring
   - Need additional tools for full observability

4. **Short Retention**
   - Free: 7 days
   - Paid: 30-90 days
   - NewRelic: 8 days (free) to indefinite (paid)

---

## 🎯 Recommendation for Your Platform

### Choose NewRelic If:

✅ You're scaling to 50+ sites (your plan)
✅ You need performance monitoring (Core Web Vitals for SEO)
✅ You want to keep costs at $0/month
✅ You want full-stack observability
✅ You want one tool for everything
✅ You're comfortable with more complex setup

### Choose Sentry If:

✅ You have < 10 sites
✅ You only care about error tracking
✅ You want the easiest setup (wizard)
✅ You're willing to pay $80-160/month
✅ You don't need APM/infrastructure monitoring
✅ You want the best error debugging experience

---

## 🚀 Recommended Approach

### Phase 1: Start with NewRelic (Now - Month 6)

**Why:**

- Free tier covers 2-50 sites
- Learn full-stack observability
- No financial risk
- Get APM + errors + infrastructure

**Setup:**

```bash
# Install NewRelic Next.js agent
npm install @newrelic/next

# Configure in next.config.js
# Add instrumentation
# Deploy
```

### Phase 2: Evaluate at Scale (Month 6)

**When you have 20-30 sites running:**

- Review NewRelic data usage
- Assess if still within 100 GB limit
- Evaluate error tracking quality
- Compare with Sentry trial if needed

### Phase 3: Optimize (Month 12)

**Options:**

1. **Stay with NewRelic** - If data < 100 GB and happy
2. **Add Sentry for errors only** - Use NewRelic for APM, Sentry for errors
3. **Upgrade NewRelic** - If need more data ($99/month for 5 users)

---

## 📊 Real-World Usage Estimates

### Typical Small Business Site

**Monthly Metrics:**

- Page views: 5,000 - 10,000
- Errors: 50 - 200 (well-built site)
- API calls: 10,000 - 20,000

**NewRelic Data Usage:**

- ~50 MB per 10,000 requests
- 1 site = ~50-100 MB/month
- 50 sites = 2.5 - 5 GB/month
- **Within free 100 GB limit** ✅

**Sentry Event Usage:**

- 50-200 errors/site/month
- 50 sites = 2,500 - 10,000 errors/month
- **Exceeds free 5,000 limit** ❌

---

## 🔗 Next Steps

### 1. Implement NewRelic (Recommended)

**Action Items:**

- [ ] Create NewRelic free account
- [ ] Install @newrelic/next in colossus-reference
- [ ] Configure instrumentation
- [ ] Test error tracking
- [ ] Test APM metrics
- [ ] Deploy and monitor for 1 week
- [ ] Expand to client sites if satisfied

**Timeline:** 2-3 hours setup + 1 week evaluation

### 2. Create NewRelic Setup Guide

Similar to Sentry guide, create:

- `docs/NEWRELIC_SETUP_GUIDE.md`
- Installation instructions
- Configuration examples
- Dashboard setup
- Alert configuration

### 3. Compare Both (Optional)

**Try both simultaneously:**

- NewRelic in colossus-reference
- Sentry in joes-plumbing-canterbury
- Compare for 1 week
- Make final decision

---

## 📚 Additional Resources

**NewRelic:**

- [NewRelic Next.js Docs](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/getting-started/introduction-new-relic-nodejs/)
- [Free Tier Details](https://newrelic.com/pricing/free-tier)
- [Next.js Integration](https://github.com/newrelic/newrelic-node-nextjs)

**Sentry:**

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Pricing](https://sentry.io/pricing/)
- Already have: `docs/SENTRY_SETUP_GUIDE.md`

**Alternatives to Consider:**

- **Vercel Analytics** - Built-in, focuses on Core Web Vitals ($10-150/month)
- **LogRocket** - Session replay + errors ($99-149/month)
- **Datadog** - Enterprise observability (expensive, $15-31/host/month)

---

## 📈 Cost Projection (3 Years)

### NewRelic Costs

| Year | Sites | Est. Data Usage | Cost/Month |
| ---- | ----- | --------------- | ---------- |
| 1    | 10    | 500 MB          | $0         |
| 2    | 30    | 1.5 GB          | $0         |
| 3    | 50    | 2.5 GB          | $0         |

**Total 3-Year Cost: $0**

### Sentry Costs

| Year | Sites | Est. Errors/Month | Plan Required | Cost/Month |
| ---- | ----- | ----------------- | ------------- | ---------- |
| 1    | 10    | 10,000            | Team          | $26        |
| 2    | 30    | 30,000            | Team          | $26        |
| 3    | 50    | 50,000            | Business      | $80        |

**Total 3-Year Cost: $1,560**

**Savings with NewRelic: $1,560 over 3 years**

---

## ✅ Final Recommendation

**Implement NewRelic Free Tier**

**Reasoning:**

1. **Cost:** $0 vs $80-160/month ($960-1,920/year savings)
2. **Scale:** Supports 50+ sites within free tier
3. **Features:** APM + errors + infrastructure in one tool
4. **Future-proof:** Can grow to 1,000+ sites before paying

**Action:** Create NewRelic account and implement in Week 4 Day 5

---

**Status:** Ready for Implementation
**Recommended Tool:** NewRelic Free Tier
**Estimated Setup Time:** 2-3 hours
**First Site to Implement:** colossus-reference
