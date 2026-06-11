/**
 * SiteFooter
 *
 * Full site footer with contact details, company links, quick links, legal links, company registration, certifications and social icons
 * Layout: Dark background multi-column grid: 4 link columns + bottom bar with company number, certifications and social icons
 * Category: Footer
 */

export interface ContactLine {
  label?: string;
  href?: string;
}

export interface LinkItem {
  label?: string;
  href?: string;
}

export interface ContactColumn {
  heading?: string;
  lines?: ContactLine[];
}

export interface LinkColumn {
  heading?: string;
  links?: LinkItem[];
}

export interface CertificationLogo {
  src?: string;
  alt?: string;
}

export interface SocialIcon {
  label?: string;
  href?: string;
  src?: string;
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
  certificationLogos?: CertificationLogo[];
  /** social-icons */
  socialIcons?: SocialIcon[];
  /** copyright */
  copyright?: string;
}

export function SiteFooter(props: SiteFooterProps) {
  return (
    <footer className="bg-surface-inverse text-surface-background">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
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
                    {props.companyColumn.links.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link?.href}
                          className="text-surface-muted-foreground text-sm hover:text-brand-accent transition-colors duration-200"
                        >
                          {link?.label}
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
                    {props.quickLinksColumn.links.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link?.href}
                          className="text-surface-muted-foreground text-sm hover:text-brand-accent transition-colors duration-200"
                        >
                          {link?.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Small Bits Column */}
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
                    {props.smallBitsColumn.links.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link?.href}
                          className="text-surface-muted-foreground text-sm hover:text-brand-accent transition-colors duration-200"
                        >
                          {link?.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-surface-muted" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Copyright + Company Registration + Legal Links */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 text-surface-muted-foreground text-xs text-center sm:text-left">
            {props.copyright && <span>{props.copyright}</span>}
            {props.companyRegistration && (
              <span className="sm:before:content-['·'] sm:before:mx-2">
                {props.companyRegistration}
              </span>
            )}
          </div>

          {/* Centre: Certification Logos */}
          {props.certificationLogos && props.certificationLogos.length > 0 && (
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {props.certificationLogos.map((cert, i) => (
                <img
                  key={i}
                  src={cert?.src}
                  alt={cert?.alt ?? "Certification"}
                  className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
                />
              ))}
            </div>
          )}

          {/* Right: Social Icons */}
          {props.socialIcons && props.socialIcons.length > 0 && (
            <div className="flex items-center gap-4">
              {props.socialIcons.map((icon, i) => (
                <a
                  key={i}
                  href={icon?.href}
                  aria-label={icon?.label}
                  className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon?.src ? (
                    <img
                      src={icon.src}
                      alt={icon?.label ?? "Social"}
                      className="h-5 w-5 object-contain"
                    />
                  ) : (
                    <span className="text-sm font-medium">{icon?.label}</span>
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
