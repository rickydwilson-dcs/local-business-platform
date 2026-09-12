'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
// Subpath import, not the barrel: this file is 'use client', and a barrel import here would
// pull the whole @platform/core-components module graph (including Zod-dependent server-only
// modules) into the browser bundle — see packages/core-components/CLAUDE.md's "Critical import
// rule" and the npracing-v1 gallery-lightbox incident it documents.
import type { HomePageTemplateProps } from '@platform/core-components/lib/page-template-types';

/**
 * DPM Autobody homepage — "Direction D, the Register".
 *
 * Ported from the approved static prototype's `<main>` content (see
 * output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/index.html —
 * the client-facing build; `src/home.html` is the working copy with reviewer notes stripped
 * out for this file). The masthead/footer chrome is already ported separately
 * (components/site-header.tsx, components/site-footer.tsx) — this component owns only what
 * sits between them: the hero, the four "lots" (finished/in-progress builds shown as
 * evidence), and the testimonials/proof section.
 *
 * Per output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/positioning.md and
 * synthesis.md: this page is the customer's world (finished cars, surface, craft as
 * evidence), not the shop's self-image. The featured cars below are the same static
 * examples the approved prototype uses — a data-driven "rotating featured build" pull from
 * the builds collection is explicitly out of scope here (build-out session.md Phase 4).
 *
 * THE DEVICE (ported from the prototype's inline <script>, CSS ~L300-420 & L1680-1877):
 * each "lot" is a sticky full-bleed photograph with two ground-coloured veils that slide
 * apart as you scroll, and — where the source has more than one image for that car — a
 * second/third image cross-fading in as the "whole car" arrives. Scroll position alone
 * drives it (no hover, no click); it's re-implemented here with the same rAF-batched
 * IntersectionObserver + scroll-listener approach as the source, writing CSS custom
 * properties onto each `[data-stage]` element that the layered images/veils read via
 * `var(--x, fallback)`. Respects `prefers-reduced-motion` exactly as the source does: the
 * effect is skipped entirely and every layer renders in its unrevealed (but fully legible —
 * the veils' fallback position is off-canvas, not opaque-black) resting state.
 *
 * Deliberately NOT ported in this pass (none of these are "hero / featured-build /
 * testimonials / proof" content — they're page-chrome polish, and site-header.tsx/
 * site-footer.tsx are out of scope for this task):
 *   - the fixed grain/noise overlay across the whole page
 *   - the `.rail` scroll-position light-meter down the right edge
 *   - the scroll-driven re-skin that hands the masthead's accent colour to whichever car's
 *     band owns the middle of the screen
 * Revisit these as a follow-up visual-polish pass if wanted — the CSS custom properties
 * these sections already write (`--bl`/`--br`/`--bc` etc.) are exactly what that re-skin
 * would key off.
 */

type Vars = CSSProperties & Record<`--${string}`, string>;

const IMG_POSITION =
  '[object-position:var(--pp,50%_50%)] [transform:scale(var(--pz,1))] [transform-origin:var(--po,50%_50%)]';
const PLATE_FILTER =
  '[filter:saturate(var(--psat,1.1))_contrast(var(--pcon,1.06))_brightness(var(--pbri,1.16))]';
const RESOLVE_FILTER =
  '[filter:saturate(var(--rsat,1.04))_contrast(var(--rcon,1.02))_brightness(var(--rbri,1.04))]';

interface LotImage {
  src: string;
  alt: string;
  vars: Vars;
  priority?: boolean;
}

function LayerImage({ image, filter }: { image: LotImage; filter: 'plate' | 'resolve' }) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      priority={image.priority}
      sizes="100vw"
      style={image.vars}
      className={`object-cover ${IMG_POSITION} ${filter === 'plate' ? PLATE_FILTER : RESOLVE_FILTER}`}
    />
  );
}

/** Two ground-coloured veils that slide apart on transform only — see the class doc above. */
function Veils() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[14%] -bottom-[14%] left-0 z-[2] w-[300%] opacity-[calc(1-var(--reveal,0))] [backface-visibility:hidden] [will-change:transform] [transform:translate3d(var(--tl,-200vw),0,0)_skewX(-9deg)] [background:linear-gradient(to_left,rgba(11,11,12,0)_0,rgba(11,11,12,0.74)_clamp(180px,30%,460px))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[14%] -bottom-[14%] left-0 z-[2] w-[300%] opacity-[calc(1-var(--reveal,0))] [backface-visibility:hidden] [will-change:transform] [transform:translate3d(var(--tr,200vw),0,0)_skewX(-9deg)] [background:linear-gradient(to_right,rgba(11,11,12,0)_0,rgba(11,11,12,0.74)_clamp(180px,30%,460px))]"
      />
    </>
  );
}

/** The additive "wet" highlight spike riding the centre of the travelling light band. */
function Spec() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-[8%] -bottom-[8%] left-0 z-[4] w-[clamp(190px,26%,460px)] opacity-[calc(1-var(--reveal,0))] [mix-blend-mode:screen] [will-change:transform] [transform:translate3d(var(--bc,50%),0,0)_translateX(-50%)] [background:linear-gradient(100deg,rgba(255,248,235,0)_0%,rgba(255,248,235,0.05)_34%,rgba(255,250,240,0.20)_50%,rgba(255,248,235,0.05)_66%,rgba(255,248,235,0)_100%)]"
    />
  );
}

interface StageCaptionLines {
  macro: ReactNode;
  mid?: ReactNode;
  wide?: ReactNode;
}

