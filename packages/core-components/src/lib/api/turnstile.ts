/**
 * Cloudflare Turnstile server-side verification.
 *
 * Endpoint, field names and error codes verified against Cloudflare's
 * "Server-side validation" docs (October 2026): POST
 * https://challenges.cloudflare.com/turnstile/v0/siteverify with `secret` and
 * `response`; a token is valid for 300s and single-use (a replay returns
 * `timeout-or-duplicate`).
 *
 * Fails CLOSED on a definitive "no" (missing token, `success: false`) and OPEN
 * only when Cloudflare itself can't be reached (network error, timeout, 5xx).
 * A Cloudflare outage must not take every client's lead form down with it, and
 * a bot has no way of causing one. The degraded path is reported to the caller
 * so it can be logged.
 */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 4000;

export type TurnstileResult =
  | { ok: true; degraded?: false }
  | { ok: true; degraded: true; reason: string }
  | { ok: false; reason: "missing-token" | "rejected"; errorCodes: string[] };

export async function verifyTurnstile(
  token: unknown,
  secret: string,
  ip?: string
): Promise<TurnstileResult> {
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return { ok: false, reason: "missing-token", errorCodes: [] };
  }

  const form = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "unknown") form.set("remoteip", ip);

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status >= 500) {
      return { ok: true, degraded: true, reason: `siteverify HTTP ${res.status}` };
    }
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (data.success === true) return { ok: true };

    const errorCodes = data["error-codes"] ?? [];
    // A bad/missing SECRET is our misconfiguration, not the visitor's fault.
    // Don't lock every real customer out of the form because of it.
    if (
      errorCodes.includes("invalid-input-secret") ||
      errorCodes.includes("missing-input-secret")
    ) {
      return { ok: true, degraded: true, reason: errorCodes.join(",") };
    }
    return { ok: false, reason: "rejected", errorCodes };
  } catch (error) {
    return {
      ok: true,
      degraded: true,
      reason: error instanceof Error ? error.message : "siteverify unreachable",
    };
  }
}

/**
 * A real enquiry always contains words. The bot wave hitting Colossus in
 * October 2026 posted random-letter names and subjects with a ten-digit number
 * as the message body — no letters at all — so "message has no letters" is a
 * narrow rule with essentially no false-positive surface (a phone number alone
 * is not an enquiry). Needs no keys, so it protects a site before Turnstile
 * is configured for it.
 */
export function isJunkMessage(message: string): boolean {
  return message.length > 0 && !/\p{L}/u.test(message);
}
