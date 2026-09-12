'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';

export interface SiteHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
  logoWidth?: number;
  logoHeight?: number;
}

/**
 * SiteHeader — DPM Autobody masthead.
 *
 * Ported from the approved static prototype's `.masthead` (see
 * output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/index.html —
 * CSS ~L193-283, markup ~L1269-1278). Fixed, near-black-to-transparent gradient over the
 * page, wordmark + inline nav + phone number.
 *
 * `primaryCta` is accepted (app/layout.tsx passes it) but intentionally not rendered: the
 * prototype's masthead has no separate CTA button — Contact is already a nav item and
 * serves that role. Dropping a button the approved design doesn't have keeps this faithful
 * rather than "improving" on it.
 *
 * Mobile nav — real hamburger menu, replacing the prototype's scroll-triggered pill,
 * 2026-09-12. The prototype's own mobile pattern (a fixed "Contents" pill fading in at the
 * bottom of the viewport once the hero scrolled out of view — see git history for the removed
 * `pillVisible`/`IntersectionObserver` implementation) was flagged by Ricky as not clear
 * enough: invisible until you scroll, and its translucent dark fill blended into this site's
 * already-dark background. Replaced with a standard always-visible hamburger button, following
 * the same accessible pattern already established on NP Racing
 * (`sites/npracing-v1/components/site-nav-mobile.tsx`): portalled to `document.body` (this
 * header has no `backdrop-filter`/`transform`, so an inline `fixed inset-0` dialog would have
 * worked too, but portalling is the safer default — see root `CLAUDE.md`'s CSS notes on why an
 * inline one breaks under either of those ancestor properties), closes on Escape, and locks
 * body scroll while open. The phone number moves into this panel on mobile — per Ricky's
 * request, it no longer appears in the collapsed mobile header bar at all, only inside the menu
 * and in the always-visible desktop nav.
 *
 * "All work" back-link: the prototype's masthead carries `<a class="back" href="index.html">
 * All work</a>` on every non-home page (workshop.html ~L1288, contact.html ~L1395), and never
 * on the home page itself. Rendered here as a real `/` link, shown only when the current route
 * isn't `/`. Left in the collapsed header bar (not moved into the hamburger panel) — it's a
 * short text link, not a crowding concern, and the request was specifically about the phone
 * number and the nav pattern.
 */
export function SiteHeader({
  siteName,
  phoneDisplay,
  phoneTel,
  showPhone = true,
  navigation,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const isNavItemActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const isHome = pathname === '/';

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center gap-[clamp(0.9rem,2vw,1.5rem)] pl-6 pr-6 pt-[1.15rem] pb-10 lg:pl-[max(1.5rem,calc((100vw-1360px)/2))] lg:pr-[max(1.5rem,calc((100vw-1360px)/2))] bg-[linear-gradient(to_bottom,rgba(11,11,12,0.96)_0%,rgba(11,11,12,0.9)_40%,rgba(11,11,12,0.62)_72%,rgba(11,11,12,0)_100%)]">
        <Link
          href="/"
          aria-label={`${siteName}, home`}
          className="relative block h-[clamp(4.125rem,6.9vw,5.25rem)] w-auto aspect-[500/342] shrink-0"
        >
          <Image
            src="/logo.svg"
            alt={siteName}
            fill
            priority
            sizes="220px"
            className="object-contain object-left"
          />
        </Link>

        {!isHome && (
          <Link
            href="/"
            className="inline-flex items-center gap-2 whitespace-nowrap border-b border-surface-card-border pb-[0.25rem] pt-[0.35rem] text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-surface-muted-foreground no-underline transition-colors duration-[400ms] hover:border-brand-primary-hover hover:text-surface-foreground"
          >
            <span aria-hidden="true">&larr;</span>
            All work
          </Link>
        )}

        <nav
          aria-label="Primary"
          className="ml-auto hidden min-[896px]:flex items-center gap-[clamp(0.9rem,1.8vw,1.75rem)]"
        >
          {navigation.map((item) => {
            const active = isNavItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'whitespace-nowrap border-b py-[0.35rem] text-[0.6875rem] uppercase tracking-[0.2em] no-underline transition-colors duration-[400ms]',
                  active
                    ? 'border-ink-neutral font-bold text-surface-foreground'
                    : 'border-transparent font-medium text-surface-muted-foreground hover:border-ink-neutral hover:text-surface-foreground',
                ].join(' ')}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {showPhone && phoneDisplay && phoneTel && (
          <a
            href={`tel:${phoneTel}`}
            className="hidden min-[896px]:inline-flex whitespace-nowrap border-b border-surface-card-border pb-[0.2rem] text-xs font-medium tracking-[0.1em] text-surface-foreground no-underline transition-colors duration-[400ms] hover:border-brand-primary-hover"
          >
            {phoneDisplay}
          </a>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="ml-auto grid h-11 w-11 place-items-center border border-surface-card-border text-surface-foreground transition-colors duration-[400ms] hover:border-brand-primary-hover min-[896px]:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Open menu</span>
        </button>
      </header>

      {menuOpen &&
        createPortal(
          <div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label={`${siteName} navigation`}
            className="fixed inset-0 z-50 flex flex-col bg-surface-background"
          >
            <div className="flex items-center justify-between gap-4 border-b border-surface-card-border px-6 py-4">
              <Link
                href="/"
                aria-label={`${siteName}, home`}
                onClick={() => setMenuOpen(false)}
                className="relative block h-[3.5rem] w-auto aspect-[500/342] shrink-0"
              >
                <Image
                  src="/logo.svg"
                  alt={siteName}
                  fill
                  sizes="180px"
                  className="object-contain object-left"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid h-11 w-11 place-items-center border border-surface-card-border text-surface-foreground transition-colors duration-[400ms] hover:border-brand-primary-hover"
              >
                <X className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <nav aria-label="Primary" className="flex-1 overflow-y-auto px-6 py-8">
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {navigation.map((item) => {
                  const active = isNavItemActive(item.href);
                  return (
                    <li key={item.href} className="border-b border-surface-card-border">
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={[
                          'block py-4 font-heading text-[1.75rem] font-light leading-none tracking-[-0.02em] no-underline transition-colors duration-[400ms]',
                          active
                            ? 'text-surface-foreground'
                            : 'text-surface-muted-foreground hover:text-surface-foreground',
                        ].join(' ')}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {showPhone && phoneDisplay && phoneTel && (
              <div className="border-t border-surface-card-border px-6 py-6">
                <a
                  href={`tel:${phoneTel}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-center text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-surface-muted-foreground no-underline transition-colors duration-[400ms] hover:text-surface-foreground"
                >
                  {phoneDisplay}
                </a>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
