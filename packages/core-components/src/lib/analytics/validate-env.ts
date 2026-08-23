/**
 * Build-time validation for the analytics/consent feature-flag environment variables.
 *
 * Every one of these flags exists as a matched pair: a server-only variant (read by
 * `proxy.ts` and the analytics API route) and a `NEXT_PUBLIC_` variant (read by client
 * components like `Analytics.tsx` / `ConsentManager.tsx`). Setting only one half is a
 * silent no-op — the code never throws, it just doesn't do the thing the flag was meant
 * to turn on. This check makes that loud at build time instead, before a broken config
 * reaches production. See "Site-Specific Presentation Forks" in docs/standards/analytics.md
 * for the incident this was written to catch.
 *
 * Call `validateAnalyticsEnv()` at the top of a site's `next.config.ts` so it runs on
 * every `next build` (and Vercel deploy). It throws in production builds; in any other
 * `NODE_ENV` it only warns, since local `.env.local` files intentionally carry every flag
 * off or placeholder values.
 */

interface FlagPair {
  server: string;
  client: string;
}

// Flags with both a server-only and a NEXT_PUBLIC_ variant, where the server variant
// genuinely gates different behavior (proxy.ts's server-side tracking calls, or the
// /api/analytics/track route's per-platform dispatch in analytics-route.ts) — the two
// must agree, or one half of the feature silently does nothing.
//
// NEXT_PUBLIC_FEATURE_CONSENT_BANNER deliberately has no server-side pair checked here:
// its server-only counterpart, FEATURE_CONSENT_BANNER, is never read to gate any real
// behavior anywhere in the codebase — only surfaced in the dev-only AnalyticsDebugPanel.
// The banner's actual on/off switch is the NEXT_PUBLIC_ variant alone. Requiring the two
// to match was a false-positive check that broke real, correctly-configured sites; do
// not re-add it without first confirming the server variant gates something.
const FLAG_PAIRS: FlagPair[] = [
  { server: "FEATURE_ANALYTICS_ENABLED", client: "NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED" },
  { server: "FEATURE_GA4_ENABLED", client: "NEXT_PUBLIC_FEATURE_GA4_ENABLED" },
  { server: "FEATURE_FACEBOOK_PIXEL", client: "NEXT_PUBLIC_FEATURE_FACEBOOK_PIXEL" },
  { server: "FEATURE_GOOGLE_ADS", client: "NEXT_PUBLIC_FEATURE_GOOGLE_ADS" },
];

interface CompanionRule {
  /** Only enforced when this flag env var is "true". */
  whenFlag: string;
  /** Vars that must be set (and not a leftover .env.example placeholder) when the flag is on. */
  requires: string[];
}

// Vars that only need a real value once the feature they belong to is switched on —
// mirrors the "set when enabling features above" grouping in sites/*/.env.example.
const COMPANION_RULES: CompanionRule[] = [
  { whenFlag: "NEXT_PUBLIC_FEATURE_GA4_ENABLED", requires: ["NEXT_PUBLIC_GA_MEASUREMENT_ID"] },
  // Not FEATURE_SERVER_TRACKING: that flag only controls whether proxy.ts fires a
  // page-view POST to /api/analytics/track at all. GA4_API_SECRET is only actually
  // read once inside that route, gated on FEATURE_GA4_ENABLED specifically
  // (analytics-route.ts's `if (flags.FEATURE_GA4_ENABLED) { GA4Analytics.fromEnvironment() }`)
  // — a site can legitimately run FEATURE_SERVER_TRACKING for Facebook/Google Ads alone,
  // with GA4 server-tracking off, and never need this var.
  { whenFlag: "FEATURE_GA4_ENABLED", requires: ["GA4_API_SECRET"] },
  { whenFlag: "NEXT_PUBLIC_FEATURE_FACEBOOK_PIXEL", requires: ["NEXT_PUBLIC_FACEBOOK_PIXEL_ID"] },
  { whenFlag: "FEATURE_FACEBOOK_PIXEL", requires: ["FACEBOOK_ACCESS_TOKEN"] },
  { whenFlag: "NEXT_PUBLIC_FEATURE_GOOGLE_ADS", requires: ["NEXT_PUBLIC_GOOGLE_ADS_CUSTOMER_ID"] },
  // Matches analytics-route.ts's `if (flags.FEATURE_GOOGLE_ADS && data.conversion_action)` —
  // the server variant specifically, not the client one (see the GA4_API_SECRET comment above
  // for why that distinction matters).
  { whenFlag: "FEATURE_GOOGLE_ADS", requires: ["GOOGLE_ADS_CUSTOMER_ID"] },
];

function isTrue(name: string): boolean {
  return process.env[name] === "true";
}

function isMissingOrPlaceholder(name: string): boolean {
  const value = process.env[name];
  return !value || value.startsWith("PLACEHOLDER_");
}

export function validateAnalyticsEnv(): void {
  const problems: string[] = [];

  for (const { server, client } of FLAG_PAIRS) {
    const serverOn = isTrue(server);
    const clientOn = isTrue(client);
    if (serverOn !== clientOn) {
      problems.push(
        `${server}=${process.env[server] ?? "(unset)"} but ${client}=${process.env[client] ?? "(unset)"} — ` +
          `these must match. Whichever side is "false" (or unset) makes that half of the feature ` +
          `do nothing, with no error anywhere.`
      );
    }
  }

  for (const { whenFlag, requires } of COMPANION_RULES) {
    if (!isTrue(whenFlag)) continue;
    for (const required of requires) {
      if (isMissingOrPlaceholder(required)) {
        const current = process.env[required];
        problems.push(
          `${whenFlag}=true requires ${required} to be set, but it is ` +
            (current ? `still the placeholder value "${current}".` : "missing.")
        );
      }
    }
  }

  if (problems.length === 0) return;

  const message = [
    "",
    "✖ Analytics/consent environment variable misconfiguration detected:",
    ...problems.map((p) => `  - ${p}`),
    "",
    "See docs/standards/analytics.md for the full list of required variable pairs.",
    "",
  ].join("\n");

  if (process.env.NODE_ENV === "production") {
    throw new Error(message);
  } else {
    console.warn(message);
  }
}
