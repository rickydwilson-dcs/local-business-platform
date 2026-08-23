import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { validateAnalyticsEnv } from "../validate-env";

const ENV_KEYS = [
  "NODE_ENV",
  "FEATURE_ANALYTICS_ENABLED",
  "NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED",
  "FEATURE_GA4_ENABLED",
  "NEXT_PUBLIC_FEATURE_GA4_ENABLED",
  "FEATURE_SERVER_TRACKING",
  "GA4_API_SECRET",
  "NEXT_PUBLIC_GA_MEASUREMENT_ID",
  "FEATURE_CONSENT_BANNER",
  "NEXT_PUBLIC_FEATURE_CONSENT_BANNER",
  "FEATURE_FACEBOOK_PIXEL",
  "NEXT_PUBLIC_FEATURE_FACEBOOK_PIXEL",
  "NEXT_PUBLIC_FACEBOOK_PIXEL_ID",
  "FACEBOOK_ACCESS_TOKEN",
  "FEATURE_GOOGLE_ADS",
  "NEXT_PUBLIC_FEATURE_GOOGLE_ADS",
  "NEXT_PUBLIC_GOOGLE_ADS_CUSTOMER_ID",
  "GOOGLE_ADS_CUSTOMER_ID",
];

let originalEnv: Record<string, string | undefined>;

beforeEach(() => {
  originalEnv = {};
  for (const key of ENV_KEYS) {
    originalEnv[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
});

describe("validateAnalyticsEnv", () => {
  it("throws in production when NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED is missing but the server flag is true (today's DCS incident)", () => {
    process.env.NODE_ENV = "production";
    process.env.FEATURE_ANALYTICS_ENABLED = "true";
    // NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED intentionally left unset

    expect(() => validateAnalyticsEnv()).toThrowError(/FEATURE_ANALYTICS_ENABLED/);
  });

  it("throws when NEXT_PUBLIC_FEATURE_GA4_ENABLED is missing but the server flag is true", () => {
    process.env.NODE_ENV = "production";
    process.env.FEATURE_ANALYTICS_ENABLED = "true";
    process.env.NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED = "true";
    process.env.FEATURE_GA4_ENABLED = "true";
    // NEXT_PUBLIC_FEATURE_GA4_ENABLED intentionally left unset

    expect(() => validateAnalyticsEnv()).toThrowError(/FEATURE_GA4_ENABLED/);
  });

  it("throws when GA4 is fully enabled but NEXT_PUBLIC_GA_MEASUREMENT_ID is a placeholder", () => {
    process.env.NODE_ENV = "production";
    process.env.FEATURE_ANALYTICS_ENABLED = "true";
    process.env.NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED = "true";
    process.env.FEATURE_GA4_ENABLED = "true";
    process.env.NEXT_PUBLIC_FEATURE_GA4_ENABLED = "true";
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "PLACEHOLDER_ADD_GA_ID";

    expect(() => validateAnalyticsEnv()).toThrowError(/NEXT_PUBLIC_GA_MEASUREMENT_ID/);
  });

  it("only warns (does not throw) outside production, even with the same mismatch", () => {
    process.env.NODE_ENV = "development";
    process.env.FEATURE_ANALYTICS_ENABLED = "true";
    // NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED intentionally left unset

    expect(() => validateAnalyticsEnv()).not.toThrow();
  });

  it("passes cleanly when every flag pair matches and companion vars are real", () => {
    process.env.NODE_ENV = "production";
    process.env.FEATURE_ANALYTICS_ENABLED = "true";
    process.env.NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED = "true";
    process.env.FEATURE_GA4_ENABLED = "true";
    process.env.NEXT_PUBLIC_FEATURE_GA4_ENABLED = "true";
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-BENN120VSS";
    process.env.FEATURE_SERVER_TRACKING = "true";
    process.env.GA4_API_SECRET = "real-secret-value-1234567890";

    expect(() => validateAnalyticsEnv()).not.toThrow();
  });

  it("passes cleanly when every flag is off (the default .env.example state)", () => {
    process.env.NODE_ENV = "production";
    // everything left unset/false — no flags on, nothing required

    expect(() => validateAnalyticsEnv()).not.toThrow();
  });

  it("does not require FEATURE_CONSENT_BANNER to match NEXT_PUBLIC_FEATURE_CONSENT_BANNER — regression test for the colossus-scaffolding/npracing-v1/v3 incident", () => {
    // The server-side FEATURE_CONSENT_BANNER var is never read to gate any real behavior
    // (only surfaced in the dev-only AnalyticsDebugPanel) — the banner's actual on/off
    // switch is NEXT_PUBLIC_FEATURE_CONSENT_BANNER alone. Requiring the two to match was
    // a false positive that broke three real, correctly-configured production builds.
    process.env.NODE_ENV = "production";
    process.env.NEXT_PUBLIC_FEATURE_CONSENT_BANNER = "true";
    // FEATURE_CONSENT_BANNER intentionally left unset — this is a valid, working config

    expect(() => validateAnalyticsEnv()).not.toThrow();
  });
});
