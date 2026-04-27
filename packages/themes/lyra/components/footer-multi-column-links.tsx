/**
 * SiteFooter
 *
 * Site-wide footer with contact details, company links, quick links, legal info, partnership logos and social media icons
 * Layout: Dark background multi-column grid: contact, company, quick links, small bits columns; bottom bar with company number, certifications and social icons
 * Category: Footer
 */

export interface SiteFooterProps {
  /** contact-column */
  contactColumn?: {
    heading?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  /** company-column */
  companyColumn?: {
    heading?: string;
    links?: { label?: string; href?: string }[];
  };
  /** quick-links-column */
  quickLinksColumn?: {
    heading?: string;
    links?: { label?: string; href?: string }[];
  };
  /** small-bits-column */
  smallBitsColumn?: {
    heading?: string;
    body?: string;
    links?: { label?: string; href?: string }[];
  };
  /** company-number */
  companyNumber?: number;
  /** partnership-logos */
  partnershipLogos?: { src?: string; alt?: string; href?: string }[];
  /** social-icons */
  socialIcons?: { href?: string; label?: string; svg?: string }[];
  /** copyright */
  copyright?: string;
}

export function SiteFooter(props: SiteFooterProps) {
  return (
    <footer className="bg-surface-inverse text-surface-background">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Contact Column */}
          <div>
            {props.contactColumn?.heading && (
              <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                {props.contactColumn.heading}
              </h3>
            )}
            {props.contactColumn?.address && (
              <address className="not-italic text-surface-muted-foreground text-sm leading-relaxed mb-3">
                {props.contactColumn.address}
              </address>
            )}
            {props.contactColumn?.phone && (
              <p className="text-surface-muted-foreground text-sm mb-2">
                <a
                  href={`tel:${props.contactColumn.phone}`}
                  className="hover:text-brand-accent transition-colors duration-200"
                >
                  {props.contactColumn.phone}
                </a>
              </p>
            )}
            {props.contactColumn?.email && (
              <p className="text-surface-muted-foreground text-sm">
                <a
                  href={`mailto:${props.contactColumn.email}`}
                  className="hover:text-brand-accent transition-colors duration-200"
                >
                  {props.contactColumn.email}
                </a>
              </p>
            )}
          </div>

          {/* Company Column */}
          <div>
            {props.companyColumn?.heading && (
              <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                {props.companyColumn.heading}
              </h3>
            )}
            {Array.isArray(props.companyColumn?.links) && (
              <ul className="space-y-2">
                {props.companyColumn.links.map(
                  (link: { label?: string; href?: string }, index: number) => (
                    <li key={index}>
                      <a
                        href={link?.href ?? "#"}
                        className="text-surface-muted-foreground text-sm hover:text-brand-accent transition-colors duration-200"
                      >
                        {link?.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          {/* Quick Links Column */}
          <div>
            {props.quickLinksColumn?.heading && (
              <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                {props.quickLinksColumn.heading}
              </h3>
            )}
            {Array.isArray(props.quickLinksColumn?.links) && (
              <ul className="space-y-2">
                {props.quickLinksColumn.links.map(
                  (link: { label?: string; href?: string }, index: number) => (
                    <li key={index}>
                      <a
                        href={link?.href ?? "#"}
                        className="text-surface-muted-foreground text-sm hover:text-brand-accent transition-colors duration-200"
                      >
                        {link?.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          {/* Small Bits Column */}
          <div>
            {props.smallBitsColumn?.heading && (
              <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                {props.smallBitsColumn.heading}
              </h3>
            )}
            {props.smallBitsColumn?.body && (
              <p className="text-surface-muted-foreground text-sm leading-relaxed mb-4">
                {props.smallBitsColumn.body}
              </p>
            )}
            {Array.isArray(props.smallBitsColumn?.links) && (
              <ul className="space-y-2">
                {props.smallBitsColumn.links.map(
                  (link: { label?: string; href?: string }, index: number) => (
                    <li key={index}>
                      <a
                        href={link?.href ?? "#"}
                        className="text-surface-muted-foreground text-sm hover:text-brand-accent transition-colors duration-200"
                      >
                        {link?.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-surface-muted" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Company number + copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-surface-muted-foreground text-xs text-center sm:text-left">
            {props.companyNumber && <span>Company No: {props.companyNumber}</span>}
            {props.companyNumber && props.copyright && (
              <span className="hidden sm:inline text-surface-muted">|</span>
            )}
            {props.copyright && <span>{props.copyright}</span>}
          </div>

          {/* Centre: Partnership / Certification Logos */}
          {Array.isArray(props.partnershipLogos) && props.partnershipLogos.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {props.partnershipLogos.map(
                (logo: { src?: string; alt?: string; href?: string }, index: number) =>
                  logo?.href ? (
                    <a
                      key={index}
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-70 hover:opacity-100 transition-opacity duration-200"
                    >
                      <img
                        src={logo?.src}
                        alt={logo?.alt ?? ""}
                        className="h-8 w-auto object-contain"
                      />
                    </a>
                  ) : (
                    <img
                      key={index}
                      src={logo?.src}
                      alt={logo?.alt ?? ""}
                      className="h-8 w-auto object-contain opacity-70"
                    />
                  )
              )}
            </div>
          )}

          {/* Right: Social Icons */}
          {Array.isArray(props.socialIcons) && props.socialIcons.length > 0 && (
            <div className="flex items-center gap-4">
              {props.socialIcons.map(
                (icon: { href?: string; label?: string; svg?: string }, index: number) => (
                  <a
                    key={index}
                    href={icon?.href ?? "#"}
                    aria-label={icon?.label ?? "Social media link"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200"
                  >
                    {icon?.svg ? (
                      <span
                        className="w-5 h-5 block"
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-surface-muted text-xs font-bold">
                        {icon?.label?.charAt(0) ?? "S"}
                      </span>
                    )}
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
