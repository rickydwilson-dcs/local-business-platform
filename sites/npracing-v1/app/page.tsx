import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/home-page';
import { siteConfig } from '@/site.config';
import { getBrandContent } from '@/lib/brand';
import { absUrl } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter: brand } = await getBrandContent();

  const title = `${siteConfig.business.name} | ${siteConfig.tagline}`;
  const description = `${brand.tagline}. Follow ${brand.teamName} — ${brand.championship} — and rider ${brand.riderName}, #${brand.raceNumber}, on the British Superbike grid.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: absUrl('/'),
      siteName: siteConfig.name,
      images: [
        {
          // Reuses the same placehold.co placeholder as content/brand/npracing.mdx's
          // logo.src — no R2 credentials available yet, see Phase 4 — rather than
          // a second, broken /logo.svg reference (that file doesn't exist in public/).
          url: brand.logo.src,
          width: 1200,
          height: 630,
          alt: `${siteConfig.business.name} - ${siteConfig.tagline}`,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [brand.logo.src],
    },
    alternates: {
      canonical: absUrl('/'),
    },
  };
}

export default async function HomePageRoute() {
  // The homepage's factual claims (team name, championship, rider, founding
  // year) come from content/brand/npracing.mdx frontmatter. The team-section
  // teaser copy is short marketing text specific to this condensed homepage
  // layout, not the full team story — that lives on /about, which renders
  // this same file's MDX body separately.
  const { frontmatter: brand } = await getBrandContent();

  // NOTE: no LocalBusiness JSON-LD is emitted here. NPRacing is a race team
  // with no public office address/phone/hours, and the shared schema
  // generator's `LocalBusinessSchemaOptions['businessType']` union
  // (packages/core-components/src/lib/schema-types.ts) has no `SportsTeam`
  // member and requires non-optional address/telephone/geo/openingHours —
  // there is no factually-honest way to populate that shape for this site.
  // Per this platform's philosophy of not over-engineering fixes for known
  // upstream type gaps, we simply don't call `getLocalBusinessSchema()` from
  // this route rather than inventing fake-but-plausible business details.

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absUrl('/#website'),
    name: siteConfig.business.name,
    url: absUrl('/'),
    description: siteConfig.tagline,
    publisher: {
      '@id': absUrl('/#organization'),
    },
    inLanguage: 'en-GB',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: absUrl('/'),
      },
    ],
  };

  const schemaNodes = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );

  return <HomePage brand={brand} schemaNodes={schemaNodes} />;
}
