'use client';

/**
 * `.menu` — the fullscreen overlay nav for the inner-page route group.
 *
 * Ported from `prototype/service-detail.html:65-75`. It is the homepage's
 * `components/home/mobile-menu.tsx` carrying the six real routes (decision D1)
 * with the current one marked, instead of the homepage's five in-page anchors.
 * The two are kept as separate components rather than one parameterised
 * component because the link *kinds* differ, not just the labels: the
 * homepage's are `#`-anchors owned by `home-behaviour.tsx`'s document-level
 * scroll interception, and these are routes that must go through `next/link`.
 *
 * ## Trap 11 — `.menu` is a SIBLING of `.bar`, never a descendant
 *
 * A `fixed inset-0` overlay nested inside an ancestor carrying
 * `backdrop-filter` or `transform` is trapped in that ancestor's own box,
 * because either property makes it the containing block for `position: fixed`
 * descendants. The prototype states this in a comment above its own header
 * (`service-detail.html:33-37`) and `site-bar.tsx` carries the matching note.
 *
 * This component's JSX root IS the `.menu` div — nothing wraps it here — and
 * `site-chrome.tsx` composes it as a sibling of `<SiteBar />`. Neither may be
 * put inside a wrapper carrying `transform` or `backdrop-filter`.
 *
 * Open/closed state is `home-behaviour.tsx`'s context, which also owns the
 * body scroll lock, focus handling and Escape-to-close. Clicking any link
 * closes the overlay, exactly as the prototype does
 * (`service-detail.html:427`).
 *
 * Below 1080px the burger is the only way in; per the 2026-09-17 correction
 * recorded in `_chrome.html:69-76` the bar shows the burger at EVERY width and
 * `.bar nav` is `display:none` throughout (`inner-pages.css:1275-1276`), so
 * this overlay is the navigation on desktop too.
 */

import { useHomeBehaviour } from '@/components/home/home-behaviour';
import { CONTACT } from '@/components/home/home-data';
import { NavLink } from '@/components/site/nav-link';
import { PRIMARY_LINKS } from '@/components/site/site-chrome-data';

export function SiteMenu() {
  const { menuOpen, setMenuOpen } = useHomeBehaviour();

  return (
    <div
      className="menu"
      id="menu"
      hidden={!menuOpen}
      onClick={(event) => {
        if ((event.target as Element).closest('a')) setMenuOpen(false);
      }}
    >
      <nav className="menu__nav" aria-label="Primary">
        {PRIMARY_LINKS.map((link) => (
          <NavLink key={link.href} href={link.href}>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="menu__foot">
        <a href={CONTACT.mailtoHref}>{CONTACT.email}</a>
        <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
      </div>
    </div>
  );
}
