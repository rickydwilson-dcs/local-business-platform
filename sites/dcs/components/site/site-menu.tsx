'use client';

/**
 * `.menu` — the fullscreen overlay nav for the WHOLE site.
 *
 * Ported from `prototype/service-detail.html:65-75`. Carries the six real
 * routes (decision D1) with the current one marked.
 *
 * **It used to serve the inner routes only.** The homepage had its own
 * `components/home/mobile-menu.tsx` holding five in-page anchors, and this
 * file's comment justified the split on the grounds that "the link *kinds*
 * differ". That reasoning died with Ricky's 2026-09-25 ruling — *"menu links
 * should be to the inner pages not anchors"* — so `mobile-menu.tsx` is deleted
 * and `home-body.tsx` renders this component instead. The two were otherwise
 * identical: same `.menu` root, same `hidden` state, same click-to-close, same
 * `.menu__foot`.
 *
 * Keeping one menu is the point, not a tidy-up: for six days after the inner
 * pages shipped, nothing on the homepage linked to any of them, because the
 * homepage's copy of this component was never updated.
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
