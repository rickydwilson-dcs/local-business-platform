'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { clock, downloadName, mediaUrl, srcsetFor } from '@/lib/media';
import type { GalleryPhoto, Tone } from '@/lib/types';
import { useToneSrcset } from './use-tone-srcset';

/** Slides either side of the current one that get an image. The rest are empty snap points. */
const WINDOW = 2;
const TAP_ZOOM = 2.6;
const MAX_ZOOM = 5;

type Zoom = { img: HTMLImageElement; scale: number; x: number; y: number };

/** Draw a zoom. Transforms scale about the image box's centre, which is the slide's centre. */
function paint(z: Zoom, animate: boolean) {
  z.img.style.transition = animate ? '' : 'none';
  z.img.style.transform = `translate(${z.x}px, ${z.y}px) scale(${z.scale})`;
}

/** Keep the photo's edges from being dragged inside the screen's edges. */
function clampPan(z: Zoom) {
  const w = z.img.clientWidth;
  const h = z.img.clientHeight;
  const ar = Number(z.img.dataset.ar) || w / h;
  // object-fit: contain, so the photo itself is smaller than the box on one axis.
  const mx = Math.max(0, (Math.min(w, h * ar) * z.scale - w) / 2);
  const my = Math.max(0, (Math.min(h, w / ar) * z.scale - h) / 2);
  z.x = Math.min(mx, Math.max(-mx, z.x));
  z.y = Math.min(my, Math.max(-my, z.y));
}

function centre(el: Element) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function Slide(props: { photo: GalleryPhoto; tone: Tone; mediaBase: string; live: boolean }) {
  const { photo: p, tone, mediaBase, live } = props;
  const img = useRef<HTMLImageElement>(null);
  const srcset = useToneSrcset(img, srcsetFor(mediaBase, p, tone), '100vw');
  return (
    <div className="lb-slide" data-id={p.id}>
      {live && (
        <>
          <div className="ph" style={{ backgroundImage: `url(${p.ph[tone]})` }} />
          <img
            ref={img}
            alt={`Photo ${p.n}`}
            data-id={p.id}
            data-ar={p.w / p.h}
            sizes="100vw"
            srcSet={srcset}
            draggable={false}
          />
        </>
      )}
    </div>
  );
}

/**
 * Full-screen viewer. Swipe or arrow keys to browse, pinch or double-tap / double-click to zoom
 * and drag to pan, swipe down or Esc to close, single tap to hide the controls (Close stays).
 *
 * Rendered as a direct child of <body> (no transformed or backdrop-filtered ancestor), which a
 * fixed overlay needs to cover the viewport. Scroll position is read on a timer, not
 * requestAnimationFrame, which never fires in a background tab.
 */
