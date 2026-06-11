/**
 * PrimaryNavigation
 *
 * Main site navigation with logo, nav links, search icon and contact CTA button
 * Layout: Full-width horizontal bar: logo left, nav links center, search icon and CTA button right
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
    <header className="w-full bg-surface-background border-b border-surface-muted shadow-sm">
      <nav
        aria-label="Primary navigation"
        className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between gap-4"
      >
        {/* Logo */}
        <div className="flex-shrink-0">
          {props.logo ? (
            <a href="/" aria-label="Go to homepage">
              <img src={props.logo} alt="Site logo" className="h-8 w-auto md:h-10" />
            </a>
          ) : (
            <a
              href="/"
              className="text-brand-primary font-bold text-xl md:text-2xl tracking-tight"
              aria-label="Go to homepage"
            >
              {"Brand"}
            </a>
          )}
        </div>

        {/* Nav Links — center */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center list-none m-0 p-0">
          {props.navLinks && props.navLinks.length > 0 ? (
            props.navLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link?.href ?? "#"}
                  className="text-surface-foreground hover:text-brand-primary text-sm lg:text-base font-medium transition-colors duration-200"
                >
                  {link?.label}
                </a>
              </li>
            ))
          ) : (
            <>
              <li>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm font-medium transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm font-medium transition-colors duration-200"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm font-medium transition-colors duration-200"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm font-medium transition-colors duration-200"
                >
                  Blog
                </a>
              </li>
            </>
          )}
        </ul>

        {/* Right side: Search icon + CTA */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          {/* Search Icon */}
          <button
            aria-label="Open search"
            className="text-surface-muted-foreground hover:text-brand-primary transition-colors duration-200 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
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
            className="hidden md:inline-flex items-center justify-center bg-brand-primary text-on-brand-primary text-sm font-semibold px-4 py-2 lg:px-5 lg:py-2.5 rounded-md hover:bg-brand-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          >
            {props.contactCtaButton?.label ?? "Contact Us"}
          </a>

          {/* Mobile menu toggle */}
          <button
            aria-label="Open mobile menu"
            className="md:hidden text-surface-foreground hover:text-brand-primary transition-colors duration-200 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
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
      </nav>
    </header>
  );
}
