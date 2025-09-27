/**
 * Next.js Middleware for Server-Side Analytics Tracking
 * Handles consent-aware page view tracking and analytics processing
 */

import { NextRequest, NextResponse } from "next/server";

// Feature flags for analytics control
function getFeatureFlags() {
  return {
    FEATURE_ANALYTICS_ENABLED: process.env.FEATURE_ANALYTICS_ENABLED === "true",
    FEATURE_SERVER_TRACKING: process.env.FEATURE_SERVER_TRACKING === "true",
    FEATURE_GA4_ENABLED: process.env.FEATURE_GA4_ENABLED === "true",
    FEATURE_FACEBOOK_PIXEL: process.env.FEATURE_FACEBOOK_PIXEL === "true",
    FEATURE_GOOGLE_ADS: process.env.FEATURE_GOOGLE_ADS === "true",
  };
}

// Parse consent from cookie
function parseConsent(cookieValue?: string) {
  if (!cookieValue) return null;

  try {
    return JSON.parse(decodeURIComponent(cookieValue));
  } catch {
    return null;
  }
}

// Check if user has consented to analytics
function hasAnalyticsConsent(consent: ConsentState | null): boolean {
  return consent?.analytics === true || consent?.marketing === true;
}

// Generate or extract client ID for tracking
function getClientId(request: NextRequest): string {
  // Try to get existing client ID from cookie
  const existingClientId = request.cookies.get("_ga_client_id")?.value;
  if (existingClientId) {
    return existingClientId;
  }

  // Generate new client ID
  return `${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;
}

// Extract user agent and IP for tracking
function extractUserData(request: NextRequest) {
  return {
    userAgent: request.headers.get("user-agent") || undefined,
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined,
    referrer: request.headers.get("referer") || undefined,
  };
}

// Send analytics event asynchronously (fire-and-forget)
async function sendAnalyticsEvent(
  url: string,
  title: string,
  clientId: string,
  userData: { userAgent?: string; ip?: string; referrer?: string },
  consent: ConsentState | null
) {
  try {
    // Build the analytics payload
    const payload = {
      event: "page_view",
      page_location: url,
      page_title: title,
      page_referrer: userData.referrer,
      client_id: clientId,
      user_agent: userData.userAgent,
      ip_address: userData.ip,
      consent_state: consent,
      timestamp: Date.now(),
    };

    // Send to our analytics API endpoint
    const analyticsUrl = new URL("/api/analytics/track", url);

    // Fire and forget - don't wait for response to avoid slowing down the request
    fetch(analyticsUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch((error) => {
      console.error("Analytics tracking failed:", error);
    });
  } catch (error) {
    console.error("Analytics payload preparation failed:", error);
  }
}

export async function middleware(request: NextRequest) {
  // Get feature flags
  const flags = getFeatureFlags();

  // Early return if analytics is completely disabled
  if (!flags.FEATURE_ANALYTICS_ENABLED || !flags.FEATURE_SERVER_TRACKING) {
    return NextResponse.next();
  }

  // Only track page views (not API routes, static assets, etc.)
  const { pathname } = request.nextUrl;

  // Skip tracking for:
  // - API routes
  // - Static assets
  // - Next.js internals
  // - Favicon and robots.txt
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    (pathname.includes(".") && !pathname.endsWith(".html")) ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  // Parse consent from cookies
  const consentCookie = request.cookies.get("analytics_consent")?.value;
  const consent = parseConsent(consentCookie);

  // Check if user has consented to analytics tracking
  if (!hasAnalyticsConsent(consent)) {
    // User hasn't consented or consent is unknown
    // Still allow the request to proceed, but don't track
    return NextResponse.next();
  }

  // Generate response
  const response = NextResponse.next();

  // Get or generate client ID
  const clientId = getClientId(request);

  // Set client ID cookie if it's new (expires in 2 years)
  if (!request.cookies.get("_ga_client_id")?.value) {
    response.cookies.set("_ga_client_id", clientId, {
      maxAge: 2 * 365 * 24 * 60 * 60, // 2 years
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  // Extract user data for tracking
  const userData = extractUserData(request);

  // Attempt to get page title (this is best effort)
  const url = request.nextUrl.toString();
  const title = generatePageTitle(pathname);

  // Send analytics event asynchronously
  sendAnalyticsEvent(url, title, clientId, userData, consent);

  return response;
}

// Generate page title based on pathname (fallback when we can't get the real title)
function generatePageTitle(pathname: string): string {
  const titleMap: Record<string, string> = {
    "/": "Home - Colossus Scaffolding",
    "/about": "About - Colossus Scaffolding",
    "/contact": "Contact - Colossus Scaffolding",
    "/services": "Services - Colossus Scaffolding",
    "/locations": "Locations - Colossus Scaffolding",
    "/projects": "Projects - Colossus Scaffolding",
    "/health-safety": "Health & Safety - Colossus Scaffolding",
  };

  // Check for exact matches first
  if (titleMap[pathname]) {
    return titleMap[pathname];
  }

  // Handle dynamic routes
  if (pathname.startsWith("/services/")) {
    const service = pathname.split("/")[2]?.replace(/-/g, " ") || "Service";
    return `${service.charAt(0).toUpperCase() + service.slice(1)} - Colossus Scaffolding`;
  }

  if (pathname.startsWith("/locations/")) {
    const location = pathname.split("/")[2]?.replace(/-/g, " ") || "Location";
    return `${location.charAt(0).toUpperCase() + location.slice(1)} Scaffolding - Colossus Scaffolding`;
  }

  if (pathname.startsWith("/contact/")) {
    const section = pathname.split("/")[2]?.replace(/-/g, " ") || "Contact";
    return `${section.charAt(0).toUpperCase() + section.slice(1)} Contact - Colossus Scaffolding`;
  }

  // Fallback
  return `${pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2).replace(/-/g, " ")} - Colossus Scaffolding`;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
