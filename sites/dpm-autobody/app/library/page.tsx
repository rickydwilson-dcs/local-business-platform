/**
 * Library Page — "Every restoration"
 *
 * Server Component with metadata, canonical URL, and structured data — same shape as
 * app/contact/page.tsx and app/workshop/page.tsx.
 *
 * A generated view over the `builds` MDX collection (see lib/content-schemas.ts's
 * BuildFrontmatterSchema and content/builds/*.mdx), not a separately maintained list — per
 * output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/session.md Phase 2's own
 * architectural decision. Ledger design ported from the approved static prototype:
 * output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/library.html
 * (`.ledger`/`.ledger__item`/`.ledger__item--photo`/`.chapter`/`.golink`/`.golink--dead`).
 *
 * A build with `heroImage` gets the photo treatment; a build without gets a text-only row —
 * never a placeholder box (this project's established rule: an empty box reads as broken,
 * a text-only row reads as "not yet catalogued", which is the truth — see library.html's own
 * comment above `.ledger`). A build with `pageStatus: 'built'` gets a real link to
 * `/builds/[slug]`; a `pageStatus: 'pending'` build gets a visually disabled, non-interactive
 * equivalent of the prototype's `.golink--dead` treatment (dashed underline, muted colour,
 * `aria-disabled`) rather than a dead `href="#"` link, since this is a real site, not a static
 * demo.
 *
 * Row order: the prototype numbers all 12 builds 1-12 in a fixed reading order that has no
 * equivalent field in BuildFrontmatterSchema — Phase 2 deliberately kept the schema
 * sparse-friendly, and adding an `order` field is that phase's territory, not this one's.
 * getBuilds() sorts alphabetically by title (the generic content-loader's default sort,
 * shared with services/projects/etc.), which does not match the register's real reading
 * order, so the fixed slug sequence below reproduces it instead — verified directly against
 * library.html's own "No. 01" … "No. 12" numbering, not assumed. Chapter membership is
 * additionally cross-checked against each build's real `status` field (completed vs.
 * in-progress) rather than asserted from position alone.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { ADDRESS } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { Schema } from '@platform/core-components';
import { getBuilds, type Build } from '@/lib/content';
import { SourcingGapNotice } from '@/components/sourcing-gap-notice';

const PAGE_DESCRIPTION =
  'Every restoration DPM Autobody has completed, and every one currently in the workshop. Berwick, East Sussex.';

export const metadata: Metadata = {
  title: `Every Restoration | ${siteConfig.business.name}`,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: absUrl('/library'),
  },
};

/**
 * The prototype's own row order (library.html "No. 01" … "No. 12"), reproduced here because
 * the schema has no order field — see file header. Confirmed 2026-09-11: prototype rows No. 11
 * ("Volvo, model to be confirmed" — the singer's car) and No. 12 ("Pearl White") are the same
 * build, not two — `volvo-tbc.mdx` was removed and its owner-history note folded into
 * `p1800-pearl-white.mdx`'s `scopeOfWork`, leaving 11 real slugs, not 12.
 *
 * Confirmed 2026-09-12: `p1800-pair-one-client` was also removed (12 → 10 total) — it was a
 * duplicate placeholder describing "two P1800s, one client, both won show awards" as its own
 * lot, when those two cars are (at least one of them, confirmed) already catalogued as their own
 * builds elsewhere in this list (the resto-mod, chassis 23925). The pair fact now lives as a
 * `sourcingGaps` note on that build instead of a separate lot.
 *
 * Confirmed 2026-09-15: `jaguar-sea-green` was removed (10 → 9 total) at David's own request —
 * he called it "an old not particularly well documented restoration" and asked for it to come
 * out of the portfolio. All slugs below must appear here exactly once; a slug present in
 * content/builds/ but missing from this list would simply never render, which is why every
 * filename under content/builds/ has a matching entry.
 */
const LIBRARY_ORDER = [
  'p1800-candy',
  'p1800-candy-restomod',
  'p1800-red',
  'bentley-s3-continental',
  'etype-941pvo',
  'porsche-356-sc',
  'aston-martin-db6-pink',
  'bentley-s3-1964',
  'p1800-pearl-white',
  'volvo-262c',
] as const;

