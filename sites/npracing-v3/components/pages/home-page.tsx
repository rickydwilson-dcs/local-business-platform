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
import { getImageUrl } from '@/lib/image';

/**
 * HomePage — "Number 51" composition.
 *
 * Section order follows the finalised prototype (design-03-number51.html after
 * Round 2): poster hero -> credentials strip -> restructured team block ->
 * value strip -> rider poster -> gallery -> merch band.
 *
 * All team copy comes from `content/brand/npracing.mdx` (hero lines) or from
 * site.config.ts's verified facts, EXCEPT the team-block paragraphs below,
 * which are a condensed homepage-specific teaser matching the approved
 * mockup's exact copy — the full narrative body of npracing.mdx renders
 * separately on /about, where the longer form is correct.
 */
export interface HomePageProps {
  /** JSON-LD script nodes supplied by the route. */
  schemaNodes?: ReactNode;
}

export async function HomePage({ schemaNodes }: HomePageProps) {
  const { frontmatter: brand } = await getBrandRecord();

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
        <p>
          <strong>{brand.teamName}</strong> is a private British Superbike team based in Taunton,
          Somerset, led by <strong>Neil Pearson</strong> &mdash; founder of NP Motorcycles. Since
          2004 the business has grown from a motorcycle servicing workshop into a recognised
          independent name in the BSB paddock.
        </p>
        <p>
          Without the budget of factory-backed outfits like Honda Racing UK, Ducati PBM or McAMS
          Yamaha, {brand.teamName} has earned its reputation the hard way &mdash; developing riders,
          running professionally prepared machinery, and staying close-knit.
        </p>
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
        heading="Team merchandise."
        href="/merch"
        ctaLabel="Shop now"
        imageSrc={getImageUrl('/npracing-v3/merch/np-racing-curved-peak-cap.jpg')}
      />
    </>
  );
}
