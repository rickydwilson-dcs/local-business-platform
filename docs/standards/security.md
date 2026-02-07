# Security Standards

**Version:** 1.1.0
**Last Updated:** 2025-12-06
**Scope:** All sites in local-business-platform

---

## Overview

Security is critical for protecting customer data and maintaining business reputation. All sites implement rate limiting, secure API routes, XSS prevention, secure IP extraction, and GDPR-compliant data handling.

## Core Principles

### 1. Rate Limiting (Upstash Redis)

All public-facing APIs must be rate limited to prevent abuse.

### 2. No Secrets in Code

All sensitive data via environment variables only.

### 3. GDPR Compliance

User consent required before any data collection or tracking.

### 4. XSS Prevention

All user inputs must be HTML-escaped before rendering in HTML contexts.

### 5. Secure IP Extraction

Client IP addresses must be extracted from trusted headers only, with validation.

## Rate Limiting

### Implementation (Supabase)

Rate limiting uses the `rate_limits` table in Supabase with an atomic RPC function. The implementation lives in `packages/core-components/src/lib/rate-limiter.ts` and is shared across all sites.

```typescript
// Import from core-components
import { checkRateLimit, rateLimitMiddleware } from "@platform/core-components/lib/rate-limiter";

// Direct check (colossus pattern)
const result = await checkRateLimit(ip);
if (!result.allowed) {
  /* return 429 */
}

// Middleware wrapper (base-template/smiths pattern)
const response = await rateLimitMiddleware(ip);
if (response) return response; // 429
```

Fails open if Supabase is unavailable (allows request, logs error).

### Configuration

| Endpoint     | Limit        | Window    |
| ------------ | ------------ | --------- |
| Contact form | 5 requests   | 5 minutes |
| API routes   | 100 requests | 1 minute  |

### API Integration

```typescript
// app/api/contact/route.ts
import { checkRateLimit } from "@/lib/rate-limiter";
import { extractClientIp } from "@/lib/security/ip-utils";

export async function POST(request: Request) {
  // Use secure IP extraction with validation
  const ip = extractClientIp(request);

  const rateLimitResult = await checkRateLimit(ip);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.resetAt.toString(),
        },
      }
    );
  }

  // Process request...
}
```

### Fail-Open Design

Rate limiter allows requests if Redis is unavailable:

```typescript
try {
  const result = await checkRateLimit(ip);
  if (!result.allowed) return rateLimit429Response();
} catch (error) {
  console.error("Rate limit check failed:", error);
  // Fail open - allow request to proceed
}
```

## XSS Prevention

### HTML Escaping Utility

All user inputs rendered in HTML contexts must be escaped:

```typescript
// lib/security/html-escape.ts
const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

export function escapeHtml(text: string): string {
  if (!text) return "";
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

// For objects with string values
export function escapeHtmlObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === "string") {
      (result as Record<string, unknown>)[key] = escapeHtml(result[key] as string);
    }
  }
  return result;
}
```

### Usage in Email Templates

```typescript
import { escapeHtml } from "@/lib/security/html-escape";

// Always escape user inputs before including in HTML
const safeInputs = {
  name: escapeHtml(name),
  email: escapeHtml(email),
  message: escapeHtml(message),
};

const emailHtml = `
  <p>Name: ${safeInputs.name}</p>
  <p>Email: ${safeInputs.email}</p>
  <p>Message: ${safeInputs.message}</p>
`;
```

## Secure IP Extraction

### IP Extraction Utility

Extract client IP from trusted proxy headers with validation:

```typescript
// lib/security/ip-utils.ts
export function extractClientIp(request: Request): string {
  // Priority 1: Vercel's x-real-ip (trusted proxy)
  const realIp = request.headers.get("x-real-ip");
  if (realIp && isValidIp(realIp)) return realIp.trim();

  // Priority 2: Cloudflare's cf-connecting-ip (trusted proxy)
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp && isValidIp(cfIp)) return cfIp.trim();

  // Priority 3: x-forwarded-for (first IP only, validated)
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const firstIp = xff.split(",")[0].trim();
    if (isValidIp(firstIp)) return firstIp;
  }

  return "unknown";
}

export function isValidIp(ip: string): boolean {
  // Validates IPv4 and IPv6 formats
  // ...see full implementation in lib/security/ip-utils.ts
}
```

### Header Trust Priority

| Priority | Header             | Source     | Trust Level |
| -------- | ------------------ | ---------- | ----------- |
| 1        | x-real-ip          | Vercel     | High        |
| 2        | cf-connecting-ip   | Cloudflare | High        |
| 3        | x-forwarded-for[0] | Any proxy  | Medium      |
| Fallback | (none)             | -          | "unknown"   |

### Why This Matters

