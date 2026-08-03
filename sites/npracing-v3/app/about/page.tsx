/**
 * About route
 *
 * NPRacing is a British Superbike team, not a local service business — this
 * page renders the team's own facts and narrative from
 * `content/brand/npracing.mdx` (via `getBrand()` / `getBrandRecord()`), not
 * the base-template's "Get a Free Quote" / certifications copy.
 *
 * Reuses the "Number 51" section components already established by the
 * homepage (`PageHead`, `StatBlocks`, `TeamBlock`, `ValueStrip`) so the page
 * shares the same visual language rather than inventing a new one.
 */

import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { getBrand, getBrandRecord } from '@/lib/brand';
import { siteConfig } from '@/site.config';
import { absUrl } from '@/lib/site';
import { PageHead } from '@/components/sections/page-head';
import { StatBlocks, type StatBlockItem } from '@/components/sections/stat-blocks';
import { TeamBlock } from '@/components/sections/team-block';
import { ValueStrip } from '@/components/sections/value-strip';
import { CtaButton } from '@/components/ui/cta-button';

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();

  const description = `${brand.teamName} is an independent ${brand.championship} team run by ${siteConfig.racing.owner.name}, based in ${siteConfig.racing.base}, racing Honda machinery with #${brand.raceNumber} ${brand.riderName}.`;

  return {
    title: 'About',
    description,
    alternates: {
      canonical: absUrl('/about'),
    },
    openGraph: {
      title: `About ${brand.teamName}`,
      description,
      url: absUrl('/about'),
      siteName: siteConfig.business.name,
      type: 'website',
    },
  };
}

export default async function AboutRoute() {
  const { frontmatter: brand, content: brandNarrative } = await getBrandRecord();

  const facts: StatBlockItem[] = [
    { value: brand.championship, label: 'Championship' },
    { value: `#${brand.raceNumber}`, label: 'Race Number' },
    { value: brand.riderName, label: 'Rider' },
    ...(brand.foundedYear ? [{ value: String(brand.foundedYear), label: 'Founded' }] : []),
  ];

  return (
    <>
      <PageHead
        tag="About"
        heading={brand.teamHeadline ?? `Run by ${siteConfig.racing.owner.name}.`}
        lede={
          brand.heroIntro ??
          `${brand.teamName} — ${brand.tagline}, based in ${siteConfig.racing.base}.`
        }
      />

      <StatBlocks stats={facts} label={`${brand.teamName} facts`} />

      <TeamBlock
        heading="The story so far"
        imageAlt={`${brand.teamName} crew on the grid with rider #${brand.raceNumber} under the team umbrella`}
      >
        {brandNarrative}
        <div className="not-prose mt-6">
          <CtaButton href="/team">Meet the full crew</CtaButton>
        </div>
      </TeamBlock>

      <ValueStrip
        values={siteConfig.about?.values ?? []}
        label={`What ${brand.teamName} is known for`}
      />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ]}
        webpage={{
          '@type': 'AboutPage',
          '@id': absUrl('/about#aboutpage'),
          url: absUrl('/about'),
          name: `About ${brand.teamName}`,
          description: `${brand.teamName} — ${brand.tagline}, based in ${siteConfig.racing.base}.`,
        }}
      />
    </>
  );
}
