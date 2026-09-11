/**
 * Build Detail Page — the "documented car" template
 * ===================================================
 *
 * Shared template for any `builds` MDX entry with `pageStatus: 'built'`, rendered at
 * `/builds/[slug]` (see app/builds/[slug]/page.tsx). This is ONE template used by both the
 * P1800 Candy and E-type pages today — not two one-off layouts — driven entirely by a build's
 * frontmatter (BuildFrontmatter, lib/content-schemas.ts) plus its real MDX body content.
 *
 * Ported from the approved static prototype's two "documented car" pages, read in full:
 * output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/volvo-p1800.html
 * output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/etype-941pvo.html
 * Both share the same real page shape: a full-bleed photographic hero (label / h1 / lede),
 * a numbered "chapter" band pattern (top rule + eyebrow number + h-major heading) repeated
 * for each section, an auction-lot "record" spec table of quick facts, narrative prose/lists/
 * quotes, and (where the source has more than one photo) a photo grid. That chapter/record/
 * prose/gallery shape is what's extracted here as a reusable shell:
 *
 * - Hero: heroImage (if present — never a placeholder box when it isn't), label, h1, a lede
 *   line assembled from real frontmatter facts only (never invented), and a back link to
 *   /library.
 * - "The record" quick-facts panel: a `<dl>`-shaped spec table built from whichever
 *   frontmatter fields this build actually has (all optional per the schema, so this must
 *   render correctly for a sparser future build too, not just today's two fully-detailed
 *   ones).
 * - The build's real MDX body (Phase 3's restoration narrative) — rendered via
 *   `next-mdx-remote/rsc` with the same remark/rehype plugin set already used by
 *   `lib/mdx.tsx` (remark-gfm, rehype-slug, rehype-autolink-headings), but with a page-local
 *   `components` map (below) instead of the shared `@/mdx-components` map, because that
 *   shared map's generic rounded-card styling (bg-surface-subtle boxes, blue/green InfoBox
 *   colours) doesn't match this near-black auction-lot design language — this is a page-local
 *   override, not a change to the shared component, matching how `home-page.tsx` already
 *   defines its own local `Chapter`/`Golink`/`Prose` helpers rather than reusing generic ones.
 *   The MDX `##` headings become numbered chapter bands automatically (matching the
 *   prototype's own numbered-band pattern) via a per-render counter closure.
 * - A photo gallery grid, rendered only when `galleryImages` is actually populated on the
 *   frontmatter (it isn't yet for either of today's two builds — both only have `heroImage` —
 *   so the template is ready for it without fabricating photos that don't exist).
 *
 * Deliberately NOT reproducing the prototype's numbered "No. 0X" scroll-reveal treatment on
 * the hero itself (home-page.tsx's hero teasers already show a "No. 01 · Finished and
 * delivered" chip, which depends on this build's position in the FULL 12-row library ordering
 * — that ordering is /library's route, being built in parallel in this same phase, and
 * duplicating/guessing its order here would risk drifting out of sync with it). This page's
 * hero label reads "Documented build · <marque> <model>" instead — accurate on its own,
 * without depending on the sibling route's data.
 */

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { Build } from '@/lib/content';

const TEXT_SHADOW_SOFT =
  '[text-shadow:0_1px_24px_rgba(11,11,12,0.92),0_1px_4px_rgba(11,11,12,0.7)]';
const TEXT_SHADOW_STRONG =
  '[text-shadow:0_1px_28px_rgba(11,11,12,0.94),0_1px_4px_rgba(11,11,12,0.7)]';

/** Human labels for the enum fields, only used when the field is actually set. */
const BUILD_TYPE_LABEL: Record<NonNullable<Build['buildType']>, string> = {
  'concours-restoration': 'Concours restoration',
  'resto-mod': 'Resto-mod',
  'race-car': 'Race car',
};

const STATUS_LABEL: Record<Build['status'], string> = {
  completed: 'Completed',
  'in-progress': 'In the workshop now',
};

/** One row of the "record" quick-facts panel — omitted entirely when `value` is empty. */
function Fact({ label, value }: { label: string; value?: ReactNode }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-x-6 gap-y-1 border-b border-[rgba(232,228,220,0.14)] py-[0.85rem] last:border-b-0">
      <dt className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-surface-muted-foreground">
        {label}
      </dt>
      <dd className="m-0 font-sans text-[1.0625rem] font-light leading-[1.4] text-surface-foreground [font-variant-numeric:normal]">
        {value}
      </dd>
    </div>
  );
}

/** The numbered top-rule "chapter" band — same visual device as home-page.tsx's `Chapter`. */
function ChapterBand({ no, kind }: { no: string; kind: string }) {
  return (
    <div className="relative border-t border-surface-card-border pt-[clamp(5.5rem,13vh,10rem)] before:absolute before:-top-[2px] before:left-0 before:h-[3px] before:w-[clamp(3.5rem,8vw,6rem)] before:bg-brand-primary-hover before:content-['']">
      <span className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-surface-muted-foreground">
        {no} &nbsp;&middot;&nbsp; {kind}
      </span>
    </div>
  );
}

