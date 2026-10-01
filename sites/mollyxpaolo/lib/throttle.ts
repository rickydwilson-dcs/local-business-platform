/**
 * Slows down passcode guessing. Five wrong attempts from one IP within ten minutes locks that IP
 * out for the rest of the window.
 *
 * In-memory on purpose: on Vercel each function instance keeps its own map, so this is a
 * per-instance brake rather than a global limit. For a family gallery behind a signed-link-first
 * flow that's enough to stop casual guessing without adding a store.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILURES = 5;

const failures = new Map<string, { count: number; first: number }>();

export function isLockedOut(ip: string, now = Date.now()): boolean {
  const f = failures.get(ip);
  if (!f) return false;
  if (now - f.first > WINDOW_MS) {
    failures.delete(ip);
    return false;
  }
  return f.count >= MAX_FAILURES;
}

export function recordFailure(ip: string, now = Date.now()): void {
  const f = failures.get(ip);
  if (!f || now - f.first > WINDOW_MS) failures.set(ip, { count: 1, first: now });
  else f.count++;
}

export function clearFailures(ip: string): void {
  failures.delete(ip);
}

export function clientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown'
  );
}
