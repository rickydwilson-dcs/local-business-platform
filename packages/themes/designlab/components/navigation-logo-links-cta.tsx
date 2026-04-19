export function NavigationLogoLinksCta({
  logoText = "DESIGNLAB",
  navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    {
      label: "Services",
      href: "/services",
      children: [
        { label: "Vehicle Graphics", href: "/services/vehicle-graphics" },
        { label: "Shop Signage", href: "/services/shop-signage" },
        { label: "Banners & Flags", href: "/services/banners" },
        { label: "Window Graphics", href: "/services/window-graphics" },
        { label: "Exhibition Stands", href: "/services/exhibition" },
        { label: "Design Services", href: "/services/design" },
      ],
    },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Reviews", href: "/reviews" },
    { label: "Blog", href: "/blog" },
  ],
  ctaLabel = "Get In Touch",
  ctaHref = "/contact",
}) {
  return (
    <nav className="bg-surface-background border-b border-surface-muted sticky top-0 z-50">
      <div className="container-standard mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo — the unexpected: a brutalist stencil-cut feel with a diagonal slash */}
        <a href="/" className="flex items-center gap-1 min-w-0">
          <span className="text-h3 font-heading font-bold text-surface-foreground tracking-tight">
            DESIGN
          </span>
          <span className="text-h3 font-heading font-bold text-brand-primary tracking-tight">
            /LAB
          </span>
        </a>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-8 min-w-0">
          {navLinks.map(
            (link: {
              label: string;
              href: string;
              children?: { label: string; href: string }[];
            }) => (
              <div key={link.label} className="relative group">
                <a
                  href={link.href}
                  className="text-body font-sans text-surface-foreground uppercase tracking-widest hover:text-brand-primary transition-colors duration-200"
                >
                  {link.label}
                  {link.children && (
                    <svg
                      className="inline-block w-3 h-3 ml-1 opacity-60"
                      fill="none"
                      viewBox="0 0 12 12"
                    >
                      <path
                        d="M3 5l3 3 3-3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </a>
                {link.children && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-brand-secondary border border-surface-muted min-w-[220px] py-2">
                      {link.children.map((child: { label: string; href: string }) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block px-5 py-2.5 text-body font-sans text-surface-foreground hover:text-brand-primary hover:bg-surface-background transition-colors"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* CTA */}
        <a
          href={ctaHref}
          className="btn-primary bg-brand-primary text-on-brand-primary font-sans font-bold uppercase tracking-widest text-small px-6 py-3 hover:opacity-90 transition-opacity"
        >
          {ctaLabel}
        </a>
      </div>
    </nav>
  );
}
