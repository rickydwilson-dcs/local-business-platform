/**
 * Analytics Tracking API Route
 * Processes analytics events and sends them to configured platforms
 */

import { NextRequest, NextResponse } from "next/server";
import { GA4Analytics } from "@/lib/analytics/ga4";
import { FacebookPixelAnalytics } from "@/lib/analytics/facebook";
import { GoogleAdsAnalytics } from "@/lib/analytics/google-ads";
import { AnalyticsResponse, FeatureFlags, ConsentState } from "@/lib/analytics/types";

// Get feature flags from environment
function getFeatureFlags(): FeatureFlags {
  return {
    FEATURE_ANALYTICS_ENABLED: process.env.FEATURE_ANALYTICS_ENABLED === "true",
    FEATURE_CONSENT_BANNER: process.env.FEATURE_CONSENT_BANNER === "true",
    FEATURE_GA4_ENABLED: process.env.FEATURE_GA4_ENABLED === "true",
    FEATURE_SERVER_TRACKING: process.env.FEATURE_SERVER_TRACKING === "true",
    FEATURE_FACEBOOK_PIXEL: process.env.FEATURE_FACEBOOK_PIXEL === "true",
    FEATURE_GOOGLE_ADS: process.env.FEATURE_GOOGLE_ADS === "true",
  };
}

// Validate request data
function validateRequest(data: Record<string, unknown>): { valid: boolean; error?: string } {
  if (!data.event) {
    return { valid: false, error: "Event name is required" };
  }

  if (!data.client_id) {
    return { valid: false, error: "Client ID is required" };
  }

  return { valid: true };
}

// Check consent for analytics tracking
function hasValidConsent(consent: ConsentState | null): boolean {
  if (!consent) return false;
  return consent.analytics === true || consent.marketing === true;
}

export async function POST(request: NextRequest) {
  try {
    const flags = getFeatureFlags();

    // Early return if analytics is disabled
    if (!flags.FEATURE_ANALYTICS_ENABLED || !flags.FEATURE_SERVER_TRACKING) {
      return NextResponse.json(
        { success: false, error: "Analytics tracking is disabled" },
        { status: 200 } // Return 200 to avoid errors in logs
      );
    }

    const data = await request.json();

    // Validate request data
    const validation = validateRequest(data);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    // Check consent
    if (!hasValidConsent(data.consent_state)) {
      return NextResponse.json(
        { success: false, error: "User consent not provided" },
        { status: 200 } // Return 200 to avoid errors in logs
      );
    }

    const response: AnalyticsResponse = {
      success: true,
      platforms: {},
      debug:
        process.env.NODE_ENV === "development"
          ? {
              consent_state: data.consent_state,
              feature_flags: flags,
              event_data: data,
            }
          : undefined,
    };

    // Track with GA4 if enabled
    if (flags.FEATURE_GA4_ENABLED) {
      const ga4 = GA4Analytics.fromEnvironment(process.env.NODE_ENV === "development");
      if (ga4) {
        try {
          let ga4Result;

          if (data.event === "page_view") {
            ga4Result = await ga4.trackPageView(
              {
                page_location: data.page_location,
                page_title: data.page_title,
                page_referrer: data.page_referrer,
                user_agent: data.user_agent,
                ip_override: data.ip_address,
              },
              data.client_id,
              data.user_id
            );
          } else {
            ga4Result = await ga4.trackEvent(
              {
                name: data.event,
                parameters: data.parameters || {},
                value: data.value,
                currency: data.currency,
                timestamp: data.timestamp,
              },
              data.client_id,
              data.user_id
            );
          }

          response.platforms.ga4 = ga4Result;
        } catch (error) {
          console.error("GA4 tracking error:", error);
          response.platforms.ga4 = {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      } else {
        response.platforms.ga4 = {
          success: false,
          error: "GA4 configuration missing",
        };
      }
    }

    // Track with Facebook Pixel if enabled
    if (flags.FEATURE_FACEBOOK_PIXEL) {
      const facebook = FacebookPixelAnalytics.fromEnvironment(
        process.env.NODE_ENV === "development"
      );
      if (facebook) {
        try {
          // Extract Facebook tracking parameters
          const fbp = FacebookPixelAnalytics.extractFbp(request.headers.get("cookie") || undefined);
          const fbc = FacebookPixelAnalytics.extractFbc(
            data.page_location,
            request.headers.get("cookie") || undefined
          );

          let facebookResult;

          if (data.event === "page_view") {
            facebookResult = await facebook.trackPageView(
              data.page_location,
              data.user_agent,
              data.ip_address,
              fbp,
              fbc
            );
          } else {
            facebookResult = await facebook.trackEvent(
              {
                name: data.event,
                parameters: data.parameters || {},
                value: data.value,
                currency: data.currency,
                timestamp: data.timestamp,
              },
              data.page_location,
              data.user_agent,
              data.ip_address,
              fbp,
              fbc
            );
          }

          response.platforms.facebook = facebookResult;
        } catch (error) {
          console.error("Facebook Pixel tracking error:", error);
          response.platforms.facebook = {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      } else {
        response.platforms.facebook = {
          success: false,
          error: "Facebook Pixel configuration missing",
        };
      }
    }

    // Track with Google Ads if enabled and it's a conversion event
    if (flags.FEATURE_GOOGLE_ADS && data.conversion_action) {
      const googleAds = GoogleAdsAnalytics.fromEnvironment();
      if (googleAds) {
        try {
          const gclid = GoogleAdsAnalytics.extractGclid(data.page_location);

          const googleAdsResult = await googleAds.trackConversion(
            {
              name: data.event,
              conversion_action: data.conversion_action,
              conversion_value: data.value,
              conversion_currency: data.currency || "GBP",
              parameters: data.parameters || {},
              timestamp: data.timestamp,
            },
            gclid,
            data.order_id
          );

          response.platforms.google_ads = googleAdsResult;
        } catch (error) {
          console.error("Google Ads tracking error:", error);
          response.platforms.google_ads = {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      } else {
        response.platforms.google_ads = {
          success: false,
          error: "Google Ads configuration missing",
        };
      }
    }

    // Log successful tracking in development
    if (process.env.NODE_ENV === "development") {
      console.log("Analytics event tracked:", {
        event: data.event,
        platforms: Object.keys(response.platforms),
        success: response.success,
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Analytics API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        platforms: {},
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ status: "Analytics API is running" }, { status: 200 });
  }

  const flags = getFeatureFlags();

  return NextResponse.json({
    status: "Analytics API is running",
    feature_flags: flags,
    endpoints: {
      track: "POST /api/analytics/track",
      debug: "GET /api/analytics/debug",
    },
    platforms: {
      ga4: {
        enabled: flags.FEATURE_GA4_ENABLED,
        configured: Boolean(
          process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && process.env.GA4_API_SECRET
        ),
      },
      facebook: {
        enabled: flags.FEATURE_FACEBOOK_PIXEL,
        configured: Boolean(process.env.FACEBOOK_PIXEL_ID && process.env.FACEBOOK_ACCESS_TOKEN),
      },
      google_ads: {
        enabled: flags.FEATURE_GOOGLE_ADS,
        configured: Boolean(
          process.env.GOOGLE_ADS_CUSTOMER_ID && process.env.GOOGLE_ADS_CONVERSION_ACTION_ID
        ),
      },
    },
  });
}
