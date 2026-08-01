import Image from 'next/image';
import Link from 'next/link';
import { getBrand } from '@/lib/brand';
import { getImageUrl } from '@/lib/image';
import { siteConfig } from '@/site.config';
import { MobileMenu } from '@/components/mobile-menu';
import { TickerRibbon } from '@/components/sections/ticker-ribbon';
import { CtaButton } from '@/components/ui/cta-button';
import { InstagramIcon } from '@/components/ui/icons';

/**
 * SiteHeader — "Number 51" masthead.
 *
 * Self-contained: imports no shared theme package. Renders as a
 * server component (team facts come from the brand MDX singleton); only the
 * mobile menu is a client island.
 *
 * Composition follows design-03-number51.html: a red ticker ribbon, then a
 * full-bleed black nav bar with a heavy red underline that sticks to the top
 * as the ribbon scrolls away.
 */
const NAV_LINKS = [
  { label: 'Team', href: '/#team' },
  { label: 'Rider', href: '/#rider' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Merch', href: '/merch' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
];

export async function SiteHeader() {
  const brand = await getBrand();

  const tickerItems = [
    `${brand.championship} — 2026`,
    `#${brand.raceNumber} ${brand.riderName}`,
    `${siteConfig.racing.manufacturer} Fireblade`,
    siteConfig.racing.base,
  ];

  return (
    <header>
      <TickerRibbon items={tickerItems} />

      <div className="sticky top-0 z-50 border-b-[3px] border-brand-primary bg-surface-background">
        <nav
          aria-label="Main"
          className="relative mx-auto flex w-full max-w-[80rem] items-center gap-6 px-6 py-4"
        >
          <Link href="/" className="flex flex-none items-center">
            <Image
              src={getImageUrl(brand.logo.src)}
              alt={brand.teamName}
              width={200}
              height={50}
              className="h-10 w-auto sm:h-[3.125rem]"
              priority
            />
          </Link>

          <ul className="ml-2 hidden gap-0.5 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-3 py-2 font-sans text-[0.82rem] font-semibold uppercase tracking-[0.06em] text-surface-foreground transition-colors duration-normal hover:bg-white/[0.08] hover:text-brand-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2">
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center border border-transparent text-surface-foreground transition-colors duration-normal hover:border-surface-card-border hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              <InstagramIcon />
              <span className="sr-only">
                {brand.teamName} on Instagram {brand.instagramHandle} (opens in a new tab)
              </span>
            </a>

            <span className="hidden sm:inline-flex">
              <CtaButton href="/merch">Shop</CtaButton>
            </span>

            <MobileMenu links={NAV_LINKS} shopHref="/merch" shopLabel="Shop merchandise" />
          </div>
        </nav>
      </div>
    </header>
  );
}
