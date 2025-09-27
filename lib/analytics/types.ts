/**
 * Analytics Types and Interfaces
 * Comprehensive type definitions for the analytics system
 */

export interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, unknown>;
  value?: number;
  currency?: string;
  timestamp?: number;
}

export interface PageViewEvent {
  page_location: string;
  page_title: string;
  page_referrer?: string;
  user_agent?: string;
  ip_override?: string;
  user_id?: string;
  session_id?: string;
}

export interface ConversionEvent extends AnalyticsEvent {
  conversion_action: "quote_request" | "phone_call" | "email_contact" | "form_submit";
  conversion_label?: string;
  conversion_value?: number;
  conversion_currency?: string;
}

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: number;
  version: string;
}

export interface FeatureFlags {
  FEATURE_ANALYTICS_ENABLED: boolean;
  FEATURE_CONSENT_BANNER: boolean;
  FEATURE_GA4_ENABLED: boolean;
  FEATURE_SERVER_TRACKING: boolean;
  FEATURE_FACEBOOK_PIXEL: boolean;
  FEATURE_GOOGLE_ADS: boolean;
}

export interface AnalyticsConfig {
  ga4MeasurementId?: string;
  ga4ApiSecret?: string;
  facebookPixelId?: string;
  facebookAccessToken?: string;
  googleAdsCustomerId?: string;
  googleAdsConversionId?: string;
  debugMode?: boolean;
}

export interface GA4Event {
  client_id: string;
  user_id?: string;
  timestamp_micros?: number;
  user_properties?: Record<string, { value: unknown }>;
  events: Array<{
    name: string;
    params?: Record<string, unknown>;
  }>;
}

export interface FacebookPixelEvent {
  data: Array<{
    event_name: string;
    event_time: number;
    event_source_url: string;
    user_data: {
      client_ip_address?: string;
      client_user_agent?: string;
      fbc?: string;
      fbp?: string;
    };
    custom_data?: Record<string, unknown>;
  }>;
  test_event_code?: string;
}

export interface GoogleAdsConversion {
  conversion_action: string;
  conversion_date_time: string;
  conversion_value?: number;
  currency_code?: string;
  order_id?: string;
  gclid?: string;
}

export interface AnalyticsResponse {
  success: boolean;
  platforms: {
    ga4?: { success: boolean; error?: string };
    facebook?: { success: boolean; error?: string };
    google_ads?: { success: boolean; error?: string };
  };
  debug?: {
    consent_state?: ConsentState;
    feature_flags?: Partial<FeatureFlags>;
    event_data?: unknown;
  };
}

export interface DebugPanelData {
  featureFlags: FeatureFlags;
  consentState: ConsentState | null;
  recentEvents: Array<{
    timestamp: number;
    event: AnalyticsEvent;
    platforms: string[];
    success: boolean;
  }>;
  platformStatus: {
    ga4: { configured: boolean; enabled: boolean };
    facebook: { configured: boolean; enabled: boolean };
    google_ads: { configured: boolean; enabled: boolean };
  };
}

export type ConsentLevel = "strict" | "functional" | "analytics" | "marketing";

export interface ConsentBannerConfig {
  title: string;
  description: string;
  acceptAllText: string;
  rejectAllText: string;
  customizeText: string;
  privacyPolicyUrl: string;
  cookiePolicyUrl: string;
}

export interface AnalyticsClientOptions {
  consent?: ConsentState;
  userId?: string;
  sessionId?: string;
  debugMode?: boolean;
}

// Utility types for type safety
export type EventName =
  | "page_view"
  | "quote_request"
  | "phone_call"
  | "email_contact"
  | "form_submit"
  | "service_view"
  | "location_view"
  | "contact_form_start"
  | "contact_form_complete"
  | "download"
  | "search"
  | "error";

export type PlatformName = "ga4" | "facebook" | "google_ads";

// Environment variable validation
export interface RequiredEnvVars {
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
  GA4_API_SECRET?: string;
  FACEBOOK_PIXEL_ID?: string;
  FACEBOOK_ACCESS_TOKEN?: string;
  GOOGLE_ADS_CUSTOMER_ID?: string;
  GOOGLE_ADS_CONVERSION_ID?: string;
}