/** Captions crossfade with the picture, so the words on screen always describe the photo. */
function StageCaption({ lines }: { lines: StageCaptionLines }) {
  return (
    <figcaption className="pointer-events-none absolute inset-x-0 bottom-[clamp(4.75rem,8vh,5.25rem)] z-[11] mx-auto grid w-[min(1360px,100%-3rem)] text-[0.8125rem] leading-[1.5] text-surface-muted-foreground md:bottom-[clamp(2rem,4vh,3rem)]">
      <span className="pointer-events-auto flex max-w-[44em] flex-wrap items-baseline gap-x-3.5 gap-y-2 self-end transition-opacity duration-200 [grid-area:1/1] opacity-[calc(1-var(--reveal,0)*1.9)]">
        {lines.macro}
      </span>
      {lines.mid && (
        <span className="pointer-events-auto flex max-w-[44em] flex-wrap items-baseline gap-x-3.5 gap-y-2 self-end transition-opacity duration-200 [grid-area:1/1] opacity-[min(calc(var(--reveal,0)*1.9-0.9),calc(1-var(--reveal2,0)*1.9))]">
          {lines.mid}
        </span>
      )}
      {lines.wide && (
        <span className="pointer-events-auto flex max-w-[44em] flex-wrap items-baseline gap-x-3.5 gap-y-2 self-end transition-opacity duration-200 [grid-area:1/1] opacity-[calc(var(--reveal2,var(--reveal,0))*1.9-0.9)]">
          {lines.wide}
        </span>
      )}
    </figcaption>
  );
}

interface TrackProps {
  ariaLabel: string;
  headingId: string;
  dir?: 'ltr' | 'rtl';
  rev: [number, number];
  rev2?: [number, number];
  no: string;
  label: string;
  heading: ReactNode;
  macro: LotImage;
  resolve: LotImage;
  resolve2?: LotImage;
  captions: StageCaptionLines;
}

/** One "lot": a sticky photograph that resolves from a macro detail to the whole car. */
function Track({
  ariaLabel,
  headingId,
  dir = 'ltr',
  rev,
  rev2,
  no,
  label,
  heading,
  macro,
  resolve,
  resolve2,
  captions,
}: TrackProps) {
  return (
    <section
      className="relative"
      data-track
      data-dir={dir}
      data-rev={rev.join(',')}
      data-rev2={rev2?.join(',')}
      aria-labelledby={headingId}
    >
      <figure
        data-stage
        className="sticky top-0 h-[100lvh] isolate overflow-clip"
        style={{ '--bl': '-200vw', '--br': '200vw', '--bc': '50%' } as Vars}
      >
        <div className="absolute inset-0 overflow-clip after:pointer-events-none after:absolute after:inset-0 after:z-[3] after:content-[''] after:[background:linear-gradient(to_bottom,rgba(11,11,12,0.5)_0%,rgba(11,11,12,0)_26%,rgba(11,11,12,0)_65%,rgba(11,11,12,0.88)_100%),radial-gradient(165%_130%_at_50%_46%,rgba(11,11,12,0)_66%,rgba(11,11,12,0.26)_100%)]">
          <LayerImage image={macro} filter="plate" />
          <Veils />
          <Spec />
        </div>

        <div
          data-resolve
          className="absolute inset-0 z-[5] opacity-[var(--reveal,0)] [will-change:opacity,transform] [transform:scale(calc(1.05-0.05*var(--reveal,0)+0.14*var(--reveal2,0)))] after:pointer-events-none after:absolute after:inset-0 after:content-[''] after:[background:linear-gradient(to_bottom,rgba(11,11,12,0.44)_0%,rgba(11,11,12,0.02)_28%,rgba(11,11,12,0.14)_56%,rgba(11,11,12,0.88)_100%)]"
        >
          <LayerImage image={resolve} filter="resolve" />
        </div>

        {resolve2 && (
          <div
            data-resolve2
            className="absolute inset-0 z-[6] opacity-[var(--reveal2,0)] [will-change:opacity,transform] [transform:scale(calc(1.06-0.06*var(--reveal2,0)))] after:pointer-events-none after:absolute after:inset-0 after:content-[''] after:[background:linear-gradient(to_bottom,rgba(11,11,12,0.44)_0%,rgba(11,11,12,0.02)_28%,rgba(11,11,12,0.14)_56%,rgba(11,11,12,0.88)_100%)]"
          >
            <LayerImage image={resolve2} filter="resolve" />
          </div>
        )}

        {/*
          Bottom scrim behind the "no · label" pill and heading, sized in
          `rem` from this box's own bottom edge — not `%` of the sticky
          figure's full 100lvh height — for the same reason documented on the
          Bentley "whole" figure's scrim further down this file: this
          container is anchored to the bottom by a `pb-` in rem/vh-clamped
          units, so its actual on-screen distance from the bottom stays
          near-constant across viewport heights while a percentage stop does
          not track it. Added after a Sept 2026 review found the P1800
          panel's heading ("A year in the building. Thirteen hundred hours in
          the hands.") landing on a bright chrome specular highlight in that
          macro photo and measuring ~1.25:1 against WCAG AA's 4.5:1 — the
          only protection here previously was a 28px-blur text-shadow on the
          `<h3>`, which glows text edges but does not darken a large bright
          area sitting behind a whole heading line.

          This div is shared by all four `Track` calls (P1800, Bentley,
          Jaguar/Aston Sea Green, E-type), so the fix is deliberately generic
          — flat 0.92 alpha directly behind the text, fading out above so it
          blends into the image rather than showing a hard edge — rather than
          tuned to one panel's photo and left to fail against the next
          differently-lit one. (The earlier Bentley fix below was scoped to
          one one-off `<figure>`, not this shared component, which is why it
          didn't also cover this case.)
        */}
        <div className="pointer-events-none absolute inset-0 z-10 mx-auto grid w-[min(1360px,100%-3rem)] content-end pb-[clamp(9.5rem,20vh,11rem)] before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:z-[-1] before:h-[clamp(18rem,38vh,24rem)] before:content-[''] before:[background:linear-gradient(to_top,rgba(11,11,12,0.92)_0,rgba(11,11,12,0.92)_11rem,rgba(11,11,12,0)_100%)] md:pb-[clamp(9rem,18vh,10.5rem)]">
          <span className="pointer-events-auto mb-5 inline-flex w-fit flex-wrap items-center gap-3 border border-surface-card-border bg-[rgba(11,11,12,0.86)] px-3 py-[0.45rem]">
            <span className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-brand-primary-hover">
              {no}
            </span>
            <span className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-surface-muted-foreground">
              {label}
            </span>
          </span>
          <h3
            id={headingId}
            className="max-w-[16ch] font-heading text-[clamp(1.75rem,3.4vw,3.125rem)] font-light leading-[1.05] text-surface-foreground [text-shadow:0_1px_28px_rgba(11,11,12,0.94)]"
          >
            {heading}
          </h3>
        </div>

        <StageCaption lines={captions} />
        <span className="sr-only">{ariaLabel}</span>
      </figure>

      <div className={`h-[100lvh] ${resolve2 ? 'md:h-[150lvh]' : ''}`} aria-hidden="true" />
    </section>
  );
}

