import type { Metadata, Viewport } from 'next';
import {
  Big_Shoulders,
  Courier_Prime,
  Fraunces,
  Jost,
  Limelight,
  Outfit,
  Spectral,
  Yellowtail,
} from 'next/font/google';
import './globals.css';

/*
 * Each tone has its own faces. Discrete weights only (a 'variable' font downloads its whole axis),
 * and only the colour tone's faces are preloaded: the sepia and B&W faces are declared but fetched
 * by the browser only once text in that tone actually renders.
 *
 * Two departures from the prototype's Google Fonts URL, both forced by next/font:
 * - "Big Shoulders Display" is published to next/font as the merged family Big_Shoulders.
 * - Fraunces loses its opsz axis: `axes` is only allowed with weight 'variable'.
 */
const yellowtail = Yellowtail({ weight: '400', subsets: ['latin'], variable: '--ff-yellowtail' });
// next/font ships no fallback metrics for Big Shoulders, so it can't build an adjusted fallback.
const shoulders = Big_Shoulders({
  weight: '800',
  subsets: ['latin'],
  variable: '--ff-shoulders',
  adjustFontFallback: false,
});
const outfit = Outfit({ weight: ['400', '600'], subsets: ['latin'], variable: '--ff-outfit' });
const limelight = Limelight({
  weight: '400',
  subsets: ['latin'],
  variable: '--ff-limelight',
  preload: false,
});
const jost = Jost({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--ff-jost',
  preload: false,
});
const fraunces = Fraunces({
  weight: '800',
  style: 'italic',
  subsets: ['latin'],
  variable: '--ff-fraunces',
  preload: false,
});
const spectral = Spectral({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--ff-spectral',
  preload: false,
});
const courier = Courier_Prime({
  weight: '400',
  subsets: ['latin'],
  variable: '--ff-courier',
  preload: false,
});

const fontVars = [yellowtail, shoulders, outfit, limelight, jost, fraunces, spectral, courier]
  .map((f) => f.variable)
  .join(' ');

export const metadata: Metadata = {
  title: 'Molly × Paolo',
  description: 'The wedding of Molly and Paolo, Las Vegas, 22 September 2026.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/*
 * Applies the tone before first paint so the page never flashes the wrong theme:
 * ?tone= wins, then the viewer's remembered choice, else colour. Admin always stays colour.
 */
const toneScript = `(function(){try{var d=document.documentElement;if(location.pathname.indexOf('/admin')===0){d.dataset.tone='colour';return}var t=new URLSearchParams(location.search).get('tone');try{t=t||localStorage.getItem('mxp-tone')}catch(e){}if(t==='colour'||t==='bw'||t==='sepia')d.dataset.tone=t}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" data-tone="colour" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: toneScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
