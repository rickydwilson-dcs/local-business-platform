/**
 * SiteFooter
 *
 * Site-wide footer with navigation links grouped by category, logo, and social icons
 * Layout: Dark background with four link columns (Events, Support, Legal, Company), logo right, social icons bottom right, copyright bottom left
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
  /** copyright */
  copyright?: string;
}

export function SiteFooter(props: SiteFooterProps) {
  return (
    <footer className="bg-surface-inverse text-surface-background py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top section: nav columns + logo */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-10 border-b border-surface-muted">
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
                    className="text-surface-muted-foreground hover:text-brand-accent transition-colors text-sm"
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
                    className="text-surface-muted-foreground hover:text-brand-accent transition-colors text-sm"
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
                    className="text-surface-muted-foreground hover:text-brand-accent transition-colors text-sm"
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
                    className="text-surface-muted-foreground hover:text-brand-accent transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Logo — right column, hidden on small, shown on lg */}
          {props["footer-logo"] && (
            <div className="hidden lg:flex items-start justify-end col-span-1">
              <a href="/" aria-label="Go to homepage">
                <img
                  src={props["footer-logo"].src}
                  alt={props["footer-logo"].alt || "Site logo"}
                  className="h-12 w-auto object-contain"
                />
              </a>
            </div>
          )}
        </div>

        {/* Bottom section: copyright + social icons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          {/* Copyright */}
          <p className="text-surface-muted-foreground text-sm text-center md:text-left">
            {props.copyright || `© ${new Date().getFullYear()} All rights reserved.`}
          </p>

          {/* Mobile logo */}
          {props["footer-logo"] && (
            <a href="/" aria-label="Go to homepage" className="lg:hidden">
              <img
                src={props["footer-logo"].src}
                alt={props["footer-logo"].alt || "Site logo"}
                className="h-10 w-auto object-contain"
              />
            </a>
          )}

          {/* Social Icons */}
          {props["social-icons"] && props["social-icons"].length > 0 && (
            <nav aria-label="Social media links">
              <ul className="flex items-center gap-4">
                {props["social-icons"].map((icon, index) => (
                  <li key={index}>
                    <a
                      href={icon.href}
                      aria-label={icon.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-surface-muted-foreground hover:text-brand-accent transition-colors"
                    >
                      {icon.icon ? (
                        <span className="w-5 h-5 block">{icon.icon}</span>
                      ) : (
                        <span className="text-sm underline">{icon.label}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
