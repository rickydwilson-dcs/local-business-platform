/**
 * Analytics Components Export Index
 * Centralized exports for all analytics-related components and hooks
 */

export { ConsentManager, useConsent } from './ConsentManager';
export { Analytics, useAnalytics } from './Analytics';
export { AnalyticsDebugPanel, AnalyticsStatus } from './AnalyticsDebugPanel';

// Re-export types for convenience
export type {
  AnalyticsEvent,
  ConsentState,
  FeatureFlags,
  AnalyticsResponse,
  ConversionEvent,
  DebugPanelData,
} from '@/lib/analytics/types';