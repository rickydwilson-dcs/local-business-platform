export interface LegalTocItem {
  id: string;
  label: string;
}

/**
 * Restyled for the r9 inner-pages port (Phase 3c), from
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/legal.html`
 * (Agent H, `notes-h.md` §2.2/§4).
 *
 * Anatomy is kept intact from the pre-port version deliberately — this is a
 * className swap, not a rewrite: `<nav aria-label>` -> `.legal__rail`,
 * the uppercase "on this page" label -> `.eyeless`, the `<ol>` of
 * `<li><a href="#id">` is unchanged. `.legal__toc a::before` supplies the
 * "1." / "2." ordinal via a CSS counter (`inner-pages.css` ~L4216), so no
 * numbering markup is added here — the numbers cannot drift from the list.
 *
 * STILL NO SCROLL-SPY JS, deliberately. Native `<a href="#id">` anchors plus
 * `scroll-margin-top` on the target heading (`.prose h2[id]`,
 * `inner-pages.css` ~L3727) is the entire navigation mechanism. Agent H
 * measured this from below every one of the 9/6/9 real targets (not just
 * from page load, which is the case that falsely appears to work even when
 * broken) and confirmed every anchor lands the heading clear of the fixed
 * bar — see `notes-h.md` §3.6. The trap that breaks anchor nav is the
 * *target* being sticky and reporting its pinned position; nothing in
 * `.legal__body` is sticky, so the trap does not apply here. The rail
 * itself IS sticky (`.legal__rail{position:sticky}`), which is irrelevant to
 * this question — it is the anchor source, not the anchor target.
 */
export function LegalToc({ items }: { items: LegalTocItem[] }) {
  return (
    <nav className="legal__rail" aria-label="Table of contents">
      <p className="eyeless">On this page</p>
      <ol className="legal__toc">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
