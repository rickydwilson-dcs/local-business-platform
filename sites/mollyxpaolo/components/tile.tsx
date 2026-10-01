'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ar, clock, srcsetFor } from '@/lib/media';
import type { GalleryPhoto, Tone } from '@/lib/types';
import { useToneSrcset } from './use-tone-srcset';

export function Tile(props: {
  photo: GalleryPhoto;
  tone: Tone;
  mediaBase: string;
  sizes: string;
  picked: boolean;
  stamp?: boolean;
  fav?: boolean;
  onActivate: (id: string) => void;
}) {
  const { photo: p, tone, mediaBase, sizes, picked, stamp = true, fav = true } = props;
  const img = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const srcset = useToneSrcset(img, srcsetFor(mediaBase, p, tone), sizes);

  // A photo already in memory (the hero and ribbon preload the favourites) can be satisfied
  // from the browser's image cache without onLoad ever reaching React, which left it invisible.
  useEffect(() => {
    const i = img.current;
    if (i?.complete && i.naturalWidth) setLoaded(true);
  }, [srcset]);

  // Per-photo data, not styling: the aspect ratio drives the flex layout, and the placeholder
  // shows until the photo arrives.
  const style = {
    '--ar': ar(p).toFixed(4),
    backgroundImage: `url(${p.ph[tone]})`,
  } as CSSProperties;

  return (
    <button
      type="button"
      className={`tile${picked ? ' picked' : ''}`}
      data-id={p.id}
      style={style}
      aria-label={`Photo ${p.n}${p.t ? `, ${clock(p.t)}` : ''}`}
      onClick={() => props.onActivate(p.id)}
    >
      <img
        ref={img}
        alt=""
        loading="lazy"
        decoding="async"
        sizes={sizes}
        srcSet={srcset}
        className={loaded ? 'loaded' : undefined}
        onLoad={() => setLoaded(true)}
      />
      {stamp && p.t && <span className="stamp">{clock(p.t)}</span>}
      {fav && p.featured && <span className="fav">Favourite</span>}
      <span className="check" aria-hidden="true" />
    </button>
  );
}
