/**
 * SiteFooter
 *
 * Site-wide footer with navigation links grouped by category, brand logo, social media icons, and copyright notice
 * Layout: Dark background multi-column layout with four link groups (Events, Support, Legal, Company), logo top-right, social icons bottom-right, copyright bottom-left
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
      <footer className="bg-surface-inverse text-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Top Section: Logo + Nav Columns */}
          <div className="flex flex-col lg:flex-row lg:justify-between gap-12 mb-12">
            {/* Navigation Link Groups */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
              {/* Events Links */}
              <div>
                <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                  Events
                </h3>
                <ul className="space-y-3">
                  {props.eventsLinks && props.eventsLinks.map((link: any, index: number) => (
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
                <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                  Support
                </h3>
                <ul className="space-y-3">
                  {props.supportLinks && props.supportLinks.map((link: any, index: number) => (
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
                <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                  Legal
                </h3>
                <ul className="space-y-3">
                  {props.legalLinks && props.legalLinks.map((link: any, index: number) => (
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
                <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-4">
                  Company
                </h3>
                <ul className="space-y-3">
                  {props.companyLinks && props.companyLinks.map((link: any, index: number) => (
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
  
            {/* Logo - Top Right */}
            <div className="flex lg:flex-col lg:items-end lg:justify-start">
              {props.footerLogo && (
                <a href="/" aria-label="Go to homepage" className="inline-block">
                  <img
                    src={props.footerLogo.src}
                    alt={props.footerLogo.alt || "Site Logo"}
                    className="h-10 w-auto object-contain"
                  />
                </a>
              )}
            </div>
          </div>
  
          {/* Divider */}
          <div className="border-t border-surface-muted mb-8" />
  
          {/* Bottom Section: Copyright + Social Icons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Copyright - Bottom Left */}
            <p className="text-surface-muted-foreground text-sm">
              {props.copyrightText || `© ${new Date().getFullYear()} All rights reserved.`}
            </p>
  
            {/* Social Icons - Bottom Right */}
            {props.socialIcons && props.socialIcons.length > 0 && (
              <div className="flex items-center gap-4">
                {props.socialIcons.map((social: any, index: number) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200"
                  >
                    {social.icon ? (
                      <img
                        src={social.icon}
                        alt={social.label}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">
                        {social.label?.charAt(0)}
                      </span>
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
