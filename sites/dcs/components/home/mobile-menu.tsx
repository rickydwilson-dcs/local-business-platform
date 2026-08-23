'use client';

import { useHomeBehaviour } from './home-behaviour';
import { CONTACT } from './home-data';

/**
 * The r9 prototype's fullscreen mobile nav overlay — `.menu`.
 *
 * Trap 11 (root CLAUDE.md, and the yolo-brief's Traps section): a
 * `fixed inset-0` overlay must never be nested inside an ancestor carrying
 * `backdrop-filter` or `transform` — the ancestor becomes the containing
 * block and the "fullscreen" overlay gets trapped inside that ancestor's own
 * box instead of the viewport. In the prototype `.menu` is a sibling of
 * `.bar`, not a descendant of `<header>`:
 *
 *   <!-- sibling of the bar, never nested inside it -->
 *   <div class="menu" id="menu" hidden> ... </div>
 *
 * This component's own JSX root IS the `.menu` div — nothing wraps it here.
 * The parent composing `<SiteBar />` and `<MobileMenu />` (Phase 7's
 * furniture wrapper) must render them as siblings, e.g.
 *
 *   <>
 *     <SiteBar />
 *     <MobileMenu />
 *   </>
 *
 * and must not place either inside a wrapper that carries `transform` or
 * `backdrop-filter`. The open/close state lives in `HomeBehaviour`'s context
 * (Phase 6) and drives the `hidden` attribute from React rather than being
 * toggled imperatively; the SSR value is `hidden`, matching the prototype's
 * server-rendered state before any JS runs.
 *
 * Clicking any link inside closes the overlay, exactly as the prototype does
 * (r9-kota-level.html:1178). The scroll to the anchor's target is NOT done
 * here — the document-level interception in `home-behaviour.tsx` owns it for
 * every in-page link on the page, menu or not.
 */

export function MobileMenu() {
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
      <nav className="menu__nav">
        <a href="#work">
          <span>Work</span>
        </a>
        <a href="#services">
          <span>Services</span>
        </a>
        <a href="#pricing">
          <span>Pricing</span>
        </a>
        <a href="#faq">
          <span>Questions</span>
        </a>
        <a href="#end">
          <span>Contact</span>
        </a>
      </nav>
      <div className="menu__foot">
        <a href={CONTACT.mailtoHref}>{CONTACT.email}</a>
        <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
      </div>
    </div>
  );
}