/** Hand-authored "the full record of…" labels for the two real documented-car pages, matching
 * library.html's own per-row copy exactly. Any future build that flips to `pageStatus: 'built'`
 * without an entry here falls back to a generic label derived from its own frontmatter. */
const BUILT_RECORD_LABEL: Record<string, string> = {
  'p1800-candy': 'The full record of the P1800',
  'etype-941pvo': 'The full record of the E-Type',
};

function recordLabel(build: Build): string {
  return (
    BUILT_RECORD_LABEL[build.slug] ??
    `The full record of the ${build.model ?? build.make ?? 'build'}`
  );
}

type MetaSegment = { text: string; emphasize?: boolean };

/** Assembles the ledger__meta line from whatever real fields a build actually has — chassis,
 * hours, duration, then owner/commissioner — never fabricating a value it doesn't have. */
function metaSegments(build: Build): MetaSegment[] {
  const segments: MetaSegment[] = [];
  if (build.chassisNumber) {
    segments.push({ text: `Chassis ${build.chassisNumber}`, emphasize: true });
  }
  if (build.hoursOfLabour) {
    segments.push({ text: build.hoursOfLabour });
  }
  if (build.buildDuration) {
    segments.push({ text: build.buildDuration });
  }
  if (build.ownerName) {
    segments.push({
      text: build.commissionerName
        ? `owned by ${build.ownerName}, commissioned by ${build.commissionerName}`
        : `owned by ${build.ownerName}`,
    });
  }
  return segments;
}

function ChapterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative border-t border-surface-card-border pt-[clamp(5.5rem,13vh,10rem)]">
      <span
        aria-hidden
        className="absolute -top-0.5 left-0 h-[3px] w-[clamp(3.5rem,8vw,6rem)] bg-ink-neutral"
      />
      <span className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-surface-muted-foreground">
        {children}
      </span>
    </div>
  );
}

function LedgerRow({ build, number }: { build: Build; number: number }) {
  const hasPhoto = Boolean(build.heroImage);
  const segments = metaSegments(build);
  const label = recordLabel(build);
  const dotClasses = 'inline-flex h-[0.5em] w-[0.5em] flex-none rotate-45 border-r border-t';

  return (
    <li
      className={`grid gap-4 border-b border-[rgba(232,228,220,0.07)] py-[clamp(1.75rem,4vh,2.5rem)] ${
        hasPhoto
          ? 'grid-cols-1 sm:grid-cols-[minmax(9rem,15rem)_minmax(0,1fr)] sm:items-start sm:gap-8'
          : 'grid-cols-1'
      }`}
    >
      {hasPhoto && build.heroImage ? (
        <div className="relative aspect-[4/3] overflow-clip bg-surface-muted">
          <Image
            src={build.heroImage}
            alt={`${build.title}, DPM Autobody restoration.`}
            fill
            quality={45}
            sizes="(min-width: 40rem) 15rem, 100vw"
            className="object-cover saturate-[1.08] contrast-[1.05] brightness-[1.1]"
          />
        </div>
      ) : null}

      <div>
        {build.status === 'in-progress' && (
          <span className="mb-[0.65rem] flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-surface-muted-foreground">
            <span aria-hidden className="h-[5px] w-[5px] rounded-full bg-surface-card-border" />
            Restoration in progress
          </span>
        )}

        <span className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink-neutral">
          No. {String(number).padStart(2, '0')}
        </span>

        <h2 className="mb-2 text-balance font-heading text-[clamp(1.375rem,1.7vw+0.9rem,1.875rem)] font-light leading-[1.1] text-surface-foreground">
          {build.title}
        </h2>

        {segments.length > 0 && (
          <p className="mb-[0.65rem] flex flex-wrap items-baseline gap-x-[0.9rem] gap-y-[0.4rem] text-[0.75rem] tracking-[0.02em] text-surface-muted-foreground">
            {segments.map((segment, index) => (
              <span key={segment.text} className="inline-flex items-baseline gap-x-[0.9rem]">
                {segment.emphasize ? (
                  <strong className="font-medium text-surface-foreground">{segment.text}</strong>
                ) : (
                  segment.text
                )}
                {index < segments.length - 1 && <span aria-hidden>&middot;</span>}
              </span>
            ))}
          </p>
        )}

        {build.scopeOfWork && (
          <p className="mb-[0.85rem] max-w-[42em] font-prose text-[0.9375rem] font-light leading-[1.55] text-[#CFCAC1]">
            {build.scopeOfWork}
          </p>
        )}

        <SourcingGapNotice gaps={build.sourcingGaps} />

        {build.pageStatus === 'built' ? (
          <Link
            href={`/builds/${build.slug}`}
            className="group inline-flex min-h-11 items-center gap-[0.9rem] border-b border-ink-neutral pb-[0.55rem] pt-[0.55rem] text-[0.75rem] font-medium uppercase tracking-[0.2em] text-surface-foreground transition-colors duration-300 hover:text-brand-primary-hover"
          >
            {label}
            <span
              aria-hidden
              className={`${dotClasses} border-ink-neutral transition-transform duration-300 group-hover:translate-x-0.5`}
            />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex min-h-11 cursor-not-allowed items-center gap-[0.9rem] border-b border-dashed border-surface-card-border pb-[0.55rem] pt-[0.55rem] text-[0.75rem] font-medium uppercase tracking-[0.2em] text-surface-muted-foreground"
          >
            {label}
            <span aria-hidden className={`${dotClasses} border-surface-card-border`} />
          </span>
        )}
      </div>
    </li>
  );
}

