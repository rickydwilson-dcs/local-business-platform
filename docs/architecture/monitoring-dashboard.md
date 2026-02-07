# Monitoring Dashboard Design Document

**Version:** 1.0.0
**Last Updated:** 2026-01-27
**Status:** Design Phase
**Sprint:** Week 7 - Site Registry & Monitoring

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Dashboard Overview](#dashboard-overview)
3. [Page Structure](#page-structure)
4. [Component Architecture](#component-architecture)
5. [Data Architecture](#data-architecture)
6. [Technical Stack](#technical-stack)
7. [Wireframes](#wireframes)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Future Enhancements](#future-enhancements)

---

## Executive Summary

### Purpose

The Monitoring Dashboard provides a centralized interface for platform operators to monitor the health and performance of 50+ local business websites managed by the Local Business Platform. It aggregates data from the Supabase site registry, enabling real-time visibility into build status, deployment health, error rates, and performance metrics.

### Target Users

| User Role              | Primary Needs                                                           |
| ---------------------- | ----------------------------------------------------------------------- |
| **Platform Operators** | At-a-glance health status, alert management, quick issue identification |
| **Developers**         | Build/deployment details, error logs, performance debugging             |
| **Account Managers**   | Client site status, content metrics, SLA compliance                     |

### Key Metrics

- **Build Status:** Success/failure rates, average build times
- **Deployment Health:** Active deployments, rollback frequency
- **Error Rates:** 4xx/5xx errors, API failures
- **Performance:** Response times, Apdex scores, throughput
- **Content:** Generation costs, quality scores

---

## Dashboard Overview

### Design Principles

1. **Glanceable:** Critical information visible without scrolling
2. **Actionable:** Direct links to resolve issues
3. **Hierarchical:** Overview first, drill-down for details
4. **Real-time:** Alerts surface immediately
5. **Responsive:** Works on desktop and tablet

### Status Indicators

```
+------------------+
|  STATUS SYSTEM   |
+------------------+

Healthy (Green)
- All checks passing
- Error rate < 1%
- Response time < 300ms
- No active alerts

Warning (Yellow)
- Minor issues detected
- Error rate 1-5%
- Response time 300-500ms
- Non-critical alerts

Critical (Red)
- Build/deploy failures
- Error rate > 5%
- Response time > 500ms
- Critical alerts active

Unknown (Gray)
- No recent data
- Site paused/archived
- Metrics unavailable
```

---

## Page Structure

### 1. Dashboard Home (`/dashboard`)

Primary view showing all sites with health indicators.

**Sections:**

| Section         | Description                                       | Update Frequency |
| --------------- | ------------------------------------------------- | ---------------- |
| Alert Banner    | Critical alerts requiring immediate attention     | Real-time        |
| Health Summary  | Aggregate stats: X healthy, Y warning, Z critical | 1 minute         |
| Site Grid       | Cards for each site with status indicators        | 5 minutes        |
| Recent Activity | Timeline of deployments, builds, alerts           | Real-time        |

### 2. Site Detail (`/dashboard/sites/[slug]`)

Deep dive into a single site's health and history.

**Tabs:**

| Tab             | Content                                           |
| --------------- | ------------------------------------------------- |
| **Overview**    | Current status, key metrics, recent activity      |
| **Deployments** | Deployment history with status, URLs, build times |
| **Builds**      | CI/CD history with check results                  |
| **Metrics**     | Performance charts (7/30/90 days)                 |
| **Alerts**      | Alert history with resolution status              |
| **Content**     | AI generation logs and costs                      |

### 3. Alerts Center (`/dashboard/alerts`)

Centralized alert management.

**Features:**

- Filter by severity (critical, warning, info)
- Filter by type (build, deploy, performance, error_rate)
- Filter by status (active, acknowledged, resolved)
- Bulk actions (acknowledge, resolve)
- Alert timeline with details

### 4. Metrics Analysis (`/dashboard/metrics`)

Cross-site performance analysis and trends.

**Views:**

| View                        | Purpose                              |
| --------------------------- | ------------------------------------ |
| **Performance Leaderboard** | Sites ranked by Apdex, response time |
| **Error Hotspots**          | Sites with highest error rates       |
| **Build Health**            | Build success rates across sites     |
| **Cost Analysis**           | AI content generation costs          |

---

## Component Architecture

### Component Hierarchy

```
Dashboard (Layout)
+-- Header
|   +-- Logo
|   +-- Navigation
|   +-- AlertBadge
|   +-- UserMenu
|
+-- Sidebar (collapsible)
|   +-- NavItem (Dashboard)
|   +-- NavItem (Sites)
|   +-- NavItem (Alerts)
|   +-- NavItem (Metrics)
|   +-- NavItem (Settings)
|
+-- Main Content
    +-- Page Components (varies by route)
```

### Key Components

#### 1. SiteStatusCard

Displays site health at a glance in the grid view.

```typescript
interface SiteStatusCardProps {
  site: Site;
  latestDeployment?: Deployment;
  activeAlertCount: number;
  metrics?: {
    responseTime: number;
    errorRate: number;
    apdexScore: number;
  };
}

// Visual States:
// - Green border/badge: Healthy
// - Yellow border/badge: Warning
// - Red border/badge: Critical
// - Gray border/badge: Unknown/Paused
```

**ASCII Wireframe:**

```
+------------------------------------------+
| [STATUS DOT] Site Name          [STATUS] |
| example.com                              |
|------------------------------------------|
| Services: 25  |  Locations: 37           |
| Response: 234ms  |  Errors: 0.3%         |
|------------------------------------------|
| Last Deploy: 2 hours ago  [View Details] |
+------------------------------------------+
```

#### 2. MetricsChart

Line/bar charts for visualizing performance trends.

```typescript
interface MetricsChartProps {
  data: Metrics[];
  metric: "response_time" | "error_rate" | "throughput" | "apdex";
  period: "7d" | "30d" | "90d";
  chartType: "line" | "bar" | "area";
}
```

**Supported Charts:**

| Chart              | Use Case                   |
| ------------------ | -------------------------- |
| Response Time Line | Track latency trends       |
| Error Rate Area    | Identify error spikes      |
| Throughput Bar     | Compare daily traffic      |
| Apdex Gauge        | Current satisfaction score |

#### 3. AlertList

Filterable list of alerts with severity badges.

```typescript
interface AlertListProps {
  alerts: Alert[];
  filters?: {
    severity?: AlertSeverity[];
    type?: AlertType[];
    status?: AlertStatus[];
  };
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string) => void;
}
```

**ASCII Wireframe:**

```
+--------------------------------------------------+
| [FILTER: Severity v] [FILTER: Type v] [FILTER: Status v] |
|--------------------------------------------------|
| [!] CRITICAL | build_failure | colossus-ref      |
|     Build failed: TypeScript errors              |
|     2 minutes ago  [Acknowledge] [Resolve]       |
|--------------------------------------------------|
| [!] WARNING | high_error_rate | joes-plumbing    |
|     Error rate exceeded 2% threshold             |
|     15 minutes ago  [Acknowledge] [Resolve]      |
+--------------------------------------------------+
```

#### 4. DeploymentTimeline

Visual timeline of recent deployments.

```typescript
interface DeploymentTimelineProps {
  deployments: Deployment[];
  limit?: number;
  showSiteName?: boolean;
}
```

**ASCII Wireframe:**

```
+--------------------------------------------------+
|  RECENT DEPLOYMENTS                              |
|--------------------------------------------------|
|  [CHECK] main - colossus-reference               |
|  |      Ready in 15.3s - 2 hours ago             |
|  |      dpl_abc123 -> example.com                |
|  |                                               |
|  [X] develop - joes-plumbing                     |
|  |      Error after 3.2s - 4 hours ago           |
|  |      TypeScript compilation failed            |
|  |                                               |
|  [CHECK] main - elite-electrical                 |
|         Ready in 12.1s - 6 hours ago             |
+--------------------------------------------------+
```

#### 5. BuildHistory

CI/CD build results with check details.

```typescript
interface BuildHistoryProps {
  builds: Build[];
  limit?: number;
  showChecks?: boolean;
}
```

**Check Status Display:**

```
+----------------------------------+
| Build #1234 - main               |
| Status: SUCCESS                  |
|----------------------------------|
| [CHECK] ESLint      PASSED       |
| [CHECK] TypeScript  PASSED       |
| [CHECK] Unit Tests  PASSED (141) |
| [CHECK] Build       PASSED       |
+----------------------------------+
```

---

## Data Architecture

### Data Sources

```
+-------------------+     +------------------+
|   Supabase        |     |   External APIs  |
|   Registry DB     |     |                  |
+-------------------+     +------------------+
| - sites           |     | - Vercel API     |
| - deployments     |     | - NewRelic API   |
| - builds          |     | - GitHub API     |
| - metrics         |     +------------------+
| - alerts          |             |
| - content_gen     |             |
+-------------------+             |
        |                         |
        v                         v
+----------------------------------------+
|        Dashboard Application           |
|----------------------------------------|
|  React Query Cache                     |
|  - 5 min stale time for metrics        |
|  - 1 min stale time for sites          |
|  - Real-time for alerts                |
+----------------------------------------+
```

### Database Queries

#### Dashboard Home - Site Overview

```sql
-- Get all sites with latest metrics
SELECT
  s.*,
  m.response_time_avg_ms,
  m.error_rate_percent,
  m.apdex_score,
  (SELECT COUNT(*) FROM alerts a
   WHERE a.site_id = s.id AND a.status = 'active') as active_alert_count,
  (SELECT d.created_at FROM deployments d
   WHERE d.site_id = s.id
   ORDER BY d.created_at DESC LIMIT 1) as last_deployment
FROM sites s
LEFT JOIN metrics m ON m.site_id = s.id AND m.date = CURRENT_DATE
WHERE s.status = 'active'
ORDER BY s.name;
```

#### Alert Summary

```sql
-- Get alert counts by severity
SELECT
  severity,
  COUNT(*) as count
FROM alerts
WHERE status = 'active'
GROUP BY severity;
```

#### Recent Deployments

```sql
-- Get recent deployments across all sites
SELECT
  d.*,
  s.name as site_name,
  s.slug as site_slug
FROM deployments d
JOIN sites s ON s.id = d.site_id
ORDER BY d.created_at DESC
LIMIT 20;
```

### Real-time Subscriptions

```typescript
// Subscribe to new alerts
supabase
  .channel("alerts")
  .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts" }, (payload) =>
    handleNewAlert(payload.new)
  )
  .subscribe();

// Subscribe to deployment status changes
supabase
  .channel("deployments")
  .on("postgres_changes", { event: "*", schema: "public", table: "deployments" }, (payload) =>
    handleDeploymentChange(payload)
  )
  .subscribe();
```

### Polling Intervals

| Data Type         | Interval  | Rationale                       |
| ----------------- | --------- | ------------------------------- |
| Active Alerts     | Real-time | Immediate visibility required   |
| Deployment Status | Real-time | Track in-progress builds        |
| Site List         | 1 minute  | Balance freshness vs. load      |
| Metrics           | 5 minutes | Daily aggregates, less urgent   |
| Build History     | 5 minutes | Historical data, rarely changes |

---

## Technical Stack

### Recommended Architecture

```
apps/
+-- dashboard/                    # Next.js dashboard app
    +-- app/
    |   +-- layout.tsx           # Root layout with providers
    |   +-- page.tsx             # Dashboard home
    |   +-- sites/
    |   |   +-- page.tsx         # Sites list
    |   |   +-- [slug]/
    |   |       +-- page.tsx     # Site detail
    |   +-- alerts/
    |   |   +-- page.tsx         # Alerts center
    |   +-- metrics/
    |       +-- page.tsx         # Metrics analysis
    +-- components/
    |   +-- ui/                  # shadcn/ui components
    |   +-- dashboard/           # Dashboard-specific components
    |   |   +-- SiteStatusCard.tsx
    |   |   +-- MetricsChart.tsx
    |   |   +-- AlertList.tsx
    |   |   +-- DeploymentTimeline.tsx
    |   |   +-- BuildHistory.tsx
    |   +-- layout/
    |       +-- Header.tsx
    |       +-- Sidebar.tsx
    +-- lib/
    |   +-- supabase.ts          # Supabase client
    |   +-- queries.ts           # React Query hooks
    +-- package.json
    +-- tailwind.config.ts
```

### Technology Choices

| Category          | Technology                   | Rationale                                       |
| ----------------- | ---------------------------- | ----------------------------------------------- |
| **Framework**     | Next.js 14+ (App Router)     | Consistent with existing sites, RSC support     |
| **Styling**       | Tailwind CSS + shadcn/ui     | Consistent with platform, rapid development     |
| **Data Fetching** | React Query (TanStack Query) | Caching, background refresh, optimistic updates |
| **Charts**        | Recharts                     | React-native, customizable, well-documented     |
| **Database**      | Supabase JS Client           | Direct access to registry, real-time support    |
| **Auth**          | Supabase Auth                | Integrated with database, RLS support           |
| **Deployment**    | Vercel                       | Consistent with platform sites                  |

### Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "@tanstack/react-query": "^5.17.0",
    "recharts": "^2.10.0",
    "date-fns": "^3.0.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-slot": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0"
  }
}
```

---

## Wireframes

### Dashboard Home - Desktop

```
+------------------------------------------------------------------+
|  [LOGO] Platform Monitor    [ALERTS: 2]  [SETTINGS]  [USER]      |
+------------------------------------------------------------------+
|         |                                                         |
| [D] Dash|  CRITICAL ALERT: colossus-reference build failed        |
| [S] Sites|  TypeScript errors detected - 5 minutes ago [VIEW]     |
| [!] Alerts|                                                       |
| [M] Metrics|----------------------------------------------------- |
|         |                                                         |
|         |  PLATFORM HEALTH                                        |
|         |  +----------+ +----------+ +----------+ +----------+    |
|         |  | 48       | | 2        | | 1        | | 1        |    |
|         |  | Healthy  | | Warning  | | Critical | | Paused   |    |
|         |  +----------+ +----------+ +----------+ +----------+    |
|         |                                                         |
|         |  SITES                                    [Search...]   |
|         |  +--------------------+ +--------------------+          |
|         |  | [G] Colossus Scaff | [Y] Joe's Plumbing  |          |
|         |  | example.com        | joes-plumb.com      |          |
|         |  | 234ms | 0.3%       | 456ms | 2.1%        |          |
|         |  | 2h ago [View]      | 4h ago [View]       |          |
|         |  +--------------------+ +--------------------+          |
|         |  +--------------------+ +--------------------+          |
|         |  | [G] Elite Electric | [R] ABC Roofing     |          |
|         |  | elite-elec.com     | abc-roof.com        |          |
|         |  | 198ms | 0.1%       | BUILD FAILED        |          |
|         |  | 6h ago [View]      | 5m ago [View]       |          |
|         |  +--------------------+ +--------------------+          |
|         |                                                         |
|         |  RECENT ACTIVITY                                        |
|         |  | [CHECK] Deploy ready - colossus-reference - 2h     | |
|         |  | [X] Build failed - abc-roofing - 5m                | |
|         |  | [CHECK] Deploy ready - elite-electrical - 6h       | |
|         |  | [!] Alert: high_error_rate - joes-plumbing - 15m   | |
+------------------------------------------------------------------+
```

### Site Detail Page

```
+------------------------------------------------------------------+
|  [LOGO] Platform Monitor    [ALERTS: 2]  [SETTINGS]  [USER]      |
+------------------------------------------------------------------+
|         |                                                         |
| < Back  |  COLOSSUS SCAFFOLDING                                   |
|         |  www.colossus-scaffolding.co.uk                         |
| [D] Dash|  Status: [HEALTHY]  Industry: Construction              |
| [S] Sites|                                                        |
| [!] Alerts| [Overview] [Deployments] [Builds] [Metrics] [Alerts] |
| [M] Metrics|-----------------------------------------------------|
|         |                                                         |
|         |  KEY METRICS (Last 7 Days)                              |
|         |  +------------+ +------------+ +------------+           |
|         |  | 234ms      | | 0.3%       | | 0.92       |           |
|         |  | Avg Resp   | | Error Rate | | Apdex      |           |
|         |  +------------+ +------------+ +------------+           |
|         |                                                         |
|         |  CONTENT STATISTICS                                     |
|         |  +--------+ +--------+ +--------+ +--------+            |
|         |  | 25     | | 37     | | 7      | | 2      |            |
|         |  |Services| |Location| |Blog    | |Project |            |
|         |  +--------+ +--------+ +--------+ +--------+            |
|         |                                                         |
|         |  RECENT DEPLOYMENTS                                     |
|         |  +----------------------------------------------+       |
|         |  | [CHECK] main - Ready - 15.3s - 2h ago        |       |
|         |  | [CHECK] main - Ready - 14.8s - 26h ago       |       |
|         |  | [X] develop - Error - 3.2s - 50h ago         |       |
|         |  +----------------------------------------------+       |
|         |                                                         |
|         |  PERFORMANCE TREND (7 Days)                             |
|         |  +----------------------------------------------+       |
|         |  |    *                                         |       |
|         |  |  *   *  *                                    |       |
|         |  | *       * *  *  *                            |       |
|         |  +----------------------------------------------+       |
|         |    Mon Tue Wed Thu Fri Sat Sun                          |
+------------------------------------------------------------------+
```

### Alerts Center

```
+------------------------------------------------------------------+
|  [LOGO] Platform Monitor    [ALERTS: 2]  [SETTINGS]  [USER]      |
+------------------------------------------------------------------+
|         |                                                         |
| [D] Dash|  ALERTS CENTER                                          |
| [S] Sites|                                                        |
| [!] Alerts| [Severity: All v] [Type: All v] [Status: Active v]   |
| [M] Metrics|                                                      |
|         |  ACTIVE ALERTS (3)                [Bulk Acknowledge]    |
|         |  +----------------------------------------------+       |
|         |  | [!!!] CRITICAL | build_failure                |       |
|         |  | abc-roofing                                   |       |
|         |  | Build failed: TypeScript errors               |       |
|         |  | 5 minutes ago                                 |       |
|         |  | [Acknowledge] [Resolve] [View Site]           |       |
|         |  +----------------------------------------------+       |
|         |  | [!!] WARNING | high_error_rate                |       |
|         |  | joes-plumbing                                 |       |
|         |  | Error rate exceeded 2% threshold              |       |
|         |  | 15 minutes ago                                |       |
|         |  | [Acknowledge] [Resolve] [View Site]           |       |
|         |  +----------------------------------------------+       |
|         |  | [!] INFO | performance_degradation            |       |
|         |  | elite-electrical                              |       |
|         |  | Response time increased by 20%                |       |
|         |  | 1 hour ago                                    |       |
|         |  | [Acknowledge] [Resolve] [View Site]           |       |
|         |  +----------------------------------------------+       |
|         |                                                         |
|         |  RESOLVED TODAY (12)                   [Show All]       |
|         |  +----------------------------------------------+       |
|         |  | [CHECK] deploy_failure - colossus-ref - 2h   |       |
|         |  | [CHECK] build_failure - joes-plumb - 4h      |       |
|         |  +----------------------------------------------+       |
+------------------------------------------------------------------+
```

### Metrics Analysis

```
+------------------------------------------------------------------+
|  [LOGO] Platform Monitor    [ALERTS: 2]  [SETTINGS]  [USER]      |
+------------------------------------------------------------------+
|         |                                                         |
| [D] Dash|  METRICS ANALYSIS                                       |
| [S] Sites|                                                        |
| [!] Alerts| Period: [7 Days v]                                    |
| [M] Metrics|                                                      |
|         |  PERFORMANCE LEADERBOARD                                |
|         |  +----------------------------------------------+       |
|         |  | Rank | Site              | Apdex | Resp Time |       |
|         |  +------+-------------------+-------+-----------+       |
|         |  | 1    | elite-electrical  | 0.98  | 145ms     |       |
|         |  | 2    | colossus-ref      | 0.92  | 234ms     |       |
|         |  | 3    | abc-roofing       | 0.89  | 287ms     |       |
|         |  | ...  | ...               | ...   | ...       |       |
|         |  +----------------------------------------------+       |
|         |                                                         |
|         |  ERROR HOTSPOTS                                         |
|         |  +----------------------------------------------+       |
|         |  | Site              | Error Rate | Trend       |       |
|         |  +-------------------+------------+-------------+       |
|         |  | joes-plumbing     | 2.1%       | [UP ARROW]  |       |
|         |  | new-client-site   | 1.8%       | [DOWN]      |       |
|         |  +----------------------------------------------+       |
|         |                                                         |
|         |  BUILD SUCCESS RATE                                     |
|         |  +----------------------------------------------+       |
|         |  |  Overall: 94.2%                              |       |
|         |  |  =========================================   |       |
|         |  |  [||||||||||||||||||||||||||||||||    ]      |       |
|         |  |  Passed: 147  |  Failed: 9                   |       |
|         |  +----------------------------------------------+       |
+------------------------------------------------------------------+
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)

**Goal:** Basic dashboard with site listing and status indicators

| Task                                      | Effort | Priority |
| ----------------------------------------- | ------ | -------- |
| Create Next.js app in `apps/dashboard/`   | 2h     | P0       |
| Set up Tailwind CSS + shadcn/ui           | 1h     | P0       |
| Configure Supabase client                 | 1h     | P0       |
| Build `SiteStatusCard` component          | 3h     | P0       |
| Create dashboard home page with site grid | 4h     | P0       |
| Add basic navigation (sidebar/header)     | 2h     | P0       |

**Deliverable:** Dashboard showing all sites with health status

### Phase 2: Site Details (Week 2)

**Goal:** Individual site detail pages with metrics

| Task                                         | Effort | Priority |
| -------------------------------------------- | ------ | -------- |
| Create site detail page route                | 2h     | P0       |
| Build `DeploymentTimeline` component         | 3h     | P0       |
| Build `BuildHistory` component               | 3h     | P0       |
| Build `MetricsChart` component with Recharts | 4h     | P0       |
| Integrate React Query for data fetching      | 3h     | P0       |
| Add site overview stats (content counts)     | 2h     | P1       |

**Deliverable:** Complete site detail view with deployments, builds, metrics

### Phase 3: Alerts System (Week 3)

**Goal:** Real-time alerts with management capabilities

| Task                                   | Effort | Priority |
| -------------------------------------- | ------ | -------- |
| Build `AlertList` component            | 3h     | P0       |
| Create alerts center page              | 3h     | P0       |
| Add Supabase real-time subscriptions   | 3h     | P0       |
| Implement acknowledge/resolve actions  | 2h     | P0       |
| Add alert badge to header              | 1h     | P0       |
| Build alert banner for critical alerts | 2h     | P1       |

**Deliverable:** Functional alerts system with real-time updates

### Phase 4: Metrics Analysis (Week 4)

**Goal:** Cross-site performance analysis

| Task                               | Effort | Priority |
| ---------------------------------- | ------ | -------- |
| Create metrics analysis page       | 3h     | P0       |
| Build performance leaderboard      | 3h     | P0       |
| Build error hotspots view          | 2h     | P0       |
| Build build success rate chart     | 2h     | P1       |
| Add period selector (7/30/90 days) | 2h     | P1       |
| Add export functionality (CSV)     | 3h     | P2       |

**Deliverable:** Complete metrics analysis with trends and comparisons

### Phase 5: Polish & Production (Week 5)

**Goal:** Production-ready dashboard

| Task                                          | Effort | Priority |
| --------------------------------------------- | ------ | -------- |
| Add authentication (Supabase Auth)            | 4h     | P0       |
| Implement RLS policies for dashboard          | 2h     | P0       |
| Add loading states and skeletons              | 2h     | P0       |
| Add error boundaries                          | 2h     | P0       |
| Performance optimization (memo, lazy loading) | 3h     | P1       |
| Mobile responsiveness                         | 4h     | P1       |
| Write documentation                           | 3h     | P1       |
| Deploy to Vercel                              | 2h     | P0       |

**Deliverable:** Production-deployed dashboard with authentication

---

## Future Enhancements

### Phase 2 Features (Post-MVP)

| Feature                 | Description                   | Value                |
| ----------------------- | ----------------------------- | -------------------- |
| **Email Notifications** | Send alerts via email/Slack   | Proactive monitoring |
| **User Management**     | Role-based access control     | Multi-team support   |
| **Custom Dashboards**   | User-configurable widgets     | Personalization      |
| **SLA Tracking**        | Uptime and response time SLAs | Client reporting     |
| **Cost Analytics**      | AI generation cost trends     | Budget management    |

### Phase 3 Features (Future)

| Feature                    | Description                           | Value                |
| -------------------------- | ------------------------------------- | -------------------- |
| **Predictive Alerts**      | ML-based anomaly detection            | Early warning        |
| **Automated Rollback**     | One-click rollback for failed deploys | Quick recovery       |
| **Competitive Benchmarks** | Compare against industry standards    | Insights             |
| **White-label Dashboard**  | Client-facing version                 | Client self-service  |
| **Mobile App**             | React Native mobile dashboard         | On-the-go monitoring |

### Integration Opportunities

| Integration     | Purpose                         |
| --------------- | ------------------------------- |
| **PagerDuty**   | On-call alerting and escalation |
| **Datadog**     | Advanced APM and logging        |
| **Sentry**      | Error tracking integration      |
| **Linear/Jira** | Create issues from alerts       |
| **Zapier**      | Custom workflow automation      |

---

## Data Flow Diagram

```
+----------------+     +-----------------+     +------------------+
|   GitHub       |     |    Vercel       |     |    NewRelic      |
|   Actions      |     |    API          |     |    API           |
+----------------+     +-----------------+     +------------------+
        |                      |                       |
        v                      v                       v
+---------------------------------------------------------------+
|                      CI/CD Webhooks                            |
|                  (GitHub Actions, Vercel)                      |
+---------------------------------------------------------------+
        |                      |                       |
        v                      v                       v
+---------------------------------------------------------------+
|                    SUPABASE DATABASE                           |
|  +----------+ +----------+ +--------+ +--------+ +----------+  |
|  | sites    | |deployments| |builds | |metrics | | alerts   |  |
|  +----------+ +----------+ +--------+ +--------+ +----------+  |
+---------------------------------------------------------------+
        |                      |
        | REST API             | Real-time Subscriptions
        v                      v
+---------------------------------------------------------------+
|                    DASHBOARD APP                               |
|  +------------------+  +------------------+  +---------------+  |
|  | React Query      |  | Supabase Client |  | WebSocket     |  |
|  | (Cache/Fetch)    |  | (Data Access)   |  | (Real-time)   |  |
|  +------------------+  +------------------+  +---------------+  |
|                              |                                  |
|                              v                                  |
|  +----------------------------------------------------------+  |
|  |                    UI COMPONENTS                          |  |
|  | SiteStatusCard | MetricsChart | AlertList | BuildHistory |  |
|  +----------------------------------------------------------+  |
+---------------------------------------------------------------+
        |
        v
+---------------------------------------------------------------+
|                    USER INTERFACE                              |
|    Dashboard Home | Site Detail | Alerts | Metrics Analysis    |
+---------------------------------------------------------------+
```

---

## Security Considerations

### Authentication

- Supabase Auth with email/password or SSO
- Session management with JWT tokens
- Automatic token refresh

### Authorization

- Row Level Security (RLS) policies
- Role-based access (admin, operator, viewer)
- Audit logging for sensitive actions

### Data Protection

- HTTPS only (enforced by Vercel)
- No sensitive data in client-side storage
- Rate limiting on API routes

---

## Related Documentation

- [architecture.md](./architecture.md) - Platform architecture overview
- [Registry CLI Documentation](../../tools/lib/REGISTRY_CLI.md) - CLI tool reference
- [Supabase Schema](../../tools/supabase-schema.sql) - Database schema
- [Supabase Client](../../tools/lib/supabase-client.ts) - TypeScript client

---

**Maintained By:** Digital Consulting Services
**Last Updated:** 2026-01-27
