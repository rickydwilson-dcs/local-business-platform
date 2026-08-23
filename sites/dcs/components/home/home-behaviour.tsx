'use client';

/**
 * Port of the r9 prototype's inline `<script>` (lines 1051-1233 of
 * `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html`).
 *
 * Six behaviours, and where each one comes from in the prototype:
 *
 *   | behaviour                  | prototype lines |
 *   | -------------------------- | --------------- |
 *   | reduced motion read        | 1053            |
 *   | latched `.panel` reveals   | 1161-1164       |
 *   | burger menu                | 1166-1179       |
 *   | `layoutTop()` + anchors    | 1181-1205       |
 *   | ground tracking            | 1207-1216       |
 *   | services `--intro` fade    | 1217-1231       |
 *   | scroll/resize wiring       | 1227-1231       |
 *
 * (The prototype's headline split, lines 1055-1064, and its `paint()` pricing
 * machinery, lines 1066-1158, are NOT here — they were ported in Phase 5 to
 * `hero.tsx` and `pricing.tsx` respectively.)
 *
 * ## The React shape, and why
 *
 * `HomeBehaviour` is a Client Component provider that takes the whole
 * server-rendered tree as `children`. Because those children are element
 * objects created by the Server Component `HomeBody`, provider state changes
 * do NOT re-render them — only the components that actually read the context
 * (`SiteBar`, `MobileMenu`) re-render. So the interactive state lives in React
 * without turning the entire homepage into a client re-render.
 *
 * The split between React state and direct DOM mutation is deliberate:
 *
 *   - **React state** for the discrete, user-facing things a reader can
 *     observe and that markup depends on: `menuOpen` (drives `.menu`'s
 *     `hidden`, the burger's `aria-expanded`/`aria-label`) and `ground`
 *     (drives `.bar`'s `data-ground`). Mutating `data-ground` imperatively
 *     would work today, but it leaves a value React believes it owns being
 *     changed behind its back; threading it through context removes the
 *     question entirely.
 *   - **Direct DOM mutation** for the two continuous, purely visual effects
 *     the prototype also writes directly: the `--intro` custom property
 *     (updated every animation frame during scroll — React state here would
 *     be a re-render per frame) and the one-shot `.in` reveal latch (a
 *     write-once class on nodes React never re-renders).
 *
 * ## Traps this file exists to respect
 *
 * - **Trap 1 (rAF is frozen in a backgrounded tab).** The ground decision is
 *   extracted as the pure `groundFor()` below so the gate can test the
 *   computation rather than read the live rAF-written attribute, which cannot
 *   be trusted under instrumentation. Nothing in here `await`s inside a rAF
 *   callback.
 * - **Traps 4 and 5 (sticky elements lie about their position).** Every
 *   `.panel` here is `position: sticky` with no bound, so once you are past
 *   one, `getBoundingClientRect()` and `offsetTop` BOTH report the pinned
 *   position — measured from the footer, every section read 14391 and every
 *   in-page link moved the scroll nowhere at all. `layoutTop()` neutralises
 *   `position` for one synchronous measurement to read the real layout
 *   position. This is why the anchor interception is load-bearing and not
 *   polish: without it the links test clean from the top of the page and are
 *   dead everywhere below it.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/* -------------------------------------------------------------------------- */
/* Pure functions — the testable core                                          */
/* -------------------------------------------------------------------------- */

/** One `main [data-ground]` section, as `groundFor()` sees it. */
export interface GroundRect {
  /** The section's `data-ground` value. */
  ground: string;
  /** Viewport-relative top, i.e. `getBoundingClientRect().top`. */
  top: number;
  /** Viewport-relative bottom, i.e. `getBoundingClientRect().bottom`. */
  bottom: number;
}

/**
 * Which ground the bar should adopt for a probe point `probeY` pixels down the
 * viewport. Pure extraction of the prototype's `ground()` (lines 1209-1216).
 *
 * Two details are load-bearing and both are inherited exactly:
 *
 * 1. **The rects are LIVE viewport rects, not layout positions.** The
 *    prototype compares a viewport coordinate (`bar height * 0.62`) against
 *    `getBoundingClientRect()`. Feeding neutralised layout positions in here
 *    would be a different — and wrong — algorithm.
 * 2. **The LAST match wins, not the first.** The prototype uses `forEach` with
 *    unconditional assignment, so a later section overwrites an earlier one.
 *    This is not incidental: the sticky panels overlap constantly. In the
 *    recorded fixture at scrollY 13613, `#work`, `#services` and the process
 *    panel all report `top: 0, bottom: 900` simultaneously and only the last
 *    of them (`ink`) is correct — it is the one painting on top.
 *
 * Falls back to `'paper'` when no section contains the probe point.
 */
