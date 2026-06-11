/**
 * SiteFooter
 *
 * Full site footer with contact details, company links, quick links, legal links, company registration, certifications, partner logos and social icons
 * Layout: Dark background four-column link grid above a full-width bottom bar with company registration number, partner logos, social icons and copyright text
 * Category: Footer
 */

export interface ContactItem {
  label?: string;
  href?: string;
  icon?: string;
}

export interface LinkItem {
  label?: string;
  href?: string;
}

export interface LogoItem {
  src?: string;
  alt?: string;
  href?: string;
}

export interface SocialIconItem {
  href?: string;
  label?: string;
  svg?: string;
}

export interface ContactColumn {
  heading?: string;
  items?: ContactItem[];
}

export interface LinkColumn {
  heading?: string;
  links?: LinkItem[];
}

export interface SiteFooterProps {
  /** contact-column */
  contactColumn?: ContactColumn;
  /** company-column */
  companyColumn?: LinkColumn;
  /** quick-links-column */
  quickLinksColumn?: LinkColumn;
  /** small-bits-column */
  smallBitsColumn?: LinkColumn;
  /** company-registration */
  companyRegistration?: string;
  /** certification-logos */
  certificationLogos?: LogoItem[];
  /** partner-logos */
  partnerLogos?: LogoItem[];
  /** social-icons */
  socialIcons?: SocialIconItem[];
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
            {props.contactColumn?.items && (
              <ul className="space-y-3">
                {props.contactColumn.items.map(
                  (item: { label?: string; href?: string; icon?: string }, idx: number) => (
                    <li key={idx}>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-surface-muted-foreground hover:text-surface-background transition-colors duration-200 text-sm flex items-start gap-2"
                        >
                          {item.icon && <span className="mt-0.5 shrink-0">{item.icon}</span>}
                          <span>{item.label}</span>
                        </a>
                      ) : (
                        <span className="text-surface-muted-foreground text-sm flex items-start gap-2">
                          {item.icon && <span className="mt-0.5 shrink-0">{item.icon}</span>}
                          <span>{item.label}</span>
                        </span>
                      )}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          {/* Company Column */}
          <div>
            {props.companyColumn?.heading && (
              <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                {props.companyColumn.heading}
              </h3>
            )}
            {props.companyColumn?.links && (
              <ul className="space-y-3">
                {props.companyColumn.links.map(
                  (link: { label?: string; href?: string }, idx: number) => (
                    <li key={idx}>
                      <a
                        href={link.href ?? "#"}
                        className="text-surface-muted-foreground hover:text-surface-background transition-colors duration-200 text-sm"
                      >
                        {link.label}
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
            {props.quickLinksColumn?.links && (
              <ul className="space-y-3">
                {props.quickLinksColumn.links.map(
                  (link: { label?: string; href?: string }, idx: number) => (
                    <li key={idx}>
                      <a
                        href={link.href ?? "#"}
                        className="text-surface-muted-foreground hover:text-surface-background transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          {/* Small Bits / Legal Column */}
          <div>
            {props.smallBitsColumn?.heading && (
              <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                {props.smallBitsColumn.heading}
              </h3>
            )}
            {props.smallBitsColumn?.links && (
              <ul className="space-y-3">
                {props.smallBitsColumn.links.map(
                  (link: { label?: string; href?: string }, idx: number) => (
                    <li key={idx}>
                      <a
                        href={link.href ?? "#"}
                        className="text-surface-muted-foreground hover:text-surface-background transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            )}

            {/* Certification Logos */}
            {props.certificationLogos && props.certificationLogos.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3 items-center">
                {props.certificationLogos.map(
                  (logo: { src?: string; alt?: string }, idx: number) => (
                    <img
                      key={idx}
                      src={logo.src}
                      alt={logo.alt ?? ""}
                      className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-surface-muted" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: Company Registration */}
          <div className="flex flex-col gap-1">
            {props.companyRegistration && (
              <p className="text-surface-muted-foreground text-xs">{props.companyRegistration}</p>
            )}
            {props.copyright && (
              <p className="text-surface-muted-foreground text-xs">{props.copyright}</p>
            )}
          </div>

          {/* Centre: Partner Logos */}
          {props.partnerLogos && props.partnerLogos.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 justify-center">
              {props.partnerLogos.map(
                (logo: { src?: string; alt?: string; href?: string }, idx: number) =>
                  logo.href ? (
                    <a
                      key={idx}
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-70 hover:opacity-100 transition-opacity duration-200"
                      aria-label={logo.alt}
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt ?? ""}
                        className="h-8 w-auto object-contain"
                      />
                    </a>
                  ) : (
                    <img
                      key={idx}
                      src={logo.src}
                      alt={logo.alt ?? ""}
                      className="h-8 w-auto object-contain opacity-70"
                    />
                  )
              )}
            </div>
          )}

          {/* Right: Social Icons */}
          {props.socialIcons && props.socialIcons.length > 0 && (
            <div className="flex items-center gap-4">
              {props.socialIcons.map(
                (icon: { href?: string; label?: string; svg?: string }, idx: number) => (
                  <a
                    key={idx}
                    href={icon.href ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={icon.label}
                    className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200"
                  >
                    {icon.svg ? (
                      <span
                        className="w-5 h-5 block"
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                      />
                    ) : (
                      <span className="w-5 h-5 block">{icon.label}</span>
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
