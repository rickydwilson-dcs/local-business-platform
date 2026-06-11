/**
 * SiteHeader
 *
 * Primary sticky site navigation with logo, nav links, search icon and contact CTA button
 * Layout: Full-width horizontal bar: logo left, nav links centre, search icon and CTA button right
 * Category: Navigation
 */

export interface SiteHeaderProps {
  /** logo */
  logo?: string;
  /** nav-links */
  navLinks?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
  /** search-icon */
  searchIcon?: string;
  /** contact-cta-button */
  contactCtaButton?: { label?: string; href?: string };
}

export function SiteHeader(props: SiteHeaderProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-surface-muted-foreground text-sm uppercase tracking-wider mb-2">
          Navigation
        </p>
        <h2 className="text-h2 text-surface-foreground mb-4">SiteHeader</h2>
        <p className="text-body text-surface-secondary-foreground">
          Primary sticky site navigation with logo, nav links, search icon and contact CTA button
        </p>
      </div>
    </section>
  );
}
