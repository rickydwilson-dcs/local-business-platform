import Link from 'next/link';

export interface SiteFooterProps {
  logoText?: string;
  logoSrc?: string;
  logoAlt?: string;
  tagline?: string;
  navColumns?: { heading: string; links: { label: string; href: string }[] }[];
  contact?: { email?: string; phone?: string };
  legal?: { privacyHref?: string; termsHref?: string; cookiesHref?: string };
  copyright?: string;
}

/**
 * r9 rebrand of the inner-page footer. Uses the same dark-surface pairing
 * (`bg-surface-inverse` / `text-surface-inverse-foreground`) that
 * `site-header.tsx`'s mobile nav panel already established for this rebrand,
 * plus `text-brand-accent` (aqua) for headings/hover and `bg-brand-primary`
 * (magenta) for the top signature line — all theme tokens, no hardcoded hex.
 */
export function SiteFooter({
  logoText = 'DCS',
  logoSrc,
  logoAlt,
  tagline,
  navColumns = [],
  contact,
  legal,
  copyright,
}: SiteFooterProps) {
  return (
    <footer className="bg-surface-inverse text-surface-inverse-foreground">
      {/* Signature line */}
      <div className="h-[3px] bg-brand-primary" />

      <div className="max-w-[1200px] mx-auto px-6 py-16 sm:py-20">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-14">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt={logoAlt ?? logoText}
                width={140}
                height={48}
                loading="lazy"
                style={{
                  height: '40px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            ) : (
              <span className="block font-heading text-2xl font-bold tracking-tight mb-3">
                {logoText}
              </span>
            )}
            {tagline && (
              <p className="mt-4 max-w-[280px] font-sans text-sm leading-relaxed text-surface-inverse-foreground/70">
                {tagline}
              </p>
            )}
          </div>

          {/* Nav columns */}
          {navColumns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-brand-accent mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-surface-inverse-foreground/70 transition-colors hover:text-brand-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          {contact && (contact.email || contact.phone) && (
            <div>
              <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-brand-accent mb-4">
                Contact
              </h3>
              <div className="space-y-2.5 font-sans text-sm text-surface-inverse-foreground/70">
                {contact.phone && (
                  <div>
                    <Link
                      href={`tel:${contact.phone.replace(/\s/g, '')}`}
                      className="transition-colors hover:text-brand-accent"
                    >
                      {contact.phone}
                    </Link>
                  </div>
                )}
                {contact.email && (
                  <div>
                    <Link
                      href={`mailto:${contact.email}`}
                      className="transition-colors hover:text-brand-accent"
                    >
                      {contact.email}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface-inverse-foreground/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-surface-inverse-foreground/60">
          <p>{copyright ?? `© ${new Date().getFullYear()} ${logoText}. All rights reserved.`}</p>

          {legal && (
            <div className="flex gap-6">
              {legal.privacyHref && (
                <Link
                  href={legal.privacyHref}
                  className="transition-colors hover:text-brand-accent"
                >
                  Privacy Policy
                </Link>
              )}
              {legal.termsHref && (
                <Link href={legal.termsHref} className="transition-colors hover:text-brand-accent">
                  Terms
                </Link>
              )}
              {legal.cookiesHref && (
                <Link
                  href={legal.cookiesHref}
                  className="transition-colors hover:text-brand-accent"
                >
                  Cookies
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