/**
 * Page-local MDX component map for the build narrative — near-black auction-lot typography,
 * not the shared @/mdx-components' generic rounded-card look. `h2` gets a fresh counter per
 * render (one call of this factory = one page render) so the MDX body's real `##` headings
 * become numbered chapter bands automatically, mirroring the prototype's own per-section
 * numbering without hand-tracking numbers per build.
 */
function createBuildMdxComponents() {
  let chapter = 0;

  return {
    h2: function BuildMdxH2(p: ComponentPropsWithoutRef<'h2'>) {
      chapter += 1;
      const no = String(chapter).padStart(2, '0');
      return (
        <div className="relative mt-[clamp(3.5rem,8vh,6rem)] border-t border-surface-card-border pt-[clamp(3.5rem,8vh,6rem)] first:mt-0 before:absolute before:-top-[2px] before:left-0 before:h-[3px] before:w-[clamp(3.5rem,8vw,6rem)] before:bg-brand-primary-hover before:content-['']">
          <span className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-surface-muted-foreground">
            {no}
          </span>
          <h2 className="mt-[0.85rem] max-w-[20ch] font-heading text-[clamp(1.75rem,3.6vw,3rem)] font-light leading-[1.05] tracking-[-0.03em] text-surface-foreground">
            {p.children}
          </h2>
        </div>
      );
    },
    h3: function BuildMdxH3(p: ComponentPropsWithoutRef<'h3'>) {
      return (
        <h3 className="mt-10 mb-4 max-w-[30ch] font-heading text-[clamp(1.25rem,2.1vw,1.6875rem)] font-light leading-[1.2] text-surface-foreground">
          {p.children}
        </h3>
      );
    },
    p: function BuildMdxP(p: ComponentPropsWithoutRef<'p'>) {
      return (
        <p className="max-w-[42em] font-sans text-[clamp(1.0625rem,0.4vw+0.95rem,1.25rem)] font-light leading-[1.62] text-[#CFCAC1] [font-variant-numeric:normal] my-5 first:mt-6 last:mb-0">
          {p.children}
        </p>
      );
    },
    ul: function BuildMdxUl(p: ComponentPropsWithoutRef<'ul'>) {
      return (
        <ul className="m-0 my-6 list-none border-t border-[rgba(232,228,220,0.14)] p-0">
          {p.children}
        </ul>
      );
    },
    ol: function BuildMdxOl(p: ComponentPropsWithoutRef<'ol'>) {
      return (
        <ol className="m-0 my-6 list-none border-t border-[rgba(232,228,220,0.14)] p-0">
          {p.children}
        </ol>
      );
    },
    li: function BuildMdxLi(p: ComponentPropsWithoutRef<'li'>) {
      return (
        <li className="max-w-[42em] border-b border-[rgba(232,228,220,0.07)] py-[0.9rem] font-sans text-[clamp(1.0625rem,0.4vw+0.95rem,1.25rem)] font-light leading-[1.55] text-[#CFCAC1] [font-variant-numeric:normal]">
          {p.children}
        </li>
      );
    },
    blockquote: function BuildMdxBlockquote(p: ComponentPropsWithoutRef<'blockquote'>) {
      return (
        <blockquote className="my-10 max-w-[38em] border-l-2 border-brand-primary-hover pl-6 font-heading text-[clamp(1.1875rem,1.9vw,1.5625rem)] font-light italic leading-[1.45] text-surface-foreground">
          {p.children}
        </blockquote>
      );
    },
    strong: function BuildMdxStrong(p: ComponentPropsWithoutRef<'strong'>) {
      return <strong className="font-medium text-surface-foreground">{p.children}</strong>;
    },
    em: function BuildMdxEm(p: ComponentPropsWithoutRef<'em'>) {
      return <em className="italic text-surface-foreground">{p.children}</em>;
    },
    hr: function BuildMdxHr() {
      return <hr className="my-10 border-t border-[rgba(232,228,220,0.14)]" />;
    },
    a: function BuildMdxA(p: ComponentPropsWithoutRef<'a'>) {
      const href = typeof p.href === 'string' ? p.href : '';
      const isInternal = href.startsWith('/');
      if (isInternal) {
        return (
          <Link
            href={href}
            className="text-surface-foreground underline decoration-brand-primary-hover underline-offset-4 transition-colors duration-300 hover:text-brand-primary-hover"
          >
            {p.children}
          </Link>
        );
      }
      return (
        <a
          {...p}
          target="_blank"
          rel="noopener noreferrer"
          className="text-surface-foreground underline decoration-brand-primary-hover underline-offset-4 transition-colors duration-300 hover:text-brand-primary-hover"
        />
      );
    },
  };
}

function buildLede(fm: Build): string {
  const parts: string[] = [];
  if (fm.buildDuration) parts.push(fm.buildDuration);
  if (fm.hoursOfLabour) parts.push(`${fm.hoursOfLabour} of labour`);
  if (fm.chassisNumber) parts.push(`Chassis ${fm.chassisNumber}`);
  return parts.join(' · ');
}

