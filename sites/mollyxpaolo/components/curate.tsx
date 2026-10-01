'use client';

import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { Curation, PhotoState } from '@/lib/types';

interface AdminPhoto {
  id: string;
  n: number;
  featured: boolean;
  /** Colour placeholder. */
  ph: string;
}

const NEXT: Record<PhotoState, PhotoState> = {
  shown: 'featured',
  featured: 'hidden',
  hidden: 'shown',
};
type Filter = 'all' | 'featured' | 'hidden';

export function Curate(props: { photos: AdminPhoto[]; initial: Curation; mediaBase: string }) {
  const { photos, mediaBase } = props;
  const [overrides, setOverrides] = useState(props.initial.photos);
  const [filter, setFilter] = useState<Filter>('all');
  const [msg, setMsg] = useState({ text: 'Changes save as you go.', error: false });

  // Saves run one at a time, each carrying the version the last one returned, so quick taps
  // never trip the server's stale-write check against themselves.
  const version = useRef(props.initial.version);
  const queue = useRef<Promise<void>>(Promise.resolve());

  const seed = (p: AdminPhoto): PhotoState => (p.featured ? 'featured' : 'shown');
  const stateOf = useCallback(
    (p: AdminPhoto): PhotoState => overrides[p.id] ?? (p.featured ? 'featured' : 'shown'),
    [overrides]
  );

  function save(next: Curation['photos'], done: string) {
    queue.current = queue.current.then(async () => {
      try {
        const res = await fetch('/api/admin/curation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ baseVersion: version.current, photos: next }),
        });
        if (res.status === 409) {
          setMsg({ text: 'Changed somewhere else. Reload the page, then try again.', error: true });
          return;
        }
        if (res.status === 401) {
          setMsg({ text: 'Signed out. Reload the page to sign in again.', error: true });
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
        version.current = ((await res.json()) as Curation).version;
        setMsg({ text: done, error: false });
      } catch {
        setMsg({ text: 'Not saved: the connection dropped. Try that one again.', error: true });
      }
    });
  }

  function cycle(p: AdminPhoto) {
    const next = NEXT[stateOf(p)];
    const o = { ...overrides };
    // Store only departures from the photo's seed, so the photographer's selection stays the baseline.
    if (next === seed(p)) delete o[p.id];
    else o[p.id] = next;
    setOverrides(o);
    setMsg({ text: 'Saving…', error: false });
    save(o, `Photo ${p.n} is now ${next === 'featured' ? 'a favourite' : next}. Saved.`);
  }

  function reset() {
    setOverrides({});
    setMsg({ text: 'Saving…', error: false });
    save({}, "Back to the photographer's selection. Saved.");
  }

  const counts = useMemo(() => {
    const c = { shown: 0, featured: 0, hidden: 0 };
    for (const p of photos) c[stateOf(p)]++;
    return c;
  }, [photos, stateOf]);

  return (
    <div className="admin">
      <header className="a-head">
        <div className="a-row">
          <h1>
            Molly<span className="x">×</span>Paolo · curate
          </h1>
          <Link className="chip" href="/">
            View the gallery
          </Link>
        </div>
        <p>
          Tap a photo to change it: <b>shown</b> → <b>favourite</b> → <b>hidden</b> → back to shown.
          Favourites lead the homepage and are shown large. Hidden photos are taken off the site.
        </p>
        <div className="a-row">
          <div className="filters" role="radiogroup" aria-label="Filter">
            {(['all', 'featured', 'hidden'] as const).map((f) => (
              <button
                key={f}
                className="chip"
                role="radio"
                aria-checked={filter === f}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f === 'featured' ? 'Favourites' : 'Hidden'}
              </button>
            ))}
          </div>
          <div className="legend">
            <span>
              <b>{counts.shown}</b> shown
            </span>
            <span>
              <b>{counts.featured}</b> favourites
            </span>
            <span>
              <b>{counts.hidden}</b> hidden
            </span>
          </div>
        </div>
      </header>

      <div className="a-grid">
        {photos.map((p) => {
          const st = stateOf(p);
          if (filter !== 'all' && st !== filter) return null;
          return (
            <button
              key={p.id}
              className="cell"
              data-state={st}
              style={{ backgroundImage: `url(${p.ph})` }}
              aria-label={`Photo ${p.n}: ${st}`}
              onClick={() => cycle(p)}
            >
              <img loading="lazy" alt="" src={`${mediaBase}colour/w480/${p.id}.webp`} />
              <span className="n">{p.n}</span>
              <span className="badge">{st === 'featured' ? 'Favourite' : 'Hidden'}</span>
            </button>
          );
        })}
      </div>

      <div className="savebar">
        <span className={msg.error ? 'error' : undefined} role="status">
          {msg.text}
        </span>
        <button className="btn ghost" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
