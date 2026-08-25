import Link from 'next/link';

export interface SiteHeaderProps {
  logoText?: string;
  logoSrc?: string;
  logoAlt?: string;
  navItems: { label: string; href: string }[];
  ctaLabel?: string;
  ctaHref?: string;
  phone?: string;
  showPhone?: boolean;
}

/**
 * r9 rebrand of the inner-page header. Visual language (magenta CTA pill
 * with arrow, circular two-bar burger, underline-on-hover nav links, dark
 * fullscreen mobile nav) is lifted from the r9 homepage bar/menu
 * (`sites/dcs/components/home/site-bar.tsx`, `home/mobile-menu.tsx`,
 * `styles/home-r9.css`) but rebuilt against theme tokens (`bg-brand-primary`,
 * `text-surface-foreground`, etc.) rather than the homepage's hardcoded r9
 * hex/CSS-var treatment, since this header renders across 14+ routes, not a
 * single scroll-tracked page — there is no "ground" to track, so it always
 * renders on the paper/ink pairing (`surface.background`/`surface.foreground`).
 *
 * Mobile menu CSS trap (see root CLAUDE.md): the `fixed inset-0` overlay
 * below is a SIBLING of `<header>`, not a descendant — `<header>` carries
 * `backdrop-blur-md`, and nesting the overlay inside it would make the
 * header's own box (not the viewport) the containing block for the overlay's
 * `fixed` positioning. Keep it a sibling, or portal it, if this is ever
 * restructured.
 */
export function SiteHeader({
  logoText = 'DCS',
  logoSrc,
  logoAlt,
  navItems,
  ctaLabel = 'Get in touch',
  ctaHref = '#contact',
  phone,
  showPhone = true,
}: SiteHeaderProps) {
  return (
    <>
      <header
        id="dcs-header"
        className="sticky top-0 z-[100] border-b border-surface-card-border bg-surface-background/90 backdrop-blur-md transition-shadow duration-300"
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center font-heading text-2xl font-semibold tracking-tight text-surface-foreground"
          >
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt={logoAlt ?? logoText}
                width={140}
                height={48}
                style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
              />
            ) : (
              logoText
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative py-1 font-sans text-sm font-medium text-surface-foreground/75 transition-colors hover:text-surface-foreground"
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] origin-left scale-x-0 bg-brand-primary transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}

            {showPhone && phone && (
              <Link
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="font-sans text-sm font-medium text-surface-foreground/75 transition-colors hover:text-surface-foreground"
              >
                {phone}
              </Link>
            )}

            <Link
              href={ctaHref}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-2.5 font-sans text-sm font-semibold text-on-brand-primary transition-transform duration-300 hover:-translate-y-0.5"
            >
              {ctaLabel}
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M2 8h11M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            id="dcs-hamburger"
            className="group grid h-11 w-11 place-content-center gap-1.5 rounded-full border-[1.4px] border-surface-foreground/30 text-surface-foreground transition-colors duration-300 hover:border-brand-primary hover:bg-brand-primary hover:text-on-brand-primary lg:hidden"
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="dcs-mobile-menu"
          >
            <span className="block h-[1.6px] w-4 bg-current transition-transform duration-300 group-aria-expanded:translate-y-[3.3px] group-aria-expanded:rotate-45" />
            <span className="block h-[1.6px] w-4 bg-current transition-transform duration-300 group-aria-expanded:-translate-y-[3.3px] group-aria-expanded:-rotate-45" />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay — sibling of <header>, see file-level note above */}
      <div
        id="dcs-mobile-menu"
        className="fixed inset-0 z-[200] hidden flex-col bg-surface-background lg:hidden"
      >
        <div className="flex items-center justify-between border-b border-surface-card-border px-6 py-4">
          <Link
            href="/"
            className="flex items-center font-heading text-2xl font-semibold tracking-tight text-surface-foreground"
          >
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt={logoAlt ?? logoText}
                width={140}
                height={48}
                style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
              />
            ) : (
              logoText
            )}
          </Link>
          <button
            id="dcs-mobile-close"
            className="rounded-full border-[1.4px] border-brand-primary p-2 text-brand-primary transition-colors"
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

        <nav className="flex flex-1 flex-col justify-center gap-6 overflow-y-auto bg-surface-inverse px-6 py-12 text-surface-inverse-foreground">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-center font-heading text-3xl font-extrabold tracking-tight transition-colors hover:text-brand-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex-shrink-0 space-y-4 bg-surface-inverse p-6 text-surface-inverse-foreground">
          {showPhone && phone && (
            <Link
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="block text-center font-heading text-2xl font-bold"
            >
              {phone}
            </Link>
          )}
          <Link
            href={ctaHref}
            className="block w-full rounded-full bg-brand-primary px-6 py-4 text-center font-sans text-lg font-bold text-on-brand-primary transition-transform hover:-translate-y-0.5"
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
  var header = document.getElementById('dcs-header');
  var hamburger = document.getElementById('dcs-hamburger');
  var mobileMenu = document.getElementById('dcs-mobile-menu');
  var mobileClose = document.getElementById('dcs-mobile-close');

  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 20px rgba(14,14,18,0.08)';
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
