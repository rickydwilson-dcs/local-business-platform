/**
 * CSRF Token Management
 *
 * Provides token generation and validation for form submissions.
 * Uses crypto for secure random token generation.
 */

import { cookies } from 'next/headers';

const CSRF_COOKIE_NAME = 'csrf_token';
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

interface CSRFTokenData {
  token: string;
  expires: number;
}

/**
 * Generate a cryptographically secure random token
 */
function generateRandomToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a new CSRF token and store it in a cookie
 */
export async function generateCSRFToken(): Promise<CSRFTokenData> {
  const token = generateRandomToken();
  const expires = Date.now() + TOKEN_EXPIRY_MS;

  const tokenData: CSRFTokenData = { token, expires };

  // Store in HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, JSON.stringify(tokenData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_EXPIRY_MS / 1000,
    path: '/',
  });

  return tokenData;
}

/**
 * Validate a CSRF token against the stored cookie value
 */
export async function validateCSRFToken(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  const cookieStore = await cookies();
  const storedValue = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  if (!storedValue) {
    return false;
  }

  try {
    const storedData: CSRFTokenData = JSON.parse(storedValue);

    // Check if token has expired
    if (Date.now() > storedData.expires) {
      await clearCSRFToken();
      return false;
    }

    // Timing-safe comparison to prevent side-channel attacks
    const storedBuf = Buffer.from(storedData.token);
    const providedBuf = Buffer.from(token);
    if (storedBuf.length !== providedBuf.length) {
      return false;
    }
    const { timingSafeEqual } = await import('crypto');
    if (!timingSafeEqual(storedBuf, providedBuf)) {
      return false;
    }

    // Invalidate token after successful use (single-use)
    await clearCSRFToken();
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear the CSRF token cookie
 */
export async function clearCSRFToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CSRF_COOKIE_NAME);
}

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

// IPv4 pattern: 0-255.0-255.0-255.0-255
const IPV4_PATTERN =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// IPv6 pattern: valid hex groups separated by colons
const IPV6_PATTERN = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

// IPv6 compressed pattern: allows :: for zero compression
const IPV6_COMPRESSED_PATTERN =
  /^((?:[0-9a-fA-F]{1,4}:)*)?::((?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4})?$/;

/**
 * Validates if a string looks like a valid IPv4 or IPv6 address
 */
function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return false;

  const trimmed = ip.trim();

  if (IPV4_PATTERN.test(trimmed)) return true;
  if (IPV6_PATTERN.test(trimmed) || IPV6_COMPRESSED_PATTERN.test(trimmed)) return true;

  // IPv4-mapped IPv6 (e.g., ::ffff:192.168.1.1)
  if (trimmed.toLowerCase().startsWith('::ffff:')) {
    const ipv4Part = trimmed.substring(7);
    return IPV4_PATTERN.test(ipv4Part);
  }

  return false;
}

/**
 * Extract client IP from request headers
 *
 * Prioritizes trusted proxy headers over x-forwarded-for to prevent
 * IP spoofing. Validates extracted values against IP address patterns.
 */
export function getClientIP(headers: Headers): string {
  // Priority 1: x-real-ip — set by Vercel from the actual client connection
  const realIP = headers.get('x-real-ip');
  if (realIP && isValidIp(realIP)) {
    return realIP.trim();
  }

  // Priority 2: cf-connecting-ip — set by Cloudflare from the client connection
  const cfIP = headers.get('cf-connecting-ip');
  if (cfIP && isValidIp(cfIP)) {
    return cfIP.trim();
  }

  // Priority 3: x-forwarded-for — can be spoofed, checked last
  // Take only the first IP (leftmost = original client)
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (isValidIp(firstIp)) {
      return firstIp;
    }
  }

  return 'unknown';
}
