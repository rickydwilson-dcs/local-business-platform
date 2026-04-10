'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const STATS = [
  { value: '47', label: 'sites deployed' },
  { value: '9', label: 'years established' },
  { value: '23', label: 'active clients' },
  { value: 'v2.6', label: 'platform version' },
];

const VALUES = [
  {
    title: 'PRECISION',
    description:
      'We ship what we scope. No feature creep, no hidden costs, no surprises at invoice.',
  },
  {
    title: 'VELOCITY',
    description:
      'New sites go live in days. Fixes ship same day. Fast iteration without cutting corners.',
  },
  {
    title: 'INTELLIGENCE',
    description: 'AI automation woven into every workflow — not bolted on as a quarterly update.',
  },
];

function PillNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-3 rounded-full bg-white/80 backdrop-blur-md"
        style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)' }}
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="font-bold text-[#0D0D0D] tracking-tight mr-2"
          style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
        >
          DCS
        </Link>
        <div className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-surface-secondary hover:text-surface-foreground transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          href="/contact"
          className="hidden md:inline-flex items-center gap-1.5 bg-[#2563EB] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#1D4ED8] transition-colors duration-150 active:scale-[0.98] ml-2"
        >
          Start a Project
        </Link>
        <button
          className="md:hidden p-1.5 text-surface-secondary"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M3 5h14M3 10h14M3 15h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>
      <div
        className={`fixed inset-0 z-[60] bg-white flex flex-col transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-surface-border">
          <span
            className="font-bold text-[#0D0D0D] tracking-tight text-lg"
            style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
          >
            DCS
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-surface-secondary"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-6 py-8 flex-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-medium text-[#0D0D0D] py-3 border-b border-surface-border hover:text-[#2563EB] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-8">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block w-full text-center bg-[#2563EB] text-white font-semibold py-4 rounded-full"
          >
            Start a Project
          </Link>
        </div>
      </div>
    </>
  );
}

export default function AboutPage() {
  return (
    <>
      <PillNav />

      {/* Page hero */}
      <section className="pt-36 pb-16 bg-[#FAFAFA]">
        <div className="container-standard">
          <span className="eyebrow mb-4 block">EST. 2015</span>
          <h1 className="heading-hero">About DCS</h1>
        </div>
      </section>

      {/* Story + stats */}
      <section className="bg-[#FAFAFA] pb-24">
        <div className="container-standard">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-16 items-start">
            {/* Story */}
            <div className="space-y-6">
              <p className="text-lg text-surface-secondary leading-relaxed">
                Digital Consulting Services was founded in 2015 with one goal: help local businesses
                compete online without the overhead of agency retainers or bespoke CMS headaches.
              </p>
              <p className="text-lg text-surface-secondary leading-relaxed">
                In 2024 we rebuilt from the ground up — replacing WordPress with a managed Next.js
                platform and integrating AI automation into everything from content generation to
                client reporting. The result is a platform that costs less to run, ships faster, and
                breaks less.
              </p>
              <p className="text-lg text-surface-secondary leading-relaxed">
                Today we manage 47 live sites across the UK. We deploy new sites in days not months,
                and our clients spend time on their business rather than chasing their web agency.
              </p>
            </div>

            {/* Stats — stacked divide-y rows */}
            <div className="divide-y divide-surface-border">
              {STATS.map((stat) => (
                <div key={stat.label} className="py-5 flex items-center justify-between">
                  <span className="text-sm text-surface-secondary">{stat.label}</span>
                  <span
                    className="text-2xl font-bold text-[#0D0D0D] tracking-tight"
                    style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values — horizontal divide-x strip */}
      <section className="bg-surface-muted border-y border-surface-border py-16">
        <div className="container-standard">
          <span className="eyebrow mb-8 block">/// VALUES</span>
          <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-surface-border gap-8 md:gap-0">
            {VALUES.map((v) => (
              <div key={v.title} className="md:px-8 first:md:pl-0 last:md:pr-0">
                <div
                  className="text-xs font-bold tracking-widest text-[#0D0D0D] mb-3"
                  style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
                >
                  {v.title}
                </div>
                <p className="text-sm text-surface-secondary leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-24 bg-[#0D0D0D]">
        <div className="container-standard text-center">
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-4"
            style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
          >
            Work with a platform team
          </h2>
          <p className="text-surface-secondary mb-8 max-w-md mx-auto">
            Not a project shop. We manage your site for the long term.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-surface-background text-[#0D0D0D] font-semibold px-8 py-4 rounded-full hover:bg-surface-muted transition-colors active:scale-[0.98]"
          >
            Get in touch
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0D0D] border-t border-white/5">
        <div className="container-standard py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div
                className="text-white font-bold text-xl mb-3 tracking-tight"
                style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
              >
                DCS
              </div>
              <p className="text-surface-secondary text-sm leading-relaxed max-w-[28ch]">
                Websites as intelligent as your business
              </p>
            </div>
            <div>
              <div className="text-surface-secondary text-xs font-semibold tracking-widest uppercase mb-4">
                Company
              </div>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-surface-secondary text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-surface-secondary text-xs font-semibold tracking-widest uppercase mb-4">
                Contact
              </div>
              <ul className="space-y-2 text-sm text-surface-secondary">
                <li>hello@digitalconsultingservices.co.uk</li>
                <li>United Kingdom</li>
                <li className="flex items-center gap-2 mt-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success inline-block" />
                  <span>Open to new projects</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-12 pt-6">
            <p className="text-surface-secondary text-xs">
              &copy; 2015 Digital Consulting Services Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