function Golink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-11 items-center gap-3 border-b border-brand-primary-hover pb-[0.55rem] pt-[0.55rem] text-xs font-medium uppercase tracking-[0.2em] text-surface-foreground no-underline transition-colors duration-300 hover:text-brand-primary-hover"
    >
      {children}
      <span
        aria-hidden="true"
        className="h-2 w-2 flex-none border-r border-t border-brand-primary-hover transition-[margin] duration-300 [transform:rotate(45deg)] group-hover:ml-1.5"
      />
    </Link>
  );
}

function Chapter({ kind }: { kind: string }) {
  return (
    <div className="relative border-t border-surface-card-border pt-[clamp(5.5rem,13vh,10rem)] before:absolute before:-top-[2px] before:left-0 before:h-[3px] before:w-[clamp(3.5rem,8vw,6rem)] before:bg-brand-primary-hover before:content-['']">
      <span className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-surface-muted-foreground">
        {kind}
      </span>
    </div>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[22.6em] font-prose text-[clamp(1.125rem,0.5vw+1rem,1.375rem)] font-light leading-[1.62] text-surface-muted-foreground [font-variant-numeric:normal] last:mb-0">
      {children}
    </p>
  );
}

const R2 =
  'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/prototypes/2026-08-26_dpm-autobody-discovery/assets';

