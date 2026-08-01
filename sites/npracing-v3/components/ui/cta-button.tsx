import Link from 'next/link';
import { ArrowRightIcon, ExternalLinkIcon } from '@/components/ui/icons';

/**
 * CtaButton — the squared-off button of the "Number 51" design: uppercase
 * Barlow label plus a small icon chip that nudges on hover.
 *
 * External links get `target="_blank" rel="noopener noreferrer"`, a visible
 * external-link glyph instead of the arrow, and screen-reader text saying the
 * link opens on another site — the visual cue and the announced cue match.
 */
export interface CtaButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'on-brand';
  external?: boolean;
  /** Where an external link leads, e.g. "The Clothing Kings". */
  externalSiteName?: string;
  fullWidth?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<NonNullable<CtaButtonProps['variant']>, string> = {
  primary: 'bg-brand-primary text-on-brand-primary border-transparent hover:bg-brand-accent',
  ghost:
    'bg-transparent text-surface-foreground border-surface-card-border hover:border-surface-foreground',
  'on-brand': 'bg-transparent text-on-brand-primary border-current hover:bg-white/10',
};

// Translucent chips use Tailwind's white scale rather than an opacity modifier
// on a themed colour — in Tailwind 3 the `/opacity` syntax can't be applied to
// a token whose value is a bare `var()`.
const CHIP_CLASSES: Record<NonNullable<CtaButtonProps['variant']>, string> = {
  primary: 'bg-white/20',
  ghost: 'bg-white/10',
  'on-brand': 'bg-white/20',
};

export function CtaButton({
  href,
  children,
  variant = 'primary',
  external = false,
  externalSiteName,
  fullWidth = false,
  className = '',
}: CtaButtonProps) {
  const classes = [
    'group inline-flex items-center gap-2.5 border font-sans font-bold text-sm uppercase tracking-[0.04em]',
    'py-3 pl-5 pr-3 transition-colors duration-normal',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent',
    VARIANT_CLASSES[variant],
    fullWidth ? 'w-full justify-center' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={`grid h-8 w-8 flex-none place-items-center transition-transform duration-slow group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0 ${CHIP_CLASSES[variant]}`}
      >
        {external ? <ExternalLinkIcon /> : <ArrowRightIcon />}
      </span>
      {external && (
        <span className="sr-only">
          {externalSiteName ? ` (opens ${externalSiteName} in a new tab)` : ' (opens in a new tab)'}
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
