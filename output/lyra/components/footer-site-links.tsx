/**
 * SiteFooter
 *
 * Global site footer with categorised navigation links, logo and copyright
 * Layout: Multi-column link grid with logo and social icons bottom right
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
  /** logo */
  logo?: string;
  /** social-icons */
  socialIcons?: string;
  /** copyright */
  copyright?: string;
}

export function SiteFooter(props: SiteFooterProps) {
  return (
    <footer className="bg-surface-inverse text-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {props["company-links"] && (
            <div>
              <h3 className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                {props["company-links"].map((link, index) => (
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
          )}

          {props["events-links"] && (
            <div>
              <h3 className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-4">
                Events
              </h3>
              <ul className="space-y-2">
                {props["events-links"].map((link, index) => (
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
          )}

          {props["support-links"] && (
            <div>
              <h3 className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                {props["support-links"].map((link, index) => (
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
          )}

          {props["legal-links"] && (
            <div>
              <h3 className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                {props["legal-links"].map((link, index) => (
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
          )}
        </div>

        <div className="border-t border-surface-muted pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-3">
            {props.logo && (
              <a href="/" aria-label="Go to homepage">
                <img
                  src={props.logo.src}
                  alt={props.logo.alt || "Site logo"}
                  className="h-8 w-auto"
                />
              </a>
            )}
            {props.copyright && (
              <p className="text-surface-muted-foreground text-xs text-center md:text-left">
                {props.copyright}
              </p>
            )}
          </div>

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
                      className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200"
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