export function groundFor(probeY: number, rects: GroundRect[]): string {
  let current = 'paper';
  for (const rect of rects) {
    if (rect.top <= probeY && rect.bottom > probeY) current = rect.ground;
  }
  return current;
}

/**
 * The element's real position in the document, in document coordinates —
 * a faithful port of the prototype's `layoutTop()` (lines 1188-1194).
 *
 * `position: static` is set, the rect read, and the original inline `position`
 * restored, all in one synchronous block. No paint can happen between the two
 * writes, so nothing flickers on screen; the browser only has to do a layout
 * recalculation, which is exactly what forces it to report the layout position
 * instead of the pinned one.
 *
 * Restoring `el.style.position` to its previous value (rather than clearing
 * it) matters: an element with no inline `position` gets `''` back, so the
 * stylesheet's `position: sticky` takes over again, and an element that DID
 * carry an inline value keeps it.
 */
export function layoutTop(el: HTMLElement): number {
  const previous = el.style.position;
  el.style.position = 'static';
  const y = el.getBoundingClientRect().top + window.scrollY;
  el.style.position = previous;
  return y;
}

/* -------------------------------------------------------------------------- */
/* Reduced motion                                                              */
/* -------------------------------------------------------------------------- */

/**
 * `prefers-reduced-motion: reduce`, read ONCE on mount — matching the
 * prototype's `var reduce = matchMedia(...).matches` (line 1053), which is a
 * one-shot read with no change listener.
 *
 * The SSR value is `false` (motion armed) and it is corrected on hydration.
 * That is the safe default: a reader who has NOT asked for reduced motion sees
 * the intended design immediately, and a reader who has gets the correction
 * before they can interact.
 *
 * Exported so `pricing.tsx` consumes the same read rather than keeping its own
 * copy of the media query.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return reduced;
}

/* -------------------------------------------------------------------------- */
/* Context                                                                     */
/* -------------------------------------------------------------------------- */

export interface HomeBehaviourValue {
  /** Whether the fullscreen `.menu` overlay is open. */
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
  /** Current `data-ground` for `.bar`. Starts `'ink'`, as the prototype does. */
  ground: string;
  /** `prefers-reduced-motion: reduce`, read once on mount. */
  reducedMotion: boolean;
}

const HomeBehaviourContext = createContext<HomeBehaviourValue | null>(null);

/**
 * Read the homepage behaviour context. Throws rather than returning a
 * silently-inert default: a `SiteBar` rendered outside the provider would
 * otherwise look fine and simply never change ground, which is precisely the
 * plausible-looking failure this phase is meant to avoid.
 */
export function useHomeBehaviour(): HomeBehaviourValue {
  const value = useContext(HomeBehaviourContext);
  if (!value) {
    throw new Error('useHomeBehaviour must be used inside <HomeBehaviour>');
  }
  return value;
}

/* -------------------------------------------------------------------------- */
/* Provider                                                                    */
/* -------------------------------------------------------------------------- */

