'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

const SWAP_FALLBACK_MS = 1500;

/**
 * Keeps an image's srcset in step with the tone without a flash: when the tone changes on an
 * image that has already loaded, the new picture is decoded off-screen first and swapped in
 * once it's ready, so the old tone stays on screen meanwhile.
 */
export function useToneSrcset(
  imgRef: RefObject<HTMLImageElement | null>,
  next: string,
  sizes: string
): string {
  const [shown, setShown] = useState(next);
  const latest = useRef(next);

  useEffect(() => {
    latest.current = next;
    const img = imgRef.current;
    if (!img || !img.complete || !img.naturalWidth) {
      setShown(next);
      return;
    }
    const pre = new Image();
    pre.sizes = sizes;
    pre.srcset = next;
    const swap = () => {
      if (latest.current === next) setShown(next);
    };
    pre.decode().then(swap, swap);
    // decode() can stay pending indefinitely in a background tab; never leave the old tone up.
    const fallback = setTimeout(swap, SWAP_FALLBACK_MS);
    return () => clearTimeout(fallback);
    // imgRef is a stable ref object; sizes only matters for the preload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next]);

  return shown;
}
