import Link from "next/link";

export interface SolarisHeaderProps {
  logoText?: string;
  logoSrc?: string;
  logoAlt?: string;
  navItems: { label: string; href: string }[];
  ctaLabel?: string;
  ctaHref?: string;
  phone?: string;
  showPhone?: boolean;
}

export function SolarisHeader({
  logoText = "DCS",
  logoSrc,
  logoAlt,
  navItems,
  ctaLabel = "Get in touch",
  ctaHref = "#contact",
  phone,
  showPhone = true,
}: SolarisHeaderProps) {
  return (
    <>
      <header
        id="solaris-header"
        className="sticky top-0 z-[100] border-b border-surface-card-border"
        style={{
          background: "rgba(240,247,250,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 max-w-[1200px] mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="font-heading text-2xl font-bold tracking-tight"
            style={{ color: "#4a8fa8" }}
          >
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt={logoAlt ?? logoText}
                width={140}
                height={48}
                style={{ height: "40px", width: "auto", objectFit: "contain" }}
              />
            ) : (
              logoText
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="solaris-nav-link font-heading text-sm font-medium"
                style={{ color: "#3d4235" }}
              >
                {item.label}
              </Link>
            ))}

            {showPhone && phone && (
              <Link
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="font-heading text-sm font-medium"
                style={{ color: "#3d4235" }}
              >
                {phone}
              </Link>
            )}

            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold font-heading text-white transition-colors"
              style={{
                background: "#61A3BA",
                borderRadius: "10px",
              }}
            >
              {ctaLabel}
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            id="solaris-hamburger"
            className="lg:hidden p-2"
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="solaris-mobile-menu"
          >
            <span className="flex flex-col justify-center gap-1.5 w-6 h-5">
              <span
                className="block h-0.5 w-6 rounded-sm transition-transform duration-300"
                style={{ background: "#2a2e20" }}
              />
              <span
                className="block h-0.5 w-6 rounded-sm transition-opacity duration-300"
                style={{ background: "#2a2e20" }}
              />
              <span
                className="block h-0.5 w-6 rounded-sm transition-transform duration-300"
                style={{ background: "#2a2e20" }}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        id="solaris-mobile-menu"
        className="fixed inset-0 z-[200] flex flex-col lg:hidden"
        style={{ background: "#F0F7FA", display: "none" }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "#d4e8f0" }}
        >
          <Link
            href="/"
            className="font-heading text-2xl font-bold tracking-tight"
            style={{ color: "#4a8fa8" }}
          >
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt={logoAlt ?? logoText}
                width={140}
                height={48}
                style={{ height: "40px", width: "auto", objectFit: "contain" }}
              />
            ) : (
              logoText
            )}
          </Link>
          <button
            id="solaris-mobile-close"
            className="p-2 rounded-lg border-2 transition-colors"
            style={{ borderColor: "#61A3BA", color: "#61A3BA" }}
            aria-label="Close menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-6 py-12 gap-8 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="solaris-mobile-link text-xl font-semibold font-heading text-center"
              style={{ color: "#2a2e20" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 space-y-4 flex-shrink-0">
          {showPhone && phone && (
            <Link
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="block text-center text-2xl font-bold font-heading"
              style={{ color: "#2a2e20" }}
            >
              {phone}
            </Link>
          )}
          <Link
            href={ctaHref}
            className="block w-full text-center py-4 px-6 font-bold text-lg font-heading text-white transition-colors"
            style={{
              background: "#61A3BA",
              borderRadius: "10px",
            }}
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      {/* Scroll shadow + mobile menu toggle script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function(){
  var header = document.getElementById('solaris-header');
  var hamburger = document.getElementById('solaris-hamburger');
  var mobileMenu = document.getElementById('solaris-mobile-menu');
  var mobileClose = document.getElementById('solaris-mobile-close');

  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 20px rgba(42,46,32,0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  function openMenu() {
    if (mobileMenu) {
      mobileMenu.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    }
  }
  function closeMenu() {
    if (mobileMenu) {
      mobileMenu.style.display = 'none';
      document.body.style.overflow = '';
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    }
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);

  var mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });
})();
`,
        }}
      />
    </>
  );
}
