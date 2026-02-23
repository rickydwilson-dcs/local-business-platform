/**
 * SiteFooter
 *
 * Global site footer with categorised navigation links, social media icons, logo, and copyright
 * Layout: Dark background with four link columns (Events, Support, Legal, Company), logo right, social icons bottom-right, copyright bottom-left
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
      <footer className="bg-surface-inverse text-surface-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Top section: nav columns + logo */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Events Links */}
            <div className="col-span-1">
              <h3 className="text-surface-muted-foreground uppercase tracking-widest text-xs font-semibold mb-4">
                Events
              </h3>
              <ul className="space-y-3">
                {(props['events-links'] ?? []).map((link: { label: string; href: string }, index: number) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-surface-background hover:text-brand-accent transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Support Links */}
            <div className="col-span-1">
              <h3 className="text-surface-muted-foreground uppercase tracking-widest text-xs font-semibold mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {(props['support-links'] ?? []).map((link: { label: string; href: string }, index: number) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-surface-background hover:text-brand-accent transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Legal Links */}
            <div className="col-span-1">
              <h3 className="text-surface-muted-foreground uppercase tracking-widest text-xs font-semibold mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {(props['legal-links'] ?? []).map((link: { label: string; href: string }, index: number) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-surface-background hover:text-brand-accent transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Company Links */}
            <div className="col-span-1">
              <h3 className="text-surface-muted-foreground uppercase tracking-widest text-xs font-semibold mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {(props['company-links'] ?? []).map((link: { label: string; href: string }, index: number) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-surface-background hover:text-brand-accent transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Logo — right column, hidden on small, shown on lg */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 flex lg:justify-end items-start">
              {props['footer-logo'] ? (
                <a href="/" aria-label="Go to homepage">
                  <img
                    src={props['footer-logo']}
                    alt="Site logo"
                    className="h-10 w-auto object-contain"
                  />
                </a>
              ) : (
                <a
                  href="/"
                  aria-label="Go to homepage"
                  className="text-surface-background font-bold text-xl tracking-tight"
                >
                  Brand
                </a>
              )}
            </div>
          </div>
  
          {/* Divider */}
          <div className="border-t border-surface-muted mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Copyright */}
              <p className="text-surface-muted-foreground text-sm order-2 md:order-1">
                {props['copyright-text'] ?? `© ${new Date().getFullYear()} All rights reserved.`}
              </p>
  
              {/* Social Icons */}
              {props['social-icons'] && props['social-icons'].length > 0 && (
                <div className="flex items-center gap-4 order-1 md:order-2" aria-label="Social media links">
                  {props['social-icons'].map(
                    (
                      icon: { href: string; label: string; icon: React.ReactNode },
                      index: number
                    ) => (
                      <a
                        key={index}
                        href={icon.href}
                        aria-label={icon.label}
                        className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">{icon.label}</span>
                        <span className="w-5 h-5 flex items-center justify-center" aria-hidden="true">
                          {icon.icon}
                        </span>
                      </a>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    );
}
