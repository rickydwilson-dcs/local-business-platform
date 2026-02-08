/**
 * Analytics Types — re-exports from core-components.
 * Required because shared analytics components import from @/lib/analytics/types.
 */
export {
  type AnalyticsEvent,
  type PageViewEvent,
  type ConversionEvent,
  type ConsentState,
  type FeatureFlags,
  type AnalyticsConfig,
  type GA4Event,
  type FacebookPixelEvent,
  type GoogleAdsConversion,
  type AnalyticsResponse,
  type DebugPanelData,
  type ConsentLevel,
  type ConsentBannerConfig,
  type AnalyticsClientOptions,
  type EventName,
  type PlatformName,
  type RequiredEnvVars,
} from "@platform/core-components/lib/analytics/types";
