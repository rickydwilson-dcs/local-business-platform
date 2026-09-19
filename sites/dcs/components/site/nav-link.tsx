'use client';

/**
 * An internal chrome link that marks itself `aria-current="page"` when the
 * reader is on it.
 *
 * The design styles that state in three places — `.bar nav a[aria-current]`
 * (`inner-pages.css` §26, styled but never rendered; the bar carries no
 * `<nav>`), `.menu__nav a[aria-current] span{color:var(--aqua)}`
 * (§27 / `inner-pages.css:1306`) and `.footmap a[aria-current]`
 * (`inner-pages.css:1650`) — so the attribute has to be real, not decorative.
 *
 * It is a Client Component purely because `usePathname()` is: `page-footer.tsx`
 * and the rest of the chrome stay server-rendered around it.
 *
 * `next/link` emits a plain `<a href>` with no extra attributes, so the
 * rendered markup is identical to the prototype's while keeping client-side
 * navigation. `mailto:`/`tel:`/`#` links are NOT routed through here — they
 * are written as bare `<a>` at their call sites, because `Link` is for routes
 * and the in-page anchors are owned by `home-behaviour.tsx`'s document-level
 * interception.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export interface NavLinkProps {
  href: string;
  children: ReactNode;
  /**
   * When false (the default), a section link is current for its own children
   * too — `/services/web-design` marks "Services" current, which is what the
   * design's breadcrumb + nav pairing assumes. Set true for a link that must
   * only light up on an exact match (e.g. a leaf page listed beside its own
   * section).
   */
  exact?: boolean;
}

export function NavLink({ href, children, exact = false }: NavLinkProps) {
  const pathname = usePathname();
  const current = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link href={href} aria-current={current ? 'page' : undefined}>
      {children}
    </Link>
  );
}
