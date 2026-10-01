'use client';

import type { Tone } from '@/lib/types';

const LABELS: { tone: Tone; label: string }[] = [
  { tone: 'colour', label: 'Colour' },
  { tone: 'bw', label: 'B&W' },
  { tone: 'sepia', label: 'Sepia' },
];

/** Floating, thumb-reachable tone switch. Switches the photos and re-themes the whole site. */
export function ToneSwitch(props: { tone: Tone; onChange: (t: Tone) => void }) {
  return (
    <nav className="tone" role="radiogroup" aria-label="Photo tone">
      {LABELS.map(({ tone, label }) => (
        <button
          key={tone}
          role="radio"
          data-tone={tone}
          aria-checked={props.tone === tone}
          onClick={() => props.onChange(tone)}
        >
          <span className={`sw sw-${tone}`} />
          {label}
        </button>
      ))}
    </nav>
  );
}
