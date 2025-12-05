# Security Standards

**Version:** 1.0.0
**Last Updated:** 2025-12-05
**Scope:** All sites in local-business-platform

---

## Overview

Security is critical for protecting customer data and maintaining business reputation. All sites implement rate limiting, secure API routes, and GDPR-compliant data handling.

## Core Principles

### 1. Rate Limiting (Upstash Redis)

All public-facing APIs must be rate limited to prevent abuse.

### 2. No Secrets in Code

All sensitive data via environment variables only.

### 3. GDPR Compliance

User consent required before any data collection or tracking.

## Rate Limiting

### Implementation (Upstash Redis)

```typescript
// lib/rate-limiter.ts
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 300
): Promise<{ allowed: boolean; limit: number; remaining: number; resetAt: number }> {
  const key = `rate_limit:${identifier}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }

  const ttl = await redis.ttl(key);

  return {
    allowed: current <= limit,
    limit,
    remaining: Math.max(0, limit - current),
    resetAt: Date.now() + ttl * 1000,
  };
}
```

### Configuration

| Endpoint     | Limit        | Window    |
| ------------ | ------------ | --------- |
| Contact form | 5 requests   | 5 minutes |
| API routes   | 100 requests | 1 minute  |

### API Integration

```typescript
// app/api/contact/route.ts
import { checkRateLimit } from "@/lib/rate-limiter";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

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

## Environment Variables

### Required Secrets

```bash
# Rate Limiting (Upstash Redis)
KV_REST_API_URL=https://your-database.upstash.io
KV_REST_API_TOKEN=your-token-here

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

### Content Security Policy

```typescript
// next.config.ts
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: *.r2.dev;
  connect-src 'self' *.google-analytics.com;
  frame-ancestors 'none';
`;
```

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
- [ ] CSP headers set
- [ ] Consent banner functional
- [ ] Privacy policy page exists
- [ ] Cookie policy documented
- [ ] `.env.local` in `.gitignore`
- [ ] Vercel secrets configured

## Related Standards

- [Analytics](./analytics.md) - Consent management and tracking
- [Quality](./quality.md) - Security testing in CI

---

**Maintained By:** Digital Consulting Services
