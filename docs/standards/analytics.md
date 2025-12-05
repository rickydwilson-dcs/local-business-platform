# Analytics Standards

**Version:** 1.0.0
**Last Updated:** 2025-12-05
**Scope:** All sites in local-business-platform

---

## Overview

Analytics in the Local Business Platform follow a privacy-first, GDPR-compliant approach. All tracking requires explicit user consent, and functionality is controlled via feature flags.

## Core Principles

### 1. Consent First

No analytics or tracking until user explicitly consents.

### 2. Feature Flag Controlled

All analytics functionality controlled via environment variables.

### 3. Privacy Compliant

GDPR, PECR, and ICO compliant implementation.

## Feature Flags

### Environment Variables

```bash
# Feature Flags (Server-Side)
FEATURE_CONSENT_BANNER=true          # Shows/hides consent banner
FEATURE_ANALYTICS_ENABLED=true       # Enables analytics system
FEATURE_GA4_ENABLED=true             # Google Analytics 4
FEATURE_SERVER_TRACKING=true         # Server-side tracking
FEATURE_FACEBOOK_PIXEL=false         # Facebook/Meta Pixel
FEATURE_GOOGLE_ADS=false             # Google Ads tracking

# Public Variables (Client-Side)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
```

## Consent Management

### Consent Categories

```typescript
interface ConsentState {
  essential: boolean; // Always true (required)
  analytics: boolean; // GA4, performance tracking
  marketing: boolean; // Facebook Pixel, Google Ads
}
```

### Consent Banner Component

```tsx
// components/analytics/ConsentManager.tsx
export function ConsentManager({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);

  // Hide on policy pages
  const isOnPolicyPages = pathname === "/privacy-policy" || pathname === "/cookie-policy";

  useEffect(() => {
    if (!enabled || isOnPolicyPages) {
      setShowBanner(false);
      return;
    }
    // Check for existing consent
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, [enabled, isOnPolicyPages]);

  // Banner UI...
}
```

### Smart Page Detection

Consent banner automatically hides on:

- `/privacy-policy`
- `/cookie-policy`

This prevents the banner from blocking access to policy information.

## GA4 Integration

### Initialization

```tsx
// components/analytics/Analytics.tsx
const initializeGA4 = useCallback(() => {
  if (!consent.analytics || !gaId) return;

  // Load gtag script
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    dataLayer.push(arguments);
  };
  gtag("js", new Date());
  gtag("config", gaId, {
    send_page_view: false, // Manual control
  });

  // Fire initial page view after consent
  gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_referrer: document.referrer || undefined,
  });
}, [gaId, consent]);
```

### Critical Fix: Single Page Visit Tracking

```tsx
// Problem: Users who accept cookies on first visit weren't tracked
// Solution: Manual page view after consent

useEffect(() => {
  if (consent.analytics) {
    // Fire page view immediately after consent
    gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
}, [consent.analytics]);
```

### Event Tracking

```typescript
// lib/analytics/tracking.ts
export function trackEvent(eventName: string, parameters?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, parameters);
  }
}

// Usage
trackEvent("quote_request", {
  service_type: "residential",
  location: "brighton",
  value: 150,
  currency: "GBP",
});
```

### useAnalytics Hook

```typescript
// hooks/useAnalytics.ts
export function useAnalytics() {
  const { consent } = useConsent();

  const trackEvent = useCallback(
    (name: string, params?: Record<string, unknown>) => {
      if (consent.analytics && window.gtag) {
        window.gtag("event", name, params);
      }
    },
    [consent]
  );

  const trackConversion = useCallback(
    (conversionId: string, value: number, currency: string) => {
      if (consent.marketing && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: conversionId,
          value,
          currency,
        });
      }
    },
    [consent]
  );

  return { trackEvent, trackConversion };
}
```

## DataLayer Implementation

```typescript
// lib/analytics/dataLayer.ts
export function pushToDataLayer(event: string, data: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...data,
    timestamp: new Date().toISOString(),
  });
}

// Usage
pushToDataLayer("form_submission", {
  form_name: "contact",
  form_location: "footer",
});
```

## Server-Side Tracking

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // Check consent
  const consentCookie = request.cookies.get("cookieConsent");
  if (!consentCookie?.value.includes("analytics")) {
    return NextResponse.next();
  }

  // Track page view server-side
  await fetch("https://www.google-analytics.com/mp/collect", {
    method: "POST",
    body: JSON.stringify({
      client_id: getOrCreateClientId(request),
      events: [
        {
          name: "page_view",
          params: {
            page_location: request.url,
            page_title: request.nextUrl.pathname,
          },
        },
      ],
    }),
  });

  return NextResponse.next();
}
```

## Debug Endpoints

```typescript
// app/api/analytics/debug/route.ts
export async function GET() {
  return NextResponse.json({
    featureFlags: {
      consentBanner: process.env.FEATURE_CONSENT_BANNER === "true",
      analyticsEnabled: process.env.FEATURE_ANALYTICS_ENABLED === "true",
      ga4Enabled: process.env.FEATURE_GA4_ENABLED === "true",
    },
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? "configured" : "missing",
  });
}
```

## What NOT to Do

| Anti-Pattern                     | Why It's Wrong   | Correct Approach         |
| -------------------------------- | ---------------- | ------------------------ |
| Loading analytics before consent | GDPR violation   | Consent-first            |
| Hardcoded tracking IDs           | Not configurable | Environment variables    |
| No consent banner                | Legal risk       | ConsentManager component |
| Tracking on policy pages         | UX issue         | Smart page detection     |
| No feature flags                 | All-or-nothing   | Granular control         |

## Implementation Rules

### Required

- ✅ All analytics must respect user consent choices
- ✅ Consent banner must not block policy pages
- ✅ GA4 must fire initial page view after consent acceptance
- ✅ Feature flags must control all analytics functionality
- ✅ GDPR compliance must be maintained at all times

### Forbidden

- ❌ Loading analytics scripts before consent
- ❌ Tracking users without explicit consent
- ❌ Blocking policy pages with consent overlays
- ❌ Hardcoded analytics IDs (use environment variables)
- ❌ Analytics functionality without feature flag controls

## Verification Checklist

Before deploying analytics:

- [ ] Consent banner displays on first visit
- [ ] Banner doesn't show on privacy/cookie policy pages
- [ ] No tracking before consent given
- [ ] GA4 initializes after consent
- [ ] Initial page view fires after consent
- [ ] Feature flags work correctly
- [ ] Privacy policy updated with tracking info
- [ ] Cookie policy lists all cookies

## Related Standards

- [Security](./security.md) - GDPR compliance and data protection
- [Quality](./quality.md) - Analytics testing

---

**Maintained By:** Digital Consulting Services
