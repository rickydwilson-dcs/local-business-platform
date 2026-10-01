'use client';

import { useEffect, useRef } from 'react';
import { ar, srcsetFor } from '@/lib/media';
import type { GalleryPhoto, Tone } from '@/lib/types';

/**
 * Crossfading hero. Leads with the curated hero order (data, from photos.json); portrait screens
 * also get the portrait favourites, portraits first. Two stacked images alternate: the next one
 * is decoded before it fades in, and a photo that fails to load is skipped rather than shown
 * broken. Driven imperatively, as in the prototype, so a crossfade never re-renders the page.
 */
export function Hero(props: {
  photos: GalleryPhoto[];
  lead: number;
  tone: Tone;
  mediaBase: string;
}) {
  const { photos, lead, tone, mediaBase } = props;
  const a = useRef<HTMLImageElement>(null);
  const b = useRef<HTMLImageElement>(null);
  const state = useRef({
    list: [] as GalleryPhoto[],
    n: 0,
    front: 0,
    current: null as GalleryPhoto | null,
  });
  const toneRef = useRef(tone);

  useEffect(() => {
    const portrait = matchMedia('(orientation: portrait)').matches;
    const list = photos.filter((p, i) => i < lead || (portrait && ar(p) < 1));
    if (portrait) list.sort((x, y) => ar(x) - ar(y));
    const s = state.current;
    s.list = list.length ? list : photos;
    const imgs = [a.current!, b.current!];
    let misses = 0;

    const show = () => {
      if (!s.list.length) return;
      const p = s.list[s.n++ % s.list.length];
      const im = imgs[s.front];
      im.srcset = srcsetFor(mediaBase, p, toneRef.current);
      im.decode().then(
        () => {
          misses = 0;
          s.current = p;
          im.classList.add('on');
          imgs[1 - s.front].classList.remove('on');
          s.front = 1 - s.front;
        },
        () => {
          if (++misses < s.list.length) show();
        }
      );
    };
    show();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(show, 6500);
    return () => clearInterval(timer);
  }, [photos, lead, mediaBase]);

  // Tone change: re-render the photo on screen in the new tone, swapping only once decoded.
  useEffect(() => {
    toneRef.current = tone;
    const s = state.current;
    const on = [a.current, b.current].find((im) => im?.classList.contains('on'));
    if (!on || !s.current) return;
    const next = srcsetFor(mediaBase, s.current, tone);
    const pre = new Image();
    pre.sizes = '100vw';
    pre.srcset = next;
    const swap = () => (on.srcset = next);
    pre.decode().then(swap, swap);
    // decode() can stay pending indefinitely in a background tab.
    const fallback = setTimeout(swap, 1500);
    return () => clearTimeout(fallback);
  }, [tone, mediaBase]);

  return (
    <div>
      <img ref={a} alt="" sizes="100vw" />
      <img ref={b} alt="" sizes="100vw" />
    </div>
  );
}