export function Lightbox(props: {
  order: GalleryPhoto[];
  startId: string;
  tone: Tone;
  mediaBase: string;
  chapterTitle: (id: string) => string;
  isPicked: (id: string) => boolean;
  onTogglePick: (id: string) => void;
  onClose: (id: string) => void;
  toneSwitch: ReactNode;
}) {
  const { order, tone, mediaBase } = props;
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [i, setI] = useState(() =>
    Math.max(
      0,
      order.findIndex((p) => p.id === props.startId)
    )
  );
  const iRef = useRef(i);
  iRef.current = i;
  const [menu, setMenu] = useState(false);
  const [chromeOff, setChromeOff] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [hint, setHint] = useState('');
  const zoom = useRef<Zoom | null>(null);

  const p = order[i];
  const { onClose } = props;

  const unzoom = useCallback(() => {
    if (!zoom.current) return;
    zoom.current.img.style.transition = '';
    zoom.current.img.style.transform = '';
    zoom.current = null;
    setZoomed(false);
  }, []);

  const close = useCallback(() => {
    unzoom();
    onClose(order[iRef.current].id);
  }, [onClose, order, unzoom]);

  const go = useCallback(
    (d: number) => {
      const t = track.current!;
      const n = Math.min(order.length - 1, Math.max(0, iRef.current + d));
      unzoom();
      t.scrollTo({ left: n * t.clientWidth, behavior: 'smooth' });
    },
    [order.length, unzoom]
  );

  // Open: jump straight to the photo, lock page scroll, focus Close, show the hint once.
  useLayoutEffect(() => {
    const t = track.current!;
    t.scrollTo({ left: iRef.current * t.clientWidth, behavior: 'instant' });
    const html = document.documentElement;
    html.style.overflow = 'hidden';
    closeBtn.current?.focus({ preventScroll: true });
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!localStorage.getItem('mxp-hinted')) {
        const coarse = matchMedia('(pointer: coarse)').matches;
        setHint(
          coarse
            ? 'Swipe to browse · pinch to zoom · swipe down to close'
            : '← → to browse · double-click to zoom · Esc to close'
        );
        localStorage.setItem('mxp-hinted', '1');
        timer = setTimeout(() => setHint(''), 4500);
      }
    } catch {}
    return () => {
      html.style.overflow = '';
      clearTimeout(timer);
    };
  }, []);

  // Track the slide in view.
  useEffect(() => {
    const t = track.current!;
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const n = Math.round(t.scrollLeft / t.clientWidth);
        if (n !== iRef.current) setI(n);
      }, 60);
    };
    const onResize = () => t.scrollTo({ left: iRef.current * t.clientWidth, behavior: 'instant' });
    t.addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    return () => {
      t.removeEventListener('scroll', onScroll);
      removeEventListener('resize', onResize);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoom.current) unzoom();
        else close();
      } else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [close, go, unzoom]);

  // Gestures. Pointer events: drag-pan while zoomed, swipe down to dismiss, tap / double-tap.
  // Touch events: two-finger pinch, because only a non-passive touchmove can stop the browser
  // scrolling the track or zooming the page under the fingers.
  useEffect(() => {
    const t = track.current!;
    const lb = root.current!;
    let ptr: {
      x: number;
      y: number;
      dx: number;
      dy: number;
      slide: HTMLElement | null;
      base?: { x: number; y: number };
    } | null = null;
    let lastTap = 0;
    let tapTimer: ReturnType<typeof setTimeout> | undefined;
    let pinch: {
      d0: number;
      m0: { x: number; y: number };
      c: { x: number; y: number };
      s0: number;
      x0: number;
      y0: number;
    } | null = null;

    const down = (e: PointerEvent) => {
      // A second finger belongs to a pinch, which the touch handlers own.
      if (!e.isPrimary || pinch) return;
      ptr = {
        x: e.clientX,
        y: e.clientY,
        dx: 0,
        dy: 0,
        slide: (e.target as HTMLElement).closest('.lb-slide'),
      };
      if (zoom.current) ptr.base = { x: zoom.current.x, y: zoom.current.y };
    };
    const move = (e: PointerEvent) => {
      if (!ptr || !e.isPrimary) return;
      ptr.dx = e.clientX - ptr.x;
      ptr.dy = e.clientY - ptr.y;
      const z = zoom.current;
      if (z && ptr.base) {
        z.x = ptr.base.x + ptr.dx;
        z.y = ptr.base.y + ptr.dy;
        paint(z, false);
      } else if (ptr.dy > 0 && Math.abs(ptr.dy) > Math.abs(ptr.dx) * 1.2 && ptr.slide) {
        const img = ptr.slide.querySelector('img');
        if (!img) return;
        img.style.transition = 'none';
        img.style.transform = `translateY(${ptr.dy}px) scale(${1 - Math.min(ptr.dy, 400) / 2000})`;
        lb.style.background = `rgba(0,0,0,${1 - Math.min(ptr.dy, 300) / 400})`;
      }
    };
    const end = (e: PointerEvent) => {
      if (!ptr || !e.isPrimary) return;
      const { dx, dy, slide } = ptr;
      ptr = null;
      const moved = Math.hypot(dx, dy) > 8;
      const img = slide?.querySelector('img') ?? null;
      if (zoom.current) {
        clampPan(zoom.current);
        paint(zoom.current, true);
      } else if (img) {
        img.style.transition = '';
        lb.style.background = '';
        img.style.transform = '';
        if (dy > 110 && dy > Math.abs(dx)) return close();
      }
      if (moved || e.type !== 'pointerup') return;
      const now = Date.now();
      if (now - lastTap < 300) {
        clearTimeout(tapTimer);
        lastTap = 0;
        if (zoom.current) unzoom();
        else if (img && slide && e.target === img) {
          // Zoom in on the tapped point: it stays under the finger.
          const c = centre(slide);
          const z: Zoom = {
            img,
            scale: TAP_ZOOM,
            x: (e.clientX - c.x) * (1 - TAP_ZOOM),
            y: (e.clientY - c.y) * (1 - TAP_ZOOM),
          };
          clampPan(z);
          paint(z, true);
          zoom.current = z;
          setZoomed(true);
        }
      } else {
        lastTap = now;
        tapTimer = setTimeout(() => setChromeOff((c) => !c), 300);
      }
    };

    const mid = (a: Touch, b: Touch) => ({
      x: (a.clientX + b.clientX) / 2,
      y: (a.clientY + b.clientY) / 2,
    });
    const dist = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

    const touchStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      // The slide under the fingers, which may not be iRef's yet if a swipe is still settling.
      const n = Math.round(t.scrollLeft / t.clientWidth);
      const slide = t.children[n] as HTMLElement | undefined;
      const img = slide?.querySelector('img');
      if (!slide || !img) return;
      // The first finger's drag is now part of the pinch: drop it and any swipe-down preview.
      ptr = null;
      clearTimeout(tapTimer);
      lb.style.background = '';
      if (zoom.current?.img !== img) {
        unzoom();
        t.scrollTo({ left: n * t.clientWidth, behavior: 'instant' });
        if (n !== iRef.current) setI(n);
        zoom.current = { img, scale: 1, x: 0, y: 0 };
        setZoomed(true);
      }
      const z = zoom.current!;
      const [a, b] = [e.touches[0], e.touches[1]];
      pinch = { d0: dist(a, b), m0: mid(a, b), c: centre(slide), s0: z.scale, x0: z.x, y0: z.y };
    };
    const touchMove = (e: TouchEvent) => {
      const z = zoom.current;
      if (!pinch || !z || e.touches.length !== 2) return;
      e.preventDefault();
      const [a, b] = [e.touches[0], e.touches[1]];
      const m = mid(a, b);
      // A little give past either limit; it settles back on release.
      const s = Math.min(MAX_ZOOM * 1.2, Math.max(0.8, (pinch.s0 * dist(a, b)) / pinch.d0));
      const k = s / pinch.s0;
      // The point of the photo that started under the fingers follows the fingers.
      z.x = m.x - pinch.c.x - (pinch.m0.x - pinch.c.x - pinch.x0) * k;
      z.y = m.y - pinch.c.y - (pinch.m0.y - pinch.c.y - pinch.y0) * k;
      z.scale = s;
      paint(z, false);
    };
    const touchEnd = (e: TouchEvent) => {
      if (!pinch || e.touches.length >= 2) return;
      pinch = null;
      const z = zoom.current;
      if (!z) return;
      if (z.scale < 1.05) return unzoom();
      z.scale = Math.min(MAX_ZOOM, z.scale);
      clampPan(z);
      paint(z, true);
    };
    // Safari's own pinch events: without this, iOS zooms the page behind the viewer.
    const noGesture = (e: Event) => e.preventDefault();

    t.addEventListener('pointerdown', down);
    t.addEventListener('pointermove', move);
    t.addEventListener('pointerup', end);
    t.addEventListener('pointercancel', end);
    t.addEventListener('touchstart', touchStart, { passive: true });
    t.addEventListener('touchmove', touchMove, { passive: false });
    t.addEventListener('touchend', touchEnd);
    t.addEventListener('touchcancel', touchEnd);
    lb.addEventListener('gesturestart', noGesture);
    return () => {
      t.removeEventListener('pointerdown', down);
      t.removeEventListener('pointermove', move);
      t.removeEventListener('pointerup', end);
      t.removeEventListener('pointercancel', end);
      t.removeEventListener('touchstart', touchStart);
      t.removeEventListener('touchmove', touchMove);
      t.removeEventListener('touchend', touchEnd);
      t.removeEventListener('touchcancel', touchEnd);
      lb.removeEventListener('gesturestart', noGesture);
      clearTimeout(tapTimer);
    };
  }, [close, unzoom]);

  const long = Math.max(p.w, p.h);
  const picked = props.isPicked(p.id);

  return (
    <div
      ref={root}
      className={`lb open${chromeOff ? ' chrome-off' : ''}${zoomed ? ' zoomed' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <div className="lb-track" ref={track}>
        {order.map((q, j) => (
          <Slide
            key={q.id}
            photo={q}
            tone={tone}
            mediaBase={mediaBase}
            live={Math.abs(j - i) <= WINDOW}
          />
        ))}
      </div>
      <div className="lb-ui">
        <div className="lb-top">
          <div className="where">
            {i + 1} / {order.length}
            <span>
              {props.chapterTitle(p.chapter)}
              {p.t ? ` · ${clock(p.t)}` : ''}
            </span>
          </div>
          <button
            className="icon-btn"
            aria-pressed={picked}
            aria-label="Add to selection"
            onClick={() => props.onTogglePick(p.id)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </button>
          <button
            className="icon-btn"
            aria-label="Download options"
            aria-haspopup="true"
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19.5h14" />
            </svg>
          </button>
        </div>
        <div className={`lb-menu${menu ? ' open' : ''}`} onClick={() => setMenu(false)}>
          {/* The bucket sends Content-Disposition: attachment, so these save rather than open. */}
          <a href={mediaUrl(mediaBase, p, tone, '4k')} download={downloadName(p, tone, '4k')}>
            4K{' '}
            <small>
              {long > 3840
                ? '3840 px · good for screens and prints'
                : `${long} px · same as full size`}
            </small>
          </a>
          <a
            href={mediaUrl(mediaBase, p, tone, 'original')}
            download={downloadName(p, tone, 'original')}
          >
            Full size <small>{long} px · the original</small>
          </a>
        </div>
        <button className="icon-btn lb-nav prev" aria-label="Previous photo" onClick={() => go(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button className="icon-btn lb-nav next" aria-label="Next photo" onClick={() => go(1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <p className="lb-hint">{hint}</p>
      </div>
      {/* Outside .lb-ui so hiding the controls never hides the way out. */}
      <button className="lb-close" aria-label="Close" ref={closeBtn} onClick={close}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      {/* Compare tones on one photo without leaving the viewer. */}
      {props.toneSwitch}
    </div>
  );
}
