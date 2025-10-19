# Sentry Error Monitoring Setup Guide

This guide walks through setting up Sentry error monitoring for the local business platform monorepo.

---

## 📋 Prerequisites

- Sentry.io account (free tier available)
- Admin access to this repository
- Node.js and npm installed

---

## 🚀 Quick Start

### 1. Create Sentry Account

1. Go to [sentry.io](https://sentry.io)
2. Sign up for a free account
3. Create an organization (e.g., "Your Business Name")

### 2. Create Projects

Create a separate Sentry project for each site:

**Recommended Project Setup:**

- **colossus-reference** - Internal reference site (development/testing)
- **joes-plumbing-canterbury** - Client site #1
- _(Create additional projects as you add more sites)_

**Project Settings:**

- Platform: **Next.js**
- Alert Frequency: **On every new issue** (for colossus-reference)
- Alert Frequency: **Smart** (for client sites - reduces noise)

### 3. Install Sentry SDK

For each site, navigate to the site directory and run the Sentry wizard:

```bash
# For colossus-reference
cd sites/colossus-reference
npx @sentry/wizard@latest -i nextjs

# For joes-plumbing-canterbury
cd ../joes-plumbing-canterbury
npx @sentry/wizard@latest -i nextjs
```

**What the wizard does:**

- Installs `@sentry/nextjs` package
- Creates configuration files (sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts)
- Adds instrumentation hook (instrumentation.ts)
- Updates next.config.ts with Sentry settings
- Creates example error page for testing

### 4. Configure Environment Variables

The wizard will prompt for your DSN. You can also add it manually:

**For local development:**

Create `.env.local` in each site:

```bash
# sites/colossus-reference/.env.local
NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
SENTRY_ORG=your_org_slug
SENTRY_PROJECT=colossus-reference
```

**For Vercel deployment:**

Add environment variables in Vercel dashboard for each project:

1. Go to Project Settings → Environment Variables
2. Add `NEXT_PUBLIC_SENTRY_DSN` (Production, Preview, Development)
3. Add `SENTRY_ORG` and `SENTRY_PROJECT`
4. Redeploy to apply changes

---

## 🔧 Configuration Details

### Generated Files

The Sentry wizard creates these files:

```
sites/[site-name]/
├── sentry.client.config.ts    # Browser error tracking
├── sentry.server.config.ts    # Server error tracking
├── sentry.edge.config.ts      # Edge runtime errors
└── instrumentation.ts         # Next.js instrumentation hook
```

### Basic Configuration Example

**sentry.client.config.ts:**

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: 1.0,

  // Session replay (optional)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Environment
  environment: process.env.NODE_ENV,

  // Enable debug in development
  debug: process.env.NODE_ENV === "development",
});
```

### Advanced Configuration

**Filtering Sensitive Data:**

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  beforeSend(event, hint) {
    // Filter out specific errors
    if (event.exception?.values?.[0]?.value?.includes("Network Error")) {
      return null; // Don't send to Sentry
    }
    return event;
  },

  // Remove sensitive data
  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.category === "console") {
      return null; // Don't log console messages
    }
    return breadcrumb;
  },
});
```

---

## 🧪 Testing Sentry

### 1. Test with Example Page

The wizard creates a test page at `/sentry-example-page`:

```bash
npm run dev
# Visit http://localhost:3000/sentry-example-page
# Click buttons to trigger test errors
```

### 2. Verify Errors in Sentry Dashboard

1. Go to your Sentry project dashboard
2. Navigate to **Issues**
3. You should see the test errors appear within seconds

### 3. Test Different Error Types

**Client-side error:**

```typescript
// In any component
throw new Error("Test client error");
```

**Server-side error:**

```typescript
// In API route or Server Component
export async function GET() {
  throw new Error("Test server error");
}
```

**Async error:**

```typescript
async function fetchData() {
  throw new Error("Test async error");
}
```

---

## 📊 Monitoring Best Practices

### 1. Set Up Alerts

**Recommended Alert Rules:**

- **Critical Errors** - Alert immediately on 5xx errors
- **High Volume** - Alert if error count > 100 in 5 minutes
- **New Issues** - Alert on first occurrence of new error type

### 2. Configure Releases

Track which deployment caused errors:

```bash
# Add to your deployment script
npx sentry-cli releases new <version>
npx sentry-cli releases set-commits <version> --auto
npx sentry-cli releases finalize <version>
```

**In GitHub Actions:**

```yaml
- name: Create Sentry Release
  env:
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
  run: |
    npx sentry-cli releases new ${{ github.sha }}
    npx sentry-cli releases set-commits ${{ github.sha }} --auto
    npx sentry-cli releases finalize ${{ github.sha }}
```

