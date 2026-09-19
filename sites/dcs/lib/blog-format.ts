/**
 * Small date-formatting helpers shared by the three `/blog` routes. All
 * three r9 blog designs (`blog-list.html`, `blog-category.html`,
 * `blog-post.html`) express a post's date as either "March 2026" (full
 * month, `.row__m`/`.svc__d` micro-labels) or "Aug 2026" (short month, the
 * `/blog` masthead's "Latest guide" figure) — never the raw ISO string. UTC
 * throughout so a post dated `2026-08-25` never rolls back to 24 August in a
 * non-UTC CI runner.
 *
 * `date` is typed `string` by `BlogFrontmatterSchema`, but `getBlogPosts()`
 * never actually runs frontmatter through Zod's `.parse()` (only casts it —
 * see `packages/core-components/src/lib/content.ts`), and js-yaml's default
 * schema auto-converts an UNQUOTED `date: 2025-07-08` scalar into a real
 * `Date` object at parse time (quoted dates, `date: "2026-08-25"`, stay
 * strings). Five of the 21 `content/blog/*.mdx` files write the date bare —
 * confirmed live: `typeof data.date === 'object'` for those five, `'string'`
 * for the rest. So every helper here accepts `string | Date` and normalises,
 * rather than assuming the type-checker's `string` annotation is honoured at
 * runtime — a template-literal `` `${date}T00:00:00Z` `` on an actual `Date`
 * would stringify via `Date.prototype.toString()` (a non-ISO, locale-shaped
 * string) and silently produce `Invalid Date`.
 */

function parseUtc(date: string | Date): Date {
  if (date instanceof Date) return date;
  return new Date(`${date}T00:00:00Z`);
}

export function formatMonthYear(date: string | Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseUtc(date));
}

export function formatShortMonthYear(date: string | Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseUtc(date));
}

export function yearOf(date: string | Date): number {
  return parseUtc(date).getUTCFullYear();
}

/** "2025" or, when the range spans more than one year, "2025–2026". */
export function formatYearRange(dates: (string | Date)[]): string | null {
  if (dates.length === 0) return null;
  const years = dates.map(yearOf);
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min}–${max}`;
}

/** "5 min" or, when the range spans more than one value, "5–7 min". `null`
 *  when no post in the set declares a `readingTime` — the honest gap five of
 *  the twenty-one posts carry (notes-f.md §3), never estimated. */
export function formatReadingTimeRange(times: (number | undefined)[]): string | null {
  const real = times.filter((t): t is number => typeof t === 'number');
  if (real.length === 0) return null;
  const min = Math.min(...real);
  const max = Math.max(...real);
  return min === max ? `${min} min` : `${min}–${max} min`;
}
