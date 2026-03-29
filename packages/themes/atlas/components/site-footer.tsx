"use client";

/**
 * SiteFooter
 *
 * Site-wide footer with navigation links grouped by category, logo, social icons, and copyright, present on every page
 * Layout: Dark purple background; four-column link groups (Events, Support, Legal, Company) with logo, social icons, and copyright
 * Category: Footer
 */

import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface SiteFooterProps {
  /** events-links */
  eventsLinks?: Array<{ label?: string; href?: string }>;
  /** support-links */
  supportLinks?: Array<{ label?: string; href?: string }>;
  /** legal-links */
  legalLinks?: Array<{ label?: string; href?: string }>;
  /** company-links */
  companyLinks?: Array<{ label?: string; href?: string }>;
  /** footer-logo */
  footerLogo?: string;
  /** social-icons */
  socialIcons?: Array<{ label?: string; href?: string; icon?: React.ReactNode }>;
  /** copyright */
  copyright?: string;
  /** copyright-text (alias) */
  copyrightText?: string;
}

const defaultEventsLinks = [
  { label: 'Upcoming Events', href: '/' },
  { label: 'Get Tickets', href: '/contact' },
  { label: 'Speakers', href: '/about' },
];

const defaultSupportLinks = [
  { label: 'FAQ', href: '/contact' },
  { label: 'Contact Us', href: '/contact' },
];

const defaultLegalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

const defaultCompanyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
];

export function SiteFooter(props: SiteFooterProps) {
  const eventsLinks = props.eventsLinks ?? defaultEventsLinks;
  const supportLinks = props.supportLinks ?? defaultSupportLinks;
  const legalLinks = props.legalLinks ?? defaultLegalLinks;
  const companyLinks = props.companyLinks ?? defaultCompanyLinks;
  const copyrightText = props.copyright ?? props.copyrightText ?? `\u00A9 ${new Date().getFullYear()} All rights reserved.`;

  return (
    <footer className="bg-brand-primary text-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Events Links */}
            <div className="flex flex-col gap-3">
              <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-2">
                Events
              </h3>
              <nav aria-label="Events navigation">
                <ul className="flex flex-col gap-2">
                  {eventsLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-surface-muted-foreground hover:text-brand-accent text-sm transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Support Links */}
            <div className="flex flex-col gap-3">
              <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-2">
                Support
              </h3>
              <nav aria-label="Support navigation">
                <ul className="flex flex-col gap-2">
                  {supportLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-surface-muted-foreground hover:text-brand-accent text-sm transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col gap-3">
              <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-2">
                Legal
              </h3>
              <nav aria-label="Legal navigation">
                <ul className="flex flex-col gap-2">
                  {legalLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-surface-muted-foreground hover:text-brand-accent text-sm transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Company Links */}
            <div className="flex flex-col gap-3">
              <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-2">
                Company
              </h3>
              <nav aria-label="Company navigation">
                <ul className="flex flex-col gap-2">
                  {companyLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-surface-muted-foreground hover:text-brand-accent text-sm transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </RevealOnScroll>

        {/* Divider */}
        <div className="border-t border-surface-muted pt-8">
          <p className="text-surface-muted-foreground text-sm text-center md:text-left">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