export function HomePage({ schemaNodes }: HomePageTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
    const smooth = (x: number) => x * x * (3 - 2 * x);

    interface Panel {
      track: HTMLElement;
      stage: HTMLElement | null;
      resolve: HTMLElement | null;
      resolve2: HTMLElement | null;
      rtl: boolean;
      rev: [number, number];
      rev2: [number, number] | null;
      live: boolean;
    }

    const trackEls = Array.from(root.querySelectorAll<HTMLElement>('[data-track]'));
    const panels: Panel[] = trackEls.map((track) => {
      const rev = (track.dataset.rev || '0.58,0.86').split(',').map(Number) as [number, number];
      const rev2Raw = track.dataset.rev2;
      const rev2Parsed = rev2Raw ? (rev2Raw.split(',').map(Number) as [number, number]) : null;
      return {
        track,
        stage: track.querySelector<HTMLElement>('[data-stage]'),
        resolve: track.querySelector<HTMLElement>('[data-resolve]'),
        resolve2: track.querySelector<HTMLElement>('[data-resolve2]'),
        rtl: track.dataset.dir === 'rtl',
        rev,
        rev2: rev2Parsed && !Number.isNaN(rev2Parsed[0]) ? rev2Parsed : null,
        live: false,
      };
    });

    let ticking = false;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const p = panels.find((x) => x.track === entry.target);
          if (p) p.live = entry.isIntersecting;
        });
        schedule();
      },
      { rootMargin: '25% 0px 25% 0px' }
    );
    panels.forEach((p) => io.observe(p.track));

    function frame() {
      ticking = false;
      const vh = window.innerHeight;

      for (const p of panels) {
        const { stage } = p;
        if (!p.live || !stage) continue;

        const r = p.track.getBoundingClientRect();
        const stickH = stage.offsetHeight || vh;
        const span = r.height - stickH;
        const t =
          span > 0 ? clamp(-r.top / span, 0, 1) : clamp((vh - r.top) / (vh + r.height), 0, 1);

        const eased = 1 - Math.pow(1 - t, 1.6);
        const w = stage.offsetWidth;
        const centre = (p.rtl ? 1.35 - 1.45 * eased : -0.1 + 1.45 * eased) * w;
        const half = w * (w < 760 ? 0.42 : 0.34);

        stage.style.setProperty('--bl', `${(centre - half).toFixed(1)}px`);
        stage.style.setProperty('--br', `${(centre + half).toFixed(1)}px`);
        stage.style.setProperty('--tl', `${(centre - half - 3 * w).toFixed(1)}px`);
        stage.style.setProperty('--tr', `${(centre + half).toFixed(1)}px`);
        stage.style.setProperty('--bc', `${centre.toFixed(1)}px`);

        if (p.resolve) {
          stage.style.setProperty(
            '--reveal',
            smooth(clamp((t - p.rev[0]) / (p.rev[1] - p.rev[0]), 0, 1)).toFixed(3)
          );
        }
        if (p.resolve2 && p.rev2) {
          stage.style.setProperty(
            '--reveal2',
            smooth(clamp((t - p.rev2[0]) / (p.rev2[1] - p.rev2[0]), 0, 1)).toFixed(3)
          );
        }
      }
    }

    function schedule() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('orientationchange', schedule, { passive: true });
    if (document.fonts?.ready) {
      document.fonts.ready.then(schedule);
    }
    schedule();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-surface-background [font-variant-numeric:normal]">
      {schemaNodes}

      {/* ═══════════════════ HERO — Volvo P1800, Candy Red ═══════════════════ */}
      <section
        className="relative"
        data-track
        data-dir="ltr"
        data-rev="1,1"
        aria-labelledby="hero-h"
      >
        <figure
          data-stage
          className="sticky top-0 h-[100lvh] isolate overflow-clip"
          style={{ '--bl': '-200vw', '--br': '200vw', '--bc': '50%' } as Vars}
        >
          <div className="absolute inset-0 overflow-clip after:pointer-events-none after:absolute after:inset-0 after:z-[3] after:content-[''] after:[background:linear-gradient(to_bottom,rgba(11,11,12,0.5)_0%,rgba(11,11,12,0)_26%,rgba(11,11,12,0)_72%,rgba(11,11,12,0.6)_100%),radial-gradient(165%_130%_at_50%_46%,rgba(11,11,12,0)_66%,rgba(11,11,12,0.26)_100%)]">
            <LayerImage
              image={{
                src: `${R2}/dpm-instagram/DU2rgo5DXqC/web/slide-01.jpg`,
                alt: 'The finished Candy Red Volvo P1800 on a lane in winter daylight, front three-quarter, on chrome wire wheels.',
                priority: true,
                vars: {
                  '--pz': '1.22',
                  '--po': '60% 40%',
                  '--pp': '58% 38%',
                  '--pbri': '1.05',
                  '--psat': '1.18',
                  '--pcon': '1.12',
                } as Vars,
              }}
              filter="plate"
            />
            <Veils />
            <Spec />
          </div>

          {/*
            align-content MUST be `safe end`, not plain `end` (Tailwind's `content-end`
            utility only emits the latter — this is an arbitrary-value override).
            The prototype's `.hero__inner` rule (prototype/src/home.html ~L508-521) uses
            `align-content: safe end` specifically because plain `end` does not fall back
            when this stack (eyebrow + h1 + lede + link row) is taller than the 100lvh
            box — on a wide-but-short viewport (a laptop with the browser not maximised,
            or any height below ~900px where the `clamp()` heading size is still large)
            the overflow spills off the TOP instead of the bottom, and the ancestor
            figure's `overflow-clip` silently eats whatever crosses y=0 with no visible
            edge. That's the exact mechanism behind a "headline truncated / lede entirely
            missing on desktop" bug: confirmed by forcing overflow in a live DOM test
            (shrinking the stage) — `align-content:end` pushed the eyebrow and most of the
            h1 to negative `top` (clipped), while `safe end` falls back to start and keeps
            everything in positive, visible space. See the prototype's own comment at that
            line for the "1113x744" case this was originally fixed for.
          */}
          <div className="pointer-events-none absolute inset-0 z-10 mx-auto grid w-[min(1360px,100%-3rem)] [align-content:safe_end] pb-60 pt-28 before:pointer-events-none before:absolute before:-inset-x-[35vw] before:-inset-y-[14vh] before:z-[-1] before:content-[''] before:[background:linear-gradient(101deg,rgba(11,11,12,0.92)_20%,rgba(11,11,12,0.62)_34%,rgba(11,11,12,0.22)_50%,rgba(11,11,12,0)_68%)] md:pb-[clamp(12.5rem,27vh,18rem)]">
            <p className="pointer-events-auto m-0 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-brand-primary-hover [text-shadow:0_1px_28px_rgba(11,11,12,0.94)]">
              Concours restoration &nbsp;&middot;&nbsp; Berwick, East Sussex
            </p>
            <h1
              id="hero-h"
              className="pointer-events-auto m-0 mb-6 mt-[0.6rem] max-w-[14ch] font-heading text-[clamp(2.75rem,min(7.6vw,12vh),6.75rem)] font-light leading-[0.98] text-surface-foreground [text-shadow:0_1px_28px_rgba(11,11,12,0.94)]"
            >
              Artists of Automotive Restoration
            </h1>
            <p className="pointer-events-auto m-0 max-w-[23em] font-prose text-[clamp(1.25rem,1.4vw+0.9rem,1.875rem)] font-extralight leading-[1.45] text-surface-foreground/90 [font-variant-numeric:normal] [text-shadow:0_1px_28px_rgba(11,11,12,0.94)]">
              Not a slogan. It is engraved on the plaque we fix to every car before it leaves.
            </p>
            <div className="pointer-events-auto mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-3">
              <p className="m-0 flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-surface-muted-foreground [text-shadow:0_1px_28px_rgba(11,11,12,0.94)]">
                <span
                  aria-hidden="true"
                  className="h-px w-10 flex-none bg-gradient-to-r from-brand-primary-hover to-transparent"
                />
                Bare metal to finished paint &nbsp;&middot;&nbsp; One workshop
              </p>
            </div>
          </div>

          <StageCaption
            lines={{
              macro: (
                <span>
                  <b className="font-medium text-surface-foreground">Volvo P1800, Candy Red.</b>{' '}
                  Front three-quarter, on chrome wire wheels, the morning it went on the
                  transporter.
                </span>
              ),
            }}
          />
        </figure>
        <div className="h-[100lvh]" aria-hidden="true" />
      </section>

      {/* ═══════════════════ 01 · VOLVO P1800 ═══════════════════ */}
      <div id="work" className="mx-auto w-[min(1360px,100%-3rem)]">
        <Chapter kind="No. 01 · Finished and delivered" />
        <div className="grid gap-5 pb-[clamp(2.5rem,6vh,4.5rem)] pt-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <h2 className="max-w-[16ch] font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] text-surface-foreground">
            Volvo&nbsp;P1800
            <br />
            Candy&nbsp;Red
          </h2>
          <div className="grid gap-[1.15em]">
            <Prose>
              A year in the workshop and{' '}
              <strong className="font-medium text-surface-foreground">1,300</strong> hours of
              labour, to five changes the owner specified himself. It left on a transporter with a
              plaque fixed to the chassis, carrying its number:{' '}
              <span className="text-surface-foreground">26282</span> and a file of over{' '}
              <strong className="font-medium text-surface-foreground">2,000</strong> photographs.
            </Prose>
            <Prose>
              It is the most completely documented car we have finished. All of it &mdash; the
              owner&rsquo;s specification, the log, the underside, the paint &mdash; is on a page of
              its own.
            </Prose>
            <p className="mt-7">
              <Golink href="/builds/p1800-candy">The full record of the P1800</Golink>
            </p>
          </div>
        </div>
      </div>

      <Track
        ariaLabel="Volvo P1800, chassis 26282 — a year in the building, thirteen hundred hours in the hands"
        headingId="lot1-h"
        dir="ltr"
        rev={[0.38, 0.58]}
        rev2={[0.74, 0.88]}
        no="No. 01"
        label="Volvo P1800 · Chassis 26282"
        heading="A year in the building. Thirteen hundred hours in the hands."
        macro={{
          src: `${R2}/dpm-instagram/DU2rgo5DXqC/web/slide-05.jpg`,
          alt: "Macro on the P1800's chrome wing mirror and A-pillar, with bare trees mirrored down the Candy Red panel behind it.",
          vars: {
            '--pz': '1.5',
            '--po': '48% 50%',
            '--pbri': '1.32',
            '--psat': '1.16',
            '--pcon': '1.04',
          } as Vars,
        }}
        resolve={{
          src: `${R2}/dpm-instagram/DU2rgo5DXqC/web/slide-04.jpg`,
          alt: 'Close on the rear wing of the Candy Red Volvo P1800: bare winter trees mirrored unbroken along the panel above a chrome waistline strip.',
          vars: {
            '--pz': '1.5',
            '--po': '42% 56%',
            '--rbri': '1.1',
            '--rsat': '1.15',
            '--rcon': '1.14',
          } as Vars,
        }}
        resolve2={{
          src: `${R2}/dpm-instagram/DU2rgo5DXqC/web/slide-01.jpg`,
          alt: 'The finished Candy Red Volvo P1800 on a lane in winter daylight, front three-quarter, on chrome wire wheels.',
          vars: {
            '--pz': '1.09',
            '--po': '54% 45%',
            '--pp': '35% 50%',
            '--rbri': '1.06',
            '--rsat': '1.16',
            '--rcon': '1.1',
          } as Vars,
        }}
        captions={{
          macro: (
            <span>
              <b className="font-medium text-surface-foreground">Above &mdash; the P1800, close.</b>{' '}
              Chrome wing mirror and A-pillar, the flank behind them carrying the reflection of a
              hedge line.
            </span>
          ),
          mid: (
            <span>
              <b className="font-medium text-surface-foreground">
                Above &mdash; the rear wing, close.
              </b>{' '}
              Bare winter trees mirrored unbroken along the panel, above the chrome waistline strip.
            </span>
          ),
          wide: (
            <span>
              <b className="font-medium text-surface-foreground">
                Above &mdash; the same P1800, whole.
              </b>{' '}
              On a lane in flat winter daylight, the morning it went on the transporter.
            </span>
          ),
        }}
      />

      {/* ═══════════════════ 02 · BENTLEY S3 CONTINENTAL ═══════════════════ */}
      <div className="mx-auto w-[min(1360px,100%-3rem)]">
        <Chapter kind="No. 02 · Finished and delivered" />
        {/*
          The `after:` veil carries TWO scrims, not one. The bottom half
          (`0 → 0.34` from 55%) is the prototype's own `.section-hero::after`
          vignette, ported verbatim. The top half (`0.92 → 0` over the first
          8rem) is NOT in the prototype and is deliberate: the figcaption below
          is an in-flow child of this fixed-aspect-ratio box, so it lands at the
          very TOP of the photograph, and in this particular shot that is
          sunlit foliage and a white van — measured backdrop luminance p99 0.47
          at 1440px and 0.99 at 1024px, i.e. 1.2–2.5:1 against the caption's
          #A8A399, far under WCAG AA's 4.5:1.

          The prototype never had to solve this because its caption is invisible
          there: `.caption` is `position: static` while `.section-hero img` is
          `position: absolute`, so the photograph paints OVER the caption and
          hides it completely (confirmed with elementsFromPoint against
          prototype/client/index.html — the img sits above the figcaption in the
          paint order). The `relative z-[1]` on the figcaption below is what
          lifts it back into view; that is the right call — the copy is approved
          and should be readable — but it is also what put the text onto the
          photo, so it needs a scrim the prototype never needed.

          Stops are in `rem`, not `%`, on purpose: the caption is a fixed 2.52rem
          (two lines) from 480px up and 3.78rem (three lines) at ≤390px, while
          the figure's height is aspect-ratio-driven and swings from 765px to
          176px. Percentage stops would track the box and not the text; rem stops
          track the text. 4rem clears the three-line case at every width, and
          0.86 alpha there measures 5.3:1 worst-case against the muted caption
          colour and ~10:1 against the bone `<b>` — see the measurement note in
          the session folder. Where the fade would outrun the bottom vignette on
          a short (mobile) box, CSS clamps the later stop up; that degrades to a
          single continuous wash rather than a visible seam.
        */}
        <figure className="relative my-7 aspect-video overflow-clip after:pointer-events-none after:absolute after:inset-0 after:content-[''] after:[background:linear-gradient(to_bottom,rgba(11,11,12,0.92)_0,rgba(11,11,12,0.86)_4rem,rgba(11,11,12,0.42)_5.75rem,rgba(11,11,12,0)_8rem,rgba(11,11,12,0)_55%,rgba(11,11,12,0.34)_100%)]">
          <Image
            src={`${R2}/dpm-work/bentley-s3/whole.jpg`}
            alt="The finished Bentley S3 Continental outside in summer daylight, front three-quarter, against a post-and-rail fence."
            fill
            sizes="100vw"
            className={`object-cover ${IMG_POSITION} ${PLATE_FILTER}`}
          />
          <figcaption className="relative z-[1] mt-[-0.25rem] max-w-[44em] text-[0.8125rem] leading-[1.55] text-surface-muted-foreground">
            <b className="font-medium text-surface-foreground">
              The Bentley S3 Continental, whole.
            </b>{' '}
            Out on the yard in summer daylight, before the panels that follow show what it took to
            get there.
          </figcaption>
        </figure>
        <div className="grid gap-5 pb-[clamp(2.5rem,6vh,4.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <h2 className="max-w-[16ch] font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] text-surface-foreground">
            Bentley S3
            <br />
            Continental
          </h2>
          <div className="grid gap-[1.15em]">
            <Prose>
              A Continental gives you the longest unbroken panels we ever paint, and near-black
              gives you nowhere to put a mistake. There is a chrome waistrail that runs the whole
              length of the car, and either it is straight along every inch of the door and the wing
              or it is not.
            </Prose>
            <Prose>
              Look at the shut line as the light crosses it. The gap is even top to bottom, and the
              reflection carries across it without stepping. All of that is settled in bare metal,
              long before there is any colour to look at.
            </Prose>
            <Prose>A second S3 is on the jig now.</Prose>
          </div>
        </div>
      </div>

      <Track
        ariaLabel="Bentley S3 Continental, 1963 — twelve feet of panel, and nowhere to hide"
        headingId="lot2-h"
        dir="rtl"
        rev={[0.38, 0.58]}
        rev2={[0.74, 0.88]}
        no="No. 02"
        label="Bentley S3 Continental · 1963"
        heading="Twelve feet of panel, and nowhere to hide."
        macro={{
          src: `${R2}/dpm-work/bentley-s3/shutline.jpg`,
          alt: "The shut line between the Bentley's door and rear wing in near-black paint, with a chrome waistrail running straight through it and the sky reflected below.",
          vars: {
            '--pz': '1.42',
            '--po': '52% 60%',
            '--pbri': '1.5',
            '--psat': '1.06',
            '--pcon': '1.02',
          } as Vars,
        }}
        resolve={{
          src: `${R2}/dpm-work/bentley-s3/front.jpg`,
          alt: "The Bentley's chrome radiator shell, winged-B mascot and twin headlamps, with the near-black front wing curving away behind them.",
          vars: { '--pz': '1.04', '--po': '46% 52%' } as Vars,
        }}
        resolve2={{
          src: `${R2}/dpm-work/bentley-s3/whole.jpg`,
          alt: 'The finished Bentley S3 Continental outside in summer daylight, front three-quarter, against a post-and-rail fence.',
          vars: {
            '--pz': '1.1',
            '--po': '60% 45%',
            '--pp': '58% 50%',
            '--rbri': '1.02',
            '--rsat': '1.06',
            '--rcon': '1.08',
          } as Vars,
        }}
        captions={{
          macro: (
            <span>
              <b className="font-medium text-surface-foreground">
                Above &mdash; the shut line, close.
              </b>{' '}
              Door to rear wing, with the chrome waistrail carrying through it. Follow the rail
              across the gap: it does not step, and the reflection under it does not kink.
            </span>
          ),
          mid: (
            <span>
              <b className="font-medium text-surface-foreground">
                Above &mdash; the radiator, the mascot and the wing.
              </b>{' '}
              Chrome is unforgiving in a way paint is not: it magnifies whatever is under it instead
              of filling it.
            </span>
          ),
          wide: (
            <span>
              <b className="font-medium text-surface-foreground">
                Above &mdash; and then the car, whole.
              </b>{' '}
              Photographed on the yard in summer daylight, the day it was signed off.
            </span>
          ),
        }}
      />

      {/* ═══════════════════ 03 · ASTON MARTIN DB6, THE PINK ONE ═══════════════════ */}
      <div className="mx-auto w-[min(1360px,100%-3rem)]">
        <Chapter kind="No. 03 · Finished and delivered" />
        <div className="grid gap-5 pb-[clamp(2.5rem,6vh,4.5rem)] pt-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <h2 className="max-w-[16ch] font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] text-surface-foreground">
            Aston Martin DB6
            <br />
            The pink&nbsp;one
          </h2>
          <div className="grid gap-[1.15em]">
            <Prose>
              Crashed at La Carrera Panamericana in 2022. We repaired the body, including a new door
              fabricated in house, then finished the car in pink at the owner&rsquo;s request — to
              stand out at the next race.
            </Prose>
            <Prose>
              It went on to make the front page of a car magazine, and a radio interview besides.
            </Prose>
            <p className="mt-7">
              <Golink href="/builds/aston-martin-db6-pink">The full record of the DB6</Golink>
            </p>
          </div>
        </div>
      </div>

      <Track
        ariaLabel="Aston Martin DB6, the pink one — crashed, repaired, and finished to stand out"
        headingId="lot3-h"
        dir="ltr"
        rev={[0.5, 0.84]}
        no="No. 03"
        label="Aston Martin DB6 · The pink one"
        heading="Repaired to race again. Finished to be seen."
        macro={{
          src: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dpm-autobody/builds/aston-martin-db6-pink/IMG_8651.jpg',
          alt: 'A DPM painter working bare metal on the Aston Martin DB6 body, close on the hands and the panel.',
          vars: {
            '--pz': '1.22',
            '--po': '44% 52%',
            '--pbri': '1.1',
            '--psat': '1.02',
            '--pcon': '1.04',
          } as Vars,
        }}
        resolve={{
          src: 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/dpm-autobody/builds/aston-martin-db6-pink/IMG_8830.jpg',
          alt: 'The finished Aston Martin DB6 in pink, front three-quarter, outside the workshop.',
          vars: { '--pz': '1.06', '--po': '48% 54%' } as Vars,
        }}
        captions={{
          macro: (
            <span>
              <b className="font-medium text-surface-foreground">
                Above &mdash; bare metal, close.
              </b>{' '}
              The repair itself, including a new door fabricated in house to replace the one lost in
              the crash.
            </span>
          ),
          wide: (
            <span>
              <b className="font-medium text-surface-foreground">
                Above &mdash; the same car, finished.
              </b>{' '}
              In pink, at the owner&rsquo;s own request — so it would stand out at the next race.
            </span>
          ),
        }}
      />

      {/* ═══════════════════ 04 · JAGUAR E-TYPE, 941 PVO ═══════════════════ */}
      <div className="mx-auto w-[min(1360px,100%-3rem)]">
        <Chapter kind="No. 04 · A customer's own car" />
        <div className="grid gap-5 pb-[clamp(2.5rem,6vh,4.5rem)] pt-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <h2 className="max-w-[16ch] font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] text-surface-foreground">
            Jaguar E-Type
            <br />
            941&nbsp;PVO
          </h2>
          <div className="grid gap-[1.15em]">
            <Prose>
              Not one of ours. The owner did the mechanicals and metalwork himself and sent us the
              bodyshell for panel finishing and paint &mdash; then wrote nine pages about it for the
              E-Type Owners Club Magazine.
            </Prose>
            <Prose>
              He came to us because of a different car first: his own concours-winning Aston Martin
              V8, which we painted the year before.
            </Prose>
            <p className="mt-7">
              <Golink href="/builds/etype-941pvo">The full record of the E-type</Golink>
            </p>
          </div>
        </div>
      </div>

      <Track
        ariaLabel="Jaguar E-Type, 941 PVO — he trusted us with the Aston, then the E-type"
        headingId="lot4-teaser-h"
        dir="rtl"
        rev={[0.5, 0.84]}
        no="No. 04"
        label="Jaguar E-Type · 941 PVO"
        heading="He trusted us with the Aston. Then the E-type."
        macro={{
          src: `${R2}/etype-941pvo/gallery/headlight.jpg`,
          alt: "Macro on the E-type's front bumper and headlight, chrome against Opalescent Silver Blue.",
          vars: {
            '--pz': '1.3',
            '--po': '46% 50%',
            '--pbri': '1.28',
            '--psat': '1.1',
            '--pcon': '1.04',
          } as Vars,
        }}
        resolve={{
          src: `${R2}/etype-941pvo/gallery/side-profile.jpg`,
          alt: 'The finished Jaguar E-type 941 PVO, side profile, in Opalescent Silver Blue, in daylight.',
          vars: { '--pz': '1.05', '--po': '50% 50%' } as Vars,
        }}
        captions={{
          macro: (
            <span>
              <b className="font-medium text-surface-foreground">
                Above &mdash; headlight and bumper, close.
              </b>{' '}
              Chrome against Opalescent Silver Blue.
            </span>
          ),
          wide: (
            <span>
              <b className="font-medium text-surface-foreground">
                Above &mdash; the same car, whole.
              </b>{' '}
              Photographed by its owner after eight years of restoration.
            </span>
          ),
        }}
      />

      {/* ═══════════════════ 05 · WHAT CUSTOMERS SAY ═══════════════════ */}
      <div id="proof" className="mx-auto w-[min(1360px,100%-3rem)] pb-[clamp(5rem,12vh,8rem)]">
        <Chapter kind="In their words" />
        <div className="pb-[clamp(2.5rem,6vh,4.5rem)] pt-7">
          <h2 className="max-w-[16ch] font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] text-surface-foreground">
            What the people
            <br />
            who own them say
          </h2>
        </div>

        <div className="grid gap-[clamp(2.5rem,6vh,4rem)] border-t border-surface-card-border pt-[clamp(2rem,5vh,3rem)]">
          <figure className="grid gap-[1.15rem]">
            <blockquote className="m-0 max-w-[19em] font-prose text-[clamp(1.5rem,2.4vw+0.6rem,2.5rem)] font-extralight leading-[1.34] text-surface-foreground [font-variant-numeric:normal] [text-wrap:pretty]">
              &ldquo;I had interviewed many body shops for the painting of my concours-winning Aston
              Martin. The only person I would trust with the E-type was the man who had laid down
              that paint with such astonishingly beautiful results.&rdquo;
            </blockquote>
            <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-[0.16em] text-surface-muted-foreground before:h-px before:w-10 before:flex-none before:bg-brand-primary-hover before:content-['']">
              <b className="font-medium text-surface-foreground">Mark Antwis</b>
              <span>E-Type Owners Club Magazine, April 2026</span>
            </figcaption>
          </figure>

          <figure className="grid gap-[1.15rem]">
            <blockquote className="m-0 max-w-[24em] font-prose text-[clamp(1.1875rem,1.1vw+0.9rem,1.625rem)] font-light leading-[1.44] text-surface-foreground/85 [font-variant-numeric:normal]">
              &ldquo;&hellip;Panel alignment, gaps and paint finish absolutely amazing. Precise
              closing of doors, boot and bonnet on the money. After visiting other high end body
              shops I chose DPM Autobody, why because one visit to David&rsquo;s shop was all I
              needed to be convinced.&hellip;&rdquo;
            </blockquote>
            <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-[0.16em] text-surface-muted-foreground before:h-px before:w-10 before:flex-none before:bg-brand-primary-hover before:content-['']">
              <b className="font-medium text-surface-foreground">Ahmet Hussein</b>
              <span>Volvo P1800, 1967 &mdash; full body restoration</span>
            </figcaption>
          </figure>

          <figure className="grid gap-[1.15rem]">
            <blockquote className="m-0 max-w-[24em] font-prose text-[clamp(1.1875rem,1.1vw+0.9rem,1.625rem)] font-light leading-[1.44] text-surface-foreground/85 [font-variant-numeric:normal]">
              &ldquo;&hellip;Every panel was aligned meticulously, body lines flowed flawlessly, and
              their paint work which was over 2,000 hours was immaculate and pristine. The DPM team
              treated every detail with expert care, communicating clearly, listening attentively
              and approaching the car like it was their own.&hellip;&rdquo;
            </blockquote>
            <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-[0.16em] text-surface-muted-foreground before:h-px before:w-10 before:flex-none before:bg-brand-primary-hover before:content-['']">
              <b className="font-medium text-surface-foreground">Tonja Hussein</b>
              <span>Volvo P1800, Candy Red, chassis 23925 &mdash; restoration completed 2023</span>
            </figcaption>
          </figure>
        </div>

        <ul className="mt-[clamp(2.5rem,6vh,4rem)] grid list-none gap-0 border-t border-surface-card-border p-0 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
          <li className="grid gap-2 border-b border-surface-card-border py-[clamp(1.5rem,3.5vh,2.25rem)] lg:col-span-2 lg:grid-cols-subgrid lg:items-baseline">
            <span className="font-sans text-[clamp(2rem,4vw,3.25rem)] font-extralight leading-none tracking-[-0.01em] text-surface-foreground [font-variant-numeric:normal]">
              92%
            </span>
            <span className="max-w-[34em] text-[0.9375rem] leading-[1.55] text-surface-muted-foreground">
              Class win outright, AMOC Sandringham Concours, 2024 &mdash; his Aston Martin V8. We
              painted that car too, which is why he came back to us for the E-type.
            </span>
          </li>
          <li className="grid gap-2 border-b border-surface-card-border py-[clamp(1.5rem,3.5vh,2.25rem)] lg:col-span-2 lg:grid-cols-subgrid lg:items-baseline">
            <span className="font-sans text-[clamp(2rem,4vw,3.25rem)] font-extralight leading-none tracking-[-0.01em] text-surface-foreground [font-variant-numeric:normal]">
              450 hrs
            </span>
            <span className="max-w-[34em] text-[0.9375rem] leading-[1.55] text-surface-muted-foreground">
              Panel gapping, levelling and final paint on the E-type above, bare shell to Opalescent
              Silver Blue, three months in our own booth.
            </span>
          </li>
        </ul>

        <div className="mt-[clamp(3.5rem,9vh,5.5rem)] grid gap-8 pt-[clamp(2.5rem,6vh,4rem)] lg:grid-cols-2 lg:gap-16">
          <Prose>
            <strong className="font-medium text-surface-foreground">
              One of the best-known restoration houses in the country sends its cars here to be
              painted.
            </strong>{' '}
            We do other people&rsquo;s paintwork, under other people&rsquo;s names, on cars you have
            very probably already seen. It is the part of this business our name is not on.
          </Prose>
          <Prose>
            We show at the NEC Classic Motor Show, where a car is judged by the people standing in
            front of it.
          </Prose>
        </div>

        <p className="mt-[clamp(2.5rem,6vh,3.5rem)]">
          <Golink href="/builds/p1800-candy">One car, documented in full</Golink>
        </p>
      </div>
    </div>
  );
}
