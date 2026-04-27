/**
 * SiteFooter
 *
 * Site-wide footer with contact details, company links, quick links, legal info, partner certification logos and social media icons
 * Layout: Dark background four-column link grid above a bottom bar with company registration number, partner certification logos and social icons
 * Category: Footer
 */

export interface ContactLine {
  label?: string;
  href?: string;
}

export interface NavLink {
  label?: string;
  href?: string;
}

export interface PartnerLogo {
  src?: string;
  alt?: string;
}

export interface SocialIcon {
  src?: string;
  label?: string;
  href?: string;
}

export interface ContactColumn {
  heading?: string;
  lines?: ContactLine[];
}

export interface CompanyColumn {
  heading?: string;
  links?: NavLink[];
}

export interface QuickLinksColumn {
  heading?: string;
  links?: NavLink[];
}

export interface SmallBitsColumn {
  heading?: string;
  links?: NavLink[];
  body?: string;
}

export interface SiteFooterProps {
  /** contact-column */
  contactColumn?: ContactColumn;
  /** company-column */
  companyColumn?: CompanyColumn;
  /** quick-links-column */
  quickLinksColumn?: QuickLinksColumn;
  /** small-bits-column */
  smallBitsColumn?: SmallBitsColumn;
  /** company-registration */
  companyRegistration?: string;
  /** partner-logos */
  partnerLogos?: PartnerLogo[];
  /** social-icons */
  socialIcons?: SocialIcon[];
  /** copyright */
  copyright?: string;
}

export function SiteFooter(props: SiteFooterProps) {
  return (
    <footer className="bg-surface-inverse text-surface-background">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Contact Column */}
          <div>
            {props.contactColumn && (
              <div>
                {props.contactColumn.heading && (
                  <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                    {props.contactColumn.heading}
                  </h3>
                )}
                {props.contactColumn.lines && (
                  <ul className="space-y-2">
                    {props.contactColumn.lines.map((line: ContactLine, i: number) => (
                      <li key={i} className="text-surface-muted-foreground text-sm leading-relaxed">
                        {line.href ? (
                          <a
                            href={line.href}
                            className="hover:text-brand-accent transition-colors duration-200"
                          >
                            {line.label}
                          </a>
                        ) : (
                          line.label
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Company Column */}
          <div>
            {props.companyColumn && (
              <div>
                {props.companyColumn.heading && (
                  <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                    {props.companyColumn.heading}
                  </h3>
                )}
                {props.companyColumn.links && (
                  <ul className="space-y-2">
                    {props.companyColumn.links.map((link: NavLink, i: number) => (
                      <li key={i}>
                        <a
                          href={link.href}
                          className="text-surface-muted-foreground text-sm hover:text-brand-accent transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Quick Links Column */}
          <div>
            {props.quickLinksColumn && (
              <div>
                {props.quickLinksColumn.heading && (
                  <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                    {props.quickLinksColumn.heading}
                  </h3>
                )}
                {props.quickLinksColumn.links && (
                  <ul className="space-y-2">
                    {props.quickLinksColumn.links.map((link: NavLink, i: number) => (
                      <li key={i}>
                        <a
                          href={link.href}
                          className="text-surface-muted-foreground text-sm hover:text-brand-accent transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Small Bits / Legal Column */}
          <div>
            {props.smallBitsColumn && (
              <div>
                {props.smallBitsColumn.heading && (
                  <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                    {props.smallBitsColumn.heading}
                  </h3>
                )}
                {props.smallBitsColumn.links && (
                  <ul className="space-y-2">
                    {props.smallBitsColumn.links.map((link: NavLink, i: number) => (
                      <li key={i}>
                        <a
                          href={link.href}
                          className="text-surface-muted-foreground text-sm hover:text-brand-accent transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                {props.smallBitsColumn.body && (
                  <p className="text-surface-muted-foreground text-sm leading-relaxed mt-3">
                    {props.smallBitsColumn.body}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-surface-muted" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Copyright + Registration */}
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            {props.copyright && (
              <p className="text-surface-muted-foreground text-xs">{props.copyright}</p>
            )}
            {props.companyRegistration && (
              <p className="text-surface-muted-foreground text-xs">{props.companyRegistration}</p>
            )}
          </div>

          {/* Centre: Partner / Certification Logos */}
          {props.partnerLogos && props.partnerLogos.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {props.partnerLogos.map((logo: PartnerLogo, i: number) => (
                <img
                  key={i}
                  src={logo.src}
                  alt={logo.alt ?? "Partner logo"}
                  className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
                />
              ))}
            </div>
          )}

          {/* Right: Social Icons */}
          {props.socialIcons && props.socialIcons.length > 0 && (
            <div className="flex items-center gap-4">
              {props.socialIcons.map((icon: SocialIcon, i: number) => (
                <a
                  key={i}
                  href={icon.href}
                  aria-label={icon.label}
                  className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon.src ? (
                    <img
                      src={icon.src}
                      alt={icon.label ?? "Social icon"}
                      className="h-5 w-5 object-contain"
                    />
                  ) : (
                    <span className="text-sm font-medium">{icon.label}</span>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
