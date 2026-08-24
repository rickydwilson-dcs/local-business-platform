/**
 * Background video for the homepage's sticky work/service panels.
 *
 * These panels sit well below the fold, but a plain `<video autoPlay
 * preload="metadata">` still makes the browser start fetching data
 * immediately — autoplay forces it past "metadata only". With 7 such videos
 * on the homepage (~9.7MB combined), that eager fetch contends for mobile
 * bandwidth with the fonts/CSS/JS the LCP text actually depends on, which is
 * what was inflating Lighthouse's simulated mobile LCP to ~4.3s despite the
 * LCP element itself being server-rendered text. Deferring the fetch (and
 * the `.play()` call) until the panel is near the viewport removes that
 * contention.
 *
 * The `poster` attribute is gated the same way, not just `src` — a
 * `<video poster>` has no `loading="lazy"` equivalent and is fetched eagerly
 * by every browser the instant the element is parsed, regardless of `src` or
 * `preload`. A first pass gated only `src` and left `poster` unconditional,
 * which still put all 7 posters on the wire at page load — exactly the "7
 * R2.dev requests over HTTP/1.1" a real (incognito, calibrated) Lighthouse
 * run flagged under "Modern HTTP", since that many near-simultaneous
 * requests to one HTTP/1.1 origin exceed the browser's 6-connections-per-host
 * limit and queue. Until a panel is near the viewport, whatever background
 * sits behind this (now-blank) element shows instead — `.svccard__well` is
 * already backed by its parent `.svccard--{color}`'s own background, but
 * `.wstack` is white, so `work-stack.tsx` sets an explicit ink background on
 * each `.wpanel` directly rather than relying on this component to know it.
 */

'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyVideoProps {
  src: string;
  poster: string;
}

export function LazyVideo({ src, poster }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoad) {
      videoRef.current?.play().catch(() => {});
    }
  }, [shouldLoad]);

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      poster={shouldLoad ? poster : undefined}
      muted
      loop
      playsInline
      preload="none"
    />
  );
}