export default async function LibraryPage() {
  const builds = await getBuilds();
  const bySlug = new Map(builds.map((build) => [build.slug, build]));

  const ordered = LIBRARY_ORDER.map((slug, index) => {
    const build = bySlug.get(slug);
    return build ? { build, number: index + 1 } : null;
  }).filter((entry): entry is { build: Build; number: number } => entry !== null);

  const delivered = ordered.filter(({ build }) => build.status === 'completed');
  const inProgress = ordered.filter(({ build }) => build.status === 'in-progress');

  return (
    <>
      <div className="bg-surface-background">
        <div className="mx-auto w-[min(1360px,100%-3rem)] pb-[clamp(4rem,10vh,6rem)]">
          {/* ── Page head ────────────────────────────────────────────────── */}
          <div className="pt-[clamp(9rem,16vh,13rem)] pb-[clamp(2.5rem,6vh,4.5rem)]">
            <p className="m-0 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink-neutral">
              Every restoration &nbsp;&middot;&nbsp; {ADDRESS.locality}, {ADDRESS.region}
            </p>
            <h1 className="mt-[0.85rem] max-w-[17ch] text-balance font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] tracking-[-0.034em] text-surface-foreground">
              Some of the cars that have passed through the workshop.
            </h1>
          </div>

          {/* ── Finished and delivered ───────────────────────────────────── */}
          <div id="delivered">
            <ChapterHeading>Finished and delivered</ChapterHeading>
            <ul className="m-0 list-none border-t border-surface-card-border p-0">
              {delivered.map(({ build, number }) => (
                <LedgerRow key={build.slug} build={build} number={number} />
              ))}
            </ul>
          </div>

          {/* ── In the workshop now ──────────────────────────────────────── */}
          <div id="in-progress">
            <ChapterHeading>In the workshop now</ChapterHeading>
            <ul className="m-0 list-none border-t border-surface-card-border p-0">
              {inProgress.map(({ build, number }) => (
                <LedgerRow key={build.slug} build={build} number={number} />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Schema Markup */}
      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Every Restoration', url: '/library' },
        ]}
        webpage={{
          '@type': 'CollectionPage',
          '@id': absUrl('/library#collectionpage'),
          url: absUrl('/library'),
          name: `Every Restoration | ${siteConfig.business.name}`,
          description: PAGE_DESCRIPTION,
        }}
      />
    </>
  );
}
