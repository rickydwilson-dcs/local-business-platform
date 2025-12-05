# NewRelic Error Monitoring & APM Setup Guide

This guide walks through setting up NewRelic application monitoring for the local business platform monorepo.

---

## 📋 Why NewRelic?

**Chosen over Sentry because:**

- ✅ **100 GB/month free** (vs Sentry's 5,000 errors/month)
- ✅ **$0 cost for 50+ sites** (vs Sentry's $80-160/month)
- ✅ **Full APM included** (performance monitoring)
- ✅ **Core Web Vitals tracking** (critical for SEO)
- ✅ **Infrastructure monitoring** (Vercel functions, APIs)
- ✅ **AI-powered insights** (proactive issue detection)

See [MONITORING_COMPARISON.md](./MONITORING_COMPARISON.md) for detailed comparison.

---

## 📋 Prerequisites

- NewRelic account (free tier, no credit card required)
- Admin access to this repository
- Node.js 20+ and pnpm installed
- Vercel account for deployment

---

## 🚀 Quick Start

### 1. Create NewRelic Account

1. Go to [newrelic.com/signup](https://newrelic.com/signup)
2. Sign up for **Free Forever** tier (no credit card needed)
3. Create an organization (e.g., "Your Business Name")
4. Select "APM" (Application Performance Monitoring)

### 2. Get Your License Key

1. After account creation, navigate to **Account Settings**
2. Click **API Keys** in the left menu
3. Find your **License Key** (starts with a long alphanumeric string)
4. Copy this key - you'll need it for configuration

### 3. Install NewRelic Agent

For each site in your monorepo:

```bash
# Navigate to site directory
cd sites/colossus-reference

# Install NewRelic Node.js agent
pnpm add newrelic

# Or for all sites at once from root
pnpm add -w newrelic
```

**Important:** As of NewRelic Node.js agent v12.0.0+, the `@newrelic/next` package has been merged into the main `newrelic` package. Always use `newrelic`, not `@newrelic/next`.

### 4. Create Configuration File

Create `newrelic.js` in the root of each site directory:

```bash
# In sites/colossus-reference/
touch newrelic.js
```

**newrelic.js content:**

```javascript
"use strict";

/**
 * NewRelic agent configuration.
 *
 * See https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration/
 * for complete documentation of configuration options.
 */
exports.config = {
  /**
   * Application name - appears in NewRelic UI
   */
  app_name: ["colossus-reference"],

  /**
   * License key - get from NewRelic account settings
   * Use environment variable for security
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY,

  /**
   * Logging level
   * Options: 'trace', 'debug', 'info', 'warn', 'error'
   */
  logging: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    filepath: "stdout", // Log to stdout for Vercel
  },

  /**
   * Distributed tracing - track requests across services
   */
  distributed_tracing: {
    enabled: true,
  },

  /**
   * Browser monitoring - track frontend performance
   */
  browser_monitoring: {
    enable: true,
  },

  /**
   * Error collection
   */
  error_collector: {
    enabled: true,
    ignore_status_codes: [404], // Don't report 404s
  },

  /**
   * Transaction tracer - detailed performance data
   */
  transaction_tracer: {
    enabled: true,
    record_sql: "obfuscated", // Security: obfuscate SQL queries
  },

  /**
   * Custom instrumentation for Next.js
   */
  feature_flag: {
    new_promise_tracking: true,
  },

  /**
   * Allow all traffic (required for Vercel)
   */
  allow_all_headers: true,

  /**
   * Custom attributes to add to all transactions
   */
  attributes: {
    include: ["request.headers.*", "request.parameters.*"],
  },
};
```

### 5. Configure Environment Variables

**For local development:**

Create/update `.env.local` in each site:

```bash
# sites/colossus-reference/.env.local
NEW_RELIC_LICENSE_KEY=your_license_key_here
NEW_RELIC_APP_NAME=colossus-reference
NEW_RELIC_LOG=stdout
```

**For Vercel deployment:**

Add environment variables in Vercel dashboard for each project:

1. Go to Vercel Dashboard → Select Project
2. Settings → Environment Variables
3. Add these variables (all environments: Production, Preview, Development):

```
NEW_RELIC_LICENSE_KEY = your_license_key_here
NEW_RELIC_APP_NAME = colossus-reference
NEW_RELIC_LOG = stdout
NEW_RELIC_DISTRIBUTED_TRACING_ENABLED = true
NEW_RELIC_NO_CONFIG_FILE = true
```

**⚠️ CRITICAL:** The `NEW_RELIC_NO_CONFIG_FILE=true` variable is **required** for Vercel deployments. Without it, NewRelic will fail silently and no data will be reported.

### 6. Update package.json Scripts

Modify your `package.json` to load NewRelic agent on startup:

```json
{
  "scripts": {
    "dev": "NODE_OPTIONS='-r newrelic' next dev --turbopack",
    "build": "next build",
    "start": "NODE_OPTIONS='-r newrelic' next start",
    "lint": "next lint"
  }
}
```

**Important:** The `NODE_OPTIONS='-r newrelic'` flag loads the NewRelic agent before Next.js starts.

### 7. Create Instrumentation File (Next.js 15+/16)

For Next.js 15+ with App Router, create `instrumentation.ts` in the site root:

```typescript
// sites/colossus-reference/instrumentation.ts

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Import NewRelic for Node.js runtime only
    await import("newrelic");
  }
}
```

**This file is automatically loaded by Next.js before the application starts.**

### 8. Test Locally

```bash
# Start dev server with NewRelic
cd sites/colossus-reference
pnpm dev

# You should see NewRelic logs in console:
# {"v":0,"level":30,"name":"newrelic","hostname":"...","msg":"Agent started"}
```

Visit your app at `http://localhost:3000` and generate some traffic.

### 9. Verify in NewRelic Dashboard

1. Go to NewRelic dashboard: [one.newrelic.com](https://one.newrelic.com)
2. Click **APM & Services** in top navigation
3. Find your application name (e.g., "colossus-reference")
4. You should see data appearing within 1-2 minutes

---

## 🔧 Configuration for Multiple Sites

### Option 1: Shared Configuration (Recommended)

Create a shared config at workspace root:

```bash
# At repository root
touch newrelic.base.js
```

**newrelic.base.js:**

```javascript
"use strict";

module.exports = {
  config: {
    license_key: process.env.NEW_RELIC_LICENSE_KEY,
    logging: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      filepath: "stdout",
    },
    distributed_tracing: { enabled: true },
    browser_monitoring: { enable: true },
    error_collector: {
      enabled: true,
      ignore_status_codes: [404],
    },
    allow_all_headers: true,
  },
};
```

Then in each site's `newrelic.js`:

```javascript
"use strict";

const baseConfig = require("../../newrelic.base.js");

exports.config = {
  ...baseConfig.config,
  app_name: ["colossus-reference"], // Site-specific name
};
```

### Option 2: Environment-Based (Simpler)

Just use environment variables - no config file needed:

```bash
# In Vercel or .env.local
NEW_RELIC_LICENSE_KEY=your_key
NEW_RELIC_APP_NAME=colossus-reference
NEW_RELIC_LOG=stdout
NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
NEW_RELIC_NO_CONFIG_FILE=true
```

Then NewRelic auto-configures with sensible defaults.

---

## 📊 Monitoring Features

### 1. Application Performance Monitoring (APM)

**What You Get:**

- Request/response times
- Throughput (requests per minute)
- Error rate
- Apdex score (user satisfaction)
- Slow transaction detection
- Database query performance

**View in Dashboard:**

1. APM & Services → Your App
2. **Summary** - Overview of health
3. **Transactions** - Slowest endpoints
4. **Databases** - Query performance
5. **External Services** - API call tracking

### 2. Error Tracking

**What You Get:**

- Error rate over time
- Error details with stack traces
- Affected users/transactions
- Error grouping
- Custom error attributes

**View Errors:**

1. APM & Services → Your App
2. **Events** → **Errors**
3. Click error to see:
   - Stack trace
   - Request details
   - Transaction context
   - Custom attributes

### 3. Browser Monitoring (Core Web Vitals)

**What You Get:**

- Page load times
- Core Web Vitals (LCP, FID, CLS)
- AJAX request performance
- JavaScript errors
- User sessions

**View Browser Metrics:**

1. **Browser** in top navigation
2. Select your app
3. View:
   - Page views
   - Core Web Vitals
   - JavaScript errors
   - Session traces

### 4. Infrastructure Monitoring

**What You Get:**

- Server/serverless function metrics
- Memory usage
- CPU usage
- Network I/O
- Host metrics

**View Infrastructure:**

1. **Infrastructure** in top navigation
2. **Hosts** to see Vercel functions
3. Correlate with APM data

---

## 🧪 Testing NewRelic Setup

### 1. Test Error Tracking

Add a test error endpoint:

```typescript
// app/api/test-error/route.ts
export async function GET() {
  // Test error for NewRelic
  throw new Error("NewRelic test error - ignore this");
}
```

Visit `/api/test-error` and check NewRelic for the error.

### 2. Test Performance Tracking

Add a slow endpoint:

```typescript
// app/api/test-slow/route.ts
export async function GET() {
  // Simulate slow operation
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return Response.json({ message: "Slow response" });
}
```

Visit `/api/test-slow` and check NewRelic for slow transaction.

### 3. Test Custom Attributes

```typescript
// app/api/test-custom/route.ts
export async function GET() {
  // Access NewRelic API
  const newrelic = require("newrelic");

  // Add custom attributes
  newrelic.addCustomAttribute("userId", "12345");
  newrelic.addCustomAttribute("plan", "premium");

  return Response.json({ message: "Custom attributes added" });
}
```

### 4. Verify Data in Dashboard

After generating test traffic:

1. Go to NewRelic dashboard
2. Wait 1-2 minutes for data to appear
3. Check **APM & Services** → Your App → **Summary**
4. Verify you see:
   - Request throughput
   - Response times
   - Error rate
   - Transactions

---

## 🎯 Custom Instrumentation

### Track Custom Transactions

```typescript
import newrelic from "newrelic";

export async function processOrder(orderId: string) {
  return newrelic.startBackgroundTransaction("processOrder", async () => {
    // Your business logic here
    const result = await doWork(orderId);

    // Add custom attributes
    newrelic.addCustomAttribute("orderId", orderId);
    newrelic.addCustomAttribute("orderTotal", result.total);

    return result;
  });
}
```

### Track Custom Events

```typescript
import newrelic from "newrelic";

// Record custom event
newrelic.recordCustomEvent("QuoteRequested", {
  service: "scaffolding",
  location: "brighton",
  timestamp: Date.now(),
});
```

### Measure Custom Metrics

```typescript
import newrelic from "newrelic";

// Record custom metric
newrelic.recordMetric("Custom/QuoteRequests", 1);
newrelic.recordMetric("Custom/AvgQuoteValue", quoteValue);
```

### Set User Context

```typescript
import newrelic from "newrelic";

// Set user ID for tracking
newrelic.setUserID(userId);

// Add user attributes
newrelic.addCustomAttribute("userEmail", user.email);
newrelic.addCustomAttribute("userPlan", user.plan);
```

---

## 🔍 Advanced Configuration

### Filter Sensitive Data

```javascript
// newrelic.js
exports.config = {
  // ... other config

  attributes: {
    // Exclude sensitive data
    exclude: [
      "request.headers.authorization",
      "request.headers.cookie",
      "request.parameters.password",
      "request.parameters.credit_card",
    ],
  },

  // Don't capture request parameters at all
  capture_params: false,
};
```

### Custom Error Handling

```javascript
// newrelic.js
exports.config = {
  error_collector: {
    enabled: true,

    // Ignore specific errors
    ignore_status_codes: [404, 401],

    // Custom error grouping
    expected_messages: {
      ValidationError: ["Email already exists"],
    },

    // Max errors per minute
    max_samples_stored: 100,
  },
};
```

### Performance Tuning

```javascript
// newrelic.js
exports.config = {
  transaction_tracer: {
    enabled: true,
    transaction_threshold: "apdex_f", // Only trace slow transactions
    record_sql: "obfuscated",
    explain_threshold: 500, // ms
  },

  // Reduce data collection in development
  application_logging: {
    enabled: process.env.NODE_ENV === "production",
    forwarding: {
      enabled: true,
      max_samples_stored: 10000,
    },
  },
};
```

---

## 📈 Setting Up Alerts

### 1. Create Alert Policy

1. Go to **Alerts & AI** → **Alert Policies**
2. Click **Create a policy**
3. Name: "Production Errors"
4. Incident preference: "By policy"

### 2. Add Conditions

**High Error Rate:**

1. Click **Add a condition**
2. Select **APM** → **Error percentage**
3. Threshold: Error rate > 5% for at least 5 minutes
4. Critical: Yes

**Slow Response Time:**

1. Add condition → **APM** → **Web transaction time**
2. Threshold: Response time > 3 seconds for at least 5 minutes
3. Critical: Yes

**Apdex Score Drop:**

1. Add condition → **APM** → **Apdex**
2. Threshold: Apdex < 0.8 for at least 10 minutes
3. Warning: Yes

### 3. Configure Notifications

1. Click **Notification channels**
2. Add **Email** notification
3. Add **Slack** webhook (optional)
4. Save policy

---

## 🔗 Integration with Deployment Pipeline

### GitHub Actions Integration

Add to `.github/workflows/deploy.yml`:

```yaml
- name: Notify NewRelic of Deployment
  env:
    NEW_RELIC_API_KEY: ${{ secrets.NEW_RELIC_API_KEY }}
    NEW_RELIC_APP_ID: ${{ secrets.NEW_RELIC_APP_ID }}
  run: |
    curl -X POST "https://api.newrelic.com/v2/applications/${NEW_RELIC_APP_ID}/deployments.json" \
      -H "Api-Key:${NEW_RELIC_API_KEY}" \
      -H "Content-Type: application/json" \
      -d '{
        "deployment": {
          "revision": "${{ github.sha }}",
          "changelog": "${{ github.event.head_commit.message }}",
          "description": "Deployed via GitHub Actions",
          "user": "${{ github.actor }}"
        }
      }'
```

### Vercel Integration

NewRelic automatically detects Vercel deployments via environment variables. No additional configuration needed.

---

## 🚨 Troubleshooting

### NewRelic Not Reporting Data

**Check 1: Verify agent is loaded**

```bash
# Look for this in console
"Agent started"
```

**Check 2: Verify license key**

```bash
echo $NEW_RELIC_LICENSE_KEY
# Should output your key
```

**Check 3: Check NewRelic logs**

```javascript
// newrelic.js - enable debug logging
exports.config = {
  logging: {
    level: "trace", // Very verbose
    filepath: "stdout",
  },
};
```

**Check 4: Verify environment**

- NewRelic requires Node.js runtime (not Edge runtime)
- Check `instrumentation.ts` only imports for `nodejs` runtime

### High Data Usage

**Monitor usage:**

1. Account Settings → Data Management → Data Governance
2. View data ingest by source
3. Identify high-volume sources

**Reduce usage:**

```javascript
// newrelic.js
exports.config = {
  // Sample transactions (only send 10%)
  transaction_tracer: {
    enabled: true,
    record_sql: "off", // Disable SQL recording
  },

  // Reduce log forwarding
  application_logging: {
    forwarding: {
      max_samples_stored: 1000, // Lower limit
    },
  },
};
```

### Errors Not Captured

**Enable error debugging:**

```javascript
// newrelic.js
exports.config = {
  error_collector: {
    enabled: true,
    capture_events: true,
    max_event_samples_stored: 100,
  },
  logging: {
    level: "debug",
  },
};
```

**Manually report errors:**

```typescript
import newrelic from "newrelic";

try {
  await riskyOperation();
} catch (error) {
  newrelic.noticeError(error, {
    customAttribute: "value",
  });
  throw error;
}
```

---

## 💰 Staying Within Free Tier

### Free Tier Limits

- **100 GB/month** data ingest
- **1 full platform user** (you)
- **Unlimited basic users** (view-only)
- **8 days** data retention

### Monitor Usage

1. Go to **Account Settings** → **Data Management**
2. View current month's usage
3. Set alert at 85 GB (warning)

### Optimization Tips

1. **Disable in development:**

```javascript
// newrelic.js
exports.config = {
  // Only enable in production
  agent_enabled: process.env.NODE_ENV === "production",
};
```

2. **Sample transactions:**

```javascript
// Only track 50% of transactions
exports.config = {
  transaction_tracer: {
    enabled: true,
    record_sql: "off",
  },
  // Custom sampling
  sampling_target: 10, // events per minute
  sampling_target_period_in_seconds: 60,
};
```

3. **Reduce log forwarding:**

```javascript
exports.config = {
  application_logging: {
    enabled: true,
    forwarding: {
      enabled: process.env.NODE_ENV === "production",
      max_samples_stored: 1000,
    },
  },
};
```

---

## 📚 Additional Resources

- [NewRelic Next.js Documentation](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/)
- [NewRelic Node.js Agent GitHub](https://github.com/newrelic/node-newrelic)
- [NewRelic Next.js Examples](https://github.com/newrelic/newrelic-node-nextjs)
- [NewRelic Free Tier Details](https://newrelic.com/pricing/free-tier)
- [NewRelic Query Language (NRQL)](https://docs.newrelic.com/docs/query-your-data/nrql-new-relic-query-language/)

---

## ✅ Setup Checklist

Use this checklist when adding NewRelic to a new site:

- [ ] Create NewRelic account (if first site)
- [ ] Get license key from account settings
- [ ] Install `newrelic` package: `pnpm add newrelic`
- [ ] Create `newrelic.js` config file
- [ ] Create `instrumentation.ts` file (Next.js 15+/16)
- [ ] Add environment variables to `.env.local`
- [ ] Update `package.json` scripts with `NODE_OPTIONS`
- [ ] Test locally with `pnpm dev`
- [ ] Verify data in NewRelic dashboard
- [ ] Add environment variables to Vercel
- [ ] Deploy to Vercel
- [ ] Verify production data in NewRelic
- [ ] Set up alert policies
- [ ] Configure notification channels
- [ ] Remove test endpoints (`/api/test-error`, etc.)

---

**Status:** Ready for Implementation
**Cost:** $0/month (free tier covers 50+ sites)
**Setup Time:** 30 minutes per site (15 minutes after first site)
**Next Steps:** Implement in colossus-reference, then roll out to all sites
