'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { ar, clock } from '@/lib/media';
import { buildRows, tileSizes } from '@/lib/rows';
import { TONES, type GalleryData, type GalleryPhoto, type Tone } from '@/lib/types';
import { Hero } from './hero';
import { Lightbox } from './lightbox';
import { Tile } from './tile';
import { ToneSwitch } from './tone-switch';
import { Tray } from './tray';

const MOBILE = '(max-width: 700px)';

/** null until mounted: the row layout depends on the screen, so rows render client-side only. */
function useMobile(): boolean | null {
  return useSyncExternalStore(
    (cb) => {
      const mq = matchMedia(MOBILE);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => matchMedia(MOBILE).matches,
    () => null
  );
}

function readTone(): Tone {
  const t = document.documentElement.dataset.tone as Tone | undefined;
  return t && TONES.includes(t) ? t : 'colour';
}

export function Gallery({ data }: { data: GalleryData }) {
  const { mediaBase, chapters } = data;
  const mobile = useMobile();
  // The pre-paint script in the layout has already set <html data-tone>; adopt it once mounted.
  const [tone, setToneState] = useState<Tone | null>(null);
  const [picked, setPicked] = useState<Set<string>>(() => new Set());
  const [selecting, setSelecting] = useState(false);
  const [allMode, setAllMode] = useState(false);
  const [lbId, setLbId] = useState<string | null>(null);
  const [solid, setSolid] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => setToneState(readTone()), []);

  /** The lightbox order and the "download all" set: chapters top to bottom. */
  const order = useMemo(() => chapters.flatMap((c) => c.photos), [chapters]);
  const byId = useMemo(() => new Map(order.map((p) => [p.id, p])), [order]);
  const heroPhotos = useMemo(
    () => data.hero.map((id) => byId.get(id)).filter((p): p is GalleryPhoto => !!p),
    [data.hero, byId]
  );
  const favourites = useMemo(() => order.filter((p) => p.featured), [order]);
  const titles = useMemo(() => new Map(chapters.map((c) => [c.id, c.title])), [chapters]);

  const setTone = useCallback((t: Tone) => {
    setToneState(t);
    document.documentElement.dataset.tone = t;
    try {
      localStorage.setItem('mxp-tone', t);
    } catch {}
    const params = new URLSearchParams(location.search);
    params.set('tone', t);
    history.replaceState(null, '', `${location.pathname}?${params}${location.hash}`);
  }, []);

  const togglePick = useCallback(
    (id: string) => {
      setPicked((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      if (!lbId) setSelecting(true);
    },
    [lbId]
  );

  const activate = useCallback(
    (id: string) => (selecting ? togglePick(id) : setLbId(id)),
    [selecting, togglePick]
  );

  const closeLightbox = useCallback(
    (id: string) => {
      setLbId(null);
      // Photos picked inside the viewer open the tray once it closes.
      if (picked.size) setSelecting(true);
      setTimeout(() => {
        const t = [
          ...document.querySelectorAll<HTMLElement>(`#chapters .tile[data-id="${id}"]`),
        ].find((el) => el.offsetParent !== null);
        if (t) {
          t.scrollIntoView({ block: 'center' });
          t.focus({ preventScroll: true });
        }
      }, 0);
    },
    [picked.size]
  );

  const targets = useMemo(
    () => (allMode ? order : order.filter((p) => picked.has(p.id))),
    [allMode, order, picked]
  );
  const trayOpen = (allMode || selecting) && !lbId;

  // Body classes drive select-mode and tray styling, as in the prototype's stylesheet.
  useEffect(() => {
    document.body.classList.toggle('selecting', selecting);
    document.body.classList.toggle('tray-open', trayOpen);
  }, [selecting, trayOpen]);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting), {
      rootMargin: '-64px 0px 0px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const openAll = () => setAllMode(true);
  const clear = () => {
    setPicked(new Set());
    setAllMode(false);
    setSelecting(false);
  };

  const film = (
    <section className="film" id="film" aria-labelledby="filmTitle">
      <p className="section-label" id="filmTitle">
        The film
      </p>
      <div className="film-frame">
        <video
          controls
          playsInline
          preload="none"
          poster={`${mediaBase}video/poster.jpg`}
          src={`${mediaBase}video/mollyxpaolo-wedding-1080p.mp4`}
        />
      </div>
      <div className="film-meta">
        <span>The ceremony · 8 min 43 s</span>
        <a href={`${mediaBase}video/mollyxpaolo-wedding-1080p.mp4`} download>
          Download the film (248 MB)
        </a>
      </div>
    </section>
  );

  return (
    <>
      <header className={`site-head${solid ? ' solid' : ''}`}>
        <a className="mark" href="#top" aria-label="Molly and Paolo, back to top">
          Molly<span className="x">×</span>Paolo
        </a>
        <div className="head-actions">
          <button
            className="chip"
            aria-pressed={selecting}
            onClick={() => {
              setAllMode(false);
              setSelecting((s) => !s);
            }}
          >
            {selecting ? 'Done' : 'Select'}
          </button>
          <button className="chip wide" onClick={openAll}>
            Download all
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" ref={heroRef} aria-label="Molly and Paolo">
          {tone && (
            <Hero photos={heroPhotos} lead={data.heroLead} tone={tone} mediaBase={mediaBase} />
          )}
          <div className="hero-copy">
            <p className="hero-kicker">The wedding of</p>
            <h1>
              Molly<span className="x">×</span>Paolo
            </h1>
            <p className="hero-sub">
              Las Vegas, Nevada · 22 September 2026
              <span className="hero-vibe only only-colour">
                Neon, chrome and the Strip after dark.
              </span>
              <span className="hero-vibe only only-bw">
                The Rat Pack years, in silver and shadow.
              </span>
              <span className="hero-vibe only only-sepia">
                Red Rock country · 36.17° N, 115.14° W
              </span>
            </p>
          </div>
          <a className="scroll-cue" href="#intro">
            Scroll
          </a>
        </section>

        <div className="wrap">
          <section className="intro" id="intro">
            <p>
              One afternoon in Las Vegas, told in {chapters.length === 4 ? 'four' : chapters.length}{' '}
              chapters. Tap any photo to open it, swipe through, and keep the ones you love.
            </p>
            <ul className="chapter-nav">
              {chapters.map((c) => (
                <li key={c.id}>
                  <a href={`#ch-${c.id}`}>
                    {c.title}
                    <span>{c.photos.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {favourites.length > 0 && (
          <section className="favourites" aria-labelledby="favLabel">
            <div className="wrap">
              <p className="section-label" id="favLabel">
                Molly &amp; Paolo&apos;s favourites
              </p>
            </div>
            <div className="ribbon">
              {tone &&
                favourites.map((p) => (
                  <Tile
                    key={p.id}
                    photo={p}
                    tone={tone}
                    mediaBase={mediaBase}
                    sizes={`calc(52vh * ${ar(p).toFixed(3)})`}
                    picked={picked.has(p.id)}
                    fav={false}
                    onActivate={activate}
                  />
                ))}
            </div>
          </section>
        )}

        <div className="wrap" id="chapters">
          {chapters.map((c, ci) => {
            const times = c.photos.map((p) => p.t).filter(Boolean) as string[];
            const span = times.length
              ? `${clock(times[0])} – ${clock(times[times.length - 1])}`
              : '';
            return (
              <Fragment key={c.id}>
                <section className="chapter" id={`ch-${c.id}`}>
                  <header className="chapter-head">
                    <div className="chapter-kicker">
                      <span>{c.kicker}</span>
                      <span className="time">{span}</span>
                      <span>{c.photos.length} photos</span>
                    </div>
                    <h2>{c.title}</h2>
                    <p className="chapter-blurb">{c.blurb}</p>
                  </header>
                  <div className="rows">
                    {tone &&
                      buildRows(c.photos, mobile === true).map((r) => {
                        const sum = r.items.reduce((s, p) => s + ar(p), 0);
                        const cls = [
                          'row',
                          r.type === 'row' ? '' : r.type,
                          r.indent ?? '',
                          r.flip ? 'flip' : '',
                        ]
                          .filter(Boolean)
                          .join(' ');
                        const p0 = r.items[0];
                        return (
                          <div
                            key={r.items[0].id}
                            className={cls}
                            // Row geometry feeds the height cap in globals.css (.row max-width).
                            style={
                              {
                                '--sum': sum.toFixed(4),
                                '--n': r.items.length,
                              } as React.CSSProperties
                            }
                          >
                            {r.items.map((p) => (
                              <Tile
                                key={p.id}
                                photo={p}
                                tone={tone}
                                mediaBase={mediaBase}
                                sizes={tileSizes(r, p, mobile === true)}
                                picked={picked.has(p.id)}
                                onActivate={activate}
                              />
                            ))}
                            {r.type === 'inset' && (
                              <div className="inset-note">
                                {p0.featured ? (
                                  <>
                                    <span>A favourite</span>
                                    <strong>{clock(p0.t) || 'Las Vegas'}</strong>
                                    <span>Photograph {p0.n}</span>
                                  </>
                                ) : (
                                  <>
                                    <strong>{clock(p0.t)}</strong>
                                    <span>Photograph {p0.n}</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </section>
                {/* The film belongs to the ceremony, so it sits straight after the first chapter. */}
                {ci === 0 && film}
              </Fragment>
            );
          })}
        </div>

        <div className="wrap">
          <footer className="foot">
            <p className="big">
              Molly<span className="x"> × </span>Paolo
            </p>
            <p>22 · 09 · 2026 · Las Vegas, Nevada</p>
            <p>Photographs and film by Vegas Weddings</p>
            <button className="chip" onClick={openAll}>
              Download all photos
            </button>
          </footer>
        </div>
      </main>

      {tone && !lbId && <ToneSwitch tone={tone} onChange={setTone} />}

      {tone && (
        <Tray
          targets={targets}
          allMode={allMode}
          tone={tone}
          mediaBase={mediaBase}
          onClear={clear}
        />
      )}

      {tone && lbId && (
        <Lightbox
          order={order}
          startId={lbId}
          tone={tone}
          mediaBase={mediaBase}
          chapterTitle={(id) => titles.get(id) ?? ''}
          isPicked={(id) => picked.has(id)}
          onTogglePick={togglePick}
          onClose={closeLightbox}
          toneSwitch={<ToneSwitch tone={tone} onChange={setTone} />}
        />
      )}
    </>
  );
}
