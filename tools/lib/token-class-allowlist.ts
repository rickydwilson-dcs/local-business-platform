/**
 * Token Class Allowlist
 *
 * Validates that generated components only use standard theme tokens
 * and standard Tailwind utility classes. Prevents AI from inventing
 * non-existent colour class names like "bg-brand-dark-purple".
 */

// ── Allowed colour-related CSS class prefixes ────────────────────────────────

export const ALLOWED_COLOR_PREFIXES = new Set([
  "bg-brand-primary",
  "bg-brand-secondary",
  "bg-brand-accent",
  "bg-surface-background",
  "bg-surface-foreground",
  "bg-surface-muted",
  "bg-surface-inverse",
  "text-brand-primary",
  "text-brand-secondary",
  "text-brand-accent",
  "text-surface-foreground",
  "text-surface-background",
  "text-surface-muted",
  "text-surface-secondary-foreground",
  "text-surface-muted-foreground",
  "text-on-brand-primary",
  "text-on-brand-secondary",
  "border-brand-primary",
  "border-brand-secondary",
  "border-brand-accent",
  "border-surface-muted",
  "border-surface-foreground",
  "ring-brand-primary",
  "ring-brand-secondary",
  "divide-surface-muted",
  "bg-success",
  "bg-warning",
  "bg-error",
  "bg-info",
  "text-success",
  "text-warning",
  "text-error",
  "text-info",
]);

// ── Typography token classes ─────────────────────────────────────────────────

const TYPOGRAPHY_TOKENS = new Set([
  "text-h1",
  "text-h2",
  "text-h3",
  "text-h4",
  "text-hero",
  "text-body",
  "text-small",
  "text-caption",
  "text-subtitle",
  "heading-hero",
  "heading-section",
  "heading-card",
]);

// ── Utility token classes ────────────────────────────────────────────────────

const UTILITY_TOKENS = new Set([
  "btn-primary",
  "btn-secondary",
  "btn-ghost",
  "card",
  "card-interactive",
  "section",
  "section-compact",
  "container-narrow",
  "container-standard",
]);

// ── Standard Tailwind prefixes (non-colour) ──────────────────────────────────

export const STANDARD_TAILWIND_PREFIXES = new Set([
  "p-", "px-", "py-", "pt-", "pb-", "pl-", "pr-",
  "m-", "mx-", "my-", "mt-", "mb-", "ml-", "mr-", "-m",
  "w-", "h-", "min-w-", "min-h-", "max-w-", "max-h-",
  "flex", "grid", "block", "inline", "hidden", "table",
  "items-", "justify-", "self-", "place-",
  "gap-", "space-x-", "space-y-",
  "text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl",
  "text-3xl", "text-4xl", "text-5xl", "text-6xl", "text-7xl", "text-8xl", "text-9xl",
  "text-left", "text-center", "text-right", "text-justify",
  "font-thin", "font-light", "font-normal", "font-medium",
  "font-semibold", "font-bold", "font-extrabold", "font-black",
  "leading-", "tracking-", "line-clamp-",
  "bg-white", "bg-black", "bg-transparent", "bg-current",
  "bg-gradient-", "from-", "via-", "to-",
  "border", "border-", "rounded", "rounded-",
  "shadow", "shadow-",
  "absolute", "relative", "fixed", "sticky", "static",
  "inset-", "top-", "bottom-", "left-", "right-",
  "z-", "overflow-", "opacity-",
  "transition", "duration-", "ease-", "delay-",
  "col-", "row-", "grid-cols-", "grid-rows-", "auto-cols-", "auto-rows-",
  "aspect-", "object-", "cursor-",
  "divide-", "ring-", "outline-",
  "sr-only", "not-sr-only",
  "container", "mx-auto",
  "truncate", "whitespace-", "break-",
  "transform", "scale-", "rotate-", "translate-", "skew-",
  "animate-", "group", "peer",
  "list-", "decoration-", "underline", "no-underline",
  "accent-", "caret-",
  "snap-", "scroll-", "touch-",
  "select-", "resize", "appearance-",
  "will-change-", "content-",
  "columns-",
  "text-wrap", "text-nowrap", "text-balance", "text-pretty",
]);

// ── Responsive and state prefix stripping ────────────────────────────────────

const MODIFIER_REGEX = /^(?:sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|focus-within:|focus-visible:|disabled:|group-hover:|group-focus:|peer-hover:|peer-focus:|dark:|first:|last:|odd:|even:|placeholder:|aria-|data-)+/;

function stripModifiers(cls: string): string {
  return cls.replace(MODIFIER_REGEX, "");
}

// ── Colour class detection ───────────────────────────────────────────────────

const COLOR_CLASS_REGEX = /^(?:bg|text|border|ring|divide|from|via|to|outline|shadow|accent|caret|fill|stroke|decoration)-/;

/**
 * Detect if a class name looks like it's colour-related.
 */
export function looksLikeColorClass(className: string): boolean {
  const stripped = stripModifiers(className);
  return COLOR_CLASS_REGEX.test(stripped);
}

// ── Main check function ──────────────────────────────────────────────────────

/**
 * Check if a Tailwind class is in the allowed set.
 *
 * Returns true for:
 * - Known theme colour tokens
 * - Typography tokens
 * - Utility tokens
 * - Standard Tailwind utility classes
 * - Arbitrary value classes (e.g. w-[100px])
 * - Negative value classes (e.g. -mt-4)
 */
export function isAllowedClass(className: string): boolean {
  if (!className || className.trim() === "") return true;

  const stripped = stripModifiers(className.trim());
  if (!stripped) return true;

  // Check exact theme colour tokens
  if (ALLOWED_COLOR_PREFIXES.has(stripped)) return true;

  // Check typography tokens
  if (TYPOGRAPHY_TOKENS.has(stripped)) return true;

  // Check utility tokens
  if (UTILITY_TOKENS.has(stripped)) return true;

  // Check standard Tailwind prefixes
  for (const prefix of STANDARD_TAILWIND_PREFIXES) {
    if (stripped.startsWith(prefix) || stripped === prefix) return true;
  }

  // Allow arbitrary value classes
  if (stripped.includes("[") && stripped.includes("]")) return true;

  // Allow negated utility classes (e.g. -mt-4, -translate-x-1/2)
  if (stripped.startsWith("-") && stripped.length > 1) {
    const withoutNeg = stripped.slice(1);
    for (const prefix of STANDARD_TAILWIND_PREFIXES) {
      if (withoutNeg.startsWith(prefix)) return true;
    }
  }

  // If it looks like a colour class but isn't in our allowlist, reject it
  if (looksLikeColorClass(stripped)) return false;

  // Allow other classes that don't look colour-related
  // (custom utility classes defined in globals.css, etc.)
  return true;
}
