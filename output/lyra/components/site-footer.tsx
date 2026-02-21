/**
 * SiteFooter
 *
 * Site-wide footer with navigation links grouped by category (Events, Support, Legal, Company), logo, social icons, and copyright
 * Layout: Dark background multi-column layout with four link groups, logo bottom right, social icons bottom right, copyright bottom left
 * Category: Footer
 */

export interface SiteFooterProps {
  /** events-links */
  eventsLinks?: Array<{ label?: string; href?: string }>;
  /** support-links */
  supportLinks?: Array<{ label?: string; href?: string }>;
  /** legal-links */
  legalLinks?: Array<{ label?: string; href?: string }>;
  /** company-links */
  companyLinks?: Array<{ label?: string; href?: string }>;
  /** footer-logo */
  footerLogo?: string;
  /** social-icons */
  socialIcons?: string;
  /** copyright-text */
  copyrightText?: string;
}

export function SiteFooter(props: SiteFooterProps) {
  return (
    <footer className="bg-brand-primary text-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Events Links */}
          <div>
            <h3 className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-4">
              Events
            </h3>
            <ul className="space-y-2">
              {props["events-links"]?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-surface-muted-foreground hover:text-surface-background transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              {props["support-links"]?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-surface-muted-foreground hover:text-surface-background transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {props["legal-links"]?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-surface-muted-foreground hover:text-surface-background transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {props["company-links"]?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-surface-muted-foreground hover:text-surface-background transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface-muted pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-surface-muted-foreground text-sm order-2 md:order-1">
            {props["copyright-text"] ?? `© ${new Date().getFullYear()} All rights reserved.`}
          </p>

          {/* Logo and Social Icons */}
          <div className="flex flex-col sm:flex-row items-center gap-6 order-1 md:order-2">
            {/* Social Icons */}
            {props["social-icons"] && props["social-icons"].length > 0 && (
              <nav aria-label="Social media links">
                <ul className="flex items-center gap-4">
                  {props["social-icons"].map((icon, index) => (
                    <li key={index}>
                      <a
                        href={icon.href}
                        aria-label={icon.label}
                        className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {icon.icon ? (
                          <span className="w-5 h-5 block">{icon.icon}</span>
                        ) : (
                          <span className="w-5 h-5 flex items-center justify-center text-lg">
                            {icon.label?.charAt(0)}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Logo */}
            {props["footer-logo"] && (
              <a href="/" aria-label="Go to homepage">
                <img
                  src={props["footer-logo"].src}
                  alt={props["footer-logo"].alt ?? "Site logo"}
                  className="h-8 w-auto object-contain"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
