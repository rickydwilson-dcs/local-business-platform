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
 * contention; the poster image still paints immediately so nothing looks
 * broken while a panel is off-screen.
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
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
    />
  );
}
