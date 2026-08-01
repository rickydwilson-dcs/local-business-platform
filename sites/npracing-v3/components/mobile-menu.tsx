'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CloseIcon, MenuIcon } from '@/components/ui/icons';

export interface MobileMenuLink {
  label: string;
  href: string;
}

export interface MobileMenuProps {
  links: MobileMenuLink[];
  shopHref: string;
  shopLabel: string;
}

/**
 * MobileMenu — the only interactive part of the header, isolated into its own
 * client component so the rest of the header stays a server component.
 */
export function MobileMenu({ links, shopHref, shopLabel }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((value) => !value)}
        className="grid h-10 w-10 place-items-center border border-transparent text-surface-foreground hover:border-surface-card-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div
        id="mobile-nav-panel"
        hidden={!open}
        className="absolute left-0 top-full w-full border-b-[3px] border-brand-primary bg-surface-background"
      >
        <ul className="flex flex-col">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block border-b border-surface-subtle px-6 py-4 font-sans text-sm font-semibold uppercase tracking-[0.06em] text-surface-foreground hover:text-brand-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={shopHref}
          onClick={() => setOpen(false)}
          className="block bg-brand-primary px-6 py-4 text-center font-sans text-sm font-bold uppercase tracking-[0.04em] text-on-brand-primary"
        >
          {shopLabel}
        </Link>
      </div>
    </div>
  );
}
