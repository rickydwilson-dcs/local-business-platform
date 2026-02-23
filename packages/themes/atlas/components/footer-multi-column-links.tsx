/**
 * SiteFooter
 *
 * Site-wide footer with navigation links grouped by category, logo, and copyright
 * Layout: Dark purple background with four columns of links (Events, Support, Legal, Company) and logo mark right
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
  /** copyright */
  copyright?: string;
}

export function SiteFooter(props: SiteFooterProps) {
  return (
      <footer className="bg-brand-primary text-on-brand-primary">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
  
            {/* Events Links */}
            <div className="lg:col-span-1">
              <h3 className="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-4">
                Events
              </h3>
              <ul className="space-y-3">
                {(props['events-links'] ?? [
                  { label: 'Upcoming Events', href: '#' },
                  { label: 'Past Events', href: '#' },
                  { label: 'Submit an Event', href: '#' },
                  { label: 'Calendar', href: '#' },
                ]).map((link: { label: string; href: string }) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-surface-muted-foreground hover:text-on-brand-primary transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Support Links */}
            <div className="lg:col-span-1">
              <h3 className="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {(props['support-links'] ?? [
                  { label: 'Help Centre', href: '#' },
                  { label: 'Contact Us', href: '#' },
                  { label: 'FAQs', href: '#' },
                  { label: 'Accessibility', href: '#' },
                ]).map((link: { label: string; href: string }) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-surface-muted-foreground hover:text-on-brand-primary transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Legal Links */}
            <div className="lg:col-span-1">
              <h3 className="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {(props['legal-links'] ?? [
                  { label: 'Privacy Policy', href: '#' },
                  { label: 'Terms of Service', href: '#' },
                  { label: 'Cookie Policy', href: '#' },
                  { label: 'GDPR', href: '#' },
                ]).map((link: { label: string; href: string }) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-surface-muted-foreground hover:text-on-brand-primary transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Company Links */}
            <div className="lg:col-span-1">
              <h3 className="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {(props['company-links'] ?? [
                  { label: 'About Us', href: '#' },
                  { label: 'Careers', href: '#' },
                  { label: 'Press', href: '#' },
                  { label: 'Blog', href: '#' },
                ]).map((link: { label: string; href: string }) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-surface-muted-foreground hover:text-on-brand-primary transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Logo Mark */}
            <div className="lg:col-span-1 flex flex-col items-start lg:items-end justify-start">
              {props.logo ? (
                <img
                  src={props.logo}
                  alt="Site logo"
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <div
                  className="h-12 w-12 rounded-full bg-brand-accent flex items-center justify-center"
                  aria-label="Logo mark"
                >
                  <span className="text-brand-primary font-bold text-xl select-none">
                    S
                  </span>
                </div>
              )}
            </div>
  
          </div>
  
          {/* Divider */}
          <div className="mt-12 border-t border-surface-muted pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-surface-muted-foreground text-sm text-center md:text-left">
              {props.copyright ?? `© ${new Date().getFullYear()} Your Company Ltd. All rights reserved.`}
            </p>
            <p className="text-surface-muted-foreground text-xs text-center md:text-right">
              Made with care for our community.
            </p>
          </div>
  
        </div>
      </footer>
    );
}
