'use client';

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
 * `backdrop-filter`. The open/close toggle (`hidden` attribute,
 * `aria-expanded` on the burger) is Phase 6's behaviour-module job — this
 * component only builds the static markup shell, `hidden` by default to
 * match the prototype's server-rendered state before any JS runs.
 */

export function MobileMenu() {
  return (
    <div className="menu" id="menu" hidden>
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