export function HomeBehaviour({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpenState] = useState(false);
  // `'ink'` matches the prototype's server-rendered `<header ... data-ground="ink">`,
  // so hydration is a no-op and the first rAF corrects it if needed.
  const [ground, setGround] = useState('ink');
  const reducedMotion = usePrefersReducedMotion();
  const lastFocus = useRef<HTMLElement | null>(null);

  const setMenuOpen = useCallback((open: boolean) => setMenuOpenState(open), []);
  const toggleMenu = useCallback(() => setMenuOpenState((open) => !open), []);

  /* --- Ground tracking + the services intro fade, both on one rAF ---------- */
  useEffect(() => {
    const bar = document.getElementById('bar');
    if (!bar) return;

    const grounds = Array.from(document.querySelectorAll<HTMLElement>('main [data-ground]'));
    const svcstack = document.querySelector<HTMLElement>('.svcstack');
    const intro = document.getElementById('services');

    let frame = 0;

    const update = () => {
      frame = 0;

      // Ground — prototype lines 1209-1216. The probe sits 62% of the way down
      // the bar's own height, so it is inside the bar rather than at its edge.
      const probeY = bar.getBoundingClientRect().height * 0.62;
      const rects: GroundRect[] = grounds.map((el) => {
        const r = el.getBoundingClientRect();
        return { ground: el.dataset.ground ?? '', top: r.top, bottom: r.bottom };
      });
      setGround(groundFor(probeY, rects));

      // Services intro fade — prototype lines 1220-1225. `--intro` goes 1 while
      // the card stack is still below the fold, to 0 once it has risen to 45%
      // of the viewport. Written straight to the node: this changes every frame
      // during scroll, so React state would be a re-render per frame for a
      // value only CSS ever reads.
      if (svcstack && intro) {
        const vh = window.innerHeight;
        const t = svcstack.getBoundingClientRect().top;
        const p = (t - vh * 0.45) / (vh * 0.55);
        intro.style.setProperty('--intro', Math.max(0, Math.min(1, p)).toFixed(3));
      }
    };

    // Coalescing to one frame: the prototype queues a rAF per scroll event,
    // which can stack several callbacks into a single frame. The settled result
    // is identical and this does strictly less layout work. Nothing in `update`
    // is async — awaiting inside a rAF callback is Trap 1 and is never done.
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* --- Latched reveals — prototype lines 1161-1164 ------------------------- */
  useEffect(() => {
    const panels = Array.from(document.querySelectorAll<HTMLElement>('.panel'));
    if (panels.length === 0) return;

    // One-shot latch: `.in` is added the first time a panel is >=16% visible
    // and the panel is unobserved immediately. It is never removed, so a panel
    // cannot flicker back out on the way up.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.16 }
    );

    panels.forEach((panel) => io.observe(panel));
    return () => io.disconnect();
  }, []);

  /* --- In-page link interception — prototype lines 1181-1205 --------------- */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const from = event.target;
      if (!(from instanceof Element)) return;

      const anchor = from.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.length < 2) return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      event.preventDefault();

      // The scroll lock must be off before scrolling: `window.scrollTo` cannot
      // move the page while `<body>` carries `overflow: hidden`. When the click
      // came from a menu link the React state change that closes the menu is
      // already in flight, but relying on the exact ordering of React's commit
      // against this document-level listener would make every menu link depend
      // on scheduler internals. Clearing it here is a no-op when the menu is
      // shut, and the layout effect below re-asserts the correct value.
      if (document.body.style.overflow) document.body.style.overflow = '';

      window.scrollTo({ top: layoutTop(target), behavior: reducedMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', href);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [reducedMotion]);

  /* --- Burger menu side effects — prototype lines 1169-1179 ---------------- */
  // A layout effect, not a passive one: the prototype's `setMenu()` locks the
  // body and moves focus synchronously inside the click handler, and focus has
  // to land after `hidden` has been removed but before the browser can paint a
  // frame with focus still on the burger.
  useLayoutEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    if (menuOpen) {
      const active = document.activeElement;
      lastFocus.current = active instanceof HTMLElement ? active : null;
      // Capture focus into the overlay. The prototype focuses the first link
      // and does not build a full tab cycle; that is preserved rather than
      // extended, since the overlay covers the viewport and its only content
      // is the nav.
      document.querySelector<HTMLElement>('.menu a')?.focus();
    } else if (lastFocus.current?.isConnected) {
      lastFocus.current.focus();
      lastFocus.current = null;
    } else if (lastFocus.current) {
      // The remembered node has gone; fall back to the control that owns the
      // menu so focus never ends up on <body>.
      document.getElementById('burger')?.focus();
      lastFocus.current = null;
    }
  }, [menuOpen]);

  // Escape to close. Registered only while open, so a closed menu adds no
  // keyboard listener to the document at all.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpenState(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  // Releasing the scroll lock is not covered by the effect above, which only
  // runs on a `menuOpen` change — unmounting with the menu open would strand
  // `overflow: hidden` on the body.
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <HomeBehaviourContext.Provider
      value={{ menuOpen, setMenuOpen, toggleMenu, ground, reducedMotion }}
    >
      {children}
    </HomeBehaviourContext.Provider>
  );
}
