import Image from 'next/image';
import Link from 'next/link';
import { getBrand } from '@/lib/brand';
import { getImageUrl } from '@/lib/image';
import { siteConfig } from '@/site.config';
import { InstagramIcon } from '@/components/ui/icons';

/**
 * SiteFooter — "Number 51" footer.
 *
 * Self-contained (imports no shared theme package). Contact details and the
 * Instagram link come from the brand MDX singleton; legal/attribution strings
 * come from site.config.ts. Nothing here is invented — the team has no public
 * phone number or street address, so neither is shown.
 */
const TEAM_LINKS = [
  { label: 'The team', href: '/#team' },
  { label: 'Rider', href: '/#rider' },
  { label: 'Gallery', href: '/#gallery' },
];

const MORE_LINKS = [
  { label: 'News', href: '/news' },
  { label: 'Merchandise', href: '/merch' },
  { label: 'Contact', href: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy policy', href: '/privacy-policy' },
  { label: 'Cookie policy', href: '/cookie-policy' },
];

const COLUMN_HEADING_CLASSES =
  'mb-4 font-sans text-caption uppercase text-surface-tertiary tracking-[0.14em]';
const FOOTER_LINK_CLASSES =
  'text-small text-surface-secondary transition-colors duration-normal hover:text-surface-foreground';

export async function SiteFooter() {
  const brand = await getBrand();

  return (
    <footer className="border-t border-surface-card-border pt-14 pb-8">
      <div className="mx-auto w-full max-w-[80rem] px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex items-start">
            <Image
              src={getImageUrl(brand.logo.src)}
              alt={brand.logo.alt}
              width={480}
              height={120}
              className="h-auto w-full max-w-[15rem]"
            />
          </div>

          <div>
            <h2 className={COLUMN_HEADING_CLASSES}>Team</h2>
            <ul className="space-y-2.5">
              {TEAM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK_CLASSES}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={COLUMN_HEADING_CLASSES}>More</h2>
            <ul className="space-y-2.5">
              {MORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK_CLASSES}>
                    {link.label}
                  </Link>
                </li>
              ))}
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK_CLASSES}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={COLUMN_HEADING_CLASSES}>Get in touch</h2>
            <ul className="space-y-2.5">
              <li>
                <a href={`mailto:${brand.email}`} className={FOOTER_LINK_CLASSES}>
                  {brand.email}
                </a>
              </li>
              <li>
                <a
                  href={brand.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={FOOTER_LINK_CLASSES}
                >
                  Instagram {brand.instagramHandle}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li className="text-small text-surface-tertiary">{siteConfig.racing.base}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-surface-subtle pt-6">
          <p className="text-small text-surface-tertiary">
            &copy; {siteConfig.footer.copyright}
            {siteConfig.footer.builtBy && (
              <>
                {' '}
                | Built by{' '}
                <a
                  href={siteConfig.footer.builtBy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-surface-foreground underline transition-colors duration-normal hover:text-brand-accent"
                >
                  {siteConfig.footer.builtBy.name}
                </a>
              </>
            )}
          </p>

          <a
            href={brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="grid h-10 w-10 place-items-center border border-surface-card-border text-surface-secondary transition-colors duration-normal hover:border-surface-foreground hover:text-surface-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          >
            <InstagramIcon />
            <span className="sr-only">
              {brand.teamName} on Instagram {brand.instagramHandle} (opens in a new tab)
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
