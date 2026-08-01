import type { ReactNode } from 'react';
import { getBrandRecord } from '@/lib/brand';
import { siteConfig } from '@/site.config';
import { PosterHero } from '@/components/sections/poster-hero';
import { StatBlocks } from '@/components/sections/stat-blocks';
import { TeamBlock } from '@/components/sections/team-block';
import { ValueStrip } from '@/components/sections/value-strip';
import { RiderPoster } from '@/components/sections/rider-poster';
import { GalleryStrip } from '@/components/sections/gallery-strip';
import { MerchCta } from '@/components/sections/merch-cta';

/**
 * HomePage — "Number 51" composition.
 *
 * Section order follows the finalised prototype (design-03-number51.html after
 * Round 2): poster hero -> credentials strip -> restructured team block ->
 * value strip -> rider poster -> gallery -> merch band.
 *
 * All team copy comes from `content/brand/npracing.mdx` (hero lines and the
 * narrative body) or from site.config.ts's verified facts. Nothing about the
 * team is written into this file.
 */
export interface HomePageProps {
  /** JSON-LD script nodes supplied by the route. */
  schemaNodes?: ReactNode;
}

export async function HomePage({ schemaNodes }: HomePageProps) {
  const { frontmatter: brand, content: brandNarrative } = await getBrandRecord();

  const eyebrow = `${siteConfig.racing.base} · Est. ${siteConfig.credentials.yearEstablished}`;

  return (
    <>
      {schemaNodes}

      <PosterHero brand={brand} eyebrow={eyebrow} photoTag={`#${brand.raceNumber} · Knockhill`} />

      <StatBlocks stats={siteConfig.credentials.stats} label={`${brand.teamName} at a glance`} />

      <TeamBlock
        heading={brand.teamHeadline ?? `Run by ${siteConfig.racing.owner.name}.`}
        imageAlt={`${brand.teamName} crew on the grid with rider #${brand.raceNumber} under the team umbrella`}
      >
        {brandNarrative}
      </TeamBlock>

      <ValueStrip
        values={siteConfig.about?.values ?? []}
        label={`What ${brand.teamName} is known for`}
      />

      <RiderPoster
        raceNumber={brand.raceNumber}
        riderName={brand.riderName}
        riderNote={siteConfig.racing.rider.joined}
        season="2026"
      />

      <GalleryStrip
        heading="From the paddock to the podium."
        teamName={brand.teamName}
        riderName={brand.riderName}
      />

      <MerchCta
        heading="Team merchandise — shop the full range."
        href="/merch"
        ctaLabel="Shop now"
      />
    </>
  );
}
