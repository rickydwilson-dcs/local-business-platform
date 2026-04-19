"use client";

import { useState } from "react";

export interface NavigationLogoLinksProps {
  logoText?: string;
  navLinks?: Array<{ label: string; href: string }>;
  ctaLabel?: string;
  ctaHref?: string;
}

export function NavigationLogoLinks({
  logoText = "NaváGarden",
  navLinks = [
    { label: "A ház", href: "#ahaz" },
    { label: "Galéria", href: "#galeria" },
    { label: "Szolgáltatások", href: "#szolgaltatasok" },
    { label: "Kapcsolat", href: "#kapcsolat" },
  ],
  ctaLabel = "Foglalás",
  ctaHref = "#foglalas",
}: NavigationLogoLinksProps) {
  const [_menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface-background border-b border-surface-muted backdrop-blur-sm">
      <div className="container-standard mx-auto flex items-center justify-between px-6 py-4 lg:px-12">
        {/* Logo — using the serif heading font for brand personality */}
        <a
          href="/"
          className="text-h4 font-bold tracking-tight text-brand-secondary min-w-0"
          style={{ fontFamily: "Audrey, Georgia, serif" }}
        >
          {logoText}
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 min-w-0">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-small font-medium tracking-wide uppercase text-surface-foreground hover:text-brand-primary transition-colors duration-300"
              style={{ fontFamily: "Work Sans, system-ui, sans-serif", letterSpacing: "0.08em" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <a
          href={ctaHref}
          className="btn-primary bg-brand-primary text-on-brand-primary px-6 py-2.5 text-small font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity duration-300"
          style={{ fontFamily: "Work Sans, system-ui, sans-serif" }}
        >
          {ctaLabel}
        </a>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-surface-foreground"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-px bg-current mb-1" />
          <span className="block w-5 h-px bg-current mb-1" />
          <span className="block w-5 h-px bg-current" />
        </button>
      </div>
    </header>
  );
}
