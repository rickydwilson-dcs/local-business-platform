/**
 * SiteHeader
 *
 * Primary site navigation with logo, nav links, search and contact CTA
 * Layout: Full-width horizontal bar with logo left, nav links centre, search and CTA button right
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
    <header className="w-full bg-surface-background shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            {props.logo ? (
              <a href="/" aria-label="Go to homepage">
                <img
                  src={props.logo}
                  alt="Site logo"
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </a>
            ) : (
              <a
                href="/"
                className="text-brand-primary font-bold text-xl md:text-2xl tracking-tight"
                aria-label="Go to homepage"
              >
                Brand
              </a>
            )}
          </div>

          {/* Nav Links — centre, hidden on mobile */}
          <nav
            className="hidden md:flex items-center gap-6 lg:gap-8"
            aria-label="Primary navigation"
          >
            {props.navLinks && props.navLinks.length > 0 ? (
              props.navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link?.href ?? "#"}
                  className="text-surface-foreground hover:text-brand-primary text-sm lg:text-base font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  {link?.label}
                </a>
              ))
            ) : (
              <>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm lg:text-base font-medium transition-colors duration-200"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm lg:text-base font-medium transition-colors duration-200"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm lg:text-base font-medium transition-colors duration-200"
                >
                  Services
                </a>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm lg:text-base font-medium transition-colors duration-200"
                >
                  Blog
                </a>
              </>
            )}
          </nav>

          {/* Right side: Search + CTA */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search Icon */}
            {props.searchIcon !== undefined && (
              <button
                type="button"
                aria-label="Open search"
                className="text-surface-muted-foreground hover:text-brand-primary transition-colors duration-200 p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
              </button>
            )}

            {/* Contact CTA Button */}
            <a
              href={props.contactCtaButton?.href ?? "#contact"}
              className="hidden md:inline-flex items-center justify-center bg-brand-primary text-on-brand-primary text-sm font-semibold px-4 py-2 lg:px-5 lg:py-2.5 rounded-md hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 whitespace-nowrap"
            >
              {props.contactCtaButton?.label ?? "Contact Us"}
            </a>

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label="Open mobile menu"
              className="md:hidden text-surface-muted-foreground hover:text-brand-primary transition-colors duration-200 p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav — visible on small screens */}
        <nav
          className="md:hidden border-t border-surface-muted py-3 flex flex-col gap-1"
          aria-label="Mobile navigation"
        >
          {props.navLinks && props.navLinks.length > 0 ? (
            props.navLinks.map((link, index) => (
              <a
                key={index}
                href={link?.href ?? "#"}
                className="text-surface-foreground hover:text-brand-primary hover:bg-surface-muted px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {link?.label}
              </a>
            ))
          ) : (
            <>
              <a
                href="#"
                className="text-surface-foreground hover:text-brand-primary hover:bg-surface-muted px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="#"
                className="text-surface-foreground hover:text-brand-primary hover:bg-surface-muted px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#"
                className="text-surface-foreground hover:text-brand-primary hover:bg-surface-muted px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Services
              </a>
              <a
                href="#"
                className="text-surface-foreground hover:text-brand-primary hover:bg-surface-muted px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Blog
              </a>
            </>
          )}
          <a
            href={props.contactCtaButton?.href ?? "#contact"}
            className="mt-2 inline-flex items-center justify-center bg-brand-primary text-on-brand-primary text-sm font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity duration-200"
          >
            {props.contactCtaButton?.label ?? "Contact Us"}
          </a>
        </nav>
      </div>
    </header>
  );
}
