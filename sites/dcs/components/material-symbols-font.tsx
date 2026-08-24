'use client';

import { useEffect } from 'react';

const HREF =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';

/**
 * Loads the Material Symbols stylesheet without blocking first paint.
 *
 * Must stay a real <link>, not a CSS @import — Tailwind's @tailwind
 * expansion buries @import url() mid-file and the browser ignores it per
 * spec (see feedback_external_font_imports.md in project memory). A plain
 * synchronous `<link rel="stylesheet">` in the root layout's <head> was
 * render-blocking on every page — Lighthouse's render-blocking-insight audit
 * measured ~800ms of estimated LCP/FCP savings from it alone, since it's a
 * cross-origin request the browser must discover, connect to, and download
 * before paint. It's also loaded even on routes (the homepage) that use no
 * Material Symbols icon at all. Inserting the link after mount removes it
 * from the critical rendering path; pages that use the icons pick them up a
 * beat later instead of holding up first paint for everyone.
 */
export function MaterialSymbolsFont() {
  useEffect(() => {
    if (document.querySelector(`link[href="${HREF}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = HREF;
    document.head.appendChild(link);
  }, []);

  return null;
}
