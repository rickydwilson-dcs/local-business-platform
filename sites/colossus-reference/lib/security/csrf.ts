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

// CSRF secret from environment variable or generated fallback
// IMPORTANT: Set CSRF_SECRET in production environment variables
const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString("hex");

// Warn if using generated secret (not persistent across restarts)
if (!process.env.CSRF_SECRET && process.env.NODE_ENV === "production") {
  console.warn(
    "WARNING: CSRF_SECRET not set in environment variables. Using generated secret which will not persist across restarts."
  );
}

/**
 * Token format: {randomValue}.{timestamp}.{signature}
 * - randomValue: 32 bytes of random data (hex encoded)
 * - timestamp: Unix timestamp in seconds
 * - signature: HMAC-SHA256 of randomValue + timestamp
 */

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
export function generateCsrfToken(expiresIn: number = 3600): string {
  const value = crypto.randomBytes(32).toString("hex");
  const timestamp = Math.floor(Date.now() / 1000);

  const payload = `${value}.${timestamp}`;
  const signature = crypto.createHmac("sha256", CSRF_SECRET).update(payload).digest("hex");

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
  const expectedSignature = crypto.createHmac("sha256", CSRF_SECRET).update(payload).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch (error) {
    // timingSafeEqual throws if buffers have different lengths
    return false;
  }
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
