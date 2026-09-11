/**
 * Workshop Page
 *
 * Server Component with metadata, canonical URL, and structured data — same
 * shape as app/contact/page.tsx.
 *
 * Ported from the approved static prototype's workshop.html (see
 * output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/workshop.html).
 * That file currently has exactly one content chapter ("01 · The workshop" — what DPM does
 * in house vs. out of house); this page is a faithful port of that chapter, not a
 * trimmed-down version of a longer page.
 *
 * Deliberate departures from the prototype, and why:
 * - No "THE FILM" video-band (a YouTube embed of an existing DPM video sitting between the
 *   hero and chapter 01). The build-out brief explicitly scopes this page to "poster/static
 *   imagery, no video" pending a separate video/photography commission, so the hero caption
 *   was also reworded to drop its "below" reference to that now-absent section.
 * - No `.veil--l`/`.veil--r` bands. In the prototype these only move via a `data-sheen`
 *   scroll-rAF script that this hero opts out of (no `data-sheen` attribute on it, same as
 *   here) — at rest they sit fully off-screen (`--bl:-200vw`/`--br:200vw`), so omitting them
 *   changes nothing visible.
 * - No scroll-driven "car re-skinning" (root `--accent`/`--accent-ink` swap via
 *   `data-accent`/`data-ink`). Every `data-accent` element on this page carries the same
 *   "house" pair (#C7BBA1 / #D8CBAE, not a car's paint code), so the mechanism would be a
 *   permanent no-op here; the ported `components/site-header.tsx` also already uses the
 *   static `brand-primary`/`brand-primary-hover` tokens rather than that CSS-variable
 *   mechanism, so this page follows the same, already-established precedent.
 * - No film-grain overlay, scroll "light meter" rail, or in-page-anchor scroll-offset fix —
 *   all three are shared page chrome in the prototype's single stylesheet/script, not
 *   workshop-specific, so they belong in app/layout.tsx if/when they're ported, not here.
 * - Archivo (the prototype's default/display face for nav, labels, and uppercase micro-copy)
 *   has no slot in the theme system yet — see theme.config.ts's own note. Label-style text
 *   below uses the same font stack as everything else on the page pending that decision.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import { siteConfig } from '@/site.config';
import { absUrl } from '@/lib/site';
import { Schema } from '@platform/core-components';

const HERO_IMAGE =
  'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/prototypes/2026-08-26_dpm-autobody-discovery/assets/dpm-workshop-video/hero-still.jpg';

const TEXT_SHADOW = '[text-shadow:0_1px_28px_rgba(11,11,12,0.94),0_1px_4px_rgba(11,11,12,0.7)]';

const IN_HOUSE = [
  'Panel work, fabrication, welding',
  'Lead loading and metal finishing',
  'Primer, block work, guide coats',
  'Colour mixing and spraying',
  'Flatting, cutting and polishing',
  'Photographic record of the build',
];

const OUT_OF_HOUSE = ['Engine building', 'Trim and upholstery'];

export const metadata: Metadata = {
  title: `The Workshop | ${siteConfig.business.name}`,
  description:
    'Bare-metal restoration and concours paint, one building in Berwick, East Sussex — what DPM Autobody does in house, and what goes out.',
  alternates: {
    canonical: absUrl('/workshop'),
  },
};

export default function WorkshopPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section id="top" aria-labelledby="workshop-hero-h" className="relative">
        <div className="sticky top-0 h-[100lvh] overflow-clip isolate">
          <div className="absolute inset-0">
            <Image
              src={HERO_IMAGE}
              alt="Aerial view of DPM Autobody's workshop, a cluster of barns and yard among ripened fields and hedgerows near Berwick, East Sussex, on a clear summer morning."
              fill
              priority
              sizes="100vw"
              className="object-cover object-[58%_45%] scale-[1.08] saturate-[1.1] contrast-[1.05] brightness-[1.03]"
            />
            {/* Horizon shade, so the plate never reads as a flat rectangle. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,12,0.5)_0%,rgba(11,11,12,0)_26%,rgba(11,11,12,0)_72%,rgba(11,11,12,0.6)_100%),radial-gradient(165%_130%_at_62%_46%,rgba(11,11,12,0)_66%,rgba(11,11,12,0.22)_100%)]"
            />
            {/* The wet spike: a static specular highlight over the centre of the frame — with
                no scroll-rAF driving it (this hero has no `data-sheen`), it sits permanently
                at the geometry the prototype defaults to. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-y-[8%] left-1/2 hidden w-[clamp(190px,26%,460px)] -translate-x-1/2 mix-blend-screen sm:block bg-[linear-gradient(100deg,rgba(255,248,235,0)_0%,rgba(255,248,235,0.05)_34%,rgba(255,250,240,0.2)_50%,rgba(255,248,235,0.05)_66%,rgba(255,248,235,0)_100%)]"
            />
          </div>

          {/* Copy wash, so the type carries its own ground rather than the whole plate
              needing to be darkened. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-[-14%] inset-x-[-40%] z-0 bg-[linear-gradient(101deg,rgba(11,11,12,0.92)_20%,rgba(11,11,12,0.62)_34%,rgba(11,11,12,0.22)_50%,rgba(11,11,12,0)_68%)]"
          />

          <div className="absolute inset-0 z-10 grid content-end px-6 pb-[15rem] pt-[clamp(7rem,15vh,11rem)] sm:pb-[clamp(12.5rem,27vh,18rem)]">
            <div className="mx-auto w-full max-w-[1360px]">
              <p
                className={`mb-5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-brand-primary-hover ${TEXT_SHADOW}`}
              >
                The workshop&nbsp;&middot;&nbsp;Berwick, East Sussex
              </p>
              <h1
                id="workshop-hero-h"
                className={`max-w-[14ch] font-heading text-[clamp(2.75rem,min(7.6vw,12vh),6.75rem)] font-light leading-[0.98] tracking-[-0.034em] text-balance text-surface-foreground ${TEXT_SHADOW}`}
              >
                One building. Every stage of the work.
              </h1>
              <p
                className={`mt-6 max-w-[23em] text-[clamp(1.25rem,1.4vw+0.9rem,1.875rem)] font-extralight leading-[1.45] text-[#D6D1C8] ${TEXT_SHADOW}`}
              >
                Panel, paint, and everything between, on the same floor, by the same hands.
              </p>
              <div className="mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-3">
                <p
                  className={`flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-surface-muted-foreground ${TEXT_SHADOW}`}
                >
                  <span
                    aria-hidden
                    className="h-px w-[clamp(28px,5vw,64px)] bg-brand-primary-hover"
                  />
                  Bare metal to finished paint&nbsp;&middot;&nbsp;One workshop
                </p>
              </div>
            </div>
          </div>

          <p className="absolute inset-x-0 bottom-[clamp(4.75rem,8vh,5.25rem)] z-10 mx-auto w-full max-w-[1360px] px-6 text-[0.8125rem] leading-[1.5] text-surface-muted-foreground sm:bottom-[clamp(2rem,4vh,3rem)]">
            The workshop from the air, on a clear summer morning.
          </p>
        </div>

        {/* Real in-flow scroll room after the sticky stage, so the hero holds for one full
            viewport of scrolling before releasing into the next chapter. */}
        <div aria-hidden className="h-[100lvh]" />
      </section>

      {/* ── 01 · The workshop ────────────────────────────────────────────── */}
      <div className="mx-auto w-[min(1360px,100%-3rem)]">
        <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 border-t border-[rgba(232,228,220,0.14)] pt-[clamp(5.5rem,13vh,10rem)]">
          <span
            aria-hidden
            className="absolute -top-0.5 left-0 h-[3px] w-[clamp(3.5rem,8vw,6rem)] bg-brand-secondary"
          />
          <span
            aria-hidden
            className="text-[clamp(1.75rem,3vw,2.5rem)] font-extralight leading-none tracking-[-0.02em] text-brand-secondary"
          >
            01
          </span>
          <span className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-surface-muted-foreground">
            The workshop
          </span>
        </div>

        <div className="grid gap-5 pb-[clamp(2.5rem,6vh,4.5rem)] pt-[clamp(1.75rem,4vh,2.75rem)]">
          <h2 className="font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] tracking-[-0.034em] text-balance text-surface-foreground">
            What we do,
            <br />
            and what goes out
          </h2>
          <p className="max-w-[22.6em] text-[clamp(1.125rem,0.5vw+1rem,1.375rem)] font-light leading-[1.62] text-[#CFCAC1]">
            Bare-metal restoration and concours paint on classic and performance cars, in one
            building in Berwick, East Sussex. Panel work, lead loading, filler, primer, colour,
            flatting and polishing &mdash; all of it by the same hands, on the same floor.
          </p>
        </div>

        <div className="grid gap-8 pb-[clamp(3rem,8vh,5rem)] lg:grid-cols-2 lg:gap-16">
          <div className="space-y-[1.15em]">
            <p className="max-w-[22.6em] text-[clamp(1.125rem,0.5vw+1rem,1.375rem)] font-light leading-[1.62] text-[#CFCAC1]">
              A restoration here starts with the car photographed exactly as it arrived, and ends
              with a plaque riveted into the engine bay carrying its chassis number. Between those
              two things sits a file that the owner keeps: every panel, every gap, every decision,
              photographed as it happened.
            </p>
            <p className="max-w-[22.6em] text-[clamp(1.125rem,0.5vw+1rem,1.375rem)] font-light leading-[1.62] text-[#CFCAC1]">
              Two things leave the building. We would rather list them than let &ldquo;full in-house
              restoration&rdquo; quietly cover them.
            </p>
          </div>

          <ul className="m-0 list-none border-t border-[rgba(232,228,220,0.14)] p-0">
            {IN_HOUSE.map((name) => (
              <li
                key={name}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 border-b border-[rgba(232,228,220,0.07)] py-[0.8rem]"
              >
                <span className="text-[1.0625rem] font-light text-surface-foreground">{name}</span>
                <span className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-surface-muted-foreground">
                  In house
                </span>
              </li>
            ))}
            {OUT_OF_HOUSE.map((name) => (
              <li
                key={name}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 border-b border-[rgba(232,228,220,0.07)] py-[0.8rem]"
              >
                <span className="text-[1.0625rem] font-light text-surface-foreground">{name}</span>
                <span className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-brand-primary-hover">
                  Out of house
                </span>
              </li>
            ))}
          </ul>
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
          { name: 'The Workshop', url: '/workshop' },
        ]}
        webpage={{
          '@type': 'WebPage',
          '@id': absUrl('/workshop#webpage'),
          url: absUrl('/workshop'),
          name: `The Workshop | ${siteConfig.business.name}`,
          description:
            'Bare-metal restoration and concours paint, one building in Berwick, East Sussex — what DPM Autobody does in house, and what goes out.',
        }}
      />
    </>
  );
}
