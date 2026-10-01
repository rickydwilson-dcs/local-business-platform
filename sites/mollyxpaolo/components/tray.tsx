'use client';

import { useEffect, useState } from 'react';
import { AVG_MB, TONE_FILE, downloadName, mediaUrl, type DownloadSize } from '@/lib/media';
import type { GalleryPhoto, Tone } from '@/lib/types';

/** Phones hand at most this many files to the share sheet; larger sets go into a zip. */
const SHARE_MAX = 40;

type SaveFilePicker = (opts: {
  suggestedName: string;
  types: { description: string; accept: Record<string, string[]> }[];
}) => Promise<{ createWritable(): Promise<WritableStream> }>;

/**
 * Selection tray and bulk downloads.
 *
 * - Phones (coarse pointer, Web Share with files, ≤40 photos): fetch the files, then hand them to
 *   the share sheet ("Save N Images" on iOS). Two taps, because the share sheet needs a fresh tap
 *   and the fetch uses the first one up.
 * - Otherwise a zip built in the browser, so it always reflects the current curation. Chromium
 *   streams it straight to disk via showSaveFilePicker (memory stays flat even for the ~1.6GB
 *   full-size set); other browsers build it in memory.
 *
 * Fetching from R2 needs the bucket's CORS policy to list this site's origin.
 */
export function Tray(props: {
  targets: GalleryPhoto[];
  allMode: boolean;
  tone: Tone;
  mediaBase: string;
  onClear: () => void;
}) {
  const { targets, allMode, tone, mediaBase } = props;
  const [size, setSize] = useState<DownloadSize>('4k');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [shareReady, setShareReady] = useState<File[] | null>(null);

  // Prepared files go stale when the selection, size or tone changes.
  useEffect(() => setShareReady(null), [targets, size, tone]);

  const mb = targets.length * AVG_MB[size][tone];
  const est = mb > 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
  const label = allMode
    ? `All ${targets.length} photos`
    : targets.length
      ? `${targets.length} selected`
      : 'Tap photos to select';

  async function fetchPhoto(p: GalleryPhoto) {
    const r = await fetch(mediaUrl(mediaBase, p, tone, size), { mode: 'cors' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r;
  }

  async function prepareShare(list: GalleryPhoto[]): Promise<boolean> {
    const files: File[] = [];
    for (const [i, p] of list.entries()) {
      setStatus(`Preparing ${i + 1} of ${list.length}…`);
      setProgress(i / list.length);
      const r = await fetchPhoto(p);
      files.push(new File([await r.blob()], downloadName(p, tone, size), { type: 'image/jpeg' }));
    }
    setProgress(null);
    if (!navigator.canShare || !navigator.canShare({ files })) return false;
    setShareReady(files);
    setStatus('Ready. Tap "Save to Photos".');
    return true;
  }

  async function zipDownload(list: GalleryPhoto[]) {
    const zipName = `MollyxPaolo-${TONE_FILE[tone]}-${size === '4k' ? '4K' : 'full'}-${list.length}.zip`;
    // Ask where to save first: the picker needs the original click, before any other await.
    let writable: WritableStream | null = null;
    const picker = (window as unknown as { showSaveFilePicker?: SaveFilePicker })
      .showSaveFilePicker;
    if (picker) {
      try {
        const h = await picker({
          suggestedName: zipName,
          types: [{ description: 'Zip', accept: { 'application/zip': ['.zip'] } }],
        });
        writable = await h.createWritable();
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
      }
    }
    const { downloadZip } = await import('client-zip');
    let done = 0;
    async function* files() {
      for (const p of list) {
        setStatus(`Adding ${done + 1} of ${list.length}…`);
        yield { name: downloadName(p, tone, size), input: await fetchPhoto(p) };
        setProgress(++done / list.length);
      }
    }
    const zip = downloadZip(files());
    if (writable) {
      await zip.body!.pipeTo(writable);
    } else {
      const blob = await zip.blob();
      const a = Object.assign(document.createElement('a'), {
        href: URL.createObjectURL(blob),
        download: zipName,
      });
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 60_000);
    }
    setProgress(null);
    setStatus(`Saved ${zipName}`);
  }

  async function go() {
    const list = targets;
    if (!list.length) return;
    try {
      if (shareReady) {
        await navigator.share({ files: shareReady });
        setShareReady(null);
        setStatus('');
        return;
      }
      setBusy(true);
      const coarse = matchMedia('(pointer: coarse)').matches;
      if (coarse && 'canShare' in navigator && list.length <= SHARE_MAX) {
        if (await prepareShare(list)) return;
      }
      await zipDownload(list);
    } catch (e) {
      setProgress(null);
      if ((e as Error).name === 'AbortError') return setStatus('');
      setStatus(
        e instanceof TypeError
          ? "The photos couldn't be fetched. Check your connection and try again."
          : `Something went wrong: ${(e as Error).message}`
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="tray" role="region" aria-label="Selected photos">
      <div className="count">
        {label}
        <small>
          {targets.length
            ? `${TONE_FILE[tone].replace(/-/g, ' ')} · about ${est}`
            : 'Then download them together'}
        </small>
      </div>
      <div className="seg" role="radiogroup" aria-label="Download size">
        {(['4k', 'original'] as const).map((s) => (
          <button key={s} role="radio" aria-checked={size === s} onClick={() => setSize(s)}>
            {s === '4k' ? '4K' : 'Full size'}
          </button>
        ))}
      </div>
      <button
        className="btn ghost"
        onClick={() => {
          setStatus('');
          setShareReady(null);
          props.onClear();
        }}
      >
        Clear
      </button>
      <button className="btn" disabled={busy || !targets.length} onClick={go}>
        {shareReady ? 'Save to Photos' : 'Download'}
      </button>
      <div className={`bar${progress !== null ? ' on' : ''}`}>
        <i style={{ width: `${(progress ?? 0) * 100}%` }} />
      </div>
      <p className="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
