/**
 * Consent State Schema and Validation
 * Provides type-safe validation for analytics consent cookies
 */

import { z } from "zod";
import type { ConsentState as BaseConsentState } from "./types";

/**
 * Schema for validating consent state from cookies
 * Matches the ConsentState interface in types.ts
 */
export const ConsentSchema = z.object({
  analytics: z.boolean(),
  marketing: z.boolean(),
  functional: z.boolean(),
  timestamp: z.number(),
  version: z.string(),
});

// Re-export the type from types.ts for consistency
export type ConsentState = BaseConsentState;

/**
 * Parses and validates consent state from a cookie value
 * Returns null if the cookie is missing, malformed, or fails validation
 *
 * @param cookieValue - The raw cookie value (URL-encoded JSON string)
 * @returns Validated ConsentState object or null if invalid
 */
export function parseConsent(cookieValue?: string): ConsentState | null {
  if (!cookieValue) return null;

  try {
    const decoded = decodeURIComponent(cookieValue);
    const parsed = JSON.parse(decoded);
    return ConsentSchema.parse(parsed);
  } catch {
    // Invalid JSON, failed decoding, or schema validation failure
    return null;
  }
}

/**
 * Checks if analytics consent has been granted
 *
 * @param consent - The validated consent state
 * @returns true if analytics consent is granted
 */
export function hasAnalyticsConsent(consent: ConsentState | null): boolean {
  return consent?.analytics === true;
}

/**
 * Checks if marketing consent has been granted
 *
 * @param consent - The validated consent state
 * @returns true if marketing consent is granted
 */
export function hasMarketingConsent(consent: ConsentState | null): boolean {
  return consent?.marketing === true;
}
