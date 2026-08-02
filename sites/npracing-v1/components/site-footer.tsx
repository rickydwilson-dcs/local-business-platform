import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';

/**
 * SiteFooter — Grid Box footer.
 *
 * Replaces the base-template footer. The plumbing it carried (link columns
 * driven by config rather than hardcoded, contact details, copyright and the
 * built-by credit) is preserved; the services/locations columns are swapped
 * for the Team / More / Get in touch columns this site actually has, and the
 * contact details come from content/brand/npracing.mdx via the caller.
 */
export interface SiteFooterLink {
  label: string;
  href: string;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
}

export interface SiteFooterColumn {
  title: string;
  links: SiteFooterLink[];
}

export interface SiteFooterProps {
  siteName: string;
  logo: { src: string; alt: string };
  columns: SiteFooterColumn[];
  email: string;
  instagramUrl: string;
  instagramHandle: string;
  facebookUrl: string;
  copyright: string;
  builtBy?: { name: string; url: string };
}

function FooterLink({ link }: { link: SiteFooterLink }) {
  const className =
    'text-sm text-surface-secondary-foreground transition-colors hover:text-surface-foreground';

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export function SiteFooter({
  siteName,
  logo,
  columns,
  email,
  instagramUrl,
  instagramHandle,
  facebookUrl,
  copyright,
  builtBy,
}: SiteFooterProps) {
  return (
    <footer className="border-t border-surface-card-border pb-8 pt-14">
      <div className="container-grid">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex items-start">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={240}
              height={120}
              className="h-auto w-full max-w-[15rem] object-contain object-left"
            />
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-surface-tertiary-foreground">
                {column.title}
              </h2>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}-${link.label}`}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-surface-tertiary-foreground">
              Get in touch
            </h2>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-surface-secondary-foreground transition-colors hover:text-surface-foreground"
                >
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-surface-secondary-foreground transition-colors hover:text-surface-foreground"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                  Instagram {instagramHandle}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-surface-secondary-foreground transition-colors hover:text-surface-foreground"
                >
                  <Facebook className="h-4 w-4" aria-hidden="true" />
                  Facebook
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-surface-secondary-foreground transition-colors hover:text-surface-foreground"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-sm text-surface-secondary-foreground transition-colors hover:text-surface-foreground"
                >
                  Cookie policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-surface-subtle-border pt-6 text-xs text-surface-tertiary-foreground">
          <p>
            &copy; {copyright}
            {builtBy && (
              <>
                {' '}
                &middot; Built by{' '}
                <a
                  href={builtBy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 transition-colors hover:text-surface-foreground"
                >
                  {builtBy.name}
                </a>
              </>
            )}
          </p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="grid h-10 w-10 place-items-center rounded-full border border-surface-card-border text-surface-secondary-foreground transition-colors hover:border-surface-foreground hover:text-surface-foreground"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">
              {siteName} on Instagram {instagramHandle} (opens in a new tab)
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
