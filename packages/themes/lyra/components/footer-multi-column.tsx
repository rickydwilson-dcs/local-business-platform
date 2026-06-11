/**
 * SiteFooter
 *
 * Site-wide footer with contact details, company links, quick links, legal info and social icons
 * Layout: Dark background, four-column link grid, bottom bar with company number, partner logos and social icons
 * Category: Footer
 */

export interface SiteFooterProps {
  /** contact-column */
  contactColumn?: string;
  /** company-column */
  companyColumn?: string;
  /** quick-links-column */
  quickLinksColumn?: string;
  /** small-bits-column */
  smallBitsColumn?: string;
  /** company-number */
  companyNumber?: number;
  /** partner-logos */
  partnerLogos?: string;
  /** social-icons */
  socialIcons?: string;
  /** copyright */
  copyright?: string;
}

export function SiteFooter(props: SiteFooterProps) {
  return (
    <footer className="bg-surface-inverse text-surface-background">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Contact Column */}
          <div>
            {props.contactColumn && (
              <div>
                <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                  Contact
                </h3>
                <div className="text-surface-muted-foreground text-sm leading-relaxed space-y-2">
                  {props.contactColumn}
                </div>
              </div>
            )}
          </div>

          {/* Company Column */}
          <div>
            {props.companyColumn && (
              <div>
                <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                  Company
                </h3>
                <div className="text-surface-muted-foreground text-sm leading-relaxed space-y-2">
                  {props.companyColumn}
                </div>
              </div>
            )}
          </div>

          {/* Quick Links Column */}
          <div>
            {props.quickLinksColumn && (
              <div>
                <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                  Quick Links
                </h3>
                <div className="text-surface-muted-foreground text-sm leading-relaxed space-y-2">
                  {props.quickLinksColumn}
                </div>
              </div>
            )}
          </div>

          {/* Small Bits Column */}
          <div>
            {props.smallBitsColumn && (
              <div>
                <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                  More
                </h3>
                <div className="text-surface-muted-foreground text-sm leading-relaxed space-y-2">
                  {props.smallBitsColumn}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-surface-muted" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: copyright + company number */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-surface-muted-foreground text-xs text-center sm:text-left">
            {props.copyright && <span>{props.copyright}</span>}
            {props.companyNumber && (
              <span className="sm:before:content-['·'] sm:before:mx-2 sm:before:text-surface-muted">
                Company No. {props.companyNumber}
              </span>
            )}
          </div>

          {/* Centre: partner logos */}
          {props.partnerLogos && (
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {props.partnerLogos}
            </div>
          )}

          {/* Right: social icons */}
          {props.socialIcons && <div className="flex items-center gap-3">{props.socialIcons}</div>}
        </div>
      </div>
    </footer>
  );
}
