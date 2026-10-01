/**
 * The mixed editorial layout (ported unchanged from the prototype's buildRows).
 *
 * A row is a flex line where every tile's flex-grow is its aspect ratio, so mixed shapes share
 * one height. Variety comes from how many tiles a row holds, indented rows, full-bleed singles
 * and insets with a caption beside them. Favourites always get a row of their own.
 */
import { ar } from './media';
import type { GalleryPhoto } from './types';

export interface Row {
  type: 'row' | 'full' | 'inset';
  items: GalleryPhoto[];
  indent?: '' | 'indent-l' | 'indent-r' | 'stagger-l' | 'stagger-r';
  flip?: boolean;
}

export function buildRows(list: GalleryPhoto[], mobile: boolean): Row[] {
  const rows: Row[] = [];
  const patterns = mobile
    ? ['pair', 'solo', 'pair', 'pair', 'solo']
    : ['pair', 'trio', 'solo', 'pair', 'trio', 'pair', 'inset'];
  const maxSum = mobile ? 2.3 : 4.3;
  let i = 0;
  let k = 0;
  let flip = false;
  let pairs = 0;
  while (i < list.length) {
    const p = list[i];
    if (p.featured) {
      rows.push(
        ar(p) > 1.2 || mobile
          ? { type: 'full', items: [p] }
          : { type: 'inset', items: [p], flip: (flip = !flip) }
      );
      i++;
      continue;
    }
    const pat = patterns[k++ % patterns.length];
    if (pat === 'solo' || pat === 'inset') {
      if (ar(p) > 1.2)
        rows.push({ type: pat === 'solo' ? 'full' : 'inset', items: [p], flip: (flip = !flip) });
      else rows.push({ type: mobile ? 'row' : 'inset', items: [p], flip: (flip = !flip) });
      i++;
      continue;
    }
    // Two landscapes side by side are too small on a phone; stagger them instead, one pushed
    // left and one pushed right, so a run of landscapes doesn't become a plain stack.
    const q = list[i + 1];
    if (mobile && pat === 'pair' && ar(p) > 1.2 && q && !q.featured && ar(q) > 1.2) {
      rows.push(
        { type: 'row', items: [p], indent: 'stagger-l' },
        { type: 'row', items: [q], indent: 'stagger-r' }
      );
      i += 2;
      continue;
    }
    const want = pat === 'trio' ? 3 : 2;
    const items: GalleryPhoto[] = [];
    let sum = 0;
    while (items.length < want && i < list.length && !list[i].featured) {
      const a = ar(list[i]);
      if (items.length && sum + a > maxSum) break;
      items.push(list[i]);
      sum += a;
      i++;
    }
    // A single landscape left over on a phone reads best edge to edge.
    if (items.length === 1 && mobile && ar(items[0]) > 1.2) {
      rows.push({ type: 'full', items });
      continue;
    }
    const indent = !mobile && items.length === 2 ? (pairs++ % 2 ? 'indent-r' : 'indent-l') : '';
    rows.push({ type: 'row', items, indent: pairs % 3 === 0 ? '' : indent });
  }
  return rows;
}

/** The `sizes` attribute for a tile in a row, matching the CSS widths. */
export function tileSizes(row: Row, p: GalleryPhoto, mobile: boolean): string {
  if (row.type === 'full') return '100vw';
  if (row.type === 'inset') return mobile ? '100vw' : '58vw';
  if (row.indent?.startsWith('stagger')) return '80vw';
  const sum = row.items.reduce((s, x) => s + ar(x), 0);
  return `${Math.ceil((ar(p) / sum) * (mobile ? 100 : 92))}vw`;
}
