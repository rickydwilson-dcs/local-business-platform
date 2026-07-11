'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getImageUrl } from '@/lib/image';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Fleet Solutions', href: '/services/fleet-solutions' },
  { label: 'Car Remaps', href: '/car-remaps' },
  { label: 'Locations', href: '/locations' },
  { label: 'Contact', href: '/contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 max-w-full bg-surface-background border-b border-surface-card-border">
      <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
        <Image
          src={getImageUrl('dch-automotive/logo/dch-automotive-logo-2025.webp')}
          alt="DCH Automotive"
          width={174}
          height={90}
          className="h-10 w-auto"
          priority
        />
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={
              isActive(link.href)
                ? 'text-brand-primary font-bold border-b-2 border-brand-primary pb-1 font-heading uppercase tracking-tight'
                : 'text-white/80 font-medium hover:text-white transition-colors font-heading uppercase tracking-tight'
            }
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/contact"
          className="hidden sm:inline-block bg-brand-primary text-brand-on-primary px-5 py-2 font-heading font-extrabold uppercase tracking-tight hover:brightness-110 transition-all active:scale-95"
        >
          Get a Quote
        </Link>
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="md:hidden text-white p-2"
        >
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface-background border-b border-surface-card-border flex flex-col">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={
                isActive(link.href)
                  ? 'px-6 py-4 border-b border-white/5 text-brand-primary font-bold font-heading uppercase tracking-tight'
                  : 'px-6 py-4 border-b border-white/5 text-white/80 font-medium font-heading uppercase tracking-tight'
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="m-4 bg-brand-primary text-brand-on-primary px-5 py-3 text-center font-heading font-extrabold uppercase tracking-tight"
          >
            Get a Quote
          </Link>
        </div>
      )}
    </nav>
  );
}
