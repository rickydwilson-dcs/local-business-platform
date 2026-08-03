import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';
import { SiteNavMobile } from '@/components/site-nav-mobile';

/**
 * Nav-specific logo mark — the brand logo trimmed to just the red oval
 * ("NP RACING"), dropping the "BRITISH SUPERBIKE TEAM" subtitle and the
 * dead black canvas space the source PNG carries around it. The `logo` prop
 * (full canvas, with subtitle) is still used for its `alt` text and remains
 * correct for the footer/schema, which want the full mark — only the nav
 * rendering swaps to this tighter asset so it can run bigger without the
 * baked-in padding making it look small inside the pill.
 */
const NAV_LOGO_SRC =
  'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/npracing-v1/logo/npracing-logo-mark.png';

/**
 * SiteHeader — Grid Box floating pill navigation.
 *
 * Server Component (no 'use client'): only the mobile drawer is interactive,
 * and that lives in `SiteNavMobile`. Replaces the base-template shim around
 * `@platform/core-components`' SiteHeader; the plumbing it carried
 * (site name, nav config from site.config.ts, primary CTA, mobile menu) is
 * preserved, restyled, and extended with the announce bar, team logo and
 * Instagram link that this design needs.
 *
 * Layout: a full-width red announce bar, then a sticky, backdrop-blurred
 * pill that floats over the hero.
 */
export interface SiteHeaderProps {
  /** Team/business name — logo alt text and mobile drawer title. */
  siteName: string;
  /** Team logo (R2 key or absolute URL) from content/brand/npracing.mdx. */
  logo: { src: string; alt: string };
  /** Primary navigation, from site.config.ts. */
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  /** Right-hand pill button. */
  primaryCta: { label: string; href: string };
  instagramUrl: string;
  instagramHandle: string;
  facebookUrl: string;
  /** Text of the red bar above the nav (championship + season). */
  announcement?: string;
}

export function SiteHeader({
  siteName,
  logo,
  navigation,
  primaryCta,
  instagramUrl,
  instagramHandle,
  facebookUrl,
  announcement,
}: SiteHeaderProps) {
  return (
    <>
      {announcement && (
        <div className="relative z-30 bg-brand-primary px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] text-on-brand-primary">
          <span>{announcement}</span>{' '}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            {instagramHandle}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      )}

      <div className="sticky top-0 z-40 px-4 pt-4">
        <header className="container-grid h-nav flex items-center gap-4 rounded-full border border-surface-card-border bg-overlay-dark px-3 backdrop-blur-md sm:px-4">
          <Link
            href="/"
            className="flex flex-shrink-0 items-center"
            aria-label={`${siteName} home`}
          >
            <Image
              src={NAV_LOGO_SRC}
              alt={logo.alt}
              width={800}
              height={346}
              priority
              className="h-16 w-auto object-contain"
            />
          </Link>

          <nav aria-label="Main navigation" className="ml-2 hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-semibold uppercase tracking-[0.05em] text-surface-foreground transition-colors hover:bg-surface-muted hover:text-brand-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 w-10 place-items-center rounded-full border border-transparent text-surface-foreground transition-colors hover:border-surface-card-border hover:bg-surface-muted sm:grid"
            >
              <Instagram className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">
                {siteName} on Instagram {instagramHandle} (opens in a new tab)
              </span>
            </a>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 w-10 place-items-center rounded-full border border-transparent text-surface-foreground transition-colors hover:border-surface-card-border hover:bg-surface-muted sm:grid"
            >
              <Facebook className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">{siteName} on Facebook (opens in a new tab)</span>
            </a>

            <Link href={primaryCta.href} className="btn-primary hidden px-5 py-2.5 sm:inline-flex">
              {primaryCta.label}
            </Link>

            <SiteNavMobile
              siteName={siteName}
              navigation={navigation}
              primaryCta={primaryCta}
              instagramUrl={instagramUrl}
              instagramHandle={instagramHandle}
              facebookUrl={facebookUrl}
            />
          </div>
        </header>
      </div>
    </>
  );
}
