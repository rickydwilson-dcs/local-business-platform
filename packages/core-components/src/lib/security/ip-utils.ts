/**
 * IP Address Extraction and Validation Utilities
 * Provides secure IP extraction from request headers with validation
 */

// IPv4 pattern: 0-255.0-255.0-255.0-255
const IPV4_PATTERN =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// IPv6 pattern: simplified check for valid hex groups separated by colons
const IPV6_PATTERN = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

// IPv6 compressed pattern: allows :: for zero compression
const IPV6_COMPRESSED_PATTERN =
  /^((?:[0-9a-fA-F]{1,4}:)*)?::((?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4})?$/;

/**
 * Validates if a string is a valid IPv4 or IPv6 address
 * @param ip - The IP address string to validate
 * @returns true if valid IP address, false otherwise
 */
export function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== "string") return false;

  const trimmed = ip.trim();

  // Check IPv4
  if (IPV4_PATTERN.test(trimmed)) return true;

  // Check IPv6 (full or compressed)
  if (IPV6_PATTERN.test(trimmed) || IPV6_COMPRESSED_PATTERN.test(trimmed)) return true;

  // Check IPv4-mapped IPv6 (e.g., ::ffff:192.168.1.1)
  if (trimmed.toLowerCase().startsWith("::ffff:")) {
    const ipv4Part = trimmed.substring(7);
    return IPV4_PATTERN.test(ipv4Part);
  }

  return false;
}

/**
 * Extracts the client IP address from request headers
 * Prioritizes trusted proxy headers (Vercel, Cloudflare) over x-forwarded-for
 *
 * @param request - The incoming request object
 * @returns The client IP address or "unknown" if not determinable
 */
export function extractClientIp(request: Request): string {
  // Priority 1: Vercel sets x-real-ip from the actual client connection
  // This is the most reliable when deployed on Vercel
  const realIp = request.headers.get("x-real-ip");
  if (realIp && isValidIp(realIp)) {
    return realIp.trim();
  }

  // Priority 2: Cloudflare sets cf-connecting-ip
  // This is reliable when behind Cloudflare
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp && isValidIp(cfIp)) {
    return cfIp.trim();
  }

  // Priority 3: x-forwarded-for (can be spoofed, use with caution)
  // Take only the first IP (leftmost = original client)
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const firstIp = xff.split(",")[0].trim();
    if (isValidIp(firstIp)) {
      return firstIp;
    }
  }

  // Fallback: unknown
  return "unknown";
}

/**
 * Creates a rate limit key from an IP address
 * Normalizes IP addresses for consistent rate limiting
 *
 * @param ip - The IP address
 * @param prefix - Optional prefix for the key (default: "rate-limit")
 * @returns A normalized rate limit key
 */
export function createRateLimitKey(ip: string, prefix: string = "rate-limit"): string {
  // Normalize IPv6 to lowercase for consistent keys
  const normalizedIp = ip.toLowerCase().trim();
  return `${prefix}:${normalizedIp}`;
}