export interface BuildDetailPageProps {
  frontmatter: Build;
  /** Raw MDX body (frontmatter already stripped) — rendered here via next-mdx-remote/rsc. */
  mdxSource: string;
}

export function BuildDetailPage({ frontmatter: fm, mdxSource }: BuildDetailPageProps) {
  const lede = buildLede(fm);
  const heroLabel = ['Documented build', [fm.make, fm.model].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="bg-surface-background">
      {/* ============ Hero ============ */}
      <section
        id="top"
        aria-labelledby="build-hero-h"
        className="relative flex min-h-[100lvh] flex-col justify-end overflow-clip"
      >
        {fm.heroImage && (
          <div className="absolute inset-0">
            <Image
              src={fm.heroImage}
              alt={`${fm.title} — photographed by DPM Autobody`}
              fill
              priority
              sizes="100vw"
              className="scale-[1.08] object-cover object-center brightness-[1.1] saturate-[1.1]"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,12,0.5)_0%,rgba(11,11,12,0.2)_38%,rgba(11,11,12,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(11,11,12,0.88)_0%,rgba(11,11,12,0.62)_38%,rgba(11,11,12,0.2)_68%,rgba(11,11,12,0.02)_100%)]" />

        <div className="relative z-[2] mx-auto w-[min(1360px,100%-3rem)] pb-[clamp(9.5rem,20vh,11rem)] pt-[clamp(7rem,18vh,12rem)]">
          <p
            className={`m-0 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-brand-primary-hover ${TEXT_SHADOW_SOFT}`}
          >
            {heroLabel}
          </p>
          <h1
            id="build-hero-h"
            className={`mt-[0.6rem] max-w-[16ch] font-heading text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[0.98] tracking-[-0.034em] text-surface-foreground ${TEXT_SHADOW_STRONG}`}
          >
            {fm.title}
          </h1>
          {lede && (
            <p
              className={`mt-[0.85rem] max-w-[30em] font-sans text-[clamp(1.125rem,1.2vw+0.85rem,1.5rem)] font-light leading-[1.5] text-[#D6D1C8] [font-variant-numeric:normal] ${TEXT_SHADOW_SOFT}`}
            >
              {lede}
            </p>
          )}
          <p className="mt-8">
            <Link
              href="/library"
              className={`text-[0.75rem] font-medium uppercase tracking-[0.16em] text-surface-muted-foreground no-underline transition-colors duration-300 hover:text-brand-primary-hover ${TEXT_SHADOW_SOFT}`}
            >
              &larr;&nbsp; Back to the builds
            </Link>
          </p>
        </div>
      </section>

      {/* ============ 01 · The record — quick-facts spec table ============ */}
      <div className="mx-auto w-[min(1360px,100%-3rem)]">
        <ChapterBand no="01" kind="The record" />
        <div className="grid gap-8 pb-[clamp(3rem,8vh,5rem)] pt-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
          <h2 className="max-w-[18ch] font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] tracking-[-0.034em] text-surface-foreground">
            One car,
            <br />
            documented in full
          </h2>
          <dl className="m-0 border-t border-[rgba(232,228,220,0.14)] p-0">
            <Fact label="Marque" value={fm.make} />
            <Fact label="Model" value={fm.model} />
            {/* `variant` is a deliberately loose free-text distinguisher per the schema
                (sometimes a colour like "Candy Red", sometimes an identifier like "941 PVO")
                — labelling it generically as "Variant" avoids asserting it's a colour when
                it might not be. */}
            <Fact label="Variant" value={fm.variant} />
            <Fact label="Year" value={fm.year} />
            <Fact label="Chassis" value={fm.chassisNumber} />
            <Fact label="Status" value={STATUS_LABEL[fm.status]} />
            <Fact label="Build" value={fm.buildDuration} />
            <Fact label="Labour" value={fm.hoursOfLabour} />
            <Fact label="Type" value={fm.buildType ? BUILD_TYPE_LABEL[fm.buildType] : undefined} />
            <Fact label="Owner" value={fm.ownerName} />
            <Fact label="Commissioned by" value={fm.commissionerName} />
          </dl>
        </div>
      </div>

      {/* ============ The full record — real restoration narrative ============ */}
      <div className="mx-auto w-[min(1360px,100%-3rem)] pb-[clamp(4rem,10vh,6rem)]">
        <MDXRemote
          source={mdxSource}
          components={createBuildMdxComponents()}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
            },
          }}
        />
      </div>

      {/* ============ Photo gallery — only when real gallery photos exist ============ */}
      {fm.galleryImages && fm.galleryImages.length > 0 && (
        <div className="mx-auto w-[min(1360px,100%-3rem)] pb-[clamp(4rem,10vh,6rem)]">
          <ChapterBand no="—" kind="The photographs" />
          <div className="grid gap-5 pt-7 sm:grid-cols-2 lg:grid-cols-3">
            {fm.galleryImages.map((src, i) => (
              <figure key={src} className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={src}
                  alt={`${fm.title} — photograph ${i + 1}`}
                  fill
                  sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
                  className="object-cover"
                />
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
