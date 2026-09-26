import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

/**
 * The Grid Box CTA family.
 *
 * `ArrowButton` is the pill button with a trailing arrow used for every
 * primary/secondary action. `ArrowTextLink` is the lighter uppercase text
 * link with a red arrow ("Read the full story →").
 *
 * External destinations render a plain <a> with target/rel and swap the
 * arrow for an external-link glyph, so it is visually obvious that the link
 * leaves the site.
 */

export type ArrowButtonVariant = 'primary' | 'secondary' | 'on-brand';

const VARIANT_CLASS: Record<ArrowButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  'on-brand': 'btn-on-brand-primary-outline',
};

export interface ArrowButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: ArrowButtonVariant;
  /** Renders as <a target="_blank"> with an external-link icon. */
  external?: boolean;
  /** Accessible suffix appended for external links, e.g. "at The Clothing Kings". */
  externalLabel?: string;
  className?: string;
}

export function ArrowButton({
  href,
  children,
  variant = 'primary',
  external = false,
  externalLabel,
  className,
}: ArrowButtonProps) {
  const classes = [VARIANT_CLASS[variant], className].filter(Boolean).join(' ');

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        <span>{children}</span>
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">
          {externalLabel ? `${externalLabel} (opens in a new tab)` : '(opens in a new tab)'}
        </span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      <span>{children}</span>
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

export interface ArrowTextLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  externalLabel?: string;
  className?: string;
}

const TEXT_LINK_CLASS =
  'inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-surface-foreground hover:text-brand-accent transition-colors';

export function ArrowTextLink({
  href,
  children,
  external = false,
  externalLabel,
  className,
}: ArrowTextLinkProps) {
  const classes = [TEXT_LINK_CLASS, className].filter(Boolean).join(' ');

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        <span>{children}</span>
        <ExternalLink className="h-3.5 w-3.5 text-brand-accent" aria-hidden="true" />
        <span className="sr-only">
          {externalLabel ? `${externalLabel} (opens in a new tab)` : '(opens in a new tab)'}
        </span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      <span>{children}</span>
      <ArrowRight className="h-3.5 w-3.5 text-brand-accent" aria-hidden="true" />
    </Link>
  );
}
