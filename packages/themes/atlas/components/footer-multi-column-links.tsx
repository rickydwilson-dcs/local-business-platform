/**
 * SiteFooter
 *
 * Global site footer with navigation columns, legal links, and social icons
 * Layout: Multi-column grid: Events, Support, Legal, Company columns plus logo and social icons
 * Category: Footer
 */

export interface SiteFooterProps {
  /** footer-nav-events */
  footerNavEvents?: string;
  /** footer-nav-support */
  footerNavSupport?: string;
  /** footer-nav-legal */
  footerNavLegal?: string;
  /** footer-nav-company */
  footerNavCompany?: string;
  /** footer-logo */
  footerLogo?: string;
  /** social-icons */
  socialIcons?: string;
  /** copyright-text */
  copyrightText?: string;
}

export function SiteFooter(props: SiteFooterProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-surface-muted-foreground text-sm uppercase tracking-wider mb-2">Footer</p>
        <h2 className="text-h2 text-surface-foreground mb-4">SiteFooter</h2>
        <p className="text-body text-surface-secondary-foreground">Global site footer with navigation columns, legal links, and social icons</p>
      </div>
    </section>
  );
}
