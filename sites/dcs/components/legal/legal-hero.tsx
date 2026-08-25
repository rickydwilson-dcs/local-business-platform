import Link from 'next/link';

interface LegalHeroProps {
  title: string;
  current: string;
  lastUpdated: string;
}

/**
 * Hero band for legal/text-heavy pages. Mirrors the brand-primary
 * breadcrumb + heading pattern used by SiteAboutPage
 * (components/pages/AboutPage.tsx) so these pages read as part of the
 * same site rather than a bolted-on template.
 */
export function LegalHero({ title, current, lastUpdated }: LegalHeroProps) {
  return (
    <header className="bg-brand-primary py-14 md:py-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-white/70">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <span className="material-symbols-outlined text-sm leading-none align-middle">
                chevron_right
              </span>
            </li>
            <li>
              <span className="text-white font-semibold" aria-current="page">
                {current}
              </span>
            </li>
          </ol>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-3 leading-[1.1]">
          {title}
        </h1>
        <p className="text-white/70 text-sm">Last updated {lastUpdated}</p>
      </div>
    </header>
  );
}
