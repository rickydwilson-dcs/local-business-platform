# How to Set Up Monitoring

**Estimated Time:** 20-30 minutes
**Prerequisites:** NewRelic account, Vercel project access
**Difficulty:** Intermediate

---

## Overview

This guide walks you through setting up NewRelic APM monitoring for sites in the Local Business Platform. NewRelic provides application performance monitoring, error tracking, and alerting - all at $0/month for 50+ sites using the free tier.

## Prerequisites

- NewRelic account (free tier available)
- Vercel project access
- Site deployed and running

## NewRelic Setup

### Step 1: Create NewRelic Account

1. Go to [newrelic.com](https://newrelic.com)
2. Sign up for free account
3. Select "APM & Services" during onboarding

### Step 2: Get License Key

1. Go to NewRelic Dashboard
2. Click your account name → "API Keys"
3. Copy your "License key (INGEST - LICENSE)"

### Step 3: Install NewRelic Package

```bash
cd sites/[site-name]
pnpm add newrelic @newrelic/next
```

### Step 4: Create NewRelic Configuration

Create `sites/[site-name]/newrelic.js`:

```javascript
"use strict";

exports.config = {
  app_name: ["[Site Name] - Production"],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: "info",
    enabled: process.env.NODE_ENV === "production",
  },
  distributed_tracing: {
    enabled: true,
  },
  transaction_tracer: {
    enabled: true,
    record_sql: "obfuscated",
  },
  error_collector: {
    enabled: true,
    ignore_status_codes: [404],
  },
  browser_monitoring: {
    enable: true,
  },
  application_logging: {
    forwarding: {
      enabled: true,
    },
  },
};
```

### Step 5: Update Next.js Configuration

Modify `sites/[site-name]/next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    instrumentationHook: process.env.NODE_ENV === "production",
  },
  // ... other config
};

export default nextConfig;
```

### Step 6: Create Instrumentation File

Create `sites/[site-name]/instrumentation.ts`:

```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NODE_ENV === "production") {
    const newrelic = await import("newrelic");
    // NewRelic is now active
    console.log("NewRelic APM initialized");
  }
}
```

### Step 7: Set Environment Variables

In Vercel project settings, add:

```bash
NEW_RELIC_LICENSE_KEY=your-license-key-here
NEW_RELIC_APP_NAME=[Site Name] - Production
```

### Step 8: Deploy and Verify

```bash
# Push changes
git add .
git commit -m "feat(monitoring): add NewRelic APM"
git push origin develop

# After deployment, check NewRelic dashboard
# Data should appear within 5 minutes
```

## NewRelic Dashboard

### Key Metrics to Monitor

| Metric        | Target  | Alert Threshold |
| ------------- | ------- | --------------- |
| Response Time | < 500ms | > 2s            |
| Error Rate    | < 1%    | > 5%            |
| Throughput    | Varies  | Sudden drop     |
| Apdex Score   | > 0.9   | < 0.7           |

### Setting Up Alerts

1. Go to NewRelic → Alerts & AI
2. Create new alert policy
3. Add conditions:
   - Response time > 2 seconds
   - Error rate > 5%
   - Apdex score < 0.7

### Creating Dashboards

1. Go to NewRelic → Dashboards
2. Create new dashboard
3. Add widgets:
   - Transaction time chart
   - Error rate chart
   - Throughput chart
   - Top slow transactions

## Browser Monitoring (Optional)

### Enable Browser Monitoring

1. In NewRelic, go to Browser → Add data
2. Select "Copy/Paste" method
3. Copy the JavaScript snippet

### Add to Layout

Create `sites/[site-name]/components/NewRelicBrowser.tsx`:

```tsx
"use client";

import Script from "next/script";

export function NewRelicBrowser() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      id="newrelic-browser"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          // NewRelic browser snippet here
        `,
      }}
    />
  );
}
```

Add to `app/layout.tsx`:

```tsx
import { NewRelicBrowser } from "@/components/NewRelicBrowser";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <NewRelicBrowser />
      </body>
    </html>
  );
}
```

## Multi-Site Monitoring

### Naming Convention

Use consistent app names for easy filtering:

```
[Business Name] - [Environment]

Examples:
- Colossus Scaffolding - Production
- Joe's Plumbing Canterbury - Production
- Joe's Plumbing Canterbury - Staging
```

### Dashboard for All Sites

Create a dashboard with queries like:

```sql
-- Response time across all sites
SELECT average(duration) FROM Transaction
WHERE appName LIKE '%Production%'
FACET appName
TIMESERIES

-- Error rate by site
SELECT percentage(count(*), WHERE error IS true) FROM Transaction
WHERE appName LIKE '%Production%'
FACET appName
```

## Cost Optimization

### Free Tier Limits

NewRelic free tier includes:

- 100 GB data ingest/month
- 1 user
- Full APM features

### Reducing Data Usage

```javascript
// newrelic.js - sampling for high-traffic sites
exports.config = {
  // ... other config
  transaction_events: {
    max_samples_per_minute: 1000, // Limit events
  },
  custom_insights_events: {
    max_samples_stored: 10000,
  },
};
```

## Verification

After setup, verify:

- [ ] NewRelic package installed
- [ ] Configuration file created
- [ ] Environment variables set in Vercel
- [ ] Site deployed with changes
- [ ] Data appearing in NewRelic dashboard
- [ ] Alerts configured
- [ ] Browser monitoring active (if enabled)

## Troubleshooting

### No data in NewRelic

1. Verify `NODE_ENV=production` in Vercel
2. Check license key is correct
3. Ensure instrumentation file exists
4. Check Vercel function logs for errors

### High data usage

1. Review sampling configuration
2. Disable browser monitoring if not needed
3. Increase `max_samples_per_minute`

### Performance impact

NewRelic overhead is typically < 5ms per request. If you notice impact:

1. Disable distributed tracing for simple sites
2. Reduce logging level
3. Disable browser monitoring

## Related

- [Deployment Standards](../standards/deployment.md) - Monitoring requirements
- [Quality Standards](../standards/quality.md) - Performance targets
- [Deploying a Site](./deploying-site.md) - Deployment procedures

---

**Last Updated:** 2025-12-05
