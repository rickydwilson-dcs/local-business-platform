/**
 * SiteFooter
 *
 * Global site footer with navigation links grouped by category, logo, social icons, and copyright, present on every page
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
  
            {/* Events Links */}
            <div className="lg:col-span-1">
              <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                Events
              </h3>
              <ul className="space-y-3">
                {props['events-links']?.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Support Links */}
            <div className="lg:col-span-1">
              <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {props['support-links']?.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Legal Links */}
            <div className="lg:col-span-1">
              <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {props['legal-links']?.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Company Links */}
            <div className="lg:col-span-1">
              <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {props['company-links']?.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Logo Column */}
            <div className="lg:col-span-1 flex flex-col items-start lg:items-end">
              {props['footer-logo'] && (
                <a href="/" aria-label="Go to homepage" className="mb-4 inline-block">
                  <img
                    src={props['footer-logo'].src}
                    alt={props['footer-logo'].alt ?? 'Site logo'}
                    className="h-10 w-auto object-contain"
                  />
                </a>
              )}
            </div>
  
          </div>
  
          {/* Divider */}
          <div className="border-t border-surface-muted mt-12 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
  
            {/* Copyright */}
            <p className="text-surface-muted-foreground text-sm order-2 md:order-1">
              {props['copyright-text'] ?? `© ${new Date().getFullYear()} All rights reserved.`}
            </p>
  
            {/* Social Icons */}
            {props['social-icons'] && props['social-icons'].length > 0 && (
              <div className="flex items-center gap-3 order-1 md:order-2" aria-label="Social media links">
                {props['social-icons'].map((icon, index) => (
                  <a
                    key={index}
                    href={icon.href}
                    aria-label={icon.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-accent text-on-brand-secondary hover:bg-brand-primary transition-colors duration-200 rounded-full w-9 h-9 flex items-center justify-center"
                  >
                    {icon.icon ? (
                      <span className="w-4 h-4 flex items-center justify-center">
                        {icon.icon}
                      </span>
                    ) : (
                      <span className="text-xs font-bold">{icon.label?.charAt(0)}</span>
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
