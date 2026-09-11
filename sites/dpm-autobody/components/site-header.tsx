'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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
 * Mobile nav: the prototype has no hamburger/open-close panel. Below its own 56rem
 * handover breakpoint the inline nav disappears entirely and a fixed "Contents" pill
 * (`.pill`/`#pill`) fades in at the bottom of the viewport once the page's hero (`id="top"`)
 * scrolls out of view (CSS L277-283, the `IntersectionObserver` near the foot of the
 * prototype's `<script>`). Replicated below with the same intersection-based show/hide;
 * falls back to a scroll-position heuristic on any route that doesn't render a `#top` hero
 * (this header is shared across every route, including ones later phases haven't built yet).
 */
export function SiteHeader({
  siteName,
  phoneDisplay,
  phoneTel,
  showPhone = true,
  navigation,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [pillVisible, setPillVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('top');

    if (hero) {
      const observer = new IntersectionObserver(
        ([entry]) => setPillVisible(!entry.isIntersecting),
        { threshold: 0 }
      );
      observer.observe(hero);
      return () => observer.disconnect();
    }

    // No `#top` hero on this route (yet) — approximate the same "past the first
    // screenful" moment the prototype uses everywhere else.
    const onScroll = () => setPillVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const isNavItemActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

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

        <nav
          aria-label="Primary"
          className="ml-auto hidden min-[56rem]:flex items-center gap-[clamp(0.9rem,1.8vw,1.75rem)]"
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
                    ? 'border-brand-primary-hover font-bold text-surface-foreground'
                    : 'border-transparent font-medium text-surface-muted-foreground hover:border-brand-primary-hover hover:text-surface-foreground',
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
            className="ml-auto min-[56rem]:ml-0 whitespace-nowrap border-b border-surface-card-border pb-[0.2rem] text-xs font-medium tracking-[0.1em] text-surface-foreground no-underline transition-colors duration-[400ms] hover:border-brand-primary-hover"
          >
            {phoneDisplay}
          </a>
        )}
      </header>

      {/* Mobile "contents" nav — the prototype's `.pill`. Not a hamburger: it's always
          present in the DOM below the 56rem handover and simply fades in once the hero
          is behind you, fading out again if you scroll back up. */}
      <nav
        aria-label="Contents"
        className={[
          'fixed inset-x-0 bottom-4 z-[45] mx-auto flex w-max max-w-[calc(100%-1.5rem)]',
          'items-center gap-[0.15rem] border border-surface-card-border bg-[rgba(11,11,12,0.9)]',
          'px-2 py-[0.2rem] shadow-[inset_0_1px_0_rgba(232,228,220,0.08)]',
          'transition-[opacity,visibility] duration-500 min-[56rem]:hidden',
          pillVisible ? 'visible opacity-100' : 'invisible opacity-0',
        ].join(' ')}
      >
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-11 items-center px-[0.45rem] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-surface-foreground no-underline"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
