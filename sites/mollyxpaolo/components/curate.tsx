'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { mediaUrl } from '@/lib/media';
import type { Chapter, Curation, GalleryPhoto, PhotoState } from '@/lib/types';
import { Lightbox } from './lightbox';

type Filter = 'all' | PhotoState;
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'featured', label: 'Favourites' },
  { id: 'shown', label: 'Regular' },
  { id: 'hidden', label: 'Hidden' },
];
const LABEL: Record<PhotoState, string> = {
  featured: 'favourite',
  shown: 'regular',
  hidden: 'hidden',
};
const UNDO_MS = 8000;
const RESET_MS = 5000;
const POLL_MS = 30000;
/** A chapter gets a gentle note past about one favourite in six photos. Never a limit. */
const FAV_SHARE = 1 / 6;

interface Toast {
  id: string;
  n: number;
  from: PhotoState;
  to: PhotoState;
}

/**
 * The couple's curation screen. Every photo is a favourite, regular or hidden; a change saves
 * straight away as a one-photo patch the server merges, so Molly and Paolo can both curate at
 * once. `photos[].featured` is each photo's seed (the photographer's selection).
 */
export function Curate(props: {
  photos: GalleryPhoto[];
  chapters: Chapter[];
  initial: Curation;
  mediaBase: string;
}) {
  const { photos, chapters, mediaBase } = props;
  const [server, setServer] = useState(props.initial);
  /** Changes sent but not yet confirmed, by photo. `seq` tells a newer change from an older one. */
  const [pending, setPending] = useState<Record<string, { to: PhotoState; seq: number }>>({});
  /** Changes the server refused or never got; the photo shows its saved state plus a retry. */
  const [failed, setFailed] = useState<Record<string, PhotoState>>({});
  const [filter, setFilter] = useState<Filter>('all');
  const [toast, setToast] = useState<Toast | null>(null);
  const [armed, setArmed] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null);
  const [review, setReview] = useState<{ order: GalleryPhoto[]; startId: string } | null>(null);
  const seq = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const stateOf = useCallback(
    (p: GalleryPhoto): PhotoState =>
      pending[p.id]?.to ?? server.photos[p.id] ?? (p.featured ? 'featured' : 'shown'),
    [pending, server]
  );

  /** Responses can arrive out of order; never step back to an older state than one already seen. */
  const accept = useCallback((next: Curation) => {
    setServer((prev) => (next.version >= prev.version ? next : prev));
  }, []);

  const change = useCallback(
    async (p: GalleryPhoto, to: PhotoState, undoable = true) => {
      const from = stateOf(p);
      if (from === to && !failed[p.id]) return;
      const mine = ++seq.current;
      const settle = () =>
        setPending((all) => {
          if (all[p.id]?.seq !== mine) return all;
          const rest = { ...all };
          delete rest[p.id];
          return rest;
        });
      setPending((all) => ({ ...all, [p.id]: { to, seq: mine } }));
      setFailed(({ [p.id]: _, ...rest }) => rest);
      if (undoable && from !== to) {
        clearTimeout(toastTimer.current);
        setToast({ id: p.id, n: p.n, from, to });
        toastTimer.current = setTimeout(() => setToast(null), UNDO_MS);
      }
      try {
        const res = await fetch('/api/admin/curation', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ changes: { [p.id]: to } }),
        });
        if (res.status === 401) {
          setNotice({ text: 'Signed out. Reload the page to sign in again.', error: true });
          throw new Error('401');
        }
        if (!res.ok) throw new Error(String(res.status));
        accept((await res.json()) as Curation);
        settle();
      } catch {
        settle();
        setFailed((all) => ({ ...all, [p.id]: to }));
      }
    },
    [accept, failed, stateOf]
  );

  // A partner's changes arrive without a reload: on focus, and every 30s while the tab is visible.
  useEffect(() => {
    const refresh = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const res = await fetch('/api/admin/curation', { cache: 'no-store' });
        if (res.ok) accept((await res.json()) as Curation);
      } catch {}
    };
    const timer = setInterval(refresh, POLL_MS);
    addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearInterval(timer);
      removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [accept]);

  useEffect(
    () => () => {
      clearTimeout(toastTimer.current);
      clearTimeout(resetTimer.current);
    },
    []
  );

  /** Two taps, no confirm(): the first arms it for five seconds. */
  async function reset() {
    if (!armed) {
      setArmed(true);
      resetTimer.current = setTimeout(() => setArmed(false), RESET_MS);
      return;
    }
    clearTimeout(resetTimer.current);
    setArmed(false);
    setNotice({ text: 'Resetting…', error: false });
    try {
      const res = await fetch('/api/admin/curation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseVersion: server.version, photos: {} }),
      });
      if (res.status === 409) {
        const now = await fetch('/api/admin/curation', { cache: 'no-store' });
        if (now.ok) accept((await now.json()) as Curation);
        setNotice({
          text: 'Something changed just now, so nothing was reset. Check, then reset again.',
          error: true,
        });
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      accept((await res.json()) as Curation);
      setPending({});
      setFailed({});
      setToast(null);
      setNotice({ text: "Back to the photographer's selection.", error: false });
    } catch {
      setNotice({ text: 'Not reset: the connection dropped. Try again.', error: true });
    }
  }

  const groups = useMemo(
    () =>
      chapters
        .map((c) => {
          const list = photos.filter((p) => p.chapter === c.id);
          const n = { featured: 0, shown: 0, hidden: 0 };
          for (const p of list) n[stateOf(p)]++;
          return { ...c, list, n };
        })
        .filter((c) => c.list.length),
    [chapters, photos, stateOf]
  );
  const totals = useMemo(() => {
    const n = { all: photos.length, featured: 0, shown: 0, hidden: 0 };
    for (const p of photos) n[stateOf(p)]++;
    return n;
  }, [photos, stateOf]);
  const titles = useMemo(() => new Map(chapters.map((c) => [c.id, c.title])), [chapters]);
  const saving = Object.keys(pending).length;
  const unsaved = Object.keys(failed).length;

  const open = (p: GalleryPhoto) => {
    // The order is fixed when the viewer opens, so changing a photo under a filter doesn't move
    // the viewer off it.
    const order = groups.flatMap((g) =>
      g.list.filter((q) => filter === 'all' || stateOf(q) === filter)
    );
    setReview({ order, startId: p.id });
  };

  const closeReview = useCallback((id: string) => {
    setReview(null);
    setTimeout(() => {
      const el = document.querySelector<HTMLElement>(`.cell[data-id="${id}"] .cell-open`);
      el?.scrollIntoView({ block: 'center' });
      el?.focus({ preventScroll: true });
    }, 0);
  }, []);

  const status = notice
    ? notice
    : unsaved
      ? {
          text: `${unsaved} not saved. Tap ${unsaved === 1 ? 'it' : 'them'} to retry.`,
          error: true,
        }
      : saving
        ? { text: 'Saving…', error: false }
        : { text: 'All changes saved.', error: false };

  return (
    <div className="admin">
      <header className="a-head">
        <div className="a-row">
          <h1>
            Molly<span className="x">×</span>Paolo · curate
          </h1>
          <a className="chip" href="/" target="_blank" rel="noopener">
            View the gallery
          </a>
        </div>
        <p>
          Tap a photo to see it full size, then choose <b>★ Favourite</b>, <b>Regular</b> or{' '}
          <b>Hide</b>. Favourites are shown larger, and the earliest one opens its chapter. Hidden
          photos are taken off the site. Changes save straight away.
        </p>
        <div className="a-row">
          <div className="filters" role="radiogroup" aria-label="Show">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className="chip"
                role="radio"
                aria-checked={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label} <span className="count">{totals[f.id]}</span>
              </button>
            ))}
          </div>
        </div>
        <nav className="a-jump" aria-label="Chapters">
          {groups.map((g) => (
            <a key={g.id} href={`#c-${g.id}`}>
              {g.title}
            </a>
          ))}
        </nav>
      </header>

      {groups.map((g) => {
        const shown = g.list.filter((p) => filter === 'all' || stateOf(p) === filter);
        if (!shown.length) return null;
        const visible = g.list.length - g.n.hidden;
        return (
          <section key={g.id} className="a-chapter" id={`c-${g.id}`}>
            <header>
              <h2>{g.title}</h2>
              <p>
                {g.list.length} · {g.n.featured} {g.n.featured === 1 ? 'favourite' : 'favourites'} ·{' '}
                {g.n.hidden} hidden
              </p>
              {g.n.featured > visible * FAV_SHARE && (
                <p className="a-note">Lots of favourites here, so they&apos;ll stand out less.</p>
              )}
            </header>
            <div className="a-grid">
              {shown.map((p) => {
                const st = stateOf(p);
                const retry = failed[p.id];
                return (
                  <div
                    key={p.id}
                    className="cell"
                    data-id={p.id}
                    data-state={st}
                    data-pending={pending[p.id] ? '' : undefined}
                    style={{ backgroundImage: `url(${p.ph.colour})` }}
                  >
                    <button
                      className="cell-open"
                      aria-label={`Photo ${p.n}, ${LABEL[st]}. Open to review`}
                      onClick={() => open(p)}
                    >
                      <img loading="lazy" alt="" src={mediaUrl(mediaBase, p, 'colour', 'w480')} />
                      <span className="n">{p.n}</span>
                      {st === 'featured' && <span className="badge">★ Favourite</span>}
                      {st === 'hidden' && <span className="badge">Hidden</span>}
                    </button>
                    {pending[p.id] && <span className="saving" role="status" aria-label="Saving" />}
                    {/* Single-click changes on a mouse; hidden on touch, where the viewer is the way in. */}
                    <div className="quick">
                      <button
                        aria-label={st === 'featured' ? 'Make regular' : 'Make favourite'}
                        aria-pressed={st === 'featured'}
                        onClick={() => change(p, st === 'featured' ? 'shown' : 'featured')}
                      >
                        ★
                      </button>
                      <button
                        aria-label={st === 'hidden' ? 'Show on the site' : 'Hide'}
                        aria-pressed={st === 'hidden'}
                        onClick={() => change(p, st === 'hidden' ? 'shown' : 'hidden')}
                      >
                        {st === 'hidden' ? 'Show' : 'Hide'}
                      </button>
                    </div>
                    {retry && (
                      <button className="cell-failed" onClick={() => change(p, retry, false)}>
                        Not saved: tap to retry
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className={`a-toast${toast ? ' on' : ''}${review ? ' over-review' : ''}`} role="status">
        {toast && (
          <>
            <span>
              Photo {toast.n}{' '}
              {toast.to === 'hidden'
                ? 'hidden'
                : toast.to === 'featured'
                  ? 'is now a favourite'
                  : 'is now regular'}
            </span>
            <button
              className="btn ghost"
              onClick={() => {
                const p = photos.find((q) => q.id === toast.id);
                clearTimeout(toastTimer.current);
                setToast(null);
                if (p) change(p, toast.from, false);
              }}
            >
              Undo
            </button>
          </>
        )}
      </div>

      <div className="savebar">
        <span className={status.error ? 'error' : undefined} role="status">
          {status.text}
        </span>
        <button className={`btn ghost${armed ? ' armed' : ''}`} onClick={reset}>
          {armed ? 'Tap again to reset everything' : 'Reset'}
        </button>
      </div>

      {review && (
        <Lightbox
          order={review.order}
          startId={review.startId}
          tone="colour"
          mediaBase={mediaBase}
          chapterTitle={(id) => titles.get(id) ?? ''}
          onClose={closeReview}
          footer={(p) => {
            const st = stateOf(p);
            return (
              <div className="review-bar" role="group" aria-label={`Photo ${p.n}`}>
                {(
                  [
                    ['featured', '★ Favourite'],
                    ['shown', 'Regular'],
                    ['hidden', 'Hide'],
                  ] as const
                ).map(([s, label]) => (
                  <button
                    key={s}
                    aria-pressed={st === s}
                    data-state={s}
                    onClick={() => change(p, s)}
                  >
                    {label}
                  </button>
                ))}
                {failed[p.id] && (
                  <button className="retry" onClick={() => change(p, failed[p.id], false)}>
                    Not saved: retry
                  </button>
                )}
              </div>
            );
          }}
        />
      )}
    </div>
  );
}
