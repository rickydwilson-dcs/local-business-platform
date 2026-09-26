import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';
import { SiteNavMobile } from '@/components/site-nav-mobile';

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
 * Layout: a full-width blue announce bar, then a sticky, backdrop-blurred
 * pill that floats over the hero.
 */
export interface SiteHeaderProps {
  /** Team/business name — logo alt text and mobile drawer title. */
  siteName: string;
  /** Team logo (full R2 URL) from content/brand/delta-t-racing.mdx. */
  logo: { src: string; alt: string };
  /** Primary navigation, from site.config.ts. */
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  /** Right-hand pill button. */
  primaryCta: { label: string; href: string };
  /** Omitted until the team confirms its social accounts. */
  instagramUrl?: string;
  instagramHandle?: string;
  facebookUrl?: string;
  /** Text of the blue bar above the nav (championship + season). */
  announcement?: string;
  /** Optional link appended to the announce bar. */
  announcementLink?: { label: string; href: string };
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
  announcementLink,
}: SiteHeaderProps) {
  return (
    <>
      {announcement && (
        <div className="relative z-30 bg-brand-primary px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] text-on-brand-primary">
          <span>{announcement}</span>
          {announcementLink && (
            <>
              {' '}
              <Link href={announcementLink.href} className="underline underline-offset-2">
                {announcementLink.label}
              </Link>
            </>
          )}
        </div>
      )}

      <div className="sticky top-0 z-40 px-4 pt-4">
        <header className="container-grid h-nav flex items-center gap-4 rounded-full border border-surface-card-border bg-overlay-dark px-3 backdrop-blur-md sm:px-4">
          <Link
            href="/"
            className="flex flex-shrink-0 items-center"
            aria-label={`${siteName} home`}
          >
            {/* The logo's blue lettering measures 1.93:1 on the dark nav, so
                it sits on a light plate rather than being recoloured. */}
            <span className="logo-plate">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={630}
                height={549}
                priority
                sizes="120px"
                className="h-12 w-auto object-contain"
              />
            </span>
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
            {instagramUrl && (
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
            )}

            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden h-10 w-10 place-items-center rounded-full border border-transparent text-surface-foreground transition-colors hover:border-surface-card-border hover:bg-surface-muted sm:grid"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">{siteName} on Facebook (opens in a new tab)</span>
              </a>
            )}

            <Link href={primaryCta.href} className="btn-primary hidden px-5 py-2.5 sm:inline-flex">
              {primaryCta.label}
            </Link>

            <SiteNavMobile
              siteName={siteName}
              logoSrc={logo.src}
              logoAlt={logo.alt}
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
