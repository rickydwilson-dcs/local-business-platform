/**
 * TopNavigation
 *
 * Primary site navigation with logo, nav links, search and contact CTA
 * Layout: Horizontal bar with logo left, nav links center, actions right
 * Category: Navigation
 */
export interface TopNavigationProps {
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
  /** contact-cta */
  contactCta?: string;
}
export function TopNavigation(props: TopNavigationProps) {
  return (
    <header className="w-full bg-surface-background border-b border-surface-muted sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <nav
          className="flex items-center justify-between h-16 md:h-20"
          aria-label="Primary navigation"
        >
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2" aria-label="Go to homepage">
              {props.logo ? (
                <img
                  src={props.logo}
                  alt="Site logo"
                  className="h-8 md:h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-xl md:text-2xl font-bold text-brand-primary">{"Brand"}</span>
              )}
            </a>
          </div>

          {/* Nav Links — center, hidden on mobile */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-10 list-none m-0 p-0">
            {props.navLinks && props.navLinks.length > 0 ? (
              props.navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link?.href ?? "#"}
                    className="text-sm lg:text-base font-medium text-surface-foreground hover:text-brand-primary transition-colors duration-200 relative group"
                  >
                    {link?.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary group-hover:w-full transition-all duration-200" />
                  </a>
                </li>
              ))
            ) : (
              <>
                {["Home", "About", "Services", "Blog"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm lg:text-base font-medium text-surface-foreground hover:text-brand-primary transition-colors duration-200 relative group"
                    >
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary group-hover:w-full transition-all duration-200" />
                    </a>
                  </li>
                ))}
              </>
            )}
          </ul>

          {/* Actions: Search + CTA */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search Icon */}
            {props.searchIcon !== undefined && (
              <button
                type="button"
                aria-label="Open search"
                className="p-2 rounded-full text-surface-foreground hover:text-brand-primary hover:bg-surface-muted transition-colors duration-200"
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

            {/* Contact CTA */}
            <a
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-brand-primary text-on-brand-primary text-sm font-semibold hover:bg-brand-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            >
              {props.contactCta ?? "Contact Us"}
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label="Open menu"
              className="md:hidden p-2 rounded-md text-surface-foreground hover:text-brand-primary hover:bg-surface-muted transition-colors duration-200"
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
      </div>
    </header>
  );
}
