'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Menu, X, Instagram, Facebook } from 'lucide-react';

/**
 * Mobile navigation for the Grid Box header.
 *
 * Client component (the desktop header stays a Server Component). Handles the
 * open/closed state, closes on Escape, and locks body scroll while open.
 *
 * The open dialog is portaled to `document.body` rather than rendered inline.
 * The header has `backdrop-blur-md` (a `backdrop-filter`), which per spec
 * becomes the containing block for `position: fixed` descendants — an inline
 * `fixed inset-0` dialog would be confined to the header's own small box
 * instead of the viewport, spilling its content over the page beneath it.
 */
export interface SiteNavMobileProps {
  siteName: string;
  navigation: Array<{ label: string; href: string }>;
  primaryCta: { label: string; href: string };
  instagramUrl: string;
  instagramHandle: string;
  facebookUrl: string;
}

export function SiteNavMobile({
  siteName,
  navigation,
  primaryCta,
  instagramUrl,
  instagramHandle,
  facebookUrl,
}: SiteNavMobileProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        className="grid h-10 w-10 place-items-center rounded-full border border-surface-card-border text-surface-foreground transition-colors hover:border-surface-foreground"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Open menu</span>
      </button>

      {open &&
        createPortal(
          <div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label={`${siteName} navigation`}
            className="fixed inset-0 z-50 flex flex-col bg-surface-background"
          >
            <div className="flex items-center justify-between border-b border-surface-card-border px-6 py-4">
              <span className="font-heading text-xl uppercase text-surface-foreground">
                {siteName}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-surface-card-border text-surface-foreground transition-colors hover:border-surface-foreground"
              >
                <X className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-6 py-8">
              <ul className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 font-heading text-3xl uppercase text-surface-foreground transition-colors hover:text-brand-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-4 border-t border-surface-card-border px-6 py-6">
              <Link
                href={primaryCta.href}
                onClick={() => setOpen(false)}
                className="btn-primary w-full"
              >
                {primaryCta.label}
              </Link>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide text-surface-secondary-foreground transition-colors hover:text-brand-accent"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
                {instagramHandle}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide text-surface-secondary-foreground transition-colors hover:text-brand-accent"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
                Facebook
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
