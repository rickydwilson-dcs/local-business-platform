/**
 * SiteFooter
 *
 * Full site footer with contact details, company links, quick links, legal links, partner logos and social icons
 * Layout: Dark background four-column link grid above a bottom bar with company number, partner logos and social icons
 * Category: Footer
 */

export interface ContactColumn {
  heading?: string;
  body?: string;
  phone?: string;
  email?: string;
}

export interface ColumnWithLinks {
  heading?: string;
  links?: { label?: string; href?: string }[];
}

export interface SiteFooterProps {
  /** contact-column */
  contactColumn?: ContactColumn;
  /** company-column */
  companyColumn?: ColumnWithLinks;
  /** quick-links-column */
  quickLinksColumn?: ColumnWithLinks;
  /** small-bits-column */
  smallBitsColumn?: ColumnWithLinks;
  /** company-registration */
  companyRegistration?: string;
  /** partner-logos */
  partnerLogos?: { src?: string; alt?: string; href?: string }[];
  /** social-icons */
  socialIcons?: { src?: string; alt?: string; href?: string; label?: string }[];
  /** copyright */
  copyright?: string;
  /** legal-links */
  legalLinks?: { label?: string; href?: string }[];
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
            {props.contactColumn?.body && (
              <div className="text-surface-muted-foreground text-sm leading-relaxed space-y-2">
                <p>{props.contactColumn.body}</p>
              </div>
            )}
            {props.contactColumn?.phone && (
              <a
                href={`tel:${props.contactColumn.phone}`}
                className="block mt-3 text-surface-background hover:text-brand-accent transition-colors text-sm font-medium"
              >
                {props.contactColumn.phone}
              </a>
            )}
            {props.contactColumn?.email && (
              <a
                href={`mailto:${props.contactColumn.email}`}
                className="block mt-1 text-surface-background hover:text-brand-accent transition-colors text-sm font-medium"
              >
                {props.contactColumn.email}
              </a>
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
                        className="text-surface-muted-foreground hover:text-brand-accent transition-colors text-sm"
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
                        className="text-surface-muted-foreground hover:text-brand-accent transition-colors text-sm"
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
            {Array.isArray(props.smallBitsColumn?.links) && (
              <ul className="space-y-2">
                {props.smallBitsColumn.links.map(
                  (link: { label?: string; href?: string }, index: number) => (
                    <li key={index}>
                      <a
                        href={link?.href ?? "#"}
                        className="text-surface-muted-foreground hover:text-brand-accent transition-colors text-sm"
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
          {/* Left: Copyright + Company Registration */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-surface-muted-foreground text-xs text-center sm:text-left">
            {props.copyright && <span>{props.copyright}</span>}
            {props.companyRegistration && (
              <span className="sm:before:content-['·'] sm:before:mx-2">
                {props.companyRegistration}
              </span>
            )}
          </div>

          {/* Centre: Legal Links */}
          {Array.isArray(props.legalLinks) && (
            <nav aria-label="Legal links">
              <ul className="flex flex-wrap justify-center gap-4">
                {props.legalLinks.map((link: { label?: string; href?: string }, index: number) => (
                  <li key={index}>
                    <a
                      href={link?.href ?? "#"}
                      className="text-surface-muted-foreground hover:text-brand-accent transition-colors text-xs"
                    >
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Right: Partner Logos + Social Icons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Partner Logos */}
            {Array.isArray(props.partnerLogos) && props.partnerLogos.length > 0 && (
              <div className="flex items-center gap-3">
                {props.partnerLogos.map(
                  (logo: { src?: string; alt?: string; href?: string }, index: number) => (
                    <a
                      key={index}
                      href={logo?.href ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-70 hover:opacity-100 transition-opacity"
                      aria-label={logo?.alt ?? `Partner logo ${index + 1}`}
                    >
                      <img
                        src={logo?.src}
                        alt={logo?.alt ?? ""}
                        className="h-8 w-auto object-contain"
                      />
                    </a>
                  )
                )}
              </div>
            )}

            {/* Social Icons */}
            {Array.isArray(props.socialIcons) && props.socialIcons.length > 0 && (
              <nav aria-label="Social media links">
                <ul className="flex items-center gap-3">
                  {props.socialIcons.map(
                    (
                      icon: { src?: string; alt?: string; href?: string; label?: string },
                      index: number
                    ) => (
                      <li key={index}>
                        <a
                          href={icon?.href ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={icon?.label ?? icon?.alt ?? `Social link ${index + 1}`}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-muted hover:bg-brand-primary transition-colors"
                        >
                          {icon?.src ? (
                            <img
                              src={icon.src}
                              alt={icon?.alt ?? ""}
                              className="w-4 h-4 object-contain"
                            />
                          ) : null}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
