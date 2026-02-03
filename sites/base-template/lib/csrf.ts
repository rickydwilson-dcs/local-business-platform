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

    // Check if token matches
    if (storedData.token !== token) {
      return false;
    }

    // Check if token has expired
    if (Date.now() > storedData.expires) {
      return false;
    }

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

/**
 * Extract client IP from request headers
 */
export function getClientIP(headers: Headers): string {
  // Check common proxy headers
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP if multiple are present
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Vercel-specific header
  const vercelIP = headers.get('x-vercel-forwarded-for');
  if (vercelIP) {
    return vercelIP.split(',')[0].trim();
  }

  return 'unknown';
}
