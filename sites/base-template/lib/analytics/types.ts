/**
 * Analytics Types - Stub for base-template
 *
 * Provides type-compatible exports required by shared analytics components.
 * These types match the analytics system used in production sites.
 */

export interface AnalyticsEvent {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
}

export interface PageViewEvent {
  path: string;
  title: string;
  referrer?: string;
}

export interface ConversionEvent extends AnalyticsEvent {
  conversionId?: string;
  transactionId?: string;
}

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface FeatureFlags {
  enableGA4: boolean;
  enableFacebookPixel: boolean;
  enableGoogleAds: boolean;
  enableDebugPanel: boolean;
}

export interface AnalyticsConfig {
  ga4MeasurementId?: string;
  facebookPixelId?: string;
  googleAdsId?: string;
  featureFlags: FeatureFlags;
}

export interface GA4Event {
  name: string;
  params?: Record<string, unknown>;
}

export interface FacebookPixelEvent {
  name: string;
  params?: Record<string, unknown>;
}

export interface GoogleAdsConversion {
  conversionId: string;
  conversionLabel: string;
  value?: number;
  currency?: string;
}

export interface AnalyticsResponse {
  success: boolean;
  error?: string;
}

export interface DebugPanelData {
  events: AnalyticsEvent[];
  consent: ConsentState;
  config: AnalyticsConfig;
}

export type ConsentLevel = 'strict' | 'functional' | 'analytics' | 'marketing';

export interface ConsentBannerConfig {
  title: string;
  description: string;
  acceptAllLabel: string;
  rejectAllLabel: string;
  customizeLabel: string;
}

export interface AnalyticsClientOptions {
  debug?: boolean;
  dryRun?: boolean;
}

export type EventName = string;
export type PlatformName = 'ga4' | 'facebook' | 'google_ads';

export interface RequiredEnvVars {
  GA4_MEASUREMENT_ID?: string;
  FACEBOOK_PIXEL_ID?: string;
  GOOGLE_ADS_ID?: string;
}