- **x-forwarded-for can be spoofed** by attackers adding fake headers
- **Trusted proxies** (Vercel, Cloudflare) set headers from actual connection
- **Always validate** IP format before using for rate limiting
- **Never trust** user-controlled headers without validation

## Environment Variables

### Required Secrets

```bash
# Rate Limiting (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Email (Resend)
RESEND_API_KEY=re_your_api_key_here
BUSINESS_EMAIL=your-business@email.com

# Analytics (Public - safe to expose)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

### Security Rules

- ✅ All secrets in environment variables
- ✅ `.env.local` in `.gitignore`
- ✅ Vercel Dashboard for production secrets
- ❌ NO secrets committed to Git
- ❌ NO secrets in client-side code (except NEXT*PUBLIC*\*)

## API Security

### Input Validation

```typescript
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10).max(2000),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = ContactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.issues },
      { status: 400 }
    );
  }

  // Safe to use result.data
}
```

### CORS Configuration

```typescript
// next.config.ts
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
        { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
      ],
    },
  ];
}
```

### Security Headers

All sites must include these security headers in `next.config.ts`:

```typescript
// next.config.ts
async headers() {
  const scriptSrc = "'self' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.facebook.com vercel.live *.vercel.live";

  return [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Content-Security-Policy",
          value: `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.r2.dev; connect-src 'self' *.google-analytics.com *.facebook.com vercel.live *.vercel.live; frame-src vercel.live *.vercel.live; frame-ancestors 'none';`,
        },
        // HSTS - enforce HTTPS for 1 year
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
        // Prevent resources from being loaded by other origins
        {
          key: "Cross-Origin-Resource-Policy",
          value: "same-origin",
        },
        // Restrict browser features that aren't needed
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ];
}
```

### Required Security Headers

| Header                       | Value                                   | Purpose                        |
| ---------------------------- | --------------------------------------- | ------------------------------ |
| X-Frame-Options              | DENY                                    | Prevent clickjacking           |
| X-Content-Type-Options       | nosniff                                 | Prevent MIME sniffing          |
| Referrer-Policy              | strict-origin-when-cross-origin         | Control referrer information   |
| Content-Security-Policy      | (see above)                             | Prevent XSS, injection attacks |
| Strict-Transport-Security    | max-age=31536000; includeSubDomains     | Enforce HTTPS                  |
| Cross-Origin-Resource-Policy | same-origin                             | Prevent cross-origin embedding |
| Permissions-Policy           | camera=(), microphone=(), geolocation() | Restrict browser features      |

### CSP Notes

- **unsafe-inline for scripts**: Required for Next.js hydration
- **unsafe-eval removed**: Not needed, security risk
- **frame-ancestors 'none'**: Prevents embedding in iframes

## GDPR Compliance

### Consent Requirements

- ✅ Explicit consent before any tracking
- ✅ Consent banner on first visit
- ✅ Easy consent withdrawal
- ✅ Data portability on request
- ✅ Privacy policy accessible

### Consent Categories

```typescript
interface ConsentState {
  essential: boolean; // Always true (required for site function)
  analytics: boolean; // Google Analytics, performance tracking
  marketing: boolean; // Facebook Pixel, Google Ads
}
```

### Cookie Policy

| Cookie  | Type      | Duration | Purpose                   |
| ------- | --------- | -------- | ------------------------- |
| consent | Essential | 1 year   | Store consent preferences |
| \_ga    | Analytics | 2 years  | Google Analytics tracking |
| \_gid   | Analytics | 24 hours | GA session tracking       |

## What NOT to Do

| Anti-Pattern                | Why It's Wrong     | Correct Approach       |
| --------------------------- | ------------------ | ---------------------- |
| API keys in code            | Security breach    | Environment variables  |
| No rate limiting            | DDoS vulnerability | Upstash Redis limiting |
| No input validation         | Injection attacks  | Zod schema validation  |
| Tracking without consent    | GDPR violation     | Consent-first approach |
| Storing passwords plaintext | Data breach risk   | Never store passwords  |

## Security Checklist

Before deploying any site:

- [ ] Rate limiting configured on all public APIs
- [ ] All secrets in environment variables
- [ ] Input validation on all API routes
- [ ] CORS properly configured
- [ ] All security headers set (CSP, HSTS, CORP, etc.)
- [ ] HTML escaping on all user inputs in email templates
- [ ] Secure IP extraction using `extractClientIp()` utility
- [ ] Consent validation using Zod schema
- [ ] Consent banner functional
- [ ] Privacy policy page exists
- [ ] Cookie policy documented
- [ ] `.env.local` in `.gitignore`
- [ ] Vercel secrets configured
- [ ] `pnpm audit` shows 0 vulnerabilities

## Related Standards

- [Analytics](./analytics.md) - Consent management and tracking
- [Quality](./quality.md) - Security testing in CI

---

**Maintained By:** Digital Consulting Services