### 3. Use Error Boundaries

**Create error boundary component:**

```typescript
// components/ErrorBoundary.tsx
"use client";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function ErrorBoundary({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  );
}
```

**Use in error.tsx:**

```typescript
// app/error.tsx
import ErrorBoundary from "@/components/ErrorBoundary";

export default ErrorBoundary;
```

### 4. Add Context to Errors

**User context:**

```typescript
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});
```

**Custom tags:**

```typescript
Sentry.setTag("page_locale", "en-us");
Sentry.setTag("site_name", "colossus-reference");
```

**Breadcrumbs:**

```typescript
Sentry.addBreadcrumb({
  category: "navigation",
  message: "User navigated to contact page",
  level: "info",
});
```

---

## 🔍 Debugging Sentry Issues

### Sentry Not Capturing Errors

**1. Check DSN is configured:**

```bash
# Should print your DSN
echo $NEXT_PUBLIC_SENTRY_DSN
```

**2. Verify initialization:**

```typescript
// Add to sentry.client.config.ts
console.log("Sentry initialized:", !!Sentry.getCurrentHub().getClient());
```

**3. Check environment:**

```typescript
// Sentry is disabled in development by default
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  debug: true, // Enable debug logging
  environment: process.env.NODE_ENV,
});
```

### Source Maps Not Working

**1. Verify source maps are uploaded:**

```bash
# Check Sentry project artifacts
npx sentry-cli releases files <version> list
```

**2. Configure source maps in next.config.ts:**

```typescript
const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
```

### Too Many Errors

**1. Add rate limiting:**

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  beforeSend(event) {
    // Sample 10% of errors
    if (Math.random() > 0.1) return null;
    return event;
  },
});
```

**2. Filter known issues:**

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  ignoreErrors: ["ResizeObserver loop limit exceeded", "Non-Error promise rejection captured"],
});
```

---

## 📈 Performance Monitoring

### Enable Performance Tracing

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Trace 100% of transactions in production
  tracesSampleRate: 1.0,

  // Trace specific operations
  integrations: [
    Sentry.browserTracingIntegration({
      tracePropagationTargets: ["localhost", /^https:\/\/yoursite\.com/],
    }),
  ],
});
```

### Custom Performance Tracking

```typescript
// Track custom operation
const transaction = Sentry.startTransaction({
  name: "Load Dashboard Data",
  op: "dashboard.load",
});

try {
  await loadDashboardData();
  transaction.setStatus("ok");
} catch (error) {
  transaction.setStatus("internal_error");
  throw error;
} finally {
  transaction.finish();
}
```

---

## 💰 Pricing & Limits

### Free Tier Includes:

- 5,000 errors per month
- 10,000 performance units per month
- 30 days data retention
- Unlimited team members

### Recommendations:

- **Development sites** - Free tier sufficient
- **Production sites** - Monitor usage, upgrade if needed
- **High-traffic sites** - Consider Team plan ($26/month)

---

## 🔐 Security Considerations

### 1. Protect Sensitive Data

**Never send:**

- Passwords
- API keys
- Credit card numbers
- Personal identifiable information (PII)

**Configure data scrubbing:**

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  beforeSend(event) {
    // Remove query parameters
    if (event.request) {
      event.request.query_string = null;
    }
    return event;
  },
});
```

### 2. Secure Auth Tokens

**For Vercel:**

- Store `SENTRY_AUTH_TOKEN` as an encrypted secret
- Never commit tokens to Git
- Use read-only tokens when possible

### 3. IP Allowlisting

Configure Sentry to only accept errors from known IPs:

1. Go to Settings → Security & Privacy
2. Add Vercel IP ranges
3. Enable "Require IP allowlist"

---

## 📚 Additional Resources

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Sentry Session Replay](https://docs.sentry.io/product/session-replay/)
- [Sentry CLI](https://docs.sentry.io/cli/)

---

## ✅ Setup Checklist

Use this checklist when adding Sentry to a new site:

- [ ] Create Sentry project in dashboard
- [ ] Run `npx @sentry/wizard@latest -i nextjs` in site directory
- [ ] Add environment variables to `.env.local`
- [ ] Add environment variables to Vercel project
- [ ] Test with `/sentry-example-page`
- [ ] Verify errors appear in Sentry dashboard
- [ ] Configure alert rules
- [ ] Set up error boundary component
- [ ] Add Sentry release tracking to deployment scripts
- [ ] Document DSN and project settings in team docs
- [ ] Remove example page before production deployment

---

**Status:** Ready for Implementation
**Next Steps:** Create Sentry account and run wizard for colossus-reference site
