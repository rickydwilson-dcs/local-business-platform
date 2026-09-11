'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { siteConfig } from '@/site.config';

export interface SiteFooterProps {
  siteName: string;
  tagline: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  address: { locality: string; region: string };
  certifications: Array<{ name: string; description: string; icon?: string }>;
  services: Array<{ slug: string; title: string }>;
  locations: Array<{ slug: string; title: string }>;
  totalServices: number;
  totalLocations: number;
  maxServices: number;
  maxLocations: number;
  showServices: boolean;
  showLocations: boolean;
  copyright: string;
  builtBy?: { name: string; url: string };
}

// The prototype's real, approved colophon socials are Instagram/Facebook/YouTube (see
// output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/index.html
// ~L1663-1673) — all three URLs are now populated in `site.config.ts`'s
// `business.socialMedia`, transcribed verbatim from that approved markup. This footer
// renders only whichever of these are actually populated in site.config.ts, never a
// fabricated URL.
const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
} as const;

/**
 * SiteFooter — DPM Autobody colophon.
 *
 * Ported from the approved static prototype's `<footer>`/`.colophon` (see
 * output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/index.html —
 * CSS ~L1091-1152, markup ~L1657-1678): the real logo mark (muted), a single address/phone/
 * email line, social icons, and a centred "Built by" credit line.
 *
 * `certifications`/`services`/`locations`/`totalServices`/`totalLocations`/`maxServices`/
 * `maxLocations`/`showServices`/`showLocations` are accepted for interface compatibility
 * with app/layout.tsx but intentionally unused: the approved design has no
 * certification badges or services/locations columns, and DPM has no /services or
 * /locations routes (site.config.ts's own `credentials.certifications` is `[]` and
 * `footer.showServices`/`showLocations` are both `false`, so this matches the real config,
 * not just the prototype).
 *
 * "Back to the homepage" link: the prototype's colophon carries `<p><a class="back"
 * href="index.html">Back to the homepage</a></p>` right under the address line on every
 * non-home page (workshop.html ~L1392; the home page's own footer omits it — you're already
 * home). Rendered here as a real `/` link via `usePathname()`, shown only off the home route —
 * hence this is a client component.
 *
 * Logo `priority`: the brand mark below was previously native-lazy-loaded (`next/image`'s
 * default when `priority` isn't set). On a long page — `/library`'s 12-row ledger — the footer
 * sits far enough below the fold that a screenshot taken without first scrolling captures it
 * before the browser's lazy-load ever fires: reserved space (the `aspect-[500/342]` box), zero
 * painted pixels. Confirmed live: `naturalWidth`/`complete` on the footer's `<img>` read `0`/
 * `false` on initial load and `188`/`true` only once actually scrolled into view — the same
 * `/logo.svg` request the header already makes `priority` (eager) for exactly this reason.
 * `priority` here makes the footer mark load unconditionally, matching the header's treatment.
 */
export function SiteFooter({
  siteName,
  phoneDisplay,
  phoneTel,
  email,
  address,
  copyright,
  builtBy,
}: SiteFooterProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const socials = (Object.keys(SOCIAL_ICONS) as Array<keyof typeof SOCIAL_ICONS>)
    .map((key) => ({ key, href: siteConfig.business.socialMedia[key], Icon: SOCIAL_ICONS[key] }))
    .filter(
      (
        entry
      ): entry is {
        key: keyof typeof SOCIAL_ICONS;
        href: string;
        Icon: (typeof SOCIAL_ICONS)[keyof typeof SOCIAL_ICONS];
      } => Boolean(entry.href)
    );

  return (
    <footer className="bg-surface-background">
      <div className="mx-auto grid w-[min(1360px,100%-3rem)] gap-6 border-t border-[rgba(232,228,220,0.07)] pb-32 pt-[clamp(3rem,8vh,5rem)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="grid gap-6">
            <Link
              href="/"
              aria-label={siteName}
              className="relative block h-[clamp(4.875rem,12vw,7.5rem)] w-auto aspect-[500/342] text-surface-muted-foreground"
            >
              <Image
                src="/logo.svg"
                alt={siteName}
                fill
                priority
                className="object-contain object-left"
              />
            </Link>
            <p className="m-0 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-surface-muted-foreground">
              {address.locality}, {address.region}
              {' '}
              {'·'}
              {' '}
              <a href={`tel:${phoneTel}`} className="no-underline hover:text-brand-primary-hover">
                <span className="whitespace-nowrap">{phoneDisplay}</span>
              </a>
              {' '}
              {'·'}
              {' '}
              <a href={`mailto:${email}`} className="no-underline hover:text-brand-primary-hover">
                {email}
              </a>
            </p>
            {!isHome && (
              <p className="m-0">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 border-b border-surface-card-border pb-[0.15rem] text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-surface-muted-foreground no-underline transition-colors duration-[400ms] hover:border-brand-primary-hover hover:text-brand-primary-hover"
                >
                  <span aria-hidden="true">&larr;</span>
                  Back to the homepage
                </Link>
              </p>
            )}
          </div>

          {socials.length > 0 && (
            <nav aria-label={`${siteName} on social media`} className="flex items-center gap-3">
              {socials.map(({ key, href, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key.charAt(0).toUpperCase() + key.slice(1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center border border-surface-card-border text-surface-muted-foreground transition-colors duration-[400ms] hover:border-brand-primary-hover hover:text-brand-primary-hover"
                >
                  <Icon className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
                </a>
              ))}
            </nav>
          )}
        </div>

        <p className="m-0 border-t border-[rgba(232,228,220,0.07)] pt-[clamp(1.5rem,4vh,2.25rem)] text-center text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-surface-muted-foreground">
          &copy; {copyright}
          {builtBy && (
            <>
              {' '}
              &middot; Built by{' '}
              <a
                href={builtBy.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-surface-card-border pb-[0.15rem] text-surface-muted-foreground no-underline transition-colors duration-[400ms] hover:border-brand-primary-hover hover:text-brand-primary-hover"
              >
                {builtBy.name}
              </a>
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
