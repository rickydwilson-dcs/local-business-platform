/**
 * RigelContactPage — Contact page template
 *
 * Displays contact form alongside event information sidebar.
 * Address and email are passed via siteConfig.
 */

import Link from "next/link";
import { Breadcrumbs, ContactForm } from "@platform/core-components";
import type { RigelContactPageTemplateProps, BreadcrumbItem } from "@platform/core-components";

export interface RigelContactPageProps extends RigelContactPageTemplateProps {
  breadcrumbs?: BreadcrumbItem[];
  eventDate?: string;
  email?: string;
}

export function RigelContactPage({
  siteConfig,
  breadcrumbs,
  eventDate = "Saturday & Sunday, 17–18 October 2026",
  email,
}: RigelContactPageProps) {
  const crumbs: BreadcrumbItem[] = breadcrumbs ?? [
    { name: "Contact", href: "/contact", current: true },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={crumbs} />
        </div>
      </div>

      <div className="min-h-screen bg-surface-background">
        {/* Hero Section */}
        <section className="section-standard bg-brand-primary">
          <div className="container-standard text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
              Questions about the event, sponsorship opportunities, or speaking — we&apos;d love to
              hear from you.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-standard">
          <div className="container-standard">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <ContactForm services={[]} serviceAreas={[]} />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Event Information */}
                <div className="bg-surface-subtle rounded-lg p-6">
                  <h2 className="text-xl font-bold text-surface-foreground mb-6">
                    Event Information
                  </h2>
                  <div className="space-y-4">
                    {/* Date */}
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-medium text-surface-foreground">Date</p>
                        <p className="text-surface-muted-foreground text-sm">{eventDate}</p>
                      </div>
                    </div>

                    {/* Venue */}
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-medium text-surface-foreground">Venue</p>
                        <p className="text-surface-muted-foreground text-sm">
                          {siteConfig.address.city}
                          {siteConfig.address.county && `, ${siteConfig.address.county}`}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    {email && (
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </span>
                        <div>
                          <p className="font-medium text-surface-foreground">Email</p>
                          <Link
                            href={`mailto:${email}`}
                            className="text-brand-primary hover:underline text-sm"
                          >
                            {email}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-surface-subtle rounded-lg p-6">
                  <h2 className="text-xl font-bold text-surface-foreground mb-4">Quick Links</h2>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/speakers" className="text-brand-primary hover:underline text-sm">
                        Meet the Speakers
                      </Link>
                    </li>
                    <li>
                      <Link href="/schedule" className="text-brand-primary hover:underline text-sm">
                        View the Schedule
                      </Link>
                    </li>
                    <li>
                      <Link href="/venue" className="text-brand-primary hover:underline text-sm">
                        Venue &amp; Travel Info
                      </Link>
                    </li>
                    <li>
                      <Link href="/sponsors" className="text-brand-primary hover:underline text-sm">
                        Sponsorship Opportunities
                      </Link>
                    </li>
                    <li>
                      <a
                        href={siteConfig.cta.primary.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:underline font-medium text-sm"
                      >
                        {siteConfig.cta.primary.label} &rarr;
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
