/**
 * PrimaryNavigation
 *
 * Main site navigation with logo, nav links, search icon and contact CTA button
 * Layout: Horizontal bar: logo left, nav links center, search + button right
 * Category: Navigation
 */
export interface PrimaryNavigationProps {
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
export function PrimaryNavigation(props: PrimaryNavigationProps) {
  return (
    <nav className="bg-surface-background shadow-sm border-b border-surface-muted sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            {props.logo ? (
              <a href="/" aria-label="Go to homepage">
                <img src={props.logo} alt="Site logo" className="h-8 w-auto" />
              </a>
            ) : (
              <a href="/" className="text-brand-primary font-bold text-xl">
                {"Brand"}
              </a>
            )}
          </div>

          {/* Nav Links - Center */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {props.navLinks && props.navLinks.length > 0 ? (
              props.navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link?.href ?? "#"}
                  className="text-surface-foreground hover:text-brand-primary text-sm font-medium transition-colors duration-200"
                >
                  {link?.label}
                </a>
              ))
            ) : (
              <>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm font-medium transition-colors duration-200"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm font-medium transition-colors duration-200"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm font-medium transition-colors duration-200"
                >
                  Services
                </a>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm font-medium transition-colors duration-200"
                >
                  Blog
                </a>
              </>
            )}
          </div>

          {/* Right: Search Icon + CTA Button */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Search Icon */}
            <button
              aria-label="Open search"
              className="text-surface-muted-foreground hover:text-brand-primary transition-colors duration-200 p-1.5 rounded-md"
            >
              {props.searchIcon ? (
                <span>{props.searchIcon}</span>
              ) : (
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
              )}
            </button>

            {/* Contact CTA Button */}
            <a
              href={props.contactCtaButton?.href ?? "#contact"}
              className="hidden md:inline-flex items-center justify-center bg-brand-primary text-on-brand-primary text-sm font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity duration-200 whitespace-nowrap"
            >
              {props.contactCtaButton?.label ?? "Contact Us"}
            </a>

            {/* Mobile Menu Toggle */}
            <button
              aria-label="Open mobile menu"
              className="md:hidden text-surface-muted-foreground hover:text-brand-primary transition-colors duration-200 p-1.5 rounded-md"
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

        {/* Mobile Nav Links */}
        <div className="md:hidden border-t border-surface-muted py-3 flex flex-col gap-2">
          {props.navLinks && props.navLinks.length > 0 ? (
            props.navLinks.map((link, index) => (
              <a
                key={index}
                href={link?.href ?? "#"}
                className="text-surface-foreground hover:text-brand-primary text-sm font-medium px-2 py-1.5 rounded-md hover:bg-surface-muted transition-colors duration-200"
              >
                {link?.label}
              </a>
            ))
          ) : (
            <>
              <a
                href="#"
                className="text-surface-foreground hover:text-brand-primary text-sm font-medium px-2 py-1.5 rounded-md hover:bg-surface-muted transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="#"
                className="text-surface-foreground hover:text-brand-primary text-sm font-medium px-2 py-1.5 rounded-md hover:bg-surface-muted transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#"
                className="text-surface-foreground hover:text-brand-primary text-sm font-medium px-2 py-1.5 rounded-md hover:bg-surface-muted transition-colors duration-200"
              >
                Services
              </a>
              <a
                href="#"
                className="text-surface-foreground hover:text-brand-primary text-sm font-medium px-2 py-1.5 rounded-md hover:bg-surface-muted transition-colors duration-200"
              >
                Blog
              </a>
            </>
          )}
          <a
            href={props.contactCtaButton?.href ?? "#contact"}
            className="mt-1 inline-flex items-center justify-center bg-brand-primary text-on-brand-primary text-sm font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity duration-200"
          >
            {props.contactCtaButton?.label ?? "Contact Us"}
          </a>
        </div>
      </div>
    </nav>
  );
}
