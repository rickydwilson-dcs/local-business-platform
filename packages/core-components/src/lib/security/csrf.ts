/**
 * CSRF (Cross-Site Request Forgery) Protection
 *
 * Implements HMAC-based CSRF token generation and verification
 * to protect API endpoints from CSRF attacks.
 *
 * Security Features:
 * - HMAC-SHA256 signed tokens
 * - Timing-safe comparison to prevent timing attacks
 * - Configurable token expiration
 * - Cryptographically secure random token generation
 *
 * @module lib/security/csrf
 */

import crypto from "crypto";

// CSRF secret — resolved lazily to avoid build-time errors
// IMPORTANT: Set CSRF_SECRET in production environment variables
let _csrfSecret: string | null = null;

function getCsrfSecret(): string {
  if (_csrfSecret) {
    return _csrfSecret;
  }

  if (process.env.CSRF_SECRET) {
    _csrfSecret = process.env.CSRF_SECRET;
    return _csrfSecret;
  }

  if (process.env.NODE_ENV === "production") {
    console.error(
      "CSRF_SECRET environment variable is not set. " +
        "CSRF tokens will not persist across serverless cold starts. " +
        "Set CSRF_SECRET in your deployment environment (e.g., Vercel dashboard)."
    );
  }

  // Fallback: generate per-instance secret (won't persist across cold starts)
  _csrfSecret = crypto.randomBytes(32).toString("hex");
  return _csrfSecret;
}

/**
 * Token format: {randomValue}.{timestamp}.{signature}
 * - randomValue: 32 bytes of random data (hex encoded)
 * - timestamp: Unix timestamp in seconds
 * - signature: HMAC-SHA256 of randomValue + timestamp
 */

// Single-use token enforcement: track used tokens to prevent replay attacks
const usedTokens = new Set<string>();

// Clean up expired tokens periodically (every 5 minutes)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupUsedTokens(maxAge: number): void {
  const now = Math.floor(Date.now() / 1000);
  for (const token of usedTokens) {
    const parts = token.split(".");
    if (parts.length >= 2) {
      const timestamp = parseInt(parts[1], 10);
      if (!isNaN(timestamp) && now - timestamp > maxAge) {
        usedTokens.delete(token);
      }
    }
  }
  lastCleanup = Date.now();
}

interface TokenPayload {
  value: string;
  timestamp: number;
  signature: string;
}

/**
 * Generate a CSRF token
 *
 * Creates a cryptographically secure token that includes:
 * - Random value for uniqueness
 * - Timestamp for expiration checking
 * - HMAC signature for integrity verification
 *
 * @param expiresIn - Token lifetime in seconds (default: 3600 = 1 hour)
 * @returns CSRF token string in format: {value}.{timestamp}.{signature}
 *
 * @example
 * const token = generateCsrfToken();
 * // Returns: "a1b2c3...xyz.1234567890.d4e5f6...abc"
 */
export function generateCsrfToken(_expiresIn: number = 3600): string {
  const value = crypto.randomBytes(32).toString("hex");
  const timestamp = Math.floor(Date.now() / 1000);

  const payload = `${value}.${timestamp}`;
  const signature = crypto.createHmac("sha256", getCsrfSecret()).update(payload).digest("hex");

  return `${value}.${timestamp}.${signature}`;
}

/**
 * Parse a CSRF token into its components
 *
 * @param token - The CSRF token string
 * @returns Parsed token components or null if invalid format
 */
function parseToken(token: string): TokenPayload | null {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [value, timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) {
    return null;
  }

  return { value, timestamp, signature };
}

/**
 * Verify a CSRF token
 *
 * Validates that:
 * 1. Token format is correct
 * 2. Signature is valid (prevents tampering)
 * 3. Token has not expired
 *
 * Uses timing-safe comparison to prevent timing attacks.
 *
 * @param token - The CSRF token to verify
 * @param maxAge - Maximum token age in seconds (default: 3600 = 1 hour)
 * @returns true if token is valid, false otherwise
 *
 * @example
 * if (verifyCsrfToken(token)) {
 *   // Token is valid, process request
 * } else {
 *   // Token is invalid, reject request
 * }
 */
export function verifyCsrfToken(token: string, maxAge: number = 3600): boolean {
  const parsed = parseToken(token);

  if (!parsed) {
    return false;
  }

  const { value, timestamp, signature } = parsed;

  // Check token expiration
  const now = Math.floor(Date.now() / 1000);
  const age = now - timestamp;

  if (age > maxAge || age < 0) {
    // Token expired or timestamp is in the future
    return false;
  }

  // Verify signature using timing-safe comparison
  const payload = `${value}.${timestamp}`;
  const expectedSignature = crypto
    .createHmac("sha256", getCsrfSecret())
    .update(payload)
    .digest("hex");

  let signatureValid: boolean;
  try {
    signatureValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    // timingSafeEqual throws if buffers have different lengths
    return false;
  }

  if (!signatureValid) {
    return false;
  }

  // Single-use enforcement: reject already-used tokens
  if (usedTokens.has(token)) {
    return false;
  }

  // Mark token as used
  usedTokens.add(token);

  // Periodically clean up expired tokens
  if (Date.now() - lastCleanup > CLEANUP_INTERVAL_MS) {
    cleanupUsedTokens(maxAge);
  }

  return true;
}

/**
 * Extract CSRF token from request headers
 *
 * Checks multiple common header locations:
 * - x-csrf-token (preferred)
 * - x-xsrf-token (alternative)
 *
 * @param request - The HTTP request object
 * @returns CSRF token string or null if not found
 */
export function extractCsrfToken(request: Request): string | null {
  // Check standard CSRF header
  const csrfHeader = request.headers.get("x-csrf-token");
  if (csrfHeader) {
    return csrfHeader;
  }

  // Check alternative XSRF header (used by some frameworks)
  const xsrfHeader = request.headers.get("x-xsrf-token");
  if (xsrfHeader) {
    return xsrfHeader;
  }

  return null;
}

/**
 * Middleware-style CSRF validation helper
 *
 * Validates CSRF token from request and returns standardized error response.
 *
 * @param request - The HTTP request object
 * @param maxAge - Maximum token age in seconds (default: 3600 = 1 hour)
 * @returns Response object if validation fails, null if validation passes
 *
 * @example
 * export async function POST(request: Request) {
 *   const csrfError = validateCsrfToken(request);
 *   if (csrfError) {
 *     return csrfError; // Return 403 error response
 *   }
 *   // Continue with request processing
 * }
 */
export function validateCsrfToken(request: Request, maxAge: number = 3600): Response | null {
  const token = extractCsrfToken(request);

  if (!token) {
    return Response.json(
      {
        error: "Missing CSRF token",
        message: "CSRF token is required. Include x-csrf-token header.",
      },
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (!verifyCsrfToken(token, maxAge)) {
    return Response.json(
      {
        error: "Invalid CSRF token",
        message: "CSRF token is invalid or expired.",
      },
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return null;
}
