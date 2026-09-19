'use client';

/**
 * The `.card__well` background video on the three portfolio cards with real
 * media — ported class-for-class from `prototype/projects-list.html:167-172`.
 *
 * Distinct from `components/home/lazy-video.tsx`: the homepage's `.wpanel`
 * videos autoplay once a sticky panel nears the viewport (an
 * `IntersectionObserver`), because they ARE the panel. These cards are a
 * compact grid of 13 — playing all three simultaneously on scroll would be
 * exactly the "several background-video panels below the fold" eager-fetch
 * problem root `CLAUDE.md`'s Performance section warns about. The prototype
 * instead gates playback behind `onmouseover`/`onmouseout`, i.e. `preload="none"`
 * really does mean nothing is fetched until a visitor's pointer is over the
 * card. `poster` still loads eagerly (no `loading="lazy"` equivalent exists
 * for it), but that is 3 small poster images, not 3 videos.
 */

import { useRef } from 'react';

export interface HoverVideoProps {
  src: string;
  poster: string;
  alt: string;
}

export function HoverVideo({ src, poster, alt }: HoverVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-label={alt}
      onMouseOver={() => ref.current?.play().catch(() => {})}
      onMouseOut={() => ref.current?.pause()}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
